# 09 — A/B Test Playbook

How to actually move the needle. Most teams burn months on tests that can't possibly win. Use this to prioritize.

---

## The data on what wins (Adapty 2026)

% of A/B tests that show LTV improvement, by test type:

| Test type | Win rate | Priority |
|---|---|---|
| **Localization** | **62.3%** | #1 |
| Trial structure | 59.6% | #2 |
| Plan duration | 58.7% | #3 |
| Number of plans | 57.1% | #4 |
| Price changes | 45.5% LTV (28.3% raw conv) | #5 — lifts $, not % |
| Visual / copy-only | 34.6% | #6 — the lowest |

**Apps running 14.7+ experiments/year earn up to 40x more revenue** than non-testers (Adapty 2026).

---

## Counter-intuitive lesson: visual / copy is the LOWEST win rate

Most teams start with "let's test the headline" because it's easy. **Don't.**

- Visual / copy-only A/B = **34.6% win rate**. Less than 50/50.
- Localization = **62.3%**. Localizing your paywall to 5 markets has a 1.8x higher chance of winning per test.
- Trial structure = **59.6%**. Going from 7-day to 3-day trial (or vice versa) is more impactful than rewriting your CTA 12 times.

**The order of operations:**
1. Get pricing localized to your top 5 markets
2. Test trial duration and configuration (3d vs 7d, weekly+trial vs annual+trial)
3. Test plan count and structure (1 vs 2 vs 3 plans visible)
4. Test plan duration mix (weekly vs monthly vs annual prominence)
5. Then test price points
6. Finally, refine copy / visual

---

## Test prioritization framework

Score each candidate test on:

