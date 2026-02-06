import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, TrendingUp, Briefcase, Users, Home, GraduationCap, Wallet } from "lucide-react";
import InterestCalculator from "@/components/InterestCalculator";
import PaperTradingSimulator from "@/components/PaperTradingSimulator";
import BudgetWalkthrough from "@/components/BudgetWalkthrough";
import ScenarioBudgetSimulation from "@/components/ScenarioBudgetSimulation";

export default function Simulations() {
  const [activeSimulation, setActiveSimulation] = useState(null);

  const simulations = [
    {
      id: "budget-basics",
      title: "Build Your First Budget",
      description: "Learn the fundamentals of budgeting with an interactive walkthrough of a real budget sheet.",
      icon: Wallet,
      color: "from-lime-400 to-green-500",
      component: BudgetWalkthrough,
    },
    {
      id: "college-budget",
      title: "College Student Budget",
      description: "Navigate variable income and irregular expenses. Spread textbook costs without going negative.",
      icon: GraduationCap,
      color: "from-blue-400 to-purple-500",
      component: () => <ScenarioBudgetSimulation scenarioId={0} />,
    },
    {
      id: "first-job-budget",
      title: "New Graduate Budget",
      description: "First full-time job, first real budget. Build an emergency fund while managing debt.",
      icon: Briefcase,
      color: "from-purple-400 to-pink-500",
      component: () => <ScenarioBudgetSimulation scenarioId={1} />,
    },
    {
      id: "dual-income-budget",
      title: "Early Career Dual Income",
      description: "Two incomes, one budget. Save for a down payment while balancing lifestyle and future.",
      icon: Users,
      color: "from-cyan-400 to-blue-500",
      component: () => <ScenarioBudgetSimulation scenarioId={2} />,
    },
    {
      id: "family-budget",
      title: "Mid-Career Family Budget",
      description: "Two kids, two incomes. Add expenses without sacrificing retirement savings.",
      icon: Home,
      color: "from-orange-400 to-red-500",
      component: () => <ScenarioBudgetSimulation scenarioId={3} />,
    },
    {
      id: "paper-trading",
      title: "Paper Trading",
      description: "Practice investing with virtual money. Trade real stocks and indexes with live market data.",
      icon: TrendingUp,
      color: "from-green-400 to-emerald-500",
      component: PaperTradingSimulator,
    },
    {
      id: "investment-calculator",
      title: "Investment Growth Calculator",
      description: "Visualize how your investments can grow over time with compound interest.",
      icon: Calculator,
      color: "from-blue-400 to-cyan-500",
      component: InterestCalculator,
    },
  ];

  if (activeSimulation) {
    const Simulation = activeSimulation.component;
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <Button variant="outline" onClick={() => setActiveSimulation(null)}>
            ← Back to Simulations
          </Button>
          <Simulation />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Financial Simulations</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Practice real-world financial skills in a safe, risk-free environment
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {simulations.map((sim) => {
            const Icon = sim.icon;
            return (
              <Card
                key={sim.id}
                className="border-none shadow-xl hover:shadow-2xl transition-all cursor-pointer group"
                onClick={() => setActiveSimulation(sim)}
              >
                <CardHeader className={`bg-gradient-to-br ${sim.color} text-white rounded-t-xl`}>
                  <div className="flex flex-col gap-3">
                    <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <Icon className="w-7 h-7" />
                    </div>
                    <CardTitle className="text-xl">{sim.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-gray-700 mb-6 text-sm">{sim.description}</p>
                  <Button className="w-full bg-gradient-to-r from-lime-400 to-green-500 hover:from-lime-500 hover:to-green-600 text-white group-hover:scale-105 transition-transform">
                    Launch
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
