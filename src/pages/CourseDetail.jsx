// src/pages/CourseDetail.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, Play, CheckCircle, Lock, Clock, Zap,
  BookOpen, Award, TrendingUp, Calculator,
} from "lucide-react";

// ─── Data layer ────────────────────────────────────────────────

const safeParse = (r, fb) => { try { return r ? JSON.parse(r) : fb; } catch { return fb; } };
const getJSON   = (k, fb) => safeParse(localStorage.getItem(k), fb);
const setJSON   = (k, v)  => localStorage.setItem(k, JSON.stringify(v));
const getLocalUser = ()   => safeParse(localStorage.getItem("sprout_user"), null);

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
  listCourses() {
    const base = import.meta.env.BASE_URL || "/";
    return fetchJsonWithCache(`${base}data/courses.json`, "sprout_courses", []);
  },
  listLessons() {
    const base = import.meta.env.BASE_URL || "/";
    return fetchJsonWithCache(`${base}data/lessons.json`, "sprout_lessons", []);
  },
  listUserProgress(userEmail, courseId) {
    const all = getJSON("sprout_user_progress", []);
    return all.filter(
      (p) => String(p.user_email) === String(userEmail) && String(p.course_id) === String(courseId)
    );
  },
};

function Spinner({ label = "Loading…" }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-gray-200 border-t-[#2a7a4b] rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-500 text-sm">{label}</p>
      </div>
    </div>
  );
}

// ─── Component ─────────────────────────────────────────────────

