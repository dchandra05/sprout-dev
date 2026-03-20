// Part 2: Updated content for Credit, Investing, Saving existing lessons
const fs = require("fs");
const LESSONS_PATH = "public/data/lessons.json";
const DIST_LESSONS = "dist/data/lessons.json";
const lessons = JSON.parse(fs.readFileSync(LESSONS_PATH, "utf8"));

function update(id, patch) {
  const idx = lessons.findIndex(l => l.id === id);
  if (idx === -1) { console.warn("NOT FOUND:", id); return; }
  Object.assign(lessons[idx], patch);
}

// ─── CREDIT EXISTING LESSONS ──────────────────────────────────────────────────

update("lesson-credit-001", {
  duration_minutes: 9,
  xp_reward: 80,
  content: `## How Credit Cards Work

A credit card lets you borrow money from a bank to make purchases. You get a billing cycle (usually 30 days), make purchases, and receive a statement. Pay the full balance by the due date and you pay zero interest. Carry a balance and you pay interest — often at very high rates.

This seems simple, but most people don't fully understand how the system works, which is why credit card debt is one of the leading causes of financial stress in America.

## The Billing Cycle

Every credit card operates on a monthly billing cycle:

1. **Statement closes** — All charges during the cycle are totaled into your statement balance
2. **Statement is issued** — You receive a bill showing your balance and minimum payment due
3. **Grace period** — Typically 21–25 days to pay before interest begins
4. **Due date** — Pay at least the minimum; pay the full balance to avoid interest

**Key insight:** Interest only accrues on balances *carried past the due date.* If you pay your full statement balance every single month, you pay $0 in interest — ever.

## APR: The Cost of Carrying a Balance

APR (Annual Percentage Rate) is the annual interest rate on your credit card balance. Most credit cards charge 20–29% APR. This is an annual rate divided into a *daily* rate.

**Example: $1,000 balance at 24% APR**
- Daily rate: 24% ÷ 365 = 0.0658% per day
- Daily interest charge: $1,000 × 0.000658 = $0.66/day
- Monthly interest: ~$20

That doesn't sound terrible, but consider: your minimum payment on $1,000 might be only $25. After paying $25 and accruing $20 in interest, you've paid down just $5 of principal. At that rate, it takes years to pay off.

## Minimum Payments: The Trap

Credit card companies are required to show you on your statement how long it will take to pay off your balance if you only make minimum payments. Read this number.

**Example from a real credit card statement:**
- Balance: $3,500 at 22% APR
- Minimum payment: $70/month
- Time to pay off at minimums: **11 years**
- Total interest paid: **$3,400**

You'd pay nearly double the original amount.

**The fix:** Pay the full balance every month. If you can't, pay as much as possible above the minimum and stop adding new charges until you're paid off.

## Types of Credit Cards

**Secured Credit Cards:** Require a cash deposit as collateral (usually $200–$500). That deposit becomes your credit limit. Best for people building credit from scratch.

**Student Credit Cards:** Designed for first-time cardholders. Lower credit limits, simpler reward structures, more lenient approval requirements.

**Rewards Cards (Cashback, Points, Miles):** Earn 1–5% back on purchases. Only worth it if you pay your balance in full — rewards never offset 24% APR interest.

**Balance Transfer Cards:** Allow you to move high-interest debt to a new card with a 0% intro APR for 12–21 months. Useful strategy for paying down debt — but read the transfer fee (usually 3–5%) and have a plan to pay it off before the promo period ends.

## Credit Cards vs. Debit Cards for Daily Use

If you pay your balance in full every month, credit cards are strictly superior for daily spending:
- **Purchase protection:** Easier to dispute fraudulent charges
- **Rewards:** Earn cashback or points on every dollar spent
- **Credit history:** Builds your credit score
- **Float:** Your bank account holds the money longer before you pay

If you tend to overspend on credit, debit cards offer a hard stop — you can only spend money you have.

## The Golden Rule

**Pay your full statement balance every month. Every. Month.**

This is the single most important credit card habit. It means zero interest, building credit, and keeping all the rewards.

## Key Takeaway

Credit cards are powerful financial tools when used correctly. The system rewards people who pay in full and punishes people who carry balances. Learn which side of that divide you want to be on.`,
  quiz_questions: [
    {
      question: "If you pay your full credit card statement balance every month by the due date, how much interest do you pay?",
      options: ["The standard APR rate", "$0 — the grace period eliminates interest entirely", "The daily rate multiplied by 30", "5% of the balance"],
      correct_answer: 1,
      explanation: "Credit cards have a grace period (21–25 days after the statement closes). If you pay the full balance before the due date, no interest accrues — ever."
    },
    {
      question: "A credit card minimum payment is set to $70/month on a $3,500 balance at 22% APR. What is the real cost?",
      options: [
        "It's paid off in about 2 years",
        "It takes ~11 years and costs ~$3,400 in interest — nearly doubling the original debt",
        "The balance declines quickly after the first few payments",
        "Interest is capped at $500 total"
      ],
      correct_answer: 1,
      explanation: "Minimum payments on high-APR balances are intentionally set low to maximize interest income for the bank. Always pay well above the minimum."
    },
    {
      question: "A balance transfer credit card is most useful when:",
      options: [
        "You want to earn travel rewards on everyday purchases",
        "You have high-interest credit card debt and a concrete plan to pay it off during the 0% intro period",
        "You are opening your first credit card",
        "You want a higher credit limit"
      ],
      correct_answer: 1,
      explanation: "A balance transfer card with a 0% intro APR lets you temporarily stop accruing interest while you aggressively pay down existing debt — but you must have a payoff plan before the promo period ends."
    }
  ]
});

