---
name: publicites-rentables
description: >
  Système d'écriture et d'itération de publicités Meta rentables pour cibles B2B
  de terrain (négociants auto indépendants et métiers proches). Produit des textes
  d'ads (body, titres, descriptions) et des scripts vidéo face caméra, puis les
  audite phrase par phrase et itère en boucle jusqu'à ce que le copy passe toutes
  les lois ET soit traçable à une donnée réelle. Utiliser ce skill DÈS QUE
  l'utilisateur veut écrire, réécrire, corriger, auditer ou décliner une ad Meta,
  un script vidéo, un hook, un body, un titre ou une description ; dès qu'il partage
  des stats d'un compte Meta et demande quoi faire ; dès qu'il veut transformer une
  formulation client en ad qui convertit ; ou dès qu'il parle de CPL, hook rate,
  angle d'ad, variantes, ou déclinaison 70/30. Utiliser AUSSI quand il demande
  simplement "corrige cette ad" ou "c'est pas assez fluide" — le skill contient la
  boucle d'audit qui répond exactement à ça.
---

# Publicités rentables — écriture + boucle d'itération

Ce skill écrit des ads qui **convertissent** (pas qui plaisent), puis les corrige
en boucle jusqu'à ce qu'elles passent l'audit. Il est né d'une campagne réelle
(LV Auto, cible négociant auto indépendant) et encode ce qui a marché ET ce qui a
raté sur le terrain.

## LOI ZÉRO — la data et le terrain arbitrent, jamais la théorie

C'est la loi la plus importante, et elle prime sur tout le reste de ce skill, y
compris ce skill lui-même.

**Avant d'écrire ou de corriger une seule ligne, va chercher deux choses :**

1. **Les chiffres du compte.** Quel angle sort le meilleur CPL ? Quel format ?
   Quelle structure ? (via le MCP Facebook Ads : `ads_get_ad_entities`, level `ad`,
   date_preset `maximum`, trié par impressions ou par cost_per_result).
