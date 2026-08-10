# 01 — Conversion Framework

The strategic foundation for every quiz funnel decision. Read this when designing a flow from scratch or auditing an existing one.

---

## Mental model: onboarding = belief conversion

Before onboarding, the user is in a state of uncertainty:

- Is this app for me?
- Will it work in my case?
- Is it worth the setup effort?
- Will I get trapped in a subscription?
- Can I trust this app/company?

The onboarding must resolve these beliefs **in order**:

1. **Clarity** — I understand the promised outcome.
2. **Relevance** — The app understands my context.
3. **Momentum** — I have already moved forward.
4. **Value** — I can see something useful right now.
5. **Engagement** — The next step is logical.
6. **Monetization** — Paying / starting a trial becomes the natural next step.

If any layer is missing, the next layer leaks. A user who doesn't believe Step 1 will never convert at Step 6, regardless of paywall design.

---

## SCORE audit framework

Use this 5-point checklist to audit any onboarding flow:

### S — Specific Promise

- Result understood in under 5 seconds?
- Ad / App Store promise matches first screen (no bait & switch)?
- CTA sells the next action ("Start my plan", "Get my diagnosis"), not "Continue"?

### C — Commitment Ladder

- Small commitment before the big ask?
- Questions become progressively more personal/sensitive (after rationale)?
- Progress is visible AND honest? (No 95% → 95% → 95% bars)
- User can sense they are co-authoring their plan?

### O — Output Personalization

- Answers change plan, feed, defaults, reminders, examples, paywall, or offer?
- The app shows HOW answers were used (insight cards, "Based on your answer X…")?
- Two opposite users would NOT see the same result?

### R — Reduced Friction

- Email, account, permissions, payment delayed until value/context?
- Sensitive questions have rationale first?
- Unnecessary steps removed?
- Permissions requested at moment of use (priming screen before system dialog)?

### E — Experimentation

- Every step has events?
- Tests have falsifiable hypotheses?
- Success measured on **paid + refund + first_renewal + D7 retention**, not just trial start?

---

## Day 0 is the entire game

This is the most underestimated fact in subscription apps:

- **89.4–90% of trial starts happen on install day** (RevenueCat 2026, Adapty 2026)
- **44.5% of all purchases happen Day 0** (Adapty 2026)
- **84% of 3-day trial cancellations happen Day 0–1** (RevenueCat 2026)
- Business category trial start Day 0: **89.9%**
- Productivity trial start Day 0: **78.0%**

**Implication**: if the "aha moment" isn't in the first session, the user is gone. There is no "we'll get them back later".

**Action items:**
- The first session must include: clear promise → personalized result → first value preview → paywall.
- Day 0 retargeting (push, email) is dead — they never came back to receive it.
- Optimize activation **inside session 1**, not multi-day onboarding emails.

---

## Counter-intuitive: trials hurt LTV in some categories

Adapty 2026 data on direct buyers vs trial users (12-month LTV):

| Category | Trial users | Direct buyers | Verdict |
|---|---|---|---|
| Health & Fitness | High | Lower | **Trial wins** |
| Education | High | Lower | **Trial wins** |
| Utilities | High | Lower | **Trial wins** |
| AI companion | High | Lower | **Trial wins** |
| **Productivity** | $49.13 | **$56.95** | **Direct wins** |
| **Lifestyle** | –21% | Higher | **Direct wins** |
| **Graphics & Design** | – | Higher | **Direct wins** |

The myth "always offer a trial" is wrong. For Productivity, Lifestyle, and Graphics & Design, **direct purchase converts higher-LTV users**. Trial filters those who never intended to pay.

**Best practice**: attach trials to **annual plans only**; keep them **7-day or shorter** in most categories.

---

## Hard paywall vs freemium — kill the folklore

RevenueCat 2026 (115,000 apps, $16B revenue, 1B+ transactions):

| Metric | Hard paywall (median) | Freemium (median) | Gap |
|---|---|---|---|
| Download → paid @ D35 | **10.7%** | 2.1% | **5x** |
| Revenue / install @ D14 | $2.32 | $0.27 | 8–9x |
| Revenue / install @ D60 | $3.09 | $0.38 | 8x |
| Year-1 retention | ~27% | ~28% | **Identical** |

**Top-10% hard paywalls hit 38.7% D35 conversion.** Year-1 retention is identical, killing the "freemium retains better" folklore.

Adapty's counterpoint:
- **Soft paywalls out-convert hard paywalls by ~50%** on paywall-view-to-payment
- BUT **hard paywalls produce 21% higher 1-year LTV** ($41.90 vs $20.00 median)
- Top performers on hard paywalls: **$89.90 LTV** (90th percentile)

