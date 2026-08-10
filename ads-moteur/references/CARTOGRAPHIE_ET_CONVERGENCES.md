# Cartographie de la cible + convergence des lois

> Deux questions traitées ici :
> **(1)** comment on détermine une cible *spécifiquement, avec de la data* ;
> **(2)** ce qui converge et ce qui diverge entre toutes les lois du corpus.
>
> Le critère de convergence est celui du requin et du dauphin : quand des **lignées
> indépendantes** (clinique, webinaire B2C, agence US, compte B2B terrain, mesure
> algorithmique) arrivent **séparément à la même forme**, cette forme n'est pas une école
> de style — c'est une **contrainte du milieu**. Quand elles divergent, c'est que le
> milieu diffère, et transposer devient une faute.

---

## ⚠️ 0. CORRECTION DE MON PROPRE TRAVAIL — un confondant que j'avais laissé passer

Dans `MECANIQUE_COMPLETE.md` §1, j'ai présenté « Lambert 2,83 € contre 180,82 € » comme
preuve de l'axe innocence/accusation. **Cette comparaison est confondue.**

Les ads qui accusent sont **toutes optimisées website**. Les ads qui innocentent sont
**toutes en lead form**. Or le format seul produit déjà un écart massif :

| Optimisation | n | Coût médian |
|---|---|---|
| Lead form | 9 | **3,50 €** |
| Website | 4 | **42,56 €** |

L'écart de 17× que j'annonçais mélange donc deux effets. **Il faut re-tester à format
constant.**

### Le test à format constant — l'axe survit, mais à 4,9× et non 17×

**À format website constant, registre business constant :**

| Ad | Axe | Coût |
|---|---|---|
| SCRIPT 3 « Arnaque chèque » | narratif | 6,39 € |
| AD 1 « Douleur / Mécanisme » | accuse | 31,19 € |

→ **4,9×**, format et registre tenus constants.

**À format form constant :**

| Axe | n | Coût médian |
|---|---|---|
| innocente | 6 | **3,13 €** |
| narratif | 2 | 7,46 € |
| calcul en cascade | 1 | 14,46 € |

→ **4,6×** entre innocenter et faire calculer, même format.

### Ce qui reste debout, et c'est le plus important

**La preuve la plus propre de l'axe n'est pas LV — c'est D'Angelo**, parce qu'elle est en
**organique** : pas de format d'optimisation, pas d'enchère, pas de pixel. Rien à
confondre.

| Vues | Hook | Axe |
|---|---|---|
| 90 K | « ce qui déclenche le retour d'une femme » | aucune faute |
| 65 K | « un homme **qui a tout fait** » | innocence |
| 44 K | « comment se reconstruire » | neutre |
| 3 K | « tu as réussi mais **pas en toi-même** » | accusation |
| 1,5 K | « posture relationnelle » | jargon |

**Verdict révisé** : l'axe innocence/accusation est **réel et fort**, mais son amplitude
mesurable sur LV est de l'ordre de **5×**, pas de 17×. Le reste était du format.
Une loi surestimée finit par être rejetée en bloc ; mieux vaut la chiffrer juste.

---

## 1. COMMENT DÉTERMINER UNE CIBLE — le protocole

L'ordre compte : chaque étape coûte plus cher que la précédente, donc on trie tôt.

### Étape 1 — Le REGISTRE avant tout (le paramètre le plus cher du corpus)

**Ne jamais écrire avant d'avoir tranché dans quel monde la douleur est admissible.**

| Registre testé | Résultat LV |
|---|---|
| business (chiffre, tréso, parc, marge) | **3,13 € médian** |
| corporel (« négociant épuisé ») | **0 lead** sur 48 € et 4 931 impressions |
| identitaire (« ta boîte vaut zéro ») | **180,82 €** |

Test : 3 ads, **structure identique**, seul le registre change, budget minimal, format
constant. C'est le test le moins cher et le plus décisif de tout le système.