update("lesson-credit-002", {
  duration_minutes: 10,
  xp_reward: 90,
  content: `## Your Credit Score Explained

Your credit score is a three-digit number between 300 and 850. It represents how reliably you've repaid debts in the past — and it affects your financial life in ways most people don't realize until it's too late to easily fix.

## Why Your Credit Score Matters

A credit score affects your:
- **Interest rates on loans and mortgages** — Someone with a 760 score might get a 6.5% mortgage rate; someone with a 620 score might pay 8.5% — a difference of $400+/month on a $300,000 loan
- **Credit card approval and limits** — Better scores = better cards, higher limits, lower APRs
- **Apartment rentals** — Landlords often require credit checks
- **Car insurance rates** — In most states, insurers use credit scores to set premiums
- **Utility deposits** — Poor credit may require a deposit to turn on electricity
- **Employment** — Some employers check credit for financial roles

## How Credit Scores Are Calculated

The most commonly used score is FICO. Here's exactly what goes into it:

| Factor | Weight | What It Measures |
|---|---|---|
| Payment History | **35%** | Have you paid bills on time? |
| Amounts Owed (Utilization) | **30%** | How much of your available credit are you using? |
| Length of Credit History | **15%** | How long have your accounts been open? |
| Credit Mix | **10%** | Do you have a variety of credit types? |
| New Credit | **10%** | Have you recently applied for new credit? |

**The two most important factors = 65% of your score.**

## Factor 1: Payment History (35%)

One missed payment can drop your score 50–100 points. A payment is considered "late" for credit reporting purposes once it's 30+ days past due.

**Protecting this factor:**
- Set up autopay for at least the minimum on every account
- Never miss a payment — ever
- If you've had late payments, they stay on your report 7 years but their impact fades after 2–3 years of clean history

## Factor 2: Credit Utilization (30%)

Utilization = Credit Used ÷ Total Credit Limit × 100

**Example:**
- Credit limit: $5,000
- Current balance: $2,500
- Utilization: 50% ← Too high

**Target:** Keep utilization below 30% for a good score. Below 10% for an excellent score.

If you have a $3,000 limit and spend $900 (30%) or less, this factor works in your favor. Spending $2,700+ (90%) hurts you significantly.

**Tricks:**
- Pay your balance mid-cycle, before the statement closes (this lowers the reported balance)
- Request a credit limit increase (same balance ÷ larger limit = lower utilization)
- Don't close old credit cards — closing reduces available credit and raises utilization

## Score Ranges: What They Mean

| Score Range | Category | Typical Rate Benefit |
|---|---|---|
| 800–850 | Exceptional | Best rates available |
| 740–799 | Very Good | Near-best rates |
| 670–739 | Good | Standard rates |
| 580–669 | Fair | Higher rates, some rejections |
| 300–579 | Poor | High rates, many rejections |

## The Three Credit Bureaus

Three companies maintain credit reports: **Equifax, Experian, and TransUnion**. Lenders may report to one, two, or all three — so your score may vary slightly across them.

**You're entitled to one free report from each bureau per year** at AnnualCreditReport.com. Review all three annually to catch:
- Errors (wrong balances, accounts you don't recognize)
- Identity theft (accounts you didn't open)
- Outdated negative items (should fall off after 7 years)

## Common Credit Score Myths

**Myth:** Checking your own credit hurts your score.
**Truth:** "Soft pulls" (you checking) don't affect your score. "Hard pulls" (lenders checking for a new application) lower it by 5–10 points temporarily.

**Myth:** Carrying a balance helps your score.
**Truth:** Carrying a balance costs you interest and doesn't help. Pay in full.

**Myth:** Closing old cards is good financial hygiene.
**Truth:** Closing old cards reduces available credit (raises utilization) and shortens credit history length. Leave them open and use occasionally.

## Key Takeaway

Payment history and utilization control 65% of your score. Pay on time — always. Keep utilization below 30%. Review your free credit reports annually. These three habits alone will maintain a good to excellent credit score.`,
  quiz_questions: [
    {
      question: "What two factors make up 65% of a FICO credit score?",
      options: [
        "Credit mix and new credit inquiries",
        "Payment history (35%) and credit utilization (30%)",
        "Length of credit history and number of accounts",
        "Income level and employment history"
      ],
      correct_answer: 1,
      explanation: "Payment history (35%) and amounts owed/utilization (30%) together account for 65% of your FICO score. These are the two factors to manage most carefully."
    },
    {
      question: "You have a $4,000 credit limit and currently owe $2,800. What is your utilization rate, and is it ideal?",
      options: [
        "30%, which is ideal",
        "70% — too high; lenders prefer under 30%",
        "28%, which is in the recommended range",
        "50%, which has no effect on your score"
      ],
      correct_answer: 1,
      explanation: "$2,800 ÷ $4,000 = 70% utilization. This significantly hurts your score. Target under 30% ($1,200 or less in this case) for a good score, under 10% for excellent."
    },
    {
      question: "Why should you generally avoid closing old credit card accounts?",
      options: [
        "Closed accounts are taxed differently",
        "Closing old accounts increases your utilization rate and shortens credit history — both hurting your score",
        "Old accounts earn more interest",
        "Banks charge a fee to close accounts"
      ],
      correct_answer: 1,
      explanation: "Closing a card reduces your total available credit (raising utilization) and shortens your average credit age — two factors that hurt your FICO score."
    },
    {
      question: "What is a 'hard inquiry' and how does it affect your credit score?",
      options: [
        "It's when you check your own credit — it significantly drops your score",
        "It's when a lender checks your credit for a new application — it temporarily lowers your score by 5–10 points",
        "It has no effect on your credit score",
        "It permanently damages your credit history"
      ],
      correct_answer: 1,
      explanation: "A hard inquiry occurs when a lender checks your credit for a new application. It typically drops your score 5–10 points and stays on your report for 2 years, though the impact fades quickly."
    }
  ]
});

update("lesson-credit-003", {
  duration_minutes: 10,
  xp_reward: 85,
  content: `## Good Debt vs. Bad Debt

Not all debt is equal. Some debt builds wealth and increases your earning potential over time. Other debt drains your future income for things that have already been consumed and forgotten. Understanding this distinction is the foundation of smart borrowing.

## What Makes Debt "Good" or "Bad"

The key question: **Does this borrowing increase my net worth or earning capacity over time?**

**Good debt characteristics:**
- Purchases an asset that appreciates (grows in value) or generates income
- Has a low interest rate
- Creates leverage — you gain more than you pay in interest

**Bad debt characteristics:**
- Purchases depreciating assets or consumables (things used up quickly)
- Has a high interest rate
- Costs you more in interest than any value received

## Good Debt Examples

**Student Loans (Generally)**
A college degree often increases lifetime earnings by $800,000–$1,200,000 compared to a high school diploma. If you borrow $50,000 at 5–6% to fund a degree that increases your annual income by $20,000–$30,000, the math works.

*Caveat:* Not all degrees provide equal return. Borrowing $100,000 for a degree with limited job prospects in low-paying fields can become bad debt. The ROI matters.

**Mortgages**
Real estate historically appreciates at ~3–4%/year. If you borrow at 6.5% but your home appreciates 3–4% annually AND you build equity with each payment AND you avoid rent payments, the total picture often works in your favor.

Mortgages are also the lowest-rate debt most people ever carry, and interest may be tax-deductible.

**Business Loans**
Borrowing to fund a business that generates more revenue than the interest cost creates positive leverage. This is how most businesses operate and grow.

## Bad Debt Examples

**Credit Card Debt for Lifestyle Spending**
Using credit cards to fund restaurants, clothing, vacations, or impulse purchases at 22–28% APR is the most destructive personal finance habit. The items are consumed; the debt persists.

**"Buy Now, Pay Later" for Consumables**
BNPL services (Affirm, Klarna) on food delivery, streaming subscriptions, or fast fashion are the same problem: borrowing for things you consume immediately while paying later.

**Payday Loans**
APR equivalent can be 300–400%. A $300 payday loan can quickly become a debt spiral. Avoid entirely.

**Car Loans (Caution Zone)**
Cars depreciate 15–25% in the first year. Borrowing to buy a car means paying interest on a declining asset. It's sometimes unavoidable, but:
- Keep car payments under 15% of take-home pay
- Buy used (let someone else absorb the initial depreciation)
- Shorter loan terms cost less in total interest

## The Debt Priority Framework

When deciding which debts to pay off first, use the **avalanche method**: pay highest-interest debt first.

Priority order:
1. Payday loans / predatory lending (300%+ APR) — eliminate immediately
2. Credit card debt (20–28% APR)
3. Personal loans / private student loans (8–15% APR)
4. Car loans (5–8% APR)
5. Federal student loans (4–7% APR)
6. Mortgages (5–7% APR) — lowest priority; may be worth investing instead

**Why:** Paying off a 22% APR credit card gives you a guaranteed 22% return on that money — better than virtually any investment.

## The Debt Trap: How It Happens

The debt trap starts with small decisions: "I'll just put this on my card and pay it off later." But:

1. Month 1: $800 balance. Minimum payment $25.
2. Month 2: $200 more charged. Balance $992 after minimum.
3. Month 6: Balance $1,300. Now paying $35/month minimum.
4. Year 2: Balance $2,400. Minimum payment can't keep up with interest.

The trap isn't a single bad decision — it's the accumulation of many small ones. Breaking the cycle requires stopping new charges AND paying aggressively above minimums.

## Key Takeaway

Borrow for assets that grow or increase your earning power (education, real estate). Avoid borrowing for consumables (food, entertainment, clothing). When you have debt, eliminate the highest-interest debt first. The best financial position is using credit strategically while carrying zero high-interest debt.`,
  quiz_questions: [
    {
      question: "Which of the following best describes 'good debt'?",
      options: [
        "Any debt with a monthly payment you can afford",
        "Debt used to purchase assets that appreciate in value or increase earning capacity",
        "Credit card debt paid on time",
        "Any debt with an interest rate under 10%"
      ],
      correct_answer: 1,
      explanation: "Good debt builds net worth or earning capacity — like a mortgage on appreciating real estate or student loans for a high-ROI degree. The asset gained outweighs the borrowing cost."
    },
    {
      question: "Using the 'avalanche method' for debt repayment, which debt should you pay off first?",
      options: [
        "Mortgage — it's the largest balance",
        "Federal student loans — they have the most complex terms",
        "Credit card debt — it typically carries the highest interest rate (20–28% APR)",
        "Car loan — it's for a depreciating asset"
      ],
      correct_answer: 2,
      explanation: "The avalanche method prioritizes highest-interest debt first. Credit cards at 20–28% APR cost more per dollar owed than any other common debt type — eliminating them first saves the most money."
    },
    {
      question: "Why is payday loan debt considered the most dangerous form of consumer debt?",
      options: [
        "They have strict credit requirements",
        "They offer APR equivalent to 300–400%, creating a debt spiral that is extremely difficult to escape",
        "They appear on credit reports permanently",
        "They require collateral"
      ],
      correct_answer: 1,
      explanation: "Payday loans charge fees that translate to 300–400% APR. A two-week $300 loan can cost $45–$90 in fees — and if you can't repay, it rolls over and the fees compound rapidly."
    }
  ]
});

