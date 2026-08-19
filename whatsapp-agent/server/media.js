// Bibliotheque de medias : videos / images / documents que l'IA peut envoyer.
// Chaque asset a une CLE (ce que l'IA manipule) et une description (comment l'IA
// sait quand l'envoyer). Le fichier media/library.json est la source de verite.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import config from './config.js';

const chemin = resolve(config.cheminMedia, 'library.json');

export function chargerBibliotheque() {
  if (!existsSync(chemin)) return [];
  try { return JSON.parse(readFileSync(chemin, 'utf8')); } catch { return []; }
}

export function enregistrerBibliotheque(assets) {
  writeFileSync(chemin, JSON.stringify(assets, null, 2));
}

export const trouverAsset = (cle) => chargerBibliotheque().find((a) => a.cle === cle) || null;

// Resume injecte dans le prompt systeme pour que l'IA sache quoi envoyer, et quand.
export function catalogueTexte() {
  const assets = chargerBibliotheque();
  if (!assets.length) return 'Aucun media disponible.';
  return assets
    .map((a) => `- cle "${a.cle}" (${a.type}) : ${a.description}${a.quand ? ` — a envoyer quand : ${a.quand}` : ''}`)
    .join('\n');
}
