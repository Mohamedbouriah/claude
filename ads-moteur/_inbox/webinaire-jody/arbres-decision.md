# ARBRES DE DÉCISION

> **Statut :** Couche 1 — Squelette + arbres extraits Batch 1
> **Évolution :** chaque diagnostic récurrent observé devient un arbre

## Objet

Ces arbres servent à **diagnostiquer rapidement** un cas opérationnel. Ils transforment une situation floue en plan d'action structuré, en identifiant le rouage défaillant et les lois applicables.

---

## ARBRE 1 — Diagnostic général d'un webinaire qui n'a pas converti

```
RÉSULTAT : 0 vente ou conversion < 1%
    │
    ├── Question 1 : Combien d'inscrits ?
    │       │
    │       ├── < 50 → Problème de pub/pageoptin → ARBRE 2
    │       └── ≥ 50 → Continuer
    │
    ├── Question 2 : Show-up rate ?
    │       │
    │       ├── < 20% → Problème de relances → ARBRE 3
    │       └── ≥ 20% → Continuer
    │
    ├── Question 3 : Durée moyenne de présence ?
    │       │
    │       ├── < 30 min → Problème de storytelling/intro → ARBRE 4
    │       └── ≥ 1h → Continuer
    │
    ├── Question 4 : Comportement à l'annonce de l'offre ?
    │       │
    │       ├── 50%+ partent → Problème pivot/transition → ARBRE 5
    │       └── Restent jusqu'au prix → Continuer
    │
    └── Question 5 : Restent jusqu'au prix mais 0 vente
            │
            └── Problème : OFFRE pas market fit → ARBRE 6
```

---

## ARBRE 2 — Diagnostic CPL/Pubs

```
CPL > attendu pour la niche (cf. benchmarks.md)
    │
    ├── CPL stable depuis 7+ jours
    │       │
    │       ├── Créa fatiguée (CPM hausse, fréquence > 3) 
    │       │       → Renouveler créatives
    │       │
    │       └── Mauvais ciblage 
    │               → Retravailler audience (intérêts + broad)
    │
    └── CPL en hausse récente
            │
            ├── Récente augmentation budget > 20% en 48h ?
            │       OUI → LOI 71 violée → revenir au budget précédent
            │
            ├── Modification récente de la campagne ?
            │       OUI → LOI 73 violée → restaurer paramètres précédents
            │
            └── Aucun changement
                    → Saisonnalité ou concurrence accrue
                    → Tester nouveaux angles créatifs
```

---

## ARBRE 3 — Diagnostic Show-up faible

```
SHOW-UP < 25%
    │
    ├── Q1 : Phone calls activés ?
    │       │
    │       ├── NON → LOI 87 → ajouter phone calls (+5 à +10 pts)
    │       └── OUI → continuer
    │
    ├── Q2 : Numéro Twilio adapté ?
    │       │
    │       ├── Numéro étranger (Texas par défaut) → changer pour FR
    │       └── Numéro FR → continuer
    │
    ├── Q3 : Canal instantané (WhatsApp/Messenger) actif ?
    │       │
    │       ├── NON → LOI 88 → ajouter WhatsApp
    │       └── OUI → continuer
    │
    ├── Q4 : Vidéo de confirmation sur page remerciement ?
    │       │
    │       ├── NON → LOI 89 → ajouter vidéo
    │       └── OUI → continuer
    │
    ├── Q5 : Séquence email complète (J-3, J-1, J, H-1) ?
    │       │
    │       ├── NON → compléter la séquence
    │       └── OUI → continuer
    │
    ├── Q6 : Heure et jour du webinaire ?
    │       │
    │       ├── Dimanche 17h ou heure étrange → tester 18h ou 20h
    │       ├── Décembre (sauf Black Friday) → reporter
    │       └── Standard → continuer
    │
    └── Q7 : Mismatch pub/page d'optin ?
            → Vérifier que la promesse de la pub correspond au webi
            → Vérifier les vidéos d'endoctrinement
```

---

## ARBRE 4 — Diagnostic Décrochage précoce (< 30 min)

