// Part 3b: NEW lessons for Credit (5 new), Investing (4 new), Saving (4 new)
const fs = require("fs");
const LESSONS_PATH = "public/data/lessons.json";
const DIST_LESSONS = "dist/data/lessons.json";
const lessons = JSON.parse(fs.readFileSync(LESSONS_PATH, "utf8"));

const newLessons = [
  // ── CREDIT: 5 new lessons (orders 4-8) ───────────────────────────────────
  {
    id: "lesson-credit-004",
    course_id: "course-credit-003",
    title: "Building Credit from Scratch",
    order: 4,
    duration_minutes: 8,
    xp_reward: 75,
    is_sample: false,
    created_date: "2026-03-20T00:00:00.000Z",
    updated_date: "2026-03-20T00:00:00.000Z",
    content: `## Building Credit from Scratch

Starting with no credit history is a classic catch-22: you can't get approved for credit because you have no credit, and you can't build credit because you can't get approved. This lesson gives you the practical path through that barrier.

## Why Credit History Matters Before You Need It

Many people don't think about credit until they want to rent an apartment, buy a car, or apply for a mortgage. By that point, having zero credit history — or worse, a thin file — can result in rejection or very high interest rates.

Building credit is a slow process that requires years of consistent behavior. The best time to start is before you actually need it.

## Method 1: Secured Credit Card (Best Starting Point)

A secured credit card requires a cash deposit as collateral. Your deposit (usually $200–$500) becomes your credit limit. You use it like a normal credit card and pay it off monthly.

**Why it works:** The issuer reports your payment history to the credit bureaus — just like a regular card. After 6–12 months of on-time payments, you build a legitimate credit history.

**Best secured cards:**
- Discover it® Secured (earns cashback, no annual fee, automatic upgrade review after 7 months)
- Capital One Platinum Secured (low minimum deposit options)
- OpenSky Secured Visa (no credit check to apply)

**Strategy:** Use it for small, regular purchases (gas, groceries). Pay the full balance every month. Never miss a payment.

## Method 2: Become an Authorized User

Ask a parent, family member, or trusted friend with good credit to add you as an authorized user on their credit card. Their account history may appear on your credit report, giving you an instant boost.

**Requirements:** The account holder must have a good payment history. Their account age and low utilization benefits you.

**Risk:** If the primary cardholder misses payments, it could hurt your score too. Choose carefully — someone with a long, clean history at low utilization.

You don't need to actually use (or even hold) the card. The account history is the benefit.

## Method 3: Credit Builder Loans

Offered by credit unions and some online lenders (Self, Credit Strong). Here's how they work:

1. You "borrow" a small amount ($300–$1,000)
2. The money is held in a savings account — you can't access it yet
3. You make monthly payments (which are reported to credit bureaus)
4. After the loan term, you receive the money (minus fees)

**Result:** You've built a payment history AND saved money. Credit builder loans are specifically designed for people with no credit history.

## Method 4: Student Credit Cards

If you're in college, student credit cards have lighter approval requirements than standard cards.

**Good options:** Discover it® Student, Capital One SavorOne Student, Bank of America Customized Cash Rewards for Students.

Same rules apply: use it for small purchases, pay in full every month, never miss a payment.

## Building Credit: The Non-Negotiables

Once you have any credit account:

**Always pay on time.** This is 35% of your FICO score. One 30-day late payment can drop your score 50–100 points and stays on your report 7 years.

**Keep utilization under 30%.** Don't max out a secured card. Use 10–30% of the limit each month.

**Don't open too many accounts at once.** Each application creates a hard inquiry. Opening 5 cards in 3 months signals financial desperation to lenders.

**Be patient.** It takes 6–12 months of activity before a credit score is generated. Scores improve gradually with consistent behavior over years, not weeks.

## Timeline: What to Expect

| Milestone | Timeline |
|---|---|
| First credit score generated | 6 months of account activity |
| Score reaches "Fair" (580–669) | 6–18 months of on-time payments |
| Score reaches "Good" (670–739) | 1–3 years of clean history |
| Score reaches "Very Good" (740+) | 3–7 years of perfect history |

## Key Takeaway

Start with one secured credit card or become an authorized user. Use it for small purchases, pay in full every month, never miss a payment. Patience and consistency are the only requirements — there are no shortcuts.`,
    quiz_questions: [
      {
        question: "Why is a secured credit card the best starting point for building credit from scratch?",
        options: [
          "It earns higher interest than a regular savings account",
          "It requires a cash deposit as collateral, making it easy to get approved, while reporting payment history to credit bureaus just like a regular card",
          "It doesn't require any income to qualify",
          "It has no credit limit, so you can spend freely"
        ],
        correct_answer: 1,
        explanation: "Secured cards are accessible to people with no credit history because the deposit eliminates the lender's risk. They report to bureaus identically to regular cards, building real credit history."
      },
      {
        question: "Being added as an authorized user on someone else's credit card can help your credit score because:",
        options: [
          "You get access to their credit limit for your own purchases",
          "Their account's payment history and account age may appear on your credit report, instantly adding positive history",
          "It prevents hard inquiries on your file",
          "Authorized users are not affected by the primary holder's payment behavior"
        ],
        correct_answer: 1,
        explanation: "Authorized user status allows the primary account's positive history to show on your credit report. Choose someone with a long, clean history and low utilization for maximum benefit."
      },
      {
        question: "How long does it typically take to generate your first credit score after opening a first credit account?",
        options: ["2 weeks", "3 months", "6 months", "1 year"],
        correct_answer: 2,
        explanation: "FICO requires at least 6 months of account activity before generating a score. You need at least one account open for 6+ months and reported to a bureau within the last 6 months."
      }
    ]
  },
  {
    id: "lesson-credit-005",
    course_id: "course-credit-003",
    title: "How Interest Works: APR, Daily Rates, and the True Cost of Debt",
    order: 5,
    duration_minutes: 9,
    xp_reward: 80,
    is_sample: false,
    created_date: "2026-03-20T00:00:00.000Z",
    updated_date: "2026-03-20T00:00:00.000Z",
    content: `## How Interest Really Works

Most people know that carrying a credit card balance costs interest. Few people understand the mechanics well enough to grasp how quickly it compounds. This lesson breaks down the math — so you can make informed decisions about any debt you carry.

## APR to Daily Rate: The Math Behind the Bill

Credit card APR (Annual Percentage Rate) sounds manageable. 24% sounds like a yearly problem. But it's actually charged daily.

**How to calculate your daily rate:**
Daily Rate = APR ÷ 365

At 24% APR: 24% ÷ 365 = **0.0658% per day**

On a $2,000 balance:
Daily interest charge = $2,000 × 0.000658 = **$1.32/day**
Monthly interest charge = $1.32 × 30 = **$39.45/month**

That $39.45 is added to your balance. Then next month, you're being charged interest on $2,039.45 — and so on.

## Average Daily Balance: How Banks Calculate Your Charge

Credit card interest isn't simply charged on your end-of-month balance. It's calculated on your **average daily balance** — the average of your balance on each day of the billing cycle.

**Example:**
- Days 1–10: $1,000 balance
- Days 11–20: You charge $500 more → $1,500 balance
- Days 21–30: You pay $300 → $1,200 balance

Average daily balance = (10 × $1,000 + 10 × $1,500 + 10 × $1,200) ÷ 30 = **$1,233**

Interest charge at 24% APR = $1,233 × (0.24/365) × 30 = **$24.36**

This means charges made early in the cycle cost more in interest than charges made late.

## The Minimum Payment Trap: Full Math

Here's a real example of what minimum payments cost. Starting balance: $5,000 at 22% APR. Minimum payment: 2% of balance or $25, whichever is greater.

| Approach | Time to Pay Off | Total Interest | Total Paid |
|---|---|---|---|
| Minimum payments only | ~15 years | ~$5,700 | ~$10,700 |
| $150/month fixed | ~4 years | ~$1,800 | ~$6,800 |
| $300/month fixed | ~20 months | ~$820 | ~$5,820 |
| Full balance next month | 0 | $0 | $5,000 |

The minimum payment path costs more in interest than the original balance. This is the credit card business model.

## Promotional APR Offers: Read the Fine Print

**0% Introductory APR:**
Many cards offer 0% APR for 12–21 months on purchases or balance transfers. This can be very useful — but watch for:

- **Deferred interest** (common on store cards): If you don't pay the full balance by the end of the promo period, you're charged ALL of the interest that would have accrued — retroactively. This is very different from 0% APR where interest simply doesn't accrue.

- **Balance transfer fee:** Typically 3–5% of the transferred amount. On $5,000 transferred, that's $150–$250 upfront.

- **Regular APR after promo:** If you still have a balance after the promo period, the standard APR (often 25%+) kicks in on whatever remains.

## Compound Interest in Debt: The Snowball Effect

When you carry a balance and only pay the minimum:
- Interest accrues on the principal
- Minimum payment often doesn't cover the full interest
- Your balance *grows* even while making payments

This is debt compounding against you. The same math that grows investments slowly over decades can trap you in a debt spiral in months.

**Breaking the cycle requires:** Paying more than the interest accruing each month. For a $2,000 balance at 22% APR accruing ~$37/month in interest, paying $37 or less accomplishes nothing. You must pay above $37 just to make any progress.

## Key Takeaway

APR is a daily charge on your outstanding balance. Minimum payments are designed to maximize interest revenue for the bank. The only way to avoid interest entirely is to pay your full statement balance every month. For existing debt, every dollar above the minimum payment meaningfully reduces your total cost.`,
    quiz_questions: [
      {
        question: "A credit card charges 20% APR. What is the approximate daily interest rate on a $1,500 balance?",
        options: ["20% per day", "0.055% per day ($0.82/day)", "1.67% per day", "0.20% per day"],
        correct_answer: 1,
        explanation: "Daily rate = 20% ÷ 365 = 0.0548%. On $1,500: $1,500 × 0.000548 = $0.82/day, or ~$24.66/month. Small daily charges compound quickly across a year."
      },
      {
        question: "A store credit card offers '0% interest for 18 months — deferred interest.' What does 'deferred interest' mean?",
        options: [
          "Interest is permanently waived if you make all minimum payments",
          "If any balance remains at the end of 18 months, you are charged ALL interest that would have accrued since purchase — retroactively",
          "Interest is reduced by 50% during the promotional period",
          "It works the same as a standard 0% APR offer"
        ],
        correct_answer: 1,
        explanation: "Deferred interest is very different from 0% APR. One missed payoff at the end triggers all accumulated interest from the start. On a $1,000 purchase at 29.99% over 18 months, that could be $450+ appearing on a single statement."
      },
      {
        question: "On a $3,000 credit card balance at 22% APR with minimum-only payments, approximately how much will you pay in total (principal + interest)?",
        options: ["$3,000", "$3,600", "$4,500 or more — potentially doubling the original balance", "$3,100 (just a small interest charge)"],
        correct_answer: 2,
        explanation: "At 22% APR with minimum payments, a $3,000 balance can result in $3,000+ in interest charges over 10–15 years, nearly doubling the total cost. The minimum payment is designed to maximize interest revenue."
      }
    ]
  },
  {
    id: "lesson-credit-006",
    course_id: "course-credit-003",
    title: "Debt Repayment Strategies: Avalanche and Snowball",
    order: 6,
    duration_minutes: 8,
    xp_reward: 75,
    is_sample: false,
    created_date: "2026-03-20T00:00:00.000Z",
    updated_date: "2026-03-20T00:00:00.000Z",
    content: `## Debt Repayment Strategies

If you have multiple debts — credit cards, student loans, car payment, personal loan — you need a strategy for paying them off. Two proven methods: the Avalanche (mathematically optimal) and the Snowball (psychologically powerful). Understanding both lets you choose the right tool for your situation.

## The Foundation: Always Pay All Minimums First

Before any strategy, pay the minimum payment on every single debt every month. Missing any minimum payment triggers late fees, damages your credit score, and may raise your interest rate.

Your "extra" money — anything above all minimums combined — is what gets applied strategically.

## Method 1: The Debt Avalanche (Mathematically Optimal)

**Strategy:** Put all extra money toward the highest-interest-rate debt first. Once that's paid off, roll the full payment to the next highest-rate debt. Repeat.

**Why it's optimal:** You eliminate the most expensive debt first, paying the least total interest over time.

**Example — 4 debts:**

| Debt | Balance | APR | Minimum |
|---|---|---|---|
| Credit Card A | $3,200 | 24% | $64 |
| Credit Card B | $1,800 | 19% | $36 |
| Car Loan | $8,500 | 7% | $185 |
| Student Loan | $12,000 | 5% | $120 |
| **Total** | **$25,500** | | **$405** |

With $600/month available (minimums + $195 extra):

Avalanche order: Credit Card A (24%) → Credit Card B (19%) → Car Loan (7%) → Student Loan (5%)

Every extra dollar goes to Credit Card A while paying minimums on everything else. Once Card A is paid off, those dollars roll to Card B, and so on.

**Total interest saved vs. minimum payments:** $4,000–$8,000+ depending on timeline.

## Method 2: The Debt Snowball (Psychologically Powerful)

**Strategy:** Pay off the smallest balance first, regardless of interest rate. Then roll that payment to the next smallest.

**Why it works:** Paying off a complete debt — even a small one — provides a psychological win that maintains motivation. Research by Harvard Business School found the snowball method leads to higher debt payoff completion rates than the avalanche, despite costing more in interest.

Using the same 4 debts:

Snowball order: Credit Card B ($1,800) → Credit Card A ($3,200) → Car Loan ($8,500) → Student Loan ($12,000)

**The trade-off:** You'll pay $500–$2,000 more in total interest vs. the avalanche, but you're more likely to actually finish.

## Choosing Your Method

| You Should Use Avalanche If: | You Should Use Snowball If: |
|---|---|
| High interest rates are your biggest burden | You need motivation to keep going |
| You're analytical and respond to numbers | You've abandoned debt plans before |
| The rate difference between debts is large | Your smallest debts can be knocked out quickly |
| You can stay disciplined over years | You want visible progress |

**Hybrid approach:** Many people start with the snowball for early wins (pay off 1–2 small debts), then switch to avalanche for the remaining larger balances.

## Accelerating Debt Payoff: Extra Strategies

**1. Find extra money to throw at debt:**
- Side hustle income
- Tax refunds
- Windfalls (birthday money, bonuses)
- Selling unused items
- Cutting one spending category temporarily

**2. Balance transfers:**
Move high-interest credit card debt to a 0% APR balance transfer card. Every dollar of payment goes to principal instead of interest during the promo period. Requires good credit (670+) to qualify.

**3. Debt consolidation loans:**
Combine multiple debts into one loan at a lower rate. Simplifies payments and reduces interest — but only if you don't rack up new credit card debt after consolidating.

**4. Negotiate interest rates:**
Call your credit card company and ask for a lower rate. If you've been a customer for years with good payment history, this works more often than you'd expect. A 5–10 minute call that drops your rate 3–5% can save hundreds.

## The Debt-Free Finish Line

When a debt is fully paid off — celebrate, then immediately redirect those payments. Don't let freed-up cash flow silently disappear into lifestyle spending. This "debt roll-up" is how average incomes create extraordinary debt payoff timelines.

## Key Takeaway

Avalanche saves the most money. Snowball provides the most motivation. Both beat minimum payments by thousands of dollars. Pick one, stick to it, and use every windfall to accelerate. The only bad strategy is not having one.`,
    quiz_questions: [
      {
        question: "What is the primary difference between the debt avalanche and the debt snowball?",
        options: [
          "Avalanche requires higher income; snowball works for any income level",
          "Avalanche targets highest-interest debt first (saves most money); snowball targets smallest balance first (provides faster wins and motivation)",
          "Snowball is only for credit cards; avalanche works for all debt types",
          "They are different names for the same strategy"
        ],
        correct_answer: 1,
        explanation: "Avalanche is mathematically optimal — attack highest APR first to minimize total interest. Snowball is psychologically powerful — knock out small balances for visible wins. Both beat minimum payments by thousands."
      },
      {
        question: "After you finish paying off a debt using either method, what should you do with the freed-up monthly payment?",
        options: [
          "Reward yourself by spending it — you earned it",
          "Immediately roll it to the next debt target (the 'debt roll-up'), dramatically accelerating payoff",
          "Split it evenly among all remaining debts",
          "Put it in a savings account until all debt is paid"
        ],
        correct_answer: 1,
        explanation: "Rolling the freed payment to the next debt — the core mechanic of both strategies — creates an accelerating payoff effect. Each paid-off debt frees more cash for the next one."
      },
      {
        question: "Research suggests the debt snowball leads to higher debt payoff completion rates than the avalanche. Why?",
        options: [
          "It costs less in total interest",
          "Paying off a complete debt — even a small one — provides a psychological win that maintains motivation over the multi-year process",
          "Banks offer lower interest rates to snowball users",
          "The snowball method requires less monthly payment"
        ],
        correct_answer: 1,
        explanation: "Harvard Business School research found that visible progress and completing milestones (paying off whole debts) significantly improves follow-through. Motivation matters as much as math."
      }
    ]
  },
  {
    id: "lesson-credit-007",
    course_id: "course-credit-003",
    title: "Buy Now Pay Later: Opportunity or Trap?",
    order: 7,
    duration_minutes: 7,
    xp_reward: 65,
    is_sample: false,
    created_date: "2026-03-20T00:00:00.000Z",
    updated_date: "2026-03-20T00:00:00.000Z",
    content: `## Buy Now Pay Later: Opportunity or Trap?

Buy Now Pay Later (BNPL) services — Affirm, Klarna, Afterpay, PayPal Pay Later — have exploded in popularity. They appear at checkout for almost everything: clothing, electronics, furniture, food delivery, even groceries. They're marketed as flexible, interest-free, and convenient.

Sometimes they are. Often they're not. This lesson gives you the framework to tell the difference.

## How BNPL Works

The basic model is simple:
- You make a purchase (say $200)
- Instead of paying now, you pay in installments (e.g., 4 payments of $50 over 6 weeks)
- If you pay on schedule: no interest, no fees
- If you miss a payment: late fees, and some services charge interest

Retailers love BNPL because it increases average order values. The "pain" of spending is reduced — $200 feels like $50 when broken into payments.

That psychological effect is exactly what makes BNPL potentially dangerous for impulsive buyers.

## When BNPL Is a Reasonable Tool

BNPL makes financial sense under specific conditions:

**Condition 1: It's a planned, necessary purchase**
A replacement laptop for school. New tires for your car. A medical device. Something you genuinely needed and would have bought regardless.

**Condition 2: You've budgeted for the full amount**
You could pay for it today if you had to. BNPL is just a cash flow convenience, not a way to afford something you can't.

**Condition 3: You have a concrete repayment plan**
You've mapped the 4 payments to your income and budget. You know exactly how you'll make each payment.

**Condition 4: There's no credit card alternative with rewards**
If you could put it on a rewards card and pay in full at month-end for free cashback — do that instead. BNPL typically doesn't earn rewards.

## When BNPL Becomes a Trap

**Using BNPL for impulse buys**
Fast fashion, trendy gadgets, restaurant orders, home decor — items purchased emotionally that you'd reconsider if you had to pay the full amount today. BNPL removes the financial friction that acts as a check on impulse spending.

**Stacking multiple BNPL plans simultaneously**
It's easy to have 3–5 active BNPL plans running simultaneously without realizing the total monthly commitment. $50 here, $75 there, $40 there — suddenly $165+ in BNPL payments that weren't in your budget.

**Using BNPL to afford things you can't actually afford**
"I can get the $400 shoes because it's only $100/month" — if you couldn't afford $400 shoes outright and wouldn't have bought them otherwise, splitting it into payments doesn't make it affordable.

**Missing payments**
Late fees vary by provider ($7–$25 per missed payment). Some BNPL products (particularly longer-term Affirm plans) charge 10–36% APR on the remaining balance.

## BNPL and Your Credit Score

**Does BNPL affect your credit score?**

It depends on the provider and the product:
- Most short-term BNPL (4 payments/6 weeks) does NOT appear on credit reports if paid on time
- Longer-term BNPL loans (Affirm 6–24 months) often DO report to credit bureaus
- Missed payments on longer-term products CAN hurt your credit score

BNPL doesn't currently help build credit in most cases. But it can hurt it.

## The Accountability Question

Before using BNPL, ask yourself honestly:

1. Would I buy this if I had to pay the full amount right now?
2. Have I budgeted for this?
3. Do I have other active BNPL commitments?
4. Is this a need or a want?

If you can't answer yes to questions 1–2, BNPL is making something you can't afford feel like something you can.

## Key Takeaway

BNPL is a tool, not a right. Used for planned, necessary purchases with a repayment plan in place, it's a reasonable cash flow management tool. Used for impulse buying or to afford things outside your budget, it's accelerated debt accumulation with a slick marketing wrapper.`,
    quiz_questions: [
      {
        question: "You're considering using BNPL to buy $300 sneakers you weren't planning to purchase until you saw an ad. Is this a good use of BNPL?",
        options: [
          "Yes — 4 payments of $75 is much easier than $300 all at once",
          "No — this is an impulse buy. BNPL is removing financial friction that would otherwise prevent an unplanned, non-essential purchase",
          "Yes — if the interest rate is 0%",
          "It depends on your credit score"
        ],
        correct_answer: 1,
        explanation: "BNPL on impulse buys is one of the most common financial traps. The question isn't 'can I afford the installments?' — it's 'would I have bought this if I had to pay $300 today?' If not, BNPL is enabling overspending."
      },
      {
        question: "What is the main risk of running multiple BNPL plans simultaneously?",
        options: [
          "BNPL providers share information and will cancel your plans",
          "Individual installments feel small, but stacked together they create hidden monthly commitments that can derail your budget",
          "Multiple BNPL plans always charge interest",
          "Your credit score is immediately damaged"
        ],
        correct_answer: 1,
        explanation: "Three BNPL plans of $40, $60, and $80/month = $180/month you may not have clearly accounted for. The psychological effect of small individual payments masks the total debt commitment."
      }
    ]
  },
  {
    id: "lesson-credit-008",
    course_id: "course-credit-003",
    title: "Protecting Your Credit: Freezes, Monitoring, and Identity Theft",
    order: 8,
    duration_minutes: 8,
    xp_reward: 75,
    is_sample: false,
    created_date: "2026-03-20T00:00:00.000Z",
    updated_date: "2026-03-20T00:00:00.000Z",
    content: `## Protecting Your Credit

Building a good credit score takes years. Identity theft can damage it in hours. Understanding how to monitor and protect your credit is no longer optional — data breaches have exposed hundreds of millions of Americans' personal information, and the tactics to exploit that data are sophisticated and automated.

## What Is Identity Theft?

Identity theft occurs when someone uses your personal information — Social Security number, date of birth, name, address — to open credit accounts, take out loans, or make purchases in your name.

The victim often doesn't know it happened until:
- A collection call arrives for a debt they didn't incur
- They apply for a mortgage and find unknown accounts on their report
- They receive a credit card statement for a card they never applied for
- Their tax refund is claimed by someone else

## How Thieves Get Your Information

- **Data breaches:** Companies storing your data get hacked (Equifax 2017, Capital One 2019, T-Mobile 2021 — billions of records exposed)
- **Phishing:** Fake emails/texts that steal login credentials
- **Social engineering:** Phone calls impersonating banks or government agencies
- **Mail theft:** Stealing credit card offers, statements, or W-2s
- **Skimming:** Devices attached to ATMs or gas pumps that steal card data

## Tool 1: Free Credit Monitoring

**AnnualCreditReport.com** — Official site to access free reports from all 3 bureaus (Equifax, Experian, TransUnion). You're entitled to one free report per bureau per year, recently expanded to weekly during COVID and maintained.

**Free monitoring services:**
- Credit Karma (Equifax + TransUnion, weekly updates, free)
- Experian free tier (monthly Experian report, free)
- Many credit cards now include free credit score monitoring

What to look for in regular reviews:
- Accounts you didn't open
- Inquiries (hard pulls) you didn't authorize
- Incorrect personal information
- Late payments you know you made on time

## Tool 2: Credit Freeze (Strongest Protection)

A credit freeze (security freeze) prevents anyone — including you — from opening a new credit account in your name. Even if a thief has your SSN and date of birth, they cannot open a new loan or credit card while your file is frozen.

**How to freeze:**
- Contact each bureau separately (Equifax, Experian, TransUnion)
- It's free to freeze and unfreeze
- Done online in minutes; takes effect within 24 hours
- Must freeze all 3 bureaus for full protection

**When to unfreeze:**
Temporarily unfreeze (specify the bureau and time period) when you're applying for credit. Refreeze immediately after.

**Who should have a credit freeze:** Everyone who isn't actively applying for new credit. This includes children — child identity theft is common because it goes undetected for years.

## Tool 3: Fraud Alerts

A fraud alert is a notice placed on your credit file telling lenders to take extra steps to verify your identity before opening new accounts. Easier than a freeze but weaker protection.

**Initial fraud alert:** 1 year. Free. Requires only one bureau to notify (that bureau must notify the other two).

**Extended fraud alert:** 7 years. For verified identity theft victims. Requires a police report.

## What to Do If You're a Victim

1. **Place a credit freeze on all three bureaus immediately**
2. **File a report at IdentityTheft.gov** — the FTC's official identity theft reporting site, which generates a personal recovery plan
3. **File a police report** (required for extended fraud alerts and some disputes)
4. **Contact each company** where fraudulent accounts were opened
5. **Dispute fraudulent items** on your credit reports (in writing, with documentation)
6. **Change all passwords** on financial accounts, enable 2FA everywhere
7. **Monitor closely** for the next 12 months

## Proactive Habits That Reduce Risk

- Use strong, unique passwords for all financial accounts
- Enable two-factor authentication (2FA) on every financial account
- Never give your SSN unless absolutely required (ask why and how it will be stored)
- Shred financial documents, pre-approved credit offers, and pay stubs
- Check your credit report quarterly, not just annually
- Be skeptical of any unsolicited contact asking for personal information

## Key Takeaway

A credit freeze is the single most effective protection against new account fraud — it's free, and it doesn't affect your existing accounts or credit score. Pair it with quarterly credit monitoring to catch any anomalies early. Don't wait until identity theft happens to take protective action.`,
    quiz_questions: [
      {
        question: "What does a credit freeze do?",
        options: [
          "Freezes your existing credit card accounts temporarily",
          "Prevents new credit accounts from being opened in your name by blocking lenders from accessing your credit file",
          "Lowers your credit score while active",
          "Cancels all automatic payments on existing accounts"
        ],
        correct_answer: 1,
        explanation: "A credit freeze blocks new credit inquiries, making it impossible for thieves to open accounts in your name even if they have your SSN. It doesn't affect existing accounts or your credit score."
      },
      {
        question: "You discover an unfamiliar credit card account on your credit report. What should you do first?",
        options: [
          "Ignore it — it's probably a reporting error that will fix itself",
          "Immediately place a credit freeze on all three bureaus and file a report at IdentityTheft.gov",
          "Call the credit card company and ask them to lower the balance",
          "Close all your existing accounts as a precaution"
        ],
        correct_answer: 1,
        explanation: "Unknown accounts are a strong indicator of identity theft. Freeze your credit immediately to prevent additional fraud, then use IdentityTheft.gov to generate a step-by-step recovery plan."
      },
      {
        question: "A credit freeze is free and doesn't hurt your credit score. Why don't more people use one?",
        options: [
          "Freezes are only available to identity theft victims",
          "Most people aren't aware of them or underestimate identity theft risk — but they're among the most powerful financial protections available",
          "Banks charge fees to unfreeze credit reports",
          "Freezes expire automatically after 30 days"
        ],
        correct_answer: 1,
        explanation: "Credit freezes are dramatically underused despite being free and highly effective. Awareness is the primary barrier. There is no cost, no credit score impact, and no downside to having one when you're not actively seeking new credit."
      }
    ]
  },

  // ── INVESTING: 4 new lessons (orders 6-9) ─────────────────────────────────
  {
    id: "lesson-invest-006",
    course_id: "course-investing-004",
    title: "Retirement Accounts: 401(k), IRA, and Roth IRA Deep Dive",
    order: 6,
    duration_minutes: 9,
    xp_reward: 85,
    is_sample: false,
    created_date: "2026-03-20T00:00:00.000Z",
    updated_date: "2026-03-20T00:00:00.000Z",
    content: `## Retirement Accounts: Your Tax-Advantaged Investment Containers

The most powerful investment advantage available to ordinary people isn't a hot stock tip or a secret fund — it's the tax benefits built into retirement accounts. Understanding how to maximize these accounts is worth tens of thousands of dollars over a career.

## Why Account Type Matters as Much as Investment Choice

Two investors both put $500/month into the S&P 500 for 30 years at 8% average return.

**Investor A** uses a taxable brokerage account: pays capital gains taxes each year, ends with ~$650,000 after taxes.

**Investor B** uses a Roth IRA: pays no taxes on growth or withdrawal, ends with ~$745,000.

Same investment. Same return. $95,000 difference — purely from account type.

## 401(k) and 403(b): Workplace Accounts

Available through employers. 401(k) for private sector; 403(b) for non-profits, schools, government.

**2024 contribution limits:**
- Employee: $23,000/year ($30,500 if 50+)
- Total with employer: $69,000/year

**Traditional 401(k):**
- Contributions are pre-tax: lowers your taxable income today
- Growth is tax-deferred: no taxes until withdrawal
- Withdrawals in retirement: taxed as ordinary income
- Required Minimum Distributions (RMDs) starting at age 73

**Roth 401(k):**
- Contributions are post-tax: no current tax break
- Growth and qualified withdrawals: completely tax-free
- Available at many large employers; check if yours offers it

**Employer match:** Free money. Always contribute enough to capture the full match. Common structures:
- 100% match up to 4% of salary = contribute at least 4%
- 50% match up to 6% of salary = contribute at least 6%

**Vesting:** Your contributions are always yours. Employer match may have a vesting schedule — you fully own it after 1–4 years of service.

## Traditional IRA vs. Roth IRA

Both have a $7,000/year contribution limit (2024). The decision between them comes down to current vs. future tax rates.

| | Traditional IRA | Roth IRA |
|---|---|---|
| Contributions | Pre-tax (may be deductible) | Post-tax |
| Tax on growth | Deferred | None |
| Withdrawal tax | Ordinary income tax | Tax-free |
| RMDs | Yes, age 73 | No |
| Income limits | None (deductibility limited) | ~$146K single / $230K married |
| Best if you expect | Lower taxes in retirement | Higher taxes in retirement |

**The Roth math for young investors:**
At age 25 earning $45,000 (12% federal bracket), contributing to a Roth means:
- You pay 12% tax on $7,000 = $840 in taxes today
- After 40 years of compounding at 8%: $7,000 becomes ~$152,000
- All $152,000 is tax-free at withdrawal

If that $152,000 came from a Traditional IRA and you're in a 22% bracket at retirement:
- Tax bill at withdrawal: $33,440
- Net received: $118,560

The Roth wins by $33,440 — just on one year's contribution.

## The Backdoor Roth IRA

High earners above the Roth income limits ($146K single in 2024) can still access Roth benefits via the "backdoor Roth":

1. Contribute to a Traditional IRA (non-deductible — no income limit for this)
2. Convert it to a Roth IRA (pay tax on any gains)
3. Done — you now have Roth money despite being over the income limit

Requires awareness of the "pro-rata rule" if you have other Traditional IRA money — consult a tax advisor for specifics.

## HSA as a Bonus Retirement Account

An HSA (Health Savings Account), available with high-deductible health plans, offers the only triple-tax advantage in the tax code:
1. Pre-tax contributions
2. Tax-free growth
3. Tax-free qualified withdrawals (medical expenses)
4. After 65: can withdraw for anything (pay income tax, like Traditional IRA)

**Strategy:** Max HSA contributions. Pay current medical costs out-of-pocket. Let HSA compound for decades. Withdraw tax-free in retirement for healthcare costs — which are the largest retirement expense for most people.

## Key Takeaway

Retirement accounts are the highest-ROI financial decision available to working people. Priority order: 401(k) match → Roth IRA → HSA → more 401(k) → taxable. The tax-free compounding in a Roth IRA, started young, is worth tens of thousands more than equivalent taxable investing.`,
    quiz_questions: [
      {
        question: "Why is a Roth IRA particularly powerful for a 25-year-old in a low tax bracket?",
        options: [
          "Roth contributions are tax-deductible, reducing current taxes",
          "You pay tax now at a low rate, then let money compound for 40 years tax-free — paying taxes on the seed, not the harvest",
          "Roth IRAs have higher contribution limits than 401(k)s",
          "Roth IRA withdrawals are not subject to Medicare tax"
        ],
        correct_answer: 1,
        explanation: "Young people in low tax brackets pay modest taxes on Roth contributions today. After 40 years of compounding, the tax-free withdrawal advantage is worth tens of thousands compared to a taxable account."
      },
      {
        question: "Your employer offers a 50% match on 401(k) contributions up to 6% of your $55,000 salary. What is the minimum you should contribute to capture the full match?",
        options: ["3% ($1,650/year)", "6% ($3,300/year) — the minimum to get the full employer match", "12% ($6,600/year)", "The maximum $23,000/year"],
        correct_answer: 1,
        explanation: "To get the full 50% match on 6% contributions, you must contribute 6%. That's $3,300/year from you, plus $1,650 from your employer — a 50% instant return on those dollars."
      },
      {
        question: "What is the key difference between RMDs on a Traditional IRA vs. a Roth IRA?",
        options: [
          "Both require identical Required Minimum Distributions starting at age 73",
          "Traditional IRAs require minimum distributions at 73; Roth IRAs have no RMDs, allowing continued tax-free growth throughout your lifetime",
          "Roth IRAs require larger RMDs due to tax-free status",
          "Neither account type has RMDs"
        ],
        correct_answer: 1,
        explanation: "Roth IRAs have no Required Minimum Distributions — you can let the account compound indefinitely. Traditional IRAs force withdrawals starting at 73, triggering income tax and potentially pushing you into a higher bracket."
      }
    ]
  },
  {
    id: "lesson-invest-007",
    course_id: "course-investing-004",
    title: "Index Fund Investing: The Simple Winning Strategy",
    order: 7,
    duration_minutes: 8,
    xp_reward: 80,
    is_sample: false,
    created_date: "2026-03-20T00:00:00.000Z",
    updated_date: "2026-03-20T00:00:00.000Z",
    content: `## Index Fund Investing: The Evidence-Backed Strategy

Index investing is the practice of buying funds that track a market index — passively owning a slice of the entire market rather than trying to pick winning individual stocks. It sounds unsophisticated, but decades of evidence show it outperforms the vast majority of professional investors over 15–20 year periods.

## What Is a Market Index?

A market index is a list of securities used to represent a segment of the market.

**S&P 500:** 500 of the largest publicly traded U.S. companies by market capitalization. Includes Apple, Microsoft, Amazon, Nvidia, Alphabet, Meta, and 494 others. Represents ~80% of U.S. market value.

**Total U.S. Market (Wilshire 5000):** ~4,000 U.S. companies — includes everything in the S&P 500 plus mid-cap and small-cap companies.

**Total World Index (MSCI ACWI):** ~9,000 companies across 47 countries — the broadest possible exposure to global stocks.

**Bloomberg U.S. Aggregate Bond Index:** Thousands of U.S. investment-grade bonds.

An **index fund** buys every security in its target index in proportion to its weight. When you buy a Total Market fund, you own a proportional slice of every major company in America.

## Why Passive Beats Active: The Evidence

The SPIVA Scorecard (S&P Dow Jones Indices) measures active fund performance against index benchmarks. Consistent findings:

- Over 15 years, **85–92% of active large-cap funds** underperform the S&P 500
- Over 20 years, the percentage climbs above 90%
- Even funds that outperform one decade rarely sustain it the next

**Why professional managers can't consistently beat the market:**

1. **The market is the collective judgment of millions of professionals.** Any information you can trade on is already priced in.
2. **Fees are a guaranteed headwind.** A 1% management fee must be overcome before matching the index.
3. **Tax drag.** Active funds trade frequently, generating taxable events.
4. **Manager turnover.** Outperforming managers leave, retire, or change their approach.

## Vanguard and the Low-Cost Revolution

Jack Bogle founded Vanguard in 1975 and launched the first retail index fund. His insight: if you can't beat the market consistently, stop trying to. Own the market.

Vanguard operates as a mutual company owned by its fund investors — eliminating conflicts of interest and enabling them to offer some of the lowest expense ratios in the industry.

**Legendary low-cost Vanguard funds:**
- VOO (S&P 500 ETF): 0.03% expense ratio
- VTI (Total U.S. Market ETF): 0.03% expense ratio
- VXUS (Total International ETF): 0.07% expense ratio
- BND (Total Bond Market ETF): 0.03% expense ratio

0.03% means on $10,000 invested, you pay $3/year in fees. An active fund at 1.0% costs $100/year on the same $10,000. The difference compounds dramatically.

## Building a Complete Portfolio with 2–3 Funds

**The Two-Fund Portfolio:**
- 80% VTI (U.S. stocks)
- 20% VXUS (International stocks)

**The Three-Fund Portfolio:**
- 60% VTI
- 30% VXUS
- 10% BND (adjust bond allocation by age/risk tolerance)

These two or three funds provide exposure to virtually every public company in the world at near-zero cost. Academically, this is as diversified as it gets.

## Rebalancing: The One Maintenance Task

Over time, asset allocations drift as markets move. Annual rebalancing restores your target allocation.

**Example:** You target 80% VTI / 20% VXUS. After a great year for U.S. stocks, you're now 88% VTI / 12% VXUS.

Rebalancing: sell some VTI, buy VXUS to restore 80/20.

**Why rebalance?**
- Maintains your intended risk level
- Forces you to systematically buy low and sell high
- Simple process — most brokerages offer automatic rebalancing

## Key Takeaway

Index investing is not a compromise strategy — it's the evidence-backed optimal strategy for most long-term investors. Low cost, broadly diversified, tax-efficient, and consistently outperforming active management over long periods. Two or three index ETFs in a Roth IRA, purchased automatically every month, is a complete investment strategy.`,
    quiz_questions: [
      {
        question: "Over 15–20 years, what percentage of actively managed large-cap funds underperform a simple S&P 500 index fund?",
        options: ["About 25%", "About 50%", "85–92%", "Fewer than 10%"],
        correct_answer: 2,
        explanation: "SPIVA data consistently shows 85–92% of active large-cap funds underperform over 15 years, after fees. The longer the period, the more index funds win."
      },
      {
        question: "Why does a 1% annual expense ratio matter so much over 30 years?",
        options: [
          "1% is withdrawn from your account daily",
          "Compound math turns 1%/year into a massive wealth difference — on $50,000 over 30 years, 1% costs ~$100,000 in foregone returns",
          "1% fees are charged on capital gains taxes",
          "Expense ratios only matter on funds under $1,000"
        ],
        correct_answer: 1,
        explanation: "At 8% gross return, a 0.03% fund grows $50,000 to ~$487,000 in 30 years. A 1% fund grows to ~$380,000. The 0.97% fee difference costs $107,000. Fees compound against you exactly like returns compound for you."
      },
      {
        question: "What is the purpose of annual portfolio rebalancing?",
        options: [
          "To switch to better-performing funds each year",
          "To restore your target asset allocation after markets have shifted it, maintaining your intended risk level",
          "To minimize the number of funds you hold",
          "To time the market by adjusting based on economic forecasts"
        ],
        correct_answer: 1,
        explanation: "Markets move assets away from target allocations over time. Annual rebalancing restores them — and systematically forces you to buy assets that have lagged (buy low) and trim those that have surged (sell high)."
      }
    ]
  },
  {
    id: "lesson-invest-008",
    course_id: "course-investing-004",
    title: "Dollar-Cost Averaging and Long-Term Discipline",
    order: 8,
    duration_minutes: 7,
    xp_reward: 70,
    is_sample: false,
    created_date: "2026-03-20T00:00:00.000Z",
    updated_date: "2026-03-20T00:00:00.000Z",
    content: `## Dollar-Cost Averaging and Staying the Course

Dollar-cost averaging (DCA) and the discipline to stay invested through volatility are the two behavioral advantages that separate successful long-term investors from those who underperform their own portfolios.

## What Is Dollar-Cost Averaging?

Dollar-cost averaging means investing a fixed dollar amount at regular intervals — regardless of what the market is doing.

**Example:** $300 invested on the first of every month in VTI.

| Month | Price/Share | Shares Bought |
|---|---|---|
| Jan | $220 | 1.36 |
| Feb | $200 | 1.50 |
| Mar | $180 (crash) | 1.67 |
| Apr | $175 (still low) | 1.71 |
| May | $195 | 1.54 |
| Jun | $215 | 1.40 |
| **Total** | | **9.18 shares for $1,800** |

Average price paid per share: $1,800 ÷ 9.18 = **$196.08**

If you had invested the full $1,800 in January at $220/share, you'd own only 8.18 shares.

DCA naturally buys more shares when prices are low and fewer when prices are high — without requiring you to know when the market will go up or down.

## Why DCA Outperforms Most Investors Behaviorally

The technical advantage of DCA is modest. The behavioral advantage is enormous.

**The biggest enemy of investment returns is the investor's own emotions.** Studies consistently show that average mutual fund investors earn 1.5–3% less per year than the funds they invest in — because they buy after markets rise (excitement) and sell after markets fall (panic).

DCA removes the decision of *when* to invest. You automate it. January 1st, $300 goes in. March crash hits, $300 still goes in. Media headlines "worst crash in decades" — $300 goes in. This mechanical consistency prevents emotional mistakes.

## The Cost of Market Timing (Real Data)

**Study: $10,000 invested in S&P 500, 1999–2019:**

| Scenario | Annual Return |
|---|---|
| Stayed fully invested | 6.06% |
| Missed 10 best days | 2.44% |
| Missed 20 best days | 0.08% |
| Missed 30 best days | -1.95% |
| Missed 40 best days | -3.83% |

The best market days — the days that most boost long-term returns — are unpredictable and often follow the worst days. Investors who exit during crashes and wait to re-enter often miss the recovery's sharpest gains.

## What Market Crashes Actually Look Like

Since 1928, the S&P 500 has experienced:
- Declines of 10%+ approximately every 1–2 years
- Declines of 20%+ approximately every 4–5 years
- Declines of 30%+ approximately every 8–10 years

Every single one of those crashes eventually recovered and went on to new highs.

**What that means practically:**
If you invest for 30 years, you will experience 5–10 meaningful crashes. You will want to sell during each one. The investors who didn't sell are the ones who built wealth. The investors who did sell locked in permanent losses.

## Automate to Remove Emotion

The practical implementation:

1. Set up automatic monthly transfers from checking to your Roth IRA or brokerage account
2. Within those accounts, set up automatic investment into your target funds
3. Enable dividend reinvestment (DRIP) — dividends buy more shares automatically
4. Review once per year — not once per day

"Set it and forget it" is not lazy. It's the discipline-maximizing, emotion-minimizing, evidence-backed optimal behavior for long-term investors.

## Key Takeaway

DCA is investment discipline made automatic. It ensures consistent investing regardless of market conditions and prevents the emotional mistakes that cost the average investor 1.5–3%/year in returns. Set up automatic monthly contributions and let time do the work.`,
    quiz_questions: [
      {
        question: "An investor consistently puts $400/month into an index fund over 20 years. During a major market crash, they keep investing. Why is this the correct behavior?",
        options: [
          "Crashes are temporary; DCA means you buy more shares at lower prices, lowering your average cost",
          "The government protects investments from going below zero during crashes",
          "Index funds don't decline during market crashes",
          "Monthly contributions trigger automatic portfolio insurance"
        ],
        correct_answer: 0,
        explanation: "During crashes, your fixed $400 buys more shares at lower prices. When the market recovers (historically it always has), those extra shares generate outsized returns. This is DCA working exactly as intended."
      },
      {
        question: "Research shows the average mutual fund investor earns 1.5–3% less per year than their funds earn. What causes this gap?",
        options: [
          "Fund companies take extra fees from individual investors",
          "Emotional behavior — buying after markets rise (excitement) and selling after markets fall (panic), missing the best recovery days",
          "Individual investors are charged higher expense ratios",
          "Average investors choose worse funds than institutional investors"
        ],
        correct_answer: 1,
        explanation: "This 'behavior gap' is entirely self-inflicted. Emotional reactions to market movements cause most individual investors to buy high and sell low — systematically underperforming the funds they own."
      }
    ]
  },
  {
    id: "lesson-invest-009",
    course_id: "course-investing-004",
    title: "Cryptocurrency: What It Is and How to Approach It",
    order: 9,
    duration_minutes: 8,
    xp_reward: 75,
    is_sample: false,
    created_date: "2026-03-20T00:00:00.000Z",
    updated_date: "2026-03-20T00:00:00.000Z",
    content: `## Cryptocurrency: A Rational Framework

Cryptocurrency is one of the most polarizing topics in personal finance. Advocates believe it will transform money and finance forever. Critics call it speculation with no intrinsic value. The truth is somewhere between — and understanding where it fits (or doesn't) in a financial plan requires cutting through the hype in both directions.

## What Is Cryptocurrency?

Cryptocurrency is a digital asset that uses cryptography and blockchain technology to record transactions and control the creation of new units, without a central authority (like a government or bank) controlling it.

**Bitcoin (BTC):** The original. Created 2009. Fixed supply of 21 million coins. Often called "digital gold" — a store of value and hedge against currency debasement.

**Ethereum (ETH):** A programmable blockchain that enables smart contracts — self-executing code that powers decentralized applications (DeFi, NFTs, DAOs). Second largest by market cap.

**Altcoins:** Thousands of other cryptocurrencies with varying use cases, quality, and risk profiles. Most fail. A small number succeed.

**Stablecoins:** Tokens pegged to a stable asset (usually the U.S. dollar). USDC and USDT are the largest. Used in DeFi and for transferring dollar-equivalent value.

## Why Crypto Is High Risk

**1. Extreme volatility**
Bitcoin has dropped 75–85% from peak to trough multiple times (2018: -84%, 2022: -77%). Ethereum and smaller coins have dropped even more.

An investment that drops 80% requires a 400% gain just to break even.

**2. Regulatory uncertainty**
Governments worldwide are still determining how to regulate crypto — as property, currency, security, or commodity. Regulatory changes can move prices 20–40% in days.

**3. Technical risk**
Lost private keys = lost funds. No recovery. No customer service. No FDIC insurance. Exchange hacks (Mt. Gox, FTX) have wiped out billions in customer funds with little or no recovery.

**4. Speculative pricing**
Unlike stocks (valued on company earnings) or bonds (valued on interest payments), most cryptocurrencies don't generate cash flows. Prices are driven primarily by supply/demand dynamics and sentiment.

## The Balanced View

**Arguments for crypto exposure:**
- Bitcoin's fixed supply means it can't be inflated away
- Institutional adoption (ETFs, corporate treasuries) adds legitimacy
- Global settlement without intermediaries has real utility
- Small allocations offer asymmetric upside

**Arguments for caution:**
- Most retail investors buy near peaks and sell near bottoms
- The majority of altcoins go to zero
- FOMO-driven investing consistently destroys wealth
- Correlation with risk assets increases in market crashes — when you need diversification most

## The Responsible Allocation Framework

If you choose to hold cryptocurrency:

**The 1–5% Rule:** Most financial advisors suggest no more than 1–5% of an investment portfolio in crypto. Large enough to be meaningful if it succeeds; small enough that a total loss doesn't derail your financial plan.

**Crypto does NOT replace:**
- Emergency fund (too volatile for near-term needs)
- Retirement savings (too speculative for core retirement)
- High-interest debt payoff (no investment return offsets 22% APR)

**Positioning:** If you invest, stick to Bitcoin and/or Ethereum — the two highest liquidity, most established assets. Speculative altcoin investing is closer to gambling than investing.

**Buy and hold:** Don't trade actively. You will buy high and sell low. Buy a fixed amount monthly (DCA), hold long-term, and don't check daily prices.

## Common Crypto Mistakes to Avoid

- Going all-in because of FOMO during a bull market
- Selling during a crash because of fear
- Keeping large amounts on exchanges (use a hardware wallet for significant holdings)
- Investing money you need in the next 1–5 years
- Chasing new coins based on social media hype
- Ignoring tax implications (crypto is taxable property in the U.S.)

## Key Takeaway

Cryptocurrency can be a small, speculative component of a diversified portfolio for someone who has already covered the foundations (emergency fund, retirement contributions, no high-interest debt). It is not a foundation strategy. Bitcoin and Ethereum are the only reasonable choices for most investors. Keep position size small enough that a total loss is not life-altering.`,
    quiz_questions: [
      {
        question: "According to most financial advisors, what is the maximum recommended portfolio allocation to cryptocurrency?",
        options: ["0% — crypto should be avoided entirely", "1–5% maximum", "20–25%", "Whatever feels right based on your conviction"],
        correct_answer: 1,
        explanation: "The 1–5% framework ensures crypto exposure is large enough to be meaningful if it succeeds, while small enough that a total loss (which is possible) doesn't materially damage your financial plan."
      },
      {
        question: "Why is Bitcoin sometimes called 'digital gold'?",
        options: [
          "It is backed by physical gold reserves",
          "Its fixed supply of 21 million coins makes it resistant to inflation, similar to gold's scarcity as a store of value",
          "It has been approved as a commodity by the CFTC",
          "It generates the same returns as gold historically"
        ],
        correct_answer: 1,
        explanation: "Bitcoin's hard-coded supply cap of 21 million coins means no central authority can inflate it away. This fixed scarcity property is compared to gold's limited natural supply as a potential store of value."
      },
      {
        question: "Before allocating any money to cryptocurrency, which financial foundations should be in place first?",
        options: [
          "A crypto allocation should come first for maximum compounding time",
          "Emergency fund, no high-interest debt, and retirement contributions — crypto is only appropriate after these foundations are solid",
          "Crypto can replace traditional savings at any income level",
          "Only people earning over $100,000 should have the other foundations first"
        ],
        correct_answer: 1,
        explanation: "Cryptocurrency is highly speculative. Allocating to it before having emergency savings, retirement contributions, and eliminating high-interest debt means taking on extra risk while unprotected — the opposite of sound financial planning."
      }
    ]
  },

  // ── SAVING: 4 new lessons (orders 5-8) ────────────────────────────────────
  {
    id: "lesson-saving-005",
    course_id: "course-saving-005",
    title: "Automating Your Savings: Set It and Build It",
    order: 5,
    duration_minutes: 7,
    xp_reward: 70,
    is_sample: false,
    created_date: "2026-03-20T00:00:00.000Z",
    updated_date: "2026-03-20T00:00:00.000Z",
    content: `## Automating Your Savings

The number one reason people don't save enough isn't that they don't want to — it's that saving requires repeated acts of willpower in competition with constant competing demands on their money. Automation eliminates the willpower requirement entirely.

## Why Automation Works

Every month that savings is manual, you make a decision: save this month or not? With 12 chances to skip per year, most people skip at least a few times. Automation converts a repeated decision into a one-time setup — you decide once, and it happens every month forever.

**The "pay yourself first" principle:**
Set up your savings transfer to happen automatically on payday — before you have a chance to spend the money. Out of sight, out of mind. You budget from what's left.

Research by behavioral economists including Shlomo Benartzi (co-designer of the Save More Tomorrow retirement program) shows that people who automate savings save 2–3x more over their lifetime than those who save manually.

## Setting Up Automatic Transfers

**For high-yield savings:**
1. Log into your bank's website or app
2. Go to Transfers → Schedule Recurring Transfer
3. Set amount (e.g., $200)
4. Set frequency (Monthly — same day as payday)
5. Set source (Checking) and destination (HYSA)
6. Done. It runs automatically.

**For retirement:**
Most 401(k) plans automatically deduct your contribution from each paycheck before it even deposits. If yours doesn't — or you want to increase it — contact HR.

For a Roth IRA (at Fidelity, Vanguard, Schwab): Set up a recurring investment after your scheduled monthly transfer.

## The Automation Stack

A complete automated savings system looks like this:

**On payday:**
1. Paycheck deposits to checking
2. Auto-transfer $X to HYSA (emergency fund or savings goals)
3. Auto-transfer $Y to Roth IRA or brokerage (investing)
4. Remaining money: bills autopay + discretionary spending

You never manually move money. You budget from what's left after automation.

## How Much to Automate

Start with what feels sustainable. Even $25/week is better than $0.

**Suggested starting targets by situation:**

| Situation | Minimum Savings Rate |
|---|---|
| Building emergency fund | 5–10% of income |
| Post-emergency fund | 15–20% of income |
| Aggressive wealth building | 20–30%+ of income |

The 1% increase approach: If 15% feels impossible, start at 5%. Set a calendar reminder to increase by 1% every 3 months. You'll reach 15% within 3 years without feeling the change.

## Savings Buckets: Multiple Goals in One System

You don't need just one savings account. Set up named savings buckets (many online banks like Ally support this) for each goal:

- Emergency Fund: $5,000 target
- Car Maintenance: $100/month
- Vacation: $150/month
- Down Payment: $300/month
- Holiday Gifts: $60/month

Each bucket has its own auto-transfer. You see exactly where each dollar is going and how close you are to each goal. This visual progress is a powerful motivator.

## Windfalls: The Lump-Sum Rule

When you receive unexpected money — tax refund, bonus, birthday money, side hustle payment — apply the 80/20 rule:

- 80% goes immediately to the highest-priority savings/debt goal
- 20% is yours to spend guilt-free

This prevents windfalls from disappearing into lifestyle spending while still rewarding yourself for the income.

## Key Takeaway

Set up automatic transfers on payday — before the money can be spent. Name your savings buckets for specific goals. Start with whatever amount you can, and increase 1% every few months. Automation converts good financial intentions into permanent, consistent action.`,
    quiz_questions: [
      {
        question: "Why does automating savings produce significantly better outcomes than manual monthly saving?",
        options: [
          "Automated transfers earn higher interest rates",
          "It removes the repeated willpower requirement — you decide once and savings happens every month without further decisions or risk of skipping",
          "Banks offer bonuses for automated transfers",
          "Manual saving creates tax complications"
        ],
        correct_answer: 1,
        explanation: "Every manual savings decision is a chance to postpone. Automation turns 12 potential skips per year into 0. Behavioral research shows automated savers save 2–3x more over their lifetime than manual savers."
      },
      {
        question: "You receive a $1,200 tax refund. Applying the 80/20 windfall rule, how should you allocate it?",
        options: [
          "Spend it entirely — it's found money",
          "$960 (80%) to savings/debt + $240 (20%) to spend freely — capturing financial progress while enjoying a reward",
          "Split it 50/50 between spending and saving",
          "Put it all in savings without exception"
        ],
        correct_answer: 1,
        explanation: "The 80/20 rule maximizes the financial impact of windfalls while avoiding the guilt of putting 100% to savings. Most of the benefit is captured while leaving room to enjoy the unexpected income."
      }
    ]
  },
  {
    id: "lesson-saving-006",
    course_id: "course-saving-005",
    title: "The HSA: The Most Powerful Savings Account You Might Not Be Using",
    order: 6,
    duration_minutes: 8,
    xp_reward: 75,
    is_sample: false,
    created_date: "2026-03-20T00:00:00.000Z",
    updated_date: "2026-03-20T00:00:00.000Z",
    content: `## The Health Savings Account (HSA): Triple Tax Advantage

The HSA is the only account in the U.S. tax code that avoids taxes three times. Most Americans who are eligible for one don't maximize it — or don't fully understand it. This is a significant missed opportunity.

## What Is an HSA?

An HSA (Health Savings Account) is a tax-advantaged account available to people enrolled in a **High-Deductible Health Plan (HDHP)**. You contribute money, it grows tax-free, and you can withdraw it tax-free for qualified medical expenses.

**2024 contribution limits:**
- Individual: $4,150/year
- Family: $8,300/year
- Age 55+: Additional $1,000/year catch-up contribution

**HDHP requirement (2024):**
- Minimum deductible: $1,600/individual, $3,200/family
- Maximum out-of-pocket: $8,050/individual, $16,100/family

## The Triple Tax Advantage

No other account in the U.S. tax code avoids all three:

**1. Pre-tax contributions (like a Traditional 401k)**
HSA contributions reduce your taxable income. If you contribute $4,150 at a 22% federal tax bracket, you save $913 in federal taxes. Plus state tax savings if your state taxes income.

**2. Tax-free growth (like a Roth IRA)**
Interest, dividends, and capital gains inside an HSA accumulate completely tax-free. No annual taxes on investment returns.

**3. Tax-free withdrawals for qualified medical expenses (unique to HSA)**
When you spend HSA funds on qualified medical expenses — doctor visits, prescriptions, dental, vision, surgery, mental health, and hundreds of other expenses — no taxes are owed, ever.

This combination exists in no other account type. A 401(k) is pre-tax but taxed on withdrawal. A Roth IRA is post-tax but tax-free on withdrawal. The HSA is pre-tax AND tax-free on withdrawal for its primary purpose.

## The "Stealth Retirement Account" Strategy

Here's the strategy used by financially sophisticated HSA holders:

**Pay today's medical expenses out-of-pocket** (from your checking account) rather than from your HSA.

**Let the HSA compound for decades.**

**Save every medical receipt.** There is no time limit on reimbursement. A $300 doctor visit receipt from 2025 can be reimbursed from your HSA in 2045 — tax-free.

**At age 65:** HSA funds can be withdrawn for any purpose (not just medical). You simply pay ordinary income tax on non-medical withdrawals — exactly like a Traditional IRA. Medical withdrawals remain completely tax-free.

**Why this works:** $4,150 invested today at 8%/year for 30 years becomes $41,800 — all tax-free if withdrawn for qualified medical expenses.

## What Qualifies as an HSA Expense

The IRS publishes Publication 502 with the full list. Common qualifying expenses:

- Doctors, specialists, emergency care
- Prescriptions (including over-the-counter with a prescription)
- Dental care (cleanings, fillings, braces, implants)
- Vision (exams, glasses, contacts, LASIK)
- Mental health therapy and psychiatry
- Chiropractic care
- Physical therapy
- Hearing aids
- Medical equipment (crutches, blood pressure monitors, CPAP)
- Long-term care insurance premiums

**Does not qualify:** gym memberships, cosmetic procedures, vitamins (without prescription), health club dues.

## Investing Your HSA

Many people leave HSA funds in cash (earning minimal interest). For the triple-tax advantage to be maximized, invest your HSA in low-cost index funds.

Most HSA administrators (Fidelity HSA, Lively, HealthEquity) allow you to invest your HSA balance above a small cash reserve ($500–$1,000) in mutual funds or ETFs.

Fidelity's HSA offers zero-fee investing with no minimum threshold — the best HSA for most investors.

## Is an HDHP Right for You?

The HSA is only available with an HDHP. Whether an HDHP makes sense depends on:

- Your expected annual healthcare usage
- The premium difference vs. a traditional plan
- Your ability to cover the higher deductible

Calculate: (Traditional plan annual premium) - (HDHP annual premium) = Annual savings in premiums.
Then compare: Does the annual premium savings outweigh the higher deductible exposure?

For healthy people with low expected medical costs, HDHPs often make financial sense — especially when the premium savings are invested in the HSA.

## Key Takeaway

The HSA is the single most tax-efficient savings vehicle available to eligible Americans. If you're enrolled in an HDHP: contribute the maximum, invest it in index funds, pay current medical costs out-of-pocket when possible, and let the account compound for decades.`,
    quiz_questions: [
      {
        question: "What makes the HSA the 'triple tax advantage' account?",
        options: [
          "It earns three times the interest of a regular savings account",
          "Contributions are pre-tax, growth is tax-free, and qualified medical withdrawals are tax-free — avoiding taxes at every stage",
          "You receive three tax deductions per year of contributions",
          "It combines 401(k), IRA, and savings account features"
        ],
        correct_answer: 1,
        explanation: "Pre-tax contributions reduce current income tax. Tax-free growth eliminates annual investment taxes. Tax-free medical withdrawals mean you never pay tax on that money if used for healthcare. No other account type offers all three."
      },
      {
        question: "The 'stealth retirement account' HSA strategy involves:",
        options: [
          "Withdrawing HSA funds immediately for all medical expenses",
          "Paying current medical costs out-of-pocket while letting the HSA grow invested for decades, then reimbursing yourself later tax-free",
          "Contributing to an HSA without being enrolled in an HDHP",
          "Converting an HSA to a Roth IRA at retirement"
        ],
        correct_answer: 1,
        explanation: "There's no time limit on HSA reimbursement. Save receipts, pay medical costs from checking now, let the HSA compound invested for years, then reimburse yourself decades later — tax-free."
      },
      {
        question: "At age 65, can you use HSA funds for non-medical expenses?",
        options: [
          "No — HSA funds can only ever be used for medical expenses",
          "Yes — after 65, non-medical withdrawals are allowed and taxed as ordinary income (like a Traditional IRA); medical withdrawals remain tax-free",
          "Yes — all withdrawals after 65 are completely tax-free for any purpose",
          "No — unused HSA funds must be donated to charity at 65"
        ],
        correct_answer: 1,
        explanation: "After 65, HSAs behave like a Traditional IRA for non-medical withdrawals — you pay ordinary income tax but no penalty. Medical withdrawals remain 100% tax-free, making HSAs uniquely powerful for healthcare-heavy retirement years."
      }
    ]
  },
  {
    id: "lesson-saving-007",
    course_id: "course-saving-005",
    title: "Setting Savings Goals: Short, Medium, and Long-Term",
    order: 7,
    duration_minutes: 8,
    xp_reward: 75,
    is_sample: false,
    created_date: "2026-03-20T00:00:00.000Z",
    updated_date: "2026-03-20T00:00:00.000Z",
    content: `## Setting Savings Goals Across Three Time Horizons

Random saving — putting money away without a specific destination — produces less progress than goal-based saving. When every savings account has a name and a target, you know exactly what you're building and why. This clarity is motivating and prevents dipping into savings for the wrong reasons.

## The Three Time Horizons

**Short-term goals (0–2 years)**
Money you'll need relatively soon. Must be in safe, liquid accounts — not the stock market.

**Medium-term goals (2–7 years)**
Money you'll need in a few years. Can take moderate investment risk.

**Long-term goals (7+ years)**
Money that has time to weather market volatility. Should be invested for growth.

## Short-Term Goals: Building the Foundation

**Emergency Fund (Priority 1)**
- Target: 3–6 months of essential expenses
- Account: High-yield savings account
- Why it's first: Everything else requires this foundation to be safe

**Next Major Purchase**
- Car, furniture, appliance, technology
- Target: Full purchase price or meaningful down payment
- Account: HYSA or short-term CD
- Timeline: 6–18 months

**Annual Irregular Expenses (Sinking Funds)**
- Car maintenance: $100/month
- Holiday gifts: $50/month
- Annual subscriptions: $25/month
- Vacation: $150/month
- Each tracked separately in named savings accounts

## Medium-Term Goals: Building Toward Milestones

**Home Down Payment**
A traditional 20% down payment on a $300,000 home = $60,000. Many first-time buyer programs require only 3–10%.

At $500/month savings rate: 10% down payment ($30,000) reachable in 5 years.

**Account:** HYSA for 0–3 year horizon. For 3–7 year horizon, a low-risk investment account (mostly bonds/some stocks) may be appropriate.

**Starting a Business**
Business startup costs vary enormously — from $500 for a freelance side hustle to $50,000+ for a physical location. Building a dedicated business fund over 2–5 years is far safer than using personal debt.

**Education / Career Development**
Certifications, graduate school, continuing education. Calculate exact costs and build dedicated savings.

## Long-Term Goals: Wealth Building Over Decades

**Retirement**
The anchor long-term goal. Use tax-advantaged accounts (401(k), Roth IRA, HSA) as the investment vehicle. Target saving 15–20% of gross income.

**A common retirement savings benchmark:**
- By 30: 1x annual salary saved
- By 40: 3x annual salary saved
- By 50: 6x annual salary saved
- By 60: 8x annual salary saved
- By retirement (67): 10–12x annual salary saved

**Financial Independence**
Some people target full financial independence — accumulating 25x annual expenses in invested assets (the "4% rule" — a portfolio of 25x expenses can sustain a 4% annual withdrawal indefinitely, in theory).

At $40,000/year expenses: financial independence = $1,000,000 invested.
At $60,000/year expenses: $1,500,000.

## Making Goals Concrete: The Savings Worksheet

For each goal, write down:
1. **What:** Specific goal name
2. **How much:** Total target amount
3. **When:** Target date
4. **Monthly contribution needed:** Total ÷ months until deadline
5. **Account:** Where to keep this money

**Example:**
| Goal | Target | Date | Monthly | Account |
|---|---|---|---|---|
| Emergency Fund | $8,000 | 18 months | $444 | HYSA |
| Car (used) | $5,000 | 24 months | $208 | HYSA |
| Down Payment | $30,000 | 60 months | $500 | HYSA |
| Retirement | (ongoing) | Age 65 | $500 | Roth IRA |

## Key Takeaway

Name every savings goal. Assign a target amount, a date, and an account. Calculate the required monthly contribution. Automate it. Visible, concrete goals with dedicated accounts dramatically outperform vague "saving more" intentions — both in motivation and in actual results.`,
    quiz_questions: [
      {
        question: "You're saving for a home down payment 4 years from now. Where should this money be kept?",
        options: [
          "100% in stocks for maximum growth over 4 years",
          "A high-yield savings account — it's too close to need to risk a significant stock market decline",
          "A savings account at a big bank for stability",
          "In cryptocurrency for high potential returns"
        ],
        correct_answer: 1,
        explanation: "4 years is too short for stock market risk. Markets can decline 30–50% and take several years to recover. A down payment fund needs to be there when you need it. HYSA earns meaningful interest without market risk."
      },
      {
        question: "According to common retirement benchmarks, how much should a 40-year-old have saved for retirement?",
        options: [
          "At least $10,000",
          "About 1x annual salary",
          "About 3x annual salary",
          "At least $500,000 regardless of salary"
        ],
        correct_answer: 2,
        explanation: "Common benchmarks (Fidelity): 1x salary by 30, 3x by 40, 6x by 50, 8x by 60, 10–12x by retirement. These are guidelines, not guarantees — earlier starts make them easier to hit."
      },
      {
        question: "What is a 'sinking fund' and which type of goal is it best suited for?",
        options: [
          "A high-risk investment fund; best for long-term goals",
          "A dedicated savings account for a specific planned future expense; best for short-term irregular costs like car maintenance or holiday gifts",
          "An emergency fund backup; only used after the primary emergency fund is depleted",
          "A government savings bond for retirement"
        ],
        correct_answer: 1,
        explanation: "Sinking funds accumulate monthly contributions toward a known future expense. They turn large irregular costs (car registration, holiday gifts, vacations) into predictable monthly savings — eliminating budget surprises."
      }
    ]
  },
  {
    id: "lesson-saving-008",
    course_id: "course-saving-005",
    title: "Building a Wealth Mindset: Habits of Financially Secure People",
    order: 8,
    duration_minutes: 8,
    xp_reward: 80,
    is_sample: false,
    created_date: "2026-03-20T00:00:00.000Z",
    updated_date: "2026-03-20T00:00:00.000Z",
    content: `## Building a Wealth Mindset

Financial security isn't primarily about income. People earning $200,000/year go broke. People earning $40,000/year retire comfortably. The difference is almost always behavioral — habits, decisions, and beliefs about money made consistently over years.

## The Wealth Gap Is Behavioral, Not Just Mathematical

A landmark study by Thomas Stanley (The Millionaire Next Door) found that most American millionaires:
- Live well below their means
- Drive used cars
- Have never purchased a car for more than $35,000
- Spend significantly less on clothing, food, and housing than their income would allow
- Became wealthy through consistent saving and investing over decades — not windfalls

The behaviors that build wealth aren't glamorous. They're consistent, disciplined, and invisible to outsiders.

## Habit 1: Live Below Your Means — Deliberately

Living below your means doesn't mean deprivation. It means *intentionally* spending less than you earn and directing the difference toward building assets.

**Lifestyle inflation** is the main threat: as income rises, expenses tend to rise proportionally, keeping the savings rate flat. Avoiding lifestyle inflation on income increases is the single most powerful wealth-building habit.

Strategy: When you get a raise, save 50–100% of the increase. If your take-home goes up $300/month, redirect $150–$300 of it to savings before adjusting your lifestyle spending.

## Habit 2: Think in Terms of Net Worth, Not Income

Wealthy people think about their net worth — the total value of what they own minus what they owe. Income is just the input; net worth is the output.

**Net Worth = Assets − Liabilities**

Assets: Checking, savings, investments, retirement accounts, real estate equity, business value.
Liabilities: Mortgage balance, car loans, student loans, credit card debt, personal loans.

Tracking your net worth monthly (a simple spreadsheet works) shifts your focus from "how much did I earn this month" to "how much is my overall financial position improving."

## Habit 3: Protect Your Downside Before Chasing Upside

Financially secure people prioritize not losing over trying to win big. They:
- Build emergency funds before investing aggressively
- Maintain adequate insurance (health, auto, renters/homeowners, disability, life if dependents exist)
- Avoid high-risk speculative bets with money they can't afford to lose

This isn't about being risk-averse. It's about asymmetric thinking: losing $10,000 to a financial setback feels much worse than gaining $10,000 feels good. Protecting the downside preserves your ability to stay in the game.

## Habit 4: Consistently Invest — Regardless of Market Conditions

Financially secure people invest consistently and mechanically — not based on headlines, not based on how the market performed last month, not based on tips from friends.

They set up automatic monthly contributions to index funds in retirement accounts and leave them alone.

"The stock market is a device for transferring money from the impatient to the patient." — Warren Buffett

## Habit 5: Avoid Debt for Depreciating Assets

The wealthiest people have a strong bias against carrying high-interest debt. They avoid:
- Carrying credit card balances
- Car loans for vehicles beyond their means
- Financing lifestyle items (furniture, vacations, electronics) they can't afford cash

They use debt strategically when it creates value: mortgages on appreciating property, business financing with positive ROI. They pay off non-strategic debt aggressively.

## Habit 6: Build Multiple Income Streams

Single-income dependency is financial fragility. Financially resilient people often have:
- Primary job income
- A side business or freelance work
- Investment income (dividends, interest)
- Potentially rental income

Even a $500/month side income is $6,000/year — potentially the amount needed to max a Roth IRA contribution.

## Habit 7: Keep Learning

Financial literacy compounds just like money. The person who understands tax-advantaged accounts, debt repayment strategies, and index investing makes better decisions than the person who doesn't — decisions worth tens of thousands of dollars over a lifetime.

Reading one personal finance book per year is worth more than most financial "products" you'll be offered.

**Recommended starting points:** The Psychology of Money (Morgan Housel), The Simple Path to Wealth (JL Collins), I Will Teach You to Be Rich (Ramit Sethi).

## Key Takeaway

Wealth is built through consistent, disciplined behavior over years — not income level alone. Live below your means, track net worth not just income, protect your downside, invest automatically, avoid high-interest debt, and keep learning. These habits are available to anyone at any income level.`,
    quiz_questions: [
      {
        question: "What is 'lifestyle inflation' and why is it one of the biggest threats to wealth building?",
        options: [
          "The government inflating the economy, which reduces savings value",
          "The tendency for spending to rise with income, keeping the savings rate flat and preventing accumulated wealth despite higher earnings",
          "Inflation specifically affecting luxury goods",
          "Rising subscription costs over time"
        ],
        correct_answer: 1,
        explanation: "Lifestyle inflation means every raise is immediately consumed by higher spending — nicer car, bigger apartment, more dining. Without deliberately redirecting income increases to savings, wealth accumulation stays flat regardless of salary growth."
      },
      {
        question: "A person earns $50,000/year but has $150,000 in retirement savings, no debt, and a $15,000 emergency fund. Another person earns $120,000/year but has $5,000 in savings and $40,000 in consumer debt. Who is in a better financial position?",
        options: [
          "The $120,000 earner — higher income means more financial security",
          "The $50,000 earner — their net worth and financial behavior reflects far greater financial security",
          "They are equal — income is the only measure that matters",
          "It depends on their job security"
        ],
        correct_answer: 1,
        explanation: "Financial security is determined by net worth and financial behaviors, not income. High earners who spend everything are fragile. Modest earners who save consistently and avoid debt build lasting security."
      },
      {
        question: "When you receive a raise increasing your take-home by $400/month, what is the wealth-building optimal approach?",
        options: [
          "Upgrade your lifestyle to match your new income level — you earned it",
          "Redirect 50–100% of the raise to savings or investments before adjusting lifestyle spending",
          "Put the extra money in a checking account as a buffer",
          "Use it to pay for a nicer vacation as a reward"
        ],
        correct_answer: 1,
        explanation: "Redirecting raises to savings is the core mechanism of avoiding lifestyle inflation. If you never see the money in your spending account, you don't miss it. This one habit accounts for a significant portion of why some people build wealth and others don't."
      }
    ]
  }
];

// Add/update lessons
newLessons.forEach(nl => {
  const exists = lessons.findIndex(l => l.id === nl.id);
  if (exists !== -1) {
    lessons[exists] = nl;
    console.log("Updated:", nl.id);
  } else {
    lessons.push(nl);
    console.log("Added:", nl.id, nl.title);
  }
});

fs.writeFileSync(LESSONS_PATH, JSON.stringify(lessons, null, 2));
console.log("\n✅ Part 3b complete — 5 Credit + 4 Investing + 4 Saving new lessons added");
console.log("   Total lessons:", lessons.length);

if (fs.existsSync(DIST_LESSONS)) {
  fs.writeFileSync(DIST_LESSONS, JSON.stringify(lessons, null, 2));
  console.log("✅ dist/ also updated");
}
