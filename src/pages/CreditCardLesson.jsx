import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CreditCard, BookOpen } from "lucide-react";
import CreditCardStatement from "../components/CreditCardStatement";

export default function CreditCardLesson() {
  const navigate = useNavigate();

  // If redirected from Lesson.jsx it will pass ?courseId=xxx so we can return to the right course
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
            <CreditCard className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#1c2f3c] uppercase tracking-wide mb-1 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" /> Interactive Lesson
            </p>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Understanding Your Credit Card Statement</h1>
            <p className="text-gray-500 text-sm leading-relaxed">
              Walk through every section of a real credit card statement so you'll know exactly what you're looking at.
            </p>
          </div>
        </div>

        {/* Interactive statement */}
        <CreditCardStatement />

        {/* Summary */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-3">What You Learned</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-[#dce4e8] text-[#1c2f3c] flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">✓</span>
              <span>How to read a credit card statement <strong>from top to bottom</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-[#dce4e8] text-[#1c2f3c] flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">✓</span>
              <span>Why <strong>paying only the minimum</strong> is a debt trap</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-[#dce4e8] text-[#1c2f3c] flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">✓</span>
              <span>How to <strong>spot fraudulent charges</strong> by reviewing transactions</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-[#dce4e8] text-[#1c2f3c] flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">✓</span>
              <span>How statements affect your <strong>credit score</strong> (payments & utilization)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-[#dce4e8] text-[#1c2f3c] flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">✓</span>
              <span>The difference between <strong>statement date and due date</strong></span>
            </li>
          </ul>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button
            onClick={() => navigate(createPageUrl("CreditCardQuiz"))}
            className="bg-[#1c2f3c] hover:bg-[#152330] text-white h-12 px-8 font-semibold rounded-xl"
          >
            Test Your Knowledge
          </Button>
        </div>

      </div>
    </div>
  );
}
