import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { Calculator, TrendingUp, Info, Lightbulb } from "lucide-react";

export default function InterestCalculator() {
  const [inputs, setInputs] = useState({
    startingAmount: 10000,
    returnRate: 8,
    years: 30,
    additionalContribution: 1000,
    contributionFrequency: "annually",
    contributionTiming: "end",
    compoundFrequency: "annually",
  });

  const [displayValues, setDisplayValues] = useState({
    startingAmount: "10000",
    returnRate: "8",
    years: "30",
    additionalContribution: "1000",
  });

  const [calculated, setCalculated] = useState(false);

  const calculateInvestment = useMemo(() => {
    if (!calculated) return null;

    const {
      startingAmount, returnRate, years, additionalContribution,
      contributionFrequency, contributionTiming, compoundFrequency,
    } = inputs;

    const r = returnRate / 100;
    const compoundPerYear = compoundFrequency === "monthly" ? 12 : compoundFrequency === "quarterly" ? 4 : 1;
    const contributionPerYear = contributionFrequency === "monthly" ? 12 : 1;
    const depositPerContribution = additionalContribution;
    const periodsPerYear = Math.max(compoundPerYear, contributionPerYear);
    const totalPeriods = years * periodsPerYear;
    const ratePerPeriod = r / compoundPerYear;
    const compoundEvery = periodsPerYear / compoundPerYear;
    const contributeEvery = periodsPerYear / contributionPerYear;

    const schedule = [];
    let balance = startingAmount;
    let totalDeposits = startingAmount;

    for (let year = 1; year <= years; year++) {
      const yearStartBalance = balance;
      let yearDeposits = 0;

      for (let p = 1; p <= periodsPerYear; p++) {
        const isContributionPeriod = p % contributeEvery === 0;
        const isCompoundPeriod = p % compoundEvery === 0;

        if (contributionTiming === "beginning" && isContributionPeriod) {
          balance += depositPerContribution;
          yearDeposits += depositPerContribution;
          totalDeposits += depositPerContribution;
        }
        if (isCompoundPeriod) {
          balance = balance * (1 + ratePerPeriod);
        }
        if (contributionTiming === "end" && isContributionPeriod) {
          balance += depositPerContribution;
          yearDeposits += depositPerContribution;
          totalDeposits += depositPerContribution;
        }
      }

      const interest = balance - yearStartBalance - yearDeposits;
      schedule.push({
        year,
        deposit: yearDeposits,
        interest,
        endingBalance: balance,
        startingAmount,
        contributions: totalDeposits - startingAmount,
        totalInterest: balance - totalDeposits,
      });
    }

    return {
      endBalance: balance,
      startingAmount,
      totalContributions: totalDeposits - startingAmount,
      totalInterest: balance - totalDeposits,
      schedule,
    };
  }, [inputs, calculated]);

  const handleCalculate = () => setCalculated(true);

  const fmt = (v) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v);

  const pieData =
    calculated && calculateInvestment
      ? [
          { name: "Starting Amount", value: calculateInvestment.startingAmount },
          { name: "Contributions", value: calculateInvestment.totalContributions },
          { name: "Interest Earned", value: calculateInvestment.totalInterest },
        ]
      : [];

  const PIE_COLORS = ["#15803d", "#4ade80", "#86efac"];
  const BAR_COLORS = { starting: "#15803d", contributions: "#4ade80", interest: "#bbf7d0" };

  const selectClass =
    "w-full h-11 px-3 border border-gray-200 rounded-lg bg-white text-gray-900 text-sm focus:border-green-700 focus:ring-1 focus:ring-green-700 focus:outline-none";

  return (
    <div className="space-y-6">
      {/* Intro */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-start gap-3 shadow-sm">
        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
          <Info className="w-4 h-4 text-green-700" />
        </div>
        <div>
          <p className="font-semibold text-gray-900 text-sm mb-1">How to use this calculator</p>
          <p className="text-gray-600 text-sm leading-relaxed">
            Enter your starting amount, how long you plan to invest, your expected annual return rate, and any regular contributions.
            Click <strong>Calculate</strong> to see how your investment grows over time through the power of compound interest.
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
          <Calculator className="w-4 h-4 text-green-700" />
          <h2 className="font-semibold text-gray-900">Investment Growth Calculator</h2>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Inputs */}
            <div className="space-y-5">
              <div>
                <Label htmlFor="startingAmount" className="text-sm font-semibold text-gray-700 mb-1.5 block">
                  Starting Amount
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                  <Input
                    id="startingAmount"
                    type="text"
                    value={displayValues.startingAmount}
                    onChange={(e) => {
                      const val = e.target.value;
                      setDisplayValues((d) => ({ ...d, startingAmount: val }));
                      setInputs((s) => ({ ...s, startingAmount: val === "" ? 0 : parseFloat(val) || 0 }));
                      setCalculated(false);
                    }}
                    className="pl-7 h-11 text-sm border-gray-200 focus:border-green-700"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="years" className="text-sm font-semibold text-gray-700 mb-1.5 block">
                  Investment Length
                </Label>
                <div className="flex gap-2 items-center">
                  <Input
                    id="years"
                    type="text"
                    value={displayValues.years}
                    onChange={(e) => {
                      const val = e.target.value;
                      setDisplayValues((d) => ({ ...d, years: val }));
                      setInputs((s) => ({ ...s, years: val === "" ? 0 : parseInt(val) || 0 }));
                      setCalculated(false);
                    }}
                    className="h-11 text-sm border-gray-200 focus:border-green-700"
                  />
                  <span className="text-sm text-gray-500 whitespace-nowrap">years</span>
                </div>
              </div>

              <div>
                <Label htmlFor="returnRate" className="text-sm font-semibold text-gray-700 mb-1.5 block">
                  Annual Return Rate
                </Label>
                <div className="flex gap-2 items-center">
                  <Input
                    id="returnRate"
                    type="text"
                    value={displayValues.returnRate}
                    onChange={(e) => {
                      const val = e.target.value;
                      setDisplayValues((d) => ({ ...d, returnRate: val }));
                      setInputs((s) => ({ ...s, returnRate: val === "" ? 0 : parseFloat(val) || 0 }));
                      setCalculated(false);
                    }}
                    className="h-11 text-sm border-gray-200 focus:border-green-700"
                  />
                  <span className="text-sm text-gray-500">%</span>
                </div>
              </div>

              <div>
                <Label htmlFor="compoundFrequency" className="text-sm font-semibold text-gray-700 mb-1.5 block">
                  Compound Frequency
                </Label>
                <select
                  id="compoundFrequency"
                  value={inputs.compoundFrequency}
                  onChange={(e) => { setInputs((s) => ({ ...s, compoundFrequency: e.target.value })); setCalculated(false); }}
                  className={selectClass}
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="annually">Annually</option>
                </select>
              </div>

              <div>
                <Label htmlFor="additionalContribution" className="text-sm font-semibold text-gray-700 mb-1.5 block">
                  Additional Contribution
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                  <Input
                    id="additionalContribution"
                    type="text"
                    value={displayValues.additionalContribution}
                    onChange={(e) => {
                      const val = e.target.value;
                      setDisplayValues((d) => ({ ...d, additionalContribution: val }));
                      setInputs((s) => ({ ...s, additionalContribution: val === "" ? 0 : parseFloat(val) || 0 }));
                      setCalculated(false);
                    }}
                    className="pl-7 h-11 text-sm border-gray-200 focus:border-green-700"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-semibold text-gray-700 mb-2 block">Contribution Timing</Label>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  <div className="flex gap-4">
                    {["beginning", "end"].map((val) => (
                      <label key={val} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                        <input
                          type="radio"
                          name="timing"
                          value={val}
                          checked={inputs.contributionTiming === val}
                          onChange={(e) => { setInputs((s) => ({ ...s, contributionTiming: e.target.value })); setCalculated(false); }}
                          className="accent-green-700"
                        />
                        {val.charAt(0).toUpperCase() + val.slice(1)} of period
                      </label>
                    ))}
                  </div>
                  <div className="flex gap-4">
                    {[["monthly", "Monthly"], ["annually", "Annually"]].map(([val, label]) => (
                      <label key={val} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                        <input
                          type="radio"
                          name="frequency"
                          value={val}
                          checked={inputs.contributionFrequency === val}
                          onChange={(e) => { setInputs((s) => ({ ...s, contributionFrequency: e.target.value })); setCalculated(false); }}
                          className="accent-green-700"
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                onClick={handleCalculate}
                className="w-full h-11 bg-green-700 hover:bg-green-800 text-white font-semibold"
              >
                <Calculator className="w-4 h-4 mr-2" />
                Calculate
              </Button>
            </div>

            {/* Results */}
            <div>
              <div className="bg-green-700 rounded-t-xl p-5 text-white">
                <h3 className="font-semibold text-sm text-green-200 mb-3">Results</h3>
                {calculated && calculateInvestment ? (
                  <div className="space-y-3">
                    <div>
                      <p className="text-green-200 text-xs mb-0.5">Ending Balance</p>
                      <p className="text-3xl font-bold">{fmt(calculateInvestment.endBalance)}</p>
                    </div>
                    <div className="h-px bg-white/20" />
                    <div className="space-y-2">
                      {[
                        ["Starting Amount", calculateInvestment.startingAmount],
                        ["Total Contributions", calculateInvestment.totalContributions],
                        ["Interest Earned", calculateInvestment.totalInterest],
                      ].map(([label, val]) => (
                        <div key={label} className="flex justify-between items-center text-sm">
                          <span className="text-green-200">{label}</span>
                          <span className="font-semibold">{fmt(val)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-green-200 text-sm text-center py-8">
                    Enter your details and click Calculate to see results.
                  </p>
                )}
              </div>

              {calculated && calculateInvestment && (
                <div className="bg-white border border-t-0 border-gray-200 rounded-b-xl p-4">
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                        outerRadius={70}
                        dataKey="value"
                      >
                        {pieData.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v) => fmt(v)} />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Results interpretation */}
      {calculated && calculateInvestment && (() => {
        const { endBalance, startingAmount, totalContributions, totalInterest } = calculateInvestment;
        const interestPct = Math.round((totalInterest / endBalance) * 100);
        const growthMultiple = (endBalance / (startingAmount + totalContributions)).toFixed(1);
        const insights = [];
        if (interestPct > 50) insights.push(`Interest earned makes up ${interestPct}% of your ending balance — this is compound interest doing the heavy lifting.`);
        if (inputs.years >= 20) insights.push(`Over ${inputs.years} years, your money grew ${growthMultiple}x — time is the most powerful variable in investing.`);
        if (totalContributions > startingAmount) insights.push(`Your ongoing contributions (${fmt(totalContributions)}) exceeded your starting amount — consistent investing matters more than a large starting balance.`);
        return insights.length > 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4 text-green-700" />
              <p className="font-semibold text-gray-900 text-sm">What These Numbers Mean</p>
            </div>
            <div className="space-y-2">
              {insights.map((insight, i) => (
                <div key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-600 flex-shrink-0 mt-1.5" />
                  {insight}
                </div>
              ))}
            </div>
          </div>
        ) : null;
      })()}

      {/* Growth chart + schedule */}
      {calculated && calculateInvestment && (
        <>
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-700" />
              <h3 className="font-semibold text-gray-900">Investment Growth Over Time</h3>
            </div>
            <div className="p-5">
              <ResponsiveContainer width="100%" height={380}>
                <BarChart data={calculateInvestment.schedule}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => fmt(v)} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="startingAmount" stackId="a" fill={BAR_COLORS.starting} name="Starting Amount" />
                  <Bar dataKey="contributions" stackId="a" fill={BAR_COLORS.contributions} name="Contributions" />
                  <Bar dataKey="totalInterest" stackId="a" fill={BAR_COLORS.interest} name="Interest Earned" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Accumulation Schedule</h3>
              <p className="text-xs text-gray-400 mt-0.5">Annual breakdown of deposits, interest earned, and balance</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-green-700 text-white">
                    <th className="p-3 text-left font-semibold">Year</th>
                    <th className="p-3 text-right font-semibold">Deposit</th>
                    <th className="p-3 text-right font-semibold">Interest</th>
                    <th className="p-3 text-right font-semibold">Ending Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {calculateInvestment.schedule.map((row) => (
                    <tr key={row.year} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-3 font-medium text-gray-900">{row.year}</td>
                      <td className="p-3 text-right text-gray-700">{fmt(row.deposit)}</td>
                      <td className="p-3 text-right text-green-700">{fmt(row.interest)}</td>
                      <td className="p-3 text-right font-semibold text-gray-900">{fmt(row.endingBalance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
