import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { CheckCircle2, AlertCircle, TrendingUp, Users, Briefcase, Home } from "lucide-react";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const SCENARIOS = {
  0: {
    title: "College Student — Part-Time Job, Variable Income",
    icon: Briefcase,
    age: 20,
    education: "Full-time college student",
    workExp: "Part-time",
    userIncome: 18000,
    partnerIncome: 0,
    children: 0,
    retirementSavings: 0,
    incomeLogic: (month) => {
      // May-Aug (indices 4-7): $2000, rest: $1500
      return [4, 5, 6, 7].includes(month) ? 2000 : 1500;
    },
    baseExpenses: {
      housing: 800,
      utilities: 90,
      groceries: 250,
      transportation: 120,
      insurance: 80,
      childcare: 0,
      subscriptions: 35,
      debtPayments: 0,
      dining: 180,
      misc: 100,
      retirement: 0,
      emergency: 75
    },
    challenge: {
      title: "Textbook Challenge",
      description: "Textbooks cost $600 this semester. Spread the cost over 4 months without going negative.",
      requirements: [
        "Gross Savings ≥ 0 for all months",
        "Spread $600 textbook cost over 4 months",
        "Adjust at least 2 discretionary categories"
      ]
    },
    teaching: ["Budgeting with variable income", "Avoiding negative cash flow", "Planning for irregular expenses"]
  },
  1: {
    title: "New Graduate — First Job, First Budget",
    icon: TrendingUp,
    age: 22,
    workExp: "0 years full-time",
    userIncome: 60000,
    partnerIncome: 0,
    children: 0,
    retirementSavings: 0,
    incomeLogic: () => 5000,
    baseExpenses: {
      housing: 1600,
      utilities: 160,
      groceries: 350,
      transportation: 220,
      insurance: 180,
      childcare: 0,
      subscriptions: 45,
      debtPayments: 350,
      dining: 250,
      misc: 150,
      retirement: 300,
      emergency: 250
    },
    challenge: {
      title: "Emergency Fund Challenge",
      description: "Increase Emergency Savings by +$200/month.",
      requirements: [
        "Emergency Savings increased by $200/month",
        "Must reduce at least 2 categories",
        "Total Expenditure ≤ Total Income"
      ]
    },
    teaching: ["Building an emergency fund", "Making budget tradeoffs", "Living within your means"]
  },
  2: {
    title: "Early Career — Dual Income, Planning Ahead",
    icon: Users,
    age: 30,
    workExp: "7 years",
    userIncome: 85000,
    partnerIncome: 55000,
    children: 0,
    retirementSavings: 35000,
    incomeLogic: () => ({ user: 7083, partner: 4583 }),
    baseExpenses: {
      housing: 2500,
      utilities: 240,
      groceries: 700,
      transportation: 500,
      insurance: 350,
      childcare: 0,
      subscriptions: 80,
      debtPayments: 600,
      dining: 650,
      misc: 350,
      retirement: 1500,
      emergency: 800
    },
    challenge: {
      title: "Down Payment Challenge",
      description: "Add $500/month toward down-payment savings.",
      requirements: [
        "Add new category: Down Payment Savings ($500/month)",
        "Dining/Entertainment ≥ $300",
        "No income increases allowed"
      ]
    },
    teaching: ["Dual income budgeting", "Saving for major purchases", "Balancing lifestyle and savings"]
  },
  3: {
    title: "Mid-Career Family — Two Kids, Dual Income",
    icon: Home,
    age: 40,
    workExp: "18 years",
    userIncome: 120000,
    partnerIncome: 75000,
    children: 2,
    retirementSavings: 235000,
    incomeLogic: () => ({ user: 10000, partner: 6250 }),
    baseExpenses: {
      housing: 3300,
      utilities: 380,
      groceries: 1100,
      transportation: 900,
      insurance: 600,
      childcare: 450,
      subscriptions: 95,
      debtPayments: 450,
      dining: 500,
      misc: 450,
      retirement: 2000,
      emergency: 1000
    },
    challenge: {
      title: "Activity Challenge",
      description: "New after-school activity: +$150/month.",
      requirements: [
        "Absorb $150/month cost in Childcare or Misc",
        "Cannot lower retirement contributions",
        "Total Expenditure ≤ Total Income"
      ]
    },
    teaching: ["Family budgeting", "Protecting retirement savings", "Managing increased expenses"]
  }
};