**Reconciliation:**
- Hard paywall = fewer, higher-intent converters, higher ARPU.
- Soft paywall = more volume, less $/user.
- **Choose by CAC economics, not ideology.** High CAC → hard. Low CAC + viral → soft / freemium.

**When to keep freemium / soft anyway:**
- Network / social product (paywalling kills the network effect: BeReal, Locket)
- Value grows with long usage / content creation (the user must build before paying)
- Word-of-mouth depends on a free base
- Low CAC and high virality coefficient

---

## Psychology toolkit (use deliberately, not as garnish)

### Commitment & consistency (Cialdini)
- Picking a goal increases perceived consistency with the next action.
- Best "commitment" is not "pay" — it's first "I want this outcome".
- Layer micro-choices: routine, frequency, reminder time, plan confirmation.

### Goal-gradient
- The closer the finish line feels, the more the user pushes through.
- Surface: progress bar, completed sections, "2 steps left", preview of final result.

### Endowed progress
- Feeling "not at zero" boosts completion.
- Honest use: "Step 1 complete: goal selected", "Your plan is being built…".
- Dishonest use: jumping to 60% on screen 1 — kills trust.

### Loss aversion
- Use AFTER diagnosis, never on screen 1.
- "Without a routine, your main risk is losing momentum after Day 3."
- Avoid medical / pseudo-scientific scaremongering.

### Social proof (segmented > generic)
- "Beginners with your goal usually start with…" beats "Used by 10M people".
- Stars sweet-spot: **4.2–4.5★** is more authentic than 5.0.
- Video testimonials lift conversion +80% vs text on landing pages (cautiously transferable).

### Curiosity gap
- The quiz must create anticipation: "Calculating your profile…", "Your result is different from 72% of users."
- BUT the result must be genuinely useful, otherwise it becomes clickbait and erodes trust.

### Sunk-cost effect (Noom's killer mechanic)
- After 30+ quiz questions and a personalized plan, the user has invested. The paywall feels like "don't lose what I just built", not "buy something new".
- This is why long quizzes can convert — they trade attention for commitment.

---

## Quiz length: long vs short decision

**Short (4–6 questions) when:**
- Value is obvious from the App Store / ad
- Utility-style app, simple use case
- Low personalization need
- Main action available in <30 seconds (e.g., a calculator, a converter)

**Long (8–30+ questions) when:**
- Value depends on the user profile
- Health / fitness / education / coaching / dating / finance categories
- User expects a diagnosis (medical, behavioral, level test)
- Paywall needs strong trust to justify price
- Answers create a visibly personalized result

**The long-form trap**: every additional screen has a non-zero drop-off. A long quiz only works if **each question pays its rent** — i.e., changes the product, plan, segment, or paywall in a visible way. Otherwise it's just friction.

Noom is the extreme example (113 screens, $750M ARR). Most copies of Noom add length without adding logic, and they leak.

---

## Decision framework: build a quiz funnel from zero

Step 1: **Define the activation event** — the action that correlates most with D7+D30 retention.
Step 2: **List the beliefs to convert** (clarity / relevance / momentum / value / engagement / monetization).
Step 3: **List the personalization variables** the product genuinely uses (plan, paywall, defaults, content, recommendations).
Step 4: **Drop any variable that doesn't change anything** — that's a question to delete.
Step 5: **Map 4–6 strong opening questions** — easy + interesting + segmenting.
Step 6: **Insert micro-value cards** every 2–4 questions (insight or social proof).
Step 7: **Add an honest progress indicator** if flow >4 screens.
Step 8: **Design a credible personalized result** (score + plan + timeline + diagnosis).
Step 9: **Sequence paywall as continuation of the plan**, not a rupture.
Step 10: **Segment paywall by goal / pain / level**.
Step 11: **Surface trial price, billing date, cancellation transparency** (Apple HIG, Blinkist Honest Paywall).
Step 12: **Request permissions at moment of use** (priming screen before system dialog).
Step 13: **Request email / account at value** (save plan, sync, payment), not before.
Step 14: **Instrument every step**.
Step 15: **Test trial duration, paywall placement, copy, plan count, localization** — in that order of expected win rate.

---

## When to break the rules

The framework is high-prior — but not absolute. Cases where deviation works:

- **FitnessAI / Rootd**: paywall **before** onboarding. +50% paywall visibility, 2x install-to-trial. Works because the app's value is clear from the App Store and the user has high intent. **Always test against post-onboarding paywall on YOUR app.**
- **Cal AI**: weekly pricing dynamic per user (controversial — feels unfair). Don't copy without testing.
- **Noom 113 screens**: works for a $750M ARR mass-market product where length builds commitment. A SaaS PLG product imitating this would crash conversion.

The rule: **understand WHY a pattern works** before copying it.
