---
name: ads-rentables
description: Système de création et d'itération d'ads Meta rentables fondé sur le copy et l'offre uniquement (pas le média-buying technique). Produit des scripts d'ads face-caméra structurés, les audite contre les lois de copy validées terrain, et boucle en auto-correction jusqu'à ce que chaque ad passe tous les filtres. Utiliser ce skill DÈS QUE l'utilisateur veut écrire, réécrire, décliner, varier ou auditer une ad Meta / un script publicitaire / un angle / un hook / un webhook ; décliner un angle winner en variantes ; corriger une ad qui sonne "IA" ou trop générique ; adapter une ad à une cible précise (indépendant vs franchisé vs dirigeant) ; ou transformer un verbatim d'appel client en angle d'ad. Utiliser aussi quand l'utilisateur colle des perfs Meta (CPL, CTR) et demande quelle ad garder/couper/décliner. Le skill boucle : il écrit, il audite, il détecte les défauts, il réécrit, jusqu'à zéro défaut.
---

# Ads Rentables — Copy & Offre

Ce skill produit des ads Meta rentables en travaillant **uniquement le copy et l'offre** — pas le ciblage, pas le pixel, pas la structure de campagne. Il repose sur des lois validées sur le terrain (compte réel, dizaines d'itérations, verbatims d'appels de closing) et fonctionne en **boucle d'auto-correction** : il écrit une ad, l'audite contre chaque loi, détecte les violations, réécrit, et recommence jusqu'à ce que l'ad passe tous les filtres.

## Principe central

Une ad rentable **NOMME** ce que le prospect vit sans l'avoir formulé. Une ad qui échoue **DÉCRIT** ce qu'il sait déjà. Toute la mécanique du skill sert cette distinction.

- DÉCRIRE = « le marché est difficile en ce moment » → le prospect le sait déjà → indifférence
- NOMMER = « t'as plus de mal à les rentrer qu'à les vendre » → il ne l'avait jamais dit comme ça → reconnaissance → mouvement

Le verbatim terrain n'est pas une décoration. C'est le matériau qui permet de NOMMER. **Ne jamais inventer un verbatim.** Si un verbatim manque, aller le chercher dans les transcripts d'appels — jamais le fabriquer. Une ad construite sur un verbatim inventé se repère à l'oral et détruit la crédibilité.

## La boucle (workflow obligatoire)

Le skill ne livre jamais une ad du premier jet. Il boucle :

```
1. BRIEF      → cible + angle + verbatim source
2. STRUCTURE  → placer les 7 blocs canoniques
3. ÉCRITURE   → rédiger en respectant la structure
4. AUDIT      → passer les 6 filtres (voir plus bas)
5. DÉTECTION  → lister chaque violation trouvée
6. Si ≥1 violation → RÉÉCRITURE → retour à l'étape 4
7. Si 0 violation → LIVRAISON
```

**Ne jamais sauter l'audit.** Même une ad qui "semble bonne" doit passer les 6 filtres explicitement. La plupart des défauts (langage IA, verbatim inventé, redescente de douleur) ne se voient qu'en auditant ligne par ligne.

Pour le détail des 6 filtres d'audit, lire `references/lois-audit.md` — à charger AVANT le premier audit.

## La structure canonique (7 blocs)

Les ads winners partagent tous la même ossature. Les blocs A et B se personnalisent selon l'angle ; les blocs D-E-F-G sont quasi invariants (c'est la signature du système).

- **A — Décor concret** : la scène quotidienne du prospect, dans SES mots
- **B — Disculpation** : « et c'est pas toi le problème » + explication mécanique (le prospect n'est pas coupable, le modèle l'est)
- **C — Transition 11 août** : la loi + le montant d'amende + la conséquence concrète sur SON flux
- **D — Bridge** : « sauf qu'entre une solution sur le papier et un système qui livre… il y a un monde » + « le recul ne s'invente pas »
- **E — Preuve sociale** : « on l'a implémenté chez des partenaires… » (anonyme, jamais nominatif sauf accord explicite)
- **F — Pivot fondateur** : « moi c'est [nom], [métier] comme toi »
- **G — CTA** : action simple en 2-3 temps + rareté (« un seul par zone »)

Pour les 6 ads winners complètes annotées bloc par bloc, lire `references/ads-winners.md`.

## Les découvertes de correction (ce qui a été appris en itérant)

Chaque correction ci-dessous vient d'une vraie itération sur un vrai compte. Elles sont la mémoire des erreurs à ne pas refaire. Détail complet avec avant/après dans `references/corrections.md`.

