import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, TrendingUp, PiggyBank, Target, BookOpen } from "lucide-react";
import BudgetWalkthrough from "@/components/BudgetWalkthrough";

export default function BudgetLesson() {
  const navigate = useNavigate();

  // If redirected from Lesson.jsx it will pass ?courseId=xxx so we can go back to the right place
  const courseId = useMemo(() => {
    const hash = window.location.hash;
    const qi   = hash.indexOf("?");
    if (qi === -1) return null;
    return new URLSearchParams(hash.slice(qi + 1)).get("courseId");
  }, []);

  const handleBack = () => {
    if (courseId) navigate(createPageUrl(`CourseDetail?id=${courseId}`));
    else navigate(createPageUrl("Learn"));
  };

  return (
    <div className="min-h-screen bg-[#ede8e3]">
      <div className="max-w-4xl mx-auto px-4 py-6 md:px-8 md:py-10 space-y-6">

        {/* Back */}
        <Button variant="outline" onClick={handleBack} className="border-gray-200 text-gray-700 hover:bg-[#ede8e3]">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {courseId ? "Back to Course" : "All Courses"}
        </Button>

        {/* Header */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 flex items-start gap-5 shadow-sm">
          <div className="w-14 h-14 rounded-xl bg-[#1c2f3c] flex items-center justify-center flex-shrink-0">
            <PiggyBank className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#1c2f3c] uppercase tracking-wide mb-1 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" /> Interactive Lesson
            </p>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Build Your First Real Budget</h1>
            <p className="text-gray-500 text-sm leading-relaxed">
              Step-by-step walkthrough of a real budget spreadsheet. Learn where your money goes and how to take control.
            </p>
          </div>
        </div>

        {/* Interactive Walkthrough */}
        <BudgetWalkthrough />

        {/* Summary */}
        <div className="bg-[#1c2f3c] rounded-2xl p-6 text-white">
          <h2 className="text-lg font-bold mb-4">What You Learned</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0">
                <Target className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-sm mb-0.5">Budget Structure</p>
                <p className="text-xs text-[#a8c4d4]">How to organize expenses by month and category</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-sm mb-0.5">Fixed vs Variable</p>
                <p className="text-xs text-[#a8c4d4]">The difference and why it matters</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0">
                <PiggyBank className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-sm mb-0.5">Real Savings</p>
                <p className="text-xs text-[#a8c4d4]">How to calculate and grow what's left over</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Test Your Knowledge?</h3>
          <p className="text-gray-500 text-sm mb-5">
            Take the interactive quiz to apply what you've learned about real-world budgeting.
          </p>
          <Button
            onClick={() => navigate(createPageUrl("BudgetQuiz"))}
            className="bg-[#1c2f3c] hover:bg-[#152330] text-white h-12 px-8 font-semibold rounded-xl"
          >
            Take the Quiz
          </Button>
        </div>

      </div>
    </div>
  );
}
