# Stats terrain — la data qui prouve chaque loi

Toutes les données viennent d'un compte Meta réel, campagne CBO unique, secteur coaching relationnel B2C, ticket 1497-1997 €. Elles servent de référence de calibration : les ordres de grandeur sont transposables, les valeurs absolues non.

---

# 1. Le compte sur 7 jours

| Métrique | Valeur |
|---|---|
| Spend | 651,44 € |
| Leads (Meta) | 97 |
| Leads (formulaire) | 156 |
| CPL global | 6,72 € |
| Fréquence | 2,06 |
| CPM | 10,41 € |
| CTR | 5,28 % |
| Reach | 30 309 |
| Impressions | 62 570 |

---

# 2. Performance par créative

| Ad | Archétype de hook | CPL | Fréquence | CTR | Verdict |
|---|---|---|---|---|---|
| Enfants/maison | Constat de réduction | **3,77 €** | 1,19 | 5,93 % | Meilleur CPL, affamé par l'algo |
| Tu l'es resté | Retournement de qualité | 6,46 € | **2,02** | 5,27 % | Winner en fatigue, 2 signés |
| Tout donné | Retournement de qualité | 6,05 € | 1,31 | 5,46 % | Stable, sous-alloué |
| Silence radio | Mécanisme inversé | 6,28 € | 1,50 | **7,71 %** | Meilleur CTR, 1 signé |
| Trop acquis | Statut dévalorisant | **8,58 €** | 1,23 | 4,40 % | Loser confirmé |

**Ce que ça prouve** :
- Les trois archétypes gagnants performent tous sous la moyenne compte ; l'anti-archétype est le plus cher.
- Le constat de réduction (le plus spécifique) obtient le meilleur CPL — la spécificité filtre et fait baisser le coût.
- Le mécanisme inversé obtient le meilleur CTR — il attrape le scroll de celui qui applique déjà la fausse solution.

---

# 3. La dérive du CPL dans le temps (signature de fatigue)

Créative winner, mesures successives :

| Fenêtre | CPL | Fréquence |
|---|---|---|
| 3 jours | 4,39 € | 1,53 |
| 6 jours | 5,82 € | 1,96 |
| 7 jours | 6,46 € | 2,02 |

Progression monotone du CPL, fréquence qui franchit 2. Le pool d'audience fraîche s'épuise. C'est mécanique, pas un problème de copy.

**Décision correcte** : injecter de nouveaux angles sur le même noyau pour élargir le pool. Ne pas couper — cette créative portait 2 des 3 clients signés.

**Seuils de vigilance observés** : fréquence > 2 sur 7 jours glissants, CPL en hausse sur trois relevés consécutifs, classement de qualité Meta sous la moyenne. Les trois ensemble = saturation.

---

# 4. Le duel A/B qui isole la variable hook

Même corps d'ad, même offre, même CTA. Seul le hook diffère.

| Hook | Nature | CPL | Verbatims premium |
|---|---|---|---|
| « T'es devenu un acquis » | Statut dévalorisant (DÉCRIRE) | 8,58 € | 0 % |
| « Tu l'es resté trop longtemps » | Retournement (NOMMER) | 4,39 € | 43 % |

**Ce que ça prouve** : le hook seul fait varier le CPL d'un facteur 2 et la qualité des leads de 0 à 43 %. C'est la preuve la plus propre de la loi unique, parce que toutes les autres variables sont contrôlées.

---

# 5. La courbe de rétention (hold)

Créative winner, quartiles réels :

| Palier | ~Seconde | Spectateurs | % du hook | Perte sur segment |
|---|---|---|---|---|
| Hook 3s | 3s | 5 673 | 100 % | — |
| p25 | 17s | 3 820 | 67 % | 33 % |
| **p50** | **33s** | **1 683** | **30 %** | **56 %** |
| p75 | 50s | 919 | 16 % | 45 % |
| p100 | 67s | 426 | 8 % | 54 % |

**Ce que ça prouve** : le hook fonctionnait (12,7 % des impressions le passaient). Le saignement était au milieu du corps, sur des lignes descriptives et clichées. Quatre lignes réécrites valent mieux qu'une ad refaite.

**Seuil de vigilance** : un ratio p50/hook sous 30 % signale un milieu de corps défaillant.

**Méthode** : durée vidéo ÷ 4 = intervalle entre quartiles. Repérer le segment à plus forte perte %, mapper au copy par timestamp, réécrire uniquement ces lignes, A/B contre l'original en comparant p50/hook.

