// src/pages/FinalExam.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Trophy, Sparkles, AlertCircle, CheckCircle, Zap,
  ArrowLeft, BookOpen, Award,
} from "lucide-react";
import { toast } from "sonner";

// ─── Helpers ──────────────────────────────────────────────────

const safeParse = (r, fb) => { try { return r ? JSON.parse(r) : fb; } catch { return fb; } };
const getJSON   = (k, fb) => safeParse(localStorage.getItem(k), fb);
const setJSON   = (k, v)  => localStorage.setItem(k, JSON.stringify(v));
const getLocalUser  = ()  => getJSON("sprout_user", null);
const setLocalUser  = (u) => setJSON("sprout_user", u);
const safeUUID      = ()  => { try { return globalThis?.crypto?.randomUUID?.() || null; } catch { return null; } };

const BASE = import.meta.env.BASE_URL || "/";
async function fetchWithCache(url, key, fb = []) {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error();
    const d = await res.json();
    setJSON(key, d);
    return Array.isArray(d) ? d : fb;
  } catch { return getJSON(key, fb); }
}

const data = {
  courses:  () => fetchWithCache(`${BASE}data/courses.json`,  "sprout_courses",  []),
  lessons:  () => fetchWithCache(`${BASE}data/lessons.json`,  "sprout_lessons",  []),
  progress: (email, courseId) => {
    const all = getJSON("sprout_user_progress", []);
    return all.filter(p => p.user_email === email && String(p.course_id) === String(courseId));
  },
  upsertProgress: (record) => {
    const all = getJSON("sprout_user_progress", []);
    const idx = all.findIndex(p => String(p.id) === String(record.id));
    if (idx >= 0) all[idx] = { ...all[idx], ...record }; else all.push(record);
    setJSON("sprout_user_progress", all);
    return record;
  },
};

// ─── Main ─────────────────────────────────────────────────────

