# 11 — Metrics & Tracking

The event taxonomy, properties, funnel definitions, and anti-vanity-metric framework. Without instrumentation, every other recommendation in this skill is useless.

---

## Why this matters

You cannot optimize what you don't measure. And you cannot measure correctly if you measure the wrong thing.

The single most common mistake: **optimizing trial-start without tracking paid + refund + first-renewal**. You ship the variant that doubles trials and discover 6 months later that revenue dropped because the new variant attracted bad-fit users who refunded.

This reference is the antidote.

---

## Minimum event taxonomy

These events should fire on every quiz funnel + paywall.

### Funnel entry

| Event | When | Required properties |
|---|---|---|
| `app_install` (mobile) / `landing_view` (web) | App opened first time / page loaded | `source`, `campaign`, `country`, `locale`, `platform` |
| `quiz_start` | User clicks "Start" on entry screen | `sessionId`, `domain` (web), `entry_variant` |

### Quiz progression

| Event | When | Required properties |
|---|---|---|
| `onboarding_step_viewed` | Each step renders | `step` (number), `step_label` (string), `sessionId` |
| `onboarding_step_completed` | User advances from step | `step`, `step_label`, `sessionId` |
| `question_answered` | User picks an answer | `step`, `question_id`, `answer_id`, `answer_value` (non-PII), `sessionId` |
| `insight_viewed` | Micro-insight card shown | `insight_id`, `step`, `sessionId` |
| `loading_viewed` | Loading screen shown | `sessionId` |
| `result_viewed` | Personalized result shown | `segment`, `score`, `plan_id`, `sessionId` |

### Paywall

| Event | When | Required properties |
|---|---|---|
| `paywall_viewed` | Paywall renders | `paywall_variant`, `segment`, `trial_duration`, `plan_interval`, `price_cents`, `currency`, `country`, `sessionId` |
| `paywall_plan_selected` | User taps a plan tile | `plan_id`, `plan_interval`, `price_cents`, `paywall_variant` |
| `paywall_cta_clicked` | User taps primary CTA | `paywall_variant`, `plan_id` |
| `paywall_closed` | User closes / dismisses | `paywall_variant`, `reason` (`x_button`, `back_navigation`, `system_back`) |
| `paywall_exit_offer_viewed` | Exit drawer shown | `paywall_variant`, `offer_id` |
| `paywall_exit_offer_accepted` | User takes the exit offer | `paywall_variant`, `offer_id` |

### Conversion

| Event | When | Required properties |
|---|---|---|
| `trial_started` | Trial subscription started | `plan_id`, `trial_duration`, `price_cents`, `currency`, `paywall_variant`, `sessionId` |
| `purchase_completed` | First charge processed | `plan_id`, `price_cents`, `currency`, `plan_interval`, `paywall_variant`, `sessionId` |
| `trial_cancelled` | User cancels trial before charge | `plan_id`, `trial_duration`, `days_into_trial`, `cancel_reason` (if asked) |
| `refund_requested` | Refund flow initiated | `plan_id`, `amount`, `days_after_purchase`, `reason` |
| `subscription_renewed` | Auto-renewal succeeds | `plan_id`, `renewal_count` |
| `subscription_churned` | Subscription ends without renewal | `plan_id`, `lifetime_revenue`, `lifetime_days`, `churn_reason` |

### Activation + retention

| Event | When | Required properties |
|---|---|---|
| `signup_prompt_viewed` | Email/account screen shown | `step`, `sessionId` |
| `signup_completed` | Account created | `auth_method`, `sessionId` |
| `permission_priming_viewed` | Pre-prompt screen shown | `permission`, `sessionId` |
| `permission_system_prompt_shown` | Apple/Google dialog shown | `permission`, `sessionId` |
| `permission_granted` | User grants | `permission`, `sessionId` |
| `permission_denied` | User denies | `permission`, `sessionId` |
| `first_value_completed` | User does the activation event | `value_action`, `sessionId` |
| `d1_returned` | User opens app on Day 1 after install | `sessionId` |
| `d7_retained` | User active on Day 7 | `sessionId` |
| `d30_retained` | User active on Day 30 | `sessionId` |

---

## Universal properties (attach to every event)

```json
{
  "sessionId": "ulid_or_uuid",
  "userId": "stable_user_id_when_known",
  "anonymousId": "device_id_or_browser_id",
  "platform": "ios | android | web",
  "appVersion": "1.4.2",
  "country": "FR",
  "locale": "fr-FR",
  "currency": "EUR",
  "source": "facebook_ads | google_ads | tiktok_ads | organic | direct | referral",
  "campaign": "campaign_name",
  "ad_id": "ad_creative_id",
  "experiment_assignments": {
    "paywall_v3": "variant_b",
    "trial_length_test": "control"
  }
}
```

