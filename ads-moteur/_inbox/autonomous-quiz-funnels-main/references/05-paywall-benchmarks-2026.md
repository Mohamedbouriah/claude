# 05 — Paywall Benchmarks 2026

Hard data from RevenueCat (115k apps, $16B revenue, 1B+ transactions) and Adapty (16k apps, $3B revenue) — the two largest subscription paywall datasets.

Use these to argue for or against a strategic choice with evidence, not vibes.

---

## Headline conversion benchmarks

### Hard paywall vs freemium (RevenueCat 2026)

| Metric | Hard paywall (median) | Freemium (median) | Gap |
|---|---|---|---|
| Download → paid @ D35 | **10.7%** | 2.1% | **5x** |
| Revenue / install @ D14 | $2.32 | $0.27 | 8-9x |
| Revenue / install @ D60 | $3.09 | $0.38 | 8x |
| Year-1 retention | ~27% | ~28% | Identical |

**Top-10% hard paywalls hit 38.7% D35 conversion.** Y1 retention is identical, killing the "freemium retains better" myth.

### Soft paywall counterpoint (Adapty 2026)

- Soft paywalls **out-convert hard paywalls by ~50%** on paywall-view-to-payment
- BUT hard paywalls produce **21% higher 1-year LTV** ($41.90 vs $20.00 median)
- Top performers on hard paywalls: **$89.90 LTV** (90th percentile)

Pick by CAC economics, not ideology.

### Pricing tier impact (RevenueCat 2026)

| Price tier | D35 conversion | Month 1 RLTV | Year 1 RLTV |
|---|---|---|---|
| **High-priced** | 2.8% | $35.89 | **$62.19** |
| Mid-priced | 2.0% | $15.78 | $28.75 |
| Low-priced | 1.4% | $6.67 | $10.69 |

**High-priced apps earn ~6x the Year-1 LTV of low-priced.** Premium positioning pays even with lower conversion.

### iOS vs Android (RevenueCat 2026)

- Android D35 conversion: **0.9%** median
- iOS D35: **2.6%** median (~3x gap)
- Once in trial: Android 32.5% / iOS 32.6% trial-to-paid (**equalized**)
- Annual install-to-paid gap: **iOS 3.6x Android** (Adapty 2026)
- iOS generates **~85% of subscription revenue** despite smaller user base

**Takeaway**: the Android gap is entry-funnel, not conversion quality. Fix the paywall-view rate on Android, not trial-to-paid.

### Geography (RevenueCat 2026)

Download → trial medians:
- North America: 7.1%
- APAC: 5.7%
- Western Europe: 5.0%
- India / SEA: 3.0-3.7%

Trial → paid medians by category:
- Travel: 43.5% (highest)
- Health & Fitness: 37.7%
- Shopping: 36.6%
- India / SEA: 15.2% (regional drag)

**European pricing now exceeds North America** (+18% YoY) per Adapty 2026.

---

## Trial mechanics

### Trial length → conversion (RevenueCat 2026)

| Trial length | Trial → paid | Day 0 cancel rate |
|---|---|---|
| ≤4 days | 25.5% | 55.4% |
| 5-9 days | 37.4% | 39.8% |
| 17-32 days | **42.5%** | 31.1% |

Long trials convert ~70% better in raw data — yet industry trend is the opposite (≤4-day trials grew 42.1% → 46.5% YoY) due to cash conversion cycle pressure.

### Day 0 dominance

- **89.4-90% of trial starts happen Day 0** (RevenueCat / Adapty 2026)
- **44.5% of all purchases happen Day 0** (Adapty 2026)
- **84% of 3-day trial cancellations happen Day 0-1**
- Business category trial start Day 0: 89.9%
- Productivity Day 0: 78.0%

### Trial impact on LTV by category (Adapty 2026)

| Category | Trial users LTV | Direct buyers LTV | Verdict |
|---|---|---|---|
| Health & Fitness | High | Lower | Trial wins |
| Education | High | Lower | Trial wins |
| Utilities | High | Lower | Trial wins |
| AI companion apps | $66.70 | $49.92 | Trial wins (+34%) |
| Productivity | $49.13 | **$56.95** | **Direct wins** |
| Lifestyle | -21% | Higher | **Direct wins** |
| Graphics & Design | Lower | Higher | **Direct wins** |

