// Part 1: Updated content for existing lessons — Budgeting + Banking
// Run with: node scripts/expand-courses-part1.js

const fs = require("fs");
const path = require("path");

const LESSONS_PATH  = path.join(__dirname, "../public/data/lessons.json");
const DIST_LESSONS  = path.join(__dirname, "../dist/data/lessons.json");

const lessons = JSON.parse(fs.readFileSync(LESSONS_PATH, "utf8"));

// Helper — replace content + quiz_questions on an existing lesson by id
function update(id, patch) {
  const idx = lessons.findIndex(l => l.id === id);
  if (idx === -1) { console.warn("NOT FOUND:", id); return; }
  Object.assign(lessons[idx], patch);
}

// ─── BUDGETING EXISTING LESSONS ───────────────────────────────────────────────

update("lesson-bud-001", {
  duration_minutes: 8,
  xp_reward: 75,
  content: `## Why Budgeting Matters

Money is limited. No matter how much you earn, there are always more things to spend it on than you have money for. A budget is the tool that puts *you* in charge of those decisions — instead of your money disappearing and you wondering where it went.

**Without a budget**, most people operate on autopilot: they earn money, spend freely, pay bills when they arrive, and hope something is left over at the end of the month. That "something" rarely materializes. Studies consistently show that people without budgets spend 20–30% more than those who actively track spending.

**With a budget**, you decide in advance exactly where each dollar goes — rent, food, savings, entertainment. You become intentional.

## What a Budget Actually Is

A budget is simply a plan for your money. It answers one question: *For every dollar I earn, where does it go?*

It is NOT:
- A punishment for spending too much
- A spreadsheet that restricts all fun
- Only for people who are broke

It IS:
- A roadmap to your financial goals
- A tool for making conscious trade-offs
- Something every financially successful person uses

Think of it like a GPS for money. You can still choose your destination — but the GPS tells you whether the route you're taking will actually get you there.

## The Real Cost of Not Budgeting

Here's a concrete example. Suppose you earn $3,000/month after taxes and spend without tracking:

- $1,200 rent
- $400 food (restaurants mostly)
- $150 subscriptions (Netflix, Spotify, gym, apps you forgot about)
- $200 clothing / impulse buys
- $300 car payment + gas
- $180 going out / entertainment
- $250 miscellaneous charges

Total: $2,680. You saved $320. But last month your car needed a $700 repair. You had no emergency fund. You put it on a credit card at 22% APR.

Now you owe $700 + interest. One untracked month became debt.

A budget would have caught the $150 in forgotten subscriptions, the extra $200 in restaurant overspend, and built a $500 emergency cushion over 2–3 months.

## Budgeting as a Living Document

Your first budget won't be perfect — and it shouldn't be. It's a first draft. The goal is to start, observe what happens, adjust, and repeat.

**Life changes → budget changes:**
- New job = new income
- Moving = new rent
- New baby = new expenses
- Paying off a loan = freed-up cash to redirect

Revisit your budget whenever a major life change happens, and do a light review every month. This is a skill you build over time, not a one-time setup.

## What This Means for You

Even if you're a student living on $800/month from a part-time job, a budget matters. Especially then. The habits you build now with small amounts are the exact same habits you'll use when earning $80,000/year.

**Key Takeaway:** A budget is not a restriction — it's a plan. People who budget consistently reach financial goals faster, carry less debt, and stress less about money.`,
  quiz_questions: [
    {
      question: "What is the primary purpose of creating a personal budget?",
      options: [
        "To restrict all discretionary spending",
        "To make a plan for where each dollar goes before you spend it",
        "To impress your bank or employer",
        "To maximize credit card rewards"
      ],
      correct_answer: 1,
      explanation: "A budget is a spending plan made in advance. It lets you decide intentionally where your money goes, rather than spending freely and wondering where it went."
    },
    {
      question: "People without budgets tend to spend how much more than those who actively track spending?",
      options: ["0–5% more", "10–15% more", "20–30% more", "50% more"],
      correct_answer: 2,
      explanation: "Research consistently shows that untracked spending exceeds budgeted spending by 20–30%, because small impulse purchases add up invisibly."
    },
    {
      question: "Which of the following is TRUE about budgets?",
      options: [
        "They are only useful for people in debt",
        "They should never be changed once created",
        "They are living documents that should be updated when your life changes",
        "They are only needed by people earning under $30,000"
      ],
      correct_answer: 2,
      explanation: "A budget is a living document. It should be updated whenever major life changes occur — new job, new home, family changes, or when you pay off a debt."
    },
    {
      question: "In the example where someone earns $3,000/month, what category likely caused the most unnoticed spending?",
      options: ["Rent", "Forgotten subscriptions and restaurant overspending", "Car payment", "Entertainment"],
      correct_answer: 1,
      explanation: "Subscriptions that auto-renew and restaurant spending are two of the most common budget blind spots — they're small individually but add up significantly."
    }
  ]
});