export default function CourseDetail() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // HashRouter: params live in the hash fragment  e.g. "#/course?id=abc"
  const courseId = useMemo(() => {
    const hash = window.location.hash;
    const q    = hash.indexOf("?");
    if (q === -1) return null;
    return new URLSearchParams(hash.slice(q + 1)).get("id");
  }, []);

  useEffect(() => {
    const u = getLocalUser();
    if (!u) { navigate(createPageUrl("Login")); return; }
    setUser(u);
  }, [navigate]);

  // ── Queries ────────────────────────────────────────────────
  const {
    data: course,
    isLoading: courseLoading,
    isFetched: courseFetched,
    isError: courseIsError,
    error: courseError,
  } = useQuery({
    queryKey: ["course", courseId],
    queryFn: async () => {
      const all = await dataClient.listCourses();
      return all.find((c) => String(c.id) === String(courseId)) || null;
    },
    enabled: !!courseId,
  });

  // FIX: was `enabled: !!courseId && !!course` — the !!course dependency
  // caused lessons to never load on first render because course was still
  // undefined when the component mounted.
  const { data: lessons = [], isLoading: lessonsLoading } = useQuery({
    queryKey: ["lessons", courseId],
    queryFn: async () => {
      const all = await dataClient.listLessons();
      return all
        .filter((l) => String(l.course_id) === String(courseId) && !l.is_deleted)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
    },
    enabled: !!courseId,  // ← FIXED (was: !!courseId && !!course)
  });

  const { data: userProgress = [] } = useQuery({
    queryKey: ["userProgress", user?.email, courseId],
    queryFn: () => dataClient.listUserProgress(user.email, courseId),
    enabled: !!user?.email && !!courseId,
  });

  // ── Guard states ─────────────────────────────────────────

  if (!courseId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6">
        <Card className="max-w-md border border-gray-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="font-semibold text-gray-900 text-lg mb-2">Missing Course ID</p>
            <p className="text-gray-500 mb-6">This page needs an <code className="bg-gray-100 px-1 rounded">id</code> in the URL.</p>
            <Button onClick={() => navigate(createPageUrl("Learn"))} className="bg-[#2a7a4b] hover:bg-[#1e5c37] text-white">
              Back to Courses
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (courseLoading || lessonsLoading) return <Spinner label="Loading course…" />;

  if (courseIsError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6">
        <Card className="max-w-lg border border-gray-200 shadow-lg">
          <CardContent className="p-8">
            <p className="font-semibold text-gray-900 text-lg mb-2">Course failed to load</p>
            <p className="text-gray-500 mb-4">{String(courseError?.message || "Unknown error")}</p>
            <Button onClick={() => navigate(createPageUrl("Learn"))} variant="outline">Back to Courses</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (courseFetched && !course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6">
        <Card className="max-w-lg border border-gray-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="font-semibold text-gray-900 text-lg mb-2">Course not found</p>
            <p className="text-gray-500 text-sm mb-2">
              No course matched id: <code className="bg-gray-100 px-1 rounded">{courseId}</code>
            </p>
            <p className="text-gray-400 text-xs mb-6">
              Check <code className="bg-gray-100 px-1 rounded">public/data/courses.json</code>.
            </p>
            <Button onClick={() => navigate(createPageUrl("Learn"))} className="bg-[#2a7a4b] hover:bg-[#1e5c37] text-white">
              Browse Courses
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── Derived values ──────────────────────────────────────────

  const completedLessons = userProgress.filter((p) => p.completed).length;
  const progressPercent  = (completedLessons / Math.max(lessons.length, 1)) * 100;

  const nextLesson = lessons.find(
    (l) => !userProgress.find((p) => String(p.lesson_id) === String(l.id) && p.completed)
  );


  // ── Render ──────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6 md:px-8 md:py-10 space-y-6">

        {/* Back */}
        <Button variant="outline" onClick={() => navigate(createPageUrl("Learn"))}
          className="border-gray-200 text-gray-700 hover:bg-gray-50">
          <ArrowLeft className="w-4 h-4 mr-2" />
          All Courses
        </Button>

        {/* Course header */}
        <div className="rounded-2xl bg-white border border-gray-200 p-8 md:p-10 shadow-sm">
          <Badge className="bg-[#f0f4f7] text-[#152330] border border-[#c8dce6] mb-4">
            {course.category || "Course"}
          </Badge>
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 leading-tight">{course.name}</h1>
          <p className="text-gray-500 text-sm md:text-base mb-6 max-w-2xl leading-relaxed">{course.description}</p>
          <div className="flex flex-wrap gap-5 text-sm text-gray-500">
            <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4 text-[#1c2f3c]" />{lessons.length} lesson{lessons.length !== 1 ? "s" : ""}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-[#1c2f3c]" />{lessons.reduce((s, l) => s + (l.duration_minutes || 0), 0)} min total</span>
            <span className="flex items-center gap-1.5 text-[#2a7a4b] font-medium"><Zap className="w-4 h-4" />{course.xp_reward} XP</span>
            {course.difficulty && <span className="flex items-center gap-1.5"><Award className="w-4 h-4 text-[#1c2f3c]" />{course.difficulty}</span>}
          </div>
        </div>

        {/* Progress bar */}
        {lessons.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-semibold text-gray-700">Your Progress</p>
                <p className="text-xs text-gray-500">{completedLessons} of {lessons.length} complete</p>
              </div>
              <span className="text-[#2a7a4b] font-bold text-lg">{Math.round(progressPercent)}%</span>
            </div>
            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#2a7a4b] rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        )}

        {/* Start / Continue CTA */}
        {nextLesson && (
          <div className="bg-[#1c2f3c] rounded-2xl p-6 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <p className="text-[#a8c4d4] text-sm font-medium mb-1">
                {completedLessons > 0 ? "Continue Learning" : "Start Course"}
              </p>
              <h3 className="text-xl font-bold mb-1">{nextLesson.title}</h3>
              <p className="text-[#a8c4d4] text-sm">{nextLesson.duration_minutes} min · {nextLesson.xp_reward} XP</p>
            </div>
            <Button
              onClick={() => navigate(createPageUrl(`Lesson?id=${nextLesson.id}`))}
              className="bg-white text-[#152330] hover:bg-[#f0f4f7] font-semibold shadow-md flex-shrink-0 px-6"
            >
              <Play className="w-4 h-4 mr-2" />
              {completedLessons > 0 ? "Continue" : "Start Lesson"}
            </Button>
          </div>
        )}

        {/* Final exam CTA */}
        {progressPercent === 100 && lessons.length > 0 && (
          <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <p className="text-amber-700 text-sm font-semibold mb-1 flex items-center gap-1.5">
                <Award className="w-4 h-4" />Ready for the Final Exam
              </p>
              <h3 className="text-xl font-bold text-gray-900 mb-1">{course.name} — Final Exam</h3>
              <p className="text-gray-500 text-sm">Pass with 70%+ to earn your certificate.</p>
            </div>
            <Button
              onClick={() => navigate(createPageUrl(`FinalExam?courseId=${courseId}`))}
              className="bg-amber-500 hover:bg-amber-600 text-white font-semibold flex-shrink-0 px-6"
            >
              <TrendingUp className="w-4 h-4 mr-2" />Take Final Exam
            </Button>
          </div>
        )}

        {/* Investing tool */}
        {course.category === "Investing" && (
          <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-[#2a7a4b] uppercase tracking-wide mb-1 flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5" />Interactive Tool
              </p>
              <p className="font-semibold text-gray-900">Investment Growth Calculator</p>
              <p className="text-sm text-gray-500 mt-0.5">See compound interest grow your wealth over time.</p>
            </div>
            <Button onClick={() => navigate(createPageUrl("InvestmentCalculator"))}
              variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50 flex-shrink-0">
              <Calculator className="w-4 h-4 mr-2" />Open Calculator
            </Button>
          </div>
        )}

        {/* Lesson list */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900 text-lg">Course Content</h2>
            <p className="text-gray-400 text-sm">{lessons.length} lesson{lessons.length !== 1 ? "s" : ""}</p>
          </div>

          {lessons.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No lessons found for this course.</p>
              <p className="text-gray-400 text-xs mt-1">
                Make sure lessons use <code className="bg-gray-100 px-1 rounded">course_id: {courseId}</code> in <code className="bg-gray-100 px-1 rounded">lessons.json</code>.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {lessons.map((lesson, index) => {
                const isCompleted = !!userProgress.find(
                  (p) => String(p.lesson_id) === String(lesson.id) && p.completed
                );
                const prevCompleted = index === 0 || !!userProgress.find(
                  (p) => String(p.lesson_id) === String(lessons[index - 1]?.id) && p.completed
                );
                const isLocked = !isCompleted && !prevCompleted;

                return (
                  <div
                    key={lesson.id}
                    onClick={() => !isLocked && navigate(createPageUrl(`Lesson?id=${lesson.id}`))}
                    className={`flex items-center gap-4 px-6 py-4 transition-all ${
                      isLocked ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-[#f0faf4]/60 group"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isCompleted ? "bg-[#2a7a4b]" : isLocked ? "bg-gray-200" : "bg-[#f0faf4] group-hover:bg-[#dcf0e6]"
                    }`}>
                      {isCompleted ? <CheckCircle className="w-5 h-5 text-white" /> :
                       isLocked    ? <Lock className="w-4 h-4 text-gray-400" /> :
                                     <span className="text-[#1e5c37] font-bold text-sm">{index + 1}</span>}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold truncate ${isLocked ? "text-gray-400" : "text-gray-900"}`}>
                        {lesson.title}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                        {lesson.duration_minutes && (
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{lesson.duration_minutes} min</span>
                        )}
                        {lesson.xp_reward && (
                          <span className="flex items-center gap-1 text-[#2a7a4b] font-medium"><Zap className="w-3 h-3" />{lesson.xp_reward} XP</span>
                        )}
                      </div>
                    </div>

                    {isCompleted && <Badge className="bg-[#f0faf4] text-[#2a7a4b] border border-[#b6ddc8] text-xs flex-shrink-0">Done</Badge>}
                    {isLocked    && <Badge variant="outline" className="text-gray-400 border-gray-200 text-xs flex-shrink-0">Locked</Badge>}
                    {!isCompleted && !isLocked && <Play className="w-4 h-4 text-gray-300 group-hover:text-[#2a7a4b] transition-colors flex-shrink-0" />}
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}