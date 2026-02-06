import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { createPageUrl } from "@/utils";
import PaycheckLesson1 from "@/components/PaycheckLesson1";
import PaycheckLesson2 from "@/components/PaycheckLesson2";

/**
 * NOTE: Base44 removed.
 * This simulation now:
 * - Reads user from localStorage (sprout_user)
 * - Writes completion to sprout_user_progress
 * - Adds XP to user.xp_points
 */

const lessonComponents = {
  1: PaycheckLesson1,
  2: PaycheckLesson2,
  3: PaycheckLesson1,
  4: PaycheckLesson1,
};

const lessonTitles = {
  1: "Your First Paycheck",
  2: "College Student Job",
  3: "First Salary Job",
  4: "Mid-Career Paycheck",
};

const COURSE_ID = "6943400844fa0b0b1fa81a56"; // keep as-is if your routes depend on it

const safeParse = (raw, fallback) => {
  try {
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const getUser = () => safeParse(localStorage.getItem("sprout_user"), null);
const setUser = (u) => localStorage.setItem("sprout_user", JSON.stringify(u));

const getProgress = () => safeParse(localStorage.getItem("sprout_user_progress"), []);
const setProgress = (p) => localStorage.setItem("sprout_user_progress", JSON.stringify(p));

export default function PaycheckSimulation() {
  const { lessonNumber } = useParams();
  const navigate = useNavigate();

  const [user, setUserState] = useState(null);

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      navigate(createPageUrl("Login"));
      return;
    }
    setUserState(currentUser);

    if (!currentUser.onboarding_completed) {
      navigate(createPageUrl("SchoolSelection"));
    }
  }, [navigate]);

  const lessonNum = useMemo(() => parseInt(lessonNumber, 10) || 1, [lessonNumber]);
  const LessonComponent = lessonComponents[lessonNum] || PaycheckLesson1;

  const handleComplete = () => {
    if (!user) return;

    const now = new Date().toISOString();
    const title = `Paycheck ${lessonNum}: ${lessonTitles[lessonNum]}`;

    // Mark progress complete locally
    const all = getProgress();
    const existingIdx = all.findIndex(
      (p) => p.user_email === user.email && p.course_id === COURSE_ID && p.lesson_title === title
    );

    const record = {
      id: existingIdx >= 0 ? all[existingIdx].id : (crypto?.randomUUID?.() || `pp_${Date.now()}`),
      user_email: user.email,
      course_id: COURSE_ID,
      lesson_title: title,
      completed: true,
      completed_date: now,
      quiz_score: 100,
      time_spent_minutes: 15,
    };

    if (existingIdx >= 0) all[existingIdx] = { ...all[existingIdx], ...record };
    else all.push(record);

    setProgress(all);

    // XP reward (fallback if you don’t have the lessons list here)
    const xpReward = 100;

    const updatedUser = {
      ...user,
      xp_points: (user.xp_points || 0) + xpReward,
      total_lessons_completed: (user.total_lessons_completed || 0) + 1,
      level: Math.floor(((user.xp_points || 0) + xpReward) / 100) + 1,
    };

    setUser(updatedUser);
    setUserState(updatedUser);

    navigate(createPageUrl("CourseDetail") + `?id=${COURSE_ID}`);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <Button
          variant="outline"
          onClick={() => navigate(createPageUrl("CourseDetail") + `?id=${COURSE_ID}`)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Course
        </Button>

        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h1 className="text-3xl font-bold mb-2">
            Paycheck {lessonNum}: {lessonTitles[lessonNum]}
          </h1>
          <p className="text-gray-600 mb-8">Interactive paycheck breakdown</p>

          <LessonComponent
            userName={user.full_name || "Student"}
            onComplete={handleComplete}
          />
        </div>
      </div>
    </div>
  );
}