update("lesson-bud-002", {
  duration_minutes: 9,
  xp_reward: 80,
  content: `## Reading Your Pay Stub

Your paycheck is not the number your employer told you when you were hired. That was your *gross pay* — what you earn before deductions. What actually hits your bank account is your *net pay*, also called take-home pay. Understanding the difference is essential to any real budget.

## Gross Pay vs. Net Pay

**Gross Pay** = What you earn before anything is taken out.
**Net Pay** = What you actually receive after all deductions.

Example: You're hired at $50,000/year = $4,167/month gross. After taxes and deductions, you might take home $3,100–$3,300/month.

That $800–$1,000 gap matters enormously when you're planning a budget.

## The Main Deductions on Every Pay Stub

**1. Federal Income Tax**
Withheld by your employer and sent to the IRS. The amount depends on your filing status and the W-4 form you filled out when hired. You can adjust this by updating your W-4.

**2. State Income Tax**
Most states charge income tax (9 states do not, including Florida and Texas). Rates vary widely — from under 3% to over 9%.

**3. FICA: Social Security (6.2%) + Medicare (1.45%)**
FICA stands for Federal Insurance Contributions Act. These fund Social Security and Medicare for all Americans. You pay 7.65% total; your employer matches it. This is not optional.

**4. Health Insurance Premium**
If your employer offers health coverage and you enrolled, your share of the premium comes out pre-tax each paycheck. Common employee contribution: $100–$300/month depending on the plan and employer subsidy.

**5. 401(k) or 403(b) Contributions**
If you're contributing to a workplace retirement account, it's deducted here. Pre-tax contributions reduce your taxable income — a real financial benefit.

**6. Other Deductions**
Dental, vision, FSA/HSA, life insurance, parking, transit benefits — all may appear depending on your employer.

## A Real Pay Stub Example

| Item | Amount |
|---|---|
| Gross Pay | $3,846 |
| Federal Tax | -$480 |
| State Tax | -$154 |
| Social Security | -$238 |
| Medicare | -$56 |
| Health Insurance | -$150 |
| 401(k) 5% | -$192 |
| **Net Pay** | **$2,576** |

That's a 33% gap between what you earn and what you take home.

## What Goes on Your W-4

When you start a job, you fill out a W-4 that tells your employer how much federal tax to withhold. If you claim more allowances (or use the updated W-4 form fields), less is withheld. If too little is withheld all year, you owe money at tax time.

**Tip:** If you get a large tax refund every year, you're giving the government an interest-free loan. You could adjust your W-4 to get that money in each paycheck instead.

## Practical Takeaway

Before building your budget, look up your actual last pay stub. Use the *net pay* figure — not your salary — as your income line. This is the number that matters for every bill, savings target, and spending plan you make.

**Key Takeaway:** The difference between gross and net pay can be 25–35% of your salary. Always budget from net pay, not the salary number you were hired at.`,
  quiz_questions: [
    {
      question: "What is the difference between gross pay and net pay?",
      options: [
        "Gross pay includes tips; net pay doesn't",
        "Gross pay is before deductions; net pay is what you actually receive",
        "They are the same number",
        "Net pay is higher than gross pay"
      ],
      correct_answer: 1,
      explanation: "Gross pay is your total earnings before taxes and deductions. Net pay (take-home pay) is what you actually receive after all withholdings."
    },
    {
      question: "FICA taxes on your paycheck fund:",
      options: [
        "State road construction",
        "Your employer's business expenses",
        "Social Security and Medicare",
        "Your personal retirement account"
      ],
      correct_answer: 2,
      explanation: "FICA (Federal Insurance Contributions Act) funds Social Security (6.2%) and Medicare (1.45%). Both you and your employer pay this — 7.65% each."
    },
    {
      question: "Why should you always budget using your NET pay rather than your salary?",
      options: [
        "Salary is confidential information",
        "Net pay is what actually hits your bank account — taxes and deductions come out first",
        "Salary is not reliable",
        "Net pay is always higher than salary"
      ],
      correct_answer: 1,
      explanation: "After federal tax, state tax, FICA, and benefits deductions, most people take home 65–75% of their gross salary. Budgeting from gross pay means planning with money you don't actually have."
    },
    {
      question: "If you receive a large tax refund every April, what does that typically mean?",
      options: [
        "You are excellent at saving",
        "Too much federal tax was withheld — you gave the government an interest-free loan",
        "You made an error on your pay stub",
        "Your employer paid you too much"
      ],
      correct_answer: 1,
      explanation: "A large refund means you overpaid taxes throughout the year. You can adjust your W-4 to reduce withholding and get that money in each paycheck instead."
    }
  ]
});

update("lesson-bud-003", {
  duration_minutes: 10,
  xp_reward: 90,
  content: `## Building Your First Budget

Let's make this real. Most first-time budgeters make one mistake: they start with categories and try to fill in numbers. The right approach is the opposite — start with what you actually earn and spend, *then* categorize.

## Step 1: Know Your Monthly Take-Home Pay

Before anything else, know exactly what hits your bank account each month. If you're paid bi-weekly (every two weeks), multiply one paycheck by 26, then divide by 12 for a monthly average.

**Example:**
- Bi-weekly paycheck: $1,350
- Annual: $1,350 × 26 = $35,100
- Monthly: $35,100 ÷ 12 = **$2,925/month**

## Step 2: List Your Fixed Expenses

Fixed expenses are the same every month — you can't easily change them in the short term.

| Fixed Expense | Monthly Amount |
|---|---|
| Rent / Mortgage | $1,100 |
| Car Payment | $285 |
| Car Insurance | $120 |
| Phone Bill | $65 |
| Internet | $50 |
| Subscriptions | $45 |
| **Total Fixed** | **$1,665** |

## Step 3: List Your Variable Expenses

Variable expenses change each month. Track these by looking at 2–3 months of bank and credit card statements.

| Variable Expense | Monthly Estimate |
|---|---|
| Groceries | $300 |
| Gas / Transportation | $100 |
| Dining out | $180 |
| Entertainment | $60 |
| Clothing / Personal | $80 |
| Misc / Unexpected | $75 |
| **Total Variable** | **$795** |

## Step 4: Include Savings as a Line Item

Most people save "whatever's left." That's why most people save nothing. Treat savings like a bill — it gets paid first.

| Savings Category | Monthly Amount |
|---|---|
| Emergency Fund | $150 |
| Retirement (401k) | $150 |
| **Total Savings** | **$300** |

## Step 5: Check the Math

Income: **$2,925**
Fixed Expenses: $1,665
Variable Expenses: $795
Savings: $300
**Total Allocated: $2,760**
**Remaining: $165** ← Buffer / overflow

If this number is negative, you have a spending problem to solve. If it's positive, consider adding it to savings or your emergency fund.

## The 50/30/20 Starting Point

As a rough benchmark, the **50/30/20 rule** allocates:
- **50%** to needs (housing, food, utilities, transportation, insurance)
- **30%** to wants (dining out, entertainment, subscriptions, clothes)
- **20%** to savings and debt repayment

On $2,925/month:
- Needs: $1,462
- Wants: $877
- Savings/Debt: $585

Most beginners find their "wants" category overshoots 30%. That's normal — the budget helps you see it and make choices.

## Practical Takeaway

Build your first budget this weekend. You need: your last 2 pay stubs, 2–3 months of bank statements, and a spreadsheet or free budgeting app (YNAB, Mint, EveryDollar, or even a Google Sheet).

**Key Takeaway:** A budget is built from real numbers, not estimates. Start by looking at what you *actually* spent over the last 2–3 months — then make a plan from there.`,
  quiz_questions: [
    {
      question: "What is the recommended first step in building a budget?",
      options: [
        "Guess your average monthly spending",
        "Determine your actual monthly take-home (net) pay",
        "Sign up for a budgeting app",
        "Cut all discretionary spending immediately"
      ],
      correct_answer: 1,
      explanation: "A budget starts with income, not expenses. You need to know exactly what you take home each month before you can plan where it goes."
    },
    {
      question: "Under the 50/30/20 rule, what does the '20' represent?",
      options: [
        "20% to entertainment and dining",
        "20% to taxes",
        "20% to savings and debt repayment",
        "20% to housing"
      ],
      correct_answer: 2,
      explanation: "The 50/30/20 rule allocates 20% to savings and debt repayment — building financial security and reducing what you owe."
    },
    {
      question: "Why should savings be listed as a budget line item rather than 'whatever's left'?",
      options: [
        "Banks require it",
        "Treating savings like a fixed bill ensures it actually gets funded every month",
        "It makes taxes easier",
        "Variable expenses are unpredictable"
      ],
      correct_answer: 1,
      explanation: "When savings is 'whatever's left,' life always finds a way to fill that gap. Listing it as a line item and 'paying yourself first' is the core habit of wealth-building."
    }
  ]
});