// ─── INVESTING EXISTING LESSONS ───────────────────────────────────────────────

update("lesson-invest-001", {
  duration_minutes: 9,
  xp_reward: 80,
  content: `## Stocks: Owning a Piece of a Company

A stock is a share of ownership in a corporation. When you buy 10 shares of Apple, you literally own a tiny fraction of Apple Inc. — its buildings, intellectual property, cash, and future profits. This ownership gives you two ways to make money: price appreciation and dividends.

## How Stocks Work

Companies sell shares to raise money for operations and growth. This happens through an IPO (Initial Public Offering) — the first time shares are sold to the public. After that, shares trade on stock exchanges (NYSE, NASDAQ) between investors.

When you buy a stock, you're not lending money to a company (that's a bond). You're buying ownership. If the company does well, the stock price rises. If it struggles, the price falls.

## Two Ways Stocks Return Money

**1. Capital Appreciation (Price Growth)**
You buy shares at $100. They rise to $150. You sell and pocket the $50 gain.

This is the main return driver for growth stocks. Companies like Amazon and Nvidia have returned thousands of percent over decades through price growth.

**2. Dividends**
Some companies (especially mature ones like Coca-Cola, Johnson & Johnson, utilities) pay regular cash distributions — dividends — to shareholders.

Example: You own 100 shares of Coca-Cola at $60/share = $6,000 invested. Coca-Cola pays a $1.84/share annual dividend. You receive $184/year just for holding the stock, regardless of price movement.

Dividend stocks are popular for income investors and retirees. Growth stocks rarely pay dividends — they reinvest all profits into expansion.

## Understanding Stock Price Movements

Stock prices move based on supply and demand, which is driven by:

- **Earnings reports** (quarterly profits better or worse than expected)
- **Economic data** (interest rates, inflation, unemployment)
- **Company news** (new products, lawsuits, CEO changes)
- **Market sentiment** (investor optimism or fear)
- **Industry trends** (electric vehicles, AI, healthcare)

**Important:** In the short term, stocks are highly volatile and unpredictable. In the long term (10+ years), the stock market has historically returned 8–10% annually on average — despite countless crashes and recessions.

## Risk Levels: Not All Stocks Are Equal

| Stock Type | Risk | Potential Return | Examples |
|---|---|---|---|
| Blue-chip (large stable) | Lower | Moderate (6–10%/yr) | Apple, Microsoft, Visa |
| Growth stocks | Higher | High (or negative) | New tech companies |
| Value stocks | Medium | Moderate | Undervalued established firms |
| Small-cap stocks | High | Variable | Smaller companies |
| Penny stocks | Very High | Lottery-level | Obscure micro-companies |

Beginning investors should stick with large, established companies or index funds rather than speculating on individual small-cap or penny stocks.

## The Case Against Stock Picking

Research consistently shows that even professional fund managers fail to beat the market average in the long run. Individual investors, with less information and time, do even worse. The best strategy for most people is not picking individual stocks but buying **index funds** that own hundreds or thousands of stocks — effectively buying the whole market.

That said, understanding individual stocks is essential financial literacy, even if you ultimately invest primarily through index funds.

## Key Numbers for Stock Analysis

**P/E Ratio (Price-to-Earnings):** Stock price ÷ annual earnings per share. Measures how expensive a stock is relative to its profits. A P/E of 15–20 is typical; higher P/E means higher growth expectations.

**Market Capitalization:** Total value of all outstanding shares. Large-cap = over $10B. Mid-cap = $2–10B. Small-cap = under $2B.

**52-Week High/Low:** The highest and lowest price over the past year — provides context for current price.

## Key Takeaway

Stocks represent real ownership in real companies. Long-term stock investing has historically been one of the best ways to build wealth, but individual stocks carry meaningful risk. Diversification (owning many stocks) is the primary tool for managing that risk.`,
  quiz_questions: [
    {
      question: "What does owning a stock actually represent?",
      options: [
        "A loan you made to a company",
        "Fractional ownership in a corporation, entitling you to a share of its assets and future profits",
        "A savings deposit insured by the FDIC",
        "A guaranteed annual return"
      ],
      correct_answer: 1,
      explanation: "A stock (equity) represents partial ownership of a corporation. As an owner, you participate in the company's growth through price appreciation and potentially dividends."
    },
    {
      question: "What are the two main ways stockholders earn returns?",
      options: [
        "Interest payments and tax refunds",
        "Capital appreciation (price growth) and dividends (cash distributions)",
        "Rental income and bond yields",
        "Loan repayments and royalties"
      ],
      correct_answer: 1,
      explanation: "Stocks return money through capital appreciation (the price increases from your purchase price) and/or dividends (regular cash payments from company profits)."
    },
    {
      question: "Why do most financial experts recommend index funds over picking individual stocks for most investors?",
      options: [
        "Index funds are insured by the government",
        "Even professional fund managers typically fail to beat market averages long-term; index funds capture average returns at minimal cost",
        "Individual stocks are illegal for retail investors",
        "Index funds are guaranteed to never lose value"
      ],
      correct_answer: 1,
      explanation: "Decades of research show that the vast majority of actively managed funds underperform simple index funds after fees. For most investors, low-cost index funds produce better long-term results than stock picking."
    }
  ]
});

update("lesson-invest-002", {
  duration_minutes: 9,
  xp_reward: 75,
  content: `## Bonds: Lending to Governments and Companies

If stocks are ownership, bonds are loans. When you buy a bond, you're lending money to a government or corporation in exchange for regular interest payments and the return of your principal at a set maturity date.

Bonds are a cornerstone of diversified investing — lower risk and lower reward than stocks, which makes them valuable for balancing a portfolio.

## How Bonds Work

1. **Issuer** (government or company) needs to borrow money
2. **Issues bonds** with specific terms: face value, coupon rate, maturity date
3. **You buy** the bond (lending the face value)
4. **You receive** interest payments (coupon payments) at regular intervals
5. **At maturity**, you receive the face value back

**Example:**
- You buy a 10-year U.S. Treasury bond with a $1,000 face value and 4.5% coupon
- You receive $45/year in interest for 10 years ($450 total)
- At year 10, you receive your $1,000 back
- Total return: $1,450 on a $1,000 investment

## Types of Bonds

**U.S. Treasury Bonds (T-Bonds, T-Notes, T-Bills)**
Issued by the U.S. federal government. Considered the safest investment in the world — backed by the full faith and credit of the United States.
- T-Bills: 4 weeks to 1 year
- T-Notes: 2–10 years
- T-Bonds: 10–30 years

Interest is exempt from state and local taxes.

**Municipal Bonds ("Munis")**
Issued by state and local governments to fund infrastructure — roads, schools, hospitals. Interest is typically exempt from federal (and often state) income taxes. Popular with higher-income investors in high-tax states.

**Corporate Bonds**
Issued by companies to fund operations or expansion. Higher yield than government bonds, but higher risk — companies can default (fail to pay).

Rated by agencies (Moody's, S&P) on a scale from AAA (highest quality) to D (default):
- Investment grade (AAA–BBB): Lower risk, lower yield
- High yield / "junk bonds" (BB and below): Higher risk, higher yield

**I-Bonds (Inflation-Protected)**
U.S. government bonds whose interest rate adjusts with inflation. Excellent for protecting purchasing power. Currently limited to $10,000/year per person direct from TreasuryDirect.gov.

## Bond Yields and Prices: The Inverse Relationship

Bond prices and yields (interest rates) move in opposite directions:

- **When interest rates rise** → existing bond prices fall
- **When interest rates fall** → existing bond prices rise

**Why:** If new bonds are paying 5% and you own an older bond paying 3%, your bond becomes less attractive. Its price falls until the effective yield to a new buyer is competitive.

This is why bond investors can lose money even though bonds are "safe" — if you sell before maturity in a rising rate environment.

## Bonds in a Portfolio

Bonds serve a specific role: **stability and income during stock market volatility.**

When stocks crash, investors often flee to bonds ("flight to safety"), pushing bond prices up. A portfolio with both stocks and bonds experiences smaller overall swings than a 100% stock portfolio.

Traditional allocation rule (by age): Hold your age as a percentage in bonds.
- Age 25 → 25% bonds, 75% stocks
- Age 50 → 50% bonds, 50% stocks
- Age 70 → 70% bonds, 30% stocks

Modern advisors often suggest younger investors hold less bonds and more stocks (for growth), shifting to bonds as retirement approaches.

## Key Takeaway

Bonds are loans that pay regular interest — lower risk, lower return than stocks. U.S. Treasury bonds are the world's safest investment. Corporate bonds pay more but carry default risk. Bonds provide stability and income, making them valuable in diversified portfolios — especially as you approach retirement.`,
  quiz_questions: [
    {
      question: "What is the fundamental difference between a stock and a bond?",
      options: [
        "Stocks pay interest; bonds pay dividends",
        "Stocks represent ownership in a company; bonds represent a loan to a government or company",
        "Bonds are riskier than stocks",
        "Stocks are issued by governments; bonds by corporations"
      ],
      correct_answer: 1,
      explanation: "Stocks give you ownership rights in a company. Bonds make you a creditor — you lend money and receive scheduled interest payments plus your principal back at maturity."
    },
    {
      question: "When interest rates in the economy rise, what happens to the prices of existing bonds?",
      options: [
        "They rise too, matching the new rate",
        "They fall, because new bonds offer better yields, making older bonds less valuable",
        "They are unaffected",
        "They become guaranteed by the government"
      ],
      correct_answer: 1,
      explanation: "Existing bonds paying a lower fixed rate become less attractive when new bonds offer higher rates. Their market price falls to compensate new buyers with a competitive effective yield."
    },
    {
      question: "Why are U.S. Treasury bonds considered the safest investment in the world?",
      options: [
        "They offer the highest interest rates",
        "They are backed by the full faith and credit of the U.S. government, which has never defaulted",
        "They are insured by the FDIC",
        "They increase in value with inflation automatically"
      ],
      correct_answer: 1,
      explanation: "U.S. Treasuries are backed by the U.S. government, which controls its own currency and has never failed to repay its debt obligations. This makes them the global benchmark for risk-free investment."
    }
  ]
});

