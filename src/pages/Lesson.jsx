// src/pages/Lesson.jsx - FIXED VERSION
import React, { useState, useEffect, useMemo } from "react";
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

const safeUUID = () => {
  try {
    return globalThis?.crypto?.randomUUID?.() || null;
  } catch {
    return null;
  }
};

const data = {
  async listLessons() {
    const basePath = import.meta.env.BASE_URL || "/";
    return fetchJsonWithCache(`${basePath}data/lessons.json`, "sprout_lessons", []);
  },
  async listCourses() {
    const basePath = import.meta.env.BASE_URL || "/";
    return fetchJsonWithCache(`${basePath}data/courses.json`, "sprout_courses", []);
  },
  async listUserProgress({ user_email, course_id, lesson_id } = {}) {
    const all = getJSON("sprout_user_progress", []);
    return all.filter((p) => {
      if (user_email && p.user_email !== user_email) return false;
      if (course_id && String(p.course_id) !== String(course_id)) return false;
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

// ✅ NEW: Detect if lesson should use a specific page
function detectSpecialLessonPage(lesson) {
  if (!lesson || !lesson.title) return null;
  
  const title = lesson.title.toLowerCase();
  const content = lesson.content || '';
  const contentLength = content.trim().length;
  
  // AI Day lessons (Day 1, Day 2, etc.) - these always redirect
  const dayMatch = lesson.title.match(/^Day (\d+):/i);
  if (dayMatch) {
    const dayNum = dayMatch[1];
    return `AIDay${dayNum}`;
  }
  
  // For other special pages, only redirect if content is SHORT (< 300 chars)
  // This prevents real content lessons from being redirected
  if (contentLength > 300) {
    return null; // Has real content, use regular Lesson page
  }
  
  // Budget lessons (only if short content)
  if (title.includes('budget') && !title.includes('quiz')) {
    return 'BudgetLesson';
  }
  
  // Paycheck lessons (only if short content)
  if (title.includes('paycheck') && !title.includes('quiz')) {
    return 'PaycheckLesson';
  }
  
  // Credit card lessons (only if short content)
  if ((title.includes('credit') || title.includes('statement')) && !title.includes('quiz')) {
    return 'CreditCardLesson';
  }
  
  return null;
}

// ✅ NEW: Better content validation
function hasSubstantialContent(content) {
  if (!content || typeof content !== 'string') return false;
  
  const trimmed = content.trim();
  
  // Check length
  if (trimmed.length < 200) return false;
  
  // Check for markdown structure (## headers)
  const hasHeaders = /^##\s/m.test(trimmed);
  
  return hasHeaders;
}

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

  // Read lesson ID from hash (HashRouter)
  const lessonId = useMemo(() => {
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

  // ✅ NEW: Auto-redirect to special lesson pages
  useEffect(() => {
    if (!lesson) return;
    
    const specialPage = detectSpecialLessonPage(lesson);
    if (specialPage) {
      console.log(`Redirecting to ${specialPage} for interactive lesson`);
      // Use replace instead of push to avoid issues
      navigate(createPageUrl(specialPage), { replace: true });
    }
  }, [lesson, navigate]);

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

  const completeMutation = useMutation({
    mutationFn: async ({ quizScore }) => {
      if (!user?.email) throw new Error("Missing user");
      if (!lesson?.course_id) throw new Error("Missing lesson/course");
      if (!lessonId) throw new Error("Missing lessonId");

      const now = new Date().toISOString();
      const userEmail = user.email;

      const existing = progress;
      const progressRecord = existing
        ? { ...existing, completed: true, completed_date: now, quiz_score: quizScore }
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

  if (!lesson || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-lime-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lesson...</p>
        </div>
      </div>
    );
  }

  // Check if this lesson should use a special page
  const specialPage = detectSpecialLessonPage(lesson);
  if (specialPage) {
    // Return loading state while redirect happens
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading interactive lesson...</p>
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

  const contentSections = useMemo(() => splitContentIntoPages(lesson.content), [lesson.content]);
  const totalSections = contentSections.length;

  const currentIndex = allLessons.findIndex((l) => String(l.id) === String(lessonId));
  const progressPercent = allLessons.length ? ((currentIndex + 1) / allLessons.length) * 100 : 0;

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

  // ✅ IMPROVED: Better content validation
  const hasLessonContent = hasSubstantialContent(lesson.content);

  return (
    <>
      {showLevelUp && newLevel && (
        <LevelUpModal level={newLevel} onClose={() => setShowLevelUp(false)} />
      )}
      {completedChallenge && (
        <ChallengeCompleteModal challenge={completedChallenge} onClose={clearCompletedChallenge} />
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
                  <img src={lessonImage} alt={lesson.title} className="w-full h-full object-cover" />
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
                  <div className="flex items-center justify-between mb-8 pb-6 border-b">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-5 h-5" />
                      <span className="font-medium">{lesson.duration_minutes} minutes</span>
                    </div>
                    <div className="flex items-center gap-2 text-lime-600">
                      <Zap className="w-5 h-5" />
                      <span className="font-medium">{lesson.xp_reward} XP</span>
                    </div>
                    <div className="flex items-center gap-2 text-purple-600">
                      <Star className="w-5 h-5" />
                      <span className="font-medium">Quiz Required</span>
                    </div>
                  </div>
                )}

                {/* ✅ IMPROVED: Better error messaging */}
                {!hasLessonContent ? (
                  <div className="text-center py-12">
                    <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      Incomplete Lesson Content
                    </h3>
                    
                    <p className="text-gray-600 mb-2 max-w-md mx-auto">
                      This lesson doesn't have proper content yet. The content field only contains:
                    </p>
                    <div className="bg-gray-100 p-4 rounded-lg max-w-md mx-auto mb-4">
                      <p className="text-sm text-gray-700 italic">"{lesson.content}"</p>
                    </div>
                    <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
                      Lessons need structured markdown content with ## headers to display properly.
                      Check the <code className="bg-gray-200 px-2 py-1 rounded">lessons.json</code> file
                      or use a dedicated lesson page component instead.
                    </p>
                    <div className="flex gap-3 justify-center">
                      <Button
                        onClick={() => navigate(createPageUrl(`CourseDetail?id=${lesson.course_id}`))}
                        variant="outline"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Course
                      </Button>
                      <Button
                        onClick={() => navigate(createPageUrl("Learn"))}
                        className="bg-lime-500 hover:bg-lime-600"
                      >
                        Browse All Courses
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
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
                      <ReactMarkdown>{contentSections[currentSection]}</ReactMarkdown>
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
                  </>
                )}
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
                                  ? "bg-green-500 text-white"
                                  : isSelected
                                  ? "bg-red-500 text-white"
                                  : "bg-gray-100 text-gray-500"
                                : isSelected
                                ? "bg-lime-500 text-white"
                                : "bg-white border-2 border-gray-300 hover:border-lime-400 text-gray-700"
                            }`}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </CardContent>
                  </Card>
                ))}

                {!quizSubmitted ? (
                  <Button
                    onClick={handleQuizSubmit}
                    disabled={Object.keys(quizAnswers).length !== (lesson.quiz_questions || []).length}
                    className="w-full h-16 text-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white disabled:opacity-50"
                  >
                    <Trophy className="w-6 h-6 mr-2" />
                    Submit Answers
                  </Button>
                ) : (
                  <Card className="border-none shadow-2xl bg-gradient-to-r from-orange-400 to-red-500 text-white">
                    <CardContent className="p-8 text-center">
                      <h3 className="text-4xl font-bold mb-3">{score === 100 ? "Perfect!" : "Try again"}</h3>
                      <p className="text-6xl font-bold mb-4">{score}%</p>

                      {score === 100 ? (
                        <Button onClick={handleNext} className="bg-white text-green-700 h-14 px-10">
                          Next
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                      ) : (
                        <div className="flex gap-4 justify-center flex-wrap">
                          <Button
                            onClick={() => {
                              setShowQuiz(false);
                              setCurrentSection(0);
                              window.scrollTo(0, 0);
                            }}
                            variant="outline"
                            className="bg-white/20 border-white text-white"
                          >
                            <BookOpen className="w-5 h-5 mr-2" />
                            Review Lesson
                          </Button>
                          <Button onClick={handleRetakeQuiz} className="bg-white text-orange-700">
                            <TrendingUp className="w-5 h-5 mr-2" />
                            Retake Quiz
                          </Button>
                        </div>
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