# Courbes de rétention × copy × algo Meta

> Méthode : `stats-terrain.md` §5, appliquée aux **quartiles vidéo réels** du compte
> LV (MCP `ads_get_ad_entities`, `date_preset: maximum`, relevé 2026-08-10).
> 12 ads du périmètre négociant auto ayant un volume exploitable.

---

## 1. Le tableau brut

| Ad | p25/play | **p50/p25** | p75/p50 | p100/p25 | Coût/lead | CTR |
|---|---|---|---|---|---|---|
| AD 2A — DÉPENDANCE AU RACHAT | 6,2 % | **70,0 %** | 69,5 % | 11,3 % | 3,30 € | 2,81 % |
| AD 1 — GROS CHIFFRE | 7,0 % | **60,9 %** | 65,0 % | 10,4 % | **2,83 €** | 2,86 % |
| AD 1A — GROS CHIFFRE (relance) | 7,6 % | **67,1 %** | 66,7 % | 7,9 % | 2,88 € | 2,75 % |
| AD 2 — LA ROUE | 7,1 % | **62,2 %** | 66,7 % | 12,9 % | 2,96 € | 3,02 % |
| AD 6 — LE 11 AOÛT | 7,7 % | 52,0 % | 52,6 % | 7,2 % | 3,50 € | 2,45 % |
| SCRIPT 3 — ARNAQUE CHÈQUE | **14,5 %** | **72,9 %** | 56,5 % | 12,2 % | 6,39 € | 2,64 % |
| SCRIPT 2 — LEBONCOIN ENNEMI | 9,0 % | 62,9 % | 55,9 % | 10,8 % | 7,08 € | 1,92 % |
| AD 4 — TA TRÉSO QUI DORT | 6,1 % | 61,4 % | 68,6 % | 14,0 % | 8,46 € | 2,89 % |
| SCRIPT 1 — PRENDS 30 SECONDES | 7,9 % | 63,0 % | 55,5 % | 12,5 % | 14,46 € | 1,38 % |
| AD 1 — DOULEUR / MÉCANISME | 9,4 % | 58,8 % | 56,3 % | 7,4 % | 31,19 € | 1,81 % |
| AD 2 — REGRET / INACTION | 12,0 % | 55,6 % | 52,8 % | 7,1 % | 53,93 € | 2,45 % |
| AD 6 — RÉPÉTITION | 10,9 % | 53,0 % | 60,5 % | 9,7 % | **180,82 €** | **4,41 %** |

---

## 2. 🔴 LA DÉCOUVERTE — la rétention brute est un PIÈGE, le maintien du milieu est le signal

Corrélations de rang (Spearman) contre le **coût par lead**, sur les 12 ads.
Un rho **négatif** = « quand la métrique monte, le coût baisse » = métrique utile.

| Métrique de rétention | rho vs coût | Lecture |
|---|---|---|
| **p25/play** — combien passent le 1er quart | **+0,601** | ⛔ **INVERSÉE** — plus ça retient, plus ça coûte |
| p50/play | +0,483 | ⛔ inversée |
| p100/play — vont au bout | +0,413 | ⛔ inversée |
| **p50/p25** — tiennent le milieu | **−0,406** | ✅ **signal utile** |
| p100/p25 | −0,196 | ✅ faible mais bon sens |

### La démonstration en deux listes

**Les 4 meilleures rétentions brutes → les 4 pires coûts (sauf une) :**

| p25/play | Ad | Coût |
|---|---|---|
| 14,5 % | SCRIPT 3 ARNAQUE | 6,39 € |
| 12,0 % | AD 2 REGRET/INACTION | **53,93 €** |
| 10,9 % | AD 6 RÉPÉTITION | **180,82 €** |
| 9,4 % | AD 1 DOULEUR/MÉCANISME | **31,19 €** |

**Les 4 meilleurs coûts → des rétentions brutes médiocres :**

