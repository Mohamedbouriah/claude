// Canal simulateur : tout fonctionne en local, sans compte Meta.
// Les messages sortants sont juste journalises et renvoyes au dashboard.
export const nom = 'mock';

let compteur = 0;
const id = () => `mock.${Date.now()}.${++compteur}`;

export async function envoyerTexte(destinataire, texte) {
  console.log(`[mock] -> ${destinataire} : ${texte}`);
  return id();
}

export async function envoyerMedia(destinataire, { type, url, legende }) {
  console.log(`[mock] -> ${destinataire} : [${type}] ${url}${legende ? ` — ${legende}` : ''}`);
  return id();
}

export async function marquerLu() {}
export async function urlMediaEntrant() { return null; }
