// Point de sortie unique : tout message qui part vers WhatsApp passe par ici
// (IA comme humain), pour etre stocke et diffuse au dashboard.
import canal from './channels/index.js';
import { ajouterMessage, getConversation } from './db.js';
import { diffuser } from './bus.js';
import { trouverAsset } from './media.js';

export async function envoyerTexte(conversationId, texte, auteur = 'ia') {
  const conv = getConversation(conversationId);
  if (!conv) throw new Error(`Conversation inconnue : ${conversationId}`);
  let waId = null;
  let statut = 'envoye';
  try {
    waId = await canal().envoyerTexte(conv.wa_id, texte);
  } catch (e) {
    statut = 'echec';
    console.error('[envoi] echec texte :', e.message);
  }
  const msg = ajouterMessage({ conversationId, sens: 'out', auteur, type: 'text', contenu: texte, waMessageId: waId, statut });
  diffuser('message', { conversationId, message: msg });
  return msg;
}

export async function envoyerAsset(conversationId, cle, legende = null, auteur = 'ia') {
  const conv = getConversation(conversationId);
  if (!conv) throw new Error(`Conversation inconnue : ${conversationId}`);
  const asset = trouverAsset(cle);
  if (!asset) throw new Error(`Media inconnu : ${cle}`);
  const texte = legende || asset.legende || '';
  let waId = null;
  let statut = 'envoye';
  try {
    waId = await canal().envoyerMedia(conv.wa_id, {
      type: asset.type, url: asset.url, mediaId: asset.mediaId,
      legende: texte, nomFichier: asset.nomFichier,
    });
  } catch (e) {
    statut = 'echec';
    console.error('[envoi] echec media :', e.message);
  }
  const msg = ajouterMessage({
    conversationId, sens: 'out', auteur, type: asset.type,
    contenu: texte, mediaCle: cle, waMessageId: waId, statut,
  });
  diffuser('message', { conversationId, message: msg });
  return msg;
}

export function journaliserEvenement(conversationId, texte) {
  const msg = ajouterMessage({ conversationId, sens: 'out', auteur: 'systeme', type: 'event', contenu: texte });
  diffuser('message', { conversationId, message: msg });
  return msg;
}

export const attendre = (ms) => new Promise((r) => setTimeout(r, ms));
