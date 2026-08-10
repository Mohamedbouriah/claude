# 10 — Tech Stack

Concrete architecture, libraries, and code patterns to ship a quiz funnel + paywall. Battle-tested choices for 2024-2026.

---

## Default stack (Next.js + TypeScript + Stripe + RevenueCat for mobile)

**Web (quiz funnel + checkout):**
- **Next.js 14+** (App Router) for the quiz UI + API routes
- **TypeScript** strict mode (typed answers, segments, paywall variants)
- **Tailwind CSS** for styling + design tokens
- **Framer Motion** for step transitions
- **Zustand** with `persist` middleware for client state (resume on refresh)
- **Prisma** + Postgres (Supabase or self-hosted) for sessions + answers persistence
- **Stripe** Checkout + webhook for payments
- **PostHog / Mixpanel / GA4** for analytics
- **Vercel** for hosting (preview URLs make A/B variant review trivial)

**Mobile (iOS + Android):**
- **Native (Swift / Kotlin)** for the app shell
- **RevenueCat** SDK for subscription state, entitlements, A/B test framework
- **Superwall** SDK for remote paywall configuration + A/B (alternative: Adapty, Purchasely)
- **Firebase / Mixpanel / Amplitude** for analytics

---

## Why this stack (instead of alternatives)

| Choice | Why | Alternatives + when |
|---|---|---|
| Next.js App Router | Server components for personalization on render, edge runtime for fast paywall variant resolution, preview URLs for design review | Remix (great router), Astro (content-heavy), SvelteKit |
| Zustand persist | Tiny, typed, client-side persistence out of the box, no boilerplate | Jotai (atomic), Redux Toolkit (overkill), Context API (no persist) |
| Prisma + Postgres | Type-safe DB queries, easy schema migrations, good ecosystem | Drizzle (more lightweight), Kysely (query-builder, no ORM) |
| Stripe Checkout | Hosted = ~zero PCI scope, great mobile UX, supports trial mechanics natively | Paddle (better for international VAT), Lemon Squeezy (MoR for indie) |
| RevenueCat | Industry standard for mobile subscription state across iOS/Android, used by 115k apps, $16B revenue tracked | Adapty (similar, slightly different feature set), Purchasely (paywall-first), Glassfy |
| Superwall | Best for remote paywall A/B without app store releases | Adapty Paywall Builder, Purchasely (pre-built templates) |

---

## Quiz funnel architecture

```
┌────────────────────────────────────────────────────────────┐
│   /quiz (Next.js page)                                     │
│   - Client wrapper (QuizShell.tsx)                         │
│   - 12-20 step components (Step01Entry, Step02..., etc.)   │
│   - Zustand store (persist) for answers + currentStep      │
└────────────────────────────────────────────────────────────┘
                          ↓
┌────────────────────────────────────────────────────────────┐
│   API routes                                               │
│   - POST /api/quiz/start         → create session,         │
│                                    persist domain/email    │
│   - POST /api/quiz/[id]/answer   → persist answer          │
│   - POST /api/quiz/[id]/run      → trigger any async job   │
│                                    (audit, AI scoring)     │
│   - GET  /api/quiz/[id]/result   → fetch personalized      │
│                                    plan + paywall variant  │
└────────────────────────────────────────────────────────────┘
                          ↓
┌────────────────────────────────────────────────────────────┐
│   POST /api/checkout             → Stripe Checkout session │
│   POST /api/stripe/webhook       → mark session converted  │
└────────────────────────────────────────────────────────────┘
                          ↓
┌────────────────────────────────────────────────────────────┐
│   /thanks/[sessionId]            → onboarding next step    │
│                                    (download app, save     │
│                                    plan, schedule reminder)│
└────────────────────────────────────────────────────────────┘
```

---

## Zustand store pattern