update("lesson-invest-003", {
  duration_minutes: 9,
  xp_reward: 80,
  content: `## ETFs and Mutual Funds: Instant Diversification

Instead of picking individual stocks, ETFs and mutual funds let you buy a single investment that contains dozens, hundreds, or thousands of different securities. For most individual investors, these are the most practical and effective way to invest.

## What Is an ETF?

An ETF (Exchange-Traded Fund) is a basket of securities — stocks, bonds, or other assets — that trades on a stock exchange just like an individual stock.

When you buy one share of the S&P 500 ETF (like SPY or VOO), you own a proportional stake in 500 of America's largest companies: Apple, Microsoft, Amazon, Berkshire Hathaway, Visa, and 495 others.

**Key characteristics:**
- Trades throughout the day like a stock (buy/sell at market price any time)
- Typically passively managed (tracks an index)
- Very low expense ratios (0.03–0.20% annually)
- Tax-efficient
- No minimum investment beyond one share (or fractional shares at many brokers)

**Popular ETFs:**
| ETF | What It Tracks | Expense Ratio |
|---|---|---|
| VOO / SPY | S&P 500 (500 largest U.S. companies) | 0.03–0.09% |
| VTI | Total U.S. stock market (~4,000 companies) | 0.03% |
| VXUS | International stocks (ex-U.S.) | 0.07% |
| BND | U.S. bond market | 0.03% |
| QQQ | Nasdaq 100 (tech-heavy) | 0.20% |

## What Is a Mutual Fund?

A mutual fund also pools money from many investors to buy a diversified portfolio. Key differences from ETFs:

- **Priced once per day** (at market close), not continuously like ETFs
- **Often actively managed** — professional managers select investments
- **May require a minimum investment** ($1,000–$3,000 at many brokerages)
- **Higher expenses** for active management (typically 0.5–1.5% annually)

## Active vs. Passive Management

**Passive funds** (most ETFs, index mutual funds) simply track an index. No one is trying to "beat the market."

**Active funds** (most traditional mutual funds) employ managers who research and select investments, trying to outperform the market.

**The problem with active management:** Over 15 years, research consistently shows that 85–92% of actively managed large-cap funds underperform their benchmark index — *after fees*. You pay more for worse results, on average.

The 0.5–1.5% annual fee difference sounds small but compounds significantly:

| $10,000 invested for 30 years at 8% | Balance |
|---|---|
| With 0.03% fee (index ETF) | $99,271 |
| With 1.00% fee (active fund) | $81,165 |
| With 1.50% fee (active fund) | $72,095 |

That fee difference is worth $17,000–$27,000 on a $10,000 investment over 30 years.

## The Three-Fund Portfolio

A simple, powerful investment strategy used by millions of investors: three ETFs cover the entire global market.

1. **U.S. Total Market** (VTI) — ~60% of portfolio
2. **International** (VXUS) — ~30% of portfolio
3. **U.S. Bonds** (BND) — ~10% of portfolio (adjust based on age/risk tolerance)

That's it. This beats the majority of professional fund managers over 20+ year periods. It requires no stock research, minimal management, and minimal cost.

## Sector ETFs: Targeted Exposure

Beyond broad market ETFs, sector ETFs target specific industries:
- Technology (XLK)
- Healthcare (XLV)
- Clean Energy (ICLN)
- Real Estate (VNQ)
- Financials (XLF)

These allow targeted bets on specific industries. More concentrated = more risk than broad index ETFs.

## Key Takeaway

ETFs provide instant diversification at minimal cost. The evidence overwhelmingly supports low-cost passive index ETFs for long-term wealth building. The three-fund portfolio (U.S. stocks + international + bonds) is a proven, simple strategy that beats most active managers over time.`,
  quiz_questions: [
    {
      question: "When you buy one share of a S&P 500 ETF like VOO, what do you own?",
      options: [
        "A single share of the most popular company",
        "A proportional stake in all 500 companies in the S&P 500 index",
        "A government-backed savings instrument",
        "A loan to the ETF company"
      ],
      correct_answer: 1,
      explanation: "An S&P 500 ETF holds all 500 companies in the index. Buying one share gives you proportional exposure to Apple, Microsoft, Amazon, and 497 other major U.S. companies."
    },
    {
      question: "Why do low-cost index ETFs typically outperform actively managed mutual funds over 15+ years?",
      options: [
        "Index ETFs are guaranteed to never lose money",
        "Active managers' fees (0.5–1.5%/year) compound over time and are rarely offset by better performance — 85–92% of active funds underperform",
        "Index ETFs invest in better companies",
        "Active managers are legally restricted from buying the best stocks"
      ],
      correct_answer: 1,
      explanation: "The math of fees is brutal over time. A 1% annual fee on a $10,000 investment for 30 years costs ~$18,000 in lost returns. And most active managers don't even beat the index before fees."
    },
    {
      question: "The 'three-fund portfolio' consists of:",
      options: [
        "Three individual stocks from different sectors",
        "U.S. total market + international stocks + U.S. bonds — covering the entire global investable market at minimal cost",
        "S&P 500 + gold + real estate",
        "Three actively managed mutual funds for diversification"
      ],
      correct_answer: 1,
      explanation: "The three-fund portfolio (pioneered by Vanguard founder Jack Bogle) covers U.S. stocks, international stocks, and bonds — providing global diversification with just three funds."
    }
  ]
});