### Top trial config (Adapty 2026)

> Weekly $5.99 + 3-day trial = **1.5x average LTV** vs all other configs.
> 12-month LTV $54.50 for weekly+trial vs $7.40 without (+636%).

Best practice: attach trials to **annual plans only**, **7-day or shorter** in most categories.

---

## Plan duration architecture

### Most-sold duration by category (RevenueCat 2026)

| Category | Dominant plan |
|---|---|
| Gaming | **82% weekly** |
| Productivity | 77% yearly |
| Health & Fitness | 68% annual |
| Business | Annual-heavy |
| Travel | Cheap yearly ($20 median) |

### Median prices (RevenueCat 2026)

- Weekly: $5.00-$5.90
- Monthly: $7-$10
- Yearly: $31.60-$34.80
- Education yearly: **$44.99 (highest)**
- Business yearly: $35.64
- Health & Fitness yearly: $35.64
- Travel yearly: $20.00 (lowest)

### Weekly plans now dominate revenue (Adapty 2026)

- Weekly plans = **55.6% of subscription revenue** (up from 43.3% in 2024)
- Weekly + 3-day trial = highest 12-month LTV ($54.50, +636% vs weekly without trial)
- BUT 65% of weekly users cancel within first 30 days
- Higher-priced weekly tiers retain **+12% better** at first renewal

**Weekly is a volume play, annual is retention.** Both have a place.

### Monthly is most price-sensitive

Monthly conversion drops ~53% as prices move low → mid (Adapty 2026). Keep monthly **high-margin for low-intent users** — never the volume tier.

### Annual default (Sunflower / Stormy)

- Monthly default → <20% switch to annual
- Annual default → 40-60% stay on annual
- Defaulting to annual = **2-3x annual adoption** + **+70% annual revenue mix**, zero other changes
- Y1 retention: 13.8% of monthly subs active vs **33.9% for annual**

**Always preselect annual** unless you're a gaming app (weekly dominant).

---

## A/B test win rates by type (Adapty 2026)

| Test type | % tests with LTV win |
|---|---|
| **Localization** | **62.3%** (highest) |
| Trial structure | 59.6% |
| Plan duration | 58.7% |
| Number of plans | 57.1% |
| Price changes | 45.5% LTV (28.3% raw conv — price tests lift $, not %) |
| Visual/copy-only | 34.6% (lowest) |

**Apps running 14.7+ experiments/year earn up to 40x more revenue** than non-testers.

**Implication**: prioritize localization and trial structure tests. Visual/copy is the lowest-win-rate type — don't start there.

---

## Paywall element prevalence (RevenueCat 2026 dataset)

What current paywalls in the wild use:

| Element | % of paywalls |
|---|---|
| Highlighted pricing | 74.5% |
| Multi-plan layout | 59.2% |
| Free trial messaging | 54.0% |
| Testimonials | 5.9-16.9% (by category) |
| Countdown timers | ≤1.4% |
| Progress bars | ≤0.2% |

**Underused elements** (testimonials, scarcity tactics) are opportunities — but real, not fake.

---

## Specific A/B test results (with lift %)

### RevenueCat's 4 redesign case studies

| App type | Winning changes | Lift |
|---|---|---|
| Crypto portfolio | "Buy The Dip" messaging, price chart, SALE framing | 2.7% → 3.24% (+20%) |
| Driver-license prep | Short-form layout, trial toggle, real reviews, weekly anchor + 40% savings | **+17.02% ARPU** |
| Party game | Short-form, 3 plans → 2, "SAVE 83%", weekly breakdown, playful illustrations, "Continue" CTA | **+31% install-to-trial, +64% revenue** |
| Food app | Trial toggle, simplified, real reviews, "86% improved diet" stat, side-by-side pricing, $2.49/mo equiv, "SAVE 40%" badge | **+72% install-to-trial** |

