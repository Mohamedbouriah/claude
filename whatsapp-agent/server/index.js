// Serveur HTTP : webhook WhatsApp + API dashboard + flux temps reel (SSE) + statique.
import { createServer } from 'node:http';
import { resolve } from 'node:path';
import config, { ROOT } from './config.js';
import { abonner, nbAbonnes } from './bus.js';
import { gererWebhook } from './routes/webhook.js';
import { gererApi } from './routes/api.js';
import { demarrerPlanificateur } from './scheduler.js';
import { appliquer as appliquerReglages, miseEnRoute } from './reglages.js';
import { json, texte, servirStatique } from './http-utils.js';
import './db.js';

appliquerReglages();  // les reglages de l'interface se superposent au .env

const RACINE_DASHBOARD = resolve(ROOT, 'dashboard');

function autorise(req, url) {
  if (!config.dashboard.token) return true;
  const fourni = req.headers['x-token'] || url.searchParams.get('token');
  return fourni === config.dashboard.token;
}

const serveur = createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  try {
    // Webhook WhatsApp — authentifie par Meta (verify token + signature), pas par le token dashboard.
    if (url.pathname === '/webhook') return await gererWebhook(req, res, url);

    if (url.pathname === '/sante') return json(res, 200, { ok: true, canal: config.canal, abonnes: nbAbonnes() });

    // Flux temps reel
    if (url.pathname === '/api/stream') {
      if (!autorise(req, url)) return json(res, 401, { erreur: 'Token invalide' });
      res.writeHead(200, {
        'content-type': 'text/event-stream',
        'cache-control': 'no-cache, no-transform',
        connection: 'keep-alive',
        'x-accel-buffering': 'no',
      });
      res.write(`event: connecte\ndata: ${JSON.stringify({ at: new Date().toISOString() })}\n\n`);
      const desabonner = abonner(res);
      const battement = setInterval(() => { try { res.write(': ping\n\n'); } catch {} }, 25_000);
      req.on('close', () => { clearInterval(battement); desabonner(); });
      return;
    }

    if (url.pathname.startsWith('/api/')) {
      if (!autorise(req, url)) return json(res, 401, { erreur: 'Token invalide' });
      return await gererApi(req, res, url);
    }

    // Jolie URL pour la mise en route
    if (req.method === 'GET' && (url.pathname === '/bienvenue' || url.pathname === '/bienvenue/')) {
      if (await servirStatique(res, RACINE_DASHBOARD, '/bienvenue.html')) return;
    }

    if (req.method === 'GET' && await servirStatique(res, RACINE_DASHBOARD, url.pathname)) return;

    return texte(res, 404, 'Introuvable');
  } catch (e) {
    console.error('[http]', e);
    if (!res.headersSent) json(res, 500, { erreur: e.message });
  }
});

serveur.listen(config.port, config.host, () => {
  console.log(`\n  Closer IA WhatsApp`);
  console.log(`  ------------------`);
  console.log(`  Dashboard : http://localhost:${config.port}/`);
  console.log(`  Webhook   : ${config.urlPublique || `http://localhost:${config.port}`}/webhook`);
  console.log(`  Canal     : ${config.canal}${config.canal === 'mock' ? ' (simulateur — aucun message reel envoye)' : ''}`);
  console.log(`  Modele    : ${config.anthropic.modele}${config.anthropic.cle ? '' : '  ⚠ ANTHROPIC_API_KEY absente'}`);
  console.log(`  Dashboard protege : ${config.dashboard.token ? 'oui' : 'non (DASHBOARD_TOKEN vide)'}`);
  const mer = miseEnRoute();
  console.log(`  Mise en route     : ${mer.faites}/${mer.total} — ${mer.faites < mer.total ? `a completer sur http://localhost:${config.port}/bienvenue` : 'complete'}\n`);
  demarrerPlanificateur();
});
