# 04 — Paywall Integration

The paywall is the final handshake between onboarding and revenue. This reference covers placement, layout, trial mechanics, exit drawers, Apple/Google compliance, and the 8 dominant patterns.

---

## Placement: where in the funnel?

| Placement | Pros | Cons | Best for |
|---|---|---|---|
| **Before onboarding** (FitnessAI/Rootd pattern) | +50% paywall visibility, 2x install-to-trial | Lower paid-conversion % from those who see it | High-intent ad funnels, simple value prop |
| **After personalized result** (dominant 2024-2026) | High intent at paywall view; perso increases willingness | Paywall view rate lower | Health, Education, Coaching, AI |
| **After first value preview** (soft paywall) | User has experienced value | Lower conversion than hard paywall | Network products, content apps |
| **Feature-gated** (contextual) | Maximum intent at view | Low view volume | Power features, batch tools |
| **Usage-limit hard** | Activates the loss-aversion trigger | Risks frustration if limit too tight | AI apps, photo/video tools, fitness logs |

**Default recommendation 2026**: paywall right after the personalized result, with the result/plan visible behind / above the paywall ("you've earned this — unlock it").

---

## The 8 dominant paywall patterns (mobile)

### Pattern A — Quiz → Personalized Plan → Paywall

**The dominant 2024-2026 pattern.** Used by Cal AI ($30M ARR), Noom ($750M), Flo ($9M/mo), Opal, Stoic, BetterMe.

Mechanic:
1. Long quiz (8-30+ questions) builds commitment
2. Loading screen ("calculating your plan…")
3. Personalized plan visible (timeline, score, milestones)
4. Paywall with headline = goal, bullets = pain points addressed, CTA = action verb

Why it works: sunk-cost effect from quiz + perceived earned plan + clear path to outcome.

### Pattern B — Honest Paywall / Timeline Transparency

**+23% trial conversions, –55% complaints, +1,200% notification opt-ins (6% → 74%).** Created by Blinkist 2019, now sanctioned by Apple as the canonical alternative to toggle paywalls.

The 3-component formula:
1. **Visual timeline**: Today (full access) → Day 5 (reminder email) → Day 7 (charge)
2. **Explicit notification opt-in**: "We'll remind you 2 days before charging"
3. **Cancellation clarity**: "Cancel at least 24h before end"

Why it works: 33% of cancellations on traditional 7-day trials happen Day 0 by panic ("I'll forget"). Transparency removes that anxiety.

Adopted by Strava, Canva, integrated into iOS itself.

### Pattern C — Anchor & Decoy

Used by Calm ($4M/mo), MacroFactor ($2.3M), MyFitnessPal ($13M), SCRL ($2M).

Mechanic:
- High monthly anchor ($14.99/mo)
- Yearly framed as "SAVE 75-85%" or "$2.49/mo billed annually"
- Optional 3rd tier (lifetime / family) as decoy

Cal AI's signature: **75% off annual vs monthly** (vs 50% industry standard) — moves more aggressively than competitors.

### Pattern D — Feature-Gate Contextual

Used by Photoroom ($3M/mo), Lensa, FaceApp, Picsart, Remini ($5M/mo), Duolingo Max.

Mechanic:
- App is functional in free mode
- When user clicks a premium feature (Old Filter, Super Batch, AI Video Call, etc.), paywall appears
- Maximum intent: user wants THE feature now

Why it works: paywall view = high intent moment. Conversion much higher per view (10-30%) than blanket paywalls.

### Pattern E — Usage-Limit Hard

Used by Fitbod (3 free workouts), Remini (3 photos/day), ChatGPT/Claude/Perplexity (message caps), Rizz.

Mechanic:
- App fully functional but hard quota
- Quota exhaustion = paywall, no override

Why it works: the user has tasted value AND lost it. Loss aversion at peak.

