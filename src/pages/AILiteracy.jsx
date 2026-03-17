// src/pages/AILiteracy.jsx
// Fixes:
//  1. Background changed to white (was purple gradient)
//  2. Added prominent "Continue Learning" / "Start Course" CTA button
//  3. Removed purple color scheme — uses site-standard green
//  4. Clean, professional layout matching rest of Sprout

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  CheckCircle,
  Lock,
  Clock,
  Zap,
  Play,
  ArrowLeft,
  Trophy,
  ChevronRight,
  Target,
  BookOpen,
  LogIn,
} from "lucide-react";

import {
  getCurrentUserSafe,
  getAIDayProgress,
} from "@/lib/appClient";

// ── AI Day definitions ─────────────────────────────────────────

const DAYS = [
  { number: 1,  title: "What is AI and Why AI Literacy Matters" },
  { number: 2,  title: "How Machines Learn: Data, Training, and Models" },
  { number: 3,  title: "Computer Vision and Image Recognition" },
  { number: 4,  title: "Generative AI and Hallucinations" },
  { number: 5,  title: "Using AI Effectively: Prompt Engineering" },
  { number: 6,  title: "AI Ethics: Bias, Privacy, and Deepfakes" },
  { number: 7,  title: "AI and the Future of Work" },
  { number: 8,  title: "Real-World AI Applications Across Industries" },
  { number: 9,  title: "Building Your AI Toolkit" },
  { number: 10, title: "Course Wrap-Up and Final Assessment" },
];

// ── Helpers ────────────────────────────────────────────────────

const safeParse = (r, fb) => { try { return r ? JSON.parse(r) : fb; } catch { return fb; } };
const getLocalUser = () => safeParse(localStorage.getItem("sprout_user"), null);

