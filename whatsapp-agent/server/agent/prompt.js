// Assemblage du prompt systeme : persona (editable) + contexte business + medias + etat du lead.
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import config from '../config.js';
import { catalogueTexte } from '../media.js';

const ici = dirname(fileURLToPath(import.meta.url));

const cheminPersona = () => resolve(ici, 'persona.md');

// brut : true renvoie le markdown tel quel (pour l'edition dans l'interface).
export function chargerPersona({ brut = false } = {}) {
  const texte = readFileSync(cheminPersona(), 'utf8');
  if (brut) return texte;
  return texte
    .replaceAll('{{PRENOM}}', config.business.prenomAgent || 'Lea')
    .replaceAll('{{BUSINESS}}', config.business.nom || 'notre offre');
}

export function ecrirePersona(texte) {
  writeFileSync(cheminPersona(), texte);
}

// Les curseurs regles pendant la mise en route se traduisent en consignes claires.
function consignesDeVoix() {
  const v = config.voix;
  if (!v) return '';
  const adresse = v.adresse === 'vous'
    ? 'Tu vouvoies systematiquement.'
    : "Tu tutoies par defaut, sauf si la personne vouvoie : dans ce cas tu t'alignes sur elle.";
  const insistance = [
    "Tu es tres patient : tu poses une question, tu laisses venir, tu ne pousses jamais vers l'appel avant que la personne en parle d'elle-meme.",
    "Tu es patient : tu prends le temps du diagnostic avant de proposer l'appel.",
    "Tu avances : des que le diagnostic est fait, tu proposes l'appel sans tourner autour.",
    "Tu es direct : tu vas vite au diagnostic, et tu proposes l'appel des que tu as compris la situation.",
  ][Math.max(0, Math.min(3, v.insistance))];
  const longueur = [
    'Tes messages font une ligne, jamais plus.',
    'Tes messages font une a deux lignes.',
    'Tes messages font deux a trois lignes maximum.',
  ][Math.max(0, Math.min(2, v.longueur))];
  return `\n## Ta voix\n- ${adresse}\n- ${insistance}\n- ${longueur}`;
}

export function construirePrompt(conv, { contexteRelance = null } = {}) {
  let qualif = {};
  try { qualif = JSON.parse(conv.qualification || '{}'); } catch { qualif = {}; }

  const blocs = [
    chargerPersona(),
    consignesDeVoix(),
    `\n## Contexte de l'offre\n${config.business.offre || '(non renseigne — reste general et ne t\'avance sur aucun detail)'}`,
    config.business.lienRdv ? `\nLien de reservation : ${config.business.lienRdv}` : '',
    `\n## Medias disponibles\n${catalogueTexte()}`,
    `\n## Etat de ce prospect
- Nom : ${conv.nom || 'inconnu'}
- Numero : ${conv.wa_id}
- Etape : ${conv.etape}
- Score : ${conv.score}/100
- Infos deja collectees : ${Object.keys(qualif).length ? JSON.stringify(qualif, null, 2) : 'aucune'}
- Note interne : ${conv.note_interne || 'aucune'}
- Messages envoyes sans reponse : ${conv.relances_envoyees}`,
    `\n## Regles de sortie
- Tu reponds uniquement le texte du message WhatsApp a envoyer. Rien d'autre.
- Pour envoyer deux messages a la suite, separe-les par une ligne contenant seulement ---
- Trois messages maximum d'un coup, et seulement si c'est naturel.
- Ne prefixe jamais ta reponse par ton nom ni par "Message :".`,
  ];

  if (contexteRelance) {
    blocs.push(`\n## Tu es en train de relancer
La personne n'a pas repondu. Consigne pour cette relance : ${contexteRelance}
Fais court, une seule phrase ou deux, apporte un element neuf (une question, une
preuve, un creneau), ne repete pas ton message precedent, ne culpabilise pas.
Si c'est ta ${config.agent.maxRelances}e relance sans reponse, cloture proprement
et laisse la porte ouverte.`);
  }

  return blocs.filter(Boolean).join('\n');
}
