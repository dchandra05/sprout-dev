import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import {
  CheckCircle2, XCircle, AlertCircle, TrendingUp, Users, Briefcase,
  Home, Target, Lightbulb, ChevronRight, BarChart2, ArrowRight,
  GraduationCap, DollarSign, ShieldCheck, Info,
} from "lucide-react";

// ─── constants ────────────────────────────────────────────────────────────────

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const PHASE_LABELS = ["Introduction","Your Situation","Budget Lab","Results","Complete"];

// Which columns the user edits in the lab (all others are fixed/read-only)
const EDITABLE_KEYS = {
  0: ["dining","subscriptions","misc","emergency"],
  1: ["dining","subscriptions","misc","emergency"],
  2: ["dining","subscriptions","misc","downPayment"],
  3: ["childcare","dining","subscriptions","misc"],
};

const COL_META = {
  dining:        { label: "Dining",            description: "Restaurants, takeout, coffee" },
  subscriptions: { label: "Subscriptions",     description: "Streaming, apps, memberships" },
  misc:          { label: "Miscellaneous",      description: "Entertainment, personal care, gifts" },
  emergency:     { label: "Emergency Fund",     description: "Monthly contribution to emergency savings" },
  downPayment:   { label: "Down Payment",       description: "Monthly contribution toward house down payment" },
  childcare:     { label: "Childcare",          description: "After-school activities and child expenses" },
};

const CHART_GREENS = ["#15803d","#16a34a","#22c55e","#4ade80","#86efac","#bbf7d0","#dcfce7","#f0fdf4"];

// ─── scenario data ─────────────────────────────────────────────────────────────

