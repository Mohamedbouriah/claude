# 12 — Admin Dashboard "Dashboard Réponse"

Sous-skill backend admin. Construit, à partir d'un quiz funnel existant, un **dashboard d'administration complet** : KPIs, funnel par étape, drop-off, distribution des réponses par question, détail par session, export. **Schema-agnostic** : marche pour n'importe quel quiz funnel (santé, fitness, SaaS, audit SEO, finance, dating, education) du moment que la base persiste les sessions.

> Source d'inspiration : back-office `audit.lazyrank.io/admin` (12 étapes, audit SEO B2B). Tout ce qui est LazyRank-spécifique a été extrait en config et remplacé par des contrats génériques.

---

## Quand utiliser ce sous-skill

Trigger sur :
- "Backend admin / back-office du quiz"
- "Dashboard réponses / Dashboard admin / tableau de bord interne"
- "Voir toutes les réponses du quiz" / "Voir les leads / sessions"
- "Funnel par étape / drop-off rate / completion rate"
- "Analytics interne du quiz" (sans dépendance à GA4/Mixpanel uniquement)
- "Page admin pour voir une session en détail"
- "Export CSV des leads / réponses"
- Le user vient de coder le quiz et demande "et maintenant comment je vois les data"

NE PAS livrer si :
- L'utilisateur veut un BI tool externe (Metabase, Superset, Looker) → leur recommander à la place et ne livrer que la couche données.
- L'utilisateur veut juste un export CSV ponctuel → script `scripts/export.ts`, pas de dashboard.
- L'utilisateur veut du tracking marketing (CAC, ROAS) → c'est `referer 11-metrics-and-tracking.md`, pas ce dashboard.

---

## Pourquoi un admin maison plutôt que GA4/Mixpanel only

| GA4 / Mixpanel | Admin maison |
|---|---|
| Sampling au-dessus de 10M events | 100% des sessions, requête direct DB |
| Pas de PII (email/domaine) | Email + identité visibles côté équipe |
| Funnel = écrans uniquement | Funnel + payload (réponses brutes) + état conversion par session |
| Export limité (free tier GA4) | Export CSV/JSON instantané |
| Latence 24h GA4 | Live (revalidate 0) |
| Pas d'actions (relance, replay) | Boutons admin : relancer enrichissement, marquer payé, copier lien public |

Le dashboard maison **ne remplace pas** GA4/Mixpanel/PostHog (acquisition, attribution, segments) — il **complète** : il sert à l'équipe support/produit/sales pour qualifier les leads et debugger en live.

---

## Périmètre fonctionnel — checklist du livrable

Tout dashboard "Dashboard Réponse" complet doit livrer ces 8 vues :

1. **Vue overview** (`/admin`) — KPI cards + funnel par étape + tendance 14j + top valeurs catégorielles + 30 dernières sessions.
2. **Vue session detail** (`/admin/sessions/[id]`) — toutes les réponses, état conversion, payload résultat, dump JSON brut, actions admin.
3. **Vue sessions list** (`/admin/sessions`) — table filtrable/tri (date, état, step atteint, source UTM, segment, conversion).
4. **Vue distribution réponses** (`/admin/answers`) — histogramme par question × option, avec lift conversion par option.
5. **Vue cohort** (`/admin/cohorts`) — cohortes par jour/semaine d'inscription, % conversion à J1/J7/J30.
6. **Vue export** — endpoint `/api/admin/export` qui sort CSV ou JSON.
7. **API admin** sécurisée (Basic Auth ou NextAuth) pour les actions (relance jobs, marquer publié, etc.).
8. **Garde-fous** — auth obligatoire, no-cache, fail closed si secret manquant.

---

## Métriques à calculer (la liste exhaustive)

Cette liste est le contrat fonctionnel : un dashboard incomplet en oublie. Toutes ces métriques sont **dérivables d'un schéma générique** (cf. § Data model plus bas).

### Volume & acquisition
- `totalSessions` — nombre de sessions créées
- `sessionsPast24h`, `sessionsPast7d`, `sessionsPast30d`
- `sessionsPerSource` — breakdown par `utm_source` (facebook_ads, google_ads, organic, direct, referral, autre)
- `sessionsPerCampaign` — top 10 campagnes
- `sessionsPerCountry` — détecté côté serveur (header `x-vercel-ip-country` ou IP→country)
- `sessionsPerDevice` — mobile / desktop / tablet (depuis user-agent)

### Engagement & complétion
- `avgStepReached` — moyenne `currentStep` (toutes sessions, y compris drops)
- `medianStepReached` — robuste aux outliers
- `completionRate` — % sessions ayant atteint `lastStep`
- `bounceRate` — % sessions avec `currentStep <= 1`
- `topExitStep` — étape avec le plus gros drop absolu (où on perd le plus de monde)
- `avgSessionSeconds` — `updatedAt - createdAt` moyen sur sessions actives (`currentStep > 0`)
- `medianSessionSeconds`
- `avgTimeOnStep[step]` — distribution temps par étape (nécessite event log, voir § Schéma événements)

### Capture lead
- `emailCaptured` — sessions avec un email réel (filtrer placeholders type `pending+...`)
- `emailCaptureRate` = `emailCaptured / totalSessions`
- `avgTimeToEmail` — délai entre `quiz_start` et `email_captured`
- `phoneCaptured` (si applicable)

### Conversion
- `checkoutStarted` — sessions ayant déclenché Stripe checkout (ou équivalent)
- `checkoutRate` = `checkoutStarted / emailCaptured`
- `converted` — paiement réussi (webhook reçu)
- `conversionRate` = `converted / totalSessions`
- `emailToPaidRate` = `converted / emailCaptured`
- `checkoutToPaidRate` = `converted / checkoutStarted`
- `avgTimeToConvert` — délai entre `createdAt` et `converted` (paiement)
- `welcomeEmailSent`, `welcomeEmailDeliveredRate`
- `refundCount`, `refundRate`, `avgRefundDelay`

### Funnel par étape
Pour chaque étape `step ∈ [1..N]` :
```
reached       = count(sessions where currentStep >= step)
pctOfTotal    = reached / totalSessions
dropFromPrev  = (reached_prev - reached) / reached_prev   (= 0 pour step 1)
dropAbsolute  = reached_prev - reached                     (sessions perdues)
avgTimeOnStep = avg time between step-N entered and step-(N+1) entered
```

