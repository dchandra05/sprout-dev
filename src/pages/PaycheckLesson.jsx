import React from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft, DollarSign } from "lucide-react";
import PaycheckStatement from "../components/PaycheckStatement";

export default function PaycheckLesson() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="max-w-5xl mx-auto space-y-6">
        <Button
          variant="outline"
          onClick={() => navigate(createPageUrl("Learn"))}
          className="shadow-md"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Courses
        </Button>

        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
              <DollarSign className="w-9 h-9 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Understanding Your First Paycheck
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Ever wonder why your paycheck is smaller than expected? We'll break down every deduction 
            so you understand exactly where your money goes—and why it matters.
          </p>
        </div>

        <PaycheckStatement />

        <div className="mt-12 bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-500 p-6 rounded-lg">
          <h3 className="font-bold text-lg text-gray-900 mb-2">🎓 What You Just Learned</h3>
          <ul className="space-y-2 text-gray-700">
            <li>• <strong>The difference between gross pay and net pay</strong></li>
            <li>• <strong>What federal and state taxes fund</strong></li>
            <li>• <strong>How Social Security and Medicare work</strong></li>
            <li>• <strong>Why pre-tax deductions save you money</strong></li>
            <li>• <strong>How to budget based on take-home pay</strong></li>
          </ul>
        </div>

        <div className="text-center">
          <Button
            onClick={() => navigate(createPageUrl("PaycheckQuiz"))}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white h-14 px-8 text-lg shadow-xl"
          >
            Test Your Knowledge →
          </Button>
        </div>
      </div>
    </div>
  );
}