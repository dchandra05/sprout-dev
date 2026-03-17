// src/pages/Lesson.jsx
//
// Refactored lesson experience:
//   - White + dark-green Sprout theme throughout
//   - Duolingo-style step-by-step progression
//   - Inline knowledge checks between content sections
//   - Simulation embeds for budget/paycheck/credit lessons
//   - FIX: "Continue" always navigates back to parent CourseDetail
//   - FIX: completeMutation triggers on passing quiz (≥ 70%)
//   - FIX: progress is marked before handleNext so the guard never trips

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  XCircle,
  Zap,
  Trophy,
  Clock,
  BookOpen,
  Star,
  Target,
  TrendingUp,
  AlertCircle,
  ChevronRight,
  Lightbulb,
  Play,
  RotateCcw,
  Home,
} from "lucide-react";
import { toast } from "sonner";
import LevelUpModal from "@/components/LevelUpModal";
import ChallengeCompleteModal from "@/components/ChallengeCompleteModal";
import { useChallengeCheck } from "@/components/useChallengeCheck";

// ─── Local helpers ─────────────────────────────────────────────

const safeParse = (raw, fallback) => {
  try { return raw ? JSON.parse(raw) : fallback; } catch { return fallback; }
};
const getJSON       = (key, fb)    => safeParse(localStorage.getItem(key), fb);
const setJSON       = (key, val)   => localStorage.setItem(key, JSON.stringify(val));
const getLocalUser  = ()           => getJSON("sprout_user", null);
const setLocalUser  = (u)          => setJSON("sprout_user", u);
const safeUUID      = ()           => { try { return globalThis?.crypto?.randomUUID?.() || null; } catch { return null; } };

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
  async listLessons() {
    const base = import.meta.env.BASE_URL || "/";
    return fetchJsonWithCache(`${base}data/lessons.json`, "sprout_lessons", []);
  },
  async listCourses() {
    const base = import.meta.env.BASE_URL || "/";
    return fetchJsonWithCache(`${base}data/courses.json`, "sprout_courses", []);
  },
  async listUserProgress({ user_email, lesson_id } = {}) {
    const all = getJSON("sprout_user_progress", []);
    return all.filter((p) => {
      if (user_email && p.user_email !== user_email) return false;
      if (lesson_id  && String(p.lesson_id) !== String(lesson_id)) return false;
      return true;
    });
  },
  async upsertUserProgress(record) {
    const all = getJSON("sprout_user_progress", []);
    const idx = all.findIndex((p) => String(p.id) === String(record.id));
    if (idx >= 0) all[idx] = { ...all[idx], ...record };
    else all.push(record);
    setJSON("sprout_user_progress", all);
    return record;
  },
  async upsertDailyActivity(record) {
    const all = getJSON("sprout_daily_activity", []);
    const idx = all.findIndex((a) => a.user_email === record.user_email && a.date === record.date);
    if (idx >= 0) all[idx] = { ...all[idx], ...record };
    else all.push(record);
    setJSON("sprout_daily_activity", all);
    return record;
  },
  async getDailyActivity({ user_email, date }) {
    return getJSON("sprout_daily_activity", []).filter(
      (a) => a.user_email === user_email && a.date === date
    );
  },
};

// ─── Special-page detection ─────────────────────────────────────
// AI Day lessons always use their dedicated AIDay pages.
// Other interactive stubs (budget/paycheck/credit) are only
// redirected when the lesson content is truly empty (< 100 chars).

function detectSpecialLessonPage(lesson) {
  if (!lesson?.title) return null;
  const title   = lesson.title.toLowerCase();
  const content = (lesson.content || "").trim();

  const dayMatch = lesson.title.match(/^Day (\d+):/i);
  if (dayMatch) return `AIDay${dayMatch[1]}`;

  if (content.length >= 100) return null; // has real content — render inline

  if (title.includes("budget")  && !title.includes("quiz"))      return "BudgetLesson";
  if (title.includes("paycheck") && !title.includes("quiz"))     return "PaycheckLesson";
  if ((title.includes("credit") || title.includes("statement")) && !title.includes("quiz"))
    return "CreditCardLesson";

  return null;
}

