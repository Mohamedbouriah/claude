# Veille — Invest Malin (page 672934129241228)

> Relevé Meta Ad Library via MCP, 2026-08-10. **[OBSERVÉ]** sauf mention contraire.
>
> ⚠️ **Limite à connaître** : l'API Ad Library de ce MCP renvoie la *structure*
> (titre du lien, dates, devise, volume) mais **pas le texte des bodies**. Et la lecture
> directe des pages snapshot est bloquée (HTTP 403). **Je n'ai donc lu aucune ligne de
> leur copy.** Tout ce qui suit porte sur leur *dispositif*, pas sur leurs mots.

---

## 1. Ce que le relevé montre

| Observation | Valeur |
|---|---|
| Ads **actives** sur la page | **219** |
| Titre de lien utilisé | **« Service clé en main »** — le même sur la totalité de l'échantillon (50/50) |
| Devise du compte | **AED** (Émirats) pour un marché francophone |
| Vague 1 | **22 ads créées en 56 secondes** (2026-07-16, 21:02→21:03) |
| Vague 2 | **28 ads créées en 243 secondes** (2026-07-31, 00:35→00:39) |
| Écart entre les deux vagues | **14,1 jours** |
| Délai création → diffusion | médiane **3,3 h** · **39/50 en moins de 24 h** |

---

## 2. Ce que cette structure prouve

### a) C'est un dispositif industriel, pas de l'artisanat

**22 ads en 56 secondes**, soit ~2,5 secondes par ad. Personne ne conçoit une créa en
2,5 secondes. C'est un **upload en masse** : les créas sont produites en amont, puis
poussées d'un bloc. La contrainte de production a été déplacée hors de la plateforme.

### b) Le titre n'est pas leur variable — et c'est un choix fort

**219 ads, un seul titre.** Ils ont figé le titre et font varier ailleurs (visuel, body,
hook vidéo). C'est cohérent avec `LOIS_COPY` §8 qui classe la description en dernier
levier — eux vont plus loin et neutralisent aussi le titre.

**Conséquence pour toi** : leur volume de test ne porte pas sur les mots du titre. Chercher
leur secret dans « Service clé en main » serait une impasse. Le titre est un **plancher de
clarté**, pas un argument.

### c) 219 ads actives = l'application industrielle de « la créa EST le ciblage »

C'est exactement la logique établie dans `RETENTION_ET_ALGO` §4 : le retrieval sait
trouver la personne qui correspond à une créa donnée dans un vivier immense. Leur réponse
est de **saturer l'espace des variantes** et de laisser l'algorithme apparier.

Ordre de grandeur à retenir : **219 ads actives contre 3-5 chez toi.** Ce n'est pas la
même stratégie de couverture.

### d) La cadence de 14 jours correspond au cycle de fatigue mesuré

`STATS_TERRAIN` §3 : fréquence > 2 sur 7 jours glissants = saturation, CPL qui dérive.
Un renouvellement de lot **tous les 14 jours** est précisément calibré sur ce cycle.
**[INFÉRÉ]** mais la coïncidence est nette.

### e) La devise AED est une information de structure

Compte publicitaire en dirhams pour un marché francophone. Ça dit quelque chose de leur
montage (entité aux Émirats), **pas** de leur copy. À ne pas confondre avec un levier
marketing.

---

## 3. ⛔ Ce que je ne peux PAS te dire, et pourquoi

Tu dis qu'ils sont « très forts pour parler aux croyances fondamentales des Français ».
**C'est probablement vrai, et je n'ai aucun moyen de le vérifier ici** : je n'ai pas accès
à une seule de leurs phrases.

Écrire une analyse de leur registre, de leurs croyances-cibles ou de leur disculpation à
partir de leur *seul titre de lien* produirait exactement ce que ton `LOIS_COPY` §6 appelle
un **pastiche** : tous les marqueurs de l'analyse, zéro contenu réel. La LOI ZÉRO
l'interdit. Donc je m'arrête ici.

---

## 4. Comment obtenir la matière manquante

**Option A — la plus rapide.** Ouvre 8-10 de ces liens et colle-moi les textes (ou des
captures). Je fais tourner dessus le `DECODEUR_8_LOIS` complet : noyaux, freins, croyances
emboîtées, manque inédit, et je compare à ton corpus.

Échantillon d'ads actives à ouvrir :
- https://www.facebook.com/ads/library/?id=2130664801166149
- https://www.facebook.com/ads/library/?id=1019246710872846
- https://www.facebook.com/ads/library/?id=900547736003448
- https://www.facebook.com/ads/library/?id=2247984422650559
- https://www.facebook.com/ads/library/?id=2042937139923703
- https://www.facebook.com/ads/library/?id=27316699174693018
- https://www.facebook.com/ads/library/?id=1061207233307832
- https://www.facebook.com/ads/library/?id=1396091815722024

**Option B.** `cc_miner.py` sur des requêtes confessionnelles de leur niche
(« je veux investir mais j'ai peur de me planter », « louer mon appartement en courte
durée ça vaut le coup »). Ça ne donne pas *leur* copy, mais ça donne **la même matière
1A/1B qu'ils exploitent** — ce qui est souvent plus utile que de recopier un concurrent.

**Option C.** Ad Library en direct, filtre France + page Invest Malin, en tri par date.
Ce que tu verras que je ne vois pas : les **visuels** et les **premières lignes**.

---

## 5. La question à garder en tête quand tu liras leur copy

D'après tout le corpus, la vraie question n'est pas « comment parlent-ils ? » mais :

> **Sur quelle croyance déjà portée par le Français moyen leur offre vient-elle s'emboîter
> — et quel échec passé réattribuent-ils vers l'extérieur ?**

(Les 3 conditions de l'Emboîteur, `DECODEUR_8_LOIS`.) Sur une cible large, l'emboîtement
doit se faire sur une croyance **quasi universelle** — c'est probablement là que se joue
leur largeur d'audience, et c'est ce qu'il faudra vérifier phrase par phrase.
