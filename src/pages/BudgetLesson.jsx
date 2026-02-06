import React from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, TrendingUp, PiggyBank, Target } from "lucide-react";
import BudgetWalkthrough from "@/components/BudgetWalkthrough";

export default function BudgetLesson() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-lime-50 via-white to-green-50">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Back Button */}
        <Button
          variant="outline"
          onClick={() => navigate(createPageUrl("Learn"))}
          className="shadow-md"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Courses
        </Button>

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-block p-4 bg-gradient-to-br from-lime-400 to-green-500 rounded-2xl shadow-lg mb-4">
            <PiggyBank className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Build Your First Real Budget
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Step-by-step walkthrough of a real budget spreadsheet. Learn where your money goes and how to take control.
          </p>
        </div>

        {/* Interactive Walkthrough */}
        <BudgetWalkthrough />

        {/* Summary */}
        <Card className="border-none shadow-xl bg-gradient-to-r from-green-400 to-emerald-500 text-white">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4">What You've Learned</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <Target className="w-6 h-6 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Budget Structure</h3>
                  <p className="text-sm opacity-90">How to organize expenses by month and category</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <TrendingUp className="w-6 h-6 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Fixed vs Variable</h3>
                  <p className="text-sm opacity-90">The difference and why it matters</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <PiggyBank className="w-6 h-6 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Real Savings</h3>
                  <p className="text-sm opacity-90">How to calculate and grow what's left over</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <Card className="border-2 border-lime-200 shadow-xl">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Ready to Test Your Knowledge?</h3>
            <p className="text-gray-600 mb-6">
              Take the interactive quiz to analyze real budget scenarios and make smart financial decisions!
            </p>
            <Button
              onClick={() => navigate(createPageUrl("BudgetQuiz"))}
              className="bg-gradient-to-r from-lime-400 to-green-500 hover:from-lime-500 hover:to-green-600 text-white h-14 px-8 text-lg"
            >
              Take the Quiz
              <ArrowLeft className="w-5 h-5 ml-2 rotate-180" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
