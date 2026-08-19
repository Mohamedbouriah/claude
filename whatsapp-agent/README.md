# Closer IA — agent WhatsApp supervisé

Un setter/closer IA branché sur WhatsApp : il répond aux prospects en quelques
secondes 24/7, envoie les vidéos au bon moment, qualifie, relance, prend les
rendez-vous — et tu vois **tout en temps réel** dans une console où tu peux
reprendre la main à n'importe quel moment.

C'est la brique produit de ce qui est décrit dans la VSL CloseMate : boucher les
trois fuites (booking, show-up, closing) en supprimant le délai entre le moment
où le prospect lève la main et le moment où quelqu'un lui parle.

```
WhatsApp ──webhook──► serveur ──► cerveau Claude (outils) ──► réponse WhatsApp
                         │                                          ▲
                         └────► SQLite + SSE ────► console live ────┘
                                                  (reprise en main)
```

## Ce que ça fait

| Fuite | Ce que fait l'agent |
|---|---|
| **Booking** — le lead refroidit avant qu'on le rappelle | Répond en < 30 s, jour et nuit, qualifie en conversation et pose le RDV |
| **Show-up** — 30 % ne viennent pas | Rappels J-1 et H-1 programmés automatiquement à la confirmation du RDV |
| **Closing** — le prospect arrive froid | Envoie VSL / témoignages / étude de cas au bon moment, note tout ce qu'il apprend dans la fiche que le closer lit avant l'appel |

Et côté supervision :

- **Console temps réel** (SSE) : chaque message entrant/sortant s'affiche à l'instant.
- **Reprise en main** : tu écris dans le fil → l'IA se met en pause sur cette
  conversation et les relances programmées sont annulées. Un interrupteur permet
  de lui rendre la main.
- **Escalade automatique** : l'IA passe la main toute seule si on lui demande si
  c'est un bot, en cas de litige, d'agressivité ou de cas hors périmètre.
- **Fiche prospect vivante** : étape, score, qualification collectée par l'IA,
  note interne.
- **Relances programmées** avec fenêtre horaire et plafond anti-harcèlement.

## Démarrage en 2 minutes (sans compte WhatsApp)

```bash
cd whatsapp-agent
cp .env.example .env          # renseigne au minimum ANTHROPIC_API_KEY
npm start                     # WHATSAPP_CHANNEL=mock par défaut
```

Ouvre http://localhost:3000, puis dans le panneau **Simulateur** (à droite),
envoie un message comme si tu étais un prospect. L'IA répond dans le fil, en
direct. Rien n'est envoyé sur WhatsApp en mode `mock`.

En ligne de commande :

```bash
node scripts/simulate.js 33612345678 "Marc" "Salut, jai vu ta pub, cest quoi le prix ?"
```

Pour tester toute la chaîne **sans consommer de crédits API** :

```bash
node scripts/faux-claude.js &                  # faux endpoint Anthropic
ANTHROPIC_API_KEY=test ANTHROPIC_BASE_URL=http://localhost:4010 npm start
```

## Brancher le vrai WhatsApp (Cloud API officielle)

1. Meta for Developers → crée une app **Business** → produit **WhatsApp**.
2. Récupère `Phone number ID` et un **token permanent** (via un System User
   Business, pas le token temporaire de 24 h).
3. Expose le serveur en HTTPS (`ngrok http 3000`, Cloudflare Tunnel, ou un VPS).
4. Dans **WhatsApp → Configuration → Webhook** :
   - URL de rappel : `https://ton-domaine/webhook`
   - Token de vérification : la valeur de `WA_VERIFY_TOKEN`
   - Abonne-toi au champ **messages**.
5. Renseigne le `.env` :

```env
WHATSAPP_CHANNEL=cloudapi
WA_PHONE_NUMBER_ID=...
WA_TOKEN=...
WA_VERIFY_TOKEN=closerIA
WA_APP_SECRET=...        # active la vérification de signature des webhooks
```

### Fenêtre de 24 h et templates

WhatsApp n'autorise les messages libres que dans les **24 h** après le dernier
message du prospect. Au-delà, il faut un *template* pré-approuvé. Concrètement :