⚠️ Le registre corporel avait un **CTR de 6,92 %** — près du triple des winners. Sans
regarder le coût, on l'aurait scalé.

### Étape 2 — Le vocabulaire possédé / manquant (S5.4 / S5.5)

`cc_miner.py` sur des requêtes **confessionnelles** (pas tuto). On cherche ce que la cible
**décrit par périphrase faute d'avoir le mot** : ce mot manquant *est* l'angle.

Calibration : `stats-terrain` §9 → **40-50 % de verbatims premium** sur formulaire à
question ouverte = bon niveau. Sous 30 %, l'ad attire trop large.

### Étape 3 — L'attribution actuellement tenue (S3.8)

Dans les verbatims, chercher la complétion de : *« si j'en suis là, c'est parce que… »*.
Classer la réponse sur trois axes : **interne/externe · global/spécifique · stable/instable**.

C'est le diagnostic central. Exemple LV : *« c'est vicieux, t'es toujours obligé
d'acheter »* → externe mais **stable** (« toujours »). Il faut donc surtout casser la
stabilité, pas l'internalité.

### Étape 4 — Construire la substitution

Réécrire l'attribution en **externe / spécifique / instable**, avec le **même pouvoir
explicatif**. Contrôle : la nouvelle version doit expliquer *tous* les échecs passés que
l'ancienne expliquait. Sinon il ne l'adopte pas.

### Étape 5 — Tester à une seule variable par manche

`LOIS_COPY` §8 : manche 1 les vidéos, manche 2 les textes, manche 3 les titres.
Et **adset ABO à budget garanti** pour les tests — le CBO affame les angles neufs.

### Étape 6 — Lire les bonnes métriques

**`p50/p25` et le coût par résultat.** Jamais le CTR seul, jamais le hook rate seul,
jamais le CPM.

### Étape 7 — Remplir `poids_terrain`

Chaque décision de copy pilotée par un paramètre laisse un delta mesuré. Après quelques
manches, on sait lesquels portent le résultat.

---

## 2. LA CARTOGRAPHIE — ce qui a réellement bougé l'argent

`poids_terrain` pré-rempli à partir de tout le corpus. **Chaque effet est mesuré, pas
estimé.** Les confondants connus sont notés.

| Rang | Paramètre | Effet mesuré | Source | Confondant |
|---|---|---|---|---|
| **1** | **Registre de la douleur** (proposé `S4.18`) | business 3,13 € vs corporel **0 lead** | LV, MCP | aucun (même format, même structure) |
| **2** | **Format d'optimisation** (form vs website) | **12×** (3,50 € vs 42,56 €) | LV, MCP | angles inégalement répartis |
| **3** | **Friction du formulaire** (S6 / funnel) | **×8 de volume** (1,7 → 14 leads/j) + qualité en hausse | stats-terrain §8 | aucun (V4 vs V6 isolé) |
| **4** | **Nommer vs décrire** (loi-mère, S5.4/5.5) | CPL **1,95×** (8,58 → 4,39 €) et verbatims premium **0 % → 43 %** | stats-terrain §4 | **aucun — duel A/B propre**, seul le hook change |
| **5** | **Axe innocence / accusation** (S3.7 + S3.14) | **4,9×** à format constant · **60×** en organique | LV + D'Angelo | corrigé §0 |
| **6** | **Calcul demandé au prospect** | **4,6×** (3,13 → 14,46 €), même format | LV, MCP | n = 1 |
| **7** | **Archétype de hook** | 2,3× (3,77 € vs 8,58 €) | stats-terrain §2 | CBO alloue librement |
| **8** | **Tenue du corps** `p50/p25` | rho = **−0,406** vs coût (n = 12) | MCP | — |
| **9** | Fréquence / usure | CPL +47 % quand fréquence 1,53 → 2,02 | stats-terrain §3 | temps ⊂ fréquence |
| ⛔ | **Hook rate / CTR** | rho = **+0,601** — **inversé** | MCP | — |
| ⛔ | **CPM** | ne discrimine pas (winners 6,07-7,83 ; mortes 9,37-9,49) | MCP | — |