```ts
// lib/quiz/store.ts
'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { trackEvent } from '@/lib/analytics';

export type Goal = 'lose_weight' | 'build_muscle' | 'improve_cardio' | 'event_prep';
export type Level = 'beginner' | 'intermediate' | 'advanced';
export type TimeBudget = 'under_1h' | '1_3h' | '4_6h' | '7_plus_h';

export interface QuizAnswers {
  email?: string;
  goal?: Goal;
  level?: Level;
  timeBudget?: TimeBudget;
}

interface QuizState {
  sessionId: string | null;
  currentStep: number;
  answers: QuizAnswers;
  init: (sessionId: string) => void;
  setStep: (step: number) => void;
  saveAnswer: <K extends keyof QuizAnswers>(key: K, value: QuizAnswers[K]) => void;
  reset: () => void;
}

function trackedValue(key: keyof QuizAnswers, value: unknown) {
  if (key === 'email') return undefined; // strip PII
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
      setStep: (step) => set({ currentStep: step }),
      saveAnswer: (key, value) =>
        set((state) => {
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

export async function persistAnswer(sessionId: string, step: number, key: string, value: unknown) {
  try {
    await fetch(`/api/quiz/${sessionId}/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ step, key, value }),
    });
  } catch {
    // local state still persisted via zustand persist
  }
}
```

**Key choices:**
- `persist` middleware → users can refresh / close / come back, state recovers
- PII stripping in `trackedValue` → email never leaves to analytics
- Each `saveAnswer` fires a `question_answered` event
- `persistAnswer` is fire-and-forget to backend (idempotent on the server)

---

## Quiz shell pattern

```tsx
// components/quiz/QuizShell.tsx
'use client';
import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useQuizStore } from '@/lib/quiz/store';
import { trackEvent } from '@/lib/analytics';
import { ProgressBar } from './ProgressBar';
import Step01Entry from './steps/Step01Entry';
import Step02Loading from './steps/Step02Loading';
import Step03Goal from './steps/Step03Goal';
// ...

const TOTAL_STEPS = 12;
const STEP_LABELS: Record<number, string> = {
  1: 'entry',
  2: 'loading',
  3: 'goal',
  // ...
  12: 'paywall',
};

export function QuizShell() {
  const currentStep = useQuizStore((s) => s.currentStep);
  const step = currentStep === 0 ? 1 : currentStep;

  useEffect(() => {
    trackEvent('onboarding_step_viewed', {
      step,
      step_label: STEP_LABELS[step] ?? 'unknown',
    });
  }, [step]);

  const onNext = () => {
    const { currentStep: now, setStep } = useQuizStore.getState();
    trackEvent('onboarding_step_completed', {
      step: now,
      step_label: STEP_LABELS[now] ?? 'unknown',
    });
    setStep(Math.min(now + 1, TOTAL_STEPS));
  };

  const renderStep = () => {
    switch (step) {
      case 1: return <Step01Entry onNext={onNext} />;
      case 2: return <Step02Loading onNext={onNext} />;
      case 3: return <Step03Goal onNext={onNext} />;
      // ...
      default: return <Step01Entry onNext={onNext} />;
    }
  };

  return (
    <>
      <ProgressBar current={step} total={TOTAL_STEPS} />
      <AnimatePresence mode="wait">
        <div key={step}>{renderStep()}</div>
      </AnimatePresence>
    </>
  );
}
```

---

## Step component pattern

```tsx
// components/quiz/steps/Step03Goal.tsx
'use client';
import { motion } from 'framer-motion';
import { useQuizStore, persistAnswer, type Goal } from '@/lib/quiz/store';

const OPTIONS: Array<{ value: Goal; label: string; emoji: string }> = [
  { value: 'lose_weight', label: 'Lose weight', emoji: '⚖️' },
  { value: 'build_muscle', label: 'Build muscle', emoji: '💪' },
  { value: 'improve_cardio', label: 'Improve cardio', emoji: '🏃' },
  { value: 'event_prep', label: 'Prepare for an event', emoji: '🎯' },
];

export default function Step03Goal({ onNext }: { onNext: () => void }) {
  const { sessionId, saveAnswer } = useQuizStore();

  const handleSelect = async (value: Goal) => {
    saveAnswer('goal', value);
    if (sessionId) {
      await persistAnswer(sessionId, 3, 'goal', value);
    }
    onNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="quiz-card"
    >
      <h1 className="text-2xl font-semibold mb-6">What's your top priority?</h1>
      <div className="grid gap-3">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleSelect(opt.value)}
            className="quiz-option"
          >
            <span className="text-2xl mr-3">{opt.emoji}</span>
            <span>{opt.label}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
```

---

## API route patterns

### Start session

```ts
// app/api/quiz/start/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { nanoid } from 'nanoid';

export async function POST(req: Request) {
  const body = await req.json();
  const sessionId = nanoid(12);

  await prisma.quizSession.create({
    data: {
      id: sessionId,
      domain: body.domain ?? null,
      utmSource: body.utm_source ?? null,
      utmCampaign: body.utm_campaign ?? null,
      offerExpiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48h offer window
    },
  });

  return NextResponse.json({ sessionId, offerExpiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000) });
}
```

### Persist answer

```ts
// app/api/quiz/[id]/answer/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { step, key, value } = await req.json();

  await prisma.quizAnswer.upsert({
    where: { sessionId_key: { sessionId: params.id, key } },
    create: { sessionId: params.id, step, key, value: JSON.stringify(value) },
    update: { step, value: JSON.stringify(value) },
  });

  return NextResponse.json({ ok: true });
}
```

### Stripe checkout

```ts
// app/api/checkout/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-10-29' });