update("lesson-bud-004", {
  duration_minutes: 9,
  xp_reward: 80,
  content: `## Budget Exercise: Real-World Scenarios

Budgeting isn't just theory — it's practice. Let's walk through three realistic budget scenarios and see how the decisions play out. For each one, evaluate whether the budget works and what you'd change.

## Scenario 1: First Job, $45,000/Year

**Take-home pay:** ~$2,800/month (after taxes and health insurance)

| Category | Amount | % of Income |
|---|---|---|
| Rent (shared apartment) | $750 | 27% |
| Utilities + Internet | $80 | 3% |
| Car payment | $320 | 11% |
| Car insurance | $110 | 4% |
| Groceries | $250 | 9% |
| Gas | $90 | 3% |
| Dining + Entertainment | $300 | 11% |
| Subscriptions | $60 | 2% |
| Student loan minimum | $200 | 7% |
| Savings | $100 | 4% |
| **Total** | **$2,260** | **81%** |
| **Remaining** | **$540** | **19%** |

**Analysis:** The budget works, but $100/month in savings is only 3.5%. With $540 left, this person should allocate at least $300 more toward an emergency fund or extra loan payments. The dining/entertainment at $300 is the most flexible category.

## Scenario 2: College Student, $1,200/Month

Part-time job + family support. Variable income is the challenge.

| Category | Amount |
|---|---|
| Rent (dorm / shared) | $500 |
| Food (dining hall + groceries) | $250 |
| Phone (family plan share) | $30 |
| Transportation / Uber | $80 |
| Books + Supplies | $60 |
| Entertainment | $100 |
| Emergency cushion | $100 |
| **Total** | **$1,120** |
| **Remaining** | **$80** |

**Analysis:** This is tight. The $60 for books looks low — textbooks can spike in some semesters. A separate line item for "irregular expenses" (books, fees, clothing) funded at $30–50/month would prevent these from throwing off the budget.

## Scenario 3: Budget Crisis — $400 Overspend

This person earns $3,200/month but spent $3,600 last month. Where did the extra $400 come from? Credit card debt.

Overspending categories identified:
- Dining out: budgeted $200, spent $380 (+$180)
- Clothing: budgeted $50, spent $210 (+$160)
- Miscellaneous: budgeted $100, spent $160 (+$60)

**The Fix:**
1. Acknowledge the overspend — no shame, just data
2. Identify the triggers (stress shopping, social eating)
3. Set a firmer cap with a cash/debit-only rule for dining
4. Pause non-essential shopping for 30 days
5. Pay off the extra $400 from next month before adding to savings

## Common First-Year Budget Mistakes

**Mistake 1: Forgetting irregular expenses**
Annual costs (car registration, holiday gifts, yearly subscriptions) catch people off guard. Divide annual costs by 12 and add them as a monthly line item.

**Mistake 2: Being too restrictive**
A budget that allows zero fun is a budget you'll abandon in week two. Include entertainment and personal spending — just at a level that doesn't wreck your finances.

**Mistake 3: Treating the budget as fixed**
Your income, expenses, and goals change. Review monthly, adjust quarterly.

## Key Takeaway

Real budgets get tested by real life. The goal isn't perfection — it's catching problems early and correcting course before a $300 overspend becomes $3,000 of credit card debt.`,
  quiz_questions: [
    {
      question: "In Scenario 1, the person has $540 remaining after expenses. What is the most financially sound use of that extra money?",
      options: [
        "Spend it freely since the budget is met",
        "Allocate most of it to emergency fund or extra loan payments",
        "Immediately invest it all in stocks",
        "Put it all toward a vacation fund"
      ],
      correct_answer: 1,
      explanation: "With only $100 in savings currently (3.5% of income), the most impactful use of extra funds is building an emergency fund or accelerating debt repayment."
    },
    {
      question: "What is the best way to handle irregular annual expenses (car registration, holiday gifts) in a budget?",
      options: [
        "Ignore them — they're too unpredictable",
        "Divide the annual cost by 12 and save that amount each month",
        "Put them on a credit card when they arrive",
        "Only deal with them in December"
      ],
      correct_answer: 1,
      explanation: "Dividing annual costs by 12 turns unpredictable spikes into manageable monthly contributions — a technique called 'sinking funds.'"
    },
    {
      question: "When you overspend your budget in a category, what is the right first response?",
      options: [
        "Cancel the budget entirely and start over",
        "Acknowledge it as data, identify the trigger, and adjust the plan",
        "Ignore it — one month doesn't matter",
        "Borrow money to cover it"
      ],
      correct_answer: 1,
      explanation: "Overspending is information, not failure. Identifying why it happened (stress shopping, social pressure, etc.) lets you create a plan to prevent it next time."
    }
  ]
});

