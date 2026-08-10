# cc_miner — mineur de Cerveau Cible depuis YouTube

Reconstruction du logiciel décrit : **on part d'une requête SEO que la cible taperait
elle-même**, on récupère les vidéos, leurs transcriptions et leurs commentaires, et on
en extrait la matière du Cerveau Cible — quand on ne l'a pas déjà.

Il alimente le **pré-requis n°1** de `ads-intelligence` :
> RÈGLE ABSOLUE (`FRAMEWORK_ADS.md` l.60) — si tu n'as pas identifié au moins
> **3 dialogues intérieurs Phase 1B**, tu n'es pas prêt à écrire les ads.

---

## Pourquoi YouTube, et pourquoi les commentaires surtout

`FRAMEWORK_ADS.md` l.49 dit où vit la Phase 1B :
> « dans les verbatims les plus émotionnels, les plus longs, ceux où la personne craque
> et dit ce qu'elle pense vraiment. **Avis 1 étoile. Posts de forums nocturnes.**
> La phrase qui fait physiquement MAL quand on la lit. »

Un commentaire YouTube coche exactement ces cases : **semi-anonyme**, souvent **nocturne**,
écrit à un inconnu qu'on ne recroisera pas. C'est structurellement un lieu de confession —
donc du 1B — là où un avis Google ou un post LinkedIn est du 1A (public, sous son nom).

La **transcription**, elle, donne le vocabulaire du marché et les angles déjà saturés
(utile pour la veille), mais elle est le discours d'un créateur : c'est du 1A par nature.
D'où `--no-transcripts` par défaut quand on cherche du 1B.

---

## Le tri 1A / 1B — le cœur

La collecte est triviale (yt-dlp la fait). **Toute la valeur est dans le discriminant.**

| | Phase 1A | Phase 1B |
|---|---|---|
| Définition | ce qu'il dit **AUX AUTRES** | ce qu'il pense **SEUL à 23h** |
| Nature | public, conscient, formulé | privé, inconscient, jamais dit |
| Réaction du prospect | « oui, je sais » | « comment il sait ça sur moi » |
| Usage | la SCÈNE (3-15 s) | le **HOOK** |
| Résultat terrain | AD3 Sabine = **0 lead** | AD1 Sabine = 10 leads / 16,77 € |

### Les six lexiques