### Superwall case studies

| Experiment | Lift |
|---|---|
| Trial reminders added | **+48% revenue, +46% trial conversions, +30% trial starts** |
| Annual preselected by default | **+70% annual revenue mix** |
| UI "dopamine" graphics | +15% engagement |
| Transaction-abandon paywall | **17% of total revenue** (variant 6.3% conv vs 3.3% control) |
| Targeting unsubscribed users | **+240% trial starts, +97% proceeds/user** |
| Testing introductory offers | +20% conversions |
| **Average Superwall test framework lift** | **+20% revenue floor** |

### Blinkist Honest Paywall

- Timeline paywall (Today → Reminder → End): **+23% trial conversions, –55% complaints, +1,200% notification opt-ins (6% → 74%), +4% trial retention**
- Sanctioned by Apple as the canonical alternative to toggle paywalls

### FitnessAI / Rootd paywall placement

- FitnessAI: paywall before onboarding → +50% paywall visibility, **2x install-to-trial**, stable trial-to-paid
- Rootd: paywall to front of onboarding (dismissible) = **5x revenue**

### Exit-intent / second offer

- Exit-drawer (reframe → downsell → 25-33% OTO): **+15-20% total revenue**
- ~10% of abandoning users accept discount-without-trial offer
- Cap at 2-3 exposures (Apple rejects aggressive)

### Dynamic / segmented paywalls

- Dynamic with segmented/time-based discounts: **+35% vs static**
- Tailored paywalls: **+15% vs generic** (Superwall)
- Abandoner re-targeting via special offer: **+25%** on re-engagement

---

## Web-to-app vs IAP — RevenueCat A/B test

Post-Epic v. Apple (April 2025), the data:

| Variant | Initial conv | Trial → paid | Overall paid | $/customer | Net after Apple fee |
|---|---|---|---|---|---|
| **IAP-only** | **27.0%** | 25.0% | 6.3% | $2.98 | **$2.09** |
| IAP + Web button | 23.5% | 28.2% | 5.9% | $2.46 | — |
| Web-only | 18.1% | 26.3% | 5.3% | $2.09 | $1.96 |

**Web-only loses 6.5% net revenue vs IAP-only**, even after avoiding Apple's 30%.

**Verdict 2026**: hybrid IAP + web button is sweet spot. Pure web-only loses money for most apps.

---

## SaaS freemium conversion rates (reference)

| Company | Free → paid |
|---|---|
| Canva | ~9% |
| Dropbox | ~3% |
| ChatGPT | ~3% |
| Miro | ~1% |
| **Median good freemium** | 3-5% |
| **Median great freemium** | 8-12% |
| **Top-decile elite** | 15%+ |

By segment:
- B2C apps PLG: 2-5% free-to-paid
- B2B apps PLG: 8-15% (Bessemer)
- Developer tools: median 5% (devs evaluate fast, demanding)
- CRM / sales tools: 29% trial-to-paid (highest segment)

---

## SaaS pricing page benchmarks

| Stage | Median | Top quartile | Elite |
|---|---|---|---|
| Visitor → signup (freemium) | ~9% | — | — |
| Visitor → signup (trial) | ~5% | — | — |
| Visitor → pricing page | 15-30% | — | — |
| **Pricing page → trial/signup** | **3-5%** | 7-10% | >11% |
| Trial opt-in (no CC) → paid | 18.2% | 35-45% | 60%+ |
| Trial opt-out (CC required) → paid | 48.8% | — | — |
| Freemium self-serve → paid | 3-5% | 6-8% | 15%+ |

### SaaS plan structure
- **3 self-serve tiers + 1 enterprise** = industry standard
- Middle tier should target **60-70% of customers** (Patrick Campbell / ProfitWell)
- 5 → 3 tiers + "Most Popular" badge = **+158% conversion** (1.2% → 3.1%) in case study
- Enterprise tier visible (even "Custom") = **+15% ARPU by anchoring** (ProfitWell)