update("lesson-bud-005", {
  duration_minutes: 9,
  xp_reward: 80,
  content: `## Tracking and Adjusting Your Budget

A budget you create once and never look at again is just a document. Tracking is what turns a budget into a financial tool — it shows you in real time where your money is actually going versus where you planned for it to go.

## Why Tracking Matters

The goal of tracking is not to judge yourself for every coffee purchase. It's to build awareness. Most people are surprised by what they find when they first start tracking carefully.

Common discoveries from first-time trackers:
- "I'm spending $280/month on restaurants — I thought it was $100."
- "I have 11 active subscriptions. I forgot about 4 of them."
- "My 'miscellaneous' category is actually $400+ every month."

Without tracking, you're navigating blind. With tracking, you know exactly where you stand at any point in the month.

## Tracking Methods: Find What Works for You

**Method 1: Budgeting Apps (Recommended for Beginners)**

Apps like **YNAB (You Need a Budget)**, **Copilot**, **Monarch Money**, or **EveryDollar** connect to your bank accounts and automatically categorize transactions.

Pros: Automatic, visual, easy to review
Cons: Small monthly fee for premium features (YNAB ~$14/month, but pays for itself)

**Method 2: Spreadsheet**

A Google Sheet or Excel file where you log every transaction manually.

Pros: Free, fully customizable, you understand every number
Cons: Takes discipline to update consistently; manual entry is tedious

**Method 3: Envelope Method**

Withdraw cash in the amounts budgeted for variable categories. When the envelope is empty, spending in that category stops.

Pros: Extremely effective at controlling overspending
Cons: Inconvenient in a digital world; doesn't work for online purchases

**Most people do best with a combination:** an app for automatic bank tracking + a monthly review spreadsheet for analysis.

## The Monthly Budget Review

Set aside 20–30 minutes at the end of each month. Ask:

1. **Did income match expectations?** Any extra? Any shortfall?
2. **Which categories overspent?** By how much?
3. **Which categories underspent?** What do I do with the surplus?
4. **Did I hit my savings goal?**
5. **What adjustments do I need for next month?**

This review is the most important habit in personal finance. It's what separates people who say they have a budget from people who actually follow one.

## Adjusting When Life Changes

Your budget is not written in stone. These events require a budget adjustment:

| Life Event | Budget Action |
|---|---|
| New job or raise | Allocate new income (don't lifestyle inflate it all away) |
| Moved to new city | Update rent, utilities, transportation |
| Paid off a loan | Redirect that monthly payment to savings or investing |
| New subscription or commitment | Find where the extra money comes from |
| Medical expense | Pull from emergency fund; replenish next month |

## The Zero-Based Budget Principle

One advanced technique: **zero-based budgeting**. Every dollar of income is assigned to a category — including savings — until you reach zero unallocated dollars.

Income: $3,000
All categories: $3,000
Unallocated: **$0**

This doesn't mean you spend everything. It means every dollar has a job. If you have $200 left unallocated, assign it to savings or debt rather than letting it drift into spending.

## Key Takeaway

Tracking transforms a budget from theory into practice. Review your budget monthly, adjust for life changes, and remember: the goal isn't to never overspend — it's to notice it quickly and course-correct before it compounds.`,
  quiz_questions: [
    {
      question: "What is the main benefit of tracking spending throughout the month?",
      options: [
        "It impresses your bank",
        "It creates real-time awareness of where money is going vs. what was planned",
        "It automatically reduces spending",
        "It replaces the need for a budget"
      ],
      correct_answer: 1,
      explanation: "Tracking reveals the gap between what you planned to spend and what you actually spent — allowing you to course-correct before the month ends."
    },
    {
      question: "What is zero-based budgeting?",
      options: [
        "Spending every dollar you earn",
        "Assigning every dollar of income to a specific category (including savings) until nothing is unallocated",
        "Having zero dollars in savings",
        "Starting a new budget from scratch every month"
      ],
      correct_answer: 1,
      explanation: "Zero-based budgeting means every dollar has a purpose — needs, wants, or savings — leaving nothing unassigned. It maximizes intention and reduces drift spending."
    },
    {
      question: "When you pay off a loan, what should you do with that freed-up monthly payment?",
      options: [
        "Use it for extra dining and entertainment",
        "Redirect it to savings, investing, or paying off another debt faster",
        "Leave it unallocated in your checking account",
        "Reduce your work hours"
      ],
      correct_answer: 1,
      explanation: "When a debt is eliminated, that monthly payment is newly freed cash. Redirecting it to savings or the next debt accelerates your financial progress significantly."
    }
  ]
});

update("lesson-bud-006", {
  duration_minutes: 9,
  xp_reward: 90,
  content: `## Setting and Reaching Financial Goals

A budget without a goal is just an accounting exercise. The reason to manage your money carefully is to reach specific destinations — financial security, a car purchase, a home down payment, an emergency fund, retirement. Goals give budgeting its purpose.

## The SMART Goal Framework for Money

Financial goals should be SMART:
- **Specific** — What exactly are you saving for?
- **Measurable** — How much does it cost?
- **Achievable** — Can you actually reach this given your income and expenses?
- **Relevant** — Does this align with your real priorities?
- **Time-bound** — By when?

**Bad goal:** "I want to save more money."
**SMART goal:** "I will save $3,000 for an emergency fund by December 31 by putting $250/month into a high-yield savings account."

The second version is something you can actually act on and measure.

## Three Tiers of Financial Goals

**Tier 1 — Short-Term Goals (0–2 years)**
These are the foundations you build first.

- Emergency fund: 3–6 months of expenses
- Pay off credit card debt
- Save for a car or major purchase
- First-month / security deposit for housing

**Tier 2 — Medium-Term Goals (2–7 years)**
Once foundations are solid, expand.

- Home down payment (typically 10–20% of purchase price)
- Career development (education, certifications, tools)
- Major travel or experiences
- Starting a business

**Tier 3 — Long-Term Goals (7+ years)**
These compound over time and benefit most from starting early.

- Retirement savings (maximize 401k, IRA)
- Paying off student loans ahead of schedule
- Building investment portfolio
- Financial independence

## The Sinking Fund Strategy

A **sinking fund** is money you set aside gradually for a planned future expense. It prevents large purchases from becoming emergencies or debt.

**Examples:**
- Saving $100/month for 6 months → $600 for holiday gifts (no credit card debt in January)
- Saving $150/month → $1,800/year for car maintenance / registration
- Saving $200/month for 20 months → $4,000 for a used car purchase

Create separate sinking fund categories in your budget for each major upcoming expense.

## Prioritizing When Money Is Tight

If you can only do one thing at a time, follow this priority order:

1. **Cover all essentials first** (housing, utilities, food, transportation)
2. **Meet your employer match on 401(k)** (free money — always do this)
3. **Build a starter emergency fund** ($500–$1,000)
4. **Pay off high-interest debt** (credit cards, payday loans)
5. **Build full emergency fund** (3–6 months of expenses)
6. **Invest for retirement and other goals**

This framework, sometimes called the Financial Order of Operations, prevents you from investing aggressively while carrying 22% APR credit card debt.

## Celebrating Progress Without Destroying It

One of the biggest mistakes people make: they reach a savings goal and celebrate by spending the savings.

Mark milestones in non-financial ways. Hit $1,000 in your emergency fund? Tell someone who supports you, give yourself a small, pre-budgeted reward. Don't spend the $1,000.

Progress is motivating. Tracking visible progress — a savings thermometer, a graph in your budget spreadsheet, watching your emergency fund grow — makes it easier to stay on track.

## Key Takeaway

Goals are the why behind every budget decision. Set them specifically (amounts + dates), prioritize logically, use sinking funds for large planned expenses, and celebrate milestones without undermining your progress.`,
  quiz_questions: [
    {
      question: "What is a 'sinking fund' in personal finance?",
      options: [
        "A failing investment account",
        "Money set aside gradually for a specific planned future expense",
        "A type of emergency fund",
        "A bank account with no interest"
      ],
      correct_answer: 1,
      explanation: "A sinking fund is a dedicated savings category for a known future expense — like holiday gifts or car maintenance. It converts large lumpy costs into small, manageable monthly contributions."
    },
    {
      question: "According to the Financial Order of Operations, what should you do BEFORE paying off high-interest debt?",
      options: [
        "Max out your Roth IRA",
        "Buy stocks",
        "Get your employer's full 401(k) match and build a starter emergency fund ($500–$1,000)",
        "Save 6 months of expenses first"
      ],
      correct_answer: 2,
      explanation: "The employer 401(k) match is free money (often 50–100% instant return). A starter emergency fund prevents new debt during the payoff phase. Both come before aggressively eliminating debt."
    },
    {
      question: "Which of the following is a SMART financial goal?",
      options: [
        "Save more money this year",
        "Spend less on food",
        "Save $2,400 for an emergency fund by October 31 by setting aside $200/month",
        "Be better with money"
      ],
      correct_answer: 2,
      explanation: "A SMART goal is Specific, Measurable, Achievable, Relevant, and Time-bound. '$2,400 by October 31 via $200/month' checks all five boxes."
    }
  ]
});

