import React from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CreditCard } from "lucide-react";
import CreditCardStatement from "../components/CreditCardStatement";

export default function CreditCardLesson() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-purple-50 via-white to-pink-50">
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
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
              <CreditCard className="w-9 h-9 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Understanding Your First Credit Card Statement
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Don't let credit card statements intimidate you! We'll walk through every section together, 
            so you'll know exactly what you're looking at and how to use it to build great credit.
          </p>
        </div>

        <CreditCardStatement />

        <div className="mt-12 bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-500 p-6 rounded-lg">
          <h3 className="font-bold text-lg text-gray-900 mb-2">🎓 What You Just Learned</h3>
          <ul className="space-y-2 text-gray-700">
            <li>• <strong>How to read a credit card statement</strong> from top to bottom</li>
            <li>• <strong>Why paying only the minimum</strong> is a debt trap</li>
            <li>• <strong>How to spot fraud</strong> by reviewing transactions</li>
            <li>• <strong>How statements affect your credit score</strong> (on-time payments & utilization)</li>
            <li>• <strong>The difference between statement date and due date</strong></li>
          </ul>
        </div>

        <div className="text-center">
          <Button
            onClick={() => navigate(createPageUrl("CreditCardQuiz"))}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white h-14 px-8 text-lg shadow-xl"
          >
            Test Your Knowledge →
          </Button>
        </div>
      </div>
    </div>
  );
}
