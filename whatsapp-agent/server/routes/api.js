// API du dashboard.
import config from '../config.js';
import {
  listerConversations, getConversation, listerMessages, majConversation, marquerLu,
  relancesPlanifiees, planifierRelance, annulerRelances, statistiques, fusionnerQualification,
} from '../db.js';
import { diffuser } from '../bus.js';
import { envoyerTexte, envoyerAsset, journaliserEvenement } from '../envoi.js';
import { repondre, annulerReponse } from '../agent/brain.js';
import { chargerBibliotheque, enregistrerBibliotheque } from '../media.js';
import { traiterMessageEntrant } from './webhook.js';
import { json, lireJson } from '../http-utils.js';

const CHAMPS_MODIFIABLES = ['nom', 'etape', 'score', 'note_interne', 'mode'];

export async function gererApi(req, res, url) {
  const chemin = url.pathname.replace(/^\/api/, '');
  const morceaux = chemin.split('/').filter(Boolean);

  // GET /api/etat
  if (req.method === 'GET' && chemin === '/etat') {
    return json(res, 200, {
      canal: config.canal,
      modele: config.anthropic.modele,
      cleConfiguree: Boolean(config.anthropic.cle),
      business: { nom: config.business.nom, agent: config.business.prenomAgent, lienRdv: config.business.lienRdv },
      stats: statistiques(),
    });
  }

  // GET /api/medias  |  PUT /api/medias
  if (chemin === '/medias') {
    if (req.method === 'GET') return json(res, 200, { medias: chargerBibliotheque() });
    if (req.method === 'PUT') {
      const corps = await lireJson(req);
      if (!Array.isArray(corps.medias)) return json(res, 400, { erreur: 'medias doit etre un tableau' });
      enregistrerBibliotheque(corps.medias);
      return json(res, 200, { medias: chargerBibliotheque() });
    }
  }

  // GET /api/conversations
  if (req.method === 'GET' && chemin === '/conversations') {
    return json(res, 200, {
      conversations: listerConversations({
        filtre: url.searchParams.get('filtre') || 'toutes',
        recherche: url.searchParams.get('q') || '',
      }),
    });
  }

  // POST /api/simuler  — injecte un message entrant (test sans WhatsApp)
  if (req.method === 'POST' && chemin === '/simuler') {
    const { waId = '33600000001', nom = 'Prospect test', texte: contenu = 'Salut' } = await lireJson(req);
    const conv = traiterMessageEntrant({
      waId, nom, type: 'text', contenu,
      waMessageId: `sim.${Date.now()}`, canalNom: config.canal,
    });
    return json(res, 200, { conversationId: conv.id });
  }

  // /api/conversations/:id/...
  if (morceaux[0] === 'conversations' && morceaux[1]) {
    const id = decodeURIComponent(morceaux[1]);
    const action = morceaux[2] || null;
    const conv = getConversation(id);
    if (!conv) return json(res, 404, { erreur: 'Conversation introuvable' });

    if (req.method === 'GET' && !action) {
      marquerLu(id);
      const majConv = getConversation(id);
      diffuser('conversation', { conversation: majConv });
      return json(res, 200, {
        conversation: majConv,
        messages: listerMessages(id),
        relances: relancesPlanifiees(id),
      });
    }

    if (req.method === 'PATCH' && !action) {
      const corps = await lireJson(req);
      const champs = {};
      for (const c of CHAMPS_MODIFIABLES) if (corps[c] !== undefined) champs[c] = corps[c];
      if (corps.qualification && typeof corps.qualification === 'object') fusionnerQualification(id, corps.qualification);
      if (Object.keys(champs).length) majConversation(id, champs);
      const majConv = getConversation(id);
      diffuser('conversation', { conversation: majConv });
      return json(res, 200, { conversation: majConv });
    }

    if (req.method === 'POST' && action === 'message') {
      const { texte: contenu, garderIA = false } = await lireJson(req);
      if (!contenu?.trim()) return json(res, 400, { erreur: 'texte requis' });
      // Un humain qui ecrit reprend la main par defaut : l'IA se tait sur ce fil.
      if (!garderIA && conv.mode !== 'humain') {
        annulerReponse(id);
        annulerRelances(id);
        majConversation(id, { mode: 'humain', raison_escalade: 'Reprise en main manuelle' });
        journaliserEvenement(id, "Reprise en main par un humain — l'IA est en pause sur cette conversation.");
      }
      const msg = await envoyerTexte(id, contenu.trim(), 'humain');
      diffuser('conversation', { conversation: getConversation(id) });
      return json(res, 200, { message: msg });
    }

    if (req.method === 'POST' && action === 'media') {
      const { cle, legende } = await lireJson(req);
      try {
        const msg = await envoyerAsset(id, cle, legende || null, 'humain');
        return json(res, 200, { message: msg });
      } catch (e) { return json(res, 400, { erreur: e.message }); }
    }

    if (req.method === 'POST' && action === 'mode') {
      const { mode } = await lireJson(req);
      if (!['ia', 'humain'].includes(mode)) return json(res, 400, { erreur: "mode doit valoir 'ia' ou 'humain'" });
      if (mode === 'humain') { annulerReponse(id); annulerRelances(id); }
      majConversation(id, { mode, raison_escalade: mode === 'ia' ? null : conv.raison_escalade });
      journaliserEvenement(id, mode === 'ia' ? "L'IA reprend la conversation." : "Conversation mise en manuel.");
      const majConv = getConversation(id);
      diffuser('conversation', { conversation: majConv });
      return json(res, 200, { conversation: majConv });
    }

    if (req.method === 'POST' && action === 'repondre') {
      if (conv.mode !== 'ia') return json(res, 400, { erreur: "La conversation est en mode humain." });
      repondre(id).catch((e) => console.error(e));
      return json(res, 202, { ok: true });
    }

    if (req.method === 'POST' && action === 'relance') {
      const { dans_minutes = 60, instruction = '' } = await lireJson(req);
      const du = planifierRelance({ conversationId: id, dansMinutes: dans_minutes, instruction });
      return json(res, 200, { du });
    }

    if (req.method === 'DELETE' && action === 'relances') {
      annulerRelances(id);
      return json(res, 200, { ok: true });
    }
  }

  return json(res, 404, { erreur: 'Route inconnue' });
}
