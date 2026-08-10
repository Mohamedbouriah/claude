# 02 — Questionnaire Design

How to write questions that segment, personalize, and commit — without leaking users.

---

## What every question must earn

A question stays in the funnel only if it does at least one of:

1. **Personalizes the product** (plan, defaults, content, recommendations)
2. **Personalizes the paywall** (headline, pricing tier, social proof segment)
3. **Routes to a segment** (downstream cohort logic)
4. **Reduces a user risk** (eligibility, safety, medical context)
5. **Increases engagement** by making the user verbalize the goal
6. **Enables a credible diagnosis** (score, level, profile)
7. **Improves Day 0 activation** (push timing, first action, content match)

If none of the above → **delete the question** or move it after activation.

---

## High-converting question categories

| Category | Purpose | Example |
|---|---|---|
| **Goal** | Define desired outcome | "What result do you want?" |
| **Deadline** | Anchor timeline | "By when do you want to see change?" |
| **Level** | Match content difficulty | "Where are you starting from today?" |
| **Friction** | Diagnose blocker | "What stopped you before?" |
| **History** | Pattern-match | "What have you already tried?" |
| **Preference** | Match format | "What format works best for you?" |
| **Constraint** | Match capacity | "How much time can you spend?" |
| **Intensity** | Match pacing | "At what pace do you want to progress?" |
| **Motivation** | Verbalize stake | "Why now?" |
| **Risk** | Pre-empt drop-off | "What would make you give up?" |

The strongest 4-question opener is usually: **Goal → Situation → Friction → Level**. It segments cleanly, escalates engagement, and feeds the personalized result.

---

## Strategic ordering

1. **Start easy and interesting.** First 2 questions should be low-friction and feel relevant. Bad opener: "What's your weight?". Good opener: "What outcome are you aiming for?"
2. **Sensitive questions get rationale before being asked.** "We ask this to adapt your plan, not to judge you."
3. **Never stack 5 hard questions in a row.** Insert a micro-insight or social proof every 2-4 questions.
4. **Demographic data goes late** — unless required for product calculation (BMI, age-based plan, eligibility).
5. **End with a commitment question** that the user already wants to answer:
   - "Are you ready to commit to your 7-day plan?"
   - "When would you like daily reminders?"
   - "How many sessions this week?"

---

## Question copy rules

- **One idea per question.** "What's your goal AND timeline?" → split.
- **Plain language.** Avoid jargon, marketing speak, technical acronyms.
- **Mutually exclusive options.** A user must pick exactly one.
- **4–5 options max** when possible. More = decision fatigue + drop-off.
- **Avoid leading copy.** "Don't you want to lose weight?" → "What's your weight goal?"
- **Avoid double-barreled questions.** "Are you stressed and tired?" splits into 2 Q.
- **Avoid culpabilisation / shaming** ("Why aren't you in shape yet?"). Normalize: "Where are you starting from?"
- **Provide an exit.** Always include "I don't know yet", "Skip", or "Other" when uncertainty is plausible. Forces no commitment, prevents random answers.
- **Avoid "select all that apply"** when the answer must segment strongly. Multi-select dilutes segmentation.
- **For sensitive topics, normalize first**: "Many people don't know yet. Pick the closest option."

---

## Micro-value during the quiz

Don't wait until the end to deliver value. Insert **insight cards** every 2-4 questions. They:

- Validate the user's answers ("Your goal is achievable with X")
- Build credibility ("People with your profile usually struggle with Y, not Z")
- Foreshadow the personalized result ("We're going to adapt your plan to avoid the friction you mentioned")

**Examples:**

> "Your goal is achievable with 3 sessions per week."

> "Most people in your situation fail on consistency, not motivation. We'll plan for that."

> "Based on your level, we'll start with a 14-day ramp before pushing intensity."

> "Most users with your profile see results in 6–8 weeks, not 12."

> "Your friction (`time`) means we'll prioritize a delegation-heavy plan, not adding more tasks."

These cards justify the questionnaire's existence in real time and increase perceived personalization.

---

## Sensitive questions framework

For questions touching health, weight, money, sexuality, mental health, age, family:

1. **Explain why before asking.**
   "We ask your weight to calculate your daily calorie target. We don't store this data after we compute your plan."
2. **Normalize the range.**
   "Many people don't know exactly. Pick the closest option."
3. **Provide a non-answer.**
   "Prefer not to say" / "I don't know yet"
4. **Don't scaremonger.**
   Avoid "Without action, you risk…" before the user has trust.
5. **Cluster sensitive questions, don't isolate them.**
   Cluster physical-data questions in one section, mental-health questions in another. Section breaks reduce shock.

---

## Bad questions (delete on sight)

These appear in 80% of mediocre quiz funnels and always leak:

| Question | Why it fails |
|---|---|
| "What's your email?" (too early) | Friction without value, kills 10-30% |
| "How did you hear about us?" (before activation) | Marketing question, not user benefit |
| "Want to enable notifications?" (without context) | System dialog priming missing → permission denied forever |
| "What's your goal?" with vague marketing options ("Be my best self") | Doesn't segment anything |
| "Select all your problems" with 18 checkboxes | Choice paralysis + dilutes segmentation |
| "What's your budget?" before value built | Anchors low, kills upsell |
| "Tell us about yourself" (free text) | High friction, low utility |
| "Which of these features matter to you?" | Features ≠ outcomes; mismatched mental model |

---

## Question types — UI patterns

