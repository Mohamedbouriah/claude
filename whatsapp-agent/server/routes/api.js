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
import { lireReglages, ecrireReglages, miseEnRoute } from '../reglages.js';
import { chargerPersona, ecrirePersona } from '../agent/prompt.js';
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

  // GET /api/miseenroute — l'etat de la checklist de demarrage
  if (req.method === 'GET' && chemin === '/miseenroute') {
    return json(res, 200, miseEnRoute());
  }

  // GET /api/reglages | PUT /api/reglages
  if (chemin === '/reglages') {
    if (req.method === 'GET') return json(res, 200, { reglages: lireReglages(), miseEnRoute: miseEnRoute() });
    if (req.method === 'PUT') {
      const corps = await lireJson(req);
      const actuels = lireReglages();
      const fusion = {
        ...actuels, ...corps,
        business: { ...actuels.business, ...(corps.business || {}) },
        voix: { ...actuels.voix, ...(corps.voix || {}) },
        wa: { ...actuels.wa, ...(corps.wa || {}) },
      };
      ecrireReglages(fusion);
      return json(res, 200, { reglages: fusion, miseEnRoute: miseEnRoute() });
    }
  }

  // GET /api/persona | PUT /api/persona
  if (chemin === '/persona') {
    if (req.method === 'GET') return json(res, 200, { persona: chargerPersona({ brut: true }) });
    if (req.method === 'PUT') {
      const { persona } = await lireJson(req);
      if (typeof persona !== 'string' || !persona.trim()) return json(res, 400, { erreur: 'persona requis' });
      ecrirePersona(persona);
      return json(res, 200, { ok: true });
    }
  }

  // POST /api/verifier — teste une connexion avant de se lancer
  if (req.method === 'POST' && chemin === '/verifier') {
    const { quoi } = await lireJson(req);
    if (quoi === 'ia') {
      if (!config.anthropic.cle) return json(res, 200, { ok: false, message: 'ANTHROPIC_API_KEY absente du .env' });
      try {
        const rep = await fetch(`${config.anthropic.baseUrl}/v1/messages`, {
          method: 'POST',
          headers: { 'content-type': 'application/json', 'x-api-key': config.anthropic.cle, 'anthropic-version': '2023-06-01' },
          body: JSON.stringify({ model: config.anthropic.modele, max_tokens: 8, messages: [{ role: 'user', content: 'ping' }] }),
        });
        if (rep.ok) return json(res, 200, { ok: true, message: `Cerveau joignable (${config.anthropic.modele}).` });
        const d = await rep.json().catch(() => ({}));
        return json(res, 200, { ok: false, message: d?.error?.message || `HTTP ${rep.status}` });
      } catch (e) { return json(res, 200, { ok: false, message: e.message }); }
    }
    if (quoi === 'whatsapp') {
      if (!config.wa.token || !config.wa.phoneNumberId) return json(res, 200, { ok: false, message: 'Identifiants WhatsApp incomplets.' });
      try {
        const rep = await fetch(`https://graph.facebook.com/${config.wa.versionApi}/${config.wa.phoneNumberId}?fields=display_phone_number,verified_name,quality_rating`, {
          headers: { Authorization: `Bearer ${config.wa.token}` },
        });
        const d = await rep.json().catch(() => ({}));
        if (rep.ok) return json(res, 200, { ok: true, message: `Connecté : ${d.verified_name || ''} ${d.display_phone_number || ''}`.trim(), numero: d });
        return json(res, 200, { ok: false, message: d?.error?.message || `HTTP ${rep.status}` });
      } catch (e) { return json(res, 200, { ok: false, message: e.message }); }
    }
    return json(res, 400, { erreur: "quoi doit valoir 'ia' ou 'whatsapp'" });
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
    const r = lireReglages();
    if (!r.premierTestFait) ecrireReglages({ ...r, premierTestFait: true });
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
