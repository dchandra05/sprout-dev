import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calculator, TrendingUp, Briefcase, Users, Home, GraduationCap, Wallet, ArrowLeft, Play } from "lucide-react";
import InterestCalculator from "@/components/InterestCalculator";
import PaperTradingSimulator from "@/components/PaperTradingSimulator";
import BudgetWalkthrough from "@/components/BudgetWalkthrough";
import ScenarioBudgetSimulation from "@/components/ScenarioBudgetSimulation";

const simulations = [
  {
    id: "budget-basics",
    title: "Build Your First Budget",
    description: "Step-by-step walkthrough of a real budget sheet. Learn where money goes and how to take control.",
    icon: Wallet,
    tag: "Walkthrough",
    component: BudgetWalkthrough,
  },
  {
    id: "college-budget",
    title: "College Student Budget",
    description: "Navigate variable income and irregular expenses. Spread textbook costs without going negative.",
    icon: GraduationCap,
    tag: "Simulation",
    component: () => <ScenarioBudgetSimulation scenarioId={0} />,
  },
  {
    id: "first-job-budget",
    title: "New Graduate Budget",
    description: "First full-time job, first real budget. Build an emergency fund while managing debt.",
    icon: Briefcase,
    tag: "Simulation",
    component: () => <ScenarioBudgetSimulation scenarioId={1} />,
  },
  {
    id: "dual-income-budget",
    title: "Early Career — Dual Income",
    description: "Two incomes, one budget. Save for a down payment while balancing lifestyle and future goals.",
    icon: Users,
    tag: "Simulation",
    component: () => <ScenarioBudgetSimulation scenarioId={2} />,
  },
  {
    id: "family-budget",
    title: "Mid-Career Family Budget",
    description: "Two kids, two incomes. Absorb new expenses without sacrificing retirement savings.",
    icon: Home,
    tag: "Simulation",
    component: () => <ScenarioBudgetSimulation scenarioId={3} />,
  },
  {
    id: "paper-trading",
    title: "Paper Trading",
    description: "Practice investing with virtual money. Trade real stocks and indexes without any risk.",
    icon: TrendingUp,
    tag: "Interactive",
    component: PaperTradingSimulator,
  },
  {
    id: "investment-calculator",
    title: "Investment Growth Calculator",
    description: "See how compound interest grows your money over time with adjustable inputs.",
    icon: Calculator,
    tag: "Calculator",
    component: InterestCalculator,
  },
];

export default function Simulations() {
  const [activeSimulation, setActiveSimulation] = useState(null);

  if (activeSimulation) {
    const Sim = activeSimulation.component;
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-6 md:px-8 md:py-10 space-y-6">
          <Button
            variant="outline"
            onClick={() => setActiveSimulation(null)}
            className="border-gray-200 text-gray-700 hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            All Simulations
          </Button>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-green-700 flex items-center justify-center flex-shrink-0">
              <activeSimulation.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-0.5">{activeSimulation.tag}</p>
              <h1 className="text-xl font-bold text-gray-900">{activeSimulation.title}</h1>
            </div>
          </div>

          <Sim />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8 md:px-8 md:py-12 space-y-8">

        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Financial Simulations</h1>
          <p className="text-gray-500">
            Practice real-world financial skills in a safe, interactive environment. Each simulation puts you in a realistic scenario.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {simulations.map((sim) => {
            const Icon = sim.icon;
            return (
              <div
                key={sim.id}
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-green-200 transition-all cursor-pointer group"
                onClick={() => setActiveSimulation(sim)}
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-green-700 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold text-green-700 uppercase tracking-wide">{sim.tag}</span>
                    <h3 className="font-semibold text-gray-900 text-sm leading-snug mt-0.5">{sim.title}</h3>
                  </div>
                </div>
                <p className="text-gray-500 text-xs mb-4 leading-relaxed">{sim.description}</p>
                <Button
                  className="w-full h-9 bg-green-700 hover:bg-green-800 text-white text-sm font-medium"
                  onClick={(e) => { e.stopPropagation(); setActiveSimulation(sim); }}
                >
                  <Play className="w-3.5 h-3.5 mr-1.5" />
                  Launch
                </Button>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
