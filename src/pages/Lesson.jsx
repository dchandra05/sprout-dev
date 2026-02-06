// src/pages/Lesson.jsx
import React, { useState, useEffect } from "react";
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
  Zap,
  Trophy,
  Clock,
  Sparkles,
  BookOpen,
  Star,
  Target,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import LevelUpModal from "@/components/LevelUpModal";
import ChallengeCompleteModal from "@/components/ChallengeCompleteModal";
import { useChallengeCheck } from "@/components/useChallengeCheck";

/**
 * NOTE: Base44 removed in migration pass.
 * This page uses localStorage as a placeholder data layer.
 * Later you can replace `data.*` with your real backend/API calls.
 */

/** ---------- local helpers ---------- */
const safeParse = (raw, fallback) => {
  try {
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const getJSON = (key, fallback) => safeParse(localStorage.getItem(key), fallback);
const setJSON = (key, value) => localStorage.setItem(key, JSON.stringify(value));

const getLocalUser = () => getJSON("sprout_user", null);
const setLocalUser = (user) => setJSON("sprout_user", user);

// ✅ Safe UUID helper (won’t throw if crypto/randomUUID is missing)
const safeUUID = () => {
  try {
    // window.crypto exists in modern browsers; randomUUID may not in older ones
    return globalThis?.crypto?.randomUUID?.() || null;
  } catch {
    return null;
  }
};

/**
 * Minimal local “data layer”.
 * Keys used:
 * - sprout_courses: Course[]
 * - sprout_lessons: Lesson[]
 * - sprout_user_progress: UserProgress[]
 * - sprout_daily_activity: DailyActivity[]
 */
const data = {
  async listLessons() {
    return getJSON("sprout_lessons", []);
  },
  async listCourses() {
    return getJSON("sprout_courses", []);
  },
  async listUserProgress({ user_email, course_id, lesson_id } = {}) {
    const all = getJSON("sprout_user_progress", []);
    return all.filter((p) => {
      if (user_email && p.user_email !== user_email) return false;
      if (course_id && p.course_id !== course_id) return false;
      if (lesson_id && String(p.lesson_id) !== String(lesson_id)) return false;
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
    const idx = all.findIndex(
      (a) => a.user_email === record.user_email && a.date === record.date
    );
    if (idx >= 0) all[idx] = { ...all[idx], ...record };
    else all.push(record);
    setJSON("sprout_daily_activity", all);
    return record;
  },
  async getDailyActivity({ user_email, date }) {
    const all = getJSON("sprout_daily_activity", []);
    return all.filter((a) => a.user_email === user_email && a.date === date);
  },
};

// Images for lesson content
const lessonImages = {
  budget: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80",
  paycheck: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=800&q=80",
  insurance: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80",
  ai: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
  ml: "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800&q=80",
  piggybank: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&q=80",
  investing: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
  credit: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80",
  career: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80",
};

export default function Lesson() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [user, setUser] = useState(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState(null);

  const urlParams = new URLSearchParams(window.location.search);
  const lessonId = urlParams.get("id");

  useEffect(() => {
    const currentUser = getLocalUser();
    if (!currentUser) {
      navigate(createPageUrl("Login"));
      return;
    }

    setUser(currentUser);

    if (!currentUser.onboarding_completed) {
      navigate(createPageUrl("SchoolSelection"));
    }
  }, [navigate]);

  const { completedChallenge, clearCompletedChallenge } = useChallengeCheck(user);

  const { data: lesson } = useQuery({
    queryKey: ["lesson", lessonId],
    queryFn: async () => {
      const lessons = await data.listLessons();
      return lessons.find((l) => String(l.id) === String(lessonId)) || null;
    },
    enabled: !!lessonId,
  });

  const { data: course } = useQuery({
    queryKey: ["course", lesson?.course_id],
    queryFn: async () => {
      const courses = await data.listCourses();
      return courses.find((c) => String(c.id) === String(lesson?.course_id)) || null;
    },
    enabled: !!lesson?.course_id,
  });

  const { data: allLessons = [] } = useQuery({
    queryKey: ["lessons", lesson?.course_id],
    queryFn: async () => {
      const lessons = await data.listLessons();
      return lessons
        .filter((l) => String(l.course_id) === String(lesson?.course_id))
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    },
    enabled: !!lesson?.course_id,
  });

  const { data: progress, refetch: refetchProgress } = useQuery({
    queryKey: ["lessonProgress", user?.email, lessonId],
    queryFn: async () => {
      const progressList = await data.listUserProgress({
        user_email: user?.email,
        lesson_id: lessonId,
      });
      return progressList[0] || null;
    },
    enabled: !!user && !!lessonId,
  });

  useQuery({
    // kept for parity / future UI use
    queryKey: ["allUserProgress", user?.email, lesson?.course_id],
    queryFn: async () =>
      data.listUserProgress({ user_email: user?.email, course_id: lesson?.course_id }),
    enabled: !!user && !!lesson?.course_id,
  });

  const completeMutation = useMutation({
    mutationFn: async ({ quizScore }) => {
      if (!user?.email) throw new Error("Missing user");
      if (!lesson?.course_id) throw new Error("Missing lesson/course");
      if (!lessonId) throw new Error("Missing lessonId");

      const now = new Date().toISOString();
      const userEmail = user.email;

      // Upsert progress
      const existing = progress;
      const progressRecord = existing
        ? {
            ...existing,
            completed: true,
            completed_date: now,
            quiz_score: quizScore,
          }
        : {
            id: safeUUID() || `up_${Date.now()}`,
            user_email: userEmail,
            lesson_id: lessonId,
            course_id: lesson.course_id,
            completed: true,
            completed_date: now,
            quiz_score: quizScore,
          };

      await data.upsertUserProgress(progressRecord);

      // XP + level
      const oldLevel = user.level || 1;
      const xpReward = Number(lesson.xp_reward || 0);
      const newXP = (user.xp_points || 0) + xpReward;
      const calculatedLevel = Math.floor(newXP / 100) + 1;

      const updatedUser = {
        ...user,
        xp_points: newXP,
        level: calculatedLevel,
        total_lessons_completed: (user.total_lessons_completed || 0) + 1,
      };

      setLocalUser(updatedUser);
      setUser(updatedUser);

      if (calculatedLevel > oldLevel) {
        setNewLevel(calculatedLevel);
        setShowLevelUp(true);
      }

      // Daily activity
      const today = new Date().toISOString().split("T")[0];
      const activities = await data.getDailyActivity({ user_email: userEmail, date: today });

      if (activities.length > 0) {
        const a = activities[0];
        await data.upsertDailyActivity({
          ...a,
          lessons_completed: (a.lessons_completed || 0) + 1,
          xp_earned: (a.xp_earned || 0) + xpReward,
        });
      } else {
        await data.upsertDailyActivity({
          id: safeUUID() || `da_${Date.now()}`,
          user_email: userEmail,
          date: today,
          lessons_completed: 1,
          xp_earned: xpReward,
        });
      }
    },
    onSuccess: () => {
      refetchProgress();
      queryClient.invalidateQueries({ queryKey: ["userProgress"] });
      queryClient.invalidateQueries({ queryKey: ["allUserProgress"] });
      queryClient.invalidateQueries({ queryKey: ["dailyActivity"] });
      queryClient.invalidateQueries({ queryKey: ["userChallenges"] });
      toast.success(`🎉 Lesson completed! +${lesson?.xp_reward || 0} XP`);
    },
    onError: (err) => {
      console.error(err);
      toast.error("Something went wrong saving your progress. Please try again.");
    },
  });

  const handleQuizSubmit = () => {
    const questions = lesson?.quiz_questions || [];
    const totalQuestions = questions.length;

    if (!totalQuestions) {
      toast.error("This lesson is missing a quiz.");
      return;
    }

    let correct = 0;
    questions.forEach((q, index) => {
      if (quizAnswers[index] === q.correct_answer) correct++;
    });

    const quizScore = Math.round((correct / totalQuestions) * 100);
    setScore(quizScore);
    setQuizSubmitted(true);

    if (quizScore === 100) {
      completeMutation.mutate({ quizScore });
    }
  };

  const handleRetakeQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setScore(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNext = () => {
    const currentIndex = allLessons.findIndex((l) => String(l.id) === String(lessonId));

    if (currentIndex === -1) {
      navigate(createPageUrl("Learn"));
      return;
    }

    if (currentIndex === allLessons.length - 1) {
      navigate(createPageUrl(`FinalExam?courseId=${lesson.course_id}`));
      return;
    }

    if (!progress?.completed) {
      toast.error("Complete this lesson first!");
      return;
    }

    const nextLesson = allLessons[currentIndex + 1];
    navigate(createPageUrl(`Lesson?id=${nextLesson.id}`));
    setCurrentSection(0);
    setShowQuiz(false);
    window.scrollTo(0, 0);
  };

  // Missing ID
  if (!lessonId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <Card className="max-w-md border-none shadow-xl">
          <CardContent className="p-8">
            <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Missing Lesson ID</h2>
            <p className="text-gray-600 mb-6">This page needs a lesson id in the URL.</p>
            <Button onClick={() => navigate(createPageUrl("Learn"))}>Back to Courses</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading / not found
  if (!lesson || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-lime-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lesson...</p>
          <p className="text-xs text-gray-500 mt-2">
            (If this never loads, you probably haven’t populated sprout_lessons/sprout_courses yet.)
          </p>
        </div>
      </div>
    );
  }

  const splitContentIntoPages = (content) => {
    const sections = String(content || "")
      .split(/(?=^## )/m)
      .filter((s) => s.trim());
    return sections.length > 1 ? sections : [String(content || "")];
  };

  const contentSections = splitContentIntoPages(lesson.content);
  const totalSections = contentSections.length;

  const currentIndex = allLessons.findIndex((l) => String(l.id) === String(lessonId));
  const progressPercent = allLessons.length ? ((currentIndex + 1) / allLessons.length) * 100 : 0;

  // Determine image for lesson
  let lessonImage = lessonImages.piggybank;
  const t = (lesson.title || "").toLowerCase();
  if (t.includes("budget")) lessonImage = lessonImages.budget;
  if (t.includes("paycheck")) lessonImage = lessonImages.paycheck;
  if (t.includes("insurance")) lessonImage = lessonImages.insurance;
  if (t.includes("ai") || t.includes("artificial")) lessonImage = lessonImages.ai;
  if (t.includes("machine") || t.includes("neural")) lessonImage = lessonImages.ml;
  if (t.includes("invest")) lessonImage = lessonImages.investing;
  if (t.includes("credit") || t.includes("debt")) lessonImage = lessonImages.credit;
  if (t.includes("career")) lessonImage = lessonImages.career;

  return (
    <>
      {showLevelUp && newLevel && (
        <LevelUpModal level={newLevel} onClose={() => setShowLevelUp(false)} />
      )}
      {completedChallenge && (
        <ChallengeCompleteModal
          challenge={completedChallenge}
          onClose={clearCompletedChallenge}
        />
      )}

      <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-lime-50 via-white to-green-50">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <Button
              variant="outline"
              onClick={() => navigate(createPageUrl(`CourseDetail?id=${lesson.course_id}`))}
              className="shadow-md"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Course
            </Button>

            <div className="flex items-center gap-3">
              <Badge className="bg-lime-100 text-lime-700 text-sm px-3 py-1">
                Lesson {Math.max(currentIndex, 0) + 1} of {allLessons.length || 1}
              </Badge>
              {progress?.completed && (
                <Badge className="bg-green-100 text-green-700 text-sm px-3 py-1">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Completed
                </Badge>
              )}
            </div>
          </div>

          {/* Course Progress */}
          <Card className="border-none shadow-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  <p className="text-sm font-semibold">{course.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  <p className="text-sm font-bold">{Math.round(progressPercent)}%</p>
                </div>
              </div>
              <Progress value={progressPercent} className="h-3 bg-white/20">
                <div className="h-full bg-white rounded-full transition-all" />
              </Progress>
            </CardContent>
          </Card>

          {!showQuiz ? (
            <Card className="border-none shadow-xl bg-white overflow-hidden">
              {currentSection === 0 && (
                <div className="h-64 overflow-hidden relative">
                  <img
                    src={lessonImage}
                    alt={lesson.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <Badge
                      variant="outline"
                      className="border-white text-white mb-2 bg-white/20 backdrop-blur-sm"
                    >
                      {course.category}
                    </Badge>
                    <h1 className="text-3xl md:text-4xl font-bold">{lesson.title}</h1>
                  </div>
                </div>
              )}

              <CardContent className="p-8 md:p-12">
                {currentSection === 0 && (
                  <div className="flex items-center gap-6 mb-8 pb-6 border-b">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-5 h-5" />
                      <span className="font-medium">{lesson.duration_minutes} min</span>
                    </div>
                    <div className="flex items-center gap-2 text-lime-600">
                      <Zap className="w-5 h-5" />
                      <span className="font-semibold">{lesson.xp_reward} XP</span>
                    </div>
                    <div className="flex items-center gap-2 text-purple-600">
                      <Star className="w-5 h-5" />
                      <span className="font-medium">Quiz Required</span>
                    </div>
                  </div>
                )}

                {/* Section Progress */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">
                      Section {currentSection + 1} of {totalSections}
                    </span>
                    <span className="text-sm font-medium text-lime-600">
                      {Math.round(((currentSection + 1) / totalSections) * 100)}%
                    </span>
                  </div>
                  <Progress value={((currentSection + 1) / totalSections) * 100} className="h-2" />
                </div>

                {/* Content Section */}
                <div className="prose prose-lg max-w-none mb-8">
                  <ReactMarkdown
                    components={{
                      h1: ({ node, ...props }) => (
                        <h1 className="text-3xl font-bold text-gray-900 mb-6" {...props} />
                      ),
                      h2: ({ node, ...props }) => (
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8" {...props} />
                      ),
                      h3: ({ node, ...props }) => (
                        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6" {...props} />
                      ),
                      p: ({ node, ...props }) => (
                        <p className="text-gray-700 leading-relaxed mb-4 text-lg" {...props} />
                      ),
                      ul: ({ node, ...props }) => (
                        <ul className="space-y-3 ml-6 list-none mb-6" {...props} />
                      ),
                      li: ({ node, children, ...props }) => (
                        <li className="flex items-start gap-3" {...props}>
                          <span className="w-6 h-6 bg-lime-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </span>
                          <span className="text-gray-700 flex-1">{children}</span>
                        </li>
                      ),
                      ol: ({ node, ...props }) => (
                        <ol
                          className="space-y-3 ml-6 list-decimal marker:text-lime-600 marker:font-semibold mb-6"
                          {...props}
                        />
                      ),
                      blockquote: ({ node, ...props }) => (
                        <blockquote
                          className="my-6 border-l-4 border-lime-500 bg-lime-50 p-6 rounded-r-lg"
                          {...props}
                        />
                      ),
                      strong: ({ node, ...props }) => (
                        <strong className="text-gray-900 font-bold" {...props} />
                      ),
                    }}
                  >
                    {contentSections[currentSection]}
                  </ReactMarkdown>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between gap-4 pt-6 border-t">
                  {currentSection > 0 && (
                    <Button
                      onClick={() => {
                        setCurrentSection(currentSection - 1);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      variant="outline"
                      className="h-14 px-8"
                    >
                      <ArrowLeft className="w-5 h-5 mr-2" />
                      Previous
                    </Button>
                  )}

                  {currentSection < totalSections - 1 ? (
                    <Button
                      onClick={() => {
                        setCurrentSection(currentSection + 1);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="ml-auto h-14 px-8 bg-gradient-to-r from-lime-400 to-green-500 hover:from-lime-500 hover:to-green-600"
                    >
                      Continue
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        if (!lesson.quiz_questions || lesson.quiz_questions.length === 0) {
                          toast.error("This lesson is missing a quiz.");
                          return;
                        }
                        setShowQuiz(true);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="ml-auto h-14 px-8 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                      Take Quiz
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-none shadow-xl bg-white overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-3 text-3xl mb-2">
                      <Sparkles className="w-8 h-8" />
                      Knowledge Challenge
                    </CardTitle>
                    <p className="opacity-90">You must score 100% to advance!</p>
                  </div>
                  <div className="text-center bg-white/20 backdrop-blur-sm rounded-xl p-4">
                    <Trophy className="w-10 h-10 mx-auto mb-1" />
                    <p className="text-2xl font-bold">{lesson.xp_reward} XP</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-8 space-y-6">
                {(lesson.quiz_questions || []).map((question, qIndex) => (
                  <Card key={qIndex} className="border-2 border-gray-200 shadow-md overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-lime-400 to-green-500 flex items-center justify-center flex-shrink-0 text-white font-bold text-lg">
                          {qIndex + 1}
                        </div>
                        <p className="font-bold text-xl text-gray-900 flex-1 pt-2">
                          {question.question}
                        </p>
                      </div>
                    </CardHeader>

                    <CardContent className="p-6 space-y-3">
                      {(question.options || []).map((option, oIndex) => {
                        const isSelected = quizAnswers[qIndex] === oIndex;
                        const isCorrect = question.correct_answer === oIndex;
                        const showResult = quizSubmitted;

                        return (
                          <button
                            key={oIndex}
                            onClick={() => {
                              if (!quizSubmitted) {
                                setQuizAnswers({ ...quizAnswers, [qIndex]: oIndex });
                              }
                            }}
                            disabled={quizSubmitted}
                            className={`w-full p-5 rounded-xl text-left transition-all font-medium text-base ${
                              showResult
                                ? isCorrect
                                  ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white border-2 border-green-600 shadow-lg"
                                  : isSelected
                                  ? "bg-gradient-to-r from-red-400 to-pink-500 text-white border-2 border-red-600"
                                  : "bg-gray-100 border-2 border-gray-300 text-gray-500"
                                : isSelected
                                ? "bg-gradient-to-r from-lime-400 to-green-500 text-white border-2 border-lime-600 shadow-lg"
                                : "bg-white border-2 border-gray-300 hover:border-lime-400 hover:shadow-md text-gray-700 cursor-pointer"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{option}</span>
                              {showResult && isCorrect && (
                                <CheckCircle className="w-6 h-6 flex-shrink-0 ml-2" />
                              )}
                              {showResult && isSelected && !isCorrect && (
                                <AlertCircle className="w-6 h-6 flex-shrink-0 ml-2" />
                              )}
                            </div>
                          </button>
                        );
                      })}

                      {quizSubmitted && question.explanation && (
                        <div className="mt-4 p-5 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-500">
                          <p className="text-sm text-blue-900">
                            <strong>Explanation:</strong> {question.explanation}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}

                {!quizSubmitted ? (
                  <Button
                    onClick={handleQuizSubmit}
                    disabled={Object.keys(quizAnswers).length !== (lesson.quiz_questions || []).length}
                    className="w-full h-16 text-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trophy className="w-6 h-6 mr-2" />
                    Submit Answers
                  </Button>
                ) : (
                  <Card
                    className={`border-none shadow-2xl ${
                      score === 100
                        ? "bg-gradient-to-r from-green-400 to-emerald-500"
                        : "bg-gradient-to-r from-orange-400 to-red-500"
                    } text-white`}
                  >
                    <CardContent className="p-8 text-center">
                      {score === 100 ? (
                        <>
                          <Trophy className="w-24 h-24 mx-auto mb-4 animate-bounce" />
                          <h3 className="text-4xl font-bold mb-3">Perfect Score! 🎉</h3>
                          <p className="text-6xl font-bold mb-4">{score}%</p>
                          <p className="text-xl opacity-90 mb-6">You've mastered this lesson!</p>
                          <div className="flex items-center justify-center gap-2 mb-8 text-2xl font-bold">
                            <Zap className="w-8 h-8" />
                            +{lesson.xp_reward} XP Earned!
                          </div>
                          <Button
                            onClick={handleNext}
                            className="bg-white text-green-600 hover:bg-gray-100 h-16 px-10 text-lg shadow-xl"
                          >
                            {currentIndex < allLessons.length - 1 ? (
                              <>
                                Next Lesson
                                <ArrowRight className="w-6 h-6 ml-2" />
                              </>
                            ) : (
                              <>
                                <Trophy className="w-6 h-6 mr-2" />
                                Final Exam
                              </>
                            )}
                          </Button>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-24 h-24 mx-auto mb-4" />
                          <h3 className="text-4xl font-bold mb-3">Not Quite There</h3>
                          <p className="text-6xl font-bold mb-4">{score}%</p>
                          <p className="text-xl opacity-90 mb-8">
                            You need 100% to advance. Review and try again!
                          </p>
                          <div className="flex gap-4 justify-center flex-wrap">
                            <Button
                              onClick={() => {
                                setShowQuiz(false);
                                setCurrentSection(0);
                                window.scrollTo(0, 0);
                              }}
                              variant="outline"
                              className="h-14 px-8 text-base bg-white/20 border-white text-white hover:bg-white/30"
                            >
                              <BookOpen className="w-5 h-5 mr-2" />
                              Review Lesson
                            </Button>
                            <Button
                              onClick={handleRetakeQuiz}
                              className="h-14 px-8 text-base bg-white text-orange-600 hover:bg-gray-100"
                            >
                              <TrendingUp className="w-5 h-5 mr-2" />
                              Retake Quiz
                            </Button>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