2. **Les verbatims terrain.** Les mots exacts que la cible emploie, l'émotion
   réelle. (via `conversation_search`, un Cerveau Cible fourni, ou des transcripts
   d'appels clients.)

**Pourquoi cette loi existe :** la campagne dont ce skill est tiré a failli être
sabotée parce qu'on a raisonné en théorie au lieu de regarder les chiffres. On a
présenté trois fois de suite l'ad au meilleur *hook rate* (4,41 % de CTR) comme le
patron à recopier. Or, données en main, cette même ad sortait **1 seul lead à
180 € de CPL** — la pire du compte. Le hook émotionnel identitaire attirait le clic
et ne convertissait personne. Les vraies gagnantes étaient sur le chiffre, la
trésorerie et l'échéance légale, à 2,78-3,44 € de CPL.

Corollaire : **CTR ≠ CPL.** Un hook peut faire cliquer sans faire remplir. Sur une
cible B2B de terrain, l'émotion identitaire est un piège à clics. Ne juge jamais une
ad au CTR seul. La métrique reine est le coût par résultat réel (lead, RDV).

Deuxième corollaire : **ne jamais inventer un verbatim ni un personnage.** Dans la
même campagne, on a inventé un « concurrent de ta zone qui réussit sans effort »
pour faire tenir une architecture théorique — aucun négociant n'avait jamais dit ça.
Résultat : du pastiche. Si le verbatim n'existe pas, on ne l'écrit pas. On retourne
au terrain.

Si tu n'as ni chiffres ni verbatims sous la main : dis-le, et va les chercher
(MCP, recherche de conversations, ou demande-les à l'utilisateur) AVANT de produire.
Ne comble jamais l'absence de données par de la théorie.

## LA BOUCLE (le cœur du skill)

Deux boucles imbriquées. La boucle d'écriture (avant lancement) et la boucle de
campagne (après lancement).

### Boucle d'écriture — itère jusqu'à zéro violation

```
1. DIAGNOSTIC   → pull data (MCP) + pull verbatims (LOI ZÉRO)
2. ROUTAGE      → choisir l'architecture selon le verbatim (voir plus bas)
3. STRUCTURE    → partir du squelette gagnant prouvé (70%),
                  ou d'un angle neuf tracé à un verbatim (30%)
4. DRAFT        → écrire le body en respectant les LOIS_COPY
5. AUDIT        → passer CHAQUE phrase à la checklist (references/LOIS_COPY.md)
6. SI une phrase échoue → réécrire CETTE phrase → retour 5
                  (ne jamais tout réécrire de zéro — voir loi anti-réitération)
7. SORTIE       → seulement quand : 0 violation + chaque phrase traçable
                  à une donnée ou un verbatim
```

L'étape 5-6 EST le test. Tu bloucles sur l'audit jusqu'à ce qu'aucune phrase ne
viole une loi. Tu ne sors pas une ad « à peu près bonne » : tu sors une ad qui a
passé l'audit intégralement.

**Loi anti-réitération.** Ne réécris jamais une ad entière de zéro à chaque
correction — c'est la « boucle infernale » qui fait perdre des jours et produit des
pâtés. Tu corriges **la phrase fautive**, tu gardes le reste. Le bon ratio de
production : **70 % de variations d'un gagnant vérifié, 30 % d'angles neufs.** Le
gagnant existe déjà dans la data ; on le duplique en ne changeant que le bloc de
douleur.

### Boucle de campagne — itère jusqu'à la cible CPL

```
1. LANCE       → 70% squelette gagnant / 30% neuf, dans DEUX adsets séparés
                 (ne pas mélanger deux structures : sinon l'algo arbitre et
                  on n'apprend rien)
2. LIS         → J+7 puis J+14, métrique = CPL puis taux lead→RDV
3. GARDE/COUPE → garde les 2-3 meilleurs CPL, coupe le reste
4. DÉCLINE     → le gagnant devient le nouveau squelette 70%,
                 on teste 30% de nouveaux angles contre lui
5. RETOUR 2 jusqu'à la cible CPL
```

Une manche = une seule variable qui change (voir references/LOIS_COPY.md, section
« Test »). Sinon tu payes pour un résultat que tu ne peux pas expliquer ni refaire.

## ROUTAGE D'ARCHITECTURE

Le geste central de la cible détermine l'architecture. Se router sur le **verbatim**,
jamais sur la niche ni sur un cadre théorique séduisant.

- **HONTE / évitement** (le prospect cache un geste non-avouable, émotion = honte) →
  architecture Beck : hook = comportement de sécurité énoncé comme un conseil, rug
  pull, prédiction d'échec sur trait interne, réattribution. Convient à la
  reconquête, la parentalité, certains dirigeants.
- **OBLIGATION / piège** (le prospect subit un système qui le force, émotion =
  fatigue, « t'es toujours obligé ») → hook = nommer l'état subi, disculpation
  historique (« il fallait faire comme ça »), coût externe (le marché, la loi),
  alliance. **C'est le cas du négociant auto.** Verbatims : « t'es toujours obligé
  d'acheter », « réflexe de survie », « du mauvais côté de la barrière ».
- **ASYMÉTRIE / rivalité** (« pourquoi lui et pas moi ») → seulement si un verbatim
  le prouve. Attention : facile à supposer, rarement vrai. Sur le négociant auto,
  cette hypothèse était FAUSSE (aucun verbatim de rivalité). Ne pas router ici sans
  preuve.

Détail complet du routage et des pièges de transposition : voir
`references/LOIS_COPY.md`.

## LES TROIS FICHIERS DE RÉFÉRENCE

Lis-les selon le besoin :

- **`references/LOIS_COPY.md`** — les lois d'écriture (nommer vs décrire, toboggan,
  hook = croyance cassée, éloquence orale, alliance, format Meta) + la checklist
  d'audit à passer à l'étape 5 de la boucle. À lire AVANT d'écrire, et à rouvrir à
  chaque audit.
- **`references/EXEMPLES_ADS.md`** — le set complet des 6 ads finales + le journal
  des modifications (avant → après → pourquoi). À lire pour caler le calibre et
  pour réutiliser le squelette gagnant.
- **`references/OFFRE_ET_TERRAIN.md`** — les découvertes sur l'offre, le cadrage
  juridique du 11 août (loi n° 2025-594), et les verbatims terrain du négociant.
  À lire au diagnostic (LOI ZÉRO) et dès qu'une ligne touche l'offre, le prix, ou
  la loi.

## RÈGLES NON NÉGOCIABLES (extraites du terrain)

Ces règles ont coûté des leads pour être apprises. Elles priment sur l'élégance.

1. **Aucun chiffre de commission dans l'ad.** Un prospect a refusé sur « 300 € =
   30 % de ma marge ». Le prix se traite en appel, pas en pub.
2. **Le mot « dépôt-vente » n'apparaît jamais dans l'ad.** Il ferme la boucle de
   curiosité que la VSL doit fermer. L'ad vend le clic, pas l'offre.
3. **« LeBonCoin sert à vendre, pas à acheter. »** Ne jamais écrire que la cible
   n'utilise pas LBC — elle y publie son stock tous les jours. Confondre les deux
   fonctions décrédibilise instantanément.
4. **Le 11 août frappe le franchisé d'à côté, pas le lecteur.** Dire « ton phoning
   devient illégal » est un sur-claim juridique attaquable (le négociant répond à
   l'objet d'une annonce). Cadrer sur le franchisé rend la menace externe, vraie, et
   met l'indépendant du bon côté. Détail légal dans `references/OFFRE_ET_TERRAIN.md`.
5. **Le sujet grammatical = le visage à l'écran.** « J'ai mis en place », pas « nous
   avons développé » : « nous » présuppose une équipe qu'on ne voit pas.
6. **Alliance, pas séparation, à la clôture.** Pas « nous on a déjà la solution »
   (met le prospect dehors). Utiliser : « On l'implémente chaque semaine chez des
   pros. Un seul par secteur. Si ta zone est encore libre, on te met le système en
   place. » — la rareté par secteur rend le « en retard » vrai sans le brandir.
7. **Attaquer la dépendance, pas le métier.** « Ceux qui dépendent *uniquement* du
   rachat » — le mot *uniquement* rend l'offre additive, pas substitutive. Sans lui,
   on attaque son métier et il se défend.

## COMMENT UTILISER CE SKILL DANS CLAUDE CODE

Si l'utilisateur demande d'écrire ou corriger une ad :
1. Applique la LOI ZÉRO (pull data + verbatims). Si le MCP Facebook est branché,
   pull les stats. Sinon, demande le compte ou les chiffres.
2. Ouvre `references/LOIS_COPY.md` et garde la checklist sous la main.
3. Route l'architecture sur le verbatim.
4. Écris, puis **boucle sur l'audit** jusqu'à zéro violation.
5. Sors le body, les titres, les descriptions. Ne mets aucune donnée non vérifiée
   (chiffre de résultat, montant) sans l'avoir confirmée avec l'utilisateur.

Si l'utilisateur dit juste « corrige » ou « c'est pas fluide » : c'est un signal
d'audit. Passe l'ad à la checklist, identifie la ou les phrases fautives, corrige-les
seulement, explique le pourquoi de chaque correction en une ligne.