**Caveat for AI apps (Adapty 2026):**
- Install-to-trial: 5.31% (vs 10.92% average) — AI users prefer direct purchase
- Direct purchases: +14% above average
- Annual+trial LTV: $66.70 (+34% vs $49.92 average)
- AI apps: 41% higher Y1 LTV but 36% faster monthly churn → annual-first strategy wins

### Pattern F — Now-or-Never / Scarcity

Used by Captions ($2.3M), Finch ($1.8M), YAZIO ($3.3M), Reflectly (double paywall).

Mechanic:
- Countdown timer ("Reserved for 15 min")
- Spin-wheel discount ("75% OFF FOREVER")
- Exit-attempt offer ("Offer expires when you exit!")
- Double paywall: 1st = lifetime $79.99 (anchor) → skip → 2nd = lifetime $19.99 with countdown

Why it works: real urgency (real timer) converts. Fake urgency (resets every reload) erodes trust + Apple rejection risk.

**Apple watchout**: Apple has rejected apps for exit popups under "manipulating customers into unwanted IAPs". Cap exposure at 2-3, never aggressive.

### Pattern G — Social Proof Engine

Used by Speak ($2.8M, "5 million users · 4.8★ · 140k reviews"), Flo ($9M), YAZIO ($3.3M), Cal AI.

Mechanic:
- Quantified user count + star rating + review count, prominent
- Segmented testimonials ("Sarah, 32, lost 18 lbs in 90 days")
- Trust marks (NYT, Forbes, WSJ logos for Noom-tier)
- Star sweet-spot: **4.2-4.5★** more authentic than 5.0

### Pattern H — Soft Commitment / "Try for $0.00"

Used by Cal AI, Strava ($11M/mo), Lose It! ($3.3M).

Mechanic:
- Trial framing as the headline action: "Try for $0.00", "Start free week"
- Timeline visible
- "No Payment Due Now" prominent
- Cancel terms upfront

CTA copy pattern: "Try for $0.00" > "Start Free Trial" > "Subscribe". Never "Subscribe" as primary CTA.

---

## Layout: the 2026 high-performer

**Single-page paywalls, no scroll** are the dominant high-performer pattern.

Components, top to bottom:
1. **Headline** — personalized to goal/segment (≤8 words)
2. **Subheadline** — concrete benefit (≤14 words)
3. **3-5 icon bullets** — outcomes, not features. Action verbs ("Unlock", "Remove", "Get").
4. **Plan selector** — horizontal, 1-2 plans visible. Annual preselected.
5. **Pricing** — primary plan price + per-week breakdown + "SAVE X%" badge
6. **Social proof line** — user count + star rating + review count
7. **Primary CTA** — "Continue" / "Start Free Trial" / "Try for $0.00"
8. **Risk reversal subtext** — "No commitment. Cancel anytime."
9. **Trial timeline** (if trial) — Today / Day X reminder / Day Y charge
10. **Close (X)** visible, top-right

**Comparison tables LOSE on mobile paywalls** vs bullet lists (Stormy 4500+ A/B tests). Use bullets.

**Comparison tables WIN on SaaS pricing pages** — buyers are comparing tiers. See [07-saas-pricing-pages.md](07-saas-pricing-pages.md).

---

## Trial mechanics

### Length decision (RevenueCat 2026)

| Trial length | Trial-to-paid | Day 0 cancel rate | Use when |
|---|---|---|---|
| ≤4 days | 25.5% | 55.4% | Most categories; Adapty top config = weekly + 3-day trial |
| 5–9 days | 37.4% | 39.8% | Sweet spot for most apps |
| 17–32 days | 42.5% | 31.1% | Business / Productivity (long evaluation cycles) |

**Long trials convert ~70% better than short trials in raw data.** But the industry is going the other way (≤4-day trials grew from 42.1% → 46.5% YoY) because long trials hurt Day 0 revenue and cash conversion cycle.

**Practical rule**: 3-day trial on weekly plan + 7-day trial on annual plan.

### Trial vs no-trial

For some categories, trials hurt LTV (Adapty 2026):
- Productivity: direct $56.95 vs trial $49.13
- Lifestyle: trial –21%
- Graphics & Design: same negative