// ─── BANKING EXISTING LESSONS ─────────────────────────────────────────────────

update("lesson-bank-001", {
  duration_minutes: 9,
  xp_reward: 75,
  content: `## Types of Financial Institutions

Not all banks are the same. Choosing where you keep your money affects how much you pay in fees, how much interest you earn on savings, and what kind of customer service you receive. There are four main types of financial institutions — each with different structures, benefits, and trade-offs.

## Traditional (Brick-and-Mortar) Banks

**Examples:** Chase, Bank of America, Wells Fargo, Citibank

Traditional banks have physical branches and ATMs nationwide. They offer the widest range of products: checking, savings, mortgages, car loans, credit cards, investment accounts, and business banking — all under one roof.

**Advantages:**
- In-person service for complex needs (loans, disputes, notarizations)
- Extensive ATM networks
- Name recognition and perceived stability
- Full suite of products in one place

**Disadvantages:**
- Often the lowest interest rates on savings (0.01–0.05% APY is common)
- Higher fees (monthly maintenance fees, minimum balance requirements)
- Slower to adopt technology

**Best for:** People who value in-person access, or who need complex banking services (mortgages, business accounts, wealth management).

## Online-Only Banks

**Examples:** Ally, Marcus by Goldman Sachs, Discover Bank, SoFi, Chime

Online banks have no physical branches — everything is managed through apps and websites. Because they don't pay for real estate and tellers, they pass those savings to customers as higher interest rates and lower fees.

**Advantages:**
- High-yield savings accounts (4–5% APY during high-rate environments vs. 0.01–0.5% at big banks)
- No monthly fees on most accounts
- No minimum balance requirements
- Often reimburse ATM fees

**Disadvantages:**
- No in-person service
- Cash deposits are difficult or impossible
- May not offer mortgages, business accounts, or all loan types

**Best for:** People comfortable with technology who want to maximize savings interest and minimize fees.

## Credit Unions

**Examples:** Navy Federal, Alliant Credit Union, PenFed, your local community credit union

Credit unions are **non-profit financial cooperatives** owned by their members. When you deposit money at a credit union, you become a partial owner. Profits go back to members in the form of higher interest on deposits and lower rates on loans.

**Advantages:**
- Lower loan interest rates (car loans, personal loans)
- Higher savings rates than big banks
- Lower fees
- Member-focused service

**Disadvantages:**
- Membership requirements (employer, school, community, or association)
- Smaller ATM networks
- Technology may lag behind big banks
- More limited product range

**Best for:** People who qualify for membership and want better loan rates or savings rates than big banks offer.

## Neobanks and Fintech Apps

**Examples:** Chime, Current, Dave, Varo, Cash App Banking

Neobanks are tech-first companies that operate banking-like services, often partnering with a real FDIC-insured bank on the backend. They focus on ease of use, mobile-first design, and specific features (early direct deposit, no overdraft fees, fee-free banking).

**Advantages:**
- Extremely easy to open accounts
- Early direct deposit (access paycheck 2 days early)
- No overdraft fees on many products
- Great UX and app design

**Disadvantages:**
- Limited product set
- Customer service can be slow (app-only)
- Less financial history and stability than established institutions
- Savings rates can be lower than dedicated online banks

**Best for:** Students, young people getting started, or anyone who wants simple, fee-free everyday banking.

## FDIC vs. NCUA Insurance

All reputable institutions — banks, online banks, and credit unions — offer deposit insurance:

- **FDIC** (Federal Deposit Insurance Corporation): Protects deposits at banks up to **$250,000 per account type per institution**
- **NCUA** (National Credit Union Administration): Same protection, for credit unions

This means if your bank fails, your money (up to $250,000) is protected by the federal government.

**Key Takeaway:** The right institution depends on your needs. Many people use a combination: a credit union or online bank for savings (better rates), and a local bank or neobank for everyday checking.`,
  quiz_questions: [
    {
      question: "Why do online banks typically offer higher savings interest rates than traditional banks?",
      options: [
        "They take on riskier investments",
        "They have lower operating costs (no physical branches) and pass savings to customers",
        "They are unregulated",
        "They are owned by the government"
      ],
      correct_answer: 1,
      explanation: "Online banks eliminate the cost of physical branches and tellers. Those savings translate to higher APY on savings accounts and lower fees for customers."
    },
    {
      question: "What makes credit unions different from traditional banks?",
      options: [
        "They are government-owned",
        "They are for-profit publicly traded companies",
        "They are non-profit cooperatives owned by their members, often offering better rates",
        "They only accept cash deposits"
      ],
      correct_answer: 2,
      explanation: "Credit unions are non-profit member cooperatives. Profits return to members as lower loan rates and higher savings rates. Membership requirements apply."
    },
    {
      question: "FDIC insurance protects your deposits up to:",
      options: ["$10,000", "$100,000", "$250,000 per account type per institution", "Unlimited amount"],
      correct_answer: 2,
      explanation: "FDIC insurance covers up to $250,000 per depositor, per account ownership category, per FDIC-insured institution. Credit unions have equivalent NCUA protection."
    },
    {
      question: "A neobank like Chime is best described as:",
      options: [
        "A government-owned bank with physical branches",
        "A tech-first company offering banking-like services, often partnered with an FDIC-insured bank",
        "A type of credit union",
        "An investment brokerage"
      ],
      correct_answer: 1,
      explanation: "Neobanks are fintech companies that deliver mobile-first banking experiences. They partner with real banks for FDIC insurance and focus on ease of use and low fees."
    }
  ]
});

