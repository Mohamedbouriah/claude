# 06 — Mobile App Paywall Teardowns

A library of 30+ mobile app paywall teardowns, organized by dominant pattern. Use these to:
- Reference a specific app the user mentions
- Show real numbers behind a strategic recommendation
- Spot the mechanic to copy (or avoid)

Public sources cited at the end of each entry.

---

## Pattern A — Quiz → Personalized Plan → Paywall (the dominant 2024-2026)

### Cal AI — $30M ARR (acquired by MyFitnessPal, March 2026)

- **Type**: Hard paywall after a 28-step quiz (~2 min 15s). Card required to use the app.
- **Pricing opaque** until quiz end (engagement trap). Weekly price dynamic: $2.99-$6.99 by device / country / answers.
- **Three-screen trial timeline** (Today → Day 2 reminder → Day 3 charge) — widely praised: "genius, no surprises".
- **CTA**: `"Try for $0.00"` + `"No Payment Due Now"`.
- **Anchor**: yearly $2.49/mo vs monthly $9.99/mo = **75% off** (vs 50% industry standard).
- **Trial toggle without screen change** (serves both psychotypes).
- **Infrastructure**: Superwall for continuous A/B.

What to copy: trial timeline transparency, aggressive 75% anchor, dual-CTA framing. Watch out for the dynamic pricing — feels unfair when users compare notes.

