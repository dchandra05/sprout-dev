import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, Play, CheckCircle, Lock, Clock, Zap,
  BookOpen, Award, TrendingUp, Calculator
} from "lucide-react";

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

const data = {
  async listCourses() {
    return [];
  },
  async listLessons() {
    return [];
  },
  async listUserProgress(/* userEmail, courseId */) {
    return [];
  }
};

export default function CourseDetail() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get("id");

  useEffect(() => {
    const currentUser = getLocalUser();
    if (!currentUser) {
      navigate(createPageUrl("Login"));
      return;
    }
    setUser(currentUser);
  }, [navigate]);

  const { data: course } = useQuery({
    queryKey: ["course", courseId],
    queryFn: async () => {
      const courses = await data.listCourses();
      return courses.find((c) => c.id === courseId);
    },
    enabled: !!courseId,
  });

  const { data: lessons = [] } = useQuery({
    queryKey: ["lessons", courseId],
    queryFn: async () => {
      const allLessons = await data.listLessons();
      // Exclude AI Literacy lessons - uses custom format
      if (course?.name === "AI Literacy: Using AI Responsibly and Effectively") {
        return [];
      }
      return allLessons
        .filter((l) => l.course_id === courseId && !l.is_deleted)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
    },
    enabled: !!courseId && !!course,
  });

  const { data: userProgress = [] } = useQuery({
    queryKey: ["userProgress", user?.email, courseId],
    queryFn: async () => {
      if (!user?.email || !courseId) return [];
      return data.listUserProgress(user.email, courseId);
    },
    enabled: !!user && !!courseId,
  });

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-lime-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  const completedLessons = userProgress.filter((p) => p.completed).length;
  const progressPercent = (completedLessons / (lessons.length || 1)) * 100;
  const nextLesson = lessons.find(
    (l) => !userProgress.find((p) => p.lesson_id === l.id && p.completed)
  );

  const gradientColors = {
    Investing: "from-green-400 to-emerald-500",
    Saving: "from-blue-400 to-cyan-500",
    "Credit & Debt": "from-purple-400 to-pink-500",
    Insurance: "from-orange-400 to-red-500",
    "AI & ML": "from-indigo-400 to-purple-500",
    "Personal Finance": "from-yellow-400 to-orange-500",
    "Career Readiness": "from-lime-400 to-green-500",
  };

  const gradientClass = gradientColors[course.category] || "from-gray-400 to-gray-500";

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Back Button */}
        <Button
          variant="outline"
          onClick={() => navigate(createPageUrl("Learn"))}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Courses
        </Button>

        {/* Course Header */}
        <div className={`rounded-3xl bg-gradient-to-br ${gradientClass} p-8 md:p-12 text-white shadow-2xl`}>
          <div className="max-w-3xl">
            <Badge className="bg-white/20 backdrop-blur-sm text-white mb-4">
              {course.category}
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">{course.name}</h1>
            <p className="text-lg opacity-90 mb-6">{course.description}</p>

            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                <span>{lessons.length} Lessons</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{lessons.reduce((sum, l) => sum + (l.duration_minutes || 0), 0)} Minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                <span>{course.xp_reward} XP Total</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                <span>{course.difficulty || "Beginner"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Card */}
        <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-lime-500" />
                Your Progress
              </CardTitle>
              <span className="text-2xl font-bold text-lime-600">{Math.round(progressPercent)}%</span>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={progressPercent} className="h-3 mb-4" />
            <div className="flex justify-between text-sm text-gray-600">
              <span>{completedLessons} of {lessons.length} lessons completed</span>
              <span>
                {course.xp_reward - (completedLessons * (course.xp_reward / (lessons.length || 1)))} XP remaining
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Continue Learning */}
        {nextLesson && (
          <Card className="border-none shadow-lg bg-gradient-to-r from-lime-400 to-green-500 text-white">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <p className="text-sm opacity-90 mb-1">Continue Learning</p>
                  <h3 className="text-2xl font-bold mb-2">{nextLesson.title}</h3>
                  <p className="text-sm opacity-75">
                    {nextLesson.duration_minutes} minutes • {nextLesson.xp_reward} XP
                  </p>
                </div>
                <Button
                  onClick={() => navigate(createPageUrl(`Lesson?id=${nextLesson.id}`))}
                  className="bg-white text-lime-600 hover:bg-gray-100 shadow-lg"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Lesson
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Course Tools - Show Investment Calculator for Investing Course */}
        {course.category === "Investing" && (
          <Card className="border-none shadow-lg bg-gradient-to-r from-green-400 to-emerald-500 text-white">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <p className="text-sm opacity-90 mb-1 flex items-center gap-2">
                    <Calculator className="w-4 h-4" />
                    Interactive Tool
                  </p>
                  <h3 className="text-2xl font-bold mb-2">Investment Growth Calculator</h3>
                  <p className="text-sm opacity-75">See how your investments can grow over time with compound interest</p>
                </div>
                <Button
                  onClick={() => navigate(createPageUrl("InvestmentCalculator"))}
                  className="bg-white text-green-600 hover:bg-gray-100 shadow-lg"
                >
                  <Calculator className="w-5 h-5 mr-2" />
                  Open Calculator
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Credit Card Statement Lesson - Show for Credit & Debt Course */}
        {course.category === "Credit & Debt" && (
          <Card className="border-none shadow-lg bg-gradient-to-r from-purple-400 to-pink-500 text-white">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <p className="text-sm opacity-90 mb-1 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Interactive Lesson
                  </p>
                  <h3 className="text-2xl font-bold mb-2">Your First Credit Card Statement</h3>
                  <p className="text-sm opacity-75">Learn to read and understand every part of your credit card statement</p>
                </div>
                <Button
                  onClick={() => navigate(createPageUrl("CreditCardLesson"))}
                  className="bg-white text-purple-600 hover:bg-gray-100 shadow-lg"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Start Lesson
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Paycheck Lesson - Show for Personal Finance Course */}
        {course.category === "Personal Finance" && (
          <Card className="border-none shadow-lg bg-gradient-to-r from-blue-400 to-cyan-500 text-white">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <p className="text-sm opacity-90 mb-1 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Interactive Lesson
                  </p>
                  <h3 className="text-2xl font-bold mb-2">Understanding Your First Paycheck</h3>
                  <p className="text-sm opacity-75">See where your money goes with every paycheck deduction explained</p>
                </div>
                <Button
                  onClick={() => navigate(createPageUrl("PaycheckLesson"))}
                  className="bg-white text-blue-600 hover:bg-gray-100 shadow-lg"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Start Lesson
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Budget Lesson - Show for Saving Course */}
        {course.category === "Saving" && (
          <Card className="border-none shadow-lg bg-gradient-to-r from-lime-400 to-green-500 text-white">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <p className="text-sm opacity-90 mb-1 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Interactive Lesson
                  </p>
                  <h3 className="text-2xl font-bold mb-2">Build Your First Real Budget</h3>
                  <p className="text-sm opacity-75">Learn to read and understand a real budget spreadsheet step-by-step</p>
                </div>
                <Button
                  onClick={() => navigate(createPageUrl("BudgetLesson"))}
                  className="bg-white text-lime-600 hover:bg-gray-100 shadow-lg"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Start Lesson
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* AI Literacy Course - Redirect to New Format */}
        {course.name === "AI Literacy: Using AI Responsibly and Effectively" && (
          <Card className="border-none shadow-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Start Your AI Literacy Journey</h2>
              <p className="mb-6 opacity-90">This course uses a special day-by-day interactive format</p>
              <Button
                onClick={() => navigate(createPageUrl("AILiteracy"))}
                className="bg-white text-indigo-600 hover:bg-gray-100 shadow-lg"
              >
                Start Day 1
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Credit & Debt Course - Only show interactive lesson */}
        {course.category === "Credit & Debt" && lessons.length === 0 && (
          <Card className="border-none shadow-lg bg-gradient-to-r from-purple-400 to-pink-500 text-white">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <p className="text-sm opacity-90 mb-1 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Interactive Lesson
                  </p>
                  <h3 className="text-2xl font-bold mb-2">Your First Credit Card Statement</h3>
                  <p className="text-sm opacity-75">Learn to read and understand every part of your credit card statement</p>
                </div>
                <Button
                  onClick={() => navigate(createPageUrl("CreditCardLesson"))}
                  className="bg-white text-purple-600 hover:bg-gray-100 shadow-lg"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Start Lesson
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Regular Lessons List */}
        {course.name !== "AI Literacy: Using AI Responsibly and Effectively" && lessons.length > 0 && (
          <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {lessons.map((lesson, index) => {
                const isCompleted = userProgress.find((p) => p.lesson_id === lesson.id && p.completed);
                const isProgressiveCourse =
                  course?.name === "Money Management Essentials" ||
                  course?.name === "Smart Savings Strategies";
                const isLocked =
                  isProgressiveCourse &&
                  index > 0 &&
                  !userProgress.find((p) => p.lesson_id === lessons[index - 1].id && p.completed) &&
                  !isCompleted;

                const isPaycheckLesson = lesson.title.startsWith("Paycheck");
                const isBudgetLesson = course?.name === "Smart Savings Strategies";

                let lessonUrl = createPageUrl(`Lesson?id=${lesson.id}`);
                if (isPaycheckLesson) {
                  const lessonNum = lesson.title.match(/\d+/)?.[0] || "1";
                  lessonUrl = createPageUrl("PaycheckSimulation") + `/${lessonNum}`;
                } else if (isBudgetLesson) {
                  lessonUrl = createPageUrl("BudgetSimulation") + `/${lesson.order - 1}`;
                }

                return (
                  <div
                    key={lesson.id}
                    onClick={() => !isLocked && navigate(lessonUrl)}
                    className={`flex items-center justify-between p-4 rounded-xl transition-all ${
                      isLocked
                        ? "bg-gray-50 opacity-60 cursor-not-allowed"
                        : "bg-gradient-to-r from-gray-50 to-white hover:from-lime-50 hover:to-green-50 cursor-pointer border-2 border-transparent hover:border-lime-200"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          isCompleted
                            ? "bg-gradient-to-br from-green-400 to-emerald-500"
                            : isLocked
                            ? "bg-gray-200"
                            : "bg-gradient-to-br from-lime-400 to-green-500"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="w-6 h-6 text-white" />
                        ) : isLocked ? (
                          <Lock className="w-6 h-6 text-gray-500" />
                        ) : (
                          <span className="text-white font-bold">{index + 1}</span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{lesson.title}</h4>
                        <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {lesson.duration_minutes} min
                          </span>
                          <span className="flex items-center gap-1">
                            <Zap className="w-3 h-3 text-lime-500" />
                            {lesson.xp_reward} XP
                          </span>
                          {lesson.quiz_questions?.length > 0 && (
                            <Badge variant="outline" className="text-xs">
                              Quiz Included
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    {isCompleted && <Badge className="bg-green-100 text-green-700">Completed</Badge>}
                    {isLocked && <Badge variant="outline" className="text-gray-500">Locked</Badge>}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
