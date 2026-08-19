#!/usr/bin/env node
// Faux endpoint Anthropic pour tester la chaine complete sans consommer de credits.
// Usage : node scripts/faux-claude.js  puis  ANTHROPIC_BASE_URL=http://localhost:4010 npm start
import { createServer } from 'node:http';

const PORT = Number(process.env.FAUX_PORT || 4010);
let appel = 0;

createServer((req, res) => {
  let brut = '';
  req.on('data', (c) => { brut += c; });
  req.on('end', () => {
    appel += 1;
    const corps = JSON.parse(brut || '{}');
    const dernier = corps.messages?.at(-1);
    const aDesResultats = Array.isArray(dernier?.content) && dernier.content.some((b) => b.type === 'tool_result');

    // Le scenario depend du dernier message du prospect, pour pouvoir tester
    // chaque outil depuis le simulateur du dashboard.
    const texteProspect = JSON.stringify(corps.messages || '').toLowerCase();
    const outil = texteProspect.includes('bot')
      ? { name: 'passer_a_humain', input: { raison: "le prospect demande s'il parle a un bot" } }
      : texteProspect.includes('video') || texteProspect.includes('infos')
        ? { name: 'envoyer_media', input: { cle: 'vsl' } }
        : { name: 'qualifier_prospect', input: { infos: { source: 'pub Meta' }, score: 40, etape: 'en_cours' } };

    // Premier tour : on appelle un outil. Second tour : on repond en texte.
    const content = aDesResultats
      ? [{ type: 'text', text: "Ok je vois — tu fais du coaching sportif.\n---\nTu es sur quel volume de leads par semaine en ce moment ?" }]
      : [
          { type: 'text', text: '' },
          { type: 'tool_use', id: `t_${appel}`, name: outil.name, input: outil.input },
        ];

    const reponse = { id: `msg_${appel}`, type: 'message', role: 'assistant', model: corps.model, content, stop_reason: aDesResultats ? 'end_turn' : 'tool_use', usage: { input_tokens: 10, output_tokens: 10 } };
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify(reponse));
  });
}).listen(PORT, () => console.log(`[faux-claude] en ecoute sur http://localhost:${PORT}`));
