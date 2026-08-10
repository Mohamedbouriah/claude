# INSTRUCTIONS - ANALYSE CHALLENGE CO-ANIMÉ JEAN & JODI

## CONTEXTE SPÉCIFIQUE

**SITUATION** : 
- Un challenge de 5 jours co-animé par Jean et Jodi
- UN seul fichier transcript brut : `challenge-complet.txt`
- À découper en 5 jours selon timestamps
- À comparer avec NOS challenges

## OBJECTIFS

1. **Découper le fichier** en 5 jours
2. **Analyser chaque jour** (structure, ICP, rétention)
3. **Comprendre la dynamique co-animation** (qui fait quoi)
4. **Identifier leur stratégie globale**
5. **Comparer avec nos challenges**
6. **Trouver opportunités de différenciation**

## WORKFLOW COMPLET

### PHASE 0 : Découpage du Fichier (PREMIÈRE ÉTAPE)

**Prompt Cursor** :
```
Analyse @transcripts/raw/challenge-complet.txt pour identifier les séparations entre les 5 jours.

Cherche :
- Phrases de transition ("on se retrouve demain", "bienvenue au jour X")
- Salutations de début de session
- Changements de date/jour mentionnés
- Timestamps qui suggèrent un nouveau départ

Liste les timestamps de coupure :
Jour 1 : [00:00] → [?]
Jour 2 : [?] → [?]
Jour 3 : [?] → [?]
Jour 4 : [?] → [?]
Jour 5 : [?] → [FIN]

Sauvegarde cette information dans decoupage-jours.md
```

**Ensuite** : Extraire manuellement ou avec Cursor chaque section dans un fichier séparé.

### PHASE 1 : Analyse Individuelle des Jours

Pour chaque jour (commencer par Jour 1) :

**Prompt** :
```
Analyse @transcripts/jean-jodi/jour1.txt selon la méthodologie définie.

Focus spécial sur :
1. Dynamique co-animation (qui parle quand, répartition rôles)
2. Structure découverte (sections avec timestamps)
3. ICP révélé (citations exactes)
4. Mécanismes de rétention
5. Niveau conscience et sophistication

Format : markdown pour sauvegarder dans analyses/jean-jodi/jour1-analyse.md
```

Répéter pour J2, J3, J4, J5.

### PHASE 2 : Synthèse Évolution J1→J5

**Prompt** :
```
Synthétise l'évolution du challenge Jean-Jodi sur les 5 jours en comparant :
@analyses/jean-jodi/jour1-analyse.md
@analyses/jean-jodi/jour2-analyse.md
@analyses/jean-jodi/jour3-analyse.md
@analyses/jean-jodi/jour4-analyse.md
@analyses/jean-jodi/jour5-analyse.md

Identifie :
- Évolution structure et durées
- Escalade de valeur
- Évolution rôles Jean/Jodi
- Concentration des objections
- Transformation du CTA

Format : analyses/jean-jodi/evolution-j1-j5.md
```

### PHASE 3 : Analyse de NOS Challenges

Répéter PHASE 1 pour nos propres challenges :
- Analyser chaque jour
- Créer synthèse

### PHASE 4 : Comparaison Stratégique

**Prompt** :
```
Compare le challenge Jean-Jodi avec nos challenges en utilisant :
@analyses/jean-jodi/synthese-complete.md
@analyses/vous/synthese-nos-challenges.md

Identifie :
- Convergences (ce qu'on fait tous)
- Différenciations eux (ce qu'eux seuls font)
- Différenciations nous (ce que nous seuls faisons)
- Zones vides (opportunités non exploitées)

Focus spécial sur :
- Impact de la co-animation vs solo
- Mécanismes de rétention comparés
- Sophistication marketing comparée

Format : comparatifs/eux-vs-nous.md
```

### PHASE 5 : Bilan Final

**Prompt** :
```
Crée le bilan final complet incluant :
@analyses/jean-jodi/synthese-complete.md
@analyses/vous/synthese-nos-challenges.md
@comparatifs/eux-vs-nous.md

Structure :
1. Executive Summary
2. Analyse Challenge Jean-Jodi (structure, dynamique, mécanismes)
3. Analyse Nos Challenges
4. Comparaison Stratégique (tableau complet)
5. Patterns Communs
6. Différenciations
7. Impact de la Co-Animation (analyse spécifique)
8. Zones Vides (opportunités)
9. Plan d'Action Priorisé
10. Recommandations Finales

Format : bilan-final.md (20-30 pages)
```

## MODÈLES THÉORIQUES

### Niveaux de Conscience (Eugene Schwartz)
1. Unaware
2. Problem Aware
3. Solution Aware
4. Product Aware
5. Most Aware

### Niveaux de Sophistication (Eugene Schwartz)
1. Direct Claim
2. Amplified Claim
3. Unique Mechanism
4. Enhanced Mechanism
5. Identity/Experience