update("lesson-bank-002", {
  duration_minutes: 9,
  xp_reward: 75,
  content: `## Checking, Savings, and Debit Cards

Three tools. One financial foundation. Understanding what checking accounts, savings accounts, and debit cards each do — and how they work together — is the baseline of day-to-day financial management.

## Checking Accounts: Your Financial Hub

A checking account is where your money lives for daily use. It's designed for frequent transactions:

- Direct deposit from employer
- Bill payments (automatic or manual)
- Debit card purchases
- ATM withdrawals
- Transfers to savings

**Key features to understand:**

**Minimum balance:** Some accounts charge fees if your balance drops below a threshold (e.g., $1,500). Online banks rarely have this. Traditional banks often do.

**Overdraft:** If you spend more than your balance, the bank can either decline the transaction or cover it — and charge an overdraft fee ($25–$35 per incident). Always know your balance.

**Direct deposit:** Your employer deposits your paycheck directly into your checking account on payday. This is the standard for most employers and faster than paper checks.

## Savings Accounts: Your Money's Resting Place

A savings account holds money you're not spending right now. It earns interest (more on that shortly), and it's designed to be slightly less accessible than checking — to discourage impulsive withdrawals.

**What savings accounts are for:**
- Emergency fund
- Short-term savings goals (car, vacation, down payment)
- Money you won't need for 1–12 months

**High-Yield Savings Accounts (HYSA)**
Regular savings accounts at big banks offer almost no interest (0.01–0.5% APY). High-yield savings accounts at online banks (Ally, Marcus, Discover) often offer 4–5% APY during periods of higher interest rates. On a $5,000 balance:

- Big bank savings (0.01% APY): earns $0.50/year
- HYSA (4.5% APY): earns $225/year

That's a $224.50/year difference for the same money — just by choosing the right account.

## The Checking-Savings Partnership

The most effective setup is two accounts working together:

1. **Checking:** Receives your paycheck. Pays all bills.
2. **Savings (HYSA):** Receives your savings transfer on payday. Earns interest. Not touched unless needed.

On payday, immediately transfer your savings amount (e.g., $200) to your HYSA before spending anything. This is "paying yourself first" — the core habit of every financially stable person.

## Debit Cards: Spending Your Own Money

A debit card is linked directly to your checking account. Every purchase immediately reduces your balance. It looks and works like a credit card (Visa/Mastercard logo, same card reader), but it's spending money you already have.

**Advantages of debit cards:**
- No risk of going into debt from overspending (once balance hits zero, card declines)
- No interest charges
- No credit history required

**Disadvantages vs. credit cards:**
- Less purchase protection (disputed charges are harder to reverse)
- No rewards (cashback, points)
- Fraud can drain your actual bank account while you dispute it

**Debit vs. credit — which to use day-to-day?**
If you pay your full credit card balance every month, credit cards are strictly better (rewards, protection, credit history building). If you tend to overspend on credit, debit cards are a safer choice.

## Routing Numbers and Account Numbers

Every bank account has two identifying numbers:

- **Routing number:** 9-digit number identifying your bank (same for everyone at that bank)
- **Account number:** Your unique account identifier

You need these for direct deposit setup, wire transfers, and linking payment services (Venmo, PayPal, Zelle).

## Key Takeaway

Checking accounts handle daily cash flow. Savings accounts (especially high-yield) hold and grow your non-spending money. Debit cards spend directly from checking. Together, these three tools form the foundation of a working financial system.`,
  quiz_questions: [
    {
      question: "What is the main advantage of a High-Yield Savings Account (HYSA) over a traditional savings account?",
      options: [
        "You can make unlimited daily withdrawals",
        "It offers significantly higher APY — often 10–100x more interest on your balance",
        "It is not insured, so it takes on more risk",
        "It requires no minimum balance at any bank"
      ],
      correct_answer: 1,
      explanation: "HYSAs at online banks often offer 4–5% APY vs. 0.01–0.5% at big banks. On a $5,000 balance, that's the difference between earning $0.50/year and $225/year."
    },
    {
      question: "What is the 'pay yourself first' principle in banking?",
      options: [
        "Paying your credit card before other bills",
        "Immediately transferring your savings amount to a savings account on payday, before spending anything else",
        "Paying yourself a salary from your business",
        "Keeping all money in checking for easy access"
      ],
      correct_answer: 1,
      explanation: "Pay yourself first means treating savings like the first bill you pay. Transfer your target savings amount immediately on payday before other spending occurs."
    },
    {
      question: "How does a debit card differ from a credit card?",
      options: [
        "Debit cards build credit history; credit cards don't",
        "Debit cards pull money directly from your checking account; credit cards let you borrow money",
        "They are functionally identical",
        "Credit cards require a PIN; debit cards use signatures only"
      ],
      correct_answer: 1,
      explanation: "A debit card immediately reduces your checking account balance. A credit card lets you borrow up to your credit limit, creating a balance you pay back later."
    }
  ]
});