### SaaS trial mechanics
- 14 days = sweet spot 62% of trials (ChartMogul). 7d: 14%. 30d: 14%.
- 7d trials beat 30d in PNAS large-scale study: +5.6% conversion, +6.4% retention, +7.9% revenue
- Achievement-based vs calendar-based: "You completed X, unlock advanced features" = **+258% conversion** vs "Your trial expires tomorrow"

---

## Refund + retention by category

| Category | Refund rate | Annual Y2 retention |
|---|---|---|
| Fitness | **4.7% (highest)** | 36% (vs 6.7% monthly) |
| Health | ~3% | High |
| Productivity | ~2% | Medium |
| AI apps | Variable | High Y1, faster monthly churn |

---

## Discount strategy (Adapty 2026)

| Strategy | Outcome |
|---|---|
| **Best**: post-close welcome offer to non-converters only | +10-15% ARPU |
| **Worst**: discount on main paywall | Trains users to expect lower prices, kills perceived value |

---

## Paywall fatigue (Nami ML 2026)

Performance degrades after **~2 exposures per user**. Decline curve: -0.11 to -0.40 conversion per additional exposure.

Formula: `Frequency = Impressions ÷ Reach` (mirrors ad-fatigue methodology).

Cap paywall frequency, segment non-converters, vary the variant.

---

## AI app specifics (Adapty 2026)

- Install → trial: 5.31% (vs 10.92% average — lower because intent differs)
- Direct purchases: **+14% above average**
- Annual + trial LTV: **$66.70** (vs $49.92 typical, +34%)
- Annual-first strategy with higher price points wins
- AI apps: 41% higher Y1 LTV but 36% faster monthly churn (RevenueCat 2026)

**AI app paywall implication**: less "trial culture", more "direct purchase + annual". Don't copy Health & Fitness trial-heavy patterns blindly.

---

## Sources to cite when arguing positions

- [RevenueCat — State of Subscription Apps 2026](https://www.revenuecat.com/state-of-subscription-apps/)
- [RevenueCat — 2026 trends summary](https://www.revenuecat.com/blog/growth/subscription-app-trends-benchmarks-2026/)
- [Adapty — State of In-App Subscriptions 2026](https://adapty.io/state-of-in-app-subscriptions-report/)
- [Adapty — High-performing paywall 2026](https://adapty.io/blog/high-performing-paywall-2026/)
- [RevenueCat — Android paywall gap](https://www.revenuecat.com/blog/engineering/android-paywall-gap/)
- [RevenueCat — Web vs IAP A/B test](https://www.revenuecat.com/blog/growth/iap-vs-web-purchases-conversion-test/)
- [RevenueCat — 4 paywall redesigns](https://www.revenuecat.com/blog/growth/paywall-redesigns-case-studies/)
- [RevenueCat — R.I.P. toggle paywall](https://www.revenuecat.com/blog/growth/r-i-p-toggle-paywall-we-hardly-knew-ye/)
- [Stormy — 4,500+ A/B tests lessons](https://stormy.ai/blog/how-to-design-a-high-converting-mobile-app-paywall-lessons-from-4500-ab-tests)
- [Stormy — Sunflower case study](https://stormy.ai/blog/optimizing-paywall-superwall-revenue-increase-2026)
- [Superwall — 5 paywall patterns of million-dollar apps](https://superwall.com/blog/5-paywall-patterns-used-by-million-dollar-apps/)
- [Superwall — 17% revenue from transaction-abandon paywalls](https://superwall.com/blog/17-revenue-boost-with-transaction-abandon-paywalls-a-case-study/)
- [Growth.Design — Blinkist +23% trial conversions](https://growth.design/case-studies/trial-paywall-challenge)
- [Nami ML — Paywall fatigue](https://www.nami.ml/blog/paywall-fatigue-is-the-next-growth-ceiling-for-subscription-apps-in-2026)
- [Botsi — 19 paywall A/B tests](https://www.botsi.com/blog-posts/19-paywall-tests)
- [ChartMogul — SaaS Conversion Report](https://chartmogul.com/reports/saas-conversion-report/)
- [PNAS — Trial length experiment](https://pmc.ncbi.nlm.nih.gov/articles/PMC12217587/)
