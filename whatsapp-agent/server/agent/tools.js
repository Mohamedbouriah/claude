// Outils que le cerveau peut appeler pendant une conversation.
import config from '../config.js';
import { majConversation, fusionnerQualification, planifierRelance, annulerRelances, getConversation } from '../db.js';
import { diffuser } from '../bus.js';
import { envoyerAsset, journaliserEvenement } from '../envoi.js';
import { chargerBibliotheque } from '../media.js';

export const definitions = [
  {
    name: 'qualifier_prospect',
    description: "Enregistre ce que tu viens d'apprendre sur le prospect (situation, blocage, objectif, budget, delai, decisionnaire...). A appeler des qu'une information utile sort, sans attendre la fin de la conversation.",
    input_schema: {
      type: 'object',
      properties: {
        infos: { type: 'object', description: 'Paires cle/valeur libres. Ex : {"activite":"coach sportif","ca_mensuel":"12k","blocage":"pas de setter"}' },
        score: { type: 'integer', description: "Qualite du lead de 0 a 100 selon l'adequation avec l'offre." },
        etape: { type: 'string', enum: ['nouveau', 'en_cours', 'qualifie', 'rdv_pris', 'no_show', 'client', 'perdu'] },
        note: { type: 'string', description: "Note courte pour l'humain qui reprendra la conversation." },
      },
      required: ['infos'],
    },
  },
  {
    name: 'envoyer_media',
    description: "Envoie un media de la bibliotheque (video de vente, temoignages, etude de cas). Utilise la cle exacte du catalogue.",
    input_schema: {
      type: 'object',
      properties: {
        cle: { type: 'string', description: 'Cle du media dans le catalogue.' },
        legende: { type: 'string', description: 'Message qui accompagne le media. Optionnel : la legende par defaut est utilisee sinon.' },
      },
      required: ['cle'],
    },
  },
  {
    name: 'proposer_rendez_vous',
    description: "Recupere le lien de reservation a transmettre au prospect. A utiliser seulement une fois le diagnostic fait.",
    input_schema: { type: 'object', properties: {}, },
  },
  {
    name: 'marquer_rdv_pris',
    description: "Marque le rendez-vous comme confirme par le prospect. Programme automatiquement les rappels avant l'appel.",
    input_schema: {
      type: 'object',
      properties: {
        quand: { type: 'string', description: "Date et heure convenues, en clair. Ex : 'jeudi 14h'." },
        dans_heures: { type: 'number', description: "Nombre d'heures entre maintenant et l'appel, si tu peux l'estimer." },
      },
      required: ['quand'],
    },
  },
  {
    name: 'programmer_relance',
    description: "Programme un message de relance automatique si le prospect ne repond pas ou a demande a etre recontacte plus tard.",
    input_schema: {
      type: 'object',
      properties: {
        dans_minutes: { type: 'integer', description: 'Delai avant la relance, en minutes.' },
        instruction: { type: 'string', description: "Ce que devra dire la relance. Ex : 'lui redemander s'il a pu regarder la video'." },
      },
      required: ['dans_minutes', 'instruction'],
    },
  },
  {
    name: 'passer_a_humain',
    description: "Met la conversation en attente d'un humain et arrete l'IA sur ce fil. A utiliser si on te demande si tu es un bot, en cas de litige, de demande de remboursement, d'agressivite, ou de situation hors de ton perimetre.",
    input_schema: {
      type: 'object',
      properties: { raison: { type: 'string', description: "Pourquoi tu passes la main, en une phrase." } },
      required: ['raison'],
    },
  },
];

// Quand l'IA passe la main elle-meme, on l'autorise a envoyer un dernier message
// de transition avant de se taire. Le drapeau est consomme par le cerveau.
const escalades = new Set();
export const consommerEscalade = (id) => escalades.delete(id);

export async function executer(nom, entree, conversationId) {
  switch (nom) {
    case 'qualifier_prospect': {
      if (entree.infos && typeof entree.infos === 'object') fusionnerQualification(conversationId, entree.infos);
      const champs = {};
      if (Number.isFinite(entree.score)) champs.score = Math.max(0, Math.min(100, Math.round(entree.score)));
      if (entree.etape) champs.etape = entree.etape;
      if (entree.note) champs.note_interne = entree.note;
      if (Object.keys(champs).length) majConversation(conversationId, champs);
      diffuser('conversation', { conversation: getConversation(conversationId) });
      return 'Enregistre.';
    }

    case 'envoyer_media': {
      const dispo = chargerBibliotheque().map((a) => a.cle);
      if (!dispo.includes(entree.cle)) {
        return `Media "${entree.cle}" introuvable. Disponibles : ${dispo.join(', ') || 'aucun'}.`;
      }
      await envoyerAsset(conversationId, entree.cle, entree.legende || null, 'ia');
      return `Media "${entree.cle}" envoye au prospect. Enchaine avec une question, ne reste pas silencieux.`;
    }

    case 'proposer_rendez_vous': {
      if (!config.business.lienRdv) return "Aucun lien de reservation configure : propose deux creneaux a l'oral et fais confirmer.";
      return `Lien a transmettre : ${config.business.lienRdv}`;
    }

    case 'marquer_rdv_pris': {
      fusionnerQualification(conversationId, { rdv: entree.quand });
      majConversation(conversationId, { etape: 'rdv_pris' });
      annulerRelances(conversationId);
      const heures = Number(entree.dans_heures);
      if (Number.isFinite(heures) && heures > 2) {
        planifierRelance({ conversationId, dansMinutes: Math.round((heures - 24) * 60), instruction: `Rappel J-1 de l'appel prevu ${entree.quand} : confirmer la presence.` });
        planifierRelance({ conversationId, dansMinutes: Math.round((heures - 1) * 60), instruction: `Rappel 1h avant l'appel prevu ${entree.quand}.` });
      }
      journaliserEvenement(conversationId, `Rendez-vous confirme : ${entree.quand}`);
      diffuser('conversation', { conversation: getConversation(conversationId) });
      return 'Rendez-vous enregistre, rappels programmes.';
    }

    case 'programmer_relance': {
      const du = planifierRelance({ conversationId, dansMinutes: entree.dans_minutes, instruction: entree.instruction });
      diffuser('relance', { conversationId, du });
      return `Relance programmee pour ${du}.`;
    }

    case 'passer_a_humain': {
      escalades.add(conversationId);
      majConversation(conversationId, { mode: 'humain', raison_escalade: entree.raison });
      annulerRelances(conversationId);
      journaliserEvenement(conversationId, `Passage a l'humain demande par l'IA : ${entree.raison}`);
      diffuser('escalade', { conversationId, raison: entree.raison });
      diffuser('conversation', { conversation: getConversation(conversationId) });
      return "Un humain a ete alerte. Ecris un dernier message court pour faire patienter la personne, puis arrete-toi.";
    }

    default:
      return `Outil inconnu : ${nom}`;
  }
}