| Lexique | Poids | Tracé à |
|---|---|---|
| **AVEU** (« j'ose pas », « personne ne sait », « je fais semblant ») | +3,5 | test de l'aveu, `LOIS_COPY` §2 |
| **ÉTAT SUBI** (« j'y arrive plus », « c'est plus fort que moi ») | +3,0 | nommer vs décrire, loi-mère |
| **NUIT / SOLITUDE** (« 3h du matin », « je rumine ») | +2,5 | « seul à 23h », framework l.42 |
| **DOULEUR** (« ça me bouffe », « à bout ») | +2,0 | « la phrase qui fait mal », l.49 |
| **CONSEIL** (« tu devrais », « il suffit de ») | **−5,0** | « tu ne CONSEILLES jamais » |
| **COMMERCIAL** (« c'est combien », « je suis prêt à payer ») | **−5,0** | ajouté en v2 (voir plus bas) |

### 🔒 Le GATE — le correctif qui fait tout

**Sans au moins un marqueur de confession, un commentaire ne peut PAS être classé 1B,
quelle que soit sa longueur.**

C'est le garde-fou central, et il vient d'un échec réel documenté ci-dessous.

---

## Ce que le premier test a cassé (et pourquoi c'est consigné ici)

La **v1** pondérait la longueur à 3,0, en s'appuyant sur `stats-terrain.md` §7 :
> « les trois signés avaient tous un verbatim long et chargé au formulaire. Aucun lead
> à verbatim court n'a signé. »

Raisonnement séduisant, **transposition fausse**. Résultat sur un vrai corpus :

| Sorti en « 1B » par la v1 | Ce que c'était vraiment |
|---|---|
| « Je me nomme jean jacques, réside en côte d'ivoire… recherche de fonds » | demande de financement |
| *(le même, deux fois)* | doublon non dédupliqué |
| « Bonjour @yazz8986, la Suisse est un marché profitable mais… » | **le créateur qui répond** = du conseil |
| « j'ai reçu des devis à 5000 €/an… serait-il possible d'en savoir plus ? » | question logistique |

Trois sur cinq n'affichaient **aucun signal**. Le score était porté par la longueur seule :
66 mots + première personne = 9 points pour un seuil à 6. Le tri ne triait rien.

**La leçon** : la longueur est un prédicteur validé **sur des verbatims de formulaire** —
des gens qui répondent déjà à une question intime (« raconte-nous ce qui s'est passé »).
Sur YouTube, personne n'a posé la question : long veut souvent dire **bavard**.
C'est le **piège de transposition** que `LOIS_COPY` §6 décrit pour les marqueurs
stylistiques — un signal n'est jamais transposable hors de sa condition d'origine.

**Corrections v2** : longueur 3,0 → 1,2 (amplificateur, plus preuve) · GATE lexical
obligatoire · lexique COMMERCIAL · pénalité question · filtre `author_is_uploader` ·
déduplication par texte normalisé.

### v3 — deux bugs de matching trouvés en INSPECTANT la sortie

La v2 triait bien, mais l'inspection ligne à ligne d'une vraie récolte a montré
deux défauts que les compteurs ne révélaient pas :

1. **Signaux fantômes.** Le matching se faisait en simple sous-chaîne : « vide »
   matchait dans « évidemment », « peur » dans « peureux », « craque » dans
   « craquelé ». Un verbatim était crédité de marqueurs de douleur absents du
   texte, ce qui gonflait le score et faisait franchir le GATE à tort.
2. **Marqueurs composés morts en silence.** Premier correctif trop rapide :
   `re.escape()` échappe l'espace (« a b » → `a\ b`), donc remplacer les espaces
   ensuite laissait un backslash parasite. `je m'en veux` devenait « backslash
   littéral suivi de s » — motif qui ne matche jamais. **Tous** les marqueurs
   multi-mots étaient désactivés sans le moindre message. Le tri est passé de
   7 candidats à 1, et c'était une régression, pas une amélioration.

Correctif final : chaque mot échappé séparément, rejoint par `\s+`, avec des
frontières `(?<![\w'])…(?![\w'])` qui tiennent compte de l'apostrophe.
Vérifié dans les deux sens — les 3 fantômes éliminés, les marqueurs composés
restaurés.

**Leçon transférable** : un compteur qui monte n'est pas une preuve que le tri
marche. Les deux bugs étaient invisibles dans les totaux (« 7 candidats » puis
« 1 candidat » sont deux nombres également plausibles) et n'ont été trouvés
qu'en lisant les verbatims et leurs signaux un par un. C'est le même geste que
l'audit phrase par phrase de `LOIS_COPY` §9.

**Après correctif v2, sur le corpus tuto/business : 0 candidat 1B.** C'est le bon résultat — le
rapport affiche alors « ⛔ SEUIL NON ATTEINT » et **interdit d'écrire des ads**. Un
mineur qui rend 0 sur un mauvais corpus vaut mieux qu'un mineur qui rend 18 déchets.

---

## La requête décide de tout

Constat du test : une requête **tuto/business** ramène des commentaires d'intention
commerciale, jamais de confession.

| Requête | Ce qu'elle ramène |
|---|---|
| ⛔ « acheter revendre voiture rentabilité » | « c'est combien ta formation » |
| ⛔ « je n'arrive plus à acheter des voitures négociant » | des vidéos **GTA** (« racheter une mule custom ») |
| ✅ « pourquoi je n'arrive pas à oublier mon ex » | témoignages, confessions |

**Règle** : viser les vidéos où la cible se **confesse** ou se **reconnaît** —
témoignages, « j'ai arrêté », « mon échec », interviews, reportages — pas les tutos.
Écrire la requête **avec les mots de la cible**, jamais avec le vocabulaire du métier.

---

## ⚠ Limite d'exploitation réelle

Depuis une IP datacenter, YouTube répond par intermittence :
> `ERROR: Sign in to confirm you're not a bot.`

Le piège : yt-dlp sort alors `null` — donc **0 commentaire sans erreur visible**. On croit
la niche muette alors que l'outil est aveugle. Deux garde-fous ajoutés : `check_deps()`
au démarrage, et un retry avec pause croissante (20 s / 40 s / 60 s) qui **annonce**
le blocage.

**Contournement** : `--cookies cookies.txt` ou `--cookies-from-browser`, ou lancer depuis
une machine résidentielle (la tienne). Sans cookies, compter des trous dans la récolte.

Autre dépendance non évidente : **un runtime JS est obligatoire** (deno/node) — sans lui,
yt-dlp extrait les métadonnées mais **jamais les commentaires**, silencieusement.

```bash
pip install yt-dlp youtube-transcript-api
curl -fsSL https://deno.land/install.sh | DENO_INSTALL=/usr/local sh -s -- -y
```

---

## Usage

```bash
# Récolte 1B (commentaires seuls — le plus rentable)
python3 cc_miner.py \
  "pourquoi je n'arrive pas à oublier mon ex" \
  "ma femme est partie du jour au lendemain" \
  --videos 6 --comments 300 --no-transcripts --out ./cc-reconquete

# Avec cookies quand YouTube bloque
python3 cc_miner.py --queries-file requetes.txt --cookies browser:chrome --out ./cc

# Avec transcriptions (vocabulaire marché + angles saturés)
python3 cc_miner.py "..." --out ./cc-veille
```

### Sorties

- **`CERVEAU_CIBLE_BRUT.md`** — Phase 1B (avec signaux + lien source), Phase 1A,
  Phase 7 (lexique de la cible), et le verdict sur le seuil des 3 dialogues intérieurs.
- **`raw.json`** — tout, scoré, pour retraitement.

---

## Ce que le mineur ne fait PAS

Il produit les **Phases 1A, 1B et 7**. Il ne produit **pas** les Phases 2 (niveaux de
douleur), 3 (croyance erronée), 4 (échecs passés), 5 (désirs), 8 (identité menacée) :
celles-là demandent une lecture humaine.

Et rappel de la consigne [B2] retenue dans `OFFRE.md` §5 : **l'exercice de compréhension
des croyances se fait sans IA**, sur papier. Le mineur fournit la matière première.
Il ne fournit pas la compréhension.