```
LES GENS QUITTENT TÔT LE WEBINAIRE
    │
    ├── Q1 : Storytelling personnel présent au démarrage ?
    │       │
    │       ├── NON → LOI 1 violée → ajouter storytelling 5-10 min
    │       └── OUI → continuer
    │
    ├── Q2 : Promesse claire dans les 5 premières minutes ?
    │       │
    │       ├── NON → annoncer le bénéfice et le déroulé
    │       └── OUI → continuer
    │
    ├── Q3 : Sondages interactifs au démarrage ?
    │       │
    │       ├── NON → LOI 6 (engagement) → 2 sondages dans les 10 premières min
    │       └── OUI → continuer
    │
    ├── Q4 : Durée totale annoncée correcte ?
    │       │
    │       ├── Webi annoncé 1h, dure 2h → frustration
    │       └── OUI → continuer
    │
    └── Q5 : Niche / audience cohérence ?
            → Vérifier ciblage Meta vs avatar réel
            → Vérifier promesse de la pub
```

---

## ARBRE 5 — Diagnostic Décrochage à l'offre

```
50%+ DES GENS PARTENT À L'ANNONCE DE L'OFFRE
    │
    ├── Q1 : Pivot/transition exécuté ?
    │       │
    │       ├── NON (passage abrupt enseignement → vente) → LOI 10
    │       │       → Construire pivot 5 min
    │       └── OUI → continuer
    │
    ├── Q2 : Prix annoncé avant la valeur ?
    │       │
    │       ├── OUI → LOI 13 violée → réorganiser ordre 16 étapes
    │       └── NON → continuer
    │
    ├── Q3 : Ratio valeur/prix ≥ 10x ?
    │       │
    │       ├── NON (ex: 1500€ valeur pour 1000€ prix) → LOI 12 violée
    │       │       → Augmenter valeur perçue (bonus)
    │       └── OUI → continuer
    │
    ├── Q4 : 4 portes Brunson ouvertes (LOI 2) ?
    │       │
    │       ├── Porte 4 (capacité) souvent oubliée
    │       │       → Ajouter cas d'élèves "comme eux"
    │       │
    │       └── Vérifier les 4 portes
    │
    └── Q5 : Trop de comment donné en amont (LOI 4) ?
            → Réécrire phase enseignement focus QUOI/POURQUOI
```

---

## ARBRE 6 — Diagnostic Offre pas market fit

```
GENS PRÉSENTS JUSQU'AU PRIX, 0 VENTE
    │
    ├── Q1 : Recontacter les leads chauds en vocal WhatsApp (LOI 101)
    │       │
    │       └── COLLECTE des objections réelles
    │
    ├── Q2 : Quelle objection dominante ?
    │       │
    │       ├── "Trop cher"
    │       │       │
    │       │       ├── Vérifier règle prix/lead (LOI 26)
    │       │       │       Mismatch : CPL 2€ + prix 1000€ → écart audience
    │       │       │
    │       │       ├── Tester rattrapage à prix /3 (LOI 102)
    │       │       │
    │       │       └── Si confirmé : baisser prix sur prochain webi
    │       │
    │       ├── "Pas le moment"
    │       │       │
    │       │       └── FOMO insuffisamment activée (LOI 42)
    │       │               → Renforcer scarcity réelle (LOI 41)
    │       │
    │       ├── "Pas pour moi"
    │       │       │
    │       │       └── Porte 4 Brunson fermée (LOI 2)
    │       │               → Ajouter cas d'élèves identifiables
    │       │
    │       └── "Je vais réfléchir"
    │               │
    │               └── Pas d'urgence + faible désir
    │                       → Renforcer storytelling émotion + scarcity
    │
    └── Q3 : Format webinaire adapté au prix ?
            │
            ├── Prix > 1000€ et vente directe → LOI 117
            │       → Passer aux appels stratégiques
            │
            └── Prix < 500€ et vente complexe (calls) → simplifier
```

---

## ARBRE 7 — Choix du canal de relance

