# Moteur d'ads — base de connaissance vivante

Objectif (le `/goal`) : **un moteur de copy publicitaire qui s'affûte à chaque drop de
data.** Chaque fichier envoyé est absorbé ici — pas relu à la volée puis oublié.

Ce dossier est la **maison durable** du skill `publicites-rentables` : les containers de
session sont éphémères, `~/.claude/skills/` ne survit pas. Le repo, si.

## Structure

```
ads-moteur/
├── SKILL.md                       # le moteur (boucle, LOI ZÉRO, routage, règles)
├── references/
│   ├── LOIS_COPY.md               # lois d'écriture + CHECKLIST D'AUDIT
│   ├── EXEMPLES_ADS.md            # 6 ads finales + journal des modifications
│   ├── ADS_WINNERS.md             # les winners annotés + les 2 mortes (perfs réelles)
│   ├── CORRECTIONS.md             # 8 corrections avant/après (mémoire des erreurs)
│   └── OFFRE_ET_TERRAIN.md        # offre, cadrage juridique 11 août, verbatims, lacunes
└── _inbox/                        # zone de dépôt brut avant intégration
```

`LOIS_COPY.md` et `OFFRE_ET_TERRAIN.md` étaient **référencés par le skill mais
manquants**. Reconstitués ici depuis la matière disponible ; les trous sont marqués
`[À SOURCER]`.

## L'état actuel en une ligne

Data qui arbitre : **3 winners** (CPL 2,78 / 2,96 / 3,44 €, registre business) contre
**2 mortes à 0 lead** (registre corps/solitude) et **1 piège à clics** (CTR 4,41 %, CPL
180,82 €). Conclusion tenue par les chiffres : *le registre prime sur l'exécution, et
CTR ≠ CPL.*

## PROTOCOLE D'INTÉGRATION (à chaque drop)

C'est la boucle. Elle se déclenche **quand un fichier arrive**, pas sur un timer — une
boucle qui tourne à vide produit des pâtés (cf. loi anti-réitération).

1. **DÉPÔT** — le brut atterrit dans `_inbox/`, jamais directement dans `references/`.
2. **TRI** — classer chaque élément : *loi d'écriture* → `LOIS_COPY.md` ; *correction
   avant/après* → `CORRECTIONS.md` ; *perf chiffrée* → `ADS_WINNERS.md` ; *verbatim /
   fait offre / fait juridique* → `OFFRE_ET_TERRAIN.md` ; *ad complète* →
   `EXEMPLES_ADS.md`.
3. **DÉDUP** — si la loi existe déjà : ne pas dupliquer, **enrichir** l'existante (ajouter
   la source, l'exemple, la nuance).
4. **CONFLIT** — si une nouvelle loi **contredit** une loi en place : ne pas trancher en
   silence. Signaler le conflit, et arbitrer par la **LOI ZÉRO** (la data et le terrain
   priment sur la théorie, y compris sur ce moteur lui-même). Si aucune data ne tranche,
   demander.
5. **TRAÇABILITÉ** — chaque loi ajoutée porte sa source (fichier d'origine, ou donnée
   compte, ou verbatim). Une loi sans source est une opinion.
6. **COMMIT** — un commit par drop, message = ce qui a été appris.

## Rappels qui coûtent cher

- **LOI ZÉRO** : la data et le terrain arbitrent, jamais la théorie. Pas de chiffres ni
  de verbatims sous la main → aller les chercher ou les demander, **jamais combler**.
- **CTR ≠ CPL.** Le meilleur hook rate du compte était la pire ad (180 € de CPL).
- **Jamais inventer** un verbatim, un client, un fait biographique du fondateur.
- **70 / 30** : 70 % de variations d'un gagnant vérifié (seul le bloc DOULEUR change),
  30 % d'angle neuf tracé à un verbatim.
- **Corriger la phrase fautive, pas toute l'ad.**

## Lacunes ouvertes (ce qui manque pour serrer le moteur)

1. Verbatims terrain réels (Allo / Cerveau Cible / transcripts).
2. Chiffres compte à jour (le MCP Meta n'est pas branché sur cette session).
3. Faits fondateur vérifiés pour le bloc F.
4. Texte exact de la loi n° 2025-594 (montant, périmètre) pour sécuriser le claim.
5. Le zip de lois annoncé.