export default function FinalExam() {
  const navigate     = useNavigate();
  const queryClient  = useQueryClient();
  const [user,           setUser]           = useState(null);
  const [examAnswers,    setExamAnswers]    = useState({});
  const [examSubmitted,  setExamSubmitted]  = useState(false);
  const [score,          setScore]          = useState(0);
  const [showCertificate,setShowCertificate]= useState(false);

  // FIX: HashRouter puts params in the hash, not window.location.search
  const courseId = useMemo(() => {
    const hash = window.location.hash;                 // "#/finalexam?courseId=abc"
    const q    = hash.indexOf("?");
    if (q === -1) return null;
    return new URLSearchParams(hash.slice(q + 1)).get("courseId");
  }, []);

  useEffect(() => {
    const u = getLocalUser();
    if (!u) { navigate(createPageUrl("Login")); return; }
    setUser(u);
  }, [navigate]);

  const { data: course } = useQuery({
    queryKey: ["finalexam_course", courseId],
    queryFn: async () => {
      const all = await data.courses();
      return all.find(c => String(c.id) === String(courseId)) || null;
    },
    enabled: !!courseId,
  });

  const { data: lessons = [] } = useQuery({
    queryKey: ["finalexam_lessons", courseId],
    queryFn: async () => {
      const all = await data.lessons();
      return all.filter(l => String(l.course_id) === String(courseId)).sort((a, b) => (a.order || 0) - (b.order || 0));
    },
    enabled: !!courseId,
  });

  const { data: userProgress = [] } = useQuery({
    queryKey: ["finalexam_progress", user?.email, courseId],
    queryFn: () => {
      if (!user?.email || !courseId) return [];
      return data.progress(user.email, courseId);
    },
    enabled: !!user && !!courseId,
  });

  const allLessonsComplete = lessons.length > 0 && lessons.every(l =>
    userProgress.some(p => String(p.lesson_id) === String(l.id) && p.completed)
  );

  const completeMutation = useMutation({
    mutationFn: async ({ finalScore }) => {
      if (!user?.email || !courseId) return;
      const xpReward  = course?.xp_reward || 0;
      const newXP     = (user.xp_points || 0) + xpReward;
      const newLevel  = Math.floor(newXP / 500) + 1;
      const updated   = { ...user, xp_points: newXP, level: newLevel };
      setLocalUser(updated);
      setUser(updated);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProgress"] });
      toast.success(`Course complete! +${course?.xp_reward || 0} XP`);
    },
  });

  const handleSubmit = () => {
    const questions = course?.final_exam_questions || [];
    if (!questions.length) { toast.error("No exam questions found."); return; }
    let correct = 0;
    questions.forEach((q, i) => { if (examAnswers[i] === q.correct_answer) correct++; });
    const finalScore = Math.round((correct / questions.length) * 100);
    setScore(finalScore);
    setExamSubmitted(true);
    if (finalScore >= 70) {
      completeMutation.mutate({ finalScore });
      setShowCertificate(true);
    }
  };

  // ── Guard: no courseId ──
  if (!courseId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6">
        <Card className="max-w-md border border-gray-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Missing Course ID</h2>
            <p className="text-gray-500 mb-6">Navigate here from a course page.</p>
            <Button onClick={() => navigate(createPageUrl("Learn"))} className="bg-[#1c2f3c] hover:bg-[#152330] text-white">
              Back to Courses
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-2 border-gray-200 border-t-green-700 rounded-full animate-spin" />
      </div>
    );
  }

  const questions = course?.final_exam_questions || [];

  if (!allLessonsComplete) {
    return (
      <div className="min-h-screen bg-[#ede8e3] p-6 flex items-center justify-center">
        <Card className="max-w-md border border-gray-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <BookOpen className="w-12 h-12 text-[#1c2f3c] mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Complete All Lessons First</h2>
            <p className="text-gray-500 mb-6">Finish every lesson in <strong>{course.name}</strong> before taking the final exam.</p>
            <Button onClick={() => navigate(createPageUrl(`CourseDetail?id=${courseId}`))} className="bg-[#1c2f3c] hover:bg-[#152330] text-white">
              Go to Course
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="min-h-screen bg-[#ede8e3] p-6 flex items-center justify-center">
        <Card className="max-w-md border border-gray-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <Trophy className="w-12 h-12 text-[#1c2f3c] mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">No Exam Available</h2>
            <p className="text-gray-500 mb-6">This course doesn't have a final exam yet.</p>
            <Button onClick={() => navigate(createPageUrl("Learn"))} className="bg-[#1c2f3c] hover:bg-[#152330] text-white">
              Browse Courses
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ede8e3] p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-5">

        {/* Back */}
        <Button variant="outline" onClick={() => navigate(createPageUrl(`CourseDetail?id=${courseId}`))} className="border-gray-200 text-gray-700 hover:bg-[#ede8e3]">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Course
        </Button>

        {/* Header */}
        <div className="bg-[#1c2f3c] text-white rounded-2xl p-8 text-center">
          <Trophy className="w-12 h-12 mx-auto mb-3 text-[#a8c4d4]" />
          <h1 className="text-2xl font-bold mb-1">Final Exam</h1>
          <p className="text-[#a8c4d4] text-sm">{course.name}</p>
          <div className="flex justify-center gap-4 mt-4 text-sm">
            <span className="bg-white/15 rounded-full px-3 py-1">{questions.length} questions</span>
            <span className="bg-white/15 rounded-full px-3 py-1">70% to pass</span>
            <span className="flex items-center gap-1 bg-white/15 rounded-full px-3 py-1">
              <Zap className="w-3 h-3" />{course.xp_reward} XP
            </span>
          </div>
        </div>

        {/* Result / certificate */}
        {examSubmitted && (
          <div className={`rounded-2xl border-2 p-8 text-center ${score >= 70 ? "bg-[#f0f4f7] border-[#c8dce6]" : "bg-amber-50 border-amber-200"}`}>
            {score >= 70 ? (
              <>
                <Trophy className="w-14 h-14 text-[#1c2f3c] mx-auto mb-3" />
                <p className="text-3xl font-bold text-[#1c2f3c] mb-1">{score}%</p>
                <p className="text-[#152330] font-semibold text-lg mb-1">Congratulations!</p>
                <p className="text-[#4a7a96] text-sm mb-6">You passed the final exam. +{course.xp_reward} XP awarded.</p>
                <Button onClick={() => navigate(createPageUrl("Learn"))} className="bg-[#1c2f3c] hover:bg-[#152330] text-white px-8">
                  Continue Learning
                </Button>
              </>
            ) : (
              <>
                <AlertCircle className="w-14 h-14 text-amber-500 mx-auto mb-3" />
                <p className="text-3xl font-bold text-amber-600 mb-1">{score}%</p>
                <p className="text-amber-800 font-semibold text-lg mb-1">Almost there</p>
                <p className="text-amber-600 text-sm mb-6">You need 70% to pass. Review the course and try again.</p>
                <div className="flex gap-3 justify-center">
                  <Button variant="outline" onClick={() => { setExamAnswers({}); setExamSubmitted(false); setScore(0); }} className="border-amber-300 text-amber-700 hover:bg-amber-50">
                    Retake Exam
                  </Button>
                  <Button onClick={() => navigate(createPageUrl(`CourseDetail?id=${courseId}`))} className="bg-[#1c2f3c] hover:bg-[#152330] text-white">
                    Review Course
                  </Button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Questions */}
        {!examSubmitted && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-10 space-y-10">
            {questions.map((q, qIdx) => (
              <div key={qIdx}>
                <p className="font-semibold text-gray-900 mb-4 leading-relaxed">
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-[#1c2f3c] text-white rounded-full text-xs font-bold mr-2">{qIdx + 1}</span>
                  {q.question}
                </p>
                <div className="space-y-3">
                  {q.options?.map((opt, oIdx) => {
                    const selected = examAnswers[qIdx] === oIdx;
                    return (
                      <button
                        key={oIdx}
                        onClick={() => setExamAnswers({ ...examAnswers, [qIdx]: oIdx })}
                        className={`w-full text-left p-4 rounded-xl border-2 text-sm font-medium transition-all ${
                          selected
                            ? "border-[#1c2f3c] bg-[#f0f4f7] text-[#111c24]"
                            : "border-gray-200 bg-white text-gray-700 hover:border-[#a8c4d4] hover:bg-[#f0f4f7]/50"
                        }`}
                      >
                        <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full border text-xs font-bold mr-3 ${selected ? "bg-[#1c2f3c] border-[#1c2f3c] text-white" : "border-gray-400 text-gray-500"}`}>
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="pt-4 border-t border-gray-100 flex gap-3">
              <Button
                onClick={handleSubmit}
                disabled={Object.keys(examAnswers).length < questions.length}
                className="flex-1 bg-[#1c2f3c] hover:bg-[#152330] text-white disabled:opacity-50 h-12 text-base font-semibold"
              >
                Submit Exam
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}