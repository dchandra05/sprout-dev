import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Play,
  CheckCircle,
  Lock,
  Clock,
  Zap,
  BookOpen,
  Award,
  TrendingUp,
  Calculator,
} from "lucide-react";

/** ----------------------------
 * Hybrid data client (public/data -> localStorage fallback)
 * ---------------------------- */
const safeParse = (raw, fallback) => {
  try {
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const getJSON = (key, fallback) => safeParse(localStorage.getItem(key), fallback);
const setJSON = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const getLocalUser = () => safeParse(localStorage.getItem("sprout_user"), null);

async function fetchJsonWithCache(url, cacheKey, fallback = []) {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    const data = await res.json();
    setJSON(cacheKey, data);
    return Array.isArray(data) ? data : fallback;
  } catch {
    return getJSON(cacheKey, fallback);
  }
}

const dataClient = {
  async listCourses() {
    const basePath = import.meta.env.BASE_URL || "/";
    return fetchJsonWithCache(`${basePath}data/courses.json`, "sprout_courses", []);
  },
  async listLessons() {
    const basePath = import.meta.env.BASE_URL || "/";
    return fetchJsonWithCache(`${basePath}data/lessons.json`, "sprout_lessons", []);
  },
  async listUserProgress(userEmail, courseId) {
    const all = getJSON("sprout_user_progress", []);
    return all.filter(
      (p) => String(p.user_email) === String(userEmail) && String(p.course_id) === String(courseId)
    );
  },
};

function Loading({ label }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-lime-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">{label}</p>
      </div>
    </div>
  );
}

export default function CourseDetail() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const courseId = useMemo(() => {
    // With HashRouter, query params are in the hash, not in window.location.search
    // URL format: #/course?id=123
    const hash = window.location.hash;
    const queryStart = hash.indexOf('?');
    if (queryStart === -1) return null;
    const queryString = hash.substring(queryStart + 1);
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get("id");
  }, []);

  useEffect(() => {
    const currentUser = getLocalUser();
    if (!currentUser) {
      navigate(createPageUrl("Login"));
      return;
    }
    setUser(currentUser);
  }, [navigate]);

  if (!courseId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="max-w-md w-full border-none shadow-xl">
          <CardContent className="p-8 text-center">
            <p className="font-semibold text-gray-900 text-lg mb-2">Missing Course ID</p>
            <p className="text-gray-600 mb-6">This page needs an id in the URL.</p>
            <Button onClick={() => navigate(createPageUrl("Learn"))}>Back to Courses</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const {
    data: course,
    isLoading: courseLoading,
    isFetched: courseFetched,
    isError: courseIsError,
    error: courseError,
  } = useQuery({
    queryKey: ["course", courseId],
    queryFn: async () => {
      const courses = await dataClient.listCourses();
      return courses.find((c) => String(c.id) === String(courseId)) || null;
    },
    enabled: !!courseId,
  });

  const { data: lessons = [], isLoading: lessonsLoading } = useQuery({
    queryKey: ["lessons", courseId],
    queryFn: async () => {
      const allLessons = await dataClient.listLessons();
      return allLessons
        .filter((l) => String(l.course_id) === String(courseId) && !l.is_deleted)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
    },
    enabled: !!courseId && !!course,
  });

  const { data: userProgress = [] } = useQuery({
    queryKey: ["userProgress", user?.email, courseId],
    queryFn: async () => {
      if (!user?.email) return [];
      return dataClient.listUserProgress(user.email, courseId);
    },
    enabled: !!user?.email && !!courseId,
  });

  if (courseLoading) return <Loading label="Loading course..." />;

  if (courseIsError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="max-w-lg w-full border-none shadow-xl">
          <CardContent className="p-8">
            <p className="font-semibold text-gray-900 text-lg mb-2">Course load failed</p>
            <p className="text-gray-600 mb-4">
              {String(courseError?.message || "Unknown error")}
            </p>
            <Button onClick={() => navigate(createPageUrl("Learn"))} variant="outline">
              Back to Courses
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (courseFetched && !course) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="max-w-lg w-full border-none shadow-xl">
          <CardContent className="p-8">
            <p className="font-semibold text-gray-900 text-lg mb-2">Course not found</p>
            <p className="text-gray-600 mb-4">
              This course id doesn’t match anything in <code>/public/data/courses.json</code>.
            </p>
            <Button onClick={() => navigate(createPageUrl("Learn"))} variant="outline">
              Back to Courses
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (lessonsLoading) return <Loading label="Loading lessons..." />;

  const completedLessons = userProgress.filter((p) => p.completed).length;
  const progressPercent = (completedLessons / (lessons.length || 1)) * 100;

  const nextLesson = lessons.find(
    (l) => !userProgress.find((p) => String(p.lesson_id) === String(l.id) && p.completed)
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
        <Button variant="outline" onClick={() => navigate(createPageUrl("Learn"))} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Courses
        </Button>

        <div className={`rounded-3xl bg-gradient-to-br ${gradientClass} p-8 md:p-12 text-white shadow-2xl`}>
          <div className="max-w-3xl">
            <Badge className="bg-white/20 backdrop-blur-sm text-white mb-4">{course.category}</Badge>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">{course.name}</h1>
            <p className="text-lg opacity-90 mb-6">{course.description}</p>

            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                <span>{lessons.length} Lessons</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{lessons.reduce((sum, l) => sum + (Number(l.duration_minutes) || 0), 0)} Minutes</span>
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
                {Math.max(
                  0,
                  Number(course.xp_reward || 0) -
                    completedLessons * (Number(course.xp_reward || 0) / (lessons.length || 1))
                ).toFixed(0)}{" "}
                XP remaining
              </span>
            </div>
          </CardContent>
        </Card>

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
                  <p className="text-sm opacity-75">
                    See how your investments can grow over time with compound interest
                  </p>
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

        {/* Lessons list */}
        <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Course Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {lessons.map((lesson, index) => {
              const isCompleted = userProgress.find(
                (p) => String(p.lesson_id) === String(lesson.id) && p.completed
              );

              const isProgressiveCourse =
                course?.name === "Money Management Essentials" ||
                course?.name === "Smart Savings Strategies";

              const isLocked =
                isProgressiveCourse &&
                index > 0 &&
                !userProgress.find(
                  (p) => String(p.lesson_id) === String(lessons[index - 1]?.id) && p.completed
                ) &&
                !isCompleted;

              return (
                <div
                  key={lesson.id}
                  onClick={() => !isLocked && navigate(createPageUrl(`Lesson?id=${lesson.id}`))}
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
                      </div>
                    </div>
                  </div>

                  {isCompleted && <Badge className="bg-green-100 text-green-700">Completed</Badge>}
                  {isLocked && <Badge variant="outline" className="text-gray-500">Locked</Badge>}
                </div>
              );
            })}

            {lessons.length === 0 && (
              <div className="text-sm text-gray-600">
                No lessons found for this course. Check that lessons in{" "}
                <code className="px-1 py-0.5 bg-gray-100 rounded">public/data/lessons.json</code>{" "}
                use the right <code className="px-1 py-0.5 bg-gray-100 rounded">course_id</code>.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}