update("lesson-invest-004", {
  duration_minutes: 9,
  xp_reward: 80,
  content: `## Risk, Return, and Time Horizon

Every investment involves risk — the possibility of losing money. Understanding the relationship between risk, potential return, and your time horizon is essential to making investment decisions that match your actual situation.

## The Risk-Return Tradeoff

This is one of the foundational principles of finance: **higher potential returns require accepting higher risk.** There is no investment that is simultaneously very safe AND very high-return. Anyone promising both is either wrong or trying to defraud you.

**The spectrum:**

| Investment | Risk Level | Expected Annual Return |
|---|---|---|
| U.S. Treasury Bills | Near-zero | 4–5% (varies with Fed rate) |
| Investment-grade bonds | Low-Medium | 3–6% |
| S&P 500 index fund | Medium | 8–10% (historical avg.) |
| Small-cap stocks | Medium-High | 10–12% (but volatile) |
| Emerging markets | High | Variable |
| Cryptocurrency | Very High | Highly volatile |
| Single stocks (speculative) | Very High | Highly variable |

## What "Risk" Actually Means

In investing, risk has two main dimensions:

**Volatility Risk:** How much an investment's price fluctuates day to day. The S&P 500 can drop 30–50% in a recession — but it has always recovered over a long enough time frame.

**Permanent Loss Risk:** The chance you lose money that never comes back — a company goes bankrupt, a speculative bet doesn't pan out.

For long-term investors, volatility is manageable. Permanent loss is what to truly fear.

## Time Horizon: The Most Important Variable

Your **time horizon** — how many years until you need the money — changes what level of risk makes sense.

**Short time horizon (0–3 years):** Money for a near-term goal (down payment, emergency, tuition). This money should NOT be in stocks. Use savings accounts, CDs, or short-term bonds. You cannot afford a 30% stock market crash right before you need the funds.

**Medium time horizon (3–10 years):** Money you'll need in several years (house in 5 years, child's education). A balanced mix of stocks and bonds is appropriate. You have time to recover from some volatility.

**Long time horizon (10+ years):** Money for retirement, long-term wealth. You can afford to ride out stock market crashes. A high allocation to stocks is appropriate — the math strongly supports it.

**The power of time horizon:**
$10,000 invested at 8%/year:
- After 10 years: $21,589
- After 20 years: $46,609
- After 30 years: $100,627
- After 40 years: $217,245

Time is the most powerful variable in investing. Starting 10 years earlier can double or triple your final wealth.

## The Cost of Trying to Time the Market

Many investors try to sell before market crashes and buy before recoveries. This strategy — "market timing" — almost never works.

**The reason:** The best trading days are often clustered near the worst. Missing just the 10 best days in the market over 20 years can cut your return roughly in half.

A JP Morgan study found that from 1999–2019:
- Staying invested: +6.06%/year average return
- Missing just the 10 best days: +2.44%/year
- Missing the 20 best days: +0.08%/year
- Missing the 30 best days: -1.95%/year (negative return)

**The conclusion:** Time *in* the market beats timing the market.

## Diversification: The Only Free Lunch

The famous quote attributed to economist Harry Markowitz: "Diversification is the only free lunch in investing."

By spreading investments across:
- Different companies (not all eggs in one basket)
- Different sectors (tech, healthcare, energy, finance)
- Different asset classes (stocks, bonds, real estate)
- Different geographies (U.S., international, emerging markets)

...you reduce portfolio volatility without sacrificing expected returns. This is why index funds beat individual stock picking for most people.

## Key Takeaway

Match risk level to time horizon: stocks for long-term, stable assets for short-term. Stay invested — missing the best market days is catastrophically costly. Diversify broadly. These three principles form the foundation of successful long-term investing.`,
  quiz_questions: [
    {
      question: "You're saving for a home down payment you plan to use in 18 months. Where should this money be invested?",
      options: [
        "S&P 500 index fund for maximum growth",
        "High-yield savings account or short-term CD — not stocks, because a market crash right before you need it could be devastating",
        "Individual growth stocks for quick gains",
        "Cryptocurrency for high potential returns"
      ],
      correct_answer: 1,
      explanation: "Money needed within 1–3 years belongs in stable, liquid accounts. A stock market crash right before you need the funds would be financially devastating with no time to recover."
    },
    {
      question: "What does research show about investors who miss the market's 10 best trading days over 20 years?",
      options: [
        "Their performance is only slightly below average",
        "Missing just the 10 best days roughly halves their long-term return compared to staying invested",
        "Timing the market consistently leads to better results",
        "They still beat bond investments"
      ],
      correct_answer: 1,
      explanation: "The best market days are unpredictable and often follow severe drops. Missing just 10 days over 20 years can cut your return from ~6% to ~2.4% annually — a massive difference in final wealth."
    },
    {
      question: "Why is diversification called 'the only free lunch in investing'?",
      options: [
        "Diversified funds have no fees",
        "Diversification reduces portfolio volatility without sacrificing expected returns — you get risk reduction for free",
        "Diversified investors pay no taxes on gains",
        "It guarantees returns equal to the highest-performing asset"
      ],
      correct_answer: 1,
      explanation: "By holding uncorrelated assets, diversification smooths out volatility without lowering expected return — you give up nothing to get the risk reduction. That's why Markowitz called it a 'free lunch.'"
    }
  ]
});

update("lesson-invest-005", {
  duration_minutes: 10,
  xp_reward: 90,
  content: `## Getting Started: Your First Investment

The biggest barrier to investing isn't knowledge — it's starting. This lesson gives you the complete framework to make your first investment with confidence: where to open an account, what to actually buy, and how much to start with.

## Step 1: Choose a Brokerage Account

A brokerage account is where you buy and sell investments. In 2025, all major brokerages offer:
- Zero trading commissions
- Fractional shares (invest any dollar amount)
- Strong mobile apps
- No minimum to open an account

**Top options for beginners:**

| Brokerage | Best For |
|---|---|
| Fidelity | Overall best — excellent research, zero fees, great for beginners |
| Vanguard | Best for passive index fund investors |
| Charles Schwab | Great all-around, strong customer service |
| Robinhood | Simple interface; limited research tools |
| M1 Finance | Automated investing / portfolio "pies" |

For most beginners: **Fidelity or Schwab** — zero fees, excellent tools, and both have been around for decades.

## Step 2: Choose the Right Account Type

**Taxable Brokerage Account:** No special tax treatment. You can invest any amount, withdraw anytime. Pay taxes on dividends and capital gains.

**Roth IRA:** Up to $7,000/year (2024 limit). Contributions are post-tax, but growth and qualified withdrawals are **completely tax-free**. Ideal for young investors — you're likely in a lower tax bracket now than in retirement.

**Traditional IRA:** Contributions may be tax-deductible. Growth is tax-deferred. Pay taxes on withdrawals in retirement. Best if you expect to be in a lower tax bracket in retirement.

**401(k) / 403(b):** Workplace retirement account. Up to $23,000/year (2024). Often includes employer match. Prioritize this before a Roth IRA if your employer matches contributions.

**Recommended priority:**
1. 401(k) up to full employer match (free money — always do this first)
2. Roth IRA up to annual limit ($7,000)
3. Back to 401(k) if more to invest
4. Taxable brokerage for overflow

## Step 3: What to Actually Buy

For a beginning investor with any amount from $100 to $100,000, the evidence-backed recommendation is the same:

**The Simple Portfolio:**
- **VOO or VTI** (80–90%): U.S. total market or S&P 500 ETF
- **VXUS** (10–20%): International developed/emerging market stocks

Or even simpler: A single **Target Date Fund** (e.g., Vanguard Target Retirement 2060 Fund if you plan to retire around 2060). It automatically holds stocks + bonds in appropriate proportions and automatically shifts more conservative as you approach retirement.

Avoid:
- Individual stocks (until you have a solid index fund foundation)
- Leveraged ETFs (designed for day traders, not long-term investors)
- Cryptocurrency as more than 5% of portfolio

## Step 4: How Much to Start With

There is no minimum that is too small. Starting with $50 is infinitely better than waiting.

**Why it matters:**
- $50/month starting at 22 → $131,900 by retirement at 67 (8% average return)
- $50/month starting at 32 → $57,500 by retirement at 67 (8% average return)

The 10-year head start nearly doubles the final balance — with the same monthly contribution. Time is the biggest driver, not amount.

**Dollar-Cost Averaging (DCA):**
Invest a fixed amount on a regular schedule (e.g., $200 every month regardless of market conditions). This automatically buys more shares when prices are low and fewer when prices are high — a proven risk-reducing strategy.

## Step 5: Set It and (Mostly) Forget It

After you've set up your investments:
- Enable automatic contributions
- Reinvest dividends automatically
- Rebalance once a year (or let a target date fund do it for you)
- Don't check your balance every day — it will make you want to sell at the worst times

The biggest enemy of good investment returns is emotional decision-making. People who check their portfolio daily tend to panic-sell during crashes — locking in losses at exactly the wrong time.

## Key Takeaway

Open a Roth IRA at Fidelity or Schwab. Invest in VTI or a Target Date Fund. Contribute a fixed amount every month automatically. Don't touch it for 30+ years. That's genuinely it. The sophistication of the strategy matters far less than the consistency of execution.`,
  quiz_questions: [
    {
      question: "What is the recommended first priority for investing when you have an employer-sponsored 401(k) with matching contributions?",
      options: [
        "Max out a Roth IRA first for the tax-free growth",
        "Contribute to the 401(k) at least up to the full employer match — it's free money with an instant 50–100% return",
        "Invest in individual stocks first for higher returns",
        "Pay all debts before investing anything"
      ],
      correct_answer: 1,
      explanation: "Employer 401(k) matching is an instant 50–100% return on your contribution — better than any other investment. Always capture the full match before directing money elsewhere."
    },
    {
      question: "Why is a Roth IRA especially advantageous for young investors?",
      options: [
        "Roth IRA contributions are tax-deductible",
        "Young investors are typically in lower tax brackets, so paying tax now on contributions means tax-free withdrawals on decades of compounded growth",
        "Roth IRAs have higher contribution limits than 401(k)s",
        "Roth IRAs are insured against market losses"
      ],
      correct_answer: 1,
      explanation: "With a Roth IRA, you pay taxes now (at your current rate) and get tax-free growth and withdrawals in retirement. Young investors typically pay low rates now but have massive compounding time ahead — making the Roth especially powerful."
    },
    {
      question: "Dollar-cost averaging (DCA) means:",
      options: [
        "Investing large lump sums only at market lows",
        "Investing a fixed dollar amount on a regular schedule, automatically buying more shares when prices are low",
        "Only investing in dollars, not other currencies",
        "Averaging the cost of your portfolio across different brokerages"
      ],
      correct_answer: 1,
      explanation: "DCA — investing a fixed amount regularly regardless of market conditions — naturally buys more shares when prices are low and fewer when high. This systematic approach reduces emotional decision-making and market timing risk."
    }
  ]
});

