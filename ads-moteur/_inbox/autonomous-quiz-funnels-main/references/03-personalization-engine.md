# 03 — Personalization Engine

How to map quiz answers → segments → personalized output (plan, paywall, copy, defaults). Includes typed code patterns ready to drop into a Next.js + Zustand stack.

---

## The personalization stack

```
[Quiz answers]                    →   strongly typed (TypeScript discriminated unions)
       ↓
[Derived variables]               →   numerics computed from answers (hours, volume, panier value)
       ↓
[Segment ID]                      →   single string / enum that routes downstream
       ↓
[Plan template]                   →   personalized plan object (cadence, priorities, timeline)
       ↓
[Paywall variant]                 →   {headline, bullets, social_proof_text, pricing_anchor, trial_duration}
       ↓
[Copy library lookup]             →   localized strings keyed by (segment, locale)
```

The key decoupling: **questions and answers are user-facing strings; segments and variants are internal IDs**. Never let a copy change cascade through type errors.

---

## Typed answer model (TypeScript)

```ts
// answers.ts
export type Goal = 'lose_weight' | 'build_muscle' | 'improve_cardio' | 'general_health' | 'event_prep';
export type Level = 'beginner' | 'intermediate' | 'advanced';
export type Friction = 'time' | 'motivation' | 'knowledge' | 'injury' | 'cost' | 'consistency';
export type TimeBudget = 'under_1h' | '1_3h' | '4_6h' | '7_plus_h';
export type Pace = 'easy' | 'moderate' | 'aggressive';

export interface QuizAnswers {
  goal?: Goal;
  level?: Level;
  friction?: Friction;
  timeBudget?: TimeBudget;
  pace?: Pace;
  ageBucket?: '18_24' | '25_34' | '35_44' | '45_54' | '55_plus';
  email?: string;
  // Add product-specific fields here
}
```

**Rules:**
- Every answer is `optional` → users can skip / not yet answer
- Every option is a `union literal` → typo-proof, IDE-completion, refactoring-safe
- Free-text / number fields are typed (`string`, `number`) but validated separately
- PII (`email`) lives in the same object but is *never* sent to analytics (filter on the way out)

---

## Derived variables (don't put logic in components)

```ts
// derived.ts
import type { QuizAnswers, TimeBudget, Pace } from './answers';

export function getHoursPerWeek(t?: TimeBudget): number {
  switch (t) {
    case 'under_1h': return 1;
    case '1_3h':     return 2;
    case '4_6h':     return 5;
    case '7_plus_h': return 8;
    default:         return 3;
  }
}

export function getPaceMultiplier(p?: Pace): number {
  switch (p) {
    case 'easy':       return 0.85;
    case 'moderate':   return 1.0;
    case 'aggressive': return 1.2;
    default:           return 1.0;
  }
}
```

Components receive **fully derived** values, never raw answers. Easier to test, easier to reuse.

---

## Segment routing

Build a single `segmentId` from the answers. This becomes the lookup key for downstream content.

```ts
// segment.ts
import type { QuizAnswers } from './answers';

export type Segment =
  | 'lose_weight_beginner_low_time'
  | 'lose_weight_beginner_high_time'
  | 'build_muscle_intermediate_high_time'
  | 'event_prep_advanced_aggressive'
  | 'fallback';

export function deriveSegment(a: QuizAnswers): Segment {
  if (a.goal === 'lose_weight' && a.level === 'beginner' && a.timeBudget === 'under_1h') {
    return 'lose_weight_beginner_low_time';
  }
  if (a.goal === 'lose_weight' && a.level === 'beginner') {
    return 'lose_weight_beginner_high_time';
  }
  if (a.goal === 'build_muscle' && a.level === 'intermediate' && (a.timeBudget === '4_6h' || a.timeBudget === '7_plus_h')) {
    return 'build_muscle_intermediate_high_time';
  }
  if (a.goal === 'event_prep' && a.level === 'advanced' && a.pace === 'aggressive') {
    return 'event_prep_advanced_aggressive';
  }
  return 'fallback';
}
```

**Test of validity**: if 80%+ of users land in `fallback`, the segment logic is too narrow → simplify. If 80%+ land in one segment, the segment doesn't actually segment → revisit questions.

---

## Plan template (the personalized output)

```ts
// plan.ts
import type { Segment } from './segment';

export interface PersonalizedPlan {
  headline: string;
  durationDays: number;
  weeklySessions: number;
  milestones: Array<{ day: number; label: string }>;
  primaryFocus: string;
  riskMitigation: string;
}

export const PLAN_TEMPLATES: Record<Segment, PersonalizedPlan> = {
  'lose_weight_beginner_low_time': {
    headline: 'Your 14-day low-time plan',
    durationDays: 14,
    weeklySessions: 3,
    milestones: [
      { day: 3, label: 'First habit anchored' },
      { day: 7, label: 'Visible cadence' },
      { day: 14, label: 'First measurable result' },
    ],
    primaryFocus: 'short, dense sessions you can do at home',
    riskMitigation: 'we plan for the days you skip, not the days you nail it',
  },
  'lose_weight_beginner_high_time': {
    headline: 'Your 21-day momentum plan',
    durationDays: 21,
    weeklySessions: 4,
    milestones: [
      { day: 5, label: 'Form basics dialed in' },
      { day: 14, label: 'Routine on autopilot' },
      { day: 21, label: 'Measurable weight delta' },
    ],
    primaryFocus: 'compound moves and steady cardio',
    riskMitigation: 'progressive overload that doesn\'t blow up your knees',
  },
  // ...
  'fallback': {
    headline: 'Your personalized 14-day starter plan',
    durationDays: 14,
    weeklySessions: 3,
    milestones: [{ day: 7, label: 'Cadence locked' }, { day: 14, label: 'First result' }],
    primaryFocus: 'low-friction wins',
    riskMitigation: 'we adapt as you go',
  },
};
```