**Lecture** : les 4 premiers leviers sont tous en amont du copy fin — registre, véhicule,
friction, et le choix de nommer. Le style vient après. Un système qui optimise les mots
avant d'avoir tranché le registre optimise le 5ᵉ levier en ignorant le 1ᵉʳ.

---

## 3. LES CONVERGENCES — même forme, lignées séparées

### C1 — Innocenter plutôt qu'accuser  🦈🐬 **6 lignées**

| Lignée | Formulation |
|---|---|
| Clinique (Beck) | les attributions internes-globales-stables produisent l'impuissance |
| ads-intelligence | « tu ne DIAGNOSTIQUES jamais une insuffisance » — DIAGNOSTIC dernier de la hiérarchie |
| LOIS_COPY (B2B) | « disculpation ancrée sur un mécanisme » ; jugement sur l'œuvre → 180 € |
| Hormozi (US) | angle « ennemi commun : le vrai coupable c'est X, pas ta faute » |
| stats-terrain (B2C) | archétype « statut dévalorisant » = pire CPL du compte (8,58 €) |
| MCP (mesure) | 4,9× à format constant |

Six origines qui ne peuvent pas s'être copiées. **Contrainte du milieu, pas doctrine.**

### C2 — Nommer l'informulé plutôt que décrire le su  **5 lignées**

ads-intelligence (Phase 1B vs 1A) · LOIS_COPY (test de l'aveu, test du planning) ·
stats-terrain (duel A/B : 8,58 € → 4,39 €) · Schwartz (sophistication 5 = identification)
· SPEC-CIBLE (S5.4 / S5.5).

**Le duel A/B de `stats-terrain` §4 est la preuve la plus propre de tout le corpus** :
même corps, même offre, même CTA, seul le hook change. Rien d'autre ne bouge.

### C3 — Le corps décide, pas le hook  **3 mesures indépendantes**

| Mesure | Support |
|---|---|
| `HOOKS.md` l.39 | « le hook ne sépare PAS les winners des losers… c'est le contenu 3-15 s » (Reels D'Angelo + TikTok Sabine) |
| `stats-terrain` §5 | « le hook fonctionnait, le saignement était au milieu du corps » ; seuil p50/hook < 30 % |
| MCP (mon calcul) | p25/play rho **+0,601** ; p50/p25 rho **−0,406** |

Trois comptes, trois niches, trois méthodes de mesure. **Convergence forte.**
Conséquence directe : la SPEC-CIBLE se trompe en faisant du hook rate le juge de S8.1.

### C4 — Écraser le dénominateur (effort × délai)  **3 lignées, dont une mesurée**

Hormozi (« the best companies focus on the bottom side ») · BLOC 2 (« les débutants
gonflent le haut, les meilleurs écrasent le bas ») · **et la mesure la plus inattendue :**
`stats-terrain` §8 — passer de 4 QCM à **1 question ouverte** fait **×8 de volume**.

C'est la loi de l'offre validée dans un domaine où personne ne l'attendait : **le design
d'un formulaire**. Deux théoriciens et une mesure, trois origines séparées.

### C5 — Rareté honnête > rareté inventée  **3 lignées**

Hormozi (dark patterns, FTC) · Jody LOI 41 🔒 · LOIS_COPY §4 (« la menace est déduite,
pas brandie »). Et la mesure : AD 6 « LE 11 AOÛT », adossée à une **vraie date légale**,
est le plus gros volume du set scripté.

### C6 — La profondeur du verbatim prédit la valeur  **3 lignées, avec un proxy réfuté**

