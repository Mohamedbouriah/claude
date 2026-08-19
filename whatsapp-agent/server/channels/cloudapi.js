// Canal officiel : WhatsApp Cloud API (Meta).
import config from '../config.js';

const base = () => `https://graph.facebook.com/${config.wa.versionApi}`;

async function appeler(chemin, corps) {
  if (!config.wa.token || !config.wa.phoneNumberId) {
    throw new Error('WA_TOKEN et WA_PHONE_NUMBER_ID sont requis pour le canal cloudapi.');
  }
  const rep = await fetch(`${base()}/${chemin}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${config.wa.token}` },
    body: JSON.stringify(corps),
  });
  const donnees = await rep.json().catch(() => ({}));
  if (!rep.ok) {
    const msg = donnees?.error?.message || `HTTP ${rep.status}`;
    throw new Error(`WhatsApp Cloud API: ${msg}`);
  }
  return donnees;
}

export const nom = 'cloudapi';

export async function envoyerTexte(destinataire, texte) {
  const r = await appeler(`${config.wa.phoneNumberId}/messages`, {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: destinataire,
    type: 'text',
    text: { preview_url: true, body: texte },
  });
  return r?.messages?.[0]?.id || null;
}

// type : video | image | audio | document
export async function envoyerMedia(destinataire, { type, url, mediaId, legende, nomFichier }) {
  const charge = mediaId ? { id: mediaId } : { link: url };
  if (legende && type !== 'audio') charge.caption = legende;
  if (type === 'document' && nomFichier) charge.filename = nomFichier;
  const r = await appeler(`${config.wa.phoneNumberId}/messages`, {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: destinataire,
    type,
    [type]: charge,
  });
  return r?.messages?.[0]?.id || null;
}

// Accuse de lecture (les coches bleues cote prospect) + indicateur "ecrit...".
export async function marquerLu(waMessageId, avecSaisie = true) {
  const corps = { messaging_product: 'whatsapp', status: 'read', message_id: waMessageId };
  if (avecSaisie) corps.typing_indicator = { type: 'text' };
  try { await appeler(`${config.wa.phoneNumberId}/messages`, corps); } catch { /* non bloquant */ }
}

// URL temporaire d'un media entrant (note vocale, photo envoyee par le prospect).
export async function urlMediaEntrant(mediaId) {
  const rep = await fetch(`${base()}/${mediaId}`, { headers: { Authorization: `Bearer ${config.wa.token}` } });
  if (!rep.ok) return null;
  const d = await rep.json().catch(() => ({}));
  return d?.url || null;
}