**Anti-pattern**: building plan strings inline in the result component with `if/else` ladders. Move to a `Record<Segment, T>` so localization, A/B variants, and content updates are trivial.

---

## Paywall variant mapping

Same pattern: map segment → paywall config object.

```ts
// paywall-variants.ts
import type { Segment } from './segment';

export interface PaywallVariant {
  headline: string;
  subheadline: string;
  bullets: string[];
  socialProofLine: string;
  pricingAnchor: 'weekly' | 'monthly' | 'annual';
  trialDays: 0 | 3 | 7 | 14 | 30;
  primaryCta: string;
  badge?: 'most_popular' | 'best_value' | 'recommended' | null;
}

export const PAYWALL_VARIANTS: Record<Segment, PaywallVariant> = {
  'lose_weight_beginner_low_time': {
    headline: 'Unlock your 14-day low-time plan',
    subheadline: 'Built for 1h/week. No gym needed.',
    bullets: [
      'Daily 15-min sessions you can actually do',
      'Adapts when you skip a day (no guilt loop)',
      'Track weight, energy, mood in 30 seconds/day',
    ],
    socialProofLine: 'Used by 12k+ beginners who started with under 1h/week',
    pricingAnchor: 'weekly',
    trialDays: 3,
    primaryCta: 'Start my 3-day trial',
    badge: 'recommended',
  },
  'event_prep_advanced_aggressive': {
    headline: 'Your aggressive event-prep plan is ready',
    subheadline: 'Designed for advanced lifters with a hard deadline.',
    bullets: [
      'Daily blocks calibrated to your event date',
      'Macros + recovery prescription per phase',
      'Plateau detection with auto-deload',
    ],
    socialProofLine: 'Used by 3k+ advanced athletes preparing for events',
    pricingAnchor: 'annual',
    trialDays: 7,
    primaryCta: 'Lock in my plan',
    badge: 'best_value',
  },
  // ...
  'fallback': {
    headline: 'Unlock your personalized plan',
    subheadline: 'Built from your answers, adapted as you progress.',
    bullets: [
      'Daily plan tailored to your goal',
      'Weekly check-ins and adaptations',
      'Cancel anytime',
    ],
    socialProofLine: '4.7★ · 80k+ reviews',
    pricingAnchor: 'weekly',
    trialDays: 7,
    primaryCta: 'Start my 7-day trial',
    badge: 'most_popular',
  },
};
```

---

## Insight card generator (mid-quiz personalization)

Don't wait until the result. After 2-4 questions, generate a contextual insight.

```ts
// insights.ts
import type { QuizAnswers, Friction } from './answers';

const FRICTION_INSIGHT: Record<Friction, string> = {
  time:        'Your blocker is time, not motivation. We\'ll prioritize a delegation-heavy plan.',
  motivation:  'Most people in your situation fail on consistency, not effort. We\'ll build a streak.',
  knowledge:   'Knowing what to do is half the battle. Your plan strips that down to the 20% that matters.',
  injury:      'We\'ll route around your restriction with safe alternatives, not ignore it.',
  cost:        'You don\'t need expensive gear. Your plan is built on bodyweight and minimal equipment.',
  consistency: 'You don\'t need a perfect plan. You need one you can repeat for 21 days. We\'ll design for that.',
};

export function getFrictionInsight(a: QuizAnswers): string | null {
  if (!a.friction) return null;
  return FRICTION_INSIGHT[a.friction];
}
```

Surface this on the screen *after* the friction question, before the next question. The user sees their answer used in real time.

---

## ROI / projection generator (B2B + commerce funnels)

For SaaS or e-commerce funnels, compute a personalized ROI projection from the quiz answers. Used by audit tools and quiz-driven landing pages.