const SCENARIOS = {
  0: {
    title: "College Student Budget",
    subtitle: "Part-Time Job, Variable Income",
    icon: GraduationCap,
    age: 20,
    workExp: "Part-time",
    userIncome: 18000,
    partnerIncome: 0,
    children: 0,
    intro: "You're a 20-year-old college student working part-time during the school year and full-time over summer. Your income rises in summer but drops when classes start — and textbooks add a $600 expense each semester.",
    whyItMatters: "Variable income is one of the most common financial challenges for students and early-career workers. Learning to budget around income fluctuations — and planning ahead for predictable large expenses — is a skill that pays off for life.",
    whatYouWillDo: [
      "Review your monthly income and unavoidable fixed costs",
      "Adjust your discretionary spending to avoid going into the red",
      "Spread a $600 textbook expense across 4 months",
      "Keep every month's budget at zero or positive",
    ],
    incomeLogic: (m) => [4,5,6,7].includes(m) ? 2000 : 1500,
    baseExpenses: {
      housing:800, utilities:90, groceries:250, transportation:120,
      insurance:80, childcare:0, subscriptions:35, debtPayments:0,
      dining:180, misc:100, retirement:0, emergency:75,
    },
    challenge: {
      title: "Textbook Challenge",
      description: "Textbooks cost $600 this semester. Without going into the red, spread that cost across 4 months while keeping your budget balanced year-round.",
      requirements: [
        { key:"allPositive",    label:"Every month shows zero or positive savings" },
        { key:"twoAdjusted",    label:"At least 2 spending categories adjusted from default" },
      ],
    },
    teaching: [
      { headline:"Budget for the worst month first", body:"Your lowest-income months determine your spending ceiling — not your highest." },
      { headline:"Irregular expenses aren't surprises", body:"Textbooks, car registration, subscriptions — these happen every year. Put them in the budget." },
      { headline:"Small cuts compound", body:"Reducing dining by $50/month saves $600 over the year — exactly the cost of textbooks." },
    ],
  },
  1: {
    title: "New Graduate Budget",
    subtitle: "First Job, First Budget",
    icon: Briefcase,
    age: 22,
    workExp: "Entry-level, 0 years",
    userIncome: 60000,
    partnerIncome: 0,
    children: 0,
    intro: "You just landed your first full-time job at $60,000/year ($5,000/month take-home). With a steady paycheck comes real financial responsibility: rent, student loans, and the need to build a financial safety net from scratch.",
    whyItMatters: "Most financial advisors recommend 3–6 months of expenses as an emergency fund. Starting early is the single most impactful thing a new graduate can do for long-term financial security.",
    whatYouWillDo: [
      "Review your fixed monthly obligations including rent and debt payments",
      "Identify discretionary categories you can reduce",
      "Raise your emergency fund contributions by $200/month",
      "Keep your total budget from going negative",
    ],
    incomeLogic: () => 5000,
    baseExpenses: {
      housing:1600, utilities:160, groceries:350, transportation:220,
      insurance:180, childcare:0, subscriptions:45, debtPayments:350,
      dining:250, misc:150, retirement:300, emergency:250,
    },
    challenge: {
      title: "Emergency Fund Challenge",
      description: "Increase your Emergency Fund contribution to at least $450/month by reducing other spending categories.",
      requirements: [
        { key:"emergencyMet",  label:"Emergency Fund raised to $450+/month" },
        { key:"twoAdjusted",   label:"At least 2 other categories reduced" },
        { key:"allPositive",   label:"Budget stays balanced every month" },
      ],
    },
    teaching: [
      { headline:"Pay yourself first", body:"Treating your emergency fund as a non-negotiable expense is the fastest way to build financial resilience." },
      { headline:"Trade-offs are not sacrifices", body:"Spending $50 less on dining to save $50 more isn't a loss — it's a reallocation toward security." },
      { headline:"Automation beats willpower", body:"Auto-transfer to savings on payday removes the temptation to spend it." },
    ],
  },
  2: {
    title: "Early Career — Dual Income",
    subtitle: "Planning Ahead for a Major Purchase",
    icon: Users,
    age: 30,
    workExp: "7 years experience",
    userIncome: 85000,
    partnerIncome: 55000,
    children: 0,
    intro: "You and your partner both work well-paying jobs. After years of renting, you're ready to buy a home. Saving $500/month toward a down payment requires cutting elsewhere without sacrificing your quality of life.",
    whyItMatters: "Saving for a major goal like a home requires deliberate monthly contributions. Understanding how to fit a savings goal into a full budget — without eliminating every enjoyable expense — is the hallmark of mature financial planning.",
    whatYouWillDo: [
      "Review your combined household income and fixed obligations",
      "Add a $500/month down payment savings category",
      "Offset the new savings by reducing other discretionary spending",
      "Keep dining/entertainment above $300/month and stay balanced",
    ],
    incomeLogic: () => ({ user: 7083, partner: 4583 }),
    baseExpenses: {
      housing:2500, utilities:240, groceries:700, transportation:500,
      insurance:350, childcare:0, subscriptions:80, debtPayments:600,
      dining:650, misc:350, retirement:1500, emergency:800,
    },
    challenge: {
      title: "Down Payment Challenge",
      description: "Add $500/month to a down payment savings category. Offset it by reducing other spending — but keep Dining at $300 or above.",
      requirements: [
        { key:"downPaymentMet", label:"Down Payment savings set to $500+/month" },
        { key:"diningMet",      label:"Dining kept at $300 or higher" },
        { key:"allPositive",    label:"Budget balanced every month" },
      ],
    },
    teaching: [
      { headline:"Savings goals need a line item", body:"A goal without a budget allocation is just a wish. Adding Down Payment to the budget makes it real." },
      { headline:"Protect quality of life — within reason", body:"Keeping dining above $300 shows that budgeting isn't about eliminating enjoyment, just being intentional." },
      { headline:"Use windfalls wisely", body:"Bonuses and tax refunds can accelerate savings goals significantly without changing your monthly budget." },
    ],
  },
  3: {
    title: "Mid-Career Family Budget",
    subtitle: "Two Kids, Dual Income",
    icon: Home,
    age: 40,
    workExp: "18 years experience",
    userIncome: 120000,
    partnerIncome: 75000,
    children: 2,
    intro: "You're 40, raising two kids with your partner, and comfortably saving for retirement. A new after-school activity adds $150/month to your household budget. You need to absorb it without reducing your retirement contributions.",
    whyItMatters: "Mid-career families often face 'budget creep' — incremental cost increases that slowly erode savings if left unchecked. Protecting long-term financial goals while managing short-term cost increases is the defining budgeting challenge of this life stage.",
    whatYouWillDo: [
      "Review your household's income, fixed costs, and retirement position",
      "Add $150/month to Childcare or Miscellaneous for the new activity",
      "Offset the increase by reducing other discretionary spending",
      "Protect your $2,000/month retirement contribution",
    ],
    incomeLogic: () => ({ user: 10000, partner: 6250 }),
    baseExpenses: {
      housing:3300, utilities:380, groceries:1100, transportation:900,
      insurance:600, childcare:450, subscriptions:95, debtPayments:450,
      dining:500, misc:450, retirement:2000, emergency:1000,
    },
    challenge: {
      title: "Activity Challenge",
      description: "Absorb a $150/month after-school activity cost. Adjust Childcare or Misc accordingly — and do not reduce retirement contributions.",
      requirements: [
        { key:"activityAbsorbed",     label:"$150/month added to Childcare or Misc" },
        { key:"retirementProtected",  label:"Retirement contributions not reduced" },
        { key:"allPositive",          label:"Budget balanced every month" },
      ],
    },
    teaching: [
      { headline:"Protect retirement above all else", body:"Retirement savings compound over decades. Every $1 not saved at 40 costs far more than $1 at retirement." },
      { headline:"Budget creep is invisible until it's not", body:"$150/month seems small, but unaddressed it adds $1,800/year to fixed costs indefinitely." },
      { headline:"Review and adjust quarterly", body:"Families with kids face continuously changing expenses. Regular budget reviews prevent drift." },
    ],
  },
};

