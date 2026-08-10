# 07 — SaaS Pricing Pages

How to design pricing pages and reverse-trial flows for SaaS products. The mechanics differ from mobile paywalls: comparison tables WIN here, contact-sales gates matter, usage-based pricing is exploding.

---

## SaaS funnel benchmarks

| Stage | Median | Top quartile | Elite |
|---|---|---|---|
| Visitor → signup (freemium) | ~9% | — | — |
| Visitor → signup (trial) | ~5% | — | — |
| Visitor → pricing page | 15-30% | — | — |
| **Pricing page → trial/signup** | **3-5%** | **7-10%** | **>11%** |
| Trial opt-in (no CC) → paid | 18.2% | 35-45% | 60%+ |
| Trial opt-out (CC required) → paid | 48.8% | — | — |
| Freemium self-serve → paid | 3-5% | 6-8% | 15%+ |

**Median ChartMogul free-to-paid: 3%. Good = 6-8%. Great = 15-20%.**

By segment:
- B2C apps PLG: 2-5% free-to-paid
- B2B apps PLG: 8-15% (Bessemer)
- Developer tools: median 5% (devs evaluate fast, demanding)
- CRM / sales tools: 29% trial-to-paid (highest segment)

---

## Number of plans: 3 vs 4

- **3 tiers stays the gold standard.** 68% of high-growth SaaS use tiered (Paddle).
- **66% of users choose middle, 23% low, 11% high** (Goldilocks effect — ProfitWell).
- **3-tier structure = +30% revenue** vs single tier (Monetizely).
- **61% of A/B tests** adding a middle tier generate more revenue.
- **Slack case**: adding Enterprise tier at $500/mo → **+28% conversions on Professional** without changing features (pure anchoring).
- **4 tiers works** when the 4th fills a real gap. Collabify 2025 (4 tiers $8/$19/$39/$69) = +25% ARR, +22% enterprise conversions.

---

## "Most Popular" / "Recommended" badge

- 5 → 3 tiers + "Most Popular" badge = **+158% conversion** (1.2% → 3.1%) in case study.
- Middle tier with "Recommended for Teams" badge = **+44% middle tier, +27% global signups**.
- Target: 60-70% of customers on middle tier.
- Place badge on the **higher-LTV tier you want** to push, not necessarily the most "popular" one.

---

## Monthly / annual toggle

- **Default = annual** boosts annual adoption **2-3x** (default effect).
- Annual default → 40-60% stay annual. Monthly default → <20% switch.
- **Standard discount**: 17% (= "2 months free"). Median 20%. Range 10-25%.
- **Winning display**: "$80/mo, billed annually" > "$960/yr" (reduces sticker shock).
- **Savings framing**: $-amount saved ("save $144/user/year") > %.

---

## CTA impact

- **"Start free" / "Get started"**: maximizes volume — 8.5% trial entry (no-CC) vs 2.5% (CC-required).
- **"Request demo" / "Talk to sales"**: 1.5-4% demo request (vs 4-10% self-serve).
- **No-CC produces 27% more paying customers in absolute terms** per 1,000 visitors (volume wins).
- **CC-required produces 3x conversion** signup→paid but 60-70% fewer signups.
- Choice = function of brand awareness, product complexity, ACV target.

CTA wording impact:
- "Start" > "Get" — doubled engagement in widely-cited test (+123%, 99% significance).
- "Start Free Trial" → signals free + trial nature. "Get Started" → more inviting for PLG.

---

## Contact Sales — when to switch (the ACV rule)

| ACV | Model |
|---|---|
| < $5K | **100% self-serve.** Sales destroys unit economics. |
| $5K-$10K | Light-touch, inbound-only sales trigger |
| $10K-$50K | Standard sales cycle |
| $50K+ | Enterprise sales full-touch |

**Pricing display rule**:
- ACV < $25K → show pricing
- $25K-$100K → "Starts at" + contact
- > $100K → Contact sales only (but still display Enterprise tier even as "custom" for anchor)