ads-intelligence (l.49) · stats-terrain §7 (les 3 signés ont tous un verbatim long ;
**aucun verbatim court n'a signé**) · SPEC-CIBLE (S8.5).

⚠️ **Mais le proxy « longueur » ne transfère pas.** Mon mineur v1 l'a appliqué aux
commentaires YouTube et a produit 18 faux positifs. Voir D5.

---

## 4. LES DIVERGENCES — analogies trompeuses, milieux différents

C'est ici que la métaphore paie : un requin et un dauphin ont la même silhouette **et des
poumons différents**. Copier la silhouette sans vérifier le milieu produit un pastiche —
c'est le **piège de transposition** de `LOIS_COPY` §6.

| # | Loi A | Loi B | Milieu qui les sépare |
|---|---|---|---|
| **D1** | Jody LOI 75 : **CTR > 5 % = magnifique** | Moteur LOI 15 : **CTR > 4 % = alarme** | Webinaire B2C froid (le CTR mesure l'attrait d'une promesse large) vs form B2B terrain (le CTR mesure une curiosité hors-cible). **Les deux sont vraies chez elles.** |
| **D2** | Jody LOI 74 : **CPM < 10 € = chouchou** | Moteur LOI 24 : **le CPM ne diagnostique rien** | Deux questions différentes : santé de l'**enchère** vs qualité du **copy**. Pas un conflit, un malentendu de périmètre. |
| **D3** | Hormozi MAGIC : container word (« System ») | BLOC 2 : les systèmes nommés = signal bullshit | Marché US info-produit vs B2B FR de terrain. |
| **D4** | Hormozi : « the pain is the pitch » | BLOC 2 : ne pas headliner la douleur profonde | **Profondeur.** Douleur consciente → en ad. Douleur profonde → en call. Les deux ont raison à des profondeurs différentes. |
| **D5** | stats-terrain : la longueur du verbatim prédit | Mon mineur v1 : 18 faux positifs sur longueur | **Quelqu'un a-t-il posé la question ?** Sur formulaire, oui → long = confession. Sur YouTube, non → long = bavard. |

**D5 est l'exemple parfait de ta métaphore** : le même trait (la longueur) est adaptatif
dans un milieu et parasite dans l'autre. Ce n'est pas la longueur qui prédit, c'est **la
sollicitation intime qui la précède**. Sans elle, le trait ne signifie plus rien.

---

## 5. LE CRITÈRE, réutilisable sur tout nouveau matériel

Tu vas continuer à recevoir des corpus. Voici le test à leur appliquer :

> **Une loi est structurelle si elle apparaît dans au moins 3 lignées indépendantes qui
> ne peuvent pas s'être copiées, dont au moins une mesure.**
> **Une loi est contextuelle si elle n'apparaît que dans une lignée — elle reste vraie
> chez elle, et ne se transpose pas sans re-test.**

Ce critère fait le tri sans arbitrer par autorité. Il explique pourquoi Jody a raison
**dans le webinaire B2C** et pourquoi la LOI 15 a raison **sur ton compte négociant**,
sans qu'aucun des deux n'ait à céder.

Et il donne l'ordre de priorité : **d'abord les 6 convergences** (elles tiennent partout),
**ensuite** les lois contextuelles, **et jamais** une transposition non re-testée.

---

## 6. Les zones grises assumées

- **S1 et S2 ne sont mesurés nulle part** dans ton corpus. Toute affirmation de
  personnalité ou de cohorte est **INFÉRÉE**. Ta SPEC a raison de les cantonner au ton.
- **Le quiz funnel n'a aucune mesure** sur tes comptes.
- **Le CBO fausse les comparaisons d'angles** (`stats-terrain` le reconnaît) : l'algo
  alloue, donc l'effet du hook et l'effet d'allocation ne sont pas séparables. Seuls le
  duel A/B §4 et mes tests à format constant échappent à ce biais.
- **n reste petit** : 12 ads sur LV, 5 sur le compte coaching. Les ordres de grandeur
  sont exploitables ; les décimales non.