Marquer en rouge `dropFromPrev >= 40%` (drop critique).

### Distribution des réponses (par question)
Pour chaque `question_id` du quiz :
- `answerDistribution[question_id]` — `{ option_id: count, ... }`
- `answerConversionLift[question_id]` — `{ option_id: { count, paidCount, conversionRate, lift_vs_global }, ... }`
- `dominantAnswer[question_id]` — option majoritaire
- `nullRate[question_id]` — % de sessions n'ayant pas répondu (a sauté la question ou drop avant)

### Segments (combo de réponses)
- `topConvertingSegments` — top 10 combinaisons d'options corrélées au `converted = true`. Limiter aux questions à cardinalité faible (sinon explosion combinatoire).
- `topDroppingSegments` — top 10 combos avec le plus haut drop entre l'étape 3 et l'étape paywall.

### Cohortes
Tableau cohort hebdomadaire :
| Semaine d'inscription | Inscrits | J1 retained | J7 retained | J30 retained | Convertis | Conv. rate |

### Top valeurs catégorielles
- Top 10 `domain` (LazyRank-style) ou champ équivalent (e-mail domain, niche, etc.)
- Top 10 `industry` / `category` si extrait via enrichissement

### Tendances (timeseries 14d / 30d / 90d)
Par jour :
- `started`, `emailCaptured`, `checkoutStarted`, `converted`, `revenueCents`

---

## Data model générique (Prisma)

Modèle minimal qui supporte 100% des métriques ci-dessus. **Aucune** colonne n'est métier-spécifique : tout passe en `answers: Json` (réponses) + `metadata: Json` (état métier).

```prisma
// prisma/schema.prisma — extrait

model QuizSession {
  id          String   @id @default(cuid())

  // Identité (peuplée incrémentalement durant le funnel)
  email       String?
  firstName   String?
  lastName    String?
  phone       String?

  // Progression
  currentStep Int      @default(0)
  answers     Json     @default("{}")   // { questionId: answerValue, ... }
  segment     String?                    // dérivé serveur, optionnel

  // Acquisition
  utmSource   String?
  utmMedium   String?
  utmCampaign String?
  utmTerm     String?
  utmContent  String?
  referrer    String?
  country     String?
  device      String?  // mobile | desktop | tablet
  locale      String?

  // Conversion
  checkoutStartedAt DateTime?
  convertedAt       DateTime?
  amountCents       Int?
  currency          String?
  refundedAt        DateTime?

  // Communication
  welcomeEmailSentAt DateTime?

  // Payload résultat (généré côté serveur, schema libre)
  resultData      Json?     // ex. plan personnalisé, audit, score
  resultStatus    String?   // PENDING | RUNNING | READY | FAILED
  resultError     String?

  // Lien public partageable (optionnel)
  publicSlug         String?   @unique
  publicPublishedAt  DateTime?

  // État interne admin / réservation
  metadata     Json?         // bag pour flags ad-hoc, sans toucher au schéma

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  events QuizEvent[]

  @@index([email])
  @@index([createdAt])
  @@index([convertedAt])
  @@index([utmSource])
  @@index([currentStep])
}

// Granular event log — indispensable pour le temps par étape
// et pour reconstruire le drop-off exact (pas juste currentStep max).
model QuizEvent {
  id        String   @id @default(cuid())
  sessionId String
  type      String   // step_viewed | step_completed | answer_submitted | result_viewed | paywall_viewed | checkout_started | converted | error
  step      Int?
  questionId String?
  answerValue Json?
  metadata  Json?
  createdAt DateTime @default(now())

  session QuizSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)

  @@index([sessionId, createdAt])
  @@index([type, createdAt])
}
```

**Pourquoi ce shape :**
- `answers: Json` → s'adapte à n'importe quel quiz sans migration. Trade-off : indexation faible, mais OK car la table reste petite (< 10M rows pour la quasi-totalité des cas) ; pour scale extrême, copier en colonnes via job ETL nightly.
- `QuizEvent` → permet de calculer `avgTimeOnStep`, le vrai funnel basé sur événements (pas seulement `currentStep` qui peut sauter), et un audit trail pour le support.
- `resultData: Json` → payload personnalisé renvoyé à l'utilisateur (plan, audit, score, recos). `resultStatus` permet de tracer un job async.
- `metadata: Json` → flags ad-hoc (`{ "source_replay": true, "admin_note": "lead chaud" }`) sans migration.

---

## Quiz config (source unique des labels)

Pour rester schema-agnostic, le dashboard lit la **même config** que le front quiz. Pas de duplication de labels entre `app/quiz` et `app/admin`.

```ts
// lib/quiz/config.ts
export type AnswerOption = {
  id: string;
  label: string;          // affichage humain
  value?: string | number;// optionnel, pour scoring
};

export type QuizQuestion = {
  id: string;             // clé dans answers JSON, ex. "objectif"
  step: number;           // 1..N
  label: string;          // intitulé étape, ex. "Objectif business"
  type: 'single' | 'multi' | 'text' | 'number' | 'email' | 'phone' | 'domain';
  options?: AnswerOption[]; // pour single/multi
};

export const QUIZ_CONFIG: { totalSteps: number; questions: QuizQuestion[] } = {
  totalSteps: 12,
  questions: [
    { id: 'domain',       step: 1,  label: 'Saisie domaine',      type: 'domain' },
    { id: 'objectif',     step: 3,  label: 'Objectif business',   type: 'single', options: [
      { id: 'devis',  label: 'Obtenir des demandes de devis' },
      { id: 'rdv',    label: 'Générer des rendez-vous qualifiés' },
      { id: 'ventes', label: 'Faire plus de ventes' },
      { id: 'autre',  label: 'Autre objectif' },
    ]},
    // ... reste du quiz
  ],
};

// Helpers utilisés par le dashboard
export function questionById(id: string) {
  return QUIZ_CONFIG.questions.find(q => q.id === id);
}
export function optionLabel(qid: string, value: unknown): string {
  const q = questionById(qid);
  if (!q?.options) return String(value ?? '—');
  if (Array.isArray(value)) return value.map(v => optionLabel(qid, v)).join(', ');
  return q.options.find(o => o.id === value || o.value === value)?.label ?? String(value);
}
export function stepLabel(step: number): string {
  return QUIZ_CONFIG.questions.find(q => q.step === step)?.label ?? `Étape ${step}`;
}
```

