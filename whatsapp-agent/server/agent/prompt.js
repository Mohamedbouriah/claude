// Assemblage du prompt systeme : persona (editable) + contexte business + medias + etat du lead.
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import config from '../config.js';
import { catalogueTexte } from '../media.js';

const ici = dirname(fileURLToPath(import.meta.url));

export function chargerPersona() {
  const brut = readFileSync(resolve(ici, 'persona.md'), 'utf8');
  return brut
    .replaceAll('{{PRENOM}}', config.business.prenomAgent)
    .replaceAll('{{BUSINESS}}', config.business.nom);
}

export function construirePrompt(conv, { contexteRelance = null } = {}) {
  let qualif = {};
  try { qualif = JSON.parse(conv.qualification || '{}'); } catch { qualif = {}; }

  const blocs = [
    chargerPersona(),
    `\n## Contexte de l'offre\n${config.business.offre || '(non renseigne — reste general et ne t\'avance sur aucun detail)'}`,
    config.business.lienRdv ? `\nLien de reservation : ${config.business.lienRdv}` : '',
    `\n## Medias disponibles\n${catalogueTexte()}`,
    `\n## Etat de ce prospect
- Nom : ${conv.nom || 'inconnu'}
- Numero : ${conv.wa_id}
- Etape : ${conv.etape}
- Score : ${conv.score}/100
- Infos deja collectees : ${Object.keys(qualif).length ? JSON.stringify(qualif, null, 2) : 'aucune'}
- Note interne : ${conv.note_interne || 'aucune'}
- Messages envoyes sans reponse : ${conv.relances_envoyees}`,
    `\n## Regles de sortie
- Tu reponds uniquement le texte du message WhatsApp a envoyer. Rien d'autre.
- Pour envoyer deux messages a la suite, separe-les par une ligne contenant seulement ---
- Trois messages maximum d'un coup, et seulement si c'est naturel.
- Ne prefixe jamais ta reponse par ton nom ni par "Message :".`,
  ];

  if (contexteRelance) {
    blocs.push(`\n## Tu es en train de relancer
La personne n'a pas repondu. Consigne pour cette relance : ${contexteRelance}
Fais court, une seule phrase ou deux, apporte un element neuf (une question, une
preuve, un creneau), ne repete pas ton message precedent, ne culpabilise pas.
Si c'est ta ${config.agent.maxRelances}e relance sans reponse, cloture proprement
et laisse la porte ouverte.`);
  }

  return blocs.filter(Boolean).join('\n');
}