update("lesson-bank-003", {
  duration_minutes: 9,
  xp_reward: 80,
  content: `## Online Banking and Mobile Apps

In 2025, the vast majority of personal banking happens on a phone, not in a branch. Whether you use a traditional bank or an online-only institution, the mobile app is your primary financial interface. Knowing how to use it fully — and safely — is a core skill.

## What You Can Do From Your Phone

Modern banking apps have largely replaced the need to visit a branch for routine tasks:

| Task | Mobile App | Branch Needed? |
|---|---|---|
| Check balances and transactions | ✅ | No |
| Transfer between accounts | ✅ | No |
| Pay bills (one-time or auto-pay) | ✅ | No |
| Deposit checks (mobile deposit) | ✅ | No |
| Send money (Zelle, ACH) | ✅ | No |
| Lock/unlock a lost card | ✅ | No |
| Dispute a transaction | ✅ | Rarely |
| Open a new account | ✅ | Sometimes |
| Apply for a loan | ✅ | Sometimes |
| Get notarization | ❌ | Yes |
| Resolve complex disputes | ❌ | Preferred |

## Mobile Check Deposit: How It Works

Mobile check deposit lets you deposit a paper check using your phone's camera. Steps:
1. Sign the back of the check (endorse it)
2. Open your banking app → Deposit → Mobile Check
3. Photograph front and back of the check
4. Enter the amount and confirm

**Important:** Most banks hold mobile deposits for 1–3 business days. Large deposits (over $5,000) often take longer. Don't spend the money until the deposit clears.

After depositing, write "MOBILE DEPOSITED [date]" on the check and keep it for 30 days, then shred it.

## Zelle, Venmo, and Digital Payments

**Zelle** is built into most major bank apps and transfers money directly between bank accounts — usually within minutes. It's free, fast, and secure *between people you know and trust.*

**Warning:** Zelle transfers are final. Unlike credit card chargebacks, you generally cannot reverse a Zelle payment. Only send money to people you know personally.

**Venmo and Cash App** work similarly but are separate apps. They hold a balance within the app. For maximum security, transfer balances to your bank account rather than leaving money in these apps.

## Setting Up Account Alerts

One of the most valuable (and underused) banking features is **push notifications and alerts:**

- Low balance alert (e.g., when balance drops below $200)
- Large transaction alert (e.g., any charge over $100)
- Failed payment alert
- New payee added
- Login from new device

These alerts let you catch unauthorized charges within minutes rather than discovering them weeks later on a statement.

**To set up:** Bank app → Settings → Alerts or Notifications → Configure thresholds.

## Online Bill Pay

Most bank apps include bill pay: you enter a payee's name and account number, and the bank sends payment either electronically or via paper check. You control timing.

Advantages over manual payments:
- One login for all bills
- No late fees if set to auto-pay
- Payment history is tracked in one place

**Auto-pay strategies:**
- Set essential bills (rent, utilities, insurance, loan minimums) to auto-pay
- Review each auto-pay monthly to catch amount changes or services you no longer use

## Logging Into Banking Safely

- Always use your bank's **official app from the App Store or Google Play** — not third-party links
- Enable **two-factor authentication (2FA)** — requires a code from your phone in addition to your password
- Never enter banking credentials on a link sent via text or email (phishing)
- Use a unique password for your bank that you don't use anywhere else
- Log out after banking on shared devices

## Key Takeaway

Your banking app is your most powerful financial tool. Set up balance alerts, use mobile deposit, and enable auto-pay for essentials — but always prioritize security with 2FA and official apps only.`,
  quiz_questions: [
    {
      question: "You receive a text message with a link to 'verify your account' that looks like it's from your bank. What should you do?",
      options: [
        "Click the link and enter your credentials to verify",
        "Do not click the link — log into your bank directly through the official app or website",
        "Reply to the text with your account number",
        "Call the number in the text message"
      ],
      correct_answer: 1,
      explanation: "This is a classic phishing attempt. Banks never ask you to verify credentials via text link. Always go directly to your bank's app or official website."
    },
    {
      question: "Why should you set up low balance alerts on your checking account?",
      options: [
        "To get a higher credit score",
        "To be notified when you're close to overdrafting so you can act before fees hit",
        "To earn higher interest rates",
        "Banks require it"
      ],
      correct_answer: 1,
      explanation: "Low balance alerts give you time to transfer funds or stop spending before your balance hits zero and triggers an overdraft fee ($25–$35 per incident)."
    },
    {
      question: "After depositing a check via mobile app, you should:",
      options: [
        "Immediately shred the check",
        "Wait for the deposit to fully clear before spending, and keep the check for ~30 days",
        "Deposit the same check at an ATM as well for faster processing",
        "Call the bank to confirm every mobile deposit"
      ],
      correct_answer: 1,
      explanation: "Mobile deposits typically take 1–3 business days to clear. Keep the check for 30 days after it clears in case of any disputes, then shred it securely."
    },
    {
      question: "Zelle transfers are best used for:",
      options: [
        "Paying unknown online sellers for goods",
        "Sending money to people you know and trust — they are generally irreversible",
        "International wire transfers",
        "Purchasing items from marketplaces like eBay"
      ],
      correct_answer: 1,
      explanation: "Zelle transfers are instant and typically irreversible. Only use Zelle with people you know personally — scammers frequently use Zelle because victims cannot easily recover funds."
    }
  ]
});

update("lesson-bank-004", {
  duration_minutes: 9,
  xp_reward: 80,
  content: `## Protecting Your Money from Fees and Fraud

Knowing how to use a bank is only half the skill. The other half is keeping your money protected — from fees that quietly drain your account and from fraud that can devastate your finances. Both are preventable with the right knowledge.

## Common Bank Fees (and How to Avoid Them)

**Monthly Maintenance Fees**
Many traditional banks charge $12–$25/month just to maintain your checking account, unless you meet certain requirements (minimum balance, monthly direct deposit, minimum number of transactions).

*Avoidance:* Choose an online bank or credit union with no monthly fees. Or confirm the requirements for fee waiver and meet them.

**Overdraft Fees**
If you spend more than your checking balance, the bank may cover the transaction and charge an overdraft fee of $25–$35 per incident. Multiple overdrafts in one day = multiple fees.

*Avoidance:*
- Keep a $200–$300 buffer in checking
- Set up low balance alerts
- Link a savings account as overdraft protection
- Choose a bank that doesn't charge overdraft fees (many neobanks like Chime)

**ATM Fees**
Using an ATM outside your bank's network typically costs $2.50–$5 per withdrawal — charged by your bank AND the ATM owner (double fee).

*Avoidance:* Use in-network ATMs. Choose a bank that reimburses ATM fees (common among online banks). Use cash-back at grocery stores.

**Minimum Balance Fees**
Some savings accounts charge fees if your balance drops below a minimum ($300–$1,000 depending on the account).

*Avoidance:* Read account terms before opening. Choose fee-free options.

**Wire Transfer Fees**
Domestic wire transfers: $15–$30. International: $25–$50.

*Avoidance:* Use Zelle or ACH transfers for domestic payments — both are free.

## Debit Card Fraud: What to Know

Debit card fraud occurs when someone gets your card number and uses it to make purchases. Unlike credit card fraud, debit fraud comes directly out of your bank account.

**Your rights:**
- Report within 2 business days → liability limited to $50
- Report within 2–60 days → liability up to $500
- Report after 60 days → you could lose everything

**Practical protection:**
- Enable transaction alerts for every debit card purchase
- Monitor your account weekly (or use the app daily)
- Report unfamiliar charges immediately
- Consider using a credit card for purchases (better fraud protection) and a debit card only for ATM cash

## Phishing and Social Engineering

Fraud doesn't only come from stolen card numbers. Social engineering tricks are common:

**Impersonation scams:** Someone calls claiming to be from your bank's fraud department. They say your account has been compromised and ask you to verify your account number, password, or transfer money to a "safe account."

**Rule:** Your real bank will never ask for your password, PIN, or tell you to transfer money to protect it. Hang up and call the number on the back of your card.

**Email phishing:** Fake emails with urgent subject lines ("Your account will be closed unless you verify...") link to fake login pages that steal your credentials.

**Rule:** Never click banking links from emails. Always go directly to the bank's app or website.

## What to Do If Your Account Is Compromised

1. **Immediately** log into your banking app and lock your debit card
2. Call the number on the back of your card
3. File a fraud report with your bank
4. Change your online banking password
5. Review all recent transactions and flag anything you don't recognize
6. If credentials were stolen, consider a credit freeze (protects you from new account fraud)

## Key Takeaway

Most bank fees are avoidable with the right account choices. Most fraud is preventable with good habits: alerts, monitoring, strong passwords, and never sharing credentials. Being proactive costs nothing — being reactive after fraud can cost everything.`,
  quiz_questions: [
    {
      question: "Your bank calls and says your account is compromised. They ask you to verify your PIN and transfer funds to a 'safe account' they'll set up. What should you do?",
      options: [
        "Comply — the bank is trying to protect you",
        "Ask for their employee ID and then comply",
        "Hang up and call the number on the back of your bank card directly",
        "Transfer to the safe account then report it later"
      ],
      correct_answer: 2,
      explanation: "This is a classic bank impersonation scam. Real banks never ask for your PIN or tell you to transfer money. Hang up and call the official number on your card."
    },
    {
      question: "What is the most effective way to avoid overdraft fees?",
      options: [
        "Opt into overdraft protection to ensure all transactions go through",
        "Keep a cash buffer in checking, set low balance alerts, and choose a bank with no overdraft fees",
        "Only use cash — never use your debit card",
        "Overdraft fees are unavoidable"
      ],
      correct_answer: 1,
      explanation: "Combining a cash buffer, balance alerts, and choosing a no-overdraft-fee bank (many neobanks) eliminates this fee category entirely."
    },
    {
      question: "If you notice unauthorized charges on your debit card, what is the most important factor for limiting your liability?",
      options: [
        "The amount of the unauthorized charge",
        "How quickly you report it — reporting within 2 days limits liability to $50",
        "Whether you have overdraft protection",
        "Your credit score"
      ],
      correct_answer: 1,
      explanation: "Federal law limits debit card fraud liability based on timing: report within 2 business days = max $50 liability. After 60 days = potentially unlimited liability."
    }
  ]
});