### Les 4 Règles d'Achat
1. Ils veulent ce qu'ils DÉSIRENT
2. Ils le veulent MAINTENANT
3. Sans EFFORTS
4. De quelqu'un de CONFIANCE

## SPÉCIFICITÉS CO-ANIMATION À ANALYSER

### Dynamique de Tag-Team
- Qui ouvre chaque jour ?
- Qui ferme chaque jour ?
- Comment se passent-ils le relais ?
- Y a-t-il des dialogues entre eux ?

### Répartition des Rôles
- Jean = expert technique/storyteller/closer/autre ?
- Jodi = expert technique/storyteller/closer/autre ?
- Complémentarité intentionnelle ?

### Impact sur l'Audience
- La co-animation renforce-t-elle la crédibilité ?
- Crée-t-elle plus de variété/engagement ?
- Y a-t-il des moments "faibles" avec un seul intervenant ?

### Opportunités pour VOUS
- Devriez-vous considérer la co-animation ?
- Si oui, avec quel profil complémentaire ?
- Si non, comment compenser l'effet de variété ?

## FORMAT DES ANALYSES

Chaque `jourX-analyse.md` doit contenir :

```markdown
# JEAN-JODI - JOUR X - ANALYSE

## MÉTADONNÉES
- Durée totale : __ minutes
- Timestamp début : [00:00]
- Timestamp fin : [XX:XX]
- Sections identifiées : __

## RÉPARTITION JEAN/JODI
- Jean présent : __% du temps
  - Rôle principal : _______________
  - Moments clés : [timestamps]
- Jodi présent : __% du temps
  - Rôle principal : _______________
  - Moments clés : [timestamps]
- Tag-team observés : __

## STRUCTURE DÉCOUVERTE
Section 1 [00:00-XX:XX] : _______________ (Jean/Jodi/Les deux)
Section 2 [XX:XX-XX:XX] : _______________ (Jean/Jodi/Les deux)
[...]

## ICP RÉVÉLÉ
[Citations avec [timestamp] + [Jean/Jodi si identifiable]]

## CROYANCES & OBJECTIONS
[Extractions avec timestamps + qui traite]

## MÉCANISMES DE RÉTENTION
- Quick win : _______________ (promis par qui ?)
- Boucle ouverte : _______________ (créée par qui ?)
- Activation communauté : _______________ (qui anime ?)

## PREUVES SOCIALES
- Total témoignages : __
- Apportés par Jean : __
- Apportés par Jodi : __
- [Détails...]

## SOPHISTICATION
- Niveau conscience : __/5 (justification)
- Niveau sophistication : __/5 (justification)
- Mécanisme unique : _______________ (nommé par qui ?)

## OBSERVATIONS DYNAMIQUE CO-ANIMATION
- Complémentarité : _______________
- Synergie observée : _______________
- Points faibles : _______________
- Impact sur engagement : _______________
```

## TIPS DÉCOUPAGE FICHIER LOURD

### Indices de Séparation Entre Jours

**Chercher ces patterns** :
- "On se retrouve demain"
- "À demain"
- "Rendez-vous demain à [heure]"
- "Bienvenue au jour 2/3/4/5"
- "Bonjour et bienvenue dans ce jour X"
- "On reprend aujourd'hui avec..."
- "Comme promis hier..."

**Timestamps indicatifs** :
- Si le fichier a des timestamps qui "reset" (ex: retour à 00:00)
- Si les timestamps sont cumulatifs, chercher moments de clôture/réouverture

**Durées typiques** :
- Jour 1 : souvent 30-60 min
- Jour 2 : souvent 45-75 min
- Jour 3 : souvent 60-90 min (pic de valeur)
- Jour 4 : souvent 60-90 min (objections)
- Jour 5 : souvent 90-120 min (pitch)

## DELIVRABLE FINAL

Le `bilan-final.md` doit contenir :

1. **Executive Summary** (2 pages max)
   - Synthèse Jean-Jodi
   - Synthèse nos challenges
   - 3 insights majeurs

2. **Analyse Challenge Jean-Jodi** (5-8 pages)
   - Architecture globale
   - Dynamique co-animation
   - ICP et croyances
   - Mécanismes de rétention
   - Sophistication marketing

3. **Analyse Nos Challenges** (5-8 pages)
   - Même structure

4. **Comparaison Stratégique** (3-5 pages)
   - Tableau comparatif détaillé
   - Convergences
   - Différenciations

5. **Impact Co-Animation** (2-3 pages)
   - Avantages observés
   - Inconvénients potentiels
   - Opportunité pour nous ?

6. **Zones Vides** (2-3 pages)
   - Ce que personne ne fait
   - Opportunités inexploitées

7. **Plan d'Action** (3-5 pages)
   - Optimisations prioritaires
   - Tests à mener
   - Timeline implémentation

8. **Recommandations Finales** (1-2 pages)
   - Stratégie de différenciation
   - Co-animation : oui/non/comment
   - Next steps

---

**TOTAL ATTENDU : 25-40 pages de bilan actionnable**

