# _inbox — dépôt brut avant intégration

Ce dossier garde les sources telles que reçues. Rien ici ne fait autorité :
seul `../references/` fait foi (protocole README §1-6).

| Source | Statut | Intégré dans |
|---|---|---|
| `info_ads/` (zip info ads) | ✅ **originaux de référence** | remplace les reconstructions : LOIS_COPY, OFFRE_ET_TERRAIN, STATS_TERRAIN, AUDIT_9_FILTRES, DECODEUR_8_LOIS, ADS_ANNOTEES |
| `autonomous-offer-rebuild-main/` | ✅ intégré | `OFFRE.md` (fusionné avec le BLOC 2) |
| `autonomous-market-research-main/` | 🟡 indexé, non exploité | pipeline 50 agents de research concurrentielle — à activer sur une nouvelle niche |
| `autonomous-quiz-funnels-main/` | 🟡 indexé, non exploité | 12 références quiz/paywall/AB-test — branche sur `quiz-funnel-brain` |
| BLOC 2 (texte, hors fichier) | ✅ intégré | `OFFRE.md` |

## Non exploité — ce qui reste à ouvrir

- `autonomous-quiz-funnels-main/references/08-copy-library.md` (17 Ko) — bibliothèque de
  copy, potentiellement redondante avec LOIS_COPY : **à dédupliquer avant intégration**.
- `autonomous-market-research-main` — architecture 50 sous-agents. Ne pas lancer sans
  demande explicite (coût élevé).
- `claude-setup-main.zip`, `ads-winners-loop.zip`, les `.skill` — non ouverts.

## Drop 3 — Jody / webinaire (2026-08-10)

| Source | Statut |
|---|---|
| `jody/webinaire-jody/lois-empiriques.md` (50 Ko, 151 lois SI/ALORS) | 🟡 indexé — **2 conflits relevés, voir ci-dessous** |
| `jody/analyse jean jody/transcripts/` (~8 Mo bruts) | 🟡 non lu — challenge complet J1-J5, Iman Gadhzi, Russell |
| `jody/analyse jean jody/analyses/` | 🟡 non lu — analyses copy phrase par phrase |

### ⚠ Conflits à arbitrer (protocole README §4 — signaler, ne pas trancher en silence)

**LOI 75 Jody — « CTR > 5 % = magnifique »** ⚡
contre **LOI 15 du moteur — « CTR > 4 % = signal d'alarme »** (data MCP, 12 ads).
Sur le compte LV, les 3 meilleurs CTR sont les 3 pires coûts (9,22 % → 30,59 € ;
6,92 % → 0 lead ; 4,41 % → 180,82 €).
→ **Résolution proposée** : contexte. Les lois Jody viennent de funnels **webinaire B2C**
(optin froid, promesse large) où un CTR élevé traduit l'attrait de la promesse. Le moteur
LV vise du **B2B de terrain** où le CTR élevé traduit une curiosité hors-cible.
**Ne pas fusionner ces deux lois. Les garder séparées, chacune avec son contexte.**

**LOI 74 Jody — « CPM < 10 € = chouchou Facebook »** ⚡
contre **LOI 24 du moteur — « le CPM ne diagnostique rien »**.
Sur LV, winners ET mortes sont toutes sous 10 € de CPM (6,07 à 9,49 €). Le CPM ne
sépare rien. → **Le seuil de 10 € reste peut-être valable comme signal de santé
d'ENCHÈRE, mais il ne dit rien de la qualité du COPY.** Deux usages distincts.
