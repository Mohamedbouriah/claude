<div align="center">

<img src="https://img.shields.io/badge/MARKETING-CONVERSION-6E56CF?style=flat-square&labelColor=6E56CF&color=1A1A1A" alt="MARKETING · CONVERSION">

# Autonomous Quiz Funnels

### Turn cold traffic into paying users with a funnel that qualifies before it sells.

A quiz that makes people declare what they want, then a paywall<br>that answers them in their own words. The gap between the two<br>is where a 5x conversion difference lives.

<br>

<a href="https://bizos.cc">
<img src="https://img.shields.io/badge/BizOS-build%20autonomous%20companies-0A0A0A?style=for-the-badge&labelColor=0A0A0A" alt="BizOS — build autonomous companies">
</a>

<br><br>

<a href="https://x.com/gauthierthiry"><img src="https://img.shields.io/badge/@gauthierthiry-0A0A0A?style=flat-square&logo=x&logoColor=white" alt="X"></a>
<a href="https://youtube.com/@gquthier"><img src="https://img.shields.io/badge/@gquthier-FF0000?style=flat-square&logo=youtube&logoColor=white" alt="YouTube"></a>

<br>

<sub>Agent Skill · 30+ teardowns (Cal AI, Noom, Duolingo, Blinkist, Linear, Notion, Anthropic) · 2026 benchmarks (RevenueCat, Adapty, Superwall) · 8 paywall patterns · copy library EN/FR · Next.js + TypeScript</sub>

</div>

---

Consolidates 2024-2026 benchmarks (RevenueCat 115k apps · $16B revenue, Adapty 16k apps · $3B revenue, Stormy 4500+ A/B tests, Superwall, Growth.Design), 30+ teardowns (Cal AI, Noom, Duolingo, Blinkist, Flo, Opal, Stoic, Calm, Headspace, MyFitnessPal, Strava, Linear, Notion, Anthropic, Cursor, Superhuman, Vercel, Stripe, Raycast), copy patterns, A/B test playbooks, and a Next.js + TypeScript implementation guide.

## What this skill covers

- **Conversion framework** — onboarding as belief conversion, SCORE audit, Day 0 dynamics
- **Questionnaire design** — question types, ordering, sensitive-question framing, micro-insights
- **Personalization engine** — typed code patterns mapping answers → segments → plan/paywall
- **Paywall integration** — 8 dominant patterns (Quiz→Plan, Honest Timeline, Anchor & Decoy, Feature-Gate, Usage-Limit, Now-or-Never, Social Proof, One-time)
- **Benchmarks 2026** — hard vs freemium (5x conversion gap), trial mechanics, plan duration architecture, web-vs-IAP, paywall fatigue
- **Mobile teardowns** — full library of high-revenue apps with mechanic, copy, numbers, sources
- **SaaS pricing pages** — Linear, Notion, Anthropic, Vercel, Stripe, Cursor, Superhuman, Raycast — plus reverse-trial, usage-based, contact-sales rules
- **Copy library** — headlines, CTAs, micro-insights, social proof, FAQ, loss aversion (English + French)
- **A/B test playbook** — win rates by test type (localization 62.3%, trial structure 59.6%, … visual/copy 34.6%), prioritization, statistical power
- **Tech stack** — Next.js + Zustand + Stripe + RevenueCat + Superwall, full code patterns
- **Metrics & tracking** — event taxonomy, anti-vanity-metric framework, cohort analysis

## Installation