Sources: [Adapty — Cal AI](https://adapty.io/paywall-library/cal-ai-food-calorie-tracker/), [Adapty Newsletter #22](https://adapty.io/blog/paywall-newsletter-22/)

### Noom — $750M ARR (the paywall bible)

- **Soft paywall after 77 steps** (~10-15 min). 96+ screens web + mobile.
- **Psychology quiz** framed as scientific test → Barnum effect + progressive commitment.
- **Pricing variable by goal**: algorithm computes months to reach target weight → adapted plan. $17.42-$42.25/mo.
- **"Pay what you can" trial** ($0.50-$18.37 over 14d) — each user sets their pain threshold; commitment increases for those paying $10+.
- 15-min countdown "Reserve your plan" (artificial scarcity).
- Heavy social proof: NYT/WSJ/Forbes logos + before/after photos + clinical studies.
- 30M → 38M → 45M downloads in 2 years after current implementation.

What to copy: sunk-cost via long quiz, social proof at strategic dropout points, pricing-by-goal segmentation. Don't copy the length blindly — Noom only works because each screen earns its keep.

Sources: [Retention.blog — Longest Onboarding](https://www.retention.blog/p/the-longest-onboarding-ever), [Paddle Fix that Funnel: Noom](https://www.paddle.com/studios/shows/fix-that-funnel/noom)

### Flo — $9M/mo (Women's Health)

- **70-screen onboarding** + mandatory registration (near-zero onboarding churn).
- "Tap and hold" gesture = psychological commitment before paywall.
- Yearly main offer + 14-day trial toggle.
- **Test finding**: simplifying the paywall = **+conversion in 3/4 tests** (Flo growth team insight).

What to copy: mandatory registration done right (after value), gesture-based commitment, ruthless paywall simplification.

### Opal — $400k/mo focus app

- Quiz generates a **"Focus Report" personalized**, quantifying years of life lost on phone — emotional trigger.
- **Before/After screen-time comparison** on paywall = visual demo of value.
- $99.99/yr or $8.29/mo, 7-day free trial.
- **Post-subscribe animation**: unlock the "First Gem" 3D = immediate cognitive validation (anti-refund).

What to copy: emotional triggers grounded in data (not made up), post-purchase reinforcement to reduce refunds.

Sources: [Adapty — Opal](https://adapty.io/paywall-library/opal-screen-time-for-focus/), [Nami ML — Opal](https://www.nami.ml/paywalls/opal-screen-time-for-focus)

### Stoic — $300-500k/mo journaling

- Paywall at quiz end. **Social proof first**: "App of the Day" + reviews before features.
- **1 plan discounted by default** (yearly) + "See more plans" hidden (avoids choice overload).
- **Double paywall**: AI analysis as secondary upsell (frustration risk).

What to copy: hidden additional plans, social proof leading. Watch the double paywall — it works for some, frustrates many.

### BetterMe

- Custom avatar with body stats, countdown timer, Forbes/WSJ logos.
- **CTA `"Get My Plan"`** (action verb + first-person, aligned with the quiz).

What to copy: first-person CTAs, custom avatar as psychological commitment.

Sources: [App Fuel — BetterMe](https://www.theappfuel.com/examples/bettermefitness_onboarding), [PaywallScreens — BetterMe](https://www.paywallscreens.com/apps/betterme-mobile-paywall-e821)

---

## Pattern B — Honest Paywall / Timeline Transparency

### Blinkist — the founding pattern (2019)

Designer Jaycee Day created the **"Honest Paywall"** with 3 components:
1. Visual timeline Day 1 → Day 5 reminder email → Day 7 charge
2. Explicit notification opt-in ("We'll remind you 2 days before charging")
3. Cancel terms clarity ("Cancel at least 24h before end")

**Measured results**: +23% trial sign-ups, +1,200% notification opt-ins (6% → 74%), -55% customer complaints, +4% trial retention.

**Insight**: 33% of cancellations happened Day 0 from panic ("I'll forget to cancel"). Transparency eliminates that anxiety.

Adopted by Strava, Canva, Apple (integrated into iOS).

What to copy: the entire 3-component formula. This is the dominant 2026 trial mechanic.

Sources: [Growth.Design — Blinkist 23% lift](https://growth.design/case-studies/trial-paywall-challenge), [Purchasely — Blinkist transformation](https://www.purchasely.com/blog/blinkist-paywall-transformation-revolutionizes-app-user-engagement)

### Strava — $11M/mo sport tracking

- **30-day free trial without credit card** (rare). "The app becomes the sales pitch."
- Timeline visible Day 1 → Day 28 reminder → Day 30 charge.
- $11.99/mo vs $79.99/yr (framing "$143.88 annual cost saved").
- **Annual retention**: 36% at Y2 vs 6.7% monthly — massive LTV swing.

What to copy: confident long trial when product can carry it, framing annual savings in absolute $, surfacing Y2 retention math.

### Duolingo Super — $25M/mo

- **Only 2 plans**: Individual vs Family with `Most Popular` badge on Family (boosts LTV).
- **7-day free trial**. CTA: `"Start my free week"` (first-person "my", concrete duration "week" vs "trial").
- 3-page carousel before paywall (context).
- **Post-purchase**: 5-benefit reminder + mascot icon change (anti-refund).
- **Duolingo Max**: second-tier upsell with AI Video Call on home screen (constant exposure, not hidden paywall).

What to copy: 2 plans not 3, first-person CTA, badge on the higher-LTV plan (not the popular one), post-purchase anti-refund ritual.

Sources: [PaywallScreens — Duolingo](https://www.paywallscreens.com/apps/duolingo-mobile-paywall-4820)

---

## Pattern C — Anchor & Decoy

### Calm — $4M/mo, immersive positioning

- Animated backgrounds, natural sounds, celebrity narration previews.
- **"Forever Price"**: $299.99 one-time (LTV lock).
- High monthly anchor to make annual shine.
- Willingness-to-pay by usage frequency: <1x/month users = $4.90, daily users = $10+.

### Headspace — $3M/mo, clinical positioning

- **7-day trial** (monthly $12.99) OR **14-day trial** (annual $69.99).
- **"Forever Price"**: $399.99 one-time.
- Research icons, stress-reduction stats, structured curriculum.
- **Strength**: ultra-clear cancellation flow (graceful offboarding, reduces churn PR damage).

What to copy: lifetime tier as LTV lock + anchor; differential trial duration by plan; transparent cancellation.

### MyFitnessPal — $13M/mo

- **Premium vs Premium+** (not a bundle, 2 distinct use cases).
- **67% annual discount**.
- Value Stack pattern: "barcode scanning", "voice logging", "macro breakdown".
- Positions Premium as **"efficiency for serious fitness people"** — sells time, not data.

What to copy: 2 tiers as 2 use-case targets (not "more of the same"), value stack of action-verb features.

### MacroFactor — $2.3M/mo

- "Most Popular" on 12-month plan.
- Strong anchor & decoy structure.

---

## Pattern D — Feature-Gate Contextual

Conversion dramatically higher than blanket paywalls because intent is maximum at trigger.

### Photoroom — $3M/mo AI photo

- **2 plans (Pro vs Max) × 2 durations (weekly vs yearly)** = 4 options, yearly framed per-week.
- Contextual upsell: Max appears specifically on "Unlock Super Batch" click.
- In-app purchases also ($4.99-$249.99 items) — hybrid monetization.

### Remini — $5M/mo AI enhance

- **3 photos AI-enhance/day** in free (hard usage limit).
- AI enhance = immediate wow effect → user hooked → paywall bites.
- Parent company Bending Spoons = masters of contextual feature-gate.

### Lensa / FaceApp / Picsart

- **Feature-gate paywalls** (not at entry, but at the moment of consuming the result).
- FaceApp: specific filter (Old / Gender Swap) = trigger, paywall at save-without-watermark moment.
- Picsart: multiple tiers (Plus + Pro) → tiered pricing forces progressive upgrades.

What to copy: gate the SAVE / EXPORT step, not the create step. Users with output in hand convert 5-10x better.

---

## Pattern E — Usage-Limit Hard

### Fitbod — $1M/mo

- **3 free workouts** then hard paywall.
- $12.99/mo or $79.99/yr. **Anti-coach framing**: "$9.99/mo vs $100/h real coach".
- 3D avatar showing potential gains.

### Rizz / Rizz GPT — dating coach AI

- Hard paywall after 1-2 uses + contextual paywalls per key feature.
- Weekly $2.99-$6.99 (weekly = 55% of subscription revenue per Adapty 2026).
- Yearly $29.99-$69.99 anchored vs ultra-short weekly.
- **3-day trial** (>90% trial starts convert Day 0, so 3 days suffices).
- Copy centered on **social fear / insecurity** = explicit loss aversion.

### ChatGPT / Claude / Perplexity — AI apps 2025-2026

- **Usage caps** = upgrade trigger at moment of cognitive loss (message limits inside long conversation).
- ChatGPT: Go $8, Plus $20, Pro $200.
- Claude: Pro $17, Max $100+, framing "5x more usage".
- Perplexity: $20/mo Pro, 300 searches/day, partnerships (PayPal/Venmo/Samsung) for 12 free months = mass acquisition.

**AI app pattern (Adapty 2026)**: install-to-trial 5.31% (vs 10.92% avg). AI users buy directly, less trial. Annual+trial LTV $66.70 vs $49.92 avg.

---

## Pattern F — Now-or-Never / Aggressive Scarcity

### Reflectly — Double paywall strategy

- **1st paywall onboarding**: lifetime $79.99 (high anchor).
- Skip → use → **2nd paywall "Just For You"**: lifetime $19.99 with countdown timer.
- Cross-platform unequal pricing: $19.99/yr Android vs $59.99/yr iOS (capture different WTP).

### Finch — $1.8M/mo pet habit app

- Gamified paywall (Finch pet that grows).
- **Scarcity copy**: `"Offer expires when you exit this screen!"`
- Soft monetization → trust + long retention.

### YAZIO — $3.3M/mo

- **Gamified "spin wheel"** on paywall → "75% OFF FOREVER" banner.
- Multiple testimonials + star ratings.

---

## Pattern G — Social Proof Engine

### Speak — $2.8M/mo language learning

- "5 million users" + "4.8-star rating (140k reviews)" = heavy quantitative social proof.

### Lose It! — $3.3M/mo

- **Dedicates the whole paywall to explaining the trial mechanic** (Honest Paywall maxed out).

### Captions — $2.3M/mo video

- "ONE TIME OFFER" framing, exclusive positioning.

---

## Pattern H — One-time Purchase / Anti-subscription

### Forest — focus timer

- $3.99 paid app upfront (anti-subscription stance).
- Tree-growing gamification. No paywall — original model that works on niche.

### Freedom — cross-platform blocker

- $8.99/mo OR $39.99/yr OR **$199 lifetime**.
- Paywall emphasizes **desktop+mobile sync** = unique feature.

---

## Freemium refused (counter-cases)

### BeReal / Locket

- Gen Z social apps: paywalling = killing the network effect.
- BeReal: ads only in 2025 (US, in-feed + sponsored takeovers).
- Model isn't SaaS, it's media/ads.

**Lesson**: not every product should be a subscription. Network effects + viral growth + ad-monetization is a valid path.

---

## Pattern frequency summary

Top conversion mechanics on high-performing apps, ranked by frequency:

1. **Quiz → Personalized Plan → Paywall** (Noom, Cal AI, Flo, Opal, Stoic, BetterMe) — dominant pattern
2. **Honest Paywall timeline** (Blinkist, Strava, Canva) — +23% conv, -55% complaints
3. **Anchor & Decoy** with 75% off annual (Cal AI, MacroFactor) — beats 50% off
4. **Value Stack** feature list (MyFitnessPal, ChatOn, ClassDojo) — action verbs, 4-6 features max
5. **Social Proof Engine** (Flo, YAZIO, Speak, Cal AI) — exact number + rating + count
6. **Soft Commitment** `"Try for $0.00"` (Cal AI, Strava, Lose It!) — never "Subscribe"
7. **Now-or-Never** (Captions, Finch, YAZIO, Reflectly double-paywall) — countdown + OTO banner
8. **Feature-Gate contextual** (Photoroom, Lensa, Picsart, Remini, Duolingo Max) — max value alignment
9. **Usage Limit Hard** (Fitbod 3 workouts, Remini 3 photos, ChatGPT messages)
10. **Trial Toggle** / Choice Architecture (Cal AI, Flo) — serves 2 psychotypes (NOTE: dead on iOS Jan 2026, see [04](04-paywall-integration.md))
11. **Post-Purchase Reinforcement** (Duolingo, Opal, Strava) — anti-refund
12. **Localized Pricing** — **the #1 win-rate test type at 62.3%**

---

## Mobile teardown checklist (apply to any app)

When studying a paywall, capture:

1. **Pattern type** (A-H from above)
2. **Onboarding length** (steps, time)
3. **Quiz personalization depth** (does the paywall headline change by goal?)
4. **Plan layout** (1 / 2 / 3 plans visible? hidden behind link?)
5. **Default plan** (annual / monthly / weekly preselected?)
6. **Trial mechanic** (duration, CC required?, timeline pattern?)
7. **CTA copy** (action verb? first-person? duration explicit?)
8. **Pricing display** (per-week framing? "SAVE X%" badge? anchor?)
9. **Social proof** (user count, rating, reviews, testimonials, logos?)
10. **Risk reversal** ("No commitment, cancel anytime", "No payment due now"?)
11. **Close button** (visible? hidden = hard paywall, not an iOS-Review-safe pattern)
12. **Exit drawer** (downsell / OTO if user closes?)
13. **Post-purchase ritual** (animation, mascot change, first-action prompt?)
14. **Localization** (currency, copy fully translated, regional payment methods?)
15. **Public revenue** (App Annie / Sensor Tower / public reports if available)

---

## Visual paywall libraries (for inspiration / teardown research)

- [Adapty paywall library](https://adapty.io/paywall-library/)
- [Nami paywall library](https://www.namiml.com/paywalls/)
- [PaywallScreens](https://www.paywallscreens.com/)
- [PaywallPro](https://www.paywallpro.app/)
- [ScreensDesign](https://screensdesign.com/)
- [App Fuel onboarding flows](https://theappfuel.com/flows/onboarding)
- [Pageflows](https://pageflows.com/)
- [Reteno gallery](https://gallery.reteno.com/)
- [Uiland flows](https://uiland.design/)