// ─── helpers ────────────────────────────────────────────────────────────────

function initializeBudget(scenario) {
  return Array.from({ length: 12 }, (_, m) => {
    const inc = scenario.incomeLogic(m);
    const income = typeof inc === "number" ? inc : inc.user + inc.partner;
    return {
      month: MONTHS[m],
      income,
      housing:       scenario.baseExpenses.housing,
      utilities:     scenario.baseExpenses.utilities + ([0,1,11].includes(m) ? 30 : 0),
      groceries:     scenario.baseExpenses.groceries  + ([10,11].includes(m) ? 75 : 0),
      transportation:scenario.baseExpenses.transportation,
      insurance:     scenario.baseExpenses.insurance,
      childcare:     scenario.baseExpenses.childcare,
      subscriptions: scenario.baseExpenses.subscriptions,
      debtPayments:  scenario.baseExpenses.debtPayments,
      dining:        scenario.baseExpenses.dining,
      misc:          scenario.baseExpenses.misc,
      retirement:    scenario.baseExpenses.retirement,
      emergency:     scenario.baseExpenses.emergency,
      downPayment:   0,
    };
  });
}

function monthTotal(m) {
  return m.housing + m.utilities + m.groceries + m.transportation + m.insurance +
    m.childcare + m.subscriptions + m.debtPayments + m.dining + m.misc +
    m.retirement + m.emergency + (m.downPayment || 0);
}

function computeFixedTotal(m) {
  return m.housing + m.utilities + m.groceries + m.transportation +
    m.insurance + m.debtPayments;
}

// ─── sub-components ────────────────────────────────────────────────────────────