This skill follows the [Agent Skills specification](https://agentskills.io/specification.md). Drop the directory into your agent's skills folder:

- **Claude Code**: `~/.claude/skills/quiz-funnel-expert/` or repo-local `.claude/skills/quiz-funnel-expert/`
- **Other agents (Codex, Cursor, Windsurf, etc.)**: `.agents/skills/quiz-funnel-expert/`

The skill activates on natural language triggers like "design a quiz funnel", "optimize my paywall", "trial mechanics", "Noom-style funnel", "Cal AI teardown", etc.

## Structure

```
quiz-funnel-expert/
├── SKILL.md                              # Entry point — workflow, decisions, output format
└── references/
    ├── 01-conversion-framework.md         # Mental model, SCORE audit, Day 0, psychology
    ├── 02-questionnaire-design.md         # Q types, ordering, copy rules, sensitive framing
    ├── 03-personalization-engine.md       # Typed code patterns, segments, plan/paywall mapping
    ├── 04-paywall-integration.md          # 8 patterns, trial mechanics, exit drawer, compliance
    ├── 05-paywall-benchmarks-2026.md      # RevenueCat + Adapty data, by category/geo/platform
    ├── 06-mobile-teardowns.md             # 30+ app teardowns library
    ├── 07-saas-pricing-pages.md           # Linear, Notion, Anthropic, Vercel, etc.
    ├── 08-copy-library.md                 # Reusable copy bank (EN + FR)
    ├── 09-ab-test-playbook.md             # Win rates, prio, hypotheses, stat power
    ├── 10-tech-stack.md                   # Next.js + Zustand + Stripe + RevenueCat + Superwall
    └── 11-metrics-and-tracking.md         # Event taxonomy, cohorts, anti-vanity-metric
```

## When to use

Trigger phrases that activate this skill:

- "Design a quiz funnel / onboarding quiz / subscription tunnel"
- "Optimize a paywall (mobile, SaaS, freemium, trial)"
- "Audit an existing onboarding"
- "Personalize a paywall by user segment"
- "Hard paywall vs freemium decision"
- "Trial mechanics — 3 vs 7 vs 14 days"
- "Noom / Cal AI / Blinkist teardown"
- "Build a Next.js quiz funnel"
- "SaaS pricing page (Linear, Notion, Anthropic style)"
- "Reverse trial mechanics"

## When NOT to use

- Pure post-signup B2B onboarding without paywall → use a generic `onboarding-cro` skill
- Cancel flow / churn save → use `churn-prevention`
- Public landing page without quiz → use a generic landing-page skill

## Key signature numbers (cite when arguing positions)

- **Hard paywall = 5x conversion vs freemium** (RevenueCat 2026, D35 10.7% vs 2.1%)
- **Year-1 retention identical** between hard and freemium (~27-28%)
- **89-90% of trial starts happen Day 0** (RevenueCat / Adapty 2026)
- **Localization A/B win rate = 62.3%** (highest test type, Adapty 2026)
- **Apps running 14.7+ experiments/year earn up to 40x more revenue**
- **"Continue" CTA beat descriptive CTAs by +111%** (Stormy 4500+ tests)
- **Annual default = 2-3x annual mix, +70% annual revenue**
- **Web-only loses 6.5% net revenue** vs IAP on iOS (RevenueCat A/B)
- **Toggle paywall is dead on iOS** since Jan 2026 (Apple Guideline 3.1.2)
- **Blinkist Honest Paywall = +23% trial conversions, -55% complaints**

## Sources

Primary benchmarks:
- [RevenueCat — State of Subscription Apps 2026](https://www.revenuecat.com/state-of-subscription-apps/)
- [Adapty — State of In-App Subscriptions 2026](https://adapty.io/state-of-in-app-subscriptions-report/)
- [Stormy — Lessons from 4,500+ A/B tests](https://stormy.ai/blog/how-to-design-a-high-converting-mobile-app-paywall-lessons-from-4500-ab-tests)
- [Superwall — 5 paywall patterns of million-dollar apps](https://superwall.com/blog/5-paywall-patterns-used-by-million-dollar-apps/)
- [Growth.Design — Blinkist case study](https://growth.design/case-studies/trial-paywall-challenge)

Full source list inside each reference file.

## License

MIT — see [LICENSE](LICENSE).

## Contributing

Issues and PRs welcome. The skill is a living document — benchmarks evolve, new patterns emerge, and Apple changes the rules every quarter. Open a PR with:

- The change you're proposing
- The source / data behind it
- Which reference file(s) are affected

For major rewrites of strategy sections, please open an issue first to discuss.

## Disclaimer

The benchmarks, conversion rates, and lifts cited come from the linked public sources. They are directional, not guaranteed. Test in your own funnel before basing major business decisions on aggregated medians from another dataset.

---

<div align="center">

<br>

### Building something that runs itself?

**[bizos.cc](https://bizos.cc)** — build autonomous companies.

<br>

<a href="https://x.com/gauthierthiry"><img src="https://img.shields.io/badge/@gauthierthiry-0A0A0A?style=flat-square&logo=x&logoColor=white" alt="X"></a>
<a href="https://youtube.com/@gquthier"><img src="https://img.shields.io/badge/@gquthier-FF0000?style=flat-square&logo=youtube&logoColor=white" alt="YouTube"></a>

<br><br>

<sub>Built by <a href="https://x.com/gauthierthiry">Gauthier Thiry</a></sub>

</div>