**Enterprise tier visible even without price = +15% ARPU by anchoring effect** (ProfitWell).

---

## Pricing psychology B2B/SaaS

- **Charm pricing** ($29 vs $30): **+3-4% conversions** (ProfitWell meta study, 18k companies). But for premium SaaS, round prices = more trust (Anthropic $20, Cursor $20, Superhuman $30).
- **Price anchoring**: 2-tier vs 1-tier = +15% ARPU just from anchoring.
- **Decoy pricing**: 60-70% of payers on middle tier if well designed (Basic too limited, Enterprise too complex).
- **Per-seat vs usage vs flat**: 85% of leading SaaS = hybrid in 2025 (Flexera). Usage-based element = **~2x faster revenue growth** (OpenView/Metronome).

---

## Detailed teardowns

### Linear

URL: https://linear.app/pricing

- **4 plans**: Free / Basic $10 / Business $16 / Enterprise custom.
- **No "recommended" badge** — bold choice, signal "all our plans are good".
- **No m/a toggle** — annual prices direct.
- **Unlimited members on Free** — unusual (Jira limits to 10).
- Full-width comparison table, very dense by category (AI, analytics, security).
- "Trusted by 25,000+ companies" — pure trust, no logos.
- **Weakness** (per Tierly): says *what*, not *why*.

What to copy: confidence in not using "Most Popular", generous Free tier as wedge against incumbents, comparison table dense.

### Anthropic / Claude

URL: https://claude.com/pricing

- Individual: Free / Pro $17 (annual) / Max $100+.
- Teams: Team $20-$100 seats mix / Enterprise sales-assisted.
- **Interactive quiz** (5 questions) to recommend a plan — **notable UX innovation**.
- **Educational pricing** dedicated.
- Comprehensive feature comparison matrix (Free → Max 20x).
- **Enterprise 2026**: shifted from $200/user + included tokens to **$20/seat + usage-based** (doubling/tripling for heavy users).

What to copy: interactive quiz on the pricing page itself (meta — quiz funnel that converts to a plan recommendation), educational pricing tier as audience expansion.

### Notion

URL: https://notion.com/pricing

- **4 plans**: Free / Plus $10 / Business $20 (**Recommended**) / Enterprise.
- Toggle default = monthly (counter-intuitive), "Save up to 20% with yearly".
- "Recommended" badge on Business.
- "New" / "Beta" tags on AI/Agents features (urgency).
- **Logos OpenAI, Figma, Volvo, Ramp, Cursor** + testimonials.
- FAQ 16 topics including EU refund policy.

What to copy: 4-tier when you have a clear team-vs-enterprise split, "New"/"Beta" tags as feature urgency, testimonials with logos near plans.

### Figma

URL: https://www.figma.com/pricing

- **4 plans**: Starter free / Pro / Organization / Enterprise.
- **Multiple seat types**: Full $16-$90 / Dev $12-$35 / Collab $3-$5.
- Monthly/annual toggle for Pro only; Org and Enterprise = annual only.
- **AI credits per seat** (150/day Starter → 4,250/mo Enterprise) — value metric.

What to copy: differentiated seat types (full / dev / collab) as natural team-size scaling, AI credits as a quantified value metric.

### Vercel

URL: https://vercel.com/pricing

- **3 plans**: Hobby free / Pro $20 + $20 included usage / Enterprise.
- **Usage-based overages detailed**: edge requests $2/M, data $0.15/GB.
- **Integrated calculator** to simulate cost — reassures on bill shock.
- **Spend management** emphasized — addresses fear of unpredictable cost.

What to copy: built-in cost calculator for usage-based, spend caps prominent, transparent overages.

### Stripe

URL: https://stripe.com/pricing

- **No tiers** — pricing per product (Payments 2.9% + 30¢, Billing 0.7%, Radar $0.02/screen).
- "No setup fees, monthly fees, or hidden fees" repeated.
- **No calculator** — static fee schedules (Stripe assumes its buyers can do the math).
- Dev-first transparency, unique model.

What to copy: per-product pricing if you have multiple products with different value metrics, transparency as positioning.

