// Petites aides HTTP (aucune dependance).
import { readFile } from 'node:fs/promises';
import { extname, resolve, normalize } from 'node:path';

export function json(res, code, donnees) {
  const corps = JSON.stringify(donnees);
  res.writeHead(code, { 'content-type': 'application/json; charset=utf-8', 'content-length': Buffer.byteLength(corps) });
  res.end(corps);
}

export function texte(res, code, contenu, type = 'text/plain; charset=utf-8') {
  res.writeHead(code, { 'content-type': type });
  res.end(contenu);
}

export function lireCorps(req, max = 2_000_000) {
  return new Promise((resoudre, rejeter) => {
    const morceaux = [];
    let taille = 0;
    req.on('data', (c) => {
      taille += c.length;
      if (taille > max) { rejeter(new Error('Corps trop volumineux')); req.destroy(); return; }
      morceaux.push(c);
    });
    req.on('end', () => resoudre(Buffer.concat(morceaux)));
    req.on('error', rejeter);
  });
}

export async function lireJson(req) {
  const brut = await lireCorps(req);
  if (!brut.length) return {};
  try { return JSON.parse(brut.toString('utf8')); } catch { throw new Error('JSON invalide'); }
}

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

export async function servirStatique(res, racine, cheminUrl) {
  const relatif = normalize(decodeURIComponent(cheminUrl)).replace(/^(\.\.[/\\])+/, '');
  const fichier = resolve(racine, relatif === '/' || relatif === '' ? 'index.html' : `.${relatif}`);
  if (!fichier.startsWith(racine)) { texte(res, 403, 'Interdit'); return true; }
  try {
    const contenu = await readFile(fichier);
    res.writeHead(200, { 'content-type': TYPES[extname(fichier)] || 'application/octet-stream', 'cache-control': 'no-cache' });
    res.end(contenu);
    return true;
  } catch {
    return false;
  }
}
