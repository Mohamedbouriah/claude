// Configuration : lecture du .env (sans dependance) + valeurs par defaut.
import { readFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function chargerEnv() {
  const chemin = resolve(ROOT, '.env');
  if (!existsSync(chemin)) return;
  for (const ligne of readFileSync(chemin, 'utf8').split('\n')) {
    const nette = ligne.trim();
    if (!nette || nette.startsWith('#')) continue;
    const i = nette.indexOf('=');
    if (i === -1) continue;
    const cle = nette.slice(0, i).trim();
    let valeur = nette.slice(i + 1).trim();
    if ((valeur.startsWith('"') && valeur.endsWith('"')) || (valeur.startsWith("'") && valeur.endsWith("'"))) {
      valeur = valeur.slice(1, -1);
    }
    if (process.env[cle] === undefined) process.env[cle] = valeur;
  }
}
chargerEnv();

const nombre = (v, def) => (v === undefined || v === '' || Number.isNaN(Number(v)) ? def : Number(v));

export const config = {
  port: nombre(process.env.PORT, 3000),
  host: process.env.HOST || '0.0.0.0',
  urlPublique: process.env.PUBLIC_URL || '',

  // Canal WhatsApp : 'cloudapi' (officiel Meta) ou 'mock' (simulateur local)
  canal: process.env.WHATSAPP_CHANNEL || 'mock',
  wa: {
    versionApi: process.env.WA_API_VERSION || 'v21.0',
    phoneNumberId: process.env.WA_PHONE_NUMBER_ID || '',
    token: process.env.WA_TOKEN || '',
    verifyToken: process.env.WA_VERIFY_TOKEN || 'closerIA',
    appSecret: process.env.WA_APP_SECRET || '',
  },

  // Cerveau
  anthropic: {
    cle: process.env.ANTHROPIC_API_KEY || '',
    baseUrl: process.env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com',
    modele: process.env.CLAUDE_MODEL || 'claude-sonnet-5',
    maxTokens: nombre(process.env.CLAUDE_MAX_TOKENS, 2000),
  },

  // Comportement de l'agent
  agent: {
    // On attend que le prospect ait fini d'ecrire avant de repondre (rafales de messages).
    debounceMs: nombre(process.env.AGENT_DEBOUNCE_MS, 6000),
    // Delai "humain" avant l'envoi d'une reponse.
    delaiMinMs: nombre(process.env.AGENT_DELAI_MIN_MS, 1500),
    delaiMaxMs: nombre(process.env.AGENT_DELAI_MAX_MS, 4000),
    // Historique injecte dans le contexte.
    historique: nombre(process.env.AGENT_HISTORIQUE, 40),
    // Nombre max de messages consecutifs envoyes par l'IA sans reponse du prospect.
    maxRelances: nombre(process.env.AGENT_MAX_RELANCES, 4),
    // Plage horaire d'envoi des relances (heure locale du serveur). Hors plage, on reporte.
    heureDebut: nombre(process.env.AGENT_HEURE_DEBUT, 8),
    heureFin: nombre(process.env.AGENT_HEURE_FIN, 22),
  },

  // Contexte business injecte dans le prompt
  business: {
    nom: process.env.BUSINESS_NAME || 'Ton offre',
    prenomAgent: process.env.AGENT_PRENOM || 'Lea',
    offre: process.env.BUSINESS_OFFRE || '',
    lienRdv: process.env.BOOKING_URL || '',
  },

  dashboard: {
    token: process.env.DASHBOARD_TOKEN || '',
  },

  cheminData: process.env.DATA_DIR || resolve(ROOT, 'data'),
  cheminMedia: process.env.MEDIA_DIR || resolve(ROOT, 'media'),
};

export default config;
