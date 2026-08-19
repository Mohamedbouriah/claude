// Cerveau : construit le contexte, appelle Claude, execute les outils, envoie la reponse.
import config from '../config.js';
import { getConversation, listerMessages, majConversation } from '../db.js';
import { diffuser } from '../bus.js';
import { envoyerTexte, attendre } from '../envoi.js';
import { construirePrompt } from './prompt.js';
import { definitions, executer, consommerEscalade } from './tools.js';

const url = () => `${config.anthropic.baseUrl}/v1/messages`;
const enCours = new Set();          // conversations en train d'etre traitees
const minuteurs = new Map();        // debounce par conversation

// --- Historique -> format Messages API -------------------------------------

function construireHistorique(conversationId) {
  const brut = listerMessages(conversationId, config.agent.historique);
  const tours = [];
  for (const m of brut) {
    if (m.type === 'event') continue;
    const role = m.sens === 'in' ? 'user' : 'assistant';
    let texte = m.contenu;
    if (m.type !== 'text') {
      const etiquette = m.sens === 'in' ? `[le prospect a envoye un ${m.type}]` : `[${m.type} envoye : ${m.media_cle || ''}]`;
      texte = texte ? `${etiquette} ${texte}` : etiquette;
    }
    if (m.auteur === 'humain') texte = `[message ecrit par un humain de l'equipe] ${texte}`;
    if (!texte.trim()) continue;
    const dernier = tours.at(-1);
    if (dernier && dernier.role === role) dernier.content += `\n${texte}`;
    else tours.push({ role, content: texte });
  }
  while (tours.length && tours[0].role === 'assistant') tours.shift();
  return tours;
}

// --- Appel API --------------------------------------------------------------

async function appelerClaude(system, messages) {
  if (!config.anthropic.cle) throw new Error('ANTHROPIC_API_KEY absente.');
  const rep = await fetch(url(), {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': config.anthropic.cle,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: config.anthropic.modele,
      max_tokens: config.anthropic.maxTokens,
      system,
      tools: definitions,
      messages,
    }),
  });
  const donnees = await rep.json().catch(() => ({}));
  if (!rep.ok) throw new Error(donnees?.error?.message || `Anthropic HTTP ${rep.status}`);
  return donnees;
}

// --- Boucle outils ----------------------------------------------------------

async function raisonner(conv, { contexteRelance = null } = {}) {
  const system = construirePrompt(conv, { contexteRelance });
  const messages = construireHistorique(conv.id);

  if (!messages.length || messages.at(-1).role === 'assistant') {
    messages.push({
      role: 'user',
      content: contexteRelance
        ? `[systeme] Le prospect n'a pas repondu. Ecris maintenant le message de relance. Consigne : ${contexteRelance}`
        : `[systeme] A toi d'ouvrir la conversation.`,
    });
  }

  let texteFinal = '';
  for (let tour = 0; tour < 6; tour++) {
    const reponse = await appelerClaude(system, messages);
    const blocsTexte = (reponse.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('\n').trim();
    const appels = (reponse.content || []).filter((b) => b.type === 'tool_use');

    if (!appels.length) { texteFinal = blocsTexte; break; }

    messages.push({ role: 'assistant', content: reponse.content });
    const resultats = [];
    for (const appel of appels) {
      let resultat;
      try { resultat = await executer(appel.name, appel.input || {}, conv.id); }
      catch (e) { resultat = `Erreur : ${e.message}`; }
      resultats.push({ type: 'tool_result', tool_use_id: appel.id, content: String(resultat) });
    }
    messages.push({ role: 'user', content: resultats });
    texteFinal = blocsTexte;
  }
  return texteFinal;
}

// --- Decoupage en messages WhatsApp ----------------------------------------

function decouper(texte) {
  return texte
    .split(/^\s*-{3,}\s*$/m)
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 3);
}

const delaiHumain = () => {
  const { delaiMinMs: min, delaiMaxMs: max } = config.agent;
  return min + Math.random() * Math.max(0, max - min);
};

// --- Entree principale ------------------------------------------------------

export async function repondre(conversationId, { contexteRelance = null } = {}) {
  if (enCours.has(conversationId)) return;
  const conv = getConversation(conversationId);
  if (!conv) return;
  if (conv.mode !== 'ia') return; // l'humain a la main : l'IA se tait

  enCours.add(conversationId);
  diffuser('ia_reflechit', { conversationId, actif: true });
  try {
    const texte = await raisonner(conv, { contexteRelance });
    if (!texte) return;
    // Si l'IA a passe la main elle-meme, elle a droit a un dernier message de transition.
    const escaladeCeTour = consommerEscalade(conversationId);
    const morceaux = decouper(texte);
    for (const [rang, morceau] of morceaux.entries()) {
      await attendre(delaiHumain());
      // L'humain a pu reprendre la main pendant la reflexion : dans ce cas l'IA se tait.
      const enIA = getConversation(conversationId)?.mode === 'ia';
      if (!enIA && !(escaladeCeTour && rang === 0)) break;
      await envoyerTexte(conversationId, morceau, 'ia');
    }
    const apres = getConversation(conversationId);
    if (apres) majConversation(conversationId, { relances_envoyees: apres.relances_envoyees + 1 });
    diffuser('conversation', { conversation: getConversation(conversationId) });
  } catch (e) {
    console.error('[cerveau] erreur :', e.message);
    diffuser('erreur', { conversationId, message: e.message });
  } finally {
    enCours.delete(conversationId);
    diffuser('ia_reflechit', { conversationId, actif: false });
  }
}

// Le prospect ecrit souvent en rafale : on attend qu'il ait fini.
export function planifierReponse(conversationId) {
  clearTimeout(minuteurs.get(conversationId));
  minuteurs.set(conversationId, setTimeout(() => {
    minuteurs.delete(conversationId);
    repondre(conversationId).catch((e) => console.error('[cerveau]', e));
  }, config.agent.debounceMs));
}

export function annulerReponse(conversationId) {
  clearTimeout(minuteurs.get(conversationId));
  minuteurs.delete(conversationId);
}