> **Règle d'or** : si un label de quiz change, il change ici ; le dashboard suit. Pas de `Record<string, string>` parallèle dans `app/admin`.

---

## Stats library — generic implementation

Tout le calcul vit dans une seule lib. **Pure Prisma + JS**, zéro dep externe.

```ts
// lib/admin/stats.ts
import 'server-only';
import { prisma } from '@/lib/db';
import { QUIZ_CONFIG, stepLabel } from '@/lib/quiz/config';

const PLACEHOLDER_EMAIL_PREFIX = 'pending+';

function pct(n: number, d: number) { return d ? Math.round((n / d) * 1000) / 10 : 0; }
function ymd(d: Date) { return d.toISOString().slice(0, 10); }
const hasRealEmail = (s: { email: string | null }) =>
  !!s.email && !s.email.startsWith(PLACEHOLDER_EMAIL_PREFIX);

export async function getDashboardStats() {
  const now = new Date();
  const since24h = new Date(now.getTime() - 24*3600*1000);
  const since7d  = new Date(now.getTime() - 7*24*3600*1000);
  const since30d = new Date(now.getTime() - 30*24*3600*1000);
  const since14d = new Date(now.getTime() - 14*24*3600*1000);

  // Une seule requête, on filtre/groupe en mémoire (OK jusqu'à ~500k rows ;
  // au-delà, splitter en aggregations SQL).
  const all = await prisma.quizSession.findMany({
    select: {
      id: true, email: true, firstName: true, currentStep: true,
      answers: true, segment: true,
      utmSource: true, utmCampaign: true, country: true, device: true,
      checkoutStartedAt: true, convertedAt: true, amountCents: true,
      welcomeEmailSentAt: true, refundedAt: true,
      resultStatus: true, createdAt: true, updatedAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const totalSessions = all.length;
  const realEmail     = all.filter(hasRealEmail);
  const checkoutStarted = all.filter(s => s.checkoutStartedAt).length;
  const converted       = all.filter(s => s.convertedAt).length;
  const refunded        = all.filter(s => s.refundedAt).length;

  const active = all.filter(s => s.currentStep > 0);
  const sessionDurations = active.map(s => (s.updatedAt.getTime() - s.createdAt.getTime()) / 1000);
  const convertedSessions = all.filter(s => s.convertedAt);

  const avg = (xs: number[]) => xs.length ? xs.reduce((a,b)=>a+b,0)/xs.length : 0;
  const median = (xs: number[]) => {
    if (!xs.length) return 0;
    const s = [...xs].sort((a,b)=>a-b);
    const m = Math.floor(s.length/2);
    return s.length % 2 ? s[m] : (s[m-1]+s[m])/2;
  };

  // Funnel par étape (basé sur currentStep — voir buildEventBasedFunnel pour version events)
  const N = QUIZ_CONFIG.totalSteps;
  const funnel: Array<{
    step: number; label: string;
    reached: number; pctOfTotal: number;
    dropFromPrev: number; dropAbsolute: number;
  }> = [];
  let prev = totalSessions;
  for (let step = 1; step <= N; step++) {
    const reached = step === 1 ? totalSessions : all.filter(s => s.currentStep >= step).length;
    funnel.push({
      step, label: stepLabel(step),
      reached, pctOfTotal: pct(reached, totalSessions),
      dropFromPrev: prev > 0 ? pct(prev - reached, prev) : 0,
      dropAbsolute: Math.max(0, prev - reached),
    });
    prev = reached;
  }

  // Top exit step (plus gros drop absolu)
  const topExit = funnel.slice(1).reduce(
    (best, row) => row.dropAbsolute > best.dropAbsolute ? row : best,
    { step: 0, label: '—', reached: 0, pctOfTotal: 0, dropFromPrev: 0, dropAbsolute: 0 },
  );

  // Tendance journalière 14j
  const dayMap = new Map<string, { day: string; started: number; emailCaptured: number; checkout: number; converted: number; revenueCents: number }>();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now.getTime() - i*24*3600*1000);
    dayMap.set(ymd(d), { day: ymd(d), started: 0, emailCaptured: 0, checkout: 0, converted: 0, revenueCents: 0 });
  }
  for (const s of all) {
    if (s.createdAt < since14d) continue;
    const row = dayMap.get(ymd(s.createdAt));
    if (!row) continue;
    row.started += 1;
    if (hasRealEmail(s)) row.emailCaptured += 1;
    if (s.checkoutStartedAt) row.checkout += 1;
    if (s.convertedAt) {
      row.converted += 1;
      row.revenueCents += s.amountCents ?? 0;
    }
  }
  const daily = Array.from(dayMap.values());

  // Distribution réponses par question
  const distribution: Record<string, Record<string, number>> = {};
  const answerConv: Record<string, Record<string, { count: number; paid: number }>> = {};
  for (const q of QUIZ_CONFIG.questions) {
    if (!q.options) continue;
    distribution[q.id] = {};
    answerConv[q.id]   = {};
    for (const opt of q.options) {
      distribution[q.id][opt.id] = 0;
      answerConv[q.id][opt.id]   = { count: 0, paid: 0 };
    }
  }
  for (const s of all) {
    const a = (s.answers ?? {}) as Record<string, unknown>;
    for (const [qid, value] of Object.entries(a)) {
      const values = Array.isArray(value) ? value : [value];
      for (const v of values) {
        const key = String(v);
        if (distribution[qid] && distribution[qid][key] !== undefined) {
          distribution[qid][key] += 1;
          answerConv[qid][key].count += 1;
          if (s.convertedAt) answerConv[qid][key].paid += 1;
        }
      }
    }
  }
  // Lift conversion par option vs taux global
  const globalConv = pct(converted, totalSessions) / 100;
  const answerLift: Record<string, Array<{ optionId: string; count: number; paid: number; rate: number; liftVsGlobal: number }>> = {};
  for (const qid of Object.keys(answerConv)) {
    answerLift[qid] = Object.entries(answerConv[qid]).map(([optionId, x]) => ({
      optionId,
      count: x.count,
      paid: x.paid,
      rate: x.count ? x.paid / x.count : 0,
      liftVsGlobal: globalConv > 0 ? ((x.count ? x.paid / x.count : 0) - globalConv) / globalConv : 0,
    })).sort((a, b) => b.rate - a.rate);
  }

  // Top sources
  const bucket = (rows: typeof all, key: keyof (typeof all)[number]) => {
    const m = new Map<string, number>();
    for (const r of rows) {
      const v = (r[key] as string | null) ?? '(none)';
      m.set(v, (m.get(v) ?? 0) + 1);
    }
    return Array.from(m.entries()).map(([k, c]) => ({ key: k, count: c })).sort((a, b) => b.count - a.count).slice(0, 10);
  };

  return {
    // Volume
    totalSessions,
    sessionsPast24h: all.filter(s => s.createdAt >= since24h).length,
    sessionsPast7d:  all.filter(s => s.createdAt >= since7d).length,
    sessionsPast30d: all.filter(s => s.createdAt >= since30d).length,

    // Engagement
    avgStepReached: avg(all.map(s => s.currentStep)),
    medianStepReached: median(all.map(s => s.currentStep)),
    bounceRate: pct(all.filter(s => s.currentStep <= 1).length, totalSessions),
    completionRate: pct(all.filter(s => s.currentStep >= N).length, totalSessions),
    avgSessionSeconds: Math.round(avg(sessionDurations)),
    medianSessionSeconds: Math.round(median(sessionDurations)),

    // Capture
    emailCaptured: realEmail.length,
    emailCaptureRate: pct(realEmail.length, totalSessions),

    // Conversion
    checkoutStarted,
    checkoutRate: pct(checkoutStarted, realEmail.length),
    converted,
    conversionRate: pct(converted, totalSessions),
    emailToPaidRate: pct(converted, realEmail.length),
    checkoutToPaidRate: pct(converted, checkoutStarted),
    avgTimeToConvertSeconds: Math.round(avg(convertedSessions.map(s => ((s.convertedAt?.getTime() ?? 0) - s.createdAt.getTime()) / 1000))),
    refundCount: refunded,
    refundRate: pct(refunded, converted),
    revenueCents: convertedSessions.reduce((sum, s) => sum + (s.amountCents ?? 0), 0),

    // Comm
    welcomeEmailSent: all.filter(s => s.welcomeEmailSentAt).length,

    // Funnel
    funnel,
    topExitStep: topExit,

    // Tendances
    daily,

    // Distribution réponses
    answerDistribution: distribution,
    answerLift,

    // Sources
    topUtmSources: bucket(all, 'utmSource'),
    topCampaigns:  bucket(all, 'utmCampaign'),
    topCountries:  bucket(all, 'country'),
    topDevices:    bucket(all, 'device'),

    // Recent
    recent: all.slice(0, 30),
  };
}

export function formatDuration(seconds: number): string {
  if (!seconds) return '—';
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m < 60) return s ? `${m}m ${s}s` : `${m}m`;
  const h = Math.floor(m / 60);
  const rm = m % 60;
  return rm ? `${h}h ${rm}m` : `${h}h`;
}

export function formatDateTime(d: Date, locale = 'fr-FR'): string {
  return d.toLocaleString(locale, { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}
```