```
QUEL CANAL DE RELANCE PRINCIPAL UTILISER ?
    │
    ├── Type d'avatar ?
    │       │
    │       ├── Avatar 50+ / peu tech → Phone call + Email
    │       │
    │       ├── Avatar 30-50 mainstream → WhatsApp + Email + Phone
    │       │
    │       ├── Avatar tech/jeune → Telegram + Discord + Email
    │       │
    │       └── Avatar B2B → Email + LinkedIn + WhatsApp pro
    │
    ├── Volume d'inscrits ?
    │       │
    │       ├── < 100 → Groupe WhatsApp simple (interaction)
    │       │
    │       ├── 100-500 → Communauté WhatsApp ou Messenger MiniChat
    │       │
    │       └── 500+ → Communauté WhatsApp (annonces)
    │
    └── Niche bienveillante / agressive ?
            │
            ├── Bienveillante (parentalité, fertilité, spiritualité)
            │       → Groupe WhatsApp avec interaction (entraide)
            │
            └── Agressive / make money / B2B
                    → Communauté annonces (éviter spam)
```

---

## ARBRE 8 — Diagnostic CPL collapse soudain

```
CPL × 5-10 DU JOUR AU LENDEMAIN
    │
    ├── Q1 : Augmentation budget récente > 20% ?
    │       │
    │       └── OUI → LOI 71 violée
    │               → Revenir au budget précédent
    │               → Attendre 7-10 jours stabilisation
    │               → Reprendre scaling +20%/48h
    │
    ├── Q2 : Modification campagne (créa, audience, ciblage) ?
    │       │
    │       └── OUI → LOI 73 violée
    │               → Restaurer paramètres précédents
    │
    ├── Q3 : Notification Facebook (politique, vérification) ?
    │       │
    │       └── OUI → traiter le ticket avant scaling
    │
    └── Q4 : Aucun de ces facteurs
            │
            └── Possible :
                ├── Concurrence accrue (autre acteur sur même audience)
                ├── Saisonnalité brutale (Black Friday voisin)
                ├── Changement algo Facebook
                └── Action : tenir, ne rien toucher 7 jours, observer
```

---

## ARBRE 9 — Décision sur structure offre (durée d'accompagnement)

```
QUELLE DURÉE D'ACCOMPAGNEMENT POSITIONNER ?
    │
    ├── Type de transformation ?
    │       │
    │       ├── Tactique (ex: créer offre webinaire) → 4-12 semaines
    │       │
    │       ├── Habitude (ex: routine alimentaire) → 3-6 mois
    │       │
    │       ├── Identité (ex: reconversion, mindset) → 6-12 mois
    │       │
    │       └── Long terme (ex: investissement, parentalité) → 12 mois+
    │
    ├── Capacité d'animation ?
    │       │
    │       ├── Solo, temps limité → Cohorts plus courtes (3-6 mois)
    │       │
    │       ├── Avec coachs → Plus longues possibles
    │       │
    │       └── Communauté à vie en parallèle → Indépendant durée formation
    │
    └── Pricing cohérence ?
            │
            ├── Durée 12 mois → prix > 1000€ minimum
            │
            ├── Durée 6 mois → prix 500-1500€
            │
            └── Durée 3 mois → prix 300-800€
```

---

## ARBRE 10 — Format de vente (direct vs appels)

```
COMMENT VENDRE DANS LE WEBINAIRE ?
    │
    ├── Prix ?
    │       │
    │       ├── < 500€ → Vente directe (LOI 116)
    │       │
    │       ├── 500-1000€ → Vente directe OU hybride
    │       │
    │       ├── 1000-2000€ → Hybride (LOI 117)
    │       │       → Bouton vente directe + bouton "réserver appel"
    │       │
    │       └── > 2000€ → Appels stratégiques uniquement (LOI 118)
    │               → Anti-vente : pas de prix annoncé
    │
    ├── Niche complexe ?
    │       │
    │       ├── B2B / coaching premium → Appels même < 1000€
    │       │
    │       └── Mass market → Vente directe préférée
    │
    └── Audience prête à acheter en ligne ?
            │
            ├── Audience digital native → Vente directe
            │
            └── Audience trad / âgée → Appels rassurants
```

---

## À enrichir aux prochains batches

- [ ] ARBRE 11 — Diagnostic conversion correcte mais peu de ventes en valeur (problème panier moyen)
- [ ] ARBRE 12 — Choix de la promesse principale du webinaire
- [ ] ARBRE 13 — Diagnostic taux de remboursement élevé
- [ ] ARBRE 14 — Décision sur l'evergreen vs live
- [ ] ARBRE 15 — Diagnostic conversion bonne mais leads chauds qui ghostent en closing