export async function POST(req: Request) {
  const { sessionId } = await req.json();

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
    subscription_data: {
      trial_period_days: 3,
      metadata: { quizSessionId: sessionId },
    },
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/thanks/${sessionId}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/quiz?canceled=1`,
    metadata: { quizSessionId: sessionId },
  });

  return NextResponse.json({ url: session.url });
}
```

### Stripe webhook

```ts
// app/api/stripe/webhook/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-10-29' });

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature')!;
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return new NextResponse('webhook signature failed', { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const quizSessionId = session.metadata?.quizSessionId;
    if (quizSessionId) {
      await prisma.quizSession.update({
        where: { id: quizSessionId },
        data: { converted: true, convertedAt: new Date() },
      });
    }
  }

  return NextResponse.json({ received: true });
}
```

---

## Prisma schema starter

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model QuizSession {
  id              String    @id
  domain          String?
  email           String?
  utmSource       String?
  utmCampaign     String?
  segment         String?
  paywallVariant  String?
  offerExpiresAt  DateTime?
  converted       Boolean   @default(false)
  convertedAt     DateTime?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  answers         QuizAnswer[]

  @@index([createdAt])
  @@index([converted])
}

model QuizAnswer {
  id         String      @id @default(cuid())
  sessionId  String
  session    QuizSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  step       Int
  key        String
  value      String
  createdAt  DateTime    @default(now())

  @@unique([sessionId, key])
  @@index([sessionId])
}
```

---

## Mobile: RevenueCat + Superwall integration sketch (Swift)

```swift
// AppDelegate / SceneDelegate
import RevenueCat
import SuperwallKit

func application(...) {
    Purchases.configure(withAPIKey: "YOUR_REVENUECAT_PUBLIC_KEY")

    Superwall.configure(
        apiKey: "YOUR_SUPERWALL_PUBLIC_KEY",
        purchaseController: RevenueCatPurchaseController.shared
    )
}

// After quiz completion:
func showPaywall(answers: QuizAnswers) {
    // Pass answers as user attributes for paywall targeting
    Superwall.shared.setUserAttributes([
        "goal": answers.goal,
        "level": answers.level,
        "timeBudget": answers.timeBudget,
    ])

    // Trigger the paywall — Superwall picks the variant remotely
    Superwall.shared.register(event: "quiz_completed_show_paywall")
}
```

The paywall variant config lives in the Superwall dashboard, fetched at runtime. New variants ship without app updates.

RevenueCat handles entitlements check across iOS/Android/web purchases unified:

```swift
Purchases.shared.getCustomerInfo { (customerInfo, error) in
    if customerInfo?.entitlements["pro"]?.isActive == true {
        // user has access
    }
}
```

---

## Web-to-app handoff

For Noom-style web quiz → mobile app install:

1. **Web checkout** with Stripe completes the subscription
2. **Backend** creates a server-side user account, links the Stripe customer to a token
3. **Magic link** emailed to the user with a one-time install token
4. **App install** from a deep link (App Store / Play Store with referral attribution)
5. **First app launch** reads the install token from the deep link, calls backend to claim the subscription
6. **RevenueCat** is informed via webhook that this user has an existing entitlement
7. **App skips the paywall** — user is already paid

Tools that help: [RevenueCat](https://www.revenuecat.com/) for the cross-platform entitlement bridging, [Branch.io](https://branch.io/) or [AppsFlyer](https://www.appsflyer.com/) for deep link attribution.

---

## Analytics integration

```ts
// lib/analytics.ts
'use client';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    posthog?: { capture: (event: string, props?: Record<string, unknown>) => void };
  }
}