> Performance : `findMany` sans `take` est OK jusqu'à ~500k rows en RAM. Au-delà : (a) limiter à `since30d` pour la home, (b) déléguer au Postgres via SQL (`COUNT(*) FILTER (WHERE ...)`), (c) pré-calculer dans une table `daily_metrics` mise à jour par cron.

---

## Funnel basé événements (version "événements" plus précise)

Le funnel `currentStep`-based ci-dessus a une limite : il considère qu'un user ayant atteint l'étape 7 a forcément vu 1→6. Faux si tu autorises des sauts ou si l'enregistrement est buggé. Pour les funnels où la précision compte, additionner le table `QuizEvent` :

```ts
// reach[step] = nb de sessions DISTINCT ayant émis "step_viewed" pour `step`
const events = await prisma.quizEvent.findMany({
  where: { type: 'step_viewed', createdAt: { gte: since30d } },
  select: { sessionId: true, step: true, createdAt: true },
});
const seen = new Map<number, Set<string>>();
for (const e of events) {
  if (e.step == null) continue;
  if (!seen.has(e.step)) seen.set(e.step, new Set());
  seen.get(e.step)!.add(e.sessionId);
}
const eventFunnel = Array.from({ length: N }, (_, i) => i + 1).map(step => ({
  step, label: stepLabel(step),
  reached: seen.get(step)?.size ?? 0,
}));
```

Et pour le **temps moyen sur l'étape N** :

```ts
// Group events by sessionId, sort by createdAt, calc delta entre step N et step N+1
const bySession = new Map<string, Array<{ step: number; t: number }>>();
for (const e of events) {
  if (!bySession.has(e.sessionId)) bySession.set(e.sessionId, []);
  bySession.get(e.sessionId)!.push({ step: e.step!, t: e.createdAt.getTime() });
}
const stepDurationMs: Record<number, number[]> = {};
for (const [, evs] of bySession) {
  evs.sort((a, b) => a.t - b.t);
  for (let i = 0; i < evs.length - 1; i++) {
    if (evs[i+1].step === evs[i].step + 1) {
      (stepDurationMs[evs[i].step] ??= []).push(evs[i+1].t - evs[i].t);
    }
  }
}
```

---

## Page admin overview

