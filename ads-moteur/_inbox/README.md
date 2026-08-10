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