The `experiment_assignments` block is critical — every event must carry the user's variant assignment for any active experiment, so analysis is straightforward.

---

## Properties to track on `paywall_viewed` specifically

Paywall analytics is the high-leverage piece. Be obsessive here.

```json
{
  "paywall_variant": "v3_blinkist_timeline",
  "segment": "lose_weight_beginner_low_time",
  "plans_displayed": ["weekly_9_99", "annual_79_99"],
  "default_plan": "annual_79_99",
  "trial_duration": 7,
  "trial_required_payment": false,
  "shows_close_button": true,
  "shows_exit_offer_drawer": true,
  "exposure_count": 1,
  "answers_summary": {
    "goal": "lose_weight",
    "level": "beginner",
    "timeBudget": "under_1h"
  }
}
```

`exposure_count` lets you compute paywall fatigue (Nami ML 2026: -0.11 to -0.40 conversion per additional exposure).

---

## Funnel definitions

### Quiz funnel completion

```
quiz_start (100%)
  → onboarding_step_completed for step N (X%)
  → result_viewed (Y%)
  → paywall_viewed (Z%)
  → trial_started (T%)
  → purchase_completed (P%)
```

Track drop-off at each step. Identify the biggest leak and focus there.

### Day 0 conversion funnel (the killer one)

```
app_install Day 0 (100%)
  → quiz_start Day 0
  → result_viewed Day 0
  → paywall_viewed Day 0
  → trial_started Day 0
  → trial_cancelled Day 0
  → purchase_completed (after trial → Day X)
```

90% of trial starts happen Day 0. 84% of 3-day trial cancellations happen Day 0-1. This funnel is your business.

---

## Cohort analysis (the right way)

Segment by:
- **Install week / month**
- **Source** (Facebook ads / Google ads / organic / referral)
- **Country**
- **Onboarding variant** (long quiz / short quiz / control)
- **Paywall variant**
- **Plan picked at first purchase**
- **Trial duration** (3d / 7d / 14d cohorts)

The single most useful cohort cut for subscription apps: **paywall variant × plan interval × country**. This isolates the actual driver of LTV.

---

## North-star metric (pick exactly one)

Resist the temptation to optimize 5 metrics. Pick **one north-star** for the funnel, communicated org-wide.

For mobile subscription apps, the standard candidates:

| Metric | What it captures | When to use |
|---|---|---|
| **Net revenue per install (RPI) D60** | Revenue earned per acquired user, after fees, in a 60-day window | Default for paid acquisition apps |
| **Trial-to-paid conversion** | Conversion quality | Strong only if paired with refund tracking |
| **Day 60 paid retention** | LTV proxy | When LTV > 12 months |
| **Activation rate (D7)** | Funnel + product fit | Free-to-paid funnels with weak Day 0 conversion |
| **Net revenue per visitor (web)** | Top-of-funnel + funnel together | SaaS web pricing pages |

Once chosen, **every A/B test must report the north-star** — even when the primary metric is something else.

---

## Anti-vanity-metric framework

A vanity metric is a number that goes up without revenue going up. The biggest offenders:

| Vanity metric | Why it lies |
|---|---|
| **Paywall views** | More views ≠ more revenue. Could just be more impressions on bad-fit users |
| **Trial starts** | 84% cancel Day 0-1 on 3d trials. Trial starts ≠ trials that convert |
| **Sign-ups / accounts created** | Account ≠ user. Could be drive-by curiosity |
| **Push opt-in rate** | High opt-in is good IF it lifts retention. Track retention, not opt-in |
| **Total downloads** | Cheap acquisition gives you downloads, not customers |
| **Quiz completion rate** | A user who completes the quiz but never converts is a friction signal, not a win |

**Rule**: every metric you report must have a **dollar-or-retention companion**. If you can't tie it to either, it's vanity.

---

## Fast-feedback metrics for product iteration

Long-term metrics (LTV, D30, D60) take weeks to read. For day-to-day product iteration, use fast proxies:

| Fast metric | Long-term proxy for |
|---|---|
| `paywall_viewed → trial_started` rate (Day 0) | Trial-to-paid conversion |
| `quiz_started → result_viewed` rate | Quiz drop-off / friction |
| `trial_started → trial_cancelled Day 0-1` rate | Trial-to-paid conversion |
| `result_viewed → paywall_viewed` rate | Personalization quality (proxy) |
| `permission_priming → permission_granted` rate | Push retention proxy |

These read in hours/days, not weeks. Useful for daily PR experimentation.

---

## Refund tracking — non-negotiable

Track:
- `refund_requested` event with `days_after_purchase`
- `refund_completed` (when actually processed)
- Compute **15-day refund rate**, **30-day refund rate**