```tsx
// app/admin/page.tsx
import Link from 'next/link';
import { formatDateTime, formatDuration, getDashboardStats } from '@/lib/admin/stats';
import { stepLabel } from '@/lib/quiz/config';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function KpiCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-2 text-[28px] font-semibold leading-none tabular-nums">{value}</p>
      {hint ? <p className="mt-1.5 text-[11px] text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export default async function AdminPage() {
  const s = await getDashboardStats();
  const funnelMax = Math.max(1, ...s.funnel.map(r => r.reached));
  const dailyMax  = Math.max(1, ...s.daily.map(d => d.started));

  return (
    <main className="min-h-screen bg-neutral-50 py-8 px-4 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Admin</p>
            <h1 className="text-[28px] font-semibold tracking-tight">Tableau de bord funnel</h1>
            <p className="mt-1 text-sm text-muted-foreground">Snapshot live · rafraîchir pour actualiser</p>
          </div>
          <div className="flex gap-2">
            <Link href="/admin/sessions" className="rounded-lg border bg-white px-3 py-2 text-sm font-semibold">Sessions</Link>
            <Link href="/admin/answers"  className="rounded-lg border bg-white px-3 py-2 text-sm font-semibold">Réponses</Link>
            <Link href="/admin/cohorts"  className="rounded-lg border bg-white px-3 py-2 text-sm font-semibold">Cohortes</Link>
            <a href="/api/admin/export?format=csv" className="rounded-lg border bg-white px-3 py-2 text-sm font-semibold">Export CSV</a>
          </div>
        </header>

        {/* KPIs primaires */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <KpiCard label="Sessions"       value={s.totalSessions.toLocaleString('fr-FR')} hint={`${s.sessionsPast24h} · 24h, ${s.sessionsPast7d} · 7j`} />
          <KpiCard label="Emails"         value={s.emailCaptured.toLocaleString('fr-FR')} hint={`${s.emailCaptureRate}% capture`} />
          <KpiCard label="Checkouts"      value={s.checkoutStarted.toLocaleString('fr-FR')} hint={`${s.checkoutRate}% des emails`} />
          <KpiCard label="Payés"          value={s.converted.toLocaleString('fr-FR')} hint={`${s.conversionRate}% / ${s.emailToPaidRate}% emails`} />
        </section>

        {/* KPIs secondaires */}
        <section className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <KpiCard label="Step moyen atteint" value={s.avgStepReached.toFixed(1)} hint={`médiane ${s.medianStepReached}`} />
          <KpiCard label="Durée session"      value={formatDuration(s.avgSessionSeconds)} hint={`médiane ${formatDuration(s.medianSessionSeconds)}`} />
          <KpiCard label="Time-to-pay"        value={formatDuration(s.avgTimeToConvertSeconds)} hint="moyenne sessions converties" />
          <KpiCard label="Top exit"           value={`Step ${s.topExitStep.step}`} hint={`${s.topExitStep.label} · -${s.topExitStep.dropAbsolute}`} />
        </section>

        {/* Funnel */}
        <section className="mt-10">
          <h2 className="mb-3 text-lg font-semibold">Funnel par étape</h2>
          <div className="rounded-xl border bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50">
                <tr className="text-left">
                  <th className="px-4 py-2.5">#</th>
                  <th className="px-4 py-2.5">Étape</th>
                  <th className="px-4 py-2.5 text-right">Atteint</th>
                  <th className="px-4 py-2.5 text-right">% total</th>
                  <th className="px-4 py-2.5 text-right">Drop</th>
                  <th className="px-4 py-2.5 w-[30%]">Progression</th>
                </tr>
              </thead>
              <tbody>
                {s.funnel.map(row => {
                  const w = Math.round((row.reached / funnelMax) * 100);
                  const critical = row.dropFromPrev >= 40;
                  return (
                    <tr key={row.step} className="border-t">
                      <td className="px-4 py-2.5 tabular-nums">{row.step}</td>
                      <td className="px-4 py-2.5">{row.label}</td>
                      <td className="px-4 py-2.5 tabular-nums text-right">{row.reached.toLocaleString('fr-FR')}</td>
                      <td className="px-4 py-2.5 tabular-nums text-right">{row.pctOfTotal}%</td>
                      <td className={`px-4 py-2.5 tabular-nums text-right ${critical ? 'text-red-600 font-semibold' : 'text-muted-foreground'}`}>
                        {row.step === 1 ? '—' : `${row.dropFromPrev}%`}
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="h-2 w-full rounded-full bg-neutral-100 overflow-hidden">
                          <div className="h-full bg-blue-600" style={{ width: `${w}%` }} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Tendance 14j */}
        <section className="mt-10">
          <h2 className="mb-3 text-lg font-semibold">Évolution 14 derniers jours</h2>
          <div className="rounded-xl border bg-white p-4">
            <div className="flex items-end gap-1.5 h-40">
              {s.daily.map(d => {
                const h  = Math.round((d.started        / dailyMax) * 100);
                const eh = Math.round((d.emailCaptured / dailyMax) * 100);
                const ch = Math.round((d.converted     / dailyMax) * 100);
                return (
                  <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                    <div className="relative flex-1 w-full flex items-end">
                      <div className="w-full bg-neutral-200 rounded-t-sm" style={{ height: `${h}%`  }} title={`${d.started} sessions`} />
                      <div className="absolute inset-x-0 bottom-0 bg-blue-300 rounded-t-sm" style={{ height: `${eh}%` }} title={`${d.emailCaptured} emails`} />
                      <div className="absolute inset-x-0 bottom-0 bg-blue-600 rounded-t-sm" style={{ height: `${ch}%` }} title={`${d.converted} conv.`} />
                    </div>
                    <span className="text-[9px] tabular-nums whitespace-nowrap">{d.day.slice(5)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Top sources */}
        <section className="mt-10 grid sm:grid-cols-2 gap-6">
          <div>
            <h2 className="mb-3 text-lg font-semibold">Top sources UTM</h2>
            <SimpleTable rows={s.topUtmSources} />
          </div>
          <div>
            <h2 className="mb-3 text-lg font-semibold">Top pays</h2>
            <SimpleTable rows={s.topCountries} />
          </div>
        </section>

        {/* Recent sessions */}
        <section className="mt-10">
          <h2 className="mb-3 text-lg font-semibold">30 dernières sessions</h2>
          <div className="rounded-xl border bg-white overflow-x-auto">
            <table className="w-full text-xs min-w-[820px]">
              <thead className="bg-neutral-50">
                <tr className="text-left">
                  <th className="px-3 py-2">Créée</th>
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2 text-right">Step</th>
                  <th className="px-3 py-2 text-right">Durée</th>
                  <th className="px-3 py-2 text-center">Source</th>
                  <th className="px-3 py-2 text-center">État</th>
                </tr>
              </thead>
              <tbody>
                {s.recent.map(r => (
                  <tr key={r.id} className="border-t">
                    <td className="px-3 py-2 whitespace-nowrap">{formatDateTime(r.createdAt)}</td>
                    <td className="px-3 py-2"><Link href={`/admin/sessions/${r.id}`} className="font-semibold underline">{r.email ?? '—'}</Link></td>
                    <td className="px-3 py-2 tabular-nums text-right">{r.currentStep}</td>
                    <td className="px-3 py-2 tabular-nums text-right">{formatDuration(Math.round((r.updatedAt.getTime() - r.createdAt.getTime())/1000))}</td>
                    <td className="px-3 py-2 text-center">{r.utmSource ?? '—'}</td>
                    <td className="px-3 py-2 text-center">
                      {r.convertedAt
                        ? <span className="rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 font-semibold">payé</span>
                        : r.checkoutStartedAt
                        ? <span className="rounded-full border border-blue-600 text-blue-600 px-2 py-0.5 font-semibold">checkout</span>
                        : <span className="rounded-full bg-neutral-100 text-neutral-700 px-2 py-0.5 font-semibold">quiz</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

function SimpleTable({ rows }: { rows: { key: string; count: number }[] }) {
  return (
    <div className="rounded-xl border bg-white overflow-hidden">
      <table className="w-full text-sm">
        <tbody>
          {rows.map(r => (
            <tr key={r.key} className="border-t first:border-t-0">
              <td className="px-4 py-2.5 font-medium">{r.key}</td>
              <td className="px-4 py-2.5 tabular-nums text-right">{r.count}</td>
            </tr>
          ))}
          {rows.length === 0 && <tr><td className="px-4 py-6 text-center text-muted-foreground">—</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
```