1. **Expected lift size** (small / medium / large)
2. **Win rate of test type** (use Adapty 2026 table above)
3. **Implementation cost** (hours of dev + design)
4. **Sample size required** (you'll get a stat-sig signal in 1 week / 1 month / 6 months?)
5. **Strategic learning value** (does this teach you something about the market?)

**Heuristic**: prioritize tests where (lift × win-rate) / cost is highest.

**Mistake**: don't be tempted by 100 tiny copy tests. One localization rollout >> 100 button-color tests.

---

## Specific A/B test results worth replicating

### RevenueCat's 4 redesign case studies

| App type | Winning changes | Lift |
|---|---|---|
| Crypto portfolio | "Buy The Dip" messaging, price chart, SALE framing | +20% conversion |
| Driver-license prep | Short layout, trial toggle, real reviews, "40% savings" anchor | **+17.02% ARPU** |
| Party game | 3 plans → 2, "SAVE 83%", weekly breakdown, "Continue" CTA, illustrations | **+31% install-to-trial, +64% revenue** |
| Food app | Trial toggle, simplified, real reviews, "86% improved diet" stat, $2.49/mo equiv, "SAVE 40%" | **+72% install-to-trial** |

**Pattern**: shortening the layout + simplifying plan count + adding a quantified % anchor wins repeatedly.

### Superwall case studies

| Experiment | Lift |
|---|---|
| Trial reminders | **+48% revenue, +46% trial conv, +30% trial starts** |
| Annual preselected by default | **+70% annual revenue mix** |
| UI dopamine graphics (mascot, "Offer applied" green check) | +15% engagement |
| Transaction-abandon paywall (user cancels FaceID, sees discount) | **17% of total revenue**, refund 3.3% vs 6.8% control |
| Targeting unsubscribed users with extra trial offer | **+240% trial starts, +97% proceeds/user** |
| Testing introductory offers | +20% conversions |
| **Average Superwall test framework lift** | **+20% revenue floor** |

### Blinkist Honest Paywall

- Timeline (Today / Day 5 reminder / Day 7 charge): **+23% trial conversions, -55% complaints, +1,200% notification opt-ins (6% → 74%), +4% trial retention**

### FitnessAI / Rootd paywall placement

- FitnessAI: paywall before onboarding → +50% paywall visibility, **2x install-to-trial**
- Rootd: paywall to front of onboarding (dismissible) = **5x revenue**

### Blanket pattern recognition

Tests that win a lot:
- Annual preselected (default effect, +2-3x annual mix)
- Single primary plan + "View all plans" hidden link (vs 3 plans displayed)
- "Continue" beat descriptive CTAs by **+111%** (Stormy 4500+ tests)
- Per-week framing of yearly price ($39.99/yr → "$0.76/week")
- "SAVE 75%+" badges over 50%
- Real App Store reviews instead of fake / generic testimonials

Tests that LOSE often:
- Adding a 4th tier (unless it fills a real gap)
- Comparison tables on mobile paywalls (lose vs bullets)
- Long descriptive CTAs ("Start my fitness journey to lose 10 lbs")
- Generic "We're amazing" copy
- Aggressive countdown timers that feel fake
- Discount on the main paywall (kills perceived value)

---

## Hypothesis design — write a real one

A good A/B hypothesis looks like:

> **If we [specific change]**
> **for [specific user segment]**
> **then [primary metric] will move by [estimated %]**
> **because [psychological / behavioral mechanism]**
> **measured by [event / cohort window]**

Bad hypothesis: "We think a new headline will work better."

Good hypothesis: "If we change the paywall headline from 'Choose a plan' to 'Unlock your 14-day weight-loss plan' (using the user's selected goal) for users who answered the goal question, then trial-start rate will lift +5-10% within 2 weeks because the perceived continuity from quiz to paywall increases willingness, measured by `trial_started` event split by cohort."

The bad one tests something arbitrary; the good one tests a *theory*.

---

## Sample size + statistical power (the part everyone skips)

Rough rules for paywall A/B tests:

| Baseline conversion | Min sample size per variant for +10% relative lift @ 95% confidence |
|---|---|
| 1% | ~40,000 |
| 3% | ~13,000 |
| 5% | ~7,800 |
| 10% | ~3,800 |
| 20% | ~1,800 |
| 30% | ~1,100 |

For a small app with 1,000 paywall views/week and a 5% conversion, a +10% lift test takes **~16 weeks** to reach significance per variant. Plan accordingly.

Tools: most paywall infra (Superwall, RevenueCat, Adapty, Purchasely) provide built-in significance calculators.

**Rules:**
- Don't peek and stop early — inflated false positive rate.
- Don't run tests <2 weeks (intra-week variance pollutes data).
- One primary metric, one or two guard rails.
- If you don't have enough traffic for a test, don't run it. Use qualitative research first.

---

## Guard rails (always measure)

For every A/B test on the funnel, monitor these as guard rails — even if they're not your primary metric:

1. **Refund rate** (15-day window) — paywall changes that lift trial-start often spike refunds
2. **First renewal rate** (Day 30 / Day 7 depending on plan) — trial mechanic changes hurt here first
3. **D7 retention** — long-term health
4. **Cancel-Day-0 rate** — sign that the paywall promised more than the product delivers
5. **Net revenue per install (RPI) D60** — the truest metric

**The vanity-metric trap**: a test that lifts trial-starts +30% but lifts refunds +50% is a loss. Always measure paid + refund + renewal.

---

## A/B test backlog templates

### Backlog for a new mobile subscription app

In order of expected ROI:

1. **Localization rollout** — top 5 markets, full paywall translation + currency + payment methods (62.3% win rate)
2. **Trial duration test** — 3d vs 7d (current 7d default)
3. **Plan visibility test** — 3 plans visible vs 1 plan + "View all plans" link
4. **Default plan test** — annual preselect (vs current monthly default)
5. **Pricing anchor test** — yearly per-week framing ("$0.76/week") vs per-month ("$3.32/mo")
6. **Trial timeline (Honest Paywall)** — add Today/Day-5/Day-7 timeline to existing paywall
7. **Onboarding length** — short (4 questions) vs long (8 questions) vs Noom-style (15+ questions)
8. **Paywall placement** — after personalized result (current) vs before onboarding (FitnessAI pattern)
9. **CTA copy** — "Continue" vs "Try for $0.00" vs "Start my [plan]"
10. **Exit drawer** — none vs downsell + 25% OTO

### Backlog for a SaaS web product with freemium

1. **Reverse trial introduction** — auto-enroll new free signups in 14-day Pro trial, downgrade after
2. **Trial + CC vs trial no-CC** — CC-required gate test
3. **Plan count test** — 3 vs 4 self-serve tiers
4. **"Most Popular" badge** — current placement vs middle tier vs higher-LTV tier
5. **Annual default + savings framing** — "save $144/yr" vs "20% off"
6. **Pricing localization** — regional currency display
7. **Achievement-based upgrade triggers** — "You completed X, unlock Y" vs calendar-based
8. **CTA copy** — "Start free" vs "Get started" vs "Try Pro free"
9. **Comparison table density** — full feature list vs top-10 features only
10. **Enterprise tier display** — "Custom" vs "Starting at $X" vs hidden

---

## Anti-pattern: testing 5 things at once on the same screen

If you change the headline AND the CTA AND the price AND the bullets AND the image, and the variant wins, you don't know which change drove the lift. You can't replicate or build on it.

**Rule**: one variable per test, ideally. If you must change multiple things, treat it as a redesign launch, not an experiment, and follow up with iterative tests on individual elements once the redesign is baseline.

**Exception**: when you're far from local maximum and want a directional read, a redesign launch can be the right move. Just acknowledge it's not a clean experiment.

---

## Qualitative research before quantitative tests

Before testing, talk to 5-10 users:
- Why did they install / sign up?
- What did they expect to get?
- What confused them in the funnel?
- Why did they convert (or not)?

5 user interviews often reveal a lift idea worth +20%, that you'd never have found by A/B testing button colors.

Tools: Maze, UserTesting, custom Loom screen recordings, in-app SurveyMonkey / Sprig.

---

## When NOT to run an A/B test

- Sample size insufficient (you won't reach significance in 8 weeks)
- The current paywall is so broken that any change is better — just ship the fix
- You're below 100 trial starts/week (qualitative > quantitative at this scale)
- The test would damage the product if the variant is bad (e.g., aggressive scarcity → user backlash)
- The team won't be able to act on the result (test → no decision = waste)

---

## Statistical significance in practice

Don't get superstitious about 95%. Here's a practical framework:

| Confidence | When to use |
|---|---|
| 99% | High-stakes irreversible decisions (price changes that affect existing users) |
| 95% | Default for paywall tests |
| 90% | Quick directional reads, internal experiments |
| <90% | Don't decide on one test alone — replicate or abandon |

**Bayesian alternatives**: many modern A/B tools (Statsig, Eppo, GrowthBook) use Bayesian analysis where the question is "what's the probability variant A is better than B?" — often more interpretable than p-values for product teams.

---

## Test cadence

- **Established product, mature funnel**: 2-4 tests in flight at once on different surfaces (paywall, pricing page, onboarding) with no overlap
- **New product / scaling phase**: 1 primary test at a time, fast iteration
- **Sub-1k trials/week**: quarterly test cycles, qualitative-heavy
- **10k+ trials/week**: weekly sprints, 4-6 tests/quarter

Ship a learning per cycle, not a test per cycle. Some experiments fail to ship a learning (no result) — that's a process failure, not a test failure.

---

## Documenting tests (build the playbook over time)

For each completed test, log:
- Hypothesis (the structured form above)
- Variant designs (screenshots / copy)
- Sample size, duration, traffic split
- Primary metric + guard rails (raw + percent change)
- Statistical significance
- Decision (ship variant / kill / iterate)
- Learning (what did this teach about the market / users?)

Over time this becomes your team's institutional memory. New hires read it. PMs check it before running similar tests. Founders use it to brief investors.

---

## Sources

- [Adapty 2026 — High-performing paywall](https://adapty.io/blog/high-performing-paywall-2026/)
- [RevenueCat — 4 paywall redesigns case studies](https://www.revenuecat.com/blog/growth/paywall-redesigns-case-studies/)
- [RevenueCat — 8 paywall test ideas](https://www.revenuecat.com/blog/growth/paywall-tests-grow-app-revenue/)
- [Superwall — Best practices winning paywalls](https://superwall.com/blog/superwall-best-practices-winning-paywall-strategies-and-experiments-to/)
- [Superwall — How we test paywalls](https://superwall.com/blog/how-we-test-paywalls-at-superwall-and-how-you-can-too/)
- [Stormy — 4,500+ A/B tests lessons](https://stormy.ai/blog/how-to-design-a-high-converting-mobile-app-paywall-lessons-from-4500-ab-tests)
- [Botsi — 19 paywall tests](https://www.botsi.com/blog-posts/19-paywall-tests)
- [Growth.Design — Blinkist case study](https://growth.design/case-studies/trial-paywall-challenge)
- [PNAS — Trial length experiment](https://pmc.ncbi.nlm.nih.gov/articles/PMC12217587/)