```ts
// projection.ts
import type { QuizAnswers } from './answers';

export interface Projection {
  monthlyVolumeBaseline: number;
  monthlyVolumeProjected: number;
  monthlyRevenueDelta: number;
  paybackWeeks: number;
  roiMultiple: number;
}

export function computeProjection(a: QuizAnswers, monthlyPriceUSD: number): Projection {
  const baseline = a.currentMonthlyVolume ?? 20;
  const focusMultiplier = a.focus === 'channel_a' ? 0.28 : a.focus === 'channel_b' ? 0.22 : 0.34;
  const timeMultiplier = a.timeBudget === 'under_1h' ? 0.9 : a.timeBudget === '7_plus_h' ? 1.15 : 1.0;
  const additional = Math.max(3, Math.round(baseline * focusMultiplier * timeMultiplier));
  const avgOrderValue = a.aov ?? 1000;
  const monthlyRevenueDelta = additional * avgOrderValue;
  const paybackWeeks = Math.max(1, Math.ceil((monthlyPriceUSD * 4) / monthlyRevenueDelta));
  const roiMultiple = Math.max(2, Math.round(monthlyRevenueDelta / monthlyPriceUSD));

  return {
    monthlyVolumeBaseline: baseline,
    monthlyVolumeProjected: baseline + additional,
    monthlyRevenueDelta,
    paybackWeeks,
    roiMultiple,
  };
}
```

This single number ("Estimated monthly revenue delta: $4,500 — payback in 2 weeks") is one of the highest-converting elements on B2B / commerce paywalls. It transforms "subscribe" from a cost into an investment.

**Caveat**: only show projections you can defend. If the math is fragile, label it "estimate" and surface assumptions in a tooltip.

---

## Copy library architecture

For multi-language and A/B-tested copy, separate strings from logic:

```ts
// copy/en.ts
export const COPY = {
  step01: {
    title: 'Get your free audit in 60 seconds',
    sub: 'See where your funnel leaks money and how competitors get ahead.',
    cta: 'Start audit',
    disclaimer: 'Free. No credit card. Results in <2 minutes.',
  },
  step03: {
    title: 'What\'s your top priority?',
    options: {
      goal_a: 'Generate more direct customers',
      goal_b: 'Build credibility with AI tools',
      goal_c: 'Both — maximize visibility',
      goal_d: 'Get a quote from an agency',
    },
  },
  // ...
} as const;
```

```ts
// copy/index.ts
import { COPY as EN } from './en';
import { COPY as FR } from './fr';

export function getCopy(locale: 'en' | 'fr' = 'en') {
  return locale === 'fr' ? FR : EN;
}
```

This makes localization (the highest-win-rate A/B test type at 62.3%) a one-file change.

---

## State management (Zustand + persist)

```ts
// store.ts
'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { QuizAnswers } from './answers';
import { trackEvent } from './analytics';

interface QuizState {
  sessionId: string | null;
  currentStep: number;
  answers: QuizAnswers;
  init: (sessionId: string) => void;
  setStep: (s: number) => void;
  saveAnswer: <K extends keyof QuizAnswers>(key: K, value: QuizAnswers[K]) => void;
  reset: () => void;
}

function trackedValue(key: keyof QuizAnswers, value: unknown) {
  // Strip PII before sending to analytics
  if (key === 'email' || key === 'phone' || key === 'name') return undefined;
  if (Array.isArray(value)) return value.join(',');
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return value;
  return undefined;
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set) => ({
      sessionId: null,
      currentStep: 0,
      answers: {},
      init: (sessionId) => set({ sessionId, currentStep: 1 }),
      setStep: (s) => set({ currentStep: s }),
      saveAnswer: (key, value) => set((state) => {
        trackEvent('question_answered', {
          step: state.currentStep,
          answer_key: key,
          answer_value: trackedValue(key, value),
          has_value: value != null && value !== '',
          sessionId: state.sessionId ?? undefined,
        });
        return { answers: { ...state.answers, [key]: value } };
      }),
      reset: () => set({ sessionId: null, currentStep: 0, answers: {} }),
    }),
    { name: 'quiz-funnel-v1' }
  )
);
```

**Why persist:** users who refresh / close / come back resume where they left off. Drop-off recovery built in.

**Why filter PII in `trackedValue`:** GDPR + product hygiene. Email never leaves your backend → analytics.

---

## Server-side personalization (rare but powerful)

For paywalls that need real-time data (current pricing experiment, geo, A/B variant), the variant decision should happen server-side at the paywall request:

```ts
// app/api/paywall-variant/route.ts
import { NextResponse } from 'next/server';
import { getActiveExperiment } from '@/lib/experiments';
import { deriveSegment } from '@/lib/segment';

export async function POST(req: Request) {
  const { answers, country, locale } = await req.json();
  const segment = deriveSegment(answers);
  const experiment = await getActiveExperiment('paywall_v3', { segment, country });
  // experiment.variant is e.g. 'control' | 'variant_a' | 'variant_b'

  return NextResponse.json({
    segment,
    variant: experiment.variant,
    // The variant config the client will render
    config: experiment.config,
  });
}
```

This decouples the paywall config from the client bundle, lets you ship A/B tests without redeploying, and keeps experiment logic on the server (fairness, no flicker).

---

## Validation: the "two opposite users" test

After implementing personalization, **manually run two opposite quiz paths** and compare outputs:

| Variable | User A | User B |
|---|---|---|
| Goal | lose_weight | build_muscle |
| Level | beginner | advanced |
| Time | under_1h | 7_plus_h |
| Pace | easy | aggressive |

If User A and User B see the **same plan**, the **same paywall headline**, the **same trial duration**, the **same social proof line** → personalization is fake. Fix or simplify.

If they see noticeably different content at every personalization point → the engine is real.
