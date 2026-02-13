// src/pages/AILiteracy.jsx
// Public AI Literacy course hub (no auth / no guest checks)
// Routes days to: /ai-literacy/day/1 ... /ai-literacy/day/10

import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  ChevronRight,
  Trophy,
  Calendar,
  Clock,
  Zap,
  Target,
  BookOpen,
  Lock,
  CheckCircle,
} from "lucide-react";

export default function AILiteracy() {
  const navigate = useNavigate();

  const days = [
    { number: 1, title: "What is AI and Why AI Literacy Matters", icon: Brain, color: "from-purple-400 to-pink-500" },
    { number: 2, title: "How Machines Learn: Data, Training, and Models", icon: Target, color: "from-blue-400 to-cyan-500" },
    { number: 3, title: "AI in the Real World", icon: BookOpen, color: "from-green-400 to-emerald-500" },
    { number: 4, title: "Generative AI and Hallucinations", icon: Zap, color: "from-yellow-400 to-orange-500" },
    { number: 5, title: "Using AI Effectively", icon: Target, color: "from-indigo-400 to-purple-500" },
    { number: 6, title: "Ethics: Bias, Privacy, Deepfakes", icon: Brain, color: "from-red-400 to-pink-500" },
    { number: 7, title: "AI and Society", icon: BookOpen, color: "from-teal-400 to-cyan-500" },
    { number: 8, title: "Practical AI Skills Lab", icon: Zap, color: "from-lime-400 to-green-500" },
    { number: 9, title: "Capstone + Review", icon: Trophy, color: "from-orange-400 to-red-500" },
    { number: 10, title: "Final Exam + Certification", icon: Trophy, color: "from-purple-500 to-pink-600" },
  ];

  const goToDay = (dayNumber) => {
    navigate(`/ai-literacy/day/${dayNumber}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-block p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg">
            <Brain className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            AI Literacy Course
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A comprehensive 2-week program teaching you to understand, use, and critically evaluate AI
          </p>
        </div>

        {/* Course Days */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Course Days</h2>
          <div className="grid gap-4">
            {days.map((day) => {
              return (
                <Card
                  key={day.number}
                  className="border-none shadow-lg transition-all cursor-pointer hover:shadow-2xl bg-white/80 backdrop-blur-sm"
                  onClick={() => goToDay(day.number)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      {/* Day Number Circle */}
                      <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br ${day.color} flex-shrink-0`}
                      >
                        <span className="text-2xl font-bold text-white">{day.number}</span>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-bold text-gray-900">
                            Day {day.number}
                          </h3>
                          <Badge className="bg-purple-100 text-purple-700">
                            Available
                          </Badge>
                        </div>
                        <p className="text-gray-600">{day.title}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            60 min
                          </span>
                          <span className="flex items-center gap-1">
                            <Zap className="w-4 h-4 text-yellow-500" />
                            100 XP
                          </span>
                        </div>
                      </div>

                      {/* Arrow */}
                      <ChevronRight className="w-6 h-6 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Optional: Course completion callout (static) */}
        <Card className="border-none shadow-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <CardContent className="p-8 text-center">
            <Trophy className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-2">Finish all 10 days</h2>
            <p className="text-lg opacity-90 mb-6">
              Complete the course and take the final day for a certificate experience.
            </p>
            <button
              onClick={() => goToDay(10)}
              className="inline-flex items-center justify-center rounded-md bg-white px-4 py-2 text-purple-600 font-medium hover:bg-gray-100"
            >
              Go to Day 10
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