---

## Page session detail

```tsx
// app/admin/sessions/[sessionId]/page.tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { formatDateTime, formatDuration } from '@/lib/admin/stats';
import { QUIZ_CONFIG, optionLabel, questionById, stepLabel } from '@/lib/quiz/config';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function SessionDetailPage({ params }: { params: { sessionId: string } }) {
  const s = await prisma.quizSession.findUnique({ where: { id: params.sessionId } });
  if (!s) notFound();

  const answers = (s.answers ?? {}) as Record<string, unknown>;
  const events = await prisma.quizEvent.findMany({
    where: { sessionId: s.id },
    orderBy: { createdAt: 'asc' },
  });
  const duration = Math.round((s.updatedAt.getTime() - s.createdAt.getTime()) / 1000);

  return (
    <main className="min-h-screen bg-neutral-50 py-8 px-4 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <Link href="/admin" className="text-xs font-semibold uppercase tracking-wider text-blue-600">← Retour</Link>
        <h1 className="mt-2 text-[28px] font-semibold">Session {s.email ?? s.id.slice(0, 8)}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{s.id}</p>

        <section className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl border bg-white p-4"><p className="text-xs uppercase tracking-wider text-muted-foreground">Étape</p><p className="mt-1 text-2xl font-semibold">{s.currentStep}/{QUIZ_CONFIG.totalSteps}</p><p className="mt-0.5 text-xs">{stepLabel(s.currentStep)}</p></div>
          <div className="rounded-xl border bg-white p-4"><p className="text-xs uppercase tracking-wider text-muted-foreground">Durée</p><p className="mt-1 text-2xl font-semibold">{formatDuration(duration)}</p></div>
          <div className="rounded-xl border bg-white p-4"><p className="text-xs uppercase tracking-wider text-muted-foreground">Source</p><p className="mt-1 text-2xl font-semibold">{s.utmSource ?? '—'}</p></div>
          <div className="rounded-xl border bg-white p-4"><p className="text-xs uppercase tracking-wider text-muted-foreground">État</p><p className="mt-1 text-2xl font-semibold">{s.convertedAt ? 'Payé' : s.checkoutStartedAt ? 'Checkout' : 'Quiz'}</p></div>
        </section>

        {/* Identité + état */}
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-semibold">Identité & état</h2>
          <FieldTable rows={[
            ['Créée',          formatDateTime(s.createdAt)],
            ['Dernière act.',  formatDateTime(s.updatedAt)],
            ['Email',          s.email],
            ['Prénom',         s.firstName],
            ['Téléphone',      s.phone],
            ['Pays',           s.country],
            ['Device',         s.device],
            ['UTM source',     s.utmSource],
            ['UTM campaign',   s.utmCampaign],
            ['Checkout démarré', s.checkoutStartedAt ? formatDateTime(s.checkoutStartedAt) : null],
            ['Converti',       s.convertedAt ? formatDateTime(s.convertedAt) : null],
            ['Montant',        s.amountCents != null ? `${(s.amountCents/100).toFixed(2)} ${s.currency ?? ''}` : null],
            ['Welcome email',  s.welcomeEmailSentAt ? formatDateTime(s.welcomeEmailSentAt) : null],
            ['Refund',         s.refundedAt ? formatDateTime(s.refundedAt) : null],
          ]} />
        </section>

        {/* Toutes les réponses */}
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-semibold">Toutes les réponses quiz</h2>
          <div className="rounded-xl border bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50">
                <tr className="text-left">
                  <th className="px-4 py-2.5">Question</th>
                  <th className="px-4 py-2.5">Réponse lisible</th>
                  <th className="px-4 py-2.5">Valeur brute</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(answers).map(([qid, value]) => {
                  const q = questionById(qid);
                  return (
                    <tr key={qid} className="border-t">
                      <td className="px-4 py-3 font-medium">{q?.label ?? qid}</td>
                      <td className="px-4 py-3">{optionLabel(qid, value)}</td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{JSON.stringify(value)}</td>
                    </tr>
                  );
                })}
                {Object.keys(answers).length === 0 && (
                  <tr><td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">Aucune réponse persistée.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Timeline événements */}
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-semibold">Timeline événements</h2>
          <div className="rounded-xl border bg-white overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-neutral-50">
                <tr className="text-left">
                  <th className="px-3 py-2">Quand</th>
                  <th className="px-3 py-2">Type</th>
                  <th className="px-3 py-2">Détail</th>
                </tr>
              </thead>
              <tbody>
                {events.map(e => (
                  <tr key={e.id} className="border-t">
                    <td className="px-3 py-2 whitespace-nowrap">{formatDateTime(e.createdAt)}</td>
                    <td className="px-3 py-2 font-mono">{e.type}</td>
                    <td className="px-3 py-2 font-mono text-muted-foreground">{e.questionId ?? `step ${e.step ?? ''}`}</td>
                  </tr>
                ))}
                {events.length === 0 && <tr><td colSpan={3} className="px-3 py-6 text-center text-muted-foreground">Aucun événement (logger pas configuré ?)</td></tr>}
              </tbody>
            </table>
          </div>
        </section>

        {/* Result data + raw JSON */}
        <section className="mt-8">
          <details className="rounded-xl border bg-white p-4">
            <summary className="cursor-pointer font-semibold">Result data ({s.resultStatus ?? '—'})</summary>
            <pre className="mt-4 max-h-[420px] overflow-auto rounded-lg bg-neutral-900 p-4 text-xs text-white">{JSON.stringify(s.resultData, null, 2)}</pre>
          </details>
        </section>

        <section className="mt-4">
          <details className="rounded-xl border bg-white p-4">
            <summary className="cursor-pointer font-semibold">Données brutes complètes</summary>
            <pre className="mt-4 max-h-[420px] overflow-auto rounded-lg bg-neutral-900 p-4 text-xs text-white">{JSON.stringify({ session: s, events }, null, 2)}</pre>
          </details>
        </section>
      </div>
    </main>
  );
}

function FieldTable({ rows }: { rows: Array<[string, unknown]> }) {
  return (
    <div className="rounded-xl border bg-white overflow-hidden">
      <table className="w-full text-sm">
        <tbody>
          {rows.map(([label, value]) => (
            <tr key={label} className="border-t first:border-t-0">
              <td className="w-[220px] bg-neutral-50 px-4 py-3 align-top text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</td>
              <td className="px-4 py-3 align-top whitespace-pre-wrap break-words">
                {value == null || value === '' ? '—'
                  : typeof value === 'boolean' ? (value ? 'Oui' : 'Non')
                  : typeof value === 'object' ? JSON.stringify(value, null, 2)
                  : String(value)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

## Page distribution réponses

```tsx
// app/admin/answers/page.tsx
import { getDashboardStats } from '@/lib/admin/stats';
import { QUIZ_CONFIG, optionLabel } from '@/lib/quiz/config';