// ─── SAVING EXISTING LESSONS ──────────────────────────────────────────────────

update("lesson-saving-001", {
  duration_minutes: 9,
  xp_reward: 80,
  content: `## The Power of Compound Interest

Albert Einstein reportedly called compound interest the "eighth wonder of the world." Whether he said it or not, the math justifies the awe. Compound interest is the mechanism by which modest, consistent saving transforms into real wealth over time.

## Simple vs. Compound Interest

**Simple Interest:** Calculated only on your original principal.
$1,000 × 5% = $50/year, every year.
After 30 years: $1,000 + ($50 × 30) = **$2,500**

**Compound Interest:** Calculated on principal *plus* all previously earned interest.
Year 1: $1,000 × 5% = $50 interest → balance: $1,050
Year 2: $1,050 × 5% = $52.50 interest → balance: $1,102.50
Year 3: $1,102.50 × 5% = $55.13 → balance: $1,157.63
...

After 30 years: **$4,321.94** — compared to $2,500 with simple interest.

The difference ($1,821) is the power of compounding. And it accelerates: the growth in the last 10 years of those 30 exceeds the growth from the first 20 years combined.

## The Rule of 72

A quick mental math shortcut: divide 72 by your interest rate to find how many years it takes to double your money.

| Interest Rate | Years to Double |
|---|---|
| 2% (savings account) | 36 years |
| 4% (HYSA) | 18 years |
| 7% (stock market) | ~10 years |
| 10% (historical S&P 500) | 7.2 years |
| 24% (credit card debt) | 3 years |

Note the last row: at 24% APR, credit card debt *doubles in 3 years* through the same compounding math. This is why carrying high-interest debt is so destructive — the same mechanism working for you in savings is working against you in debt.

## The Early Start Advantage

The single biggest factor in compound interest is **time.** Starting 10 years earlier can double or triple your final wealth with the same total contribution.

**Scenario: Two investors, same total contributions**

Alex starts investing $200/month at age 22 and stops at 32 (10 years of contributions = $24,000 total).
Jamie starts investing $200/month at age 32 and continues until 62 (30 years of contributions = $72,000 total).

Both earn 8% annual return. Who has more at 62?

- **Alex:** $322,000 — despite contributing only $24,000
- **Jamie:** $272,000 — despite contributing $72,000

Alex ends up with $50,000 more by starting 10 years earlier — even after contributing for only one-third as long.

*This is compound interest. Time is the variable that matters most.*

## Compounding Frequency

Interest can compound at different intervals — the more frequent, the better.

| Compounding Frequency | $10,000 at 5% after 10 years |
|---|---|
| Annual | $16,289 |
| Monthly | $16,470 |
| Daily | $16,487 |

Daily compounding earns $198 more than annual on the same $10,000. The difference is small on short time frames but grows with larger amounts and longer periods.

High-yield savings accounts typically compound daily and pay monthly — this is good for your savings balance.

## How to Apply This Right Now

1. Open a high-yield savings account (HYSA) — the higher the APY, the more compounding works for you
2. Set up an automatic transfer on payday — even $25/week = $1,300/year
3. Never withdraw unless it's a true emergency — every withdrawal resets the compounding clock
4. For long-term wealth: invest in low-cost index funds where historical returns (8–10%/year) amplify compounding dramatically

## Key Takeaway

Compound interest rewards patience and punishes procrastination. Every year you wait to start saving or investing is a year of compounding you'll never recover. Starting with $50 today is always better than starting with $500 five years from now.`,
  quiz_questions: [
    {
      question: "Using the Rule of 72, how long does it take to double money at a 6% annual return?",
      options: ["6 years", "12 years", "18 years", "36 years"],
      correct_answer: 1,
      explanation: "72 ÷ 6 = 12 years. The Rule of 72 is a quick way to estimate how long any rate of return takes to double your money."
    },
    {
      question: "Alex invests $24,000 total (at age 22–32) and Jamie invests $72,000 total (at age 32–62), both at 8% annual return. Who has more at age 62?",
      options: [
        "Jamie — they contributed 3 times as much",
        "Alex — the 10 extra years of compounding more than offset the lower total contribution",
        "They end up with the same amount",
        "It depends on the specific stocks they chose"
      ],
      correct_answer: 1,
      explanation: "Alex has ~$322,000 vs. Jamie's ~$272,000. Starting 10 years earlier and letting compound interest run gives Alex $50,000 more, despite contributing one-third as much total."
    },
    {
      question: "Why does compound interest make high-interest credit card debt especially dangerous?",
      options: [
        "Credit cards charge simple interest, not compound",
        "The same compounding math works against you — a 24% APR debt doubles roughly every 3 years if only minimums are paid",
        "Credit card debt is immune to interest rules",
        "Compound interest only matters for savings, not debt"
      ],
      correct_answer: 1,
      explanation: "Compound interest is bidirectional. At 24% APR, the Rule of 72 says debt doubles in 3 years. The same mechanism that grows savings destroys wealth when you're carrying high-interest debt."
    }
  ]
});