**Best practice**: attach trials to annual plans only; offer direct purchase for weekly.

### iOS toggle paywall — DEAD (Jan 2026)

Apple rejects toggle paywalls under Guideline 3.1.2 ("confusing and may prevent users from understanding…auto-renewing subscription").

Toggle was the dominant pattern 2022-2025 (Adam Lyttle, $5,300/week, 63% conversion). It is now App Review rejection.

**Replacements:**
- **Blinkist timeline pattern** (Today / Reminder / Charge) — sanctioned, +23% trial conv
- Multi-package selector with explicit pricing
- Value-first design (plan visible, paywall as CTA at the bottom)
- Exit offers (capped, see below)

Still works on Android and web — but iOS code paths must use timeline.

### Reverse trial (SaaS web)

Used by Notion, Airtable, Canva, Databox, Superhuman.

Mechanic:
1. User signs up free
2. Gets full Pro access for X days
3. Auto-downgrades to free at trial end
4. Loss aversion drives upgrade

Results:
- Traditional trials: 8-25% conversion
- Reverse trials: up to 25%+ with sparse data
- Elena Verna (ex-Dropbox VP Growth): reverse trial increased freemium → premium **+10 to +40%**

Best for: PLG products with strong free-tier retention but flat upgrade curve. The reverse trial converts users who weren't going to upgrade otherwise.

### Credit card required vs opt-in

| Mode | Trial start rate | Trial → paid | Per 1,000 visitors |
|---|---|---|---|
| **CC required (opt-out)** | 2.5% | 48.8% | ~10.5 paid |
| **No CC (opt-in)** | 8.5% | 18.2% | ~3.6 paid |

**CC-required wins on raw $, opt-in wins on top-of-funnel.** Choose by:
- Brand strength: weak brand + complex product → opt-in (build trust); strong brand → CC-required.
- ACV: high → CC; low/PLG → opt-in.

---

## Pricing display

### Per-week framing

`$39.99/yr → "$0.76/week"`

Reliable A/B test winner across Stormy's 4,500+ tests. Reduces sticker shock on annual plans.

### "SAVE X%" anchor

Prominent on yearly plan, anchored to monthly:
- `Monthly $14.99 → Yearly $89.99 ("SAVE 50%")` — standard
- Cal AI: **"SAVE 75%"** — more aggressive, works on quiz funnels with high commitment

### Charm pricing ($9.99)

Universal across categories. Secondary lever vs design and packaging — "design and psychological framing are bigger levers than the price number alone" (Stormy).

For premium SaaS ($20-30 range), **rounded prices ($20, $30) feel more trustworthy** than $19.99 / $29.99. Anthropic, Cursor, Superhuman all use round.

### LATAM / regional adaptation

In Latin America: showing **monthly equivalent alongside yearly** "resonates strongly" (Mojo LatAm test). Doesn't violate Apple rules.

Localization is the **#1 win-rate A/B test type** at **62.3%** (Adapty 2026). Most underexploited lever.

---

## Web-to-app vs IAP

Post-Epic v. Apple (April 2025), Apple must allow external checkout links in the US App Store.

**RevenueCat's definitive A/B test:**

| Variant | Initial conv | Trial → paid | Overall paid | $/customer | Net after Apple fee |
|---|---|---|---|---|---|
| **IAP-only** | **27.0%** | 25.0% | 6.3% | $2.98 | **$2.09** |
| IAP + Web button | 23.5% | 28.2% | 5.9% | $2.46 | — |
| Web-only | 18.1% | 26.3% | 5.3% | $2.09 | $1.96 |

Forcing web checkout reduces trial-start by ~1/3 (71% IAP completion vs 44% web).

**Verdict 2026:**
- **Hybrid (IAP + web button)** is the current sweet spot
- **Web-only loses 6.5% net revenue** vs IAP-only — pure web-only is a money-losing strategy for most apps
- Web-to-app funnels (quiz on web → checkout on web → install app) work for high-LTV categories: Health, Education, AI