export const dynamic = 'force-dynamic';

export default async function AnswersPage() {
  const s = await getDashboardStats();

  return (
    <main className="min-h-screen bg-neutral-50 py-8 px-4 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-[28px] font-semibold">Distribution des réponses</h1>
        <p className="mt-1 text-sm text-muted-foreground">Pour chaque question, % de répondants par option et lift conversion vs taux global.</p>

        {QUIZ_CONFIG.questions.filter(q => q.options).map(q => {
          const lifts = s.answerLift[q.id] ?? [];
          const total = lifts.reduce((a, x) => a + x.count, 0);
          return (
            <section key={q.id} className="mt-8">
              <h2 className="text-lg font-semibold">{q.label}</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">{q.id} · {total} réponses</p>
              <div className="mt-3 rounded-xl border bg-white overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-neutral-50">
                    <tr className="text-left">
                      <th className="px-4 py-2.5">Option</th>
                      <th className="px-4 py-2.5 text-right">Choix</th>
                      <th className="px-4 py-2.5 text-right">Part</th>
                      <th className="px-4 py-2.5 text-right">Conv.</th>
                      <th className="px-4 py-2.5 text-right">Lift</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lifts.map(row => (
                      <tr key={row.optionId} className="border-t">
                        <td className="px-4 py-2.5">{optionLabel(q.id, row.optionId)}</td>
                        <td className="px-4 py-2.5 tabular-nums text-right">{row.count}</td>
                        <td className="px-4 py-2.5 tabular-nums text-right">{total ? Math.round((row.count/total)*1000)/10 : 0}%</td>
                        <td className="px-4 py-2.5 tabular-nums text-right">{(row.rate*100).toFixed(1)}%</td>
                        <td className={`px-4 py-2.5 tabular-nums text-right ${row.liftVsGlobal > 0.1 ? 'text-emerald-700' : row.liftVsGlobal < -0.1 ? 'text-red-600' : ''}`}>
                          {row.liftVsGlobal === 0 ? '—' : `${row.liftVsGlobal > 0 ? '+' : ''}${Math.round(row.liftVsGlobal * 100)}%`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
```

---

## Endpoint export CSV

```ts
// app/api/admin/export/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { QUIZ_CONFIG } from '@/lib/quiz/config';

export const dynamic = 'force-dynamic';

function csvEscape(v: unknown): string {
  if (v == null) return '';
  const s = typeof v === 'object' ? JSON.stringify(v) : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET() {
  const rows = await prisma.quizSession.findMany({ orderBy: { createdAt: 'desc' } });

  const baseCols = [
    'id', 'createdAt', 'updatedAt', 'email', 'firstName', 'phone',
    'currentStep', 'utmSource', 'utmCampaign', 'country', 'device',
    'checkoutStartedAt', 'convertedAt', 'amountCents', 'currency',
    'refundedAt', 'welcomeEmailSentAt', 'resultStatus',
  ];
  const answerCols = QUIZ_CONFIG.questions.map(q => `answer_${q.id}`);
  const header = [...baseCols, ...answerCols];

  const lines = [header.join(',')];
  for (const r of rows) {
    const a = (r.answers ?? {}) as Record<string, unknown>;
    const baseVals = baseCols.map(c => csvEscape((r as Record<string, unknown>)[c]));
    const ansVals  = QUIZ_CONFIG.questions.map(q => csvEscape(a[q.id]));
    lines.push([...baseVals, ...ansVals].join(','));
  }

  return new NextResponse(lines.join('\n'), {
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': `attachment; filename="quiz-sessions-${Date.now()}.csv"`,
    },
  });
}
```

---

## Auth (gate `/admin` et `/api/admin`)

```ts
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!pathname.startsWith('/admin') && !pathname.startsWith('/api/admin')) {
    return NextResponse.next();
  }

  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    // Fail closed : si la prod n'a pas le secret, l'admin n'est PAS ouvert.
    return new NextResponse('ADMIN_PASSWORD not configured', { status: 503 });
  }

  const header = req.headers.get('authorization') ?? '';
  if (header.startsWith('Basic ')) {
    try {
      const decoded = Buffer.from(header.slice(6), 'base64').toString('utf8');
      const idx = decoded.indexOf(':');
      const pass = idx >= 0 ? decoded.slice(idx + 1) : decoded;
      if (pass === expected) return NextResponse.next();
    } catch { /* fall through */ }
  }

  return new NextResponse('Authentication required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Admin", charset="UTF-8"' },
  });
}

export const config = { matcher: ['/admin/:path*', '/api/admin/:path*'] };
```

> Pour passer à NextAuth / Clerk / Supabase Auth : remplace ce middleware par leur SDK. Garder l'ergonomie "fail closed" : si la session admin est invalide → 401.

---

## Garde-fous & règles

1. **Fail closed** : si `ADMIN_PASSWORD` (ou la session admin) est absent, retourner 503/401 — jamais ouvrir par défaut.
2. **`force-dynamic` + `revalidate = 0`** sur toutes les pages admin. Sinon Next met en cache la première vue et tu vois des stats figées.
3. **Pas de PII dans les logs** (les events server-side peuvent fuiter en stdout). Hasher l'email dans les logs.
4. **CSV export = data sensible** : le route est sous `/api/admin/*`, gated par le même middleware. Ne jamais exposer publiquement.
5. **Time zones** : `formatDateTime` doit utiliser le locale de l'équipe support (généralement `fr-FR` ou `en-US`). Stocker DB en UTC, formatter à l'affichage.
6. **N+1 queries** : le détail session fait 2 requêtes (`session` + `events`). Si tu ajoutes des relations (orders, refunds), passer en `include` plutôt que requêtes en cascade.
7. **Sampling à grosse échelle** : au-dessus de ~500k sessions, déléguer les agrégations à Postgres :
   ```sql
   SELECT
     date_trunc('day', "createdAt") AS day,
     COUNT(*) AS started,
     COUNT(*) FILTER (WHERE email IS NOT NULL AND email NOT LIKE 'pending+%') AS email_captured,
     COUNT(*) FILTER (WHERE "convertedAt" IS NOT NULL) AS converted
   FROM "QuizSession"
   WHERE "createdAt" >= NOW() - INTERVAL '90 days'
   GROUP BY 1 ORDER BY 1;
   ```
8. **Realtime (optionnel)** : ajouter SSE `/api/admin/stream` qui pousse les nouveaux `QuizEvent` (notif sales : "Nouveau lead {email} vient de finir le quiz").

---

## Adapter à un quiz existant — checklist en 8 étapes

Quand on plug ce sous-skill sur un projet existant :

1. **Aligner schéma Prisma** : ajouter les colonnes manquantes (`utmSource`, `convertedAt`, `amountCents`, etc.). Migration `prisma migrate dev`.
2. **Centraliser config quiz** dans `lib/quiz/config.ts` (un seul fichier de vérité pour les labels). Refactor le front pour le consommer.
3. **Ajouter event logger** : helper `logEvent(sessionId, type, payload)` à appeler aux moments clés (step viewed, answer submitted, paywall viewed, checkout started). Insère dans `QuizEvent`.
4. **Wire `convertedAt`/`amountCents`** depuis le webhook Stripe (`checkout.session.completed` → update session).
5. **Copier les 4 pages admin** (`overview`, `sessions/[id]`, `answers`, optionnel `cohorts`).
6. **Copier `lib/admin/stats.ts`** + adapter les `bucket(...)` aux colonnes spécifiques au projet.
7. **Activer le middleware** Basic Auth. Ajouter `ADMIN_PASSWORD` dans Vercel/Railway env.
8. **Tester** : créer 5 sessions de test (1 bounce, 1 mid-funnel, 1 email captured, 1 checkout, 1 paid). Vérifier KPIs cohérents, drop-offs cohérents, distribution réponses cohérente.

---

## Anti-patterns à refuser

1. **Hardcoder les labels d'options dans `app/admin`** — duplication garantie. Toujours lire `QUIZ_CONFIG`.
2. **`useEffect + fetch` côté client** pour charger les stats — perd le SSR, expose la query. Toujours server component + `force-dynamic`.
3. **Cache CDN sur `/admin`** — données obsolètes affichées à l'équipe. Mettre `Cache-Control: no-store` partout sous `/admin`.
4. **Pas d'auth** "parce que c'est juste un MVP" — un admin nu sur Vercel preview = leak emails de leads. Auth dès le jour 1.
5. **Optimiser sur la conversion globale en oubliant le top exit step** — le levier #1 de growth est de réduire le drop-off à l'étape qui saigne le plus.
6. **Filtrer les sessions de test en SQL** — les flagger via `metadata.test = true` côté frontend, garder la donnée brute.
7. **Lancer un dashboard sans CSV export** — sales/CS le veulent dans 100% des cas. Toujours fournir.
8. **Recompute on every page render sur >100k rows** — passer aux agrégations SQL ou pré-calcul cron dès que la home prend > 500ms.

---

## Output format quand on déclenche ce sous-skill

Livrer dans cet ordre :

1. **Diagnostic** : schéma actuel suffisant ? Events loggés ? UTM captés ? Stripe webhook wire ?
2. **Plan d'intégration** (8-step checklist ci-dessus, customisé).
3. **Patch schema Prisma** + migration concrète.
4. **`lib/quiz/config.ts`** rempli avec le quiz actuel (lire le code front pour extraire les questions/options).
5. **`lib/admin/stats.ts`** + 4 pages admin (overview, sessions list, session detail, answers).
6. **`middleware.ts`** Basic Auth.
7. **Endpoint CSV export**.
8. **Notes d'observabilité** (env vars à set, time zone, sampling si volume élevé).

Pas de pseudo-code : code TypeScript complet, copy-pasteable, qui compile.
