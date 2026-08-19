// Planificateur : declenche les relances arrivees a echeance.
import config from './config.js';
import db, { relancesDues, majRelance, getConversation } from './db.js';
import { repondre } from './agent/brain.js';

const INTERVALLE_MS = 30_000;

function dansLaPlageHoraire(date = new Date()) {
  const h = date.getHours();
  return h >= config.agent.heureDebut && h < config.agent.heureFin;
}

function reporterAProchaineOuverture(relanceId) {
  const d = new Date();
  d.setMinutes(0, 0, 0);
  if (d.getHours() >= config.agent.heureFin) d.setDate(d.getDate() + 1);
  d.setHours(config.agent.heureDebut);
  if (d.getTime() < Date.now()) d.setDate(d.getDate() + 1);
  db.prepare('UPDATE relances SET du_at = ? WHERE id = ?').run(d.toISOString(), relanceId);
}

async function traiter() {
  for (const relance of relancesDues()) {
    const conv = getConversation(relance.conversation_id);
    if (!conv) { majRelance(relance.id, 'annulee'); continue; }
    if (conv.mode !== 'ia') { majRelance(relance.id, 'annulee'); continue; }
    if (conv.relances_envoyees >= config.agent.maxRelances) { majRelance(relance.id, 'annulee'); continue; }
    if (!dansLaPlageHoraire()) { reporterAProchaineOuverture(relance.id); continue; }

    majRelance(relance.id, 'envoyee');
    try {
      await repondre(conv.id, { contexteRelance: relance.instruction });
    } catch (e) {
      console.error('[relances] echec :', e.message);
    }
  }
}

export function demarrerPlanificateur() {
  setInterval(() => { traiter().catch((e) => console.error('[relances]', e)); }, INTERVALLE_MS).unref?.();
  traiter().catch(() => {});
  console.log(`[relances] planificateur actif (fenetre ${config.agent.heureDebut}h-${config.agent.heureFin}h)`);
}