// ─── Content → steps converter ─────────────────────────────────
// Transforms markdown lesson content into a Duolingo-style steps array.
// Each `## Header` section becomes one "concept" step.
// After every 2 concept steps we inject an inline knowledge-check step
// (sourced from quiz_questions, round-robin).
// A final "quiz" step is appended when quiz_questions exist.

function buildSteps(lesson) {
  const content  = String(lesson?.content || "");
  const rawQuestions = lesson?.quiz_questions || [];

  // Split on ## headers
  const sections = content.split(/(?=^## )/m).filter((s) => s.trim());
  const steps    = [];
  let   qIdx     = 0;      // which quiz question to use for inline checks

  sections.forEach((section, i) => {
    steps.push({ type: "concept", content: section, idx: i });

    // Inject a knowledge-check after every 2nd concept (and if questions exist)
    const afterEvery = 2;
    if (rawQuestions.length > 0 && (i + 1) % afterEvery === 0 && qIdx < rawQuestions.length - 1) {
      steps.push({ type: "check", question: rawQuestions[qIdx], idx: qIdx });
      qIdx++;
    }
  });

  // Final quiz step
  if (rawQuestions.length > 0) {
    steps.push({ type: "quiz", questions: rawQuestions });
  }

  // If there's no structured content at all, just wrap whatever text exists
  if (steps.length === 0) {
    steps.push({ type: "concept", content: content || "No content available.", idx: 0 });
  }

  return steps;
}

// ─── Simulation embedding helper ───────────────────────────────
// Determines whether this lesson should embed a simulation component.

function getSimulationForLesson(lesson) {
  if (!lesson) return null;
  const title = (lesson.title || "").toLowerCase();
  const cid   = String(lesson.course_id || "");

  // ── Current course IDs (2026 data structure) ──────────────────

  // Budgeting Fundamentals — embed budget walkthrough on the "build" lesson
  if (cid === "course-budgeting-001") {
    if (title.includes("build") || title.includes("first budget")) {
      return { type: "BudgetWalkthrough", scenarioId: null };
    }
    return null;
  }

  // Saving & Building Wealth — compound interest calculator
  if (cid === "course-saving-005") {
    if (title.includes("compound") || title.includes("interest")) {
      return { type: "InterestCalculator", scenarioId: null };
    }
    return null;
  }

  // Investing Fundamentals — compound growth visualizer
  if (cid === "course-investing-004") {
    return { type: "InterestCalculator", scenarioId: null };
  }

  // ── Legacy / archived course IDs (kept for backward compatibility) ──

  // Smart Savings Strategies
  if (cid === "6972392c60eb785db714b719") {
    if (title.includes("first budget") || title.includes("basics"))   return { type: "BudgetWalkthrough",         scenarioId: null };
    if (title.includes("college"))                                      return { type: "ScenarioBudgetSimulation",  scenarioId: 0 };
    if (title.includes("new graduate") || title.includes("graduate"))  return { type: "ScenarioBudgetSimulation",  scenarioId: 1 };
    if (title.includes("dual income") || title.includes("dual"))       return { type: "ScenarioBudgetSimulation",  scenarioId: 2 };
    if (title.includes("family"))                                       return { type: "ScenarioBudgetSimulation",  scenarioId: 3 };
    return { type: "BudgetWalkthrough", scenarioId: null };
  }

  // Money Management Essentials
  if (cid === "6943400844fa0b0b1fa81a56") {
    if (title.includes("paycheck"))  return null; // handled by redirect to PaycheckLesson
    if (title.includes("budget"))    return { type: "BudgetWalkthrough", scenarioId: null };
  }

  // Investing Basics (legacy)
  if (cid === "6914ef07ea44941f461e64ea") {
    if (title.includes("compound") || title.includes("growth") || title.includes("interest")) {
      return { type: "InterestCalculator", scenarioId: null };
    }
  }

  return null;
}

// ─── Step components ───────────────────────────────────────────

function ConceptStep({ content, onContinue, isLast }) {
  return (
    <div className="space-y-6">
      <div className="prose prose-gray max-w-none
        prose-headings:text-gray-900 prose-headings:font-bold
        prose-h2:text-2xl prose-h2:mt-0 prose-h2:mb-4
        prose-h3:text-lg prose-h3:text-green-800
        prose-p:text-gray-700 prose-p:leading-relaxed
        prose-ul:text-gray-700 prose-li:my-1
        prose-strong:text-gray-900
        prose-code:bg-green-50 prose-code:text-green-800 prose-code:px-1.5 prose-code:rounded">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
      <div className="pt-4 border-t border-gray-100 flex justify-end">
        <Button
          onClick={onContinue}
          className="bg-green-700 hover:bg-green-800 text-white h-12 px-8 text-base font-semibold rounded-xl gap-2"
        >
          {isLast ? "Take Quiz" : "Continue"}
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}

function CheckStep({ question, onContinue }) {
  const [selected, setSelected]   = useState(null);
  const [revealed, setRevealed]   = useState(false);

  const choose = (idx) => {
    if (revealed) return;
    setSelected(idx);
    setRevealed(true);
  };

  const isCorrect = selected === question.correct_answer;

  return (
    <div className="space-y-6">
      {/* Quick-check banner */}
      <div className="flex items-center gap-2 text-sm font-semibold text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-2">
        <Lightbulb className="w-4 h-4" />
        Quick Check
      </div>

      <p className="text-lg font-semibold text-gray-900 leading-snug">{question.question}</p>

      <div className="grid gap-3">
        {question.options.map((opt, i) => {
          let cls = "w-full text-left p-4 rounded-xl border-2 font-medium transition-all text-sm leading-snug ";
          if (!revealed) {
            cls += "border-gray-200 bg-white hover:border-green-400 hover:bg-green-50 text-gray-800 cursor-pointer";
          } else if (i === question.correct_answer) {
            cls += "border-green-500 bg-green-50 text-green-800";
          } else if (i === selected && !isCorrect) {
            cls += "border-red-400 bg-red-50 text-red-700";
          } else {
            cls += "border-gray-100 bg-gray-50 text-gray-400";
          }
          return (
            <button key={i} className={cls} onClick={() => choose(i)} disabled={revealed}>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center text-xs font-bold mt-0.5
                  border-current">
                  {revealed && i === question.correct_answer ? "✓" :
                   revealed && i === selected && !isCorrect ? "✗" :
                   String.fromCharCode(65 + i)}
                </span>
                {opt}
              </div>
            </button>
          );
        })}
      </div>

      {revealed && (
        <div className={`p-4 rounded-xl border text-sm ${isCorrect ? "bg-green-50 border-green-200 text-green-800" : "bg-amber-50 border-amber-200 text-amber-800"}`}>
          <p className="font-semibold mb-1">{isCorrect ? "✅ Correct!" : "💡 Good to know:"}</p>
          <p>{question.explanation}</p>
        </div>
      )}

      {revealed && (
        <div className="pt-2 flex justify-end">
          <Button
            onClick={onContinue}
            className="bg-green-700 hover:bg-green-800 text-white h-12 px-8 text-base font-semibold rounded-xl gap-2"
          >
            Continue
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      )}
    </div>
  );
}

function QuizStep({ questions, onPass, onFail }) {
  const [answers,   setAnswers]   = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score,     setScore]     = useState(0);

  const allAnswered = Object.keys(answers).length === questions.length;

  const submit = () => {
    let correct = 0;
    questions.forEach((q, i) => { if (answers[i] === q.correct_answer) correct++; });
    const pct = Math.round((correct / questions.length) * 100);
    setScore(pct);
    setSubmitted(true);
    if (pct >= 70) onPass(pct);
    else onFail(pct);
  };

  const reset = () => { setAnswers({}); setSubmitted(false); setScore(0); };

  if (submitted) {
    const passed = score >= 70;
    return (
      <div className="text-center space-y-6 py-4">
        <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full text-3xl font-black
          ${passed ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
          {score}%
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {passed ? (score === 100 ? "Perfect score! 🎉" : "Well done!") : "Not quite yet"}
          </h3>
          <p className="text-gray-500">
            {passed ? `You passed with ${score}%.` : `You scored ${score}%. 70% is needed to pass.`}
          </p>
        </div>
        {!passed && (
          <div className="space-y-3">
            {questions.map((q, i) => {
              const chose = answers[i];
              const correct = chose === q.correct_answer;
              return (
                <div key={i} className={`text-left p-4 rounded-xl border text-sm ${correct ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                  <p className="font-semibold text-gray-800 mb-1">{q.question}</p>
                  {!correct && <p className="text-green-700">✓ {q.options[q.correct_answer]}</p>}
                  {q.explanation && <p className="text-gray-500 mt-1 text-xs">{q.explanation}</p>}
                </div>
              );
            })}
            <Button onClick={reset} variant="outline" className="gap-2 mt-2">
              <RotateCcw className="w-4 h-4" /> Try Again
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm font-semibold text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-2">
        <Trophy className="w-4 h-4" />
        Lesson Quiz — answer all questions, then submit
      </div>

      {questions.map((q, qi) => (
        <Card key={qi} className="border border-gray-200 shadow-none">
          <CardContent className="pt-5 pb-4 space-y-3">
            <p className="font-semibold text-gray-900 text-sm">{qi + 1}. {q.question}</p>
            <div className="grid gap-2">
              {q.options.map((opt, oi) => {
                const sel = answers[qi] === oi;
                return (
                  <button
                    key={oi}
                    onClick={() => setAnswers({ ...answers, [qi]: oi })}
                    className={`w-full text-left px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                      sel
                        ? "border-green-600 bg-green-50 text-green-800"
                        : "border-gray-200 bg-white text-gray-700 hover:border-green-300 hover:bg-green-50"
                    }`}
                  >
                    <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold mr-2
                      ${sel ? "bg-green-600 text-white" : "bg-gray-200 text-gray-500"}`}>
                      {String.fromCharCode(65 + oi)}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}

      <Button
        onClick={submit}
        disabled={!allAnswered}
        className="w-full h-14 text-base font-bold bg-green-700 hover:bg-green-800 text-white disabled:opacity-40 rounded-xl gap-2"
      >
        <Trophy className="w-5 h-5" />
        Submit Answers
      </Button>
    </div>
  );
}

// ─── Simulation embed ──────────────────────────────────────────

function SimulationEmbed({ simInfo, onComplete }) {
  const [launched, setLaunched] = useState(false);
  const [done,     setDone]     = useState(false);

  if (!launched) {
    return (
      <div className="rounded-xl border-2 border-green-200 bg-green-50 p-6 text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-green-700 flex items-center justify-center mx-auto">
          <Play className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">Interactive Simulation</h3>
        <p className="text-gray-600 text-sm">
          Apply what you've learned with a hands-on exercise.
        </p>
        <Button
          onClick={() => setLaunched(true)}
          className="bg-green-700 hover:bg-green-800 text-white gap-2"
        >
          <Play className="w-4 h-4" /> Launch Simulation
        </Button>
      </div>
    );
  }

  const handleSimDone = () => {
    setDone(true);
    onComplete();
  };

  return (
    <div className="space-y-4">
      <SimulationRouter simInfo={simInfo} onComplete={handleSimDone} />
      {done && (
        <div className="flex items-center gap-2 text-green-700 font-semibold text-sm p-3 bg-green-50 rounded-lg border border-green-200">
          <CheckCircle className="w-5 h-5" /> Simulation complete!
        </div>
      )}
    </div>
  );
}

// Lazy-loaded simulation components
function SimulationRouter({ simInfo, onComplete }) {
  const [Component, setComponent] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        if (simInfo.type === "BudgetWalkthrough") {
          const m = await import("@/components/BudgetWalkthrough");
          setComponent(() => m.default);
        } else if (simInfo.type === "ScenarioBudgetSimulation") {
          const m = await import("@/components/ScenarioBudgetSimulation");
          setComponent(() => m.default);
        } else if (simInfo.type === "InterestCalculator") {
          const m = await import("@/components/InterestCalculator");
          setComponent(() => m.default);
        }
      } catch (e) {
        console.error("Failed to load simulation:", e);
      }
    }
    load();
  }, [simInfo.type]);

  if (!Component) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (simInfo.scenarioId !== null) {
    return (
      <Component
        scenarioId={simInfo.scenarioId}
        onComplete={onComplete}
      />
    );
  }

  return <Component onComplete={onComplete} />;
}

// ─── Main component ────────────────────────────────────────────

export default function Lesson() {
  const navigate    = useNavigate();
  const queryClient = useQueryClient();

  const [user,        setUser]        = useState(null);
  const [stepIndex,   setStepIndex]   = useState(0);
  const [passed,      setPassed]      = useState(false);  // quiz passed
  const [quizFailed,  setQuizFailed]  = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevel,    setNewLevel]    = useState(null);
  const [simDone,     setSimDone]     = useState(false);

  // Read lesson ID from HashRouter URL: /#/lesson?id=xxx
  const lessonId = useMemo(() => {
    const hash = window.location.hash;
    const qi   = hash.indexOf("?");
    if (qi === -1) return null;
    return new URLSearchParams(hash.slice(qi + 1)).get("id");
  }, []);

  // Auth check
  useEffect(() => {
    const u = getLocalUser();
    if (!u) { navigate(createPageUrl("Login")); return; }
    setUser(u);
    if (!u.onboarding_completed) navigate(createPageUrl("SchoolSelection"));
  }, [navigate]);

  const { completedChallenge, clearCompletedChallenge } = useChallengeCheck(user);

  // Fetch lesson
  const { data: lesson, isLoading: lessonLoading } = useQuery({
    queryKey: ["lesson", lessonId],
    queryFn: async () => {
      const lessons = await dataClient.listLessons();
      return lessons.find((l) => String(l.id) === String(lessonId)) || null;
    },
    enabled: !!lessonId,
  });

  // Redirect special pages (AI Day, legacy interactive stubs)
  // Pass courseId as a query param so the special page can navigate back to the correct course
  useEffect(() => {
    if (!lesson) return;
    const sp = detectSpecialLessonPage(lesson);
    if (!sp) return;
    const basePath  = createPageUrl(sp);
    const courseCtx = lesson.course_id ? `?courseId=${lesson.course_id}` : "";
    navigate(basePath + courseCtx, { replace: true });
  }, [lesson, navigate]);

  // Fetch course and sibling lessons
  const { data: course } = useQuery({
    queryKey: ["course", lesson?.course_id],
    queryFn: async () => {
      const cs = await dataClient.listCourses();
      return cs.find((c) => String(c.id) === String(lesson?.course_id)) || null;
    },
    enabled: !!lesson?.course_id,
  });

  const { data: allLessons = [] } = useQuery({
    queryKey: ["lessons_for_course", lesson?.course_id],
    queryFn: async () => {
      const all = await dataClient.listLessons();
      return all
        .filter((l) => String(l.course_id) === String(lesson?.course_id))
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    },
    enabled: !!lesson?.course_id,
  });

  const { data: progress, refetch: refetchProgress } = useQuery({
    queryKey: ["lessonProgress", user?.email, lessonId],
    queryFn: async () => {
      const list = await dataClient.listUserProgress({ user_email: user?.email, lesson_id: lessonId });
      return list[0] || null;
    },
    enabled: !!user && !!lessonId,
  });

  // Complete mutation
  const completeMutation = useMutation({
    mutationFn: async ({ quizScore }) => {
      if (!user?.email || !lesson?.course_id || !lessonId) throw new Error("Missing required fields");

      const now    = new Date().toISOString();
      const record = progress
        ? { ...progress, completed: true, completed_date: now, quiz_score: quizScore }
        : {
            id:             safeUUID() || `up_${Date.now()}`,
            user_email:     user.email,
            lesson_id:      lessonId,
            course_id:      lesson.course_id,
            completed:      true,
            completed_date: now,
            quiz_score:     quizScore,
          };
      await dataClient.upsertUserProgress(record);

      const xpReward        = Number(lesson.xp_reward || 0);
      const newXP           = (user.xp_points || 0) + xpReward;
      const calculatedLevel = Math.floor(newXP / 500) + 1;
      const updatedUser     = {
        ...user,
        xp_points:               newXP,
        level:                   calculatedLevel,
        total_lessons_completed: (user.total_lessons_completed || 0) + 1,
      };
      setLocalUser(updatedUser);
      setUser(updatedUser);
      if (calculatedLevel > (user.level || 1)) { setNewLevel(calculatedLevel); setShowLevelUp(true); }

      const today = now.split("T")[0];
      const acts  = await dataClient.getDailyActivity({ user_email: user.email, date: today });
      if (acts.length > 0) {
        await dataClient.upsertDailyActivity({ ...acts[0], lessons_completed: (acts[0].lessons_completed || 0) + 1, xp_earned: (acts[0].xp_earned || 0) + xpReward });
      } else {
        await dataClient.upsertDailyActivity({ id: safeUUID() || `da_${Date.now()}`, user_email: user.email, date: today, lessons_completed: 1, xp_earned: xpReward });
      }
    },
    onSuccess: () => {
      refetchProgress();
      queryClient.invalidateQueries({ queryKey: ["userProgress"] });
      queryClient.invalidateQueries({ queryKey: ["allUserProgress"] });
      queryClient.invalidateQueries({ queryKey: ["dailyActivity"] });
      queryClient.invalidateQueries({ queryKey: ["userChallenges"] });
      toast.success(`🎉 Lesson complete! +${lesson?.xp_reward || 0} XP`);
    },
    onError: (err) => {
      console.error(err);
      toast.error("Couldn't save progress. Please try again.");
    },
  });

  // ── FIXED: Continue always routes back to parent course page ──
  const handleContinueToCourse = useCallback(() => {
    if (!lesson?.course_id) { navigate(createPageUrl("Learn")); return; }
    navigate(createPageUrl(`CourseDetail?id=${lesson.course_id}`));
  }, [lesson, navigate]);

  const handleQuizPass = useCallback((quizScore) => {
    setPassed(true);
    completeMutation.mutate({ quizScore });
  }, [completeMutation]);

  const handleQuizFail = useCallback(() => {
    setQuizFailed(true);
  }, []);

  // ── Build steps from lesson content ──────────────────────────
  const steps = useMemo(() => {
    if (!lesson) return [];
    return buildSteps(lesson);
  }, [lesson]);

  const simInfo = useMemo(() => getSimulationForLesson(lesson), [lesson]);

  const handleStepContinue = useCallback(() => {
    setStepIndex((prev) => {
      const next = prev + 1;
      // Guard: if we've passed all steps and there's no simulation or quiz, auto-complete
      const hasQuiz = steps.some((s) => s.type === "quiz");
      if (next >= steps.length && !simInfo && !hasQuiz) {
        completeMutation.mutate({ quizScore: 100 });
        setPassed(true);
        return prev;
      }
      return next;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [steps, simInfo, completeMutation]);
  const totalStepCount = steps.length + (simInfo ? 1 : 0);
  const currentStep = steps[stepIndex];
  const isOnSim = simInfo && stepIndex === steps.length;

  // Overall lesson progress percent (for top bar)
  const lessonProgressPct = allLessons.length > 0
    ? Math.round((allLessons.findIndex((l) => String(l.id) === String(lessonId)) + 1) / allLessons.length * 100)
    : 0;

  // ── Loading states ─────────────────────────────────────────────

  if (!lessonId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
        <Card className="max-w-md border border-gray-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Missing Lesson ID</h2>
            <p className="text-gray-500 mb-6">This page needs a lesson ID in the URL.</p>
            <Button onClick={() => navigate(createPageUrl("Learn"))} className="bg-green-700 hover:bg-green-800 text-white">
              Browse Courses
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (lessonLoading || (lessonId && !lesson && !lessonLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Loading lesson…</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
        <Card className="max-w-md border border-gray-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Lesson Not Found</h2>
            <p className="text-gray-500 mb-6">We couldn't find that lesson.</p>
            <Button onClick={() => navigate(createPageUrl("Learn"))} className="bg-green-700 hover:bg-green-800 text-white">
              Browse Courses
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Still loading course data — render loading
  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Loading lesson…</p>
        </div>
      </div>
    );
  }

  // ── Completion screen ─────────────────────────────────────────

  if (passed) {
    return (
      <>
        {showLevelUp && newLevel && (
          <LevelUpModal level={newLevel} onClose={() => setShowLevelUp(false)} />
        )}
        {completedChallenge && (
          <ChallengeCompleteModal challenge={completedChallenge} onClose={clearCompletedChallenge} />
        )}
        <div className="min-h-screen bg-white flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center space-y-6">
            {/* Trophy */}
            <div className="w-24 h-24 rounded-full bg-green-700 flex items-center justify-center mx-auto shadow-xl">
              <Trophy className="w-12 h-12 text-white" />
            </div>

            <div>
              <h1 className="text-3xl font-black text-gray-900 mb-2">Lesson Complete!</h1>
              <p className="text-gray-500">You've finished <span className="font-semibold text-gray-700">"{lesson.title}"</span></p>
            </div>

            {/* XP badge */}
            <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 font-bold px-5 py-2 rounded-full text-sm">
              <Zap className="w-4 h-4" />
              +{lesson.xp_reward || 0} XP earned
            </div>

            {/* Course progress bar */}
            {allLessons.length > 1 && (
              <div className="bg-gray-50 rounded-xl p-4 text-left">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                  <span>Course progress</span>
                  <span>{lessonProgressPct}%</span>
                </div>
                <Progress value={lessonProgressPct} className="h-2" />
              </div>
            )}

            {/* Continue button — always goes to CourseDetail */}
            <Button
              onClick={handleContinueToCourse}
              className="w-full h-14 text-base font-bold bg-green-700 hover:bg-green-800 text-white rounded-xl gap-2"
            >
              <Home className="w-5 h-5" />
              Back to Course
            </Button>
          </div>
        </div>
      </>
    );
  }

  // ── Lesson step progress ──────────────────────────────────────

  const stepProgressPct = Math.round(((stepIndex + (isOnSim ? 1 : 0)) / totalStepCount) * 100);

  // ── Main lesson layout ────────────────────────────────────────

  return (
    <>
      {showLevelUp && newLevel && (
        <LevelUpModal level={newLevel} onClose={() => setShowLevelUp(false)} />
      )}
      {completedChallenge && (
        <ChallengeCompleteModal challenge={completedChallenge} onClose={clearCompletedChallenge} />
      )}

      <div className="min-h-screen bg-gray-50">
        {/* ── Top progress bar ── */}
        <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
          <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-4">
            <button
              onClick={() => navigate(createPageUrl(`CourseDetail?id=${lesson.course_id}`))}
              className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <Progress value={stepProgressPct} className="h-2.5" />
            </div>
            <div className="flex items-center gap-1 text-green-700 text-sm font-bold flex-shrink-0">
              <Zap className="w-4 h-4" />
              {lesson.xp_reward || 0}
            </div>
          </div>
        </div>

        {/* ── Lesson header ── */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-3xl mx-auto px-4 py-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-700 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {course?.name && (
                    <Badge variant="outline" className="text-xs text-green-700 border-green-200 bg-green-50">
                      {course.name}
                    </Badge>
                  )}
                  {lesson.duration_minutes && (
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />{lesson.duration_minutes} min
                    </span>
                  )}
                </div>
                <h1 className="text-xl font-bold text-gray-900 leading-tight">{lesson.title}</h1>
              </div>
            </div>
          </div>
        </div>

        {/* ── Step dots ── */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-1.5">
            {Array.from({ length: totalStepCount }).map((_, i) => {
              const isActive   = i === (isOnSim ? steps.length : stepIndex);
              const isComplete = i < (isOnSim ? steps.length : stepIndex);
              return (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isActive   ? "bg-green-700 flex-[2]" :
                    isComplete ? "bg-green-400 flex-1" :
                                 "bg-gray-200 flex-1"
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* ── Step content card ── */}
        <div className="max-w-3xl mx-auto px-4 py-6">
          <Card className="border border-gray-200 shadow-sm bg-white">
            {/* Card header — type indicator */}
            <CardHeader className="pb-0 pt-5 px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isOnSim ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-green-700">
                      <Play className="w-3.5 h-3.5" /> Practice
                    </span>
                  ) : currentStep?.type === "concept" ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      <BookOpen className="w-3.5 h-3.5" /> Learn
                    </span>
                  ) : currentStep?.type === "check" ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-amber-600">
                      <Lightbulb className="w-3.5 h-3.5" /> Check
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-green-700">
                      <Trophy className="w-3.5 h-3.5" /> Quiz
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-400">
                  {(isOnSim ? steps.length : stepIndex) + 1} / {totalStepCount}
                </span>
              </div>
            </CardHeader>

            <CardContent className="p-6 pt-4">
              {isOnSim ? (
                <SimulationEmbed
                  simInfo={simInfo}
                  onComplete={() => {
                    setSimDone(true);
                    // Auto-advance to quiz if not already passed, or to completion
                    const hasQuizStep = steps.some((s) => s.type === "quiz");
                    if (!hasQuizStep) {
                      // No quiz — mark complete with 100%
                      completeMutation.mutate({ quizScore: 100 });
                      setPassed(true);
                    } else {
                      setStepIndex(steps.findIndex((s) => s.type === "quiz"));
                    }
                  }}
                />
              ) : currentStep?.type === "concept" ? (
                <ConceptStep
                  content={currentStep.content}
                  onContinue={() => {
                    // If next step is the sim, go there; otherwise advance
                    const nextIdx = stepIndex + 1;
                    if (nextIdx === steps.length && simInfo) {
                      setStepIndex(steps.length); // activates isOnSim
                    } else {
                      handleStepContinue();
                    }
                  }}
                  isLast={stepIndex === steps.length - 2 && steps[steps.length - 1]?.type === "quiz"}
                />
              ) : currentStep?.type === "check" ? (
                <CheckStep
                  question={currentStep.question}
                  onContinue={handleStepContinue}
                />
              ) : currentStep?.type === "quiz" ? (
                <QuizStep
                  questions={currentStep.questions}
                  onPass={handleQuizPass}
                  onFail={handleQuizFail}
                />
              ) : null}
            </CardContent>
          </Card>

          {/* Minimal footer */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate(createPageUrl(`CourseDetail?id=${lesson.course_id}`))}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              ← Back to course
            </button>
          </div>
        </div>
      </div>
    </>
  );
}