| Coût | Ad | p25/play |
|---|---|---|
| 2,83 € | AD 1 GROS CHIFFRE | 7,0 % |
| 2,88 € | AD 1A relance | 7,6 % |
| 2,96 € | AD 2 LA ROUE | 7,1 % |
| 3,30 € | AD 2A DÉPENDANCE | **6,2 %** (la plus basse du set) |

> **LOI 20 — la rétention brute mesure la curiosité, pas l'intention.**
> Comme le CTR (loi 15), elle se laisse gonfler par un angle qui intrigue hors-sujet.
> **La seule métrique de rétention qui prédit le coût est `p50/p25`** : la proportion de
> ceux qui, ayant passé le premier quart, restent jusqu'à la moitié.
> Elle mesure si le **corps tient la promesse du hook** — c'est-à-dire exactement ce que
> le copy contrôle.

### Le seuil opérationnel

Sur ce compte, la coupure est nette :

- **p50/p25 ≥ 60 %** → corps qui tient. Les 4 winners y sont tous (60,9 / 62,2 / 67,1 / 70,0 %).
- **p50/p25 ≤ 56 %** → milieu défaillant. AD 6 RÉPÉTITION (53,0 %), AD 2 REGRET (55,6 %),
  AD 6 LE 11 AOÛT (52,0 %).

C'est la transposition du seuil de `stats-terrain.md` §5 (« p50/hook sous 30 % =
milieu défaillant ») à une base p25 au lieu d'une base hook-3s.

---

## 3. Les deux exceptions — et ce qu'elles apprennent

Une loi qui n'explique pas ses exceptions n'est pas une loi.

### Exception A — SCRIPT 3 « ARNAQUE CHÈQUE DE BANQUE » : le meilleur corps du compte, un coût moyen

**p50/p25 = 72,9 %** (record), **p25/play = 14,5 %** (record), et pourtant **6,39 €** —
deux fois le coût des winners.

Lecture : cet angle **raconte une histoire** (une arnaque, donc un récit avec une fin).
Le spectateur reste pour savoir comment ça finit. Il retient magnifiquement **et ne
développe aucune intention d'acquisition**, parce que la peur de l'arnaque est un risque
*ponctuel*, pas une douleur *structurelle* d'acquisition de stock.

> **LOI 21 — un angle narratif retient sans convertir.** Une rétention excellente couplée
> à un coût moyen est la signature d'un copy qui a basculé du côté **contenu**. C'est un
> bon script organique (cf. `organic-content`), pas une bonne ad d'acquisition.

C'est aussi le correctif à porter sur `DATA_COMPTE_LV.md` §5, qui présentait cet angle
comme « un candidat 30 % sérieux ». La courbe de rétention dit : **candidat organique**,
pas candidat ad.

### Exception B — AD 6 « LE 11 AOÛT » : un milieu faible et pourtant rentable

**p50/p25 = 52,0 %** (parmi les plus bas) mais **3,50 €** et le plus gros volume
historique du set scripté.

Lecture : l'ad **livre son information utile dans le premier quart** (la date, l'illégalité,
la conséquence). Celui qui décroche à 40 % a déjà reçu ce dont il avait besoin pour
cliquer. Le décrochage n'est pas une fuite, c'est une **sortie par le haut**.

> **LOI 22 — sur un angle à information datée, le décrochage précoce n'est pas un défaut.**
> Ne jamais « réparer » le milieu d'une ad d'urgence dont le coût est bon. Le seuil des
> 60 % ne s'applique qu'aux angles à **douleur développée** (A → B → mécanisme).

---

## 4. Corrélation au fonctionnement de l'algo Meta

Ce que les chiffres disent du couplage copy ↔ algo, sur ce compte :

