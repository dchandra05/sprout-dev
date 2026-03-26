import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { createPageUrl } from "@/utils";
import BudgetWalkthrough from "@/components/BudgetWalkthrough";
import ScenarioBudgetSimulation from "@/components/ScenarioBudgetSimulation";
import { trackEvent, trackSimulationStart, trackSimulationComplete } from "@/lib/activityTracker";

// NOTE: Base44 removed in migration pass.
// TODO (later phase): replace these stubs with your real API/client layer.
const getLocalUser = () => {
  try {
    const raw = localStorage.getItem("sprout_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

// Minimal stub “data layer” so the page renders without Base44.
// Replace with fetch calls later (e.g., /api/lessons, /api/progress, etc.).
const data = {
  async listLessons() {
    return [];
  },
  async listUserProgress(/* userEmail, courseId */) {
    return [];
  },
  async upsertUserProgress(/* payload */) {
    return;
  },
  async updateUserXP(/* payload */) {
    return;
  }
};

export default function BudgetSimulation() {
  const { lessonNumber } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = getLocalUser();
    if (!currentUser) {
      navigate(createPageUrl("Login"));
      return;
    }
    setUser(currentUser);
    trackSimulationStart("budget-simulation", "Budget Simulation").catch(() => {});
  }, [navigate]);

  const lessonNum = parseInt(lessonNumber, 10) || 0;

  const { data: lessons = [] } = useQuery({
    queryKey: ["budget-lessons"],
    queryFn: async () => {
      const allLessons = await data.listLessons();
      return allLessons
        .filter(
          (l) =>
            l.course_id === "6972392c60eb785db714b719" &&
            !l.is_deleted
        )
        .sort((a, b) => (a.order || 0) - (b.order || 0));
    },
    enabled: !!user
  });

  const { data: progress = [] } = useQuery({
    queryKey: ["budget-progress", user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      return data.listUserProgress(user.email, "6972392c60eb785db714b719");
    },
    enabled: !!user
  });

  const completeMutation = useMutation({
    mutationFn: async () => {
      if (!user?.email) return;
      const lesson = lessons[lessonNum];

      await trackEvent("lesson_completed", {
        simulation:    "budget-simulation",
        lesson_number: lessonNum,
        lesson_id:     lesson?.id,
        lesson_title:  lesson?.title || `Budget Simulation ${lessonNum}`,
        course_id:     "6972392c60eb785db714b719",
        quiz_score:    100,
        xp_earned:     lesson?.xp_reward || 150,
      });

      await trackSimulationComplete("budget-simulation", "Budget Simulation", {
        lesson_number: lessonNum,
        lesson_title:  lesson?.title || `Budget Simulation ${lessonNum}`,
        xp_earned:     lesson?.xp_reward || 150,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget-progress"] });
      queryClient.invalidateQueries({ queryKey: ["userProgress"] });
      navigate(createPageUrl("CourseDetail") + "?id=6972392c60eb785db714b719");
    }
  });

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-[#1c2f3c] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const currentLesson = lessons[lessonNum];

  return (
    <div className="min-h-screen bg-[#ede8e3]">
      <div className="max-w-5xl mx-auto px-4 py-6 md:px-8 md:py-10 space-y-6">
        <Button
          variant="outline"
          onClick={() =>
            navigate(createPageUrl("CourseDetail") + "?id=6972392c60eb785db714b719")
          }
          className="border-gray-200 text-gray-700 hover:bg-[#ede8e3]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Course
        </Button>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8">
          {lessonNum === 0 ? (
            <>
              <h1 className="text-3xl font-bold mb-2">
                {currentLesson?.title || "Build Your First Budget"}
              </h1>
              <p className="text-gray-600 mb-8">
                Learn budgeting fundamentals with an interactive walkthrough
              </p>
              <BudgetWalkthrough />
              <div className="mt-6 flex justify-end">
                <Button
                  onClick={() => completeMutation.mutate()}
                  className="bg-[#1c2f3c] hover:bg-[#152330]"
                >
                  Complete Lesson
                </Button>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold mb-2">
                {currentLesson?.title || `Budget ${lessonNum}`}
              </h1>
              <p className="text-gray-600 mb-8">
                {currentLesson?.content || "Interactive budget challenge"}
              </p>
              <ScenarioBudgetSimulation
                scenarioId={lessonNum - 1}
                onComplete={() => completeMutation.mutate()}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