export default function ScenarioBudgetSimulation({ scenarioId = 0, onComplete }) {
  const scenario = SCENARIOS[scenarioId];
  const [budget, setBudget] = useState(() => initializeBudget(scenario));
  const [completed, setCompleted] = useState(false);

  function initializeBudget(scenario) {
    const months = [];
    for (let m = 0; m < 12; m++) {
      const income = typeof scenario.incomeLogic(m) === 'number' 
        ? scenario.incomeLogic(m)
        : scenario.incomeLogic(m).user + scenario.incomeLogic(m).partner;

      // Apply seasonal adjustments
      const seasonalUtilities = [0, 1, 11].includes(m) ? 30 : 0;
      const seasonalGroceries = [10, 11].includes(m) ? 75 : 0;

      months.push({
        month: MONTHS[m],
        income: income,
        housing: scenario.baseExpenses.housing,
        utilities: scenario.baseExpenses.utilities + seasonalUtilities,
        groceries: scenario.baseExpenses.groceries + seasonalGroceries,
        transportation: scenario.baseExpenses.transportation,
        insurance: scenario.baseExpenses.insurance,
        childcare: scenario.baseExpenses.childcare,
        subscriptions: scenario.baseExpenses.subscriptions,
        debtPayments: scenario.baseExpenses.debtPayments,
        dining: scenario.baseExpenses.dining,
        misc: scenario.baseExpenses.misc,
        retirement: scenario.baseExpenses.retirement,
        emergency: scenario.baseExpenses.emergency,
        downPayment: 0 // For scenario 2
      });
    }
    return months;
  }

  const updateCell = (monthIndex, category, value) => {
    const newBudget = [...budget];
    newBudget[monthIndex][category] = parseFloat(value) || 0;
    setBudget(newBudget);
  };

  const validation = useMemo(() => {
    let allPositive = true;
    let adjustedCategories = new Set();
    
    budget.forEach((month, idx) => {
      const totalExpense = month.housing + month.utilities + month.groceries + 
        month.transportation + month.insurance + month.childcare + 
        month.subscriptions + month.debtPayments + month.dining + 
        month.misc + month.retirement + month.emergency + (month.downPayment || 0);
      
      const savings = month.income - totalExpense;
      if (savings < 0) allPositive = false;

      // Track which categories have been changed from base
      const seasonalUtilities = [0, 1, 11].includes(idx) ? 30 : 0;
      const seasonalGroceries = [10, 11].includes(idx) ? 75 : 0;
      
      if (month.dining !== scenario.baseExpenses.dining) adjustedCategories.add('dining');
      if (month.subscriptions !== scenario.baseExpenses.subscriptions) adjustedCategories.add('subscriptions');
      if (month.misc !== scenario.baseExpenses.misc) adjustedCategories.add('misc');
    });

    // Scenario-specific validation
    let challengeMet = false;
    if (scenarioId === 0) {
      // Check at least 2 categories adjusted
      challengeMet = allPositive && adjustedCategories.size >= 2;
    } else if (scenarioId === 1) {
      const avgEmergency = budget.reduce((sum, m) => sum + m.emergency, 0) / 12;
      challengeMet = avgEmergency >= scenario.baseExpenses.emergency + 200 && adjustedCategories.size >= 2;
    } else if (scenarioId === 2) {
      const avgDownPayment = budget.reduce((sum, m) => sum + (m.downPayment || 0), 0) / 12;
      const minDining = Math.min(...budget.map(m => m.dining));
      challengeMet = avgDownPayment >= 500 && minDining >= 300 && allPositive;
    } else if (scenarioId === 3) {
      const retirementUnchanged = budget.every(m => m.retirement >= scenario.baseExpenses.retirement);
      challengeMet = allPositive && retirementUnchanged;
    }

    return { allPositive, challengeMet, adjustedCategories };
  }, [budget, scenarioId, scenario]);

  const yearlyData = useMemo(() => {
    return budget.map((month, idx) => {
      const totalExpense = month.housing + month.utilities + month.groceries + 
        month.transportation + month.insurance + month.childcare + 
        month.subscriptions + month.debtPayments + month.dining + 
        month.misc + month.retirement + month.emergency + (month.downPayment || 0);
      
      return {
        month: month.month,
        Income: month.income,
        Expenses: totalExpense,
        Savings: month.income - totalExpense
      };
    });
  }, [budget]);

  const categoryData = useMemo(() => {
    const totals = {
      Housing: 0,
      Utilities: 0,
      Groceries: 0,
      Transportation: 0,
      Insurance: 0,
      Childcare: 0,
      Subscriptions: 0,
      'Debt Payments': 0,
      'Dining/Entertainment': 0,
      Misc: 0,
      Retirement: 0,
      'Emergency Savings': 0,
      'Down Payment': 0
    };

    budget.forEach(month => {
      totals.Housing += month.housing;
      totals.Utilities += month.utilities;
      totals.Groceries += month.groceries;
      totals.Transportation += month.transportation;
      totals.Insurance += month.insurance;
      totals.Childcare += month.childcare;
      totals.Subscriptions += month.subscriptions;
      totals['Debt Payments'] += month.debtPayments;
      totals['Dining/Entertainment'] += month.dining;
      totals.Misc += month.misc;
      totals.Retirement += month.retirement;
      totals['Emergency Savings'] += month.emergency;
      totals['Down Payment'] += month.downPayment || 0;
    });

    return Object.entries(totals)
      .filter(([_, value]) => value > 0)
      .map(([name, value]) => ({ name, value }));
  }, [budget]);

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

  const handleComplete = () => {
    if (validation.challengeMet) {
      setCompleted(true);
      if (onComplete) onComplete();
    }
  };

  const Icon = scenario.icon;

  return (
    <div className="space-y-6">
      {/* Scenario Header */}
      <Card className="border-none shadow-lg bg-gradient-to-br from-blue-50 to-purple-50">
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">{scenario.title}</CardTitle>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div><span className="font-semibold">Age:</span> {scenario.age}</div>
                <div><span className="font-semibold">Work Experience:</span> {scenario.workExp}</div>
                <div><span className="font-semibold">Annual Income:</span> ${scenario.userIncome.toLocaleString()}{scenario.partnerIncome > 0 ? ` + $${scenario.partnerIncome.toLocaleString()}` : ''}</div>
                <div><span className="font-semibold">Children:</span> {scenario.children}</div>
                {scenario.retirementSavings > 0 && (
                  <div><span className="font-semibold">Retirement Savings:</span> ${scenario.retirementSavings.toLocaleString()}</div>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Challenge */}
      <Card className="border-2 border-purple-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-lg">🎯 {scenario.challenge.title}</span>
            {completed && <Badge className="bg-green-500"><CheckCircle2 className="w-4 h-4 mr-1" />Completed</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700">{scenario.challenge.description}</p>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="font-semibold mb-2">Requirements:</p>
            <ul className="space-y-1">
              {scenario.challenge.requirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <span className="text-purple-600">•</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
          {validation.challengeMet ? (
            <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-semibold text-green-900">Challenge Complete! ✨</p>
                <p className="text-sm text-green-700">Your budget balances and meets all requirements.</p>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4 flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
              <div>
                <p className="font-semibold text-yellow-900">Keep adjusting your budget</p>
                <p className="text-sm text-yellow-700">Make sure all months stay positive and requirements are met.</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Budget Table */}
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle>Monthly Budget (Full Year)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left p-2 font-semibold">Month</th>
                  <th className="text-right p-2 font-semibold bg-green-50">Income</th>
                  <th className="text-right p-2 font-semibold">Housing</th>
                  <th className="text-right p-2 font-semibold">Utilities</th>
                  <th className="text-right p-2 font-semibold">Groceries</th>
                  <th className="text-right p-2 font-semibold">Transport</th>
                  <th className="text-right p-2 font-semibold">Insurance</th>
                  {scenario.baseExpenses.childcare > 0 && <th className="text-right p-2 font-semibold">Childcare</th>}
                  <th className="text-right p-2 font-semibold">Subs</th>
                  {scenario.baseExpenses.debtPayments > 0 && <th className="text-right p-2 font-semibold">Debt</th>}
                  <th className="text-right p-2 font-semibold">Dining</th>
                  <th className="text-right p-2 font-semibold">Misc</th>
                  <th className="text-right p-2 font-semibold">Retirement</th>
                  <th className="text-right p-2 font-semibold">Emergency</th>
                  {scenarioId === 2 && <th className="text-right p-2 font-semibold">Down Pay</th>}
                  <th className="text-right p-2 font-semibold bg-blue-50">Total Exp</th>
                  <th className="text-right p-2 font-semibold bg-purple-50">Savings</th>
                </tr>
              </thead>
              <tbody>
                {budget.map((month, idx) => {
                  const totalExpense = month.housing + month.utilities + month.groceries + 
                    month.transportation + month.insurance + month.childcare + 
                    month.subscriptions + month.debtPayments + month.dining + 
                    month.misc + month.retirement + month.emergency + (month.downPayment || 0);
                  const savings = month.income - totalExpense;

                  return (
                    <tr key={idx} className={`border-b ${savings < 0 ? 'bg-red-50' : ''}`}>
                      <td className="p-2 font-semibold">{month.month}</td>
                      <td className="p-2 text-right bg-green-50">${month.income.toFixed(0)}</td>
                      <td className="p-1">
                        <Input
                          type="number"
                          value={month.housing}
                          onChange={(e) => updateCell(idx, 'housing', e.target.value)}
                          className="w-20 h-8 text-right text-xs"
                        />
                      </td>
                      <td className="p-1">
                        <Input
                          type="number"
                          value={month.utilities}
                          onChange={(e) => updateCell(idx, 'utilities', e.target.value)}
                          className="w-20 h-8 text-right text-xs"
                        />
                      </td>
                      <td className="p-1">
                        <Input
                          type="number"
                          value={month.groceries}
                          onChange={(e) => updateCell(idx, 'groceries', e.target.value)}
                          className="w-20 h-8 text-right text-xs"
                        />
                      </td>
                      <td className="p-1">
                        <Input
                          type="number"
                          value={month.transportation}
                          onChange={(e) => updateCell(idx, 'transportation', e.target.value)}
                          className="w-20 h-8 text-right text-xs"
                        />
                      </td>
                      <td className="p-1">
                        <Input
                          type="number"
                          value={month.insurance}
                          onChange={(e) => updateCell(idx, 'insurance', e.target.value)}
                          className="w-20 h-8 text-right text-xs"
                        />
                      </td>
                      {scenario.baseExpenses.childcare > 0 && (
                        <td className="p-1">
                          <Input
                            type="number"
                            value={month.childcare}
                            onChange={(e) => updateCell(idx, 'childcare', e.target.value)}
                            className="w-20 h-8 text-right text-xs"
                          />
                        </td>
                      )}
                      <td className="p-1">
                        <Input
                          type="number"
                          value={month.subscriptions}
                          onChange={(e) => updateCell(idx, 'subscriptions', e.target.value)}
                          className="w-20 h-8 text-right text-xs"
                        />
                      </td>
                      {scenario.baseExpenses.debtPayments > 0 && (
                        <td className="p-1">
                          <Input
                            type="number"
                            value={month.debtPayments}
                            onChange={(e) => updateCell(idx, 'debtPayments', e.target.value)}
                            className="w-20 h-8 text-right text-xs"
                          />
                        </td>
                      )}
                      <td className="p-1">
                        <Input
                          type="number"
                          value={month.dining}
                          onChange={(e) => updateCell(idx, 'dining', e.target.value)}
                          className="w-20 h-8 text-right text-xs"
                        />
                      </td>
                      <td className="p-1">
                        <Input
                          type="number"
                          value={month.misc}
                          onChange={(e) => updateCell(idx, 'misc', e.target.value)}
                          className="w-20 h-8 text-right text-xs"
                        />
                      </td>
                      <td className="p-1">
                        <Input
                          type="number"
                          value={month.retirement}
                          onChange={(e) => updateCell(idx, 'retirement', e.target.value)}
                          className="w-20 h-8 text-right text-xs"
                        />
                      </td>
                      <td className="p-1">
                        <Input
                          type="number"
                          value={month.emergency}
                          onChange={(e) => updateCell(idx, 'emergency', e.target.value)}
                          className="w-20 h-8 text-right text-xs"
                        />
                      </td>
                      {scenarioId === 2 && (
                        <td className="p-1">
                          <Input
                            type="number"
                            value={month.downPayment || 0}
                            onChange={(e) => updateCell(idx, 'downPayment', e.target.value)}
                            className="w-20 h-8 text-right text-xs"
                          />
                        </td>
                      )}
                      <td className="p-2 text-right font-semibold bg-blue-50">${totalExpense.toFixed(0)}</td>
                      <td className={`p-2 text-right font-semibold ${savings >= 0 ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                        ${savings.toFixed(0)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle>Yearly Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={yearlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => `$${value.toFixed(0)}`} />
                <Legend />
                <Bar dataKey="Income" fill="#10b981" />
                <Bar dataKey="Expenses" fill="#3b82f6" />
                <Bar dataKey="Savings" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle>Annual Spending by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => `${entry.name}: $${entry.value.toFixed(0)}`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toFixed(0)}`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Teaching Focus */}
      <Card className="border-none shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle>Key Learning Points</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {scenario.teaching.map((point, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <span className="text-gray-700">{point}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {validation.challengeMet && !completed && (
        <Button
          onClick={handleComplete}
          className="w-full h-14 text-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
        >
          <CheckCircle2 className="w-5 h-5 mr-2" />
          Complete Challenge & Continue
        </Button>
      )}
    </div>
  );
}