| Type | When to use | Risks |
|---|---|---|
| **Single-select radio** | Default. Segmenting question with mutually exclusive answers | None if 4-5 options |
| **Multi-select checkbox** | Preferences, content tags, soft personalization | Dilutes segmentation if used for routing |
| **Slider** | Continuous data (weight, hours/week, monthly volume) | Anchor bias — default position matters |
| **Date picker** | Deadlines, target events | Don't use for "preferred reminder time" — use buttons |
| **Text input** | Domain, email, name (rare) | High friction; only when essential |
| **Card grid (image+label)** | Visual style, body type, food preferences | Each card needs clear meaning, no ambiguity |
| **Yes/No toggle** | Binary qualifier | Often a sign you should skip the question entirely |
| **Number stepper** | Discrete count (kids, sessions/week) | Use slider if range matters |

---

## Loading screens between questions and result

After the last question, show a 3–7s loading screen. This is a **psychological gate**, not a real wait.

**What to display:**
- "Calculating your profile…" / "Building your plan…"
- 2-4 sub-steps animated (e.g., "Analyzing goal", "Matching cohort data", "Selecting exercises", "Personalizing reminders")
- Bonus: micro social proof during loading ("Last 24h: 14,832 plans created")

**Why it works:**
- Endowed progress effect — user feels the result is being earned
- Builds anticipation for the personalized result
- Hides any actual API latency (audit, scoring, recommendation engine)

**Anti-pattern**: a fake 30s loader for a 100ms calculation. Users notice the inflation. Cap at 7-8s.

---

## Length sanity checks

For a **proposed quiz length N**, ask:

1. Could you remove 30% of questions and still segment correctly? → If yes, do it.
2. Does each question feed at least one downstream variable (plan / paywall / segment)? → If no, delete or move.
3. Do you have at least one micro-insight every 4 questions? → If no, add them.
4. Could a beginner-vs-advanced user end up with the **same** result? → If yes, the quiz isn't segmenting.
5. Is there a commitment question in the last 3? → Should be.
6. Is the loading screen between last Q and result ≤7s? → Should be.

---

## Drop-off mitigation

Quiz drop-off curve typically:
- Step 1 (entry) → Step 2: 5-15% drop
- Each subsequent question: 1-3% drop
- After question 8-10: drop accelerates if no value delivered

**Mitigations:**
- Progress bar honest, visible from question 2 onwards
- Insight card every 3-4 questions
- "You're X% there" copy at midpoint
- Save state in `localStorage` + URL param so users can resume
- Email capture at strategic point (NOT step 1) so reminder push possible if drop
- Reduce question count itself if drop accelerates >5% per step beyond Q8

---

## Question library by category

Use these as starting points and adapt to your product.

### Health & Fitness
- "What's your primary goal?" (lose weight / build muscle / improve cardio / general health / event-based)
- "What's your activity level today?" (sedentary / light / moderate / active / very active)
- "What's blocked you before?" (time / motivation / knowledge / injury / cost)
- "How much time can you commit per week?" (<1h / 1-3h / 4-6h / 7+h)
- "Do you have any injuries or restrictions?" (yes/no, then specify)
- "What's your event or deadline?" (date or "no specific date")

### Education / Language
- "What language are you learning?" (cards)
- "Why are you learning?" (work / travel / culture / family / school)
- "What's your level today?" (beginner / I know some words / I can have basic convos / intermediate / fluent-ish)
- "Daily goal?" (5 min / 10 min / 20 min / 30+ min)
- (Quick test: 3-5 questions to assess level — value-in-quiz pattern)

### Productivity / Focus
- "What's your biggest distraction?" (social media / email / video / news / games / multiple)
- "When are you most distracted?" (morning / afternoon / evening / always)
- "What time of day do you do focused work?" (morning / midday / evening / night)
- "What level of control do you want?" (gentle nudges / moderate blocks / strict mode)
- "What apps/sites do you want to block?" (multi-select common offenders)

### AI apps
- "What will you use this for?" (work / study / creative / personal / business)
- "What style of result do you prefer?" (concise / detailed / formal / casual / creative)
- "What's your expertise level?" (beginner / intermediate / expert)
- "What input will you give most often?" (text / images / documents / voice)

### Finance / Fintech
- "What's your financial goal?" (save / invest / budget / debt / grow business)
- "What's your time horizon?" (<1y / 1-3y / 3-10y / 10+y)
- "Risk tolerance?" (conservative / moderate / aggressive)
- "Experience level?" (none / some / experienced)

### Dating / Relationships
- "What are you looking for?" (long-term / short-term / unsure / friends)
- "What's been hardest in dating?" (matches / messages / first dates / committing)
- "How would you describe your style?" (3-5 archetypes)
- "What's your timeline goal?" (this week / month / year / no rush)

### B2B SaaS
- "What's your role?" (founder / manager / IC / consultant)
- "Team size?" (just me / 2-10 / 11-50 / 51-200 / 200+)
- "What's the main problem you're solving today?" (3-5 product-specific options)
- "What tools are you using today?" (multi-select competitors / adjacent)
- "What's your buying timeline?" (this week / this month / this quarter / exploring)

---

## The commitment question (closing)

The last question before loading should:
- Get the user to commit to a small action they already want
- Set up the personalized result and the paywall

**Examples:**
- "When do you want to start your plan?" (today / tomorrow / this week / next week)
- "What time would you like daily reminders?" (morning / midday / evening / no reminders)
- "How many days a week do you want to commit?" (3 / 4 / 5 / 6 / 7)
- "Are you ready to follow your 14-day plan?" (yes, let's go / let me see it first)

This single question transforms the user from "evaluating" to "starting". The paywall after this feels like "unlock my plan" instead of "sign up for an app".
