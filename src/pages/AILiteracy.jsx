import React, { useState, useEffect } from "react";
import { dataClient } from "@/api/dataClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Lock, CheckCircle, Brain, ChevronRight, Trophy, 
  Calendar, Clock, Zap, Target, BookOpen
} from "lucide-react";

export default function AILiteracy() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await dataClient.auth.me();
        setUser(currentUser);
      } catch (error) {
        navigate(createPageUrl("Login"));
      }
    };
    loadUser();
  }, [navigate]);

  const { data: course } = useQuery({
    queryKey: ['aiCourse'],
    queryFn: async () => {
      const courses = await dataClient.entities.Course.list();
      return courses.find(c => c.name === "AI Literacy: Using AI Responsibly and Effectively");
    }
  });

  const { data: dayProgress = [] } = useQuery({
    queryKey: ['aiDayProgress', user?.email],
    queryFn: () => dataClient.entities.AICourseDayProgress.filter({ user_email: user?.email }),
    enabled: !!user
  });

  const days = [
    { 
      number: 1, 
      title: "What is AI and Why AI Literacy Matters",
      icon: Brain,
      color: "from-purple-400 to-pink-500"
    },
    { 
      number: 2, 
      title: "How Machines Learn: Data, Training, and Models",
      icon: Target,
      color: "from-blue-400 to-cyan-500"
    },
    { 
      number: 3, 
      title: "AI in the Real World",
      icon: BookOpen,
      color: "from-green-400 to-emerald-500"
    },
    { 
      number: 4, 
      title: "Generative AI and Hallucinations",
      icon: Zap,
      color: "from-yellow-400 to-orange-500"
    },
    { 
      number: 5, 
      title: "Using AI Effectively",
      icon: Target,
      color: "from-indigo-400 to-purple-500"
    },
    { 
      number: 6, 
      title: "Ethics: Bias, Privacy, Deepfakes",
      icon: Brain,
      color: "from-red-400 to-pink-500"
    },
    { 
      number: 7, 
      title: "AI and Society",
      icon: BookOpen,
      color: "from-teal-400 to-cyan-500"
    },
    { 
      number: 8, 
      title: "Practical AI Skills Lab",
      icon: Zap,
      color: "from-lime-400 to-green-500"
    },
    { 
      number: 9, 
      title: "Capstone + Review",
      icon: Trophy,
      color: "from-orange-400 to-red-500"
    },
    { 
      number: 10, 
      title: "Final Exam + Certification",
      icon: Trophy,
      color: "from-purple-500 to-pink-600"
    }
  ];

  const getDayStatus = (dayNumber) => {
    const progress = dayProgress.find(p => p.day_number === dayNumber);
    if (progress?.completed) return 'completed';
    
    if (dayNumber === 1) return 'available';
    
    const previousDay = dayProgress.find(p => p.day_number === dayNumber - 1);
    if (previousDay?.completed) return 'available';
    
    return 'locked';
  };

  const completedDays = dayProgress.filter(p => p.completed).length;
  const progressPercent = (completedDays / 10) * 100;

  if (!user || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-block p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg">
            <Brain className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            AI Literacy Course
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A comprehensive 2-week program teaching you to understand, use, and critically evaluate AI
          </p>
        </div>

        {/* Progress Overview */}
        <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-500" />
                Your Progress
              </CardTitle>
              <span className="text-3xl font-bold text-purple-600">{Math.round(progressPercent)}%</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={progressPercent} className="h-3" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{completedDays}</div>
                <div className="text-sm text-gray-600">Days Completed</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{10 - completedDays}</div>
                <div className="text-sm text-gray-600">Days Remaining</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">10</div>
                <div className="text-sm text-gray-600">Hours Total</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">1000</div>
                <div className="text-sm text-gray-600">XP Available</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Course Days */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Course Days</h2>
          <div className="grid gap-4">
            {days.map((day) => {
              const status = getDayStatus(day.number);
              const Icon = day.icon;
              const isLocked = status === 'locked';
              const isCompleted = status === 'completed';

              return (
                <Card
                  key={day.number}
                  className={`border-none shadow-lg transition-all ${
                    isLocked 
                      ? 'opacity-60 cursor-not-allowed bg-gray-50' 
                      : 'cursor-pointer hover:shadow-2xl bg-white/80 backdrop-blur-sm'
                  }`}
                  onClick={() => !isLocked && navigate(createPageUrl(`AIDay${day.number}`))}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      {/* Day Number Circle */}
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br ${day.color} flex-shrink-0`}>
                        {isCompleted ? (
                          <CheckCircle className="w-8 h-8 text-white" />
                        ) : isLocked ? (
                          <Lock className="w-8 h-8 text-white" />
                        ) : (
                          <span className="text-2xl font-bold text-white">{day.number}</span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-bold text-gray-900">Day {day.number}</h3>
                          {isCompleted && (
                            <Badge className="bg-green-100 text-green-700">Completed</Badge>
                          )}
                          {isLocked && (
                            <Badge variant="outline" className="text-gray-500">Locked</Badge>
                          )}
                        </div>
                        <p className="text-gray-600">{day.title}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            60 min
                          </span>
                          <span className="flex items-center gap-1">
                            <Zap className="w-4 h-4 text-yellow-500" />
                            100 XP
                          </span>
                        </div>
                      </div>

                      {/* Arrow */}
                      {!isLocked && (
                        <ChevronRight className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Certificate Info */}
        {completedDays === 10 && (
          <Card className="border-none shadow-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <CardContent className="p-8 text-center">
              <Trophy className="w-16 h-16 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-2">Congratulations!</h2>
              <p className="text-lg opacity-90 mb-6">
                You've completed all 10 days. Take the final exam to earn your certificate!
              </p>
              <Button
                onClick={() => navigate(createPageUrl("AIDay10"))}
                className="bg-white text-purple-600 hover:bg-gray-100"
              >
                Take Final Exam
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