update("lesson-bank-005", {
  duration_minutes: 9,
  xp_reward: 85,
  content: `## Interest Rates: Earning vs. Paying

Interest is money that grows on other money. It works in two directions: when you save, the bank pays you interest. When you borrow, you pay the bank interest. Understanding both sides of this equation — and the math behind it — is one of the most financially valuable things you can learn.

## APY vs. APR: The Two Rates You'll See Everywhere

**APY (Annual Percentage Yield)** — used for savings accounts
APY is the effective annual rate you *earn* on deposits, including the effect of compounding. The higher the APY, the more your savings grow.

**APR (Annual Percentage Rate)** — used for loans and credit cards
APR is the annual cost of borrowing money. The higher the APR, the more you pay in interest. It does not always account for compounding — which is why credit card debt grows faster than the APR implies.

## Savings Interest: What It Looks Like in Practice

Example: You deposit $5,000 in a savings account.

| Account Type | APY | Annual Earnings | 5-Year Earnings |
|---|---|---|---|
| Big bank savings | 0.01% | $0.50 | $2.50 |
| Average bank | 0.50% | $25 | $126 |
| High-yield online bank | 4.50% | $225 | $1,243 |

That $5,000 doesn't move. The only difference is where you keep it. Over 5 years, the HYSA earns $1,243 vs. $2.50 at a big bank — a difference of over $1,240 for the exact same money.

## Loan Interest: What It Actually Costs You

When you borrow money, you pay interest on the outstanding balance. The same compounding math that works *for* you in savings works *against* you in debt.

**Example: $3,000 credit card balance at 22% APR**

If you only make the minimum payment (~$65/month):
- Time to pay off: 6+ years
- Total interest paid: ~$2,400
- Total cost: $5,400 for $3,000 of purchases

If you pay $200/month:
- Time to pay off: 17 months
- Total interest paid: ~$540
- Total cost: $3,540

The minimum payment math is how banks make money. Paying significantly more than the minimum is how you avoid it.

## How Compound Interest Works

**Simple interest:** You earn interest only on your original deposit (principal).
**Compound interest:** You earn interest on your principal *and* on the interest you've already earned.

Example: $1,000 at 5% annual interest

| Year | Simple Interest | Compound Interest |
|---|---|---|
| 1 | $1,050 | $1,050 |
| 5 | $1,250 | $1,276 |
| 10 | $1,500 | $1,629 |
| 20 | $2,000 | $2,653 |
| 30 | $2,500 | $4,322 |

At 30 years, compound interest produces $1,822 more than simple interest — from the same starting $1,000. This gap grows exponentially the longer the time horizon.

## Rate Environments: Why Rates Change

Interest rates don't stay the same forever. The Federal Reserve sets the federal funds rate, which influences all other interest rates in the economy:

- **When rates rise** (like 2022–2024): savings accounts pay more, loans cost more
- **When rates fall** (like 2020–2021): savings accounts pay very little, borrowing is cheaper

This means the 4.5% APY at online banks in 2024 might be 1–2% in a lower-rate environment. Lock in high-rate CDs when rates are elevated if you have money you won't need for 6–24 months.

## Key Takeaway

Interest compounds over time — in your favor when you save, against you when you carry debt. Every month you delay moving money to a high-yield account is a month of interest earnings you're leaving behind. Every month you carry high-interest debt is money you're giving away.`,
  quiz_questions: [
    {
      question: "What is the key difference between APY and APR?",
      options: [
        "APY is for borrowing; APR is for saving",
        "APY measures what you EARN on savings (including compounding); APR measures what you PAY to borrow",
        "They are the same calculation",
        "APR is always higher than APY for the same rate"
      ],
      correct_answer: 1,
      explanation: "APY (Annual Percentage Yield) is used for deposit accounts and reflects compounding earnings. APR (Annual Percentage Rate) is used for loans and credit cards and reflects the cost of borrowing."
    },
    {
      question: "On a $3,000 credit card balance at 22% APR, paying only the minimum payment will result in:",
      options: [
        "The debt being cleared in 12 months",
        "No interest charges if you pay on time",
        "Years of repayment and roughly $2,400 in total interest — nearly doubling the original debt",
        "A lower interest rate over time"
      ],
      correct_answer: 2,
      explanation: "Minimum payments on high-APR credit cards extend repayment for years and can result in paying as much in interest as the original balance. Paying significantly more than the minimum is critical."
    },
    {
      question: "Why does compound interest produce dramatically more growth over long time periods compared to simple interest?",
      options: [
        "Compound interest has a higher initial rate",
        "Compound interest earns returns on both the principal AND on previously earned interest — creating exponential growth",
        "Simple interest stops after 10 years",
        "Banks charge compound interest differently"
      ],
      correct_answer: 1,
      explanation: "Compound interest earns returns on your accumulated interest, not just the original deposit. This creates a snowball effect that accelerates dramatically over decades."
    }
  ]
});

// ─── WRITE OUTPUT ─────────────────────────────────────────────────────────────

fs.writeFileSync(LESSONS_PATH, JSON.stringify(lessons, null, 2));
console.log("✅ Part 1 complete — Budgeting (6 lessons) + Banking (5 lessons) updated");
console.log("   Total lessons in file:", lessons.length);

// Also update dist/ if it exists
if (fs.existsSync(DIST_LESSONS)) {
  fs.writeFileSync(DIST_LESSONS, JSON.stringify(lessons, null, 2));
  console.log("✅ dist/data/lessons.json also updated");
}