export default function AILiteracy() {
  const navigate = useNavigate();
  const [user, setUser]           = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        // Try Supabase user first, fall back to localStorage
        const remoteUser = await getCurrentUserSafe().catch(() => null);
        const localUser  = getLocalUser();
        const resolved   = remoteUser || localUser;
        setUser(resolved || { isGuest: true });
      } catch {
        const localUser = getLocalUser();
        setUser(localUser || { isGuest: true });
      } finally {
        setIsLoadingUser(false);
      }
    };
    load();
  }, []);

  // Fetch AI day progress for all 10 days
  const { data: dayProgressList = [] } = useQuery({
    queryKey: ["allAIDayProgress", user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const results = await Promise.all(
        DAYS.map((d) =>
          getAIDayProgress({ user_email: user.email, day_number: d.number }).catch(() => null)
        )
      );
      return results.filter(Boolean);
    },
    enabled: !!user && !user.isGuest,
  });

  // ── Derived values ─────────────────────────────────────────

  const getDayStatus = (dayNumber) => {
    if (!user || user.isGuest) return "available";
    const prog = dayProgressList.find((p) => p.day_number === dayNumber);
    if (prog?.completed) return "completed";
    if (dayNumber === 1) return "available";
    const prevProg = dayProgressList.find((p) => p.day_number === dayNumber - 1);
    if (prevProg?.completed) return "available";
    return "locked";
  };

  const completedDays   = dayProgressList.filter((p) => p.completed).length;
  const progressPercent = (completedDays / 10) * 100;

  // Next day to continue (first non-completed available day)
  const nextDay = DAYS.find((d) => getDayStatus(d.number) === "available");

  // ── Loading ────────────────────────────────────────────────

  if (isLoadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-6 md:px-8 md:py-10 space-y-6">

        {/* Back */}
        <Button
          variant="outline"
          onClick={() => navigate(createPageUrl("Learn"))}
          className="border-gray-200 text-gray-600 hover:bg-gray-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          All Courses
        </Button>

        {/* Course header */}
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-green-700 flex items-center justify-center flex-shrink-0">
            <Brain className="w-7 h-7 text-white" />
          </div>
          <div>
            <Badge className="mb-2 bg-green-50 text-green-700 border-green-200 text-xs">AI & Technology</Badge>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
              AI Literacy Course
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              10 days · 10 hours · 1,000 XP available
            </p>
          </div>
        </div>

        <p className="text-gray-600 leading-relaxed">
          A comprehensive program teaching you to understand, use, and critically evaluate AI —
          from how models are trained to how to use them responsibly.
        </p>

        {/* Guest notice */}
        {user?.isGuest && (
          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm">
            <LogIn className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-800">Viewing as guest</p>
              <p className="text-gray-600">
                All lessons are available, but progress won't be saved.{" "}
                <button
                  onClick={() => navigate(createPageUrl("Login"))}
                  className="text-green-700 font-semibold hover:underline"
                >
                  Log in to save progress
                </button>
              </p>
            </div>
          </div>
        )}

        {/* Progress + Continue CTA */}
        {!user?.isGuest && (
          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-700">Your Progress</p>
                <p className="text-xs text-gray-500">{completedDays} of 10 days complete</p>
              </div>
              <span className="text-green-700 font-bold text-lg">{Math.round(progressPercent)}%</span>
            </div>
            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-700 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* ── FIXED: Continue Learning button ── */}
            {nextDay && completedDays < 10 && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                    {completedDays > 0 ? "Continue Learning" : "Start Course"}
                  </p>
                  <p className="font-semibold text-gray-900 text-sm mt-0.5">
                    Day {nextDay.number}: {nextDay.title}
                  </p>
                </div>
                <Button
                  onClick={() => navigate(createPageUrl(`AIDay${nextDay.number}`))}
                  className="bg-green-700 hover:bg-green-800 text-white flex-shrink-0 gap-2"
                >
                  <Play className="w-4 h-4" />
                  {completedDays > 0 ? "Continue" : "Start Day 1"}
                </Button>
              </div>
            )}

            {completedDays === 10 && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <div>
                  <p className="text-xs text-green-700 font-semibold uppercase tracking-wide flex items-center gap-1">
                    <Trophy className="w-3.5 h-3.5" /> All Days Complete!
                  </p>
                  <p className="font-semibold text-gray-900 text-sm mt-0.5">
                    You've finished the AI Literacy course.
                  </p>
                </div>
                <Button
                  onClick={() => navigate(createPageUrl("AIDay10"))}
                  className="bg-green-700 hover:bg-green-800 text-white flex-shrink-0 gap-2"
                >
                  <Trophy className="w-4 h-4" /> Final Assessment
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Guest CTA */}
        {user?.isGuest && (
          <div className="bg-green-700 rounded-xl p-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-green-200 text-sm font-medium mb-1">Start Course</p>
              <h3 className="text-xl font-bold mb-1">Day 1: {DAYS[0].title}</h3>
              <p className="text-green-200 text-sm">60 min · 100 XP</p>
            </div>
            <Button
              onClick={() => navigate(createPageUrl("AIDay1"))}
              className="bg-white text-green-800 hover:bg-green-50 font-semibold shadow-md flex-shrink-0 px-6"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Day 1
            </Button>
          </div>
        )}

        {/* Day list */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900 text-lg">Course Days</h2>
            <p className="text-gray-400 text-sm">10 lessons · 10 hours total</p>
          </div>

          <div className="divide-y divide-gray-100">
            {DAYS.map((day) => {
              const status      = getDayStatus(day.number);
              const isLocked    = status === "locked";
              const isCompleted = status === "completed";
              const isCurrent   = nextDay?.number === day.number && !isCompleted;

              return (
                <div
                  key={day.number}
                  onClick={() => !isLocked && navigate(createPageUrl(`AIDay${day.number}`))}
                  className={`flex items-center gap-4 px-6 py-4 transition-all ${
                    isLocked
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer hover:bg-green-50/60 group"
                  }`}
                >
                  {/* Status circle */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isCompleted ? "bg-green-700" :
                    isLocked    ? "bg-gray-200" :
                    isCurrent   ? "bg-green-100 ring-2 ring-green-700 group-hover:bg-green-200" :
                                  "bg-green-100 group-hover:bg-green-200"
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5 text-white" />
                    ) : isLocked ? (
                      <Lock className="w-4 h-4 text-gray-400" />
                    ) : (
                      <span className="text-green-800 font-bold text-sm">{day.number}</span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold truncate text-sm ${isLocked ? "text-gray-400" : "text-gray-900"}`}>
                      Day {day.number}: {day.title}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />60 min</span>
                      <span className="flex items-center gap-1 text-green-700 font-medium">
                        <Zap className="w-3 h-3" />100 XP
                      </span>
                    </div>
                  </div>

                  {/* Right badge */}
                  {isCompleted && (
                    <Badge className="bg-green-50 text-green-800 border border-green-200 text-xs flex-shrink-0">Done</Badge>
                  )}
                  {isLocked && (
                    <Badge variant="outline" className="text-gray-400 border-gray-200 text-xs flex-shrink-0">Locked</Badge>
                  )}
                  {isCurrent && (
                    <Badge className="bg-green-700 text-white text-xs flex-shrink-0">Next</Badge>
                  )}
                  {!isCompleted && !isLocked && !isCurrent && (
                    <Play className="w-4 h-4 text-gray-300 group-hover:text-green-700 transition-colors flex-shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}