update("lesson-saving-002", {
  duration_minutes: 9,
  xp_reward: 75,
  content: `## Emergency Funds and Financial Safety Nets

Life is unpredictable. Your car breaks down. You lose your job. A medical emergency arrives. Without a financial cushion, any of these events can cascade — missed bills, credit card debt, missing rent. With one, they're inconveniences you handle and move on from.

An emergency fund is the single most important foundational element of financial stability.

## What Is an Emergency Fund?

An emergency fund is cash saved in an accessible account (typically a high-yield savings account) that you use only for genuine financial emergencies. Not for vacations. Not for a sale at your favorite store. Not for "opportunities." Emergencies.

**What qualifies as an emergency:**
- Unexpected job loss
- Major car repair
- Medical bill not covered by insurance
- Emergency home repair (broken furnace, plumbing)
- Emergency travel (family crisis)

**What does NOT qualify:**
- A great deal on something you wanted
- Birthday gifts you forgot to budget
- Normal car maintenance (those should be in a sinking fund)

## How Much Do You Need?

The standard recommendation: **3–6 months of essential living expenses.**

"Essential" means what you'd spend in a true emergency — just the bills you can't miss:
- Housing (rent or mortgage)
- Utilities
- Food (groceries, not dining out)
- Transportation (car payment, insurance, gas)
- Minimum debt payments
- Insurance premiums

**Example calculation:**

| Essential Expense | Monthly |
|---|---|
| Rent | $900 |
| Utilities | $100 |
| Groceries | $300 |
| Car payment | $280 |
| Car insurance | $110 |
| Minimum loan payments | $150 |
| **Total** | **$1,840** |

3-month fund target: **$5,520**
6-month fund target: **$11,040**

## 3 Months vs. 6 Months: Who Needs More?

| Situation | Recommended Buffer |
|---|---|
| Stable salaried job, low expenses | 3 months |
| Freelance / self-employed | 6 months+ |
| Commission-based income | 6 months+ |
| Single income household | 6 months |
| Dual income household | 3–4 months |
| Industry prone to layoffs | 6 months+ |
| Significant dependents | 6 months |

When in doubt: more is better. The cost of having too much in an emergency fund is modest (slightly lower returns than investing). The cost of having too little is potentially catastrophic.

## The Starter Emergency Fund

If you're also paying off high-interest debt, a full 6-month emergency fund isn't the first priority. The sequence:

1. **Starter emergency fund: $500–$1,000** — This handles most minor emergencies (car repair, unexpected bill) and prevents new credit card debt during debt payoff
2. **Pay off high-interest debt** (credit cards, payday loans)
3. **Build full 3–6 month emergency fund**

## Where to Keep Your Emergency Fund

**Your emergency fund belongs in:**
- High-Yield Savings Account (best choice — earns 4–5% APY, FDIC insured, accessible in 1–3 business days)
- Money Market Account (similar to HYSA)
- Short-term CDs with no penalty for early withdrawal

**Your emergency fund does NOT belong in:**
- The stock market (can drop 30–50% right when you need it)
- Long-term CDs (penalties for early withdrawal)
- Your regular checking account (too easy to accidentally spend)
- Cash at home (no interest, no insurance)

## The Psychological Value

Beyond the financial protection, an emergency fund provides something equally valuable: peace of mind. People with emergency funds are measurably less stressed about money, less likely to make poor financial decisions under pressure, and more resilient to economic shocks.

That 3–6 months of cash isn't just financial protection — it's the psychological foundation that allows you to take better career risks, negotiate for higher pay, and make clearer financial decisions.

## Key Takeaway

Build a $500–$1,000 starter fund first. Then pay off high-interest debt. Then build to 3–6 months of expenses. Keep it in a high-yield savings account. Touch it only for real emergencies. This single habit protects everything else you're building.`,
  quiz_questions: [
    {
      question: "What is the primary purpose of an emergency fund?",
      options: [
        "To invest in opportunities as they arise",
        "To cover genuine unexpected financial emergencies without going into debt",
        "To earn the highest possible investment returns",
        "To save for planned large purchases"
      ],
      correct_answer: 1,
      explanation: "An emergency fund is cash reserved specifically for unexpected financial crises — job loss, medical emergency, major car/home repair — to absorb the shock without creating debt."
    },
    {
      question: "Where is the best place to keep your emergency fund?",
      options: [
        "Invested in an S&P 500 index fund for maximum growth",
        "A high-yield savings account — accessible within 1–3 days, FDIC insured, earning 4–5% APY",
        "Under your mattress for immediate access",
        "A 5-year CD for the highest interest rate"
      ],
      correct_answer: 1,
      explanation: "An emergency fund needs to be safe and accessible. A HYSA earns meaningful interest while keeping the money available without market risk or penalties."
    },
    {
      question: "If you're working to pay off credit card debt, when should you build your emergency fund?",
      options: [
        "Wait until all debt is paid off before saving anything",
        "Build a small starter fund ($500–$1,000) first, then focus on debt, then build the full fund",
        "Build the full 6-month fund before making any extra debt payments",
        "Emergency funds only matter when you earn over $50,000"
      ],
      correct_answer: 1,
      explanation: "A starter emergency fund prevents new credit card debt during the payoff phase (if a car breaks down, you don't have to charge it). After high-interest debt is gone, build the full 3–6 month fund."
    }
  ]
});

update("lesson-saving-003", {
  duration_minutes: 9,
  xp_reward: 80,
  content: `## High-Yield Savings: Where to Park Your Money

Not all savings accounts are equal. Choosing where to keep your money can mean the difference between earning $5/year and $500/year on the same balance. This lesson covers the best account types for different savings goals.

## The Problem with Big Bank Savings Accounts

The average savings account at a major U.S. bank (Chase, Bank of America, Wells Fargo) pays about 0.01–0.10% APY. On $10,000, that earns $1–$10/year.

Online banks and credit unions, with lower overhead costs, offer 4–5% APY on savings during normal to high interest rate environments.

**The math:**
$10,000 in savings for 5 years:

| Account | APY | Balance After 5 Years | Earned |
|---|---|---|---|
| Big bank savings | 0.01% | $10,005 | $5 |
| Credit union savings | 0.50% | $10,253 | $253 |
| High-yield savings (online) | 4.50% | $12,461 | $2,461 |

That's $2,456 more for the exact same $10,000, simply by choosing the right account. This is passive income you're leaving on the table.

## High-Yield Savings Accounts (HYSAs)

**Best HYSAs in 2025** (rates change — always compare current rates):
- Ally Bank, Marcus by Goldman Sachs, Discover Bank, SoFi, American Express National Bank
- Typical APY during high-rate environment: 4.0–5.0%
- FDIC insured to $250,000
- No monthly fees
- No minimum balance requirements
- Transfer to checking in 1–3 business days

**Best use cases:**
- Emergency fund
- Savings for a goal 6–24 months away (car, vacation, down payment)
- Any money you want to earn interest but might need within a year or two

## Money Market Accounts (MMAs)

A money market account is similar to a HYSA — it earns higher interest than a standard savings account — but typically comes with check-writing privileges or a debit card for slightly easier access.

| Feature | HYSA | MMA |
|---|---|---|
| APY | Often higher | Competitive |
| Check writing | Usually no | Sometimes yes |
| Debit card | Usually no | Sometimes yes |
| Minimum balance | Often none | Sometimes $1,000+ |
| FDIC insured | Yes | Yes |

## Certificates of Deposit (CDs)

A CD is a savings account with a fixed term — you agree to leave your money for a set period (3 months to 5 years) in exchange for a fixed, often higher interest rate.

**Trade-off:** Higher rate in exchange for reduced liquidity. Withdraw early and pay a penalty (typically 60–180 days of interest).

**Best use cases for CDs:**
- Money you won't need for 1–5 years
- When rates are high and you want to lock in (e.g., locking in a 5% rate before the Fed cuts rates)

**CD Laddering Strategy:**
Instead of putting all money in one CD, spread it across multiple maturity dates.

Example with $10,000:
- $2,500 in 6-month CD
- $2,500 in 12-month CD
- $2,500 in 18-month CD
- $2,500 in 24-month CD

Each CD matures at a different time. If rates rise, you reinvest at higher rates. If you need money unexpectedly, only part is locked up.

## I-Bonds: Inflation-Protected Savings

I-Bonds are U.S. government savings bonds whose interest rate adjusts with inflation (CPI-based). They offer:
- Guaranteed to keep pace with inflation
- Federal tax advantage (no state/local tax)
- Redeemable after 1 year (with 3-month interest penalty)
- Free after 5 years

Purchase limit: $10,000/year per person at TreasuryDirect.gov

Best use: Long-term savings for money you want to protect from inflation.

## Account Summary: Which Account for Which Money?

| Goal | Time Horizon | Best Account |
|---|---|---|
| Emergency fund | Anytime | HYSA |
| Bills buffer | Immediate | Checking account |
| Down payment goal | 1–3 years | HYSA or MMA |
| Medium-term savings | 1–5 years | CD or HYSA |
| Inflation protection | 1–5 years | I-Bonds |
| Long-term wealth | 5+ years | Investment accounts |

## Key Takeaway

Move your emergency fund and any savings you won't need immediately to a high-yield savings account. Compare rates — they vary significantly. The opportunity cost of keeping $10,000 in a 0.01% account vs. a 4.5% account is $450/year of completely passive income you're giving up for no reason.`,
  quiz_questions: [
    {
      question: "Why do online banks offer significantly higher savings rates than traditional big banks?",
      options: [
        "Online banks take more investment risk with your money",
        "Online banks have lower overhead (no physical branches) and pass the savings to customers as higher APY",
        "They are less regulated and can offer any rate they want",
        "They only serve high-net-worth customers"
      ],
      correct_answer: 1,
      explanation: "Without the cost of physical branches and large teller staff, online banks have dramatically lower operating costs. They compete for deposits by passing those savings to customers as higher interest rates."
    },
    {
      question: "What is the main trade-off of a Certificate of Deposit (CD) compared to a high-yield savings account?",
      options: [
        "CDs are not FDIC insured",
        "CDs require a minimum deposit of $50,000",
        "CDs lock your money for a fixed term — withdrawing early incurs a penalty, but you often get a higher guaranteed rate",
        "CDs offer lower interest than savings accounts"
      ],
      correct_answer: 2,
      explanation: "CDs offer fixed rates (often higher than HYSAs) in exchange for committing your money for a set term. Early withdrawal penalties make them suitable only for money you won't need soon."
    },
    {
      question: "CD laddering refers to:",
      options: [
        "Investing in CDs at multiple banks for FDIC coverage",
        "Spreading CD investments across multiple maturity dates to maintain partial liquidity while still earning CD rates",
        "Automatically rolling over CDs at maturity",
        "Borrowing against a CD to buy another investment"
      ],
      correct_answer: 1,
      explanation: "CD laddering means splitting money across CDs with staggered maturity dates. When each CD matures, you can reinvest or access funds — balancing liquidity needs with the higher rates CDs offer."
    }
  ]
});

