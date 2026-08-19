// Reglages modifiables depuis l'interface : ils se superposent au .env.
// Le .env reste la source pour les secrets ; ce fichier porte ce que le client
// regle lui-meme pendant la mise en route.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import config from './config.js';

const chemin = () => resolve(config.cheminData, 'reglages.json');

const DEFAUTS = {
  business: { nom: '', prenomAgent: '', offre: '', lienRdv: '' },
  voix: { adresse: 'tu', insistance: 2, longueur: 2 },
  wa: { phoneNumberId: '', token: '', verifyToken: '', appSecret: '' },
  canal: '',
  premierTestFait: false,
};

export function lireReglages() {
  if (!existsSync(chemin())) return structuredClone(DEFAUTS);
  try {
    const brut = JSON.parse(readFileSync(chemin(), 'utf8'));
    return { ...structuredClone(DEFAUTS), ...brut, business: { ...DEFAUTS.business, ...brut.business }, voix: { ...DEFAUTS.voix, ...brut.voix }, wa: { ...DEFAUTS.wa, ...brut.wa } };
  } catch { return structuredClone(DEFAUTS); }
}

export function ecrireReglages(reglages) {
  mkdirSync(config.cheminData, { recursive: true });
  writeFileSync(chemin(), JSON.stringify(reglages, null, 2));
  appliquer(reglages);
  return reglages;
}

// Les reglages non vides ecrasent la config chargee depuis l'environnement.
export function appliquer(reglages = lireReglages()) {
  const poser = (cible, source) => {
    for (const [cle, valeur] of Object.entries(source)) {
      if (valeur !== '' && valeur !== null && valeur !== undefined) cible[cle] = valeur;
    }
  };
  poser(config.business, reglages.business);
  poser(config.wa, reglages.wa);
  if (reglages.canal) config.canal = reglages.canal;
  config.voix = reglages.voix;
  return config;
}

// Etat de la mise en route : ce qui est fait, ce qui reste.
export function miseEnRoute() {
  const r = lireReglages();
  // Les entrees d'exemple livrees avec le projet ne comptent pas comme configurees.
  let mediasReels = 0;
  try {
    const assets = JSON.parse(readFileSync(resolve(config.cheminMedia, 'library.json'), 'utf8'));
    mediasReels = assets.filter((a) => a.url && !a.url.includes('exemple.com')).length;
  } catch {}
  const waPret = config.canal === 'cloudapi' && Boolean(config.wa.token && config.wa.phoneNumberId);
  const etapes = [
    { cle: 'cle_ia', titre: "Connecter le cerveau", fait: Boolean(config.anthropic.cle), aide: "Clé Anthropic dans le .env" },
    { cle: 'offre', titre: "Décrire ton offre", fait: Boolean(config.business.offre && config.business.nom), aide: "Ce que l'agent a le droit de dire" },
    { cle: 'voix', titre: "Régler la voix de l'agent", fait: Boolean(config.business.prenomAgent), aide: "Prénom, ton, longueur des messages" },
    { cle: 'medias', titre: "Ajouter tes vidéos", fait: mediasReels > 0, aide: mediasReels ? `${mediasReels} média(s) prêts` : 'Seulement les exemples pour l\'instant' },
    { cle: 'whatsapp', titre: "Brancher WhatsApp", fait: waPret, aide: config.canal !== 'cloudapi' ? 'Simulateur actif' : waPret ? 'Numéro connecté' : 'Identifiants à compléter' },
    { cle: 'test', titre: "Parler à ton agent", fait: Boolean(r.premierTestFait), aide: "Un aller-retour dans le simulateur" },
  ];
  return { etapes, faites: etapes.filter((e) => e.fait).length, total: etapes.length };
}
