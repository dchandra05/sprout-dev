import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Trophy, Sparkles, AlertCircle, CheckCircle, Zap,
  ArrowLeft, BookOpen, TrendingUp, Award
} from "lucide-react";
import { toast } from "sonner";
import CourseCertificate from "../components/CourseCertificate";

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
  async listLessons(/* courseId */) {
    return [];
  },
  async listUserProgress(/* userEmail, courseId */) {
    return [];
  },
  async getCourseCompletion(/* userEmail, courseId */) {
    return null;
  },
  async upsertCourseCompletion(/* payload */) {
    return;
  },
  async updateUserXP(/* payload */) {
    return;
  }
};

export default function FinalExam() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [examAnswers, setExamAnswers] = useState({});
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showCertificate, setShowCertificate] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get("courseId");

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
      const allLessons = await data.listLessons(courseId);
      return allLessons
        .filter((l) => l.course_id === courseId)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
    },
    enabled: !!courseId,
  });

  const { data: userProgress = [] } = useQuery({
    queryKey: ["userProgress", user?.email, courseId],
    queryFn: async () => {
      if (!user?.email || !courseId) return [];
      return data.listUserProgress(user.email, courseId);
    },
    enabled: !!user && !!courseId,
  });

  const { data: courseCompletion } = useQuery({
    queryKey: ["courseCompletion", user?.email, courseId],
    queryFn: async () => {
      if (!user?.email || !courseId) return null;
      return data.getCourseCompletion(user.email, courseId);
    },
    enabled: !!user && !!courseId,
  });

  const completeMutation = useMutation({
    mutationFn: async ({ examScore }) => {
      if (!user?.email || !courseId) return;

      const now = new Date().toISOString();
      const finalExamXP = 500;

      await data.upsertCourseCompletion({
        user_email: user.email,
        course_id: courseId,
        completed: true,
        completed_date: now,
        final_exam_score: examScore,
      });

      await data.updateUserXP({
        email: user.email,
        xp_delta: finalExamXP,
        courses_completed_delta: 1,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courseCompletion"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("🎉 Course completed! +500 XP");
      setShowCertificate(true);
    },
  });

  const handleExamSubmit = () => {
    if (!course?.final_exam_questions) {
      toast.error("This course is missing a final exam. Please contact support.");
      return;
    }

    const totalQuestions = course.final_exam_questions.length;
    let correctAnswers = 0;

    course.final_exam_questions.forEach((q, index) => {
      if (examAnswers[index] === q.correct_answer) {
        correctAnswers++;
      }
    });

    const examScore = Math.round((correctAnswers / totalQuestions) * 100);
    setScore(examScore);
    setExamSubmitted(true);

    if (examScore === 100) {
      completeMutation.mutate({ examScore });
    }
  };

  const handleRetakeExam = () => {
    setExamAnswers({});
    setExamSubmitted(false);
    setScore(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Loading state with timeout
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!course) setLoadingTimeout(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, [course]);

  if (!course && loadingTimeout) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md border-none shadow-xl">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Having Trouble Loading</h2>
            <p className="text-gray-600 mb-6">
              We're having trouble loading this exam. Please refresh or try again in a moment.
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-lime-400 to-green-500 hover:from-lime-500 hover:to-green-600 text-white"
              >
                Retry
              </Button>
              <Button variant="outline" onClick={() => navigate(createPageUrl("Learn"))}>
                Back to Courses
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-lime-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading exam...</p>
        </div>
      </div>
    );
  }

  const allLessonsCompleted =
    lessons.length > 0 &&
    lessons.every((lesson) =>
      userProgress.some((p) => p.lesson_id === lesson.id && p.completed)
    );

  if (lessons.length > 0 && !allLessonsCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md border-none shadow-xl">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Not Ready Yet!</h2>
            <p className="text-gray-600 mb-6">
              You must complete all lessons before taking the final exam.
            </p>
            <Button
              onClick={() => navigate(createPageUrl(`CourseDetail?id=${courseId}`))}
              className="bg-gradient-to-r from-lime-400 to-green-500 hover:from-lime-500 hover:to-green-600 text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Course
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showCertificate) {
    return (
      <CourseCertificate
        course={course}
        user={user}
        completionDate={new Date().toISOString()}
        onContinue={() => navigate(createPageUrl("Learn"))}
      />
    );
  }

  if (!course.final_exam_questions || course.final_exam_questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md border-none shadow-xl">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Missing Exam</h2>
            <p className="text-gray-600 mb-6">This course doesn't have a final exam configured yet.</p>
            <Button
              onClick={() => navigate(createPageUrl(`CourseDetail?id=${courseId}`))}
              className="bg-gradient-to-r from-lime-400 to-green-500 hover:from-lime-500 hover:to-green-600 text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Course
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <Button
            variant="outline"
            onClick={() => navigate(createPageUrl(`CourseDetail?id=${courseId}`))}
            className="shadow-md"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Course
          </Button>
          <Badge className="bg-purple-100 text-purple-700 text-sm px-3 py-1">
            Final Exam
          </Badge>
        </div>

        {/* Exam Header */}
        <Card className="border-none shadow-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white overflow-hidden">
          <CardContent className="p-8 md:p-12 relative">
            <div className="absolute top-0 right-0 opacity-10">
              <Trophy className="w-64 h-64" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-12 h-12" />
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-2">Final Exam</h1>
                  <p className="text-xl opacity-90">{course.name}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-8 p-6 bg-white/10 backdrop-blur-sm rounded-xl">
                <div className="text-center">
                  <p className="text-3xl font-bold">{course.final_exam_questions.length}</p>
                  <p className="text-sm opacity-90">Questions</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">100%</p>
                  <p className="text-sm opacity-90">Required</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">500 XP</p>
                  <p className="text-sm opacity-90">Reward</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exam Instructions */}
        {!examSubmitted && (
          <Card className="border-2 border-purple-200 shadow-lg bg-purple-50">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-3">📋 Instructions</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span>
                    You must score <strong>100%</strong> to complete the course
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span>You can retake the exam as many times as needed</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span>Review the lessons if you need a refresher</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span>Earn a certificate upon successful completion!</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Exam Questions */}
        <div className="space-y-6">
          {course.final_exam_questions.map((question, qIndex) => (
            <Card key={qIndex} className="border-2 border-gray-200 shadow-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b-2 border-purple-200">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 text-white font-bold text-xl shadow-lg">
                    {qIndex + 1}
                  </div>
                  <p className="font-bold text-xl text-gray-900 flex-1 pt-3">
                    {question.question}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-3">
                {question.options.map((option, oIndex) => {
                  const isSelected = examAnswers[qIndex] === oIndex;
                  const isCorrect = question.correct_answer === oIndex;
                  const showResult = examSubmitted;

                  return (
                    <button
                      key={oIndex}
                      onClick={() => !examSubmitted && setExamAnswers({ ...examAnswers, [qIndex]: oIndex })}
                      disabled={examSubmitted}
                      className={`w-full p-5 rounded-xl text-left transition-all font-medium text-base relative overflow-hidden group ${
                        showResult
                          ? isCorrect
                            ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white border-2 border-green-600 shadow-lg"
                            : isSelected
                            ? "bg-gradient-to-r from-red-400 to-pink-500 text-white border-2 border-red-600"
                            : "bg-gray-100 border-2 border-gray-300 text-gray-500"
                          : isSelected
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-2 border-purple-600 shadow-lg scale-105"
                          : "bg-white border-2 border-gray-300 hover:border-purple-400 hover:shadow-md hover:scale-102 text-gray-700"
                      }`}
                    >
                      <div className="flex items-center justify-between relative z-10">
                        <span>{option}</span>
                        {showResult && isCorrect && <CheckCircle className="w-6 h-6 flex-shrink-0 ml-2" />}
                        {showResult && isSelected && !isCorrect && <AlertCircle className="w-6 h-6 flex-shrink-0 ml-2" />}
                      </div>
                    </button>
                  );
                })}

                {examSubmitted && question.explanation && (
                  <div className="mt-4 p-5 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-500">
                    <p className="text-sm text-blue-900 flex items-start gap-2">
                      <Sparkles className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-600" />
                      <span>
                        <strong className="font-bold">Explanation:</strong> {question.explanation}
                      </span>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Submit/Results */}
        {!examSubmitted ? (
          <Card className="border-none shadow-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white sticky bottom-4">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-sm opacity-90">
                    {Object.keys(examAnswers).length} of {course.final_exam_questions.length} questions answered
                  </p>
                </div>
                <Button
                  onClick={handleExamSubmit}
                  disabled={Object.keys(examAnswers).length !== course.final_exam_questions.length}
                  className="bg-white text-purple-600 hover:bg-gray-100 h-14 px-10 text-lg shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trophy className="w-6 h-6 mr-2" />
                  Submit Final Exam
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card
            className={`border-none shadow-2xl ${
              score === 100
                ? "bg-gradient-to-r from-green-400 to-emerald-500"
                : "bg-gradient-to-r from-orange-400 to-red-500"
            } text-white`}
          >
            <CardContent className="p-8 md:p-12 text-center">
              {score === 100 ? (
                <>
                  <Trophy className="w-32 h-32 mx-auto mb-6 animate-bounce" />
                  <h2 className="text-5xl md:text-6xl font-bold mb-4">Perfect Score!</h2>
                  <p className="text-7xl font-bold mb-6">{score}%</p>
                  <p className="text-2xl opacity-90 mb-8">🎉 Congratulations! You've mastered this course!</p>
                  <div className="flex items-center justify-center gap-3 mb-10 text-3xl font-bold">
                    <Zap className="w-10 h-10" />
                    +500 XP Earned!
                  </div>
                  <Button
                    onClick={() => setShowCertificate(true)}
                    className="bg-white text-green-600 hover:bg-gray-100 h-16 px-12 text-xl shadow-2xl"
                  >
                    <Award className="w-6 h-6 mr-2" />
                    View Certificate
                  </Button>
                </>
              ) : (
                <>
                  <AlertCircle className="w-32 h-32 mx-auto mb-6" />
                  <h2 className="text-5xl font-bold mb-4">Keep Trying!</h2>
                  <p className="text-7xl font-bold mb-6">{score}%</p>
                  <p className="text-2xl opacity-90 mb-10">
                    You need 100% to complete the course. Review the lessons and try again!
                  </p>
                  <div className="flex gap-4 justify-center flex-wrap">
                    <Button
                      onClick={() => navigate(createPageUrl(`CourseDetail?id=${courseId}`))}
                      variant="outline"
                      className="h-14 px-8 text-base bg-white/20 border-2 border-white text-white hover:bg-white/30"
                    >
                      <BookOpen className="w-5 h-5 mr-2" />
                      Review Course
                    </Button>
                    <Button
                      onClick={handleRetakeExam}
                      className="h-14 px-8 text-base bg-white text-orange-600 hover:bg-gray-100"
                    >
                      <TrendingUp className="w-5 h-5 mr-2" />
                      Retake Exam
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
