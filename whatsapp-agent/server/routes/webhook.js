// Webhook WhatsApp Cloud API : verification (GET) + reception des evenements (POST).
import { createHmac, timingSafeEqual } from 'node:crypto';
import config from '../config.js';
import { trouverOuCreerConversation, ajouterMessage, majStatutMessage, getConversation } from '../db.js';
import { diffuser } from '../bus.js';
import { planifierReponse } from '../agent/brain.js';
import canal from '../channels/index.js';
import { lireCorps, texte } from '../http-utils.js';

function signatureValide(brut, entete) {
  if (!config.wa.appSecret) return true; // pas de secret configure : on ne bloque pas (dev)
  if (!entete?.startsWith('sha256=')) return false;
  const attendu = createHmac('sha256', config.wa.appSecret).update(brut).digest('hex');
  const recu = entete.slice(7);
  const a = Buffer.from(attendu, 'hex');
  const b = Buffer.from(recu, 'hex');
  return a.length === b.length && timingSafeEqual(a, b);
}

function contenuLisible(message) {
  switch (message.type) {
    case 'text': return { type: 'text', contenu: message.text?.body || '' };
    case 'button': return { type: 'text', contenu: message.button?.text || '' };
    case 'interactive': return {
      type: 'text',
      contenu: message.interactive?.button_reply?.title || message.interactive?.list_reply?.title || '',
    };
    case 'image': return { type: 'image', contenu: message.image?.caption || '' };
    case 'video': return { type: 'video', contenu: message.video?.caption || '' };
    case 'audio': return { type: 'audio', contenu: '' };
    case 'document': return { type: 'document', contenu: message.document?.filename || '' };
    case 'location': return { type: 'text', contenu: `[localisation partagee] ${message.location?.name || ''}` };
    default: return { type: 'text', contenu: `[${message.type}]` };
  }
}

// Traitement commun (utilise aussi par le simulateur).
export function traiterMessageEntrant({ waId, nom, type, contenu, waMessageId, canalNom }) {
  const conv = trouverOuCreerConversation({ canal: canalNom || config.canal, waId, nom });
  const msg = ajouterMessage({
    conversationId: conv.id, sens: 'in', auteur: 'prospect',
    type, contenu, waMessageId, statut: 'lu',
  });
  diffuser('message', { conversationId: conv.id, message: msg });
  diffuser('conversation', { conversation: getConversation(conv.id) });
  if (getConversation(conv.id).mode === 'ia') planifierReponse(conv.id);
  return conv;
}

export async function gererWebhook(req, res, url) {
  if (req.method === 'GET') {
    const mode = url.searchParams.get('hub.mode');
    const jeton = url.searchParams.get('hub.verify_token');
    const defi = url.searchParams.get('hub.challenge');
    if (mode === 'subscribe' && jeton === config.wa.verifyToken) return texte(res, 200, defi || '');
    return texte(res, 403, 'Verification refusee');
  }

  if (req.method !== 'POST') return texte(res, 405, 'Methode non autorisee');

  const brut = await lireCorps(req);
  if (!signatureValide(brut, req.headers['x-hub-signature-256'])) {
    console.warn('[webhook] signature invalide');
    return texte(res, 401, 'Signature invalide');
  }

  // On accuse reception tout de suite : Meta reessaie si on tarde.
  texte(res, 200, 'EVENT_RECEIVED');

  let charge;
  try { charge = JSON.parse(brut.toString('utf8')); } catch { return; }

  for (const entree of charge.entry || []) {
    for (const changement of entree.changes || []) {
      const valeur = changement.value || {};
      const contacts = valeur.contacts || [];

      for (const message of valeur.messages || []) {
        const contact = contacts.find((c) => c.wa_id === message.from) || contacts[0];
        const { type, contenu } = contenuLisible(message);
        traiterMessageEntrant({
          waId: message.from,
          nom: contact?.profile?.name || null,
          type, contenu,
          waMessageId: message.id,
          canalNom: 'cloudapi',
        });
        canal().marquerLu(message.id).catch(() => {});
      }

      for (const statut of valeur.statuses || []) {
        const table = { sent: 'envoye', delivered: 'delivre', read: 'lu', failed: 'echec' };
        majStatutMessage(statut.id, table[statut.status] || statut.status);
        diffuser('statut', { waMessageId: statut.id, statut: table[statut.status] || statut.status });
      }
    }
  }
}
