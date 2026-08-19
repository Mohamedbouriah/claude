// Selection du canal actif. Ajouter un canal = ajouter un module exposant
// envoyerTexte / envoyerMedia / marquerLu / urlMediaEntrant.
import config from '../config.js';
import * as cloudapi from './cloudapi.js';
import * as mock from './mock.js';

const canaux = { cloudapi, mock };

export function canal() {
  const c = canaux[config.canal];
  if (!c) throw new Error(`Canal inconnu : ${config.canal} (attendu : ${Object.keys(canaux).join(', ')})`);
  return c;
}

export default canal;