function PhaseStepper({ phase }) {
  return (
    <div className="flex items-center gap-1 mb-6">
      {PHASE_LABELS.map((label, i) => (
        <React.Fragment key={i}>
          <div className={`flex items-center gap-1.5 ${i <= phase ? "opacity-100" : "opacity-40"}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
              i < phase  ? "bg-green-700 text-white" :
              i === phase ? "bg-green-700 text-white ring-4 ring-green-100" :
              "bg-gray-200 text-gray-500"
            }`}>
              {i < phase ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
            </div>
            <span className={`text-xs font-medium hidden sm:block ${i === phase ? "text-green-700" : "text-gray-400"}`}>
              {label}
            </span>
          </div>
          {i < PHASE_LABELS.length - 1 && (
            <div className={`flex-1 h-px mx-1 ${i < phase ? "bg-green-700" : "bg-gray-200"}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function RequirementRow({ met, label }) {
  return (
    <div className={`flex items-center gap-2 text-sm py-1 ${met ? "text-green-800" : "text-gray-600"}`}>
      {met
        ? <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
        : <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0" />
      }
      {label}
    </div>
  );
}

// ─── main component ─────────────────────────────────────────────────────────────

export default function ScenarioBudgetSimulation({ scenarioId = 0, onComplete }) {
  const scenario  = SCENARIOS[scenarioId];
  const editKeys  = EDITABLE_KEYS[scenarioId];
  const Icon      = scenario.icon;

  const [phase,  setPhase]  = useState(0);
  const [budget, setBudget] = useState(() => initializeBudget(scenario));

  const updateCell = (mi, key, val) => {
    setBudget(prev => {
      const next = [...prev];
      next[mi] = { ...next[mi], [key]: parseFloat(val) || 0 };
      return next;
    });
  };

  // ── derived data ──────────────────────────────────────────────────────────
  const budgetWithTotals = useMemo(() =>
    budget.map(m => ({
      ...m,
      totalExpense: monthTotal(m),
      surplus: m.income - monthTotal(m),
      fixedTotal:  computeFixedTotal(m),
    })), [budget]);

  const validation = useMemo(() => {
    const allPositive  = budgetWithTotals.every(m => m.surplus >= 0);
    const negCount     = budgetWithTotals.filter(m => m.surplus < 0).length;
    const base         = scenario.baseExpenses;

    const adjustedKeys = new Set();
    if (budget[0].dining        !== base.dining)        adjustedKeys.add("dining");
    if (budget[0].subscriptions !== base.subscriptions) adjustedKeys.add("subscriptions");
    if (budget[0].misc          !== base.misc)          adjustedKeys.add("misc");
    if (budget[0].emergency     !== base.emergency)     adjustedKeys.add("emergency");

    let reqs = {};
    let challengeMet = false;

    if (scenarioId === 0) {
      reqs = {
        allPositive,
        twoAdjusted: adjustedKeys.size >= 2,
      };
      challengeMet = reqs.allPositive && reqs.twoAdjusted;

    } else if (scenarioId === 1) {
      const avgEmergency = budget.reduce((s, m) => s + m.emergency, 0) / 12;
      reqs = {
        emergencyMet: avgEmergency >= base.emergency + 200,
        twoAdjusted:  adjustedKeys.size >= 2,
        allPositive,
      };
      challengeMet = reqs.emergencyMet && reqs.twoAdjusted && reqs.allPositive;

    } else if (scenarioId === 2) {
      const avgDown    = budget.reduce((s, m) => s + (m.downPayment || 0), 0) / 12;
      const minDining  = Math.min(...budget.map(m => m.dining));
      reqs = {
        downPaymentMet: avgDown   >= 500,
        diningMet:      minDining >= 300,
        allPositive,
      };
      challengeMet = reqs.downPaymentMet && reqs.diningMet && reqs.allPositive;

    } else if (scenarioId === 3) {
      const baseChildcare = base.childcare;
      const baseMisc      = base.misc;
      const avgAdded = budget.reduce((s, m) =>
        s + (m.childcare - baseChildcare) + (m.misc - baseMisc), 0) / 12;
      const retirementSafe = budget.every(m => m.retirement >= base.retirement);
      reqs = {
        activityAbsorbed:    avgAdded >= 150,
        retirementProtected: retirementSafe,
        allPositive,
      };
      challengeMet = reqs.activityAbsorbed && reqs.retirementProtected && reqs.allPositive;
    }

    const metCount = Object.values(reqs).filter(Boolean).length;
    const totalReqs = Object.values(reqs).length;

    // Active tip
    let tip = null;
    if (!allPositive) {
      const worst = budgetWithTotals.reduce((a, b) => b.surplus < a.surplus ? b : a);
      tip = `${negCount} month${negCount > 1 ? "s are" : " is"} over budget. ${worst.month} is your worst (${worst.surplus < 0 ? "-$" + Math.abs(worst.surplus).toFixed(0) : ""}).`;
    } else if (!challengeMet) {
      if (scenarioId === 0 && !reqs.twoAdjusted)
        tip = `Reduce at least ${2 - adjustedKeys.size} more spending category to satisfy the challenge.`;
      else if (scenarioId === 1 && !reqs.emergencyMet)
        tip = `Increase Emergency Fund contributions. You need at least $450/month (average across all months).`;
      else if (scenarioId === 2 && !reqs.downPaymentMet)
        tip = "Set the Down Payment column to $500 or more for every month.";
      else if (scenarioId === 2 && !reqs.diningMet)
        tip = "Keep Dining at $300 or above — you've gone below the minimum in some months.";
      else if (scenarioId === 3 && !reqs.activityAbsorbed)
        tip = "Add the $150/month activity cost to Childcare or Misc (or split it between them).";
    } else {
      tip = "All requirements met. You can now view your results.";
    }

    return { allPositive, negCount, challengeMet, reqs, metCount, totalReqs, tip };
  }, [budget, budgetWithTotals, scenarioId, scenario]);

  // ── charts ────────────────────────────────────────────────────────────────
  const barData = useMemo(() =>
    budgetWithTotals.map(m => ({
      month: m.month,
      Income: m.income,
      Expenses: m.totalExpense,
      Savings: Math.max(0, m.surplus),
    })), [budgetWithTotals]);

  const pieData = useMemo(() => {
    const totals = {};
    budget.forEach(m => {
      [
        ["Housing",       m.housing],
        ["Utilities",     m.utilities],
        ["Groceries",     m.groceries],
        ["Transport",     m.transportation],
        ["Insurance",     m.insurance],
        ...(m.childcare   ? [["Childcare",   m.childcare]]   : []),
        ...(m.debtPayments? [["Debt",        m.debtPayments]]: []),
        ["Dining",        m.dining],
        ["Misc",          m.misc],
        ...(m.subscriptions ? [["Subs",      m.subscriptions]] : []),
        ...(m.retirement  ? [["Retirement",  m.retirement]]  : []),
        ...(m.emergency   ? [["Emergency",   m.emergency]]   : []),
        ...(m.downPayment ? [["Down Pmt",    m.downPayment]] : []),
      ].forEach(([k, v]) => { totals[k] = (totals[k] || 0) + v; });
    });
    return Object.entries(totals).filter(([, v]) => v > 0).map(([name, value]) => ({ name, value }));
  }, [budget]);

  // ── score ─────────────────────────────────────────────────────────────────
  const score = useMemo(() => {
    if (validation.challengeMet) return 100;
    const positiveMonths = budgetWithTotals.filter(m => m.surplus >= 0).length;
    const baseScore = Math.round((positiveMonths / 12) * 60);
    const reqScore  = Math.round((validation.metCount / validation.totalReqs) * 40);
    return baseScore + reqScore;
  }, [validation, budgetWithTotals]);

  const fmt = (v) => `$${Math.abs(v).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE 0: INTRODUCTION
  // ═══════════════════════════════════════════════════════════════════════════
  if (phase === 0) return (
    <div className="space-y-5">
      <PhaseStepper phase={0} />

      <div className="bg-green-700 rounded-2xl p-7 text-white">
        <div className="flex items-start gap-4 mb-5">
          <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Icon className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-green-200 text-xs font-semibold uppercase tracking-widest mb-1">Budget Simulation</p>
            <h2 className="text-2xl font-bold leading-snug">{scenario.title}</h2>
            <p className="text-green-200 text-sm mt-0.5">{scenario.subtitle}</p>
          </div>
        </div>
        <p className="text-green-100 leading-relaxed text-sm">{scenario.intro}</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-4 h-4 text-green-700" />
          <p className="font-semibold text-gray-900 text-sm">Why this matters</p>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed">{scenario.whyItMatters}</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">What you will do</p>
        <ol className="space-y-3">
          {scenario.whatYouWillDo.map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-green-100 text-green-800 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span className="text-gray-700 text-sm">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Your challenge</p>
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-4 h-4 text-green-700 flex-shrink-0" />
          <p className="font-semibold text-gray-900 text-sm">{scenario.challenge.title}</p>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed">{scenario.challenge.description}</p>
      </div>

      <Button
        onClick={() => setPhase(1)}
        className="w-full h-12 bg-green-700 hover:bg-green-800 text-white font-semibold text-base"
      >
        Start Simulation
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE 1: SITUATION REVIEW
  // ═══════════════════════════════════════════════════════════════════════════
  if (phase === 1) {
    const base     = scenario.baseExpenses;
    const fixedAmt = base.housing + base.utilities + base.groceries + base.transportation + base.insurance + base.debtPayments;
    const incomeValues = Array.from({ length: 12 }, (_, m) => {
      const inc = scenario.incomeLogic(m);
      return typeof inc === "number" ? inc : inc.user + inc.partner;
    });
    const uniqueIncomes = [...new Set(incomeValues)].sort((a, b) => a - b);
    const minIncome = Math.min(...incomeValues);

    const fixedItems = [
      { label: "Housing / Rent",   amount: base.housing },
      { label: "Utilities",        amount: base.utilities, note: "Varies seasonally" },
      { label: "Groceries",        amount: base.groceries, note: "Slightly higher in Nov–Dec" },
      { label: "Transportation",   amount: base.transportation },
      { label: "Insurance",        amount: base.insurance },
      ...(base.debtPayments > 0 ? [{ label: "Debt Payments", amount: base.debtPayments }] : []),
      ...(base.retirement    > 0 && !EDITABLE_KEYS[scenarioId].includes("retirement")
          ? [{ label: "Retirement (401k)", amount: base.retirement }] : []),
      ...(base.emergency     > 0 && !EDITABLE_KEYS[scenarioId].includes("emergency")
          ? [{ label: "Emergency Fund",    amount: base.emergency }]  : []),
    ];
    const fixedTotal = fixedItems.reduce((s, i) => s + i.amount, 0);

    return (
      <div className="space-y-5">
        <PhaseStepper phase={1} />

        {/* Profile */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Financial Profile</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              ["Age",        scenario.age],
              ["Experience", scenario.workExp],
              ["Annual Income", `$${scenario.userIncome.toLocaleString()}${scenario.partnerIncome ? ` + $${scenario.partnerIncome.toLocaleString()}` : ""}`],
              ["Children",   scenario.children || "None"],
            ].map(([k, v]) => (
              <div key={k} className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">{k}</p>
                <p className="font-semibold text-gray-900 text-sm">{v}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly income */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Monthly Take-Home Income</p>
          {uniqueIncomes.length > 1 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800">
                Your income varies by season. Budget based on your <strong>lowest month</strong> (${minIncome.toLocaleString()}).
              </p>
            </div>
          )}
          <div className="grid grid-cols-6 md:grid-cols-12 gap-1.5">
            {incomeValues.map((inc, i) => {
              const isHigh = inc === Math.max(...incomeValues);
              return (
                <div key={i} className={`rounded-lg p-2 text-center ${isHigh ? "bg-green-100 border border-green-300" : "bg-gray-50 border border-gray-200"}`}>
                  <p className="text-[10px] text-gray-400">{MONTHS[i]}</p>
                  <p className={`text-xs font-bold ${isHigh ? "text-green-700" : "text-gray-700"}`}>
                    ${(inc / 1000).toFixed(1)}k
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Fixed costs */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Fixed Monthly Costs</p>
            <span className="text-xs text-gray-400 bg-gray-100 rounded px-2 py-0.5">Cannot be changed</span>
          </div>
          <div className="space-y-2">
            {fixedItems.map(({ label, amount, note }) => (
              <div key={label} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                <div>
                  <span className="text-sm text-gray-700">{label}</span>
                  {note && <span className="text-xs text-gray-400 ml-1.5">({note})</span>}
                </div>
                <span className="text-sm font-semibold text-gray-800">${amount.toLocaleString()}/mo</span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-700">Total Fixed Costs</span>
            <span className="font-bold text-gray-900">${fixedTotal.toLocaleString()}/mo</span>
          </div>
          <div className="mt-2 bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-xs text-green-800">
              Remaining for adjustable spending in your lowest-income month:{" "}
              <strong>{fmt(minIncome - fixedTotal)}/month</strong>
            </p>
          </div>
        </div>

        {/* Adjustable preview */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">What You Can Adjust</p>
          <div className="grid md:grid-cols-2 gap-3">
            {editKeys.map(k => (
              <div key={k} className="flex items-start gap-2.5 p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="w-2 h-2 rounded-full bg-green-600 flex-shrink-0 mt-1.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">{COL_META[k]?.label}</p>
                  <p className="text-xs text-gray-500">{COL_META[k]?.description}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Default: <span className="font-medium">${scenario.baseExpenses[k] ?? 0}/mo</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Challenge reminder */}
        <div className="bg-white border border-green-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-green-700" />
            <p className="font-semibold text-gray-900 text-sm">{scenario.challenge.title}</p>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed mb-3">{scenario.challenge.description}</p>
          <div className="space-y-1">
            {scenario.challenge.requirements.map(({ label }) => (
              <div key={label} className="flex items-center gap-2 text-xs text-gray-500">
                <div className="w-3 h-3 rounded-full border border-gray-300 flex-shrink-0" />
                {label}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setPhase(0)} className="border-gray-200 text-gray-700 flex-1">
            Back
          </Button>
          <Button onClick={() => setPhase(2)} className="bg-green-700 hover:bg-green-800 text-white flex-1 h-11 font-semibold">
            Begin Budget Lab
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE 2: BUDGET LAB
  // ═══════════════════════════════════════════════════════════════════════════
  if (phase === 2) {
    const { reqs, challengeMet, negCount, tip } = validation;

    return (
      <div className="space-y-5">
        <PhaseStepper phase={2} />

        {/* Challenge status bar */}
        <div className={`rounded-xl p-4 border ${challengeMet ? "bg-green-50 border-green-200" : "bg-white border-gray-200"} shadow-sm`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-green-700" />
              <p className="font-semibold text-gray-900 text-sm">{scenario.challenge.title}</p>
            </div>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              challengeMet ? "bg-green-700 text-white" : "bg-gray-100 text-gray-600"
            }`}>
              {validation.metCount}/{validation.totalReqs} requirements met
            </span>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-1.5 mb-3">
            {scenario.challenge.requirements.map(({ key, label }) => (
              <RequirementRow key={key} met={reqs[key] ?? false} label={label} />
            ))}
          </div>
          {tip && (
            <div className={`flex items-start gap-2 text-xs rounded-lg p-3 ${
              challengeMet ? "bg-green-100 text-green-800" : "bg-amber-50 text-amber-800 border border-amber-200"
            }`}>
              {challengeMet
                ? <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                : <Lightbulb   className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              }
              {tip}
            </div>
          )}
        </div>

        {/* Month health strip */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Monthly Balance</p>
          <div className="grid grid-cols-6 md:grid-cols-12 gap-1.5">
            {budgetWithTotals.map((m, i) => {
              const ok = m.surplus >= 0;
              const tight = ok && m.surplus < 100;
              return (
                <div key={i} title={`${m.month}: ${ok ? "+" : "-"}${fmt(m.surplus)}`}
                  className={`rounded-lg p-2 text-center cursor-default ${
                    !ok    ? "bg-red-50 border border-red-300"    :
                    tight  ? "bg-amber-50 border border-amber-200" :
                             "bg-green-50 border border-green-200"
                  }`}>
                  <p className="text-[10px] text-gray-500">{m.month}</p>
                  <p className={`text-[11px] font-bold ${!ok ? "text-red-600" : tight ? "text-amber-700" : "text-green-700"}`}>
                    {ok ? "+" : "-"}{fmt(m.surplus)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Budget table — only editable + key columns */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">Budget Table — Full Year</h3>
              <p className="text-xs text-gray-400 mt-0.5">Adjust the editable columns. Red rows are over budget.</p>
            </div>
          </div>
          <div className="overflow-x-auto px-4 pb-4">
            <table className="w-full text-sm mt-3">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 pr-3 text-xs font-semibold text-gray-500 whitespace-nowrap">Month</th>
                  <th className="text-right py-2 px-2 text-xs font-semibold text-green-700 bg-green-50 rounded whitespace-nowrap">Income</th>
                  <th className="text-right py-2 px-2 text-xs font-semibold text-gray-400 whitespace-nowrap">Fixed</th>
                  {editKeys.map(k => (
                    <th key={k} className="text-center py-2 px-2 text-xs font-semibold text-gray-700 whitespace-nowrap">
                      {COL_META[k]?.label ?? k}
                    </th>
                  ))}
                  <th className="text-right py-2 px-2 text-xs font-semibold text-gray-500 whitespace-nowrap">Total</th>
                  <th className="text-right py-2 px-2 text-xs font-semibold text-gray-700 whitespace-nowrap">Balance</th>
                </tr>
              </thead>
              <tbody>
                {budgetWithTotals.map((m, mi) => (
                  <tr key={mi} className={`border-b border-gray-100 ${m.surplus < 0 ? "bg-red-50" : "hover:bg-gray-50"}`}>
                    <td className="py-1 pr-3 text-xs font-medium text-gray-900">{m.month}</td>
                    <td className="py-1 px-2 text-right text-xs font-semibold text-green-700 bg-green-50">{fmt(m.income)}</td>
                    <td className="py-1 px-2 text-right text-xs text-gray-400">{fmt(m.fixedTotal)}</td>
                    {editKeys.map(k => (
                      <td key={k} className="p-1">
                        <Input
                          type="number"
                          value={budget[mi][k] ?? 0}
                          onChange={e => updateCell(mi, k, e.target.value)}
                          className="w-20 h-7 text-right text-xs border-gray-200 focus:border-green-600"
                          min={0}
                        />
                      </td>
                    ))}
                    <td className="py-1 px-2 text-right text-xs font-semibold text-gray-700">{fmt(m.totalExpense)}</td>
                    <td className={`py-1 px-2 text-right text-xs font-bold ${m.surplus >= 0 ? "text-green-700" : "text-red-600"}`}>
                      {m.surplus >= 0 ? "+" : "-"}{fmt(m.surplus)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setPhase(1)} className="border-gray-200 text-gray-700 flex-1">
            Back
          </Button>
          <Button
            onClick={() => setPhase(3)}
            disabled={!challengeMet}
            className={`flex-1 h-11 font-semibold ${
              challengeMet ? "bg-green-700 hover:bg-green-800 text-white" : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {challengeMet ? "View Results" : "Complete the challenge to continue"}
            {challengeMet && <ArrowRight className="w-4 h-4 ml-2" />}
          </Button>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE 3: RESULTS
  // ═══════════════════════════════════════════════════════════════════════════
  if (phase === 3) {
    const avgSurplus  = budgetWithTotals.reduce((s, m) => s + m.surplus, 0) / 12;
    const bestMonth   = budgetWithTotals.reduce((a, b) => b.surplus > a.surplus ? b : a);
    const worstMonth  = budgetWithTotals.reduce((a, b) => b.surplus < a.surplus ? b : a);
    const totalSaved  = budgetWithTotals.reduce((s, m) => s + Math.max(0, m.surplus), 0);

    return (
      <div className="space-y-5">
        <PhaseStepper phase={3} />

        {/* Score card */}
        <div className="bg-green-700 rounded-2xl p-6 text-white">
          <p className="text-green-200 text-xs font-semibold uppercase tracking-widest mb-2">Your Result</p>
          <div className="flex items-end gap-4 mb-4">
            <div>
              <p className="text-6xl font-bold leading-none">{score}</p>
              <p className="text-green-200 text-sm">/ 100</p>
            </div>
            <div className="flex-1">
              <div className="h-3 bg-white/20 rounded-full overflow-hidden mb-1">
                <div className="h-full bg-white rounded-full transition-all" style={{ width: `${score}%` }} />
              </div>
              <p className="text-green-100 text-sm">
                {score === 100 ? "Perfect balance. All requirements met." :
                 score >= 80  ? "Strong performance. Minor adjustments could improve this." :
                 score >= 60  ? "Decent start. Several areas to improve." :
                                "Keep adjusting. The budget needs more work."}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              ["Avg Monthly Balance", avgSurplus >= 0 ? `+${fmt(avgSurplus)}` : `-${fmt(avgSurplus)}`],
              ["Best Month",  `${bestMonth.month} +${fmt(bestMonth.surplus)}`],
              ["Worst Month", `${worstMonth.month} ${worstMonth.surplus < 0 ? "-" : "+"}${fmt(worstMonth.surplus)}`],
            ].map(([label, value]) => (
              <div key={label} className="bg-white/10 rounded-xl p-3">
                <p className="text-green-200 text-[10px] mb-1">{label}</p>
                <p className="text-white font-semibold text-sm">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Charts */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 className="w-4 h-4 text-green-700" />
            <p className="font-semibold text-gray-900 text-sm">Monthly Overview</p>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barData} barSize={10} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={v => fmt(v)} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="Income"   fill="#15803d" />
              <Bar dataKey="Expenses" fill="#9ca3af" />
              <Bar dataKey="Savings"  fill="#4ade80" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 className="w-4 h-4 text-green-700" />
            <p className="font-semibold text-gray-900 text-sm">Annual Spending by Category</p>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name"
                cx="50%" cy="50%" outerRadius={90} labelLine={false}
                label={({ name, percent }) => percent > 0.06 ? `${name} ${(percent*100).toFixed(0)}%` : ""}
              >
                {pieData.map((_, i) => <Cell key={i} fill={CHART_GREENS[i % CHART_GREENS.length]} />)}
              </Pie>
              <Tooltip formatter={v => fmt(v)} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Challenge result */}
        <div className="bg-white border border-green-200 rounded-xl p-5 shadow-sm">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Challenge Outcome</p>
          <div className="space-y-2">
            {scenario.challenge.requirements.map(({ key, label }) => (
              <RequirementRow key={key} met={validation.reqs[key] ?? false} label={label} />
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setPhase(2)} className="border-gray-200 text-gray-700 flex-1">
            Back to Lab
          </Button>
          <Button onClick={() => {
            if (onComplete) onComplete();
            setPhase(4);
          }} className="bg-green-700 hover:bg-green-800 text-white flex-1 h-11 font-semibold">
            View Takeaways
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE 4: COMPLETE + LEARNING TAKEAWAYS
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <div className="space-y-5">
      <PhaseStepper phase={4} />

      <div className="bg-white border border-green-200 rounded-2xl p-7 text-center shadow-sm">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-700" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Simulation Complete</h2>
        <p className="text-gray-500 text-sm">
          You completed the <strong>{scenario.challenge.title}</strong> and scored <strong>{score}/100</strong>.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Learning Takeaways</p>
        <div className="space-y-4">
          {scenario.teaching.map(({ headline, body }, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-bold text-green-700">{i + 1}</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{headline}</p>
                <p className="text-gray-500 text-sm mt-0.5">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="w-4 h-4 text-green-700" />
          <p className="font-semibold text-green-900 text-sm">Apply This in Real Life</p>
        </div>
        <p className="text-green-800 text-sm leading-relaxed">
          The decisions you practiced here — cutting discretionary spending, protecting savings, planning for irregular costs — are directly applicable to your real financial situation. Start with one category and make one change this month.
        </p>
      </div>

      <Button
        onClick={() => {
          setPhase(0);
          setBudget(initializeBudget(scenario));
        }}
        variant="outline"
        className="w-full border-gray-200 text-gray-700"
      >
        Reset &amp; Try Again
      </Button>
    </div>
  );
}
