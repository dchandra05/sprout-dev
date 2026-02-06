import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Calculator, TrendingUp } from "lucide-react";

export default function InterestCalculator() {
  const [inputs, setInputs] = useState({
    startingAmount: 10000,
    returnRate: 8,
    years: 30,
    additionalContribution: 1000,
    contributionFrequency: "annually", // "monthly" | "annually"
    contributionTiming: "end", // "beginning" | "end"
    compoundFrequency: "annually", // "monthly" | "quarterly" | "annually"
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
      startingAmount,
      returnRate,
      years,
      additionalContribution,
      contributionFrequency,
      contributionTiming,
      compoundFrequency,
    } = inputs;

    const r = returnRate / 100;

    const compoundPerYear = compoundFrequency === "monthly" ? 12 : compoundFrequency === "quarterly" ? 4 : 1;
    const contributionPerYear = contributionFrequency === "monthly" ? 12 : 1;

    // per-contribution deposit amount (monthly means input is per-month; annually means per-year)
    const depositPerContribution = additionalContribution;

    // effective timeline: we’ll simulate at the smaller of (compound, contribution) resolutions
    const periodsPerYear = Math.max(compoundPerYear, contributionPerYear);
    const totalPeriods = years * periodsPerYear;

    const ratePerPeriod = r / compoundPerYear; // compounding happens at compoundPerYear
    const compoundEvery = periodsPerYear / compoundPerYear; // integer
    const contributeEvery = periodsPerYear / contributionPerYear; // integer

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

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(value);

  const pieData =
    calculated && calculateInvestment
      ? [
          { name: "Starting Amount", value: calculateInvestment.startingAmount },
          { name: "Total Contributions", value: calculateInvestment.totalContributions },
          { name: "Interest", value: calculateInvestment.totalInterest },
        ]
      : [];

  const COLORS = ["#3b82f6", "#84cc16", "#dc2626"];

  return (
    <div className="space-y-6">
      <Card className="border-2 border-blue-200 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Calculator className="w-6 h-6" />
            Investment Growth Calculator
          </CardTitle>
          <p className="text-sm text-blue-50 mt-2">Modify the values and click Calculate to see your investment grow</p>
        </CardHeader>

        <CardContent className="p-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Inputs */}
            <div className="space-y-6">
              <div>
                <Label htmlFor="startingAmount" className="text-base font-semibold text-gray-700">
                  Starting Amount
                </Label>
                <div className="relative mt-2">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    id="startingAmount"
                    type="text"
                    value={displayValues.startingAmount}
                    onChange={(e) => {
                      const val = e.target.value;
                      setDisplayValues((d) => ({ ...d, startingAmount: val }));
                      setInputs((s) => ({ ...s, startingAmount: val === "" ? 0 : parseFloat(val) || 0 }));
                    }}
                    className="pl-8 h-12 text-base border-2"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="years" className="text-base font-semibold text-gray-700">
                  Investment Length
                </Label>
                <div className="relative mt-2 flex gap-2">
                  <Input
                    id="years"
                    type="text"
                    value={displayValues.years}
                    onChange={(e) => {
                      const val = e.target.value;
                      setDisplayValues((d) => ({ ...d, years: val }));
                      setInputs((s) => ({ ...s, years: val === "" ? 0 : parseInt(val) || 0 }));
                    }}
                    className="h-12 text-base border-2"
                  />
                  <span className="flex items-center text-gray-600">years</span>
                </div>
              </div>

              <div>
                <Label htmlFor="returnRate" className="text-base font-semibold text-gray-700">
                  Return Rate
                </Label>
                <div className="relative mt-2 flex gap-2">
                  <Input
                    id="returnRate"
                    type="text"
                    value={displayValues.returnRate}
                    onChange={(e) => {
                      const val = e.target.value;
                      setDisplayValues((d) => ({ ...d, returnRate: val }));
                      setInputs((s) => ({ ...s, returnRate: val === "" ? 0 : parseFloat(val) || 0 }));
                    }}
                    className="h-12 text-base border-2"
                  />
                  <span className="flex items-center text-gray-600">%</span>
                </div>
              </div>

              <div>
                <Label htmlFor="compoundFrequency" className="text-base font-semibold text-gray-700">
                  Compound
                </Label>
                <select
                  id="compoundFrequency"
                  value={inputs.compoundFrequency}
                  onChange={(e) => setInputs((s) => ({ ...s, compoundFrequency: e.target.value }))}
                  className="w-full h-12 mt-2 px-4 border-2 border-gray-300 rounded-lg bg-white text-base focus:border-blue-500 focus:outline-none"
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="annually">Annually</option>
                </select>
              </div>

              <div>
                <Label htmlFor="additionalContribution" className="text-base font-semibold text-gray-700">
                  Additional Contribution
                </Label>
                <div className="relative mt-2">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    id="additionalContribution"
                    type="text"
                    value={displayValues.additionalContribution}
                    onChange={(e) => {
                      const val = e.target.value;
                      setDisplayValues((d) => ({ ...d, additionalContribution: val }));
                      setInputs((s) => ({ ...s, additionalContribution: val === "" ? 0 : parseFloat(val) || 0 }));
                    }}
                    className="pl-8 h-12 text-base border-2"
                  />
                </div>
              </div>

              <div>
                <Label className="text-base font-semibold text-gray-700">Contribute at the</Label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="timing"
                      value="beginning"
                      checked={inputs.contributionTiming === "beginning"}
                      onChange={(e) => setInputs((s) => ({ ...s, contributionTiming: e.target.value }))}
                      className="w-4 h-4"
                    />
                    <span>beginning</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="timing"
                      value="end"
                      checked={inputs.contributionTiming === "end"}
                      onChange={(e) => setInputs((s) => ({ ...s, contributionTiming: e.target.value }))}
                      className="w-4 h-4"
                    />
                    <span>end</span>
                  </label>
                </div>

                <div className="flex gap-4 mt-2">
                  <span className="text-sm text-gray-600">of each</span>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="frequency"
                      value="monthly"
                      checked={inputs.contributionFrequency === "monthly"}
                      onChange={(e) => setInputs((s) => ({ ...s, contributionFrequency: e.target.value }))}
                      className="w-4 h-4"
                    />
                    <span>month</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="frequency"
                      value="annually"
                      checked={inputs.contributionFrequency === "annually"}
                      onChange={(e) => setInputs((s) => ({ ...s, contributionFrequency: e.target.value }))}
                      className="w-4 h-4"
                    />
                    <span>year</span>
                  </label>
                </div>
              </div>

              <Button onClick={handleCalculate} className="w-full h-14 text-lg bg-green-600 hover:bg-green-700 text-white shadow-lg">
                Calculate
              </Button>
            </div>

            {/* Results */}
            <div>
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-t-xl">
                <h3 className="text-xl font-bold mb-4">Results</h3>
                {calculated && calculateInvestment ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-green-100">End Balance</span>
                      <span className="text-2xl font-bold">{formatCurrency(calculateInvestment.endBalance)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-green-100">Starting Amount</span>
                      <span className="font-semibold">{formatCurrency(calculateInvestment.startingAmount)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-green-100">Total Contributions</span>
                      <span className="font-semibold">{formatCurrency(calculateInvestment.totalContributions)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-green-100">Total Interest</span>
                      <span className="font-semibold">{formatCurrency(calculateInvestment.totalInterest)}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-green-100 text-center py-8">Click Calculate to see results</p>
                )}
              </div>

              {calculated && calculateInvestment && (
                <div className="bg-white p-6 rounded-b-xl border-2 border-t-0 border-gray-200">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        dataKey="value"
                      >
                        {pieData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chart + Schedule */}
      {calculated && calculateInvestment && (
        <>
          <Card className="border-2 border-gray-200 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-lime-500" />
                Investment Growth Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={calculateInvestment.schedule}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Bar dataKey="startingAmount" stackId="a" fill="#3b82f6" name="Starting Amount" />
                  <Bar dataKey="contributions" stackId="a" fill="#84cc16" name="Contributions" />
                  <Bar dataKey="totalInterest" stackId="a" fill="#dc2626" name="Interest" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-200 shadow-xl">
            <CardHeader>
              <CardTitle>Accumulation Schedule</CardTitle>
              <div className="flex gap-4 mt-2">
                <Badge className="bg-blue-100 text-blue-700">Annual Schedule</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-blue-600 text-white">
                    <tr>
                      <th className="p-3 text-left">Year</th>
                      <th className="p-3 text-right">Deposit</th>
                      <th className="p-3 text-right">Interest</th>
                      <th className="p-3 text-right">Ending Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calculateInvestment.schedule.map((row) => (
                      <tr key={row.year} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-semibold">{row.year}</td>
                        <td className="p-3 text-right">{formatCurrency(row.deposit)}</td>
                        <td className="p-3 text-right">{formatCurrency(row.interest)}</td>
                        <td className="p-3 text-right font-semibold">{formatCurrency(row.endingBalance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
