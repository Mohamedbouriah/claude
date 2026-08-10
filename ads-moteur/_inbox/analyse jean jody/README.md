# Analyse Challenge Co-Animé Jean & Jodi

## 🎯 Contexte

Challenge de 5 jours co-animé par Jean et Jodi.
Un seul fichier transcript à découper en 5 jours pour analyse comparative avec nos challenges.

## 📦 Setup

1. Télécharger Cursor : https://cursor.sh
2. Créer structure de dossiers (voir ci-dessous)
3. Placer le fichier brut dans `transcripts/raw/challenge-complet.txt`
4. Ouvrir dans Cursor : `cursor .`

## 📂 Structure

```
analyse-challenge/
├── transcripts/
│   ├── raw/challenge-complet.txt        # Fichier original
│   ├── jean-jodi/                       # Après découpage
│   └── vous/                            # Vos challenges
├── analyses/
│   ├── jean-jodi/
│   └── vous/
├── comparatifs/
├── bilan-final.md
└── [fichiers config]
```

## 🚀 Workflow

### Étape 1 : Découpage du Fichier

```
Prompt : "Analyse @transcripts/raw/challenge-complet.txt pour identifier 
les timestamps de séparation entre les 5 jours. Cherche les phrases de 
transition type 'on se retrouve demain', 'bienvenue au jour X', etc."

Résultat : decoupage-jours.md avec timestamps
```

Ensuite, extraire chaque section dans `jean-jodi/jourX.txt`

### Étape 2 : Analyse Jour par Jour

```
Prompt : "Analyse @transcripts/jean-jodi/jour1.txt en suivant la 
méthodologie définie dans @instructions.md. Focus sur la dynamique 
de co-animation (qui parle quand, rôles, complémentarité)"

Répéter pour J2, J3, J4, J5
```

### Étape 3 : Synthèse Évolution

```
Prompt : "Synthétise l'évolution J1→J5 du challenge Jean-Jodi en 
comparant tous les jours d'analyse"
```

### Étape 4 : Analyse de NOS Challenges

Même processus pour nos challenges

### Étape 5 : Comparaison

```
Prompt : "Compare Jean-Jodi vs Nous. Identifie convergences, 
différenciations et opportunités"
```

### Étape 6 : Bilan Final

```
Prompt : "Crée le bilan final complet (25-40 pages) avec toutes 
les synthèses et analyses"
```

## 🔍 Focus Spécial : Co-Animation

L'analyse doit particulièrement identifier :
- **Qui fait quoi** : répartition des rôles Jean/Jodi
- **Complémentarité** : comment ils se complètent
- **Tag-team** : comment ils se passent le relais
- **Impact** : est-ce que ça renforce l'engagement ?
- **Opportunité** : devons-nous considérer la co-animation ?

## 📊 Outputs Attendus

- ✅ `decoupage-jours.md` : timestamps des 5 jours
- ✅ 5 analyses détaillées Jean-Jodi
- ✅ 1 synthèse évolution Jean-Jodi
- ✅ X analyses de nos challenges
- ✅ Comparatifs stratégiques
- ✅ **1 bilan-final.md (25-40 pages)**

## ⚡ Tips Cursor

### Gros Fichier Initial
Si `challenge-complet.txt` est trop lourd :
1. Prompt : "Peux-tu voir le fichier ?"
2. Si non : coller tout le contenu
3. Demander le découpage

### Garder le Contexte
- Utiliser @ pour référencer fichiers
- Les règles `.mdc` sont toujours actives
- Composer (Cmd+I) pour éditer directement

### Identifier Jean vs Jodi
Si le transcript ne distingue pas qui parle :
- Chercher indices contextuels (style, thèmes récurrents)
- Demander à Cursor : "Peux-tu identifier qui parle ici ?"
- Si impossible : noter `[SPEAKER]` et analyser globalement

## 🎓 Modèles Utilisés

- Eugene Schwartz (conscience + sophistication)
- 4 Règles d'Achat Universelles
- Analyse dynamique co-animation
- Approche inductive

---

Bon courage ! 🚀