A test variant that lifts trial-start +30% but has +50% refund rate has **likely destroyed revenue**. You won't know without explicit refund tracking.

In RevenueCat or Adapty dashboards, this is automated. If you're using Stripe directly, listen for `charge.refunded` webhooks and create the event.

---

## Renewal / churn tracking

- `subscription_renewed` per renewal cycle
- `subscription_churned` (with `lifetime_revenue` + `lifetime_days`)
- **First renewal rate** = % of paid users who pass through one renewal (the most important LTV signal)
- **Cohort retention curves** — % active by Day 30, 60, 90, 180, 365

For mobile, RevenueCat's webhook surface gives you all of these out of the box. Don't try to compute renewal state from raw Stripe / App Store webhooks unless you have a strong reason — RevenueCat normalizes the platform mess.

---

## Web-to-app attribution

The hardest part. After Apple ATT (iOS 14.5+, 2021), tracking from web ad click → app install → app subscription is broken without effort.

Solutions:
1. **Branch.io / AppsFlyer / Adjust** for deep-link attribution + post-install event tracking
2. **RevenueCat** for unified subscription state across web purchase → app entitlement
3. **First-party server-side tracking** (CAPI for Meta, GA4 server-side, Mixpanel server-side) — increasingly mandatory in 2026

Attribution will never be 100% accurate post-ATT. Aim for **directional**, not perfect. Use **incrementality testing** for high-budget channels — turn the channel off for 2 weeks, observe revenue impact.

---

## Privacy + GDPR compliance

- **Strip PII at the analytics boundary** (email, phone, raw name) — already covered in `trackedValue` filter
- **Hashed identifiers** (sha256) for cross-platform user joining when needed
- **Cookie consent** at the EU level — gates Meta Pixel, GA4, etc. (not first-party server events)
- **Data retention** policies — delete raw event data after N days, keep aggregates
- **Right-to-be-forgotten** endpoint — must work end-to-end (analytics platforms often have a deletion API)

---

## Sample dashboards / reports to build

### Paywall variant comparison

| Variant | Views | Trials | Trial → paid | Refunds | Net revenue | RPI D60 |
|---|---|---|---|---|---|---|
| control | — | — | — | — | — | — |
| variant_a | — | — | — | — | — | — |
| variant_b | — | — | — | — | — | — |

### Quiz drop-off heat map

```
Step  | Views   | Completion | Drop-off
1     | 10,000  | 95%        | 5%
2     |  9,500  | 92%        | 8%
3     |  8,740  | 89%        | 11%
...
12    |  4,200  | 80% (paywall view rate from start)
```

Color the highest drop-off step red — that's where you focus.

### Day 0 cohort

```
Day 0 trial start rate: X% of installs
Day 0-1 trial cancel rate: Y% of trials
Day 0 purchase rate (no trial): Z% of installs
```

If Day 0 trial start <20% of installs, the entry funnel is broken.
If Day 0-1 cancel rate >50% on 3d trials, the paywall is over-promising.

---

## Tools landscape (2026)

| Tool | Best for | Notes |
|---|---|---|
| **PostHog** | Product analytics + feature flags + experiments | Self-hostable, generous free tier, all-in-one |
| **Mixpanel** | Product analytics, cohort analysis | Mature, strong cohort builder |
| **Amplitude** | Product analytics, behavioral cohorts | Strong on enterprise |
| **GA4** | Top-of-funnel + ad attribution | Mandatory for paid acquisition |
| **Meta Pixel + CAPI** | Meta ads optimization | Server-side recommended post-ATT |
| **RevenueCat** | Mobile subscription state + analytics | Industry standard, free up to 10k MTR |
| **Adapty** | Mobile subscription + paywall builder | Strong A/B framework |
| **Superwall** | Mobile paywall A/B | Best for fast iteration without app updates |
| **Statsig / Eppo / GrowthBook** | A/B testing infra (Bayesian) | When you outgrow basic A/B in PostHog |

---

## Final check: the metrics ladder

Build the ladder bottom-up:

1. **Events fire correctly** in dev + staging (manual QA) ✓
2. **Properties are present and typed** on every event ✓
3. **Sessions / funnels resolve in your analytics tool** (no orphans) ✓
4. **Dashboards exist** for: quiz drop-off, paywall variants, Day 0 cohort, refund rate, first renewal ✓
5. **A/B test results pull cleanly** with experiment_assignments ✓
6. **North-star metric is computed and reviewed weekly** ✓
7. **Refund + renewal data feed back into A/B test analysis** ✓
8. **Fast-feedback proxies** are validated against long-term metrics ✓

If any rung is missing, the ones above it are unreliable. Build the ladder before optimizing.