**a) L'algo optimise sur le résultat, pas sur la rétention.** Toutes ces campagnes sont
en objectif lead. Meta alloue donc au signal de conversion. C'est exactement pourquoi
`AD 2A` — la **plus mauvaise** rétention brute du set (6,2 %) — est celle que l'algo a le
plus diffusée (69 644 lectures) : elle produit le signal qu'il cherche.
→ **Une ad qui retient mal mais convertit bien sera scalée par l'algo.** Ne pas la couper
sur un mauvais hold.

**b) Le CPM ne discrimine pas.** Les winners sont à 6,07-7,83 € de CPM, les mortes à
9,37-9,49 €. Écart réel mais faible : **Meta ne pénalise pas beaucoup le copy hors-sujet
au niveau de l'enchère.** Le coût du mauvais copy se paie en **conversion**, pas en CPM.
Corollaire : on ne peut pas diagnostiquer une mauvaise ad par son CPM.

**c) La fréquence trahit l'usure, pas la qualité.** AD 2A est à 2,31 de fréquence (au-dessus
du seuil de vigilance de 2 posé par `stats-terrain` §3) alors qu'elle est la meilleure
pourvoyeuse. → C'est un signal d'**élargir le pool par de nouveaux angles**, pas de couper.
`stats-terrain` §3 le dit explicitement et la data LV le reproduit.

**d) `video_avg_time_watched` est plat et donc inutile ici** : 4 à 8 secondes pour toutes
les ads, winners comme mortes. **Ne pas s'en servir pour arbitrer.**

---

## 5. Ce que ça change dans la boucle d'écriture

Étape 5 de la boucle (audit) gagne un contrôle **post-lancement** :

```
Après 3-5 jours de diffusion, pour chaque ad :
1. Pull p25 / p50 / p75 / p100 + coût par lead.
2. Calculer p50/p25.
3. Croiser :
   - coût BON + p50/p25 bon      -> ne toucher à rien, décliner en 70 %
   - coût BON + p50/p25 bas      -> angle à information datée (loi 22). Ne pas réparer.
   - coût MAUVAIS + p50/p25 bas  -> le corps lâche. Mapper le décrochage par timestamp
                                    (durée ÷ 4) et réécrire UNIQUEMENT ces lignes.
   - coût MAUVAIS + p50/p25 haut -> angle narratif (loi 21). Ne pas réécrire :
                                    le copy est bon, l'ANGLE est du contenu.
                                    Le basculer en organique.
```

Le 4ᵉ cas est celui qu'on aurait raté sans la courbe : **on aurait réécrit un bon copy en
croyant corriger un mauvais résultat.**

---

## 6. Où branchent les autres skills

| Skill | Point d'entrée précis |
|---|---|
| **mediabuyer-brain** | §4 ci-dessus — décisions keep/cut, seuils fréquence, lecture CPM/CPMR, structure CBO vs ABO pour ne pas affamer les tests (cf. `LOIS_COPY` §8). |
| **cerveau-cible-vsl** | La LOI DE LA PROFONDEUR (`LOIS_COPY`) — quelle douleur va en ad, laquelle est réservée à la VSL/au call. Le décrochage p50 marque l'endroit exact où la VSL doit reprendre. |
| **organic-content** | Loi 21 — les angles à forte rétention et faible conversion (SCRIPT 3 ARNAQUE) sont des scripts organiques, pas des ads. Recyclage direct. |
| **funnel-cognitive-design** | Le lead form V6 à question ouverte (`stats-terrain` §8 : ×8 de volume) et le pipe aval (§6 : 71 % stagnant) — le copy n'y peut rien, c'est du funnel. |
| **quiz-funnel-brain** | Alternative au form quand la qualification doit monter sans écraser le volume. |
| **webinaire-jody** | Hors périmètre de ce compte (aucune campagne webinaire dans la data). À ne pas transposer sans test. |

⚠️ Ces branchements sont **indiqués, pas exécutés**. Les faire tourner demande de charger
chaque skill sur un cas concret — dis-moi lequel tu veux ouvrir en premier.