update("lesson-saving-004", {
  duration_minutes: 10,
  xp_reward: 90,
  content: `## Retirement Savings: 401(k), IRA, and Beyond

Retirement may feel abstract when you're in your 20s or 30s, but the math makes one thing undeniable: the earlier you start, the less you have to save. Starting at 22 vs. 32 requires roughly half the monthly contribution to reach the same retirement balance. This lesson gives you the complete framework for retirement savings.

## Why Tax-Advantaged Accounts Matter

Retirement accounts aren't just savings accounts — they're tax-optimized containers for your investments. The government provides tax incentives to encourage retirement saving. Using these accounts correctly is one of the highest-ROI financial decisions you can make.

**Two types of tax treatment:**

**Traditional (Pre-Tax):** Contribute with pre-tax dollars → reduce taxable income now → pay taxes on withdrawals in retirement. Best if you expect lower tax rates in retirement.

**Roth (Post-Tax):** Contribute with after-tax dollars → no tax break now → withdrawals in retirement are 100% tax-free. Best if you expect higher tax rates in retirement (or if you're young and in a low bracket now).

## 401(k) and 403(b): Workplace Retirement Plans

**Who offers them:** Employers. 401(k) is for private sector. 403(b) is for non-profits, schools, hospitals.

**2024 contribution limits:**
- Employee: up to $23,000/year ($30,500 if age 50+)
- Employer match: typically 50–100% of your contribution up to 3–6% of salary

**The employer match is free money.** If your employer matches 100% up to 4% of salary and you earn $60,000, that's $2,400 of free money per year — an instant 100% return on those dollars. Never fail to capture the full match.

**After vesting:** Employer match may come with a "vesting schedule" — you own the full match only after working there for 1–3 years. If you leave before vesting, you may forfeit some of the match.

## Traditional IRA

**Who can use it:** Anyone with earned income
**2024 limit:** $7,000/year ($8,000 if age 50+)
**Tax treatment:** Pre-tax contributions may be deductible (depending on income and workplace plan access)
**Best for:** People without a workplace plan, or who expect lower taxes in retirement

**Withdrawal rules:** Required minimum distributions (RMDs) starting at age 73. Early withdrawals (before 59½) face 10% penalty + income taxes.

## Roth IRA

**Who can use it:** Anyone with earned income below income limits (~$146,000 single / $230,000 married for full contribution in 2024)
**2024 limit:** $7,000/year ($8,000 if age 50+)
**Tax treatment:** Post-tax contributions → completely tax-free growth and withdrawals

**The Roth IRA is one of the most powerful financial tools available to young, lower-income earners.** Here's why:

- You're probably in a lower tax bracket now than you will be at peak earnings or retirement
- $7,000 invested today in a Roth IRA could become $100,000+ tax-free in 30 years
- No required minimum distributions — you can let it compound as long as you live
- Contributions (not earnings) can be withdrawn any time, penalty-free, if needed

## HSA: The Triple Tax Account

A **Health Savings Account (HSA)** is available only to people enrolled in a High-Deductible Health Plan (HDHP). It's technically a medical savings account, but it functions as an additional retirement account for savvy users.

**The triple tax advantage:**
1. Contributions are pre-tax (reduce taxable income)
2. Growth is tax-free
3. Withdrawals for qualified medical expenses are tax-free

After age 65, you can withdraw HSA funds for ANY purpose (just pay income tax — like a Traditional IRA).

**Strategy:** Pay current medical expenses out-of-pocket (if you can afford to) and let the HSA grow tax-free. Save all your medical receipts — you can reimburse yourself years later from the HSA, tax-free, after the money has compounded.

## The Investment Priority Order

1. **401(k) up to full employer match** — Guaranteed 50–100% return (don't skip)
2. **Max Roth IRA** — $7,000/year of tax-free growth
3. **Max HSA** (if eligible) — $4,150/year single, $8,300/year family (2024)
4. **Back to 401(k)** — Up to $23,000/year
5. **Taxable brokerage account** — No limits, no tax advantages but no restrictions

## Key Takeaway

Retirement accounts are the most tax-efficient investment vehicles available. Prioritize: 401(k) match → Roth IRA → HSA → more 401(k). Every year you delay costs you years of compounding that can't be recovered. Start now, even if the amount is small.`,
  quiz_questions: [
    {
      question: "What makes the Roth IRA especially powerful for young investors in lower tax brackets?",
      options: [
        "Contributions are tax-deductible, reducing current tax burden",
        "Contributions are made with after-tax dollars now, but all growth and withdrawals are completely tax-free — you pay taxes at today's lower rate, then compound for decades tax-free",
        "There are no contribution limits on a Roth IRA",
        "Roth IRA funds can be used for any purpose without penalty at any age"
      ],
      correct_answer: 1,
      explanation: "Young investors typically pay lower tax rates. With a Roth IRA, you pay taxes now (at a lower rate) and then grow and withdraw everything tax-free. $7,000 invested at 22 could become $100,000+ tax-free by retirement."
    },
    {
      question: "Why should capturing your full 401(k) employer match be the first investment priority?",
      options: [
        "401(k) accounts have the highest investment return guarantees",
        "An employer match is an instant 50–100% return on those dollars — no other investment can match it",
        "Maxing the 401(k) before all other accounts reduces penalties",
        "401(k) contributions are not subject to any taxes"
      ],
      correct_answer: 1,
      explanation: "If your employer matches 100% of contributions up to 4% of salary, that's a 100% instant return on those dollars before any investment gains. It's the highest guaranteed return available and should always be captured first."
    },
    {
      question: "The HSA 'triple tax advantage' means:",
      options: [
        "You can use HSA funds for three different expense categories",
        "Contributions are pre-tax, growth is tax-free, and qualified medical withdrawals are tax-free — taxes are avoided at every stage",
        "HSAs earn three times the interest of regular savings accounts",
        "You get three tax deductions per contribution"
      ],
      correct_answer: 1,
      explanation: "HSAs are uniquely powerful: pre-tax contributions reduce current income, the balance grows tax-free, and qualified medical withdrawals face no tax at any stage. No other account type avoids taxes at all three points."
    }
  ]
});

fs.writeFileSync(LESSONS_PATH, JSON.stringify(lessons, null, 2));
console.log("✅ Part 2 complete — Credit (3), Investing (5), Saving (4) lessons updated");
console.log("   Total lessons in file:", lessons.length);

if (fs.existsSync(DIST_LESSONS)) {
  fs.writeFileSync(DIST_LESSONS, JSON.stringify(lessons, null, 2));
  console.log("✅ dist/data/lessons.json also updated");
}