- les relances programmées à moins de 24 h passent sans problème ;
- pour rouvrir une conversation plus tard, crée un template dans le Business
  Manager et envoie-le (à ajouter dans `server/channels/cloudapi.js` — la
  fonction `appeler` accepte déjà n'importe quel type de message) ;
- l'ouverture à froid d'un prospect qui ne t'a jamais écrit **exige** un template.

### Un autre canal (numéro perso, Baileys…)

`server/channels/` est un dossier d'adaptateurs. Un canal = un module qui exporte
`envoyerTexte`, `envoyerMedia`, `marquerLu`, `urlMediaEntrant`. Ajoute le tien dans
`server/channels/index.js`. Note que faire tourner un agent sur un numéro
WhatsApp personnel via une bibliothèque non officielle est contraire aux CGU de
Meta et expose le numéro à un bannissement — la Cloud API est le chemin propre.

## Régler l'agent

Trois endroits, dans l'ordre d'importance :

1. **`server/agent/persona.md`** — la personnalité, la trame de conversation, les
   objections, ce qu'il ne fait jamais. C'est du markdown, édite-le librement,
   il est rechargé à chaque message.
2. **`BUSINESS_OFFRE`** dans `.env` — prix, promesse, preuves, pour qui / pour qui
   pas. Tout ce qui n'est pas là, l'agent a interdiction de l'inventer.
3. **`media/library.json`** — la bibliothèque de vidéos et documents. Chaque
   entrée a une `cle` (que l'IA manipule), une `url` publique, une `legende` et
   surtout un champ `quand` qui dit à l'IA dans quelle situation l'envoyer.

```json
{
  "cle": "vsl",
  "type": "video",
  "url": "https://…/vsl.mp4",
  "legende": "Regarde ça tranquillement, 12 min.",
  "description": "Vidéo de vente principale.",
  "quand": "le prospect demande comment ça marche"
}
```

Les URLs doivent être publiquement accessibles (Meta va chercher le fichier).
Limites Meta : vidéo 16 Mo, document 100 Mo, formats `mp4`/`3gp` en vidéo.

## Outils dont dispose l'IA

| Outil | Effet |
|---|---|
| `qualifier_prospect` | Écrit dans la fiche (infos, score, étape, note interne) |
| `envoyer_media` | Envoie un asset de la bibliothèque |
| `proposer_rendez_vous` | Récupère le lien de réservation |
| `marquer_rdv_pris` | Passe l'étape à `rdv_pris` et programme les rappels J-1 / H-1 |
| `programmer_relance` | Planifie une relance datée avec sa consigne |
| `passer_a_humain` | Coupe l'IA sur le fil et alerte la console |

## API

Toutes les routes `/api/*` exigent l'en-tête `x-token` si `DASHBOARD_TOKEN` est défini.

| Méthode | Route | Rôle |
|---|---|---|
| `GET` | `/api/etat` | Config active + statistiques |
| `GET` | `/api/conversations?filtre=&q=` | Liste (filtres : `toutes`, `non_lus`, `humain`, `ia`, `rdv`) |
| `GET` | `/api/conversations/:id` | Fil complet + relances (marque comme lu) |
| `PATCH` | `/api/conversations/:id` | `nom`, `etape`, `score`, `note_interne`, `mode`, `qualification` |
| `POST` | `/api/conversations/:id/message` | Envoi humain (bascule en manuel, sauf `garderIA: true`) |
| `POST` | `/api/conversations/:id/media` | Envoi manuel d'un asset |
| `POST` | `/api/conversations/:id/mode` | `{ "mode": "ia" \| "humain" }` |
| `POST` | `/api/conversations/:id/repondre` | Force une réponse de l'IA maintenant |
| `POST` | `/api/conversations/:id/relance` | `{ "dans_minutes": 60, "instruction": "…" }` |
| `DELETE` | `/api/conversations/:id/relances` | Annule les relances en attente |
| `GET` | `/api/medias` · `PUT` | Lit / remplace la bibliothèque |
| `POST` | `/api/simuler` | Injecte un message entrant (test) |
| `GET` | `/api/stream` | Flux SSE : `message`, `conversation`, `ia_reflechit`, `escalade`, `statut`, `erreur` |
| `GET` | `/webhook` · `POST` | Vérification et réception Meta (hors token dashboard) |

## Choix techniques

- **Zéro dépendance npm.** Node 22+ suffit : `node:sqlite` pour la base, `fetch`
  natif pour les API, SSE pour le temps réel. Rien à compiler, rien à mettre à jour.
- **Debounce de 6 s** avant chaque réponse : un prospect écrit en rafale, l'agent
  attend qu'il ait fini plutôt que de répondre à chaque bout de phrase.
- **Délai humain** de 1,5 à 4 s entre les messages, et découpage en 3 messages max.
- **L'humain gagne toujours** : si quelqu'un écrit dans le fil pendant que l'IA
  réfléchit, l'envoi de l'IA est interrompu.
- **La base est un fichier** (`data/closer.db`). Sauvegarde = copie du fichier.

## Points à traiter avant la production

- Mettre `DASHBOARD_TOKEN` et servir derrière HTTPS (le token circule en clair sinon).
- Renseigner `WA_APP_SECRET` : sans lui, la signature des webhooks n'est pas vérifiée.
- Les notes vocales entrantes sont enregistrées comme `[audio]` sans transcription :
  brancher un STT sur `urlMediaEntrant()` si tes prospects en envoient beaucoup.
- Mention RGPD / information des prospects sur le traitement automatisé, selon
  ton usage.