1. **Trop de précision temporelle = signature IA.** « Mardi 6h45, le vendeur revient de sa pause clope à 14h » sonne fabriqué. Les vrais pros parlent par périodes : « le matin », « ces derniers temps », « en ce moment ». Corriger toute scène minutée.

2. **Le calcul en cascade fait décrocher.** Demander au prospect « combien de places × ta marge × … » casse le rythme. Remplacer le calcul par la douleur brute nommée en verbatim.

3. **Respecter l'envergure de la cible.** « Un truc que t'as monté » infantilise un patron. Dire « une affaire », « ce que t'as bâti », « ton réseau ». Le vocabulaire réducteur tue la reconnaissance.

4. **Le registre doit matcher l'audience.** Sur une audience acquisition (business), un angle corporel/santé/solitude tombe à plat (0 lead). Rester dans le business : chiffre, tréso, parc, produit, marge.

5. **Cible unique par ad.** Ne pas mélanger indépendant et franchisé dans une même ad. Le franchisé a « ton réseau / ta redevance / ta réunion » ; l'indépendant a « ton phoning / ta chasse au produit / ton bon coin ». Chaque mot doit appartenir au monde de la cible.

6. **Distinguer les fonctions.** Ne jamais confondre l'outil de VENTE (annonces pour écouler le stock) et l'outil d'ACQUISITION (faire rentrer du produit). Confondre les deux fait perdre toute crédibilité métier.

7. **Preuve sociale anonyme par défaut.** Ne pas citer un client nommément sans accord explicite. « Chez des partenaires » convertit sans exposer personne.

## La loi de l'éloquence orale (filtre final systématique)

Toute ad se lit à voix haute avant livraison. Elle doit passer 4 tests :

1. **Sujet-Verbe-Objet** sur les phrases clés. Max 15% de constructions nominales.
2. **Une idée par phrase.** Couper les « et » qui relient deux idées.
3. **Qui fait quoi à qui, explicite** sur l'argent et l'action. Pas de « par/via/pour » ambigu. « 300€ par voiture » → « sur chaque voiture que tu vends, tu me reverses 300€ ».
4. **Test de lecture à voix haute.** Si ça demande à être expliqué, c'est mal écrit. Clarté avant élégance.

## Corréler avec les perfs (garder / couper / décliner)

Quand l'utilisateur fournit des perfs Meta, appliquer cette logique **copy-only** :

- **Le CPL n'est pas le KPI final.** Une ad à bon CPL peut amener des prospects qui ne closent jamais. Toujours flagger que le vrai juge est le CAC (lead → RDV → vente), même si on ne l'a pas encore.
- **Meta a déjà trié.** Une ad très diffusée (grosses impressions) que Meta a choisi de nourrir est un signal fort. Une ad affamée (quasi 0 impression) a été jugée par l'algo — ne pas s'acharner.
- **0 lead sur volume = angle mort.** Si une ad a eu de la diffusion et 0 lead, l'angle ne parle pas à cette audience. Ne pas la relancer telle quelle.
- **Décliner le winner.** Identifier l'angle au meilleur CPL, puis en faire 3 variantes qui gardent la même douleur avec des entrées différentes. Mettre les variantes d'un même angle dans un même groupe (elles ne se cannibalisent pas). Ouvrir les angles neufs dans un groupe séparé pour ne pas affamer le test.

## Décliner un angle en variantes

Pour multiplier un winner sans le diluer : garder la **douleur centrale** identique, varier seulement l'**entrée** (le bloc A). Exemple sur l'angle « gros chiffre / petit résultat » :

- Variante 1 : le chiffre qui rentre mais rien dans la poche
- Variante 2 : la marge qui fond ligne par ligne (transport, prépa, tréso bloquée)
- Variante 3 : à qui profite vraiment ton chiffre (tu bosses pour tes charges)

Les blocs C-D-E-F-G restent identiques. Seuls A et B changent. C'est ce qui permet à Meta de comparer proprement les accroches sur un même angle.

## Livraison

Livrer en `.txt` propre, prêt prompteur : webhook séparé du script, sauts de ligne respiratoires, aucun crochet ni annotation dans le corps du script (les notes vont en en-tête de bloc). Le fichier doit être copiable-collable directement vers l'outil de tournage.

## Fichiers de référence

- `references/lois-audit.md` — les 6 filtres d'audit détaillés (charger avant tout audit)
- `references/ads-winners.md` — les 6 ads validées, annotées bloc par bloc
- `references/corrections.md` — l'historique des corrections avec avant/après