---

# 6. Le funnel aval (91 opportunités CRM)

| Étape | Nombre | % |
|---|---|---|
| Nouveau Lead | 4 | 4 % |
| Contacté | 33 | 36 % |
| Relance | 32 | 35 % |
| RDV Booké | 1 | 1 % |
| No Show | 2 | 2 % |
| Pas Qualifié | 16 | 17 % |
| **Client Signé** | **3** | **3 %** |

**Ce que ça prouve** : 71 % du pipe stagne en Contacté/Relance. Un seul rendez-vous formellement booké sur 91 opportunités. Et surtout, les 14 champs de qualification du CRM étaient remplis à 0/91.

**Enseignement pour le copy** : quand le copy performe et que le cash ne suit pas, le problème est souvent en aval. Un moteur d'ads ne répare pas une qualification qui dort. Le signaler à l'utilisateur plutôt que de sur-optimiser le copy.

---

# 7. L'origine des clients signés

| Signé | Créative | Verbatim déclencheur |
|---|---|---|
| Client 1 | Silence radio (mécanisme inversé) | couple zombie post-tromperie |
| Client 2 | Tu l'es resté (retournement) | manque de confiance, jalousie nommée |
| Client 3 | Tu l'es resté (retournement) | 20 ans de relation, silence depuis 4 mois |

**Ce que ça prouve** : la créative au CPL le plus élevé du trio gagnant portait 2 des 3 signés. **Le CPL n'est pas le KPI de décision, le cash signé l'est.**

Deuxième enseignement : les trois signés avaient tous un verbatim long et chargé au formulaire. Aucun lead à verbatim court n'a signé. La longueur du verbatim est un prédicteur de closing.

---

# 8. L'effet de la friction du formulaire

| Version | Structure | Volume |
|---|---|---|
| V4 | 4 questions à choix multiples | ~1,7 leads/jour |
| V6 | 1 question texte ouverte | ~14 leads/jour |

Volume multiplié par 8, **et** qualité verbatim en hausse.

**Ce que ça prouve** : contre-intuitif mais net. Les questions à choix multiples filtrent l'émotion ; une question ouverte invite à la confession, et c'est la confession qui produit le verbatim exploitable. Le formulaire n'est pas un filtre administratif, c'est une opportunité de confession.

La question qui a produit ce résultat, dans sa forme exacte :
> « On prend pas tout le monde en accompagnement. Raconte-nous ce qui s'est passé, et pourquoi c'est toi qu'on devrait aider à [objectif]. »

Deux mécaniques y opèrent : le filtre implicite (« on prend pas tout le monde ») qui flatte le noyau, et l'invitation au récit qui débloque la parole.

---

# 9. Distribution de la qualité des leads

Sur 156 leads formulaire :
- 48 % de verbatims premium (100 caractères ou plus)
- Le reste en verbatims standards ou courts
- Environ 10 % de déchet (hors-cible, hors-langue, hors-scope)

**Calibration** : un taux de 40-50 % de verbatims premium sur un formulaire à question ouverte est un bon niveau. En dessous de 30 %, l'ad attire trop large ou le hook ne filtre pas.

---

# 10. Le ROAS

1 500 € encaissés en acomptes (3 × 500 €) pour ~650 € dépensés = ROAS ~2,3x sur acomptes seuls. Si les contrats complets se règlent, le ROAS projeté monte vers 8-11x.

**Enseignement** : compter le cash réellement encaissé, jamais les engagements verbaux. Un « je paie le 28 » n'est pas un client signé tant que rien n'est encaissé.

---

# Les limites honnêtes de cette data

À rappeler à l'utilisateur quand il veut généraliser :

- **Un compte, une niche.** Les 4 noyaux observés ne prouvent pas une loi universelle.
- **Les lois 7 et 8** (épuisement, manque inédit) sont observées sur 2 à 4 cas seulement.
- **Pas d'A/B propre entre angles** : la campagne tournait en CBO, l'algo allouait librement. Impossible d'isoler totalement l'effet du hook de l'effet d'allocation. Le duel 2A/2B reste le test le plus propre disponible.
- **Les transpositions vers d'autres niches** (B2B, coaching business) sont inférées, pas mesurées. Elles doivent être confrontées à du lead froid réel avant d'être scalées.

Utiliser ces chiffres comme calibration d'ordre de grandeur, jamais comme cible absolue sur un autre compte.
