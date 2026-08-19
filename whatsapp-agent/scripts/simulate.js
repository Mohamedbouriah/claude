#!/usr/bin/env node
// Injecte un message entrant dans le serveur, comme s'il venait de WhatsApp.
// Usage : node scripts/simulate.js "33612345678" "Marc" "Salut, c'est quoi le prix ?"
const [, , numero = '33600000001', nom = 'Prospect test', texte = "Salut, j'ai vu ta pub"] = process.argv;
const base = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;

const entetes = { 'content-type': 'application/json' };
if (process.env.DASHBOARD_TOKEN) entetes['x-token'] = process.env.DASHBOARD_TOKEN;

const rep = await fetch(`${base}/api/simuler`, {
  method: 'POST',
  headers: entetes,
  body: JSON.stringify({ waId: numero, nom, texte }),
});
const donnees = await rep.json().catch(() => ({}));
if (!rep.ok) { console.error('Echec :', donnees.erreur || rep.status); process.exit(1); }
console.log(`Message injecte dans ${donnees.conversationId}`);
console.log(`Ouvre ${base}/ pour voir l'IA repondre en direct.`);