### Cursor

URL: https://cursor.com/pricing

- **4 self-serve tiers**: Hobby free / Pro $20 / **Pro+ $60 (Recommended)** / Ultra $200.
- **Credit-based** since June 2025 (previously 500 fixed requests → ~225 at $20).
- Models consume differently (Opus > GPT-5.2 Mini).
- **Privacy mode** featured — trust signal for devs.

What to copy: credit-based pricing as a value-metric pivot, privacy mode as developer trust lever.

### Superhuman

URL: https://superhuman.com/plans

- **No free tier** — assumed premium positioning.
- **3 plans**: Starter $30/$300yr / Business $40/$396yr / Enterprise custom.
- **7-day trial** only.
- Founder rationale: "charge upfront → users activate better because they need to get their money's worth".

What to copy: no free tier as premium positioning lever (rare but powerful), short trial that forces activation, narrative around the price.

### Raycast

URL: https://www.raycast.com/pricing

- **Free forever ultra-generous** (1,000 extensions, file search, window mgmt).
- **Pro $8/mo** annual for AI, cloud sync, custom themes.
- **Team $12/user/mo**.
- Strategy: power features free → upsell AI & team collab.

What to copy: generous free as wedge for distribution, AI / sync / collab as paid lever (typical PLG).

---

## Free plan strategy — reverse trial mechanics

| Model | Signup rate | Conv paid | Best for |
|---|---|---|---|
| Freemium forever | ~9% | 3-5% (15%+ elite) | Volume, viral loops, PLG |
| Free trial no-CC | ~5% (8.5% opt-in) | 18% | B2B mid-market, fast value |
| Free trial CC-required | 2.5% | 48.8% | Strong brand / known product |
| **Reverse trial** | ~free signup | **7-21%** (+10-40% vs freemium per Dropbox / E. Verna) | Mature PLG |
| No free plan | Low volume | High intent | Premium (Superhuman) |

**Reverse trial mechanic**: user signs up → full Pro access for X days → auto-downgrade to free. Exploits loss aversion.

**Wes Bush rule (Product-Led Growth)**: free plan should deliver core value but create natural friction at scale. If a power user can live indefinitely on free, it's too generous.

---

## Trial mechanics (SaaS)

- **14 days = sweet spot** 62% of trials (ChartMogul). 7d: 14%. 30d: 14%.
- **7-day trials beat 30-day** in PNAS large-scale study: +5.6% conversion, +6.4% retention, +7.9% revenue (urgency + time-to-value effect).
- **Trial-to-paid spike around Day 7** (PLG + SLG).
- **Achievement-based vs calendar-based**: "You completed X, unlock advanced features" = **+258% conversion** vs "Your trial expires tomorrow" (trialmoments.com).

---

## Usage-based / credits / consumption

- **126% YoY growth** in credit-model adoption (Growth Unhinged 2025) — 35 → 79 among top 500.
- 2025 adopters: Figma, HubSpot, Salesforce, Lovable.
- **Usage-based page best practices**:
  1. Explain the value metric (token, request, seat, GB, run)
  2. **3 example bills** at 3 levels (low/mid/high) — critical
  3. FAQ: "What if I exceed?" / "Spending cap?" / "Notifications?"
  4. Interactive calculator (Vercel, Mapbox pattern)
  5. **Spend caps + in-product usage visibility + proactive notifications**
  6. Transparency on savings (batch -50%, caching -X%)

**Two-architecture pattern**: consumer (subscription tiers + caps) + API (pure prepaid tokens). Examples: ChatGPT Plus $20 + API $1.75/MTok. Claude Pro $17 + API $5/$25.

---

## High-conversion SaaS pricing checklist