---

## Exit drawer / second offer

When user closes the paywall: present a downsell drawer.

Pattern:
1. **Reframe** — "Wait — let's try something simpler"
2. **Downsell** — lower-tier or shorter trial
3. **One-time offer** — 25-33% off, shown once, never reset

Results:
- Adds **+15-20% total revenue** when used
- Only **~10% of abandoning users** accept discount-without-trial offer
- Cap at **2-3 exposures** before user dismisses as pattern
- Apple has rejected apps for aggressive exit popups → audit copy carefully

**Anti-pattern**: looping exit-drawer that resets every paywall view. Trust killer + rejection risk.

---

## Apple / Google compliance checklist

### Apple App Review
- ✅ Close button visible on full-screen modal paywalls (`.storeButton(.hidden, for: .cancellation)` only on hard paywall) — hidden X = rejection risk
- ✅ Trial duration, billing date, cancellation policy explicit
- ✅ No toggle paywall (rejected since Jan 2026 under Guideline 3.1.2)
- ✅ No fake urgency (resetting timers)
- ✅ No "manipulating into unwanted IAPs" (aggressive exit popups, dark UI)
- ✅ External checkout links (US only post-April 2025) properly labeled

### Android / Google Play
- ✅ Permission requests at moment of use, with priming
- ✅ Subscription auto-renew terms transparent
- ✅ Cancellation flow accessible from app

### Both
- ✅ Localized pricing (currency + per-locale strings)
- ✅ Privacy policy linked from paywall
- ✅ Restore purchase button available (required by Apple, best practice on Android)

---

## Discount strategy (Adapty 2026)

| Strategy | Outcome |
|---|---|
| **Best**: Post-close welcome offer to non-converters only | +10-15% ARPU |
| **Worst**: Discount on main paywall | Trains users to expect lower prices, kills perceived value |

**Rule**: never put a discount on the main paywall. Trigger it only via exit drawer or post-close offer to users who explicitly closed without converting.

---

## Paywall fatigue (Nami ML 2026)

Performance degrades meaningfully after **~2 exposures per user**.

Decline curve: -0.11 to -0.40 conversion per additional exposure.

Formula: `Frequency = Impressions ÷ Reach` (mirrors ad-fatigue).

**Implication**:
- Cap paywall frequency per user, like ads
- Tag and segment non-converters → different paywall variant on next exposure (or no paywall, soft CTA in-product)
- Don't show the same paywall 5 times in 3 days — even on hard paywall, the second view onwards loses 10-40% per exposure

---

## Post-purchase reinforcement

Within seconds after purchase:
- **Animation / unlock confirmation** ("Welcome to Pro" / "Your plan is unlocked")
- **5-benefit reminder** of what they get
- **Mascot / icon change** (Duolingo Super)
- **First action prompt** ("Try this premium feature now")

Why: anti-refund. The first hour after purchase is when buyer's remorse kicks in. Reinforcing the value reduces refund + Day 0 cancel.

Strava, Opal, Duolingo all do this systematically.

---

## Decision tree: pick your paywall pattern

```
Is the product B2C subscription mobile?
├── Yes
│   ├── Is value visible from quiz answers? → Pattern A (Quiz → Plan → Paywall)
│   ├── Is the app utility/tool? → Pattern D (Feature-gate) or E (Usage-limit)
│   ├── Is the brand premium/positioning? → Pattern C (Anchor & Decoy)
│   └── Is the user base mass-market? → Pattern G (Social Proof Engine)
│
├── No, B2B SaaS
│   ├── PLG mature with strong free → Reverse trial
│   ├── Mid-market $5-25K ACV → Free trial 14 days, opt-in
│   ├── Enterprise $25K+ → Contact sales, custom pricing
│   └── Premium positioning (Superhuman) → No free tier, 7-day trial CC-required
│
└── No, hybrid web-to-app
    └── Quiz on web → Pattern A + IAP+web button hybrid (never web-only on iOS)
```