export function trackEvent(event: string, props: Record<string, unknown> = {}) {
  // GA4
  window.gtag?.('event', event, props);

  // Meta Pixel (mapped to standard events when applicable)
  const fbqMap: Record<string, string> = {
    paywall_viewed: 'InitiateCheckout',
    purchase_completed: 'Purchase',
    trial_started: 'StartTrial',
  };
  const fbqEvent = fbqMap[event];
  if (fbqEvent) {
    window.fbq?.('track', fbqEvent, props);
  } else {
    window.fbq?.('trackCustom', event, props);
  }

  // PostHog / Mixpanel
  window.posthog?.capture(event, props);
}
```

See [11-metrics-and-tracking.md](11-metrics-and-tracking.md) for the full event taxonomy.

---

## Audit / scoring backend (when the quiz computes something)

Pattern for quiz funnels that compute a personalized score / audit / report:

1. Quiz Step 1 collects domain / email / minimal input
2. **Fire-and-forget POST** to `/api/quiz/[id]/run` to start the audit
3. Steps 2-N fill the time while the audit runs (~5-30s)
4. Step N (audit results) fetches the audit result
5. Result powers the personalized paywall

Parallel fan-out example for an SEO audit:

```ts
// lib/audit/run.ts
import pLimit from 'p-limit';

const limit = pLimit(4); // max 4 concurrent network calls

export async function runQuickAudit(domain: string) {
  const [seoData, llmMentions, homepage, sectorClassification] = await Promise.all([
    limit(() => fetchSeoData(domain)),       // ~$0.005, ~3s
    limit(() => probeLlmMentions(domain)),    // ~$0.012, ~10s
    limit(() => fetchHomepageMeta(domain)),   // free, ~1s
    limit(() => classifySector(domain)),      // ~$0.001, ~2s
  ]);

  return {
    seo: seoData,
    llm: llmMentions,
    meta: homepage,
    sector: sectorClassification,
  };
}
```

**Cost discipline**: cap cost-per-audit (e.g., $0.02). Use cheap models for classification, reserve expensive ones for high-intent moments. Always have a graceful degradation if a source fails.

---

## Security / privacy checklist

- [ ] **All API routes validate input** (Zod / valibot)
- [ ] **Rate limiting** on `/api/quiz/start` and `/api/checkout` (Upstash Redis or middleware)
- [ ] **Email never sent to analytics** (filter in `trackedValue`)
- [ ] **PII encrypted at rest** if storing beyond session
- [ ] **CORS locked down** on API routes
- [ ] **Stripe webhook signature verified** (above)
- [ ] **Service role keys in server env vars** only (never `NEXT_PUBLIC_*`)
- [ ] **GDPR / CCPA disclosure** at email capture step + privacy policy link
- [ ] **Cookie consent banner** if running ad pixels in EU
- [ ] **Data export + deletion endpoint** for GDPR right-to-be-forgotten

---

## Mobile paywall infra comparison (RevenueCat / Adapty / Superwall / Purchasely)

| Feature | RevenueCat | Adapty | Superwall | Purchasely |
|---|---|---|---|---|
| Entitlement state | ✅ Best-in-class | ✅ Solid | ❌ Relies on RC/Adapty | ✅ Solid |
| Remote paywall config | Yes (basic) | ✅ Strong (Paywall Builder) | ✅ Best-in-class | ✅ Strong |
| A/B testing | ✅ | ✅ | ✅ | ✅ |
| Free tier | 10k MTR free | 10k MTR free | Free | Limited |
| Pricing | 1% above $10k MTR | 1% above $10k MTR | Tiered, paywall-events-based | Paid plans |
| Best for | Subscription state of truth | Mid-market with paywall builder | Indie + small teams iterating fast | Mid-market with content-heavy paywalls |

**Common 2026 stack**: RevenueCat for entitlement + Superwall for paywall remote config + A/B. Two systems, well-integrated.

---

## Performance + UX details

- **Preload critical assets** for the next step (image, font) on the current step
- **Debounce** answer persistence to backend (250ms) on slider/text inputs
- **Optimistic UI** for answer save — the next screen appears instantly, persistence happens in background
- **Skeleton states** during loading screen — never a blank screen
- **Reduced motion respect** — `prefers-reduced-motion: reduce` should kill complex framer animations
- **Mobile-first layout** — 60%+ of B2C traffic is mobile, paywall pages 58% mobile (Webstacks)
- **Touch targets ≥44pt** — Apple HIG minimum

---

## Deployment + CI

- **Vercel** for the Next.js app — zero-config deploys, preview URLs per PR (great for design review of paywall variants)
- **GitHub Actions** for tests + Prisma migrate on deploy
- **Stripe webhook** locally tested via `stripe listen --forward-to localhost:3000/api/stripe/webhook`
- **Environment variables** in Vercel dashboard, never committed
- **Database migrations** via `prisma migrate deploy` in CI