1. **3 self-serve tiers + 1 enterprise** for anchoring
2. **"Most Popular" badge** visually distinct on middle tier (target 60-70% mix)
3. **Toggle m/a, default = annual, savings in $/user/year**
4. **Charm pricing B2C ($29), round B2B premium ($20/$30)**
5. **8-10 features per card**, dense comparison table below (sticky headers)
6. **Tooltips** on technical features (tap, not hover-only)
7. **Enterprise logos at top** + testimonial quotes near cards
8. **Unique CTA per card**: "Start free" / "Start trial" / "Contact sales"
9. **Mandatory calculator** for usage-based, example bills at 3 levels
10. **FAQ 10-20 questions** (pricing, refunds, data, contract)
11. **14-day no-CC trial** (unless strong brand), **achievement-based upgrade triggers**
12. **Spend caps + usage visibility** in-product to reassure usage-based buyers
13. **Quarterly pricing review** (Campbell) with willingness-to-pay data
14. **Bonus interactive element**: recommendation quiz (Anthropic), seat selector (Monday), ROI calculator (Asana)

---

## 2025-2026 SaaS pricing trends

- **AI rebundling**: AI moves from add-ons into core pricing. Notion Business $15 → $20 (+33%). Slack bundles AI all tiers. Airtable AI credits without raise.
- **Token prices drop 200x/year** (median 2024-2026) — AI monetization migrates from token to outcome/task.
- **AI tokens vs outcomes**: hide tokens from customers. Cursor exposes "Agent requests" not tokens.
- **Transparent pricing vs enterprise-only**: SEO/brand pressure to publish. Compromise = starter price + "Contact sales" enterprise.
- **Public multi-year discounts** (2yr 25%, 3yr 30%).
- **Outcome-based pricing** experiments: Intercom AI pay-per-resolution $0.99.
- **Privacy / data retention** becomes a pricing lever (Cursor privacy mode, Anthropic compliance API).
- **Mobile pricing UX**: 58% of pricing-page traffic = mobile. Vertical stacks + swipe tiers become standard.

---

## Sources

- [ChartMogul SaaS Conversion Report](https://chartmogul.com/reports/saas-conversion-report/)
- [Lenny's Newsletter — free-to-paid](https://www.lennysnewsletter.com/p/what-is-a-good-free-to-paid-conversion)
- [OpenView 2023 Product Benchmarks](https://openviewpartners.com/2023-product-benchmarks/)
- [Kyle Poyar — PLG benchmarks](https://www.growthunhinged.com/p/your-guide-to-plg-benchmarks)
- [Kyle Poyar — 2025 SaaS pricing changes](https://www.growthunhinged.com/p/2025-state-of-saas-pricing-changes)
- [First Page Sage — Trial benchmarks](https://firstpagesage.com/seo-blog/saas-free-trial-conversion-rate-benchmarks/)
- [Monetizely — SaaS pricing benchmarks 2025](https://www.getmonetizely.com/articles/saas-pricing-benchmarks-2025-how-do-your-monetization-metrics-stack-up)
- [Stripe — Usage-based pricing](https://stripe.com/resources/more/usage-based-pricing-strategy-for-saas)
- [Metronome — 2026 AI pricing trends](https://metronome.com/blog/2026-trends-from-cataloging-50-ai-pricing-models)
- [ProductLed — Wes Bush PLG book](https://productled.com/book/product-led-growth)
- [PNAS — Trial length experiment](https://pmc.ncbi.nlm.nih.gov/articles/PMC12217587/)
- [Tierly — Linear teardown](https://tierly.app/blog/linear-pricing-teardown)
- [Tierly — Notion teardown](https://tierly.app/blog/notion-pricing-teardown)
- [PYMNTS — Anthropic usage-based](https://www.pymnts.com/artificial-intelligence-2/2026/anthropic-switches-to-usage-based-billing-for-enterprise-customers/)
- [CXL — Reverse trial strategy](https://cxl.com/blog/reverse-trial-strategy/)
- [Userpilot — SaaS reverse trial](https://userpilot.com/blog/saas-reverse-trial/)
- [Sixteen Ventures — SaaS free trial benchmarks](https://sixteenventures.com/saas-free-trial-benchmarks)
- [Webstacks — 20 Best SaaS pricing page examples 2025](https://www.webstacks.com/blog/saas-pricing-page-design)
