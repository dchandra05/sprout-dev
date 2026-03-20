// Part 3a: NEW lessons for Budgeting (4 new) and Banking (3 new)
const fs = require("fs");
const LESSONS_PATH = "public/data/lessons.json";
const DIST_LESSONS = "dist/data/lessons.json";
const lessons = JSON.parse(fs.readFileSync(LESSONS_PATH, "utf8"));

const newLessons = [
  // ── BUDGETING: 4 new lessons (orders 7-10) ────────────────────────────────
  {
    id: "lesson-bud-007",
    course_id: "course-budgeting-001",
    title: "The 50/30/20 Rule: A Practical Framework",
    order: 7,
    duration_minutes: 8,
    xp_reward: 75,
    is_sample: false,
    created_date: "2026-03-20T00:00:00.000Z",
    updated_date: "2026-03-20T00:00:00.000Z",
    content: `## The 50/30/20 Rule

The 50/30/20 rule is one of the most popular personal budgeting frameworks because it's simple, flexible, and works across a wide range of incomes. It was popularized by Senator Elizabeth Warren in her book "All Your Worth" and divides your after-tax income into three broad categories.

**50% → Needs**
**30% → Wants**
**20% → Savings and Debt Repayment**

Unlike granular line-item budgets, the 50/30/20 rule works with buckets — broad categories that are easier to manage and less likely to cause budget fatigue.

## What Counts as a "Need" (50%)

Needs are expenses required for basic living. You can't easily eliminate them in the short term.

- Housing (rent or mortgage)
- Utilities (electricity, gas, water, internet)
- Groceries (basic food — not dining out)
- Transportation (car payment, insurance, gas, or transit pass)
- Minimum debt payments (student loans, credit cards)
- Basic insurance (health, renters/homeowners)
- Childcare / essential medical

**The key test:** If you lost your job tomorrow, could you cut this expense within 30 days? If no, it's probably a need.

**Warning:** Many people classify wants as needs. Netflix, gym memberships, eating lunch out daily — these are wants.

## What Counts as a "Want" (30%)

Wants are things that improve your life but aren't essential for survival.

- Dining out and takeaway
- Entertainment (streaming, concerts, movies)
- Clothing beyond basics
- Gym memberships
- Hobbies
- Travel and vacations
- Upgrading to a nicer apartment when a basic one would do

The 30% wants category is where most people overspend — and where there's the most room to cut without dramatically affecting quality of life.

## What Counts as Savings/Debt (20%)

This is the wealth-building category.

- Emergency fund contributions
- Retirement savings (401k, IRA)
- Extra debt payments (above minimums)
- Saving for specific goals (down payment, car, education)
- Investing

This 20% is what separates people who build wealth from those who perpetually live paycheck to paycheck.

## Applying 50/30/20 at Different Income Levels

**$2,500/month take-home:**
- Needs: $1,250
- Wants: $750
- Savings/Debt: $500

**$4,000/month take-home:**
- Needs: $2,000
- Wants: $1,200
- Savings/Debt: $800

**$6,000/month take-home:**
- Needs: $3,000
- Wants: $1,800
- Savings/Debt: $1,200

## When the 50/30/20 Rule Doesn't Fit

The rule is a starting point, not a law. Some situations require adjustments:

**High cost-of-living cities:** Rent alone may consume 40–50% of income. In San Francisco or NYC, needs above 50% is normal — cut the wants category, not the savings.

**High debt loads:** If you have significant student loans or credit card debt, temporarily shift 30/30/20 or even 40/20/20 toward debt payoff.

**Very low income:** When income barely covers needs, focus on reducing expenses aggressively and increasing income before worrying about the percentages.

**High earners:** At high incomes, 50/30/20 may allow too much in wants. Consider 50/20/30 (flip wants and savings) to build wealth faster.

## Key Takeaway

The 50/30/20 rule is a flexible starting point for anyone beginning to budget. The most important number is 20% — consistently directing at least one-fifth of your income toward savings and debt creates a foundation for long-term financial security.`,
    quiz_questions: [
      {
        question: "In the 50/30/20 rule, which category does your Netflix subscription fall into?",
        options: ["Needs — it's a utility", "Wants — entertainment you choose but don't require", "Savings", "Debt repayment"],
        correct_answer: 1,
        explanation: "Streaming services, dining out, gym memberships, and entertainment are 'wants' — they improve your life but aren't required for basic living."
      },
      {
        question: "You live in a high cost-of-living city where rent alone is 45% of your take-home pay. What should you adjust?",
        options: [
          "Reduce your savings category to 5%",
          "Cut from the wants category — keep savings at 20% and accept needs above 50%",
          "Move to a cheaper city immediately",
          "The 50/30/20 rule doesn't apply to renters"
        ],
        correct_answer: 1,
        explanation: "High housing costs are a reality in many cities. The priority is protecting the 20% savings/debt category. Cut discretionary wants spending rather than compromising your financial future."
      },
      {
        question: "Under 50/30/20, on a $3,500/month take-home income, your savings/debt category should be at least:",
        options: ["$350", "$700", "$1,050", "$1,750"],
        correct_answer: 1,
        explanation: "20% of $3,500 = $700. This includes emergency fund contributions, retirement savings, extra debt payments, and goal-based saving."
      }
    ]
  },
  {
    id: "lesson-bud-008",
    course_id: "course-budgeting-001",
    title: "Variable Income Budgeting",
    order: 8,
    duration_minutes: 9,
    xp_reward: 80,
    is_sample: false,
    created_date: "2026-03-20T00:00:00.000Z",
    updated_date: "2026-03-20T00:00:00.000Z",
    content: `## Budgeting on a Variable Income

Traditional budgeting advice assumes a stable, predictable paycheck. But millions of people — freelancers, gig workers, servers, commission-based salespeople, seasonal workers, and side hustlers — don't have that predictability. This lesson covers the techniques that work when your income changes every month.

## Why Variable Income Makes Budgeting Harder

With a fixed salary, budgeting is straightforward: income is known, expenses are planned. With variable income, you face two challenges:

1. **You don't know exactly what's coming in** — planning is inherently uncertain
2. **High-earning months feel abundant** — it's tempting to spend freely, leaving you unprepared for low months

The most common mistake people with variable income make: spending like it's always a high month.

## Step 1: Calculate Your Baseline Income

Look at your income for the past 12 months. Find the **lowest month** or the **average of your lowest 3 months**. This is your conservative income estimate — the floor you can budget from with confidence.

**Example (freelance designer):**
- January: $2,800
- February: $1,900
- March: $3,400
- April: $2,200
- May: $4,100
- June: $2,600

Lowest month: $1,900
Average of 3 lowest: ~$2,233

**Budget from $2,200/month.** This is your baseline. If you earn more, that excess goes directly to savings and income buffer.

## Step 2: Build an Income Buffer Account

Create a separate account (a dedicated savings account) called your **Income Buffer** or **Paycheck Smoothing Account**.

How it works:
- In high-earning months, excess income goes into the buffer
- In low-earning months, you draw from the buffer to make up the difference
- Goal: maintain 1–3 months of expenses in this buffer

This account converts your variable income into a stable "paycheck" you pay yourself each month — eliminating the feast-or-famine psychology.

## Step 3: Tiered Spending System

Instead of one budget, create three tiers based on income level:

**Tier 1 (Survival Budget) — Low-income month**
Cover only essentials: housing, utilities, food, transportation, minimum debt payments.
Example: $2,200/month

**Tier 2 (Standard Budget) — Normal month**
Add discretionary spending: dining, entertainment, clothing, personal.
Example: $2,800–$3,200/month

**Tier 3 (Abundance Budget) — High-income month**
Extra goes to savings, debt payoff, investments, or goals.
Example: $3,500+/month

Pre-decide your tiers before the money arrives. When a big check comes in, having a written plan prevents it from disappearing into lifestyle spending.

## Step 4: Pay Essential Bills First

On any income that comes in, immediately route money in this order:
1. **Monthly essential expenses** (rent, utilities, insurance, minimums)
2. **Income buffer top-up** (if below target)
3. **Savings goals**
4. **Discretionary spending** with whatever remains

## Handling Irregular Payment Timing

Freelancers and gig workers often face gaps between work completed and payment received. Strategies:

- **Invoice early and follow up** — send invoices immediately, set 14-day payment terms
- **Keep 2+ months of expenses liquid** — never let your checking account drop below this
- **Diversify income sources** — multiple clients or platforms reduce the impact of any one client being slow
- **Avoid lifestyle commitments that require peak income** — a car payment or rent that requires your best months to cover leaves no margin

## Taxes: The Freelancer's Hidden Expense

Unlike salaried employees, variable income earners typically don't have taxes automatically withheld. **Set aside 25–30% of every payment for taxes** into a separate tax savings account.

Estimated quarterly tax payments are due in April, June, September, and January. Failing to pay quarterly can result in penalties.

## Key Takeaway

Variable income budgeting requires building a buffer, budgeting from your floor (not your ceiling), and creating tiered spending plans. The goal is to smooth out the income peaks and valleys so your financial life is stable regardless of what any individual month brings.`,
    quiz_questions: [
      {
        question: "A freelancer earns between $1,800 and $5,000/month. What income figure should they base their monthly budget on?",
        options: [
          "The highest month ($5,000) to plan for growth",
          "The average of all months",
          "The lowest months — budget conservatively and treat excess as savings",
          "Exactly $3,000 as a midpoint"
        ],
        correct_answer: 2,
        explanation: "Budgeting from your income floor prevents overspending in good months and ensures you can always cover essentials. Excess from high months builds your buffer for lean months."
      },
      {
        question: "What is the purpose of an 'income buffer account' for variable earners?",
        options: [
          "To earn higher interest than a checking account",
          "To smooth income by depositing excess in high months and withdrawing in low months — creating a stable effective paycheck",
          "To avoid paying taxes on freelance income",
          "To qualify for a larger mortgage"
        ],
        correct_answer: 1,
        explanation: "An income buffer converts irregular income into a stable monthly 'paycheck.' In high months, excess goes in. In low months, you draw from it. Target 1–3 months of expenses in this account."
      },
      {
        question: "Self-employed and freelance workers should set aside approximately what percentage of income for taxes?",
        options: ["5–10%", "15–20%", "25–30%", "40–50%"],
        correct_answer: 2,
        explanation: "Self-employed workers pay both the employee and employer portions of FICA (15.3%), plus federal and state income tax. Setting aside 25–30% of gross income covers most tax obligations without surprises."
      }
    ]
  },
  {
    id: "lesson-bud-009",
    course_id: "course-budgeting-001",
    title: "Common Budgeting Mistakes (and How to Avoid Them)",
    order: 9,
    duration_minutes: 8,
    xp_reward: 75,
    is_sample: false,
    created_date: "2026-03-20T00:00:00.000Z",
    updated_date: "2026-03-20T00:00:00.000Z",
    content: `## Common Budgeting Mistakes

Even well-intentioned budgeters make predictable mistakes. Understanding these pitfalls in advance dramatically increases your chance of actually sticking to a budget long-term.

## Mistake 1: Budgeting from Gross Pay Instead of Net Pay

**What happens:** You earn $60,000/year = $5,000/month, and budget assuming $5,000 is available. But after taxes, FICA, and benefits, you take home $3,600.

You plan a budget with $5,000 of income and $4,200 of expenses — and wonder why you're constantly short.

**The fix:** Always, always budget from your net (take-home) pay. Look at your actual paycheck, not your salary.

## Mistake 2: Forgetting Irregular Expenses

Most people budget for monthly bills but forget about irregular annual or semi-annual costs that hit like a truck:

- Car registration ($150–$400)
- Holiday gifts ($300–$800)
- Annual insurance premiums
- Yearly subscriptions (Amazon Prime, software)
- Car maintenance (oil changes, tires)
- Medical/dental copays

**The fix:** Write down every irregular expense you can think of. Add them all up. Divide by 12. Add that as a monthly "sinking fund" line item.

Example: $1,200 in annual irregular expenses ÷ 12 = **$100/month** put into a dedicated sinking fund savings category.

## Mistake 3: Building an Unrealistically Strict Budget

A budget that allows zero fun will last two weeks before you abandon it in frustration. Humans aren't robots — willpower is finite.

**Signs your budget is too strict:**
- You feel deprived constantly
- You're tracking every single dollar of a $5 coffee
- You have zero entertainment or dining budget
- You fail to stick to it within the first month

**The fix:** Include a reasonable wants/entertainment category. Allow yourself something enjoyable. A budget that's 80% followed consistently is infinitely better than a perfect budget abandoned after two weeks.

## Mistake 4: Not Tracking — Just Budgeting

Writing down a budget takes 30 minutes. That budget means nothing if you never look at it again. Tracking is what makes a budget real.

**The fix:** Check in at least weekly. Many people do a quick 5-minute review every Sunday — what did I spend this week, how does it compare to my plan?

## Mistake 5: Treating a Budget Surplus as "Extra Spending Money"

You're $300 under budget at month-end. Many people interpret this as permission to spend it. Instead, it should immediately go toward:
- Emergency fund (if not at target)
- Extra debt payment
- Savings goal acceleration
- Next month's buffer

**The fix:** Decide in advance what happens to budget surpluses. Pre-commit: "Any money left over at month end automatically transfers to my emergency fund."

## Mistake 6: Ignoring Small Recurring Costs

Individual small costs feel harmless. Collectively, they're significant.

| Small Expense | Monthly | Annual |
|---|---|---|
| Daily coffee ($5/day) | $150 | $1,825 |
| Unused gym membership | $40 | $480 |
| Streaming you rarely use | $15 | $180 |
| Unused app subscriptions | $25 | $300 |
| **Total** | **$230** | **$2,785** |

$2,785/year is a solid emergency fund or a significant contribution to a vacation or investment account.

**The fix:** Every 3 months, audit every recurring charge. Cancel anything you haven't actively used.

## Mistake 7: Not Having a "Miscellaneous" Category

Real life doesn't fit perfectly into categories. There will always be one-off expenses that don't belong anywhere.

**The fix:** Add a Miscellaneous category ($50–$100/month). This absorbs small unexpected costs without derailing the rest of your budget.

## Key Takeaway

Budgeting is a skill developed over time, not a perfect system deployed once. Most people fail at their first few attempts. The goal is to iterate: make a budget, track it, notice the mistakes, adjust, and try again. The people who succeed with budgets aren't the ones who never make mistakes — they're the ones who keep going after they do.`,
    quiz_questions: [
      {
        question: "You earn $52,000/year gross but take home $3,400/month. Which number should your budget be based on?",
        options: [
          "$4,333/month (the gross monthly amount)",
          "$3,400/month — your actual take-home pay is the only money available to spend",
          "$4,000 as a rough midpoint",
          "Your gross pay minus only federal income tax"
        ],
        correct_answer: 1,
        explanation: "Gross pay includes taxes and deductions that never touch your bank account. A budget must be based on net pay — what you actually receive."
      },
      {
        question: "The best approach to handling annual irregular expenses (car registration, holiday gifts) in a monthly budget is:",
        options: [
          "Ignore them until they arrive, then use a credit card",
          "Only budget for monthly recurring expenses",
          "Add up all annual irregular costs, divide by 12, and save that amount monthly in a sinking fund",
          "Budget double in December to cover year-end expenses"
        ],
        correct_answer: 2,
        explanation: "Sinking funds convert large annual expenses into small, predictable monthly contributions. When the expense arrives, you have the cash ready and it doesn't disrupt your budget."
      },
      {
        question: "You end the month $250 under budget. What is the most financially sound action?",
        options: [
          "Treat it as spending money you earned through good behavior",
          "Pre-commit to automatically transferring budget surpluses to savings, emergency fund, or debt payoff",
          "Carry it forward as next month's extra spending",
          "Report it to your bank"
        ],
        correct_answer: 1,
        explanation: "Pre-committing the destination of surpluses removes the temptation to spend them. A written rule ('surplus goes to emergency fund') converts budget wins into real financial progress."
      }
    ]
  },
  {
    id: "lesson-bud-010",
    course_id: "course-budgeting-001",
    title: "Budgeting Tools: Apps, Spreadsheets, and Systems",
    order: 10,
    duration_minutes: 8,
    xp_reward: 80,
    is_sample: false,
    created_date: "2026-03-20T00:00:00.000Z",
    updated_date: "2026-03-20T00:00:00.000Z",
    content: `## Budgeting Tools and Systems

The best budgeting system is the one you'll actually use. There's no single right answer — different tools fit different personalities and lifestyles. This lesson walks through the major options so you can choose the right fit.

## Option 1: Budgeting Apps (Best for Most People)

Modern budgeting apps connect to your bank accounts and automatically import and categorize transactions, making tracking nearly effortless.

**YNAB (You Need a Budget)**
Philosophy: Zero-based budgeting — every dollar gets a job.
Best for: People serious about budgeting who want a complete system.
Cost: ~$14/month or $99/year (free for college students)
Key feature: Forward-looking — you budget money you have now for future expenses

**Monarch Money**
Philosophy: Clean, modern interface with partner/household sharing.
Best for: Couples and people who want a clean dashboard.
Cost: ~$14/month

**Copilot (iOS only)**
Philosophy: Smart AI categorization with beautiful design.
Best for: iPhone users who want minimal effort.
Cost: ~$13/month

**EveryDollar**
Philosophy: Simple zero-based budgeting without automatic import (free tier).
Best for: Beginners who want simplicity.
Cost: Free (manual) or ~$17/month (auto-import)

**Mint (Legacy) / Credit Karma**
Free options with basic budgeting features. Less sophisticated but no cost.

## Option 2: Spreadsheets (Best for Control Freaks)

A well-built spreadsheet gives you complete control and costs nothing. Google Sheets has free budget templates built-in (File → New → Template Gallery → Budget).

**When spreadsheets work best:**
- You want to design your own categories
- You enjoy seeing all the numbers in one place
- You're comfortable with basic formulas
- Privacy matters — no third-party app access to bank data

**Recommended structure:**
- Sheet 1: Monthly budget (income, all categories, variance from plan)
- Sheet 2: Annual tracker (monthly summaries side by side)
- Sheet 3: Savings goals tracker

**Downside:** Requires manual entry or manual CSV import from your bank. Discipline to update it consistently is required.

## Option 3: The Cash Envelope System

Used for variable spending categories that are hardest to control (food, entertainment, clothing). Withdraw the budgeted cash amount at the start of the month. When the envelope is empty, spending in that category stops — no exceptions.

**Why it works:** Spending physical cash creates stronger psychological friction than swiping a card. Studies show people spend 10–30% less when using cash.

**Modern version:** Use separate prepaid debit cards or bank accounts as digital "envelopes" — one for food, one for entertainment, etc.

**Best for:** People who consistently overspend in specific categories despite good intentions.

## Option 4: The Anti-Budget (Pay Yourself First)

Created by financial writer Paula Pant. Simplest possible system:
1. Automate all savings and bill payments on payday
2. Spend whatever's left freely — no tracking required

**How it works:**
- Savings transfer: automatic
- All fixed bills: autopay
- The remainder: spend freely, no guilt, no categories

**Why it works:** By automating the important stuff first, you can't mess up. The "budget" enforces itself.

**Best for:** People who find detailed tracking exhausting but are disciplined enough to set appropriate savings amounts upfront.

## Choosing Your System

| You Are... | Try This |
|---|---|
| Detail-oriented, want full control | YNAB or spreadsheet |
| Busy, want automation | Monarch Money or Copilot |
| Partner/family budgeting | Monarch Money |
| Overspending on specific categories | Cash envelope |
| Want maximum simplicity | Anti-budget (pay yourself first) |
| Just starting out | EveryDollar (free) or Google Sheets |

## The Most Important Tool: A Monthly Review

Whatever system you use, a monthly budget review is non-negotiable. Spend 20–30 minutes at month end:
- Total income vs. plan
- Each category: under or over?
- What caused overruns?
- What needs to change next month?

**Key Takeaway:** Pick one system and commit to it for at least 3 months before switching. The tool matters far less than consistency. A $0 Google Sheet used religiously outperforms a $14/month app you open twice.`,
    quiz_questions: [
      {
        question: "The 'anti-budget' or 'pay yourself first' system works by:",
        options: [
          "Not saving anything and tracking all expenses manually",
          "Automating savings and fixed bill payments first, then spending the remainder freely without detailed tracking",
          "Setting a single total spending limit with no categories",
          "Using cash for all purchases"
        ],
        correct_answer: 1,
        explanation: "The anti-budget automates the critical stuff (savings, bills) on payday and lets you spend freely with whatever's left — no category tracking needed, yet savings goals are always met."
      },
      {
        question: "Research shows people spend 10–30% less in categories where they use cash envelopes vs. cards. Why?",
        options: [
          "Cash earns interest that reduces net spending",
          "Physically handling and counting cash creates stronger psychological friction, making each dollar feel more real",
          "Banks limit cash withdrawals to responsible amounts",
          "Credit cards charge fees that increase spending"
        ],
        correct_answer: 1,
        explanation: "Tangible cash feels more 'real' than abstract card swipes. The psychological friction of seeing your envelope thin out makes you more deliberate about each purchase."
      },
      {
        question: "You've tried three budgeting apps in the past year and abandoned each one. What is the most likely root issue?",
        options: [
          "Budgeting apps are ineffective",
          "Inconsistent execution — the tool isn't the problem; the habit of regular review and commitment is",
          "You need to earn more money before budgeting works",
          "Digital tools are inherently less effective than paper"
        ],
        correct_answer: 1,
        explanation: "The most common reason budgeting fails is not the tool — it's the lack of consistent execution. Any system used consistently for 3+ months will work better than the best system abandoned after two weeks."
      }
    ]
  },

  // ── BANKING: 3 new lessons (orders 6-8) ──────────────────────────────────
  {
    id: "lesson-bank-006",
    course_id: "course-banking-002",
    title: "How to Open a Bank Account",
    order: 6,
    duration_minutes: 7,
    xp_reward: 65,
    is_sample: false,
    created_date: "2026-03-20T00:00:00.000Z",
    updated_date: "2026-03-20T00:00:00.000Z",
    content: `## Opening Your First Bank Account

Opening a bank account is one of the most straightforward financial tasks — but many people don't know exactly what to expect or what to bring. This lesson walks you through the full process, what you need, and what to watch for.

## What You Need to Open a Bank Account

Most banks require:

**For identity verification:**
- Government-issued photo ID (driver's license, state ID, or passport)
- Social Security Number (SSN) or Individual Taxpayer Identification Number (ITIN)
- Date of birth

**For contact information:**
- Current address (physical address — P.O. boxes often not accepted alone)
- Phone number and email

**For funding:**
- Opening deposit (varies: $0 for most online banks and credit unions; $25–$100 for some traditional banks)

**If under 18:**
- A parent or legal guardian must be a joint account holder
- Both the minor and guardian provide ID

## ChexSystems: The Banking Credit Report

Before opening an account, many banks check **ChexSystems** — a reporting agency that tracks banking history, similar to a credit bureau but for bank accounts.

Negative ChexSystems records include:
- Unpaid overdraft fees
- Accounts closed for fraud
- Bounced checks left unpaid

If you have negative ChexSystems records, some banks will decline to open an account. Options:
- **Second-chance checking accounts** — designed for people with ChexSystems issues (Chime, Wells Fargo Opportunity Checking, etc.)
- **Prepaid debit cards** — not a true bank account but functional for most purposes

## Choosing Between In-Person and Online

**Opening in person (traditional bank/credit union):**
- Walk in with your documents
- A banker assists you with paperwork
- Account usually active same day
- Best if you want face-to-face guidance

**Opening online (online bank):**
- Complete an application at the bank's website or app (15–20 minutes)
- Upload photos of your ID
- Account typically active within 1–3 business days
- Instant-use virtual debit card available immediately at some banks

## What to Set Up Immediately After Opening

Once your account is open and funded, do these before you leave (or within the first week):

**1. Set up direct deposit**
Provide your employer's HR/payroll with your routing number and account number. Your paycheck will deposit directly — often 1–2 days earlier than a paper check.

**2. Download the mobile app**
Set up biometric login (fingerprint/face). Enable push notifications for transactions.

**3. Set up account alerts**
Configure: low balance threshold, large transaction notifications, new payee alerts.

**4. Order a debit card (if not already issued)**
Activate it when it arrives. Sign the back.

**5. Set up online bill pay**
Add at least your most critical monthly bills.

## What to Watch For on Your First Statement

Your first monthly statement will show:
- All transactions
- Interest earned (typically minimal on checking)
- Any fees charged

**Red flags to address immediately:**
- Monthly maintenance fee you expected to be waived
- Minimum balance fee
- Any transaction you don't recognize

## Key Takeaway

Opening a bank account requires ID, an SSN, and a small deposit at most institutions. Online banks are fastest and often fee-free. Set up direct deposit and mobile alerts immediately — these two steps alone prevent most day-to-day banking problems.`,
    quiz_questions: [
      {
        question: "What is ChexSystems and why does it matter when opening a bank account?",
        options: [
          "It's a credit score specifically for bank accounts — checked to evaluate creditworthiness",
          "It's a banking history report tracking unpaid overdrafts and closed accounts — negative records can cause banks to deny new account applications",
          "It's a government database of all bank balances",
          "It's a fee-tracking system banks use to calculate charges"
        ],
        correct_answer: 1,
        explanation: "ChexSystems tracks your banking history — unpaid overdrafts, fraud, bounced checks. A negative record can cause standard banks to deny your application, though second-chance accounts are available."
      },
      {
        question: "What is the most important action to take within the first week of opening a checking account?",
        options: [
          "Apply for a credit card at the same bank",
          "Set up direct deposit so your paycheck goes in automatically and configure transaction alerts",
          "Request a premium debit card with travel rewards",
          "Open a CD with the initial deposit for higher interest"
        ],
        correct_answer: 1,
        explanation: "Direct deposit ensures your paycheck arrives reliably (often 1–2 days early). Transaction alerts help you catch fraud and avoid overdrafts. These two steps are the highest-priority setup actions."
      }
    ]
  },
  {
    id: "lesson-bank-007",
    course_id: "course-banking-002",
    title: "Mobile Payments and Digital Wallets",
    order: 7,
    duration_minutes: 7,
    xp_reward: 65,
    is_sample: false,
    created_date: "2026-03-20T00:00:00.000Z",
    updated_date: "2026-03-20T00:00:00.000Z",
    content: `## Mobile Payments and Digital Wallets

Cash is increasingly rare. In 2025, most everyday transactions happen digitally — through apps, tap-to-pay phones, and peer-to-peer payment services. Understanding your options makes you faster, safer, and in more control of your money.

## Digital Wallets: Paying with Your Phone

A digital wallet stores your debit or credit card information securely on your phone, allowing you to pay by tapping your phone at checkout.

**Major digital wallets:**
- **Apple Pay** (iPhone users)
- **Google Pay** (Android users)
- **Samsung Pay** (Samsung devices)

**How they work:**
1. Add your debit or credit card to the wallet app
2. At checkout, hold your phone near the payment terminal
3. Authenticate with Face ID, fingerprint, or PIN
4. Payment completes in seconds

**Security advantage:** Digital wallets never transmit your actual card number. Instead, they use a unique token for each transaction — so even if the merchant's system is hacked, your real card number isn't exposed.

## Peer-to-Peer (P2P) Payment Apps

P2P apps let you send money directly to other people — splitting a dinner bill, paying rent to a roommate, or reimbursing a friend.

**Zelle**
- Built into most major bank apps
- Transfers directly between bank accounts
- Typically instant or within minutes
- Free
- **Cannot reverse payments** — only use with people you know

**Venmo**
- Popular among younger users
- Has a social feed (can be made private)
- Transfers to bank: instant for a fee, 1–3 days free
- Holds a balance in the app

**Cash App**
- Send money, receive money, buy stocks, buy crypto
- Instant transfers (for a fee) or 1–3 day free transfer
- Offers a Cash Card debit card

**PayPal**
- Original P2P platform, now mostly for business/purchases
- More buyer protection than Zelle/Venmo
- Widely accepted by online merchants

## Comparing P2P Apps: Key Differences

| Feature | Zelle | Venmo | Cash App |
|---|---|---|---|
| Transfer speed | Instant (usually) | 1–3 days (free) | 1–3 days (free) |
| Reversal possible | No | Limited | Limited |
| Bank balance required | Yes | No | No |
| Social feed | No | Yes (private option) | No |
| Business payments | Limited | Yes | Yes |

## Safety Rules for P2P Payments

**Rule 1: Zelle is final.** Unlike credit card purchases, Zelle payments cannot typically be reversed. Scammers use Zelle specifically because of this. Never send Zelle to someone you don't personally know.

**Rule 2: Don't leave large balances in apps.** Venmo, Cash App, and PayPal balances are not always FDIC insured or may be held differently than bank deposits. Transfer to your bank regularly.

**Rule 3: Use credit cards (through Apple/Google Pay) for purchases.** Credit cards have better fraud protection than debit cards. Using them through Apple Pay adds another security layer.

**Rule 4: Review privacy settings.** Venmo's transaction history is public by default. Change to private in settings.

## Buy Now, Pay Later at Checkout

Services like **Affirm**, **Klarna**, and **Afterpay** appear at checkout for many online stores. They split your purchase into installments (4 payments over 6 weeks, or monthly payments).

**When BNPL is okay:** Planned, necessary purchases you can definitely afford to repay on schedule. A laptop for school. Tires for your car.

**When BNPL is dangerous:** Impulse buys, fashion, food delivery, entertainment. If you couldn't afford it as a one-time payment, splitting it into 4 payments doesn't make it affordable — it delays the financial hit while potentially adding fees or interest.

## Key Takeaway

Digital wallets (Apple Pay, Google Pay) are safer than physical card swipes — use them. P2P apps are convenient but final — only use Zelle/Venmo with people you know. Leave BNPL for planned, necessary purchases only.`,
    quiz_questions: [
      {
        question: "Why are digital wallets (Apple Pay, Google Pay) more secure than swiping a physical card?",
        options: [
          "Digital wallets are backed by the government",
          "They use a unique transaction token instead of transmitting your actual card number — protecting your real card even if a merchant is hacked",
          "They require a PIN for every transaction",
          "They don't connect to your bank account"
        ],
        correct_answer: 1,
        explanation: "Digital wallets use tokenization — a unique code per transaction replaces your real card number. Even if a merchant's system is compromised, your actual card details aren't exposed."
      },
      {
        question: "A stranger online offers to buy something from you and wants to pay via Zelle. Why is this risky?",
        options: [
          "Zelle charges high fees for stranger transactions",
          "Zelle payments are typically irreversible — scammers use this to send fraudulent payments that get reversed after you ship goods, leaving you with nothing",
          "Zelle doesn't work for selling goods",
          "Strangers can access your bank account through Zelle"
        ],
        correct_answer: 1,
        explanation: "Zelle has no buyer/seller protection for goods purchases. Common scam: overpayment or fake payment, then reversal after you've shipped the item. Use PayPal Goods & Services for selling to strangers."
      }
    ]
  },
  {
    id: "lesson-bank-008",
    course_id: "course-banking-002",
    title: "Choosing the Right Bank for You",
    order: 8,
    duration_minutes: 8,
    xp_reward: 70,
    is_sample: false,
    created_date: "2026-03-20T00:00:00.000Z",
    updated_date: "2026-03-20T00:00:00.000Z",
    content: `## Choosing the Right Bank

With hundreds of banking options available — traditional banks, online banks, credit unions, neobanks — choosing the right one can feel overwhelming. This lesson gives you a practical framework for evaluating and choosing the institution that fits your life.

## The Five Criteria That Matter Most

**1. Fees**
Monthly maintenance fees, overdraft fees, ATM fees, and minimum balance requirements directly reduce your money. Calculate the annual cost of an account, not just the monthly fee.

Questions to ask:
- Is there a monthly maintenance fee? How do I avoid it?
- What are overdraft fees and policies?
- Is there a minimum balance requirement?
- Are ATM fees reimbursed?

**2. Interest Rates**
- What APY does the savings account pay?
- If you're a borrower: what rates do they offer on personal loans, car loans, mortgages?

The difference between 0.01% APY and 4.5% APY on $5,000 in savings is $224/year. Over 5 years, that's $1,200+ in foregone earnings.

**3. Accessibility**
- Do they have ATMs near where you live and work?
- Can you deposit cash easily (important if you receive cash tips or payments)?
- Is the mobile app well-rated and reliable?
- Is customer service reachable by phone, chat, or branch?

**4. Product Range**
If you want all accounts in one place: does the bank offer checking, savings, credit cards, auto loans, mortgages?

If you're happy to mix institutions: you can optimize each account type separately.

**5. Trust and Stability**
- Is the institution FDIC/NCUA insured?
- How long have they been operating?
- What do customer reviews say about resolving disputes?

## The Hybrid Strategy: Best of Both Worlds

Many financially savvy people use two accounts:

**Account 1 (Everyday Banking):** A traditional bank or neobank with wide ATM access, solid app, and convenient branches for cash deposits.

**Account 2 (Savings):** A high-yield savings account at an online bank (Ally, Marcus, Discover) for maximum APY on emergency fund and savings goals.

You don't have to choose one institution for everything. Optimize each function separately.

## Comparison: Institution Types at a Glance

| | Big Bank | Online Bank | Credit Union | Neobank |
|---|---|---|---|---|
| Savings APY | Very Low | High | Medium | Low-Medium |
| Fees | Higher | Lower/None | Lower | None |
| ATM Access | Wide | Fee reimbursement | Limited | Limited |
| Cash Deposits | Easy | Difficult | Easy | Very Difficult |
| Loan Rates | Average | Not always offered | Better | Limited |
| Technology | Good | Excellent | Variable | Excellent |
| Best For | All-in-one | High-yield savings | Loans & local service | Simple everyday banking |

## Red Flags: Banks to Avoid

**High mandatory fees with complex waiver requirements**
If you need to maintain $1,500 minimum balance OR make 15 debit transactions OR have 2+ direct deposits per month to avoid a $15/month fee — the bank is designed to collect fees, not serve you.

**Predatory overdraft programs**
Some banks process transactions in order to maximize overdraft fees (processing largest transactions first to drain your account faster). Research a bank's overdraft practices before opening.

**Unclear FDIC/NCUA status**
Always verify the institution is federally insured. Uninsured institutions do exist and your deposits are not protected if they fail.

## Making the Switch

Switching banks is easier than most people expect:

1. Open new account, fund it with a small amount
2. Update direct deposit with your employer (takes 1–2 pay cycles)
3. Move automatic bill payments one by one
4. Keep old account open for 1–2 months to catch any missed redirects
5. Close old account once all payments are confirmed moved

## Key Takeaway

The right bank depends on your priorities: fee avoidance, high savings rates, ATM access, or loan products. Many people benefit from using two accounts — a local bank for convenience and an online bank for savings. Compare annually — rates and fee structures change.`,
    quiz_questions: [
      {
        question: "You receive cash tips as part of your income. Which type of bank should you prioritize?",
        options: [
          "An online-only bank with the highest savings APY",
          "A bank or credit union with physical branches or partner ATMs that accept cash deposits",
          "A neobank like Chime for fee-free banking",
          "Any bank — all banks accept cash deposits equally"
        ],
        correct_answer: 1,
        explanation: "Online-only banks typically don't accept cash deposits. If you regularly receive cash, you need a traditional bank, credit union, or one with cash deposit access through retail partners (like Green Dot at CVS)."
      },
      {
        question: "What is the most financially efficient banking setup for someone who wants both daily convenience and maximum savings interest?",
        options: [
          "Keep all money at a major bank for simplicity",
          "Use a traditional or neobank for daily checking + a separate high-yield savings account at an online bank for savings",
          "Use only a credit union for all banking needs",
          "Keep savings in cash at home to avoid fees"
        ],
        correct_answer: 1,
        explanation: "Separating checking (convenience, ATM access) from savings (maximum APY) lets you optimize each function. You're not limited to one institution — use the best tool for each job."
      },
      {
        question: "When switching banks, what is the safest approach?",
        options: [
          "Close the old account first, then open the new one",
          "Open new account, update direct deposit and bills gradually, keep old account open for 1–2 months during transition",
          "Switch everything in one day to avoid paying two sets of fees",
          "Only switch if you're moving to a new city"
        ],
        correct_answer: 1,
        explanation: "A parallel transition prevents missed payments. Update direct deposit first (takes 1–2 pay cycles), then move automatic payments one by one. Keep the old account active until all payments are confirmed redirected."
      }
    ]
  }
];

// Add new lessons, avoiding duplicates
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
console.log("\n✅ Part 3a complete — 4 new Budgeting + 3 new Banking lessons");
console.log("   Total lessons:", lessons.length);

if (fs.existsSync(DIST_LESSONS)) {
  fs.writeFileSync(DIST_LESSONS, JSON.stringify(lessons, null, 2));
  console.log("✅ dist/ also updated");
}
