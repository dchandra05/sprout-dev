import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Target, Flame, Zap, BookOpen, Trophy, CheckCircle,
  Calendar, Star, TrendingUp, Award
} from "lucide-react";
import ChallengeCompleteModal from "@/components/ChallengeCompleteModal";

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
  async listChallenges() {
    return [];
  },
  async listUserChallenges(/* userEmail */) {
    return [];
  },
  async listUserProgress(/* userEmail */) {
    return [];
  },
  async listDailyActivity(/* userEmail */) {
    return [];
  },
  async upsertUserChallenge(/* payload */) {
    return null;
  },
  async updateUserXP(/* payload */) {
    return;
  }
};

export default function Challenges() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [completedChallenge, setCompletedChallenge] = useState(null);

  useEffect(() => {
    const currentUser = getLocalUser();
    if (!currentUser) {
      navigate(createPageUrl("Login"));
      return;
    }
    setUser(currentUser);
  }, [navigate]);

  const { data: challenges = [] } = useQuery({
    queryKey: ["challenges"],
    queryFn: () => data.listChallenges(),
  });

  const { data: userChallenges = [] } = useQuery({
    queryKey: ["userChallenges", user?.email],
    queryFn: () => data.listUserChallenges(user?.email),
    enabled: !!user,
  });

  const { data: userProgress = [] } = useQuery({
    queryKey: ["userProgress", user?.email],
    queryFn: () => data.listUserProgress(user?.email),
    enabled: !!user,
  });

  const { data: dailyActivity = [] } = useQuery({
    queryKey: ["dailyActivity", user?.email],
    queryFn: () => data.listDailyActivity(user?.email),
    enabled: !!user,
  });

  const updateChallengeMutation = useMutation({
    mutationFn: async ({ challengeId, progress, completed }) => {
      if (!user?.email) return null;

      const today = new Date().toISOString().split("T")[0];

      // Previously Base44 upserted entity records.
      // Here we keep the same logical shape for later wiring.
      await data.upsertUserChallenge({
        user_email: user.email,
        challenge_id: challengeId,
        progress,
        completed,
        completed_date: completed ? new Date().toISOString() : null,
        date: today,
      });

      if (completed) {
        const challenge = challenges.find((c) => c.id === challengeId);
        if (challenge) {
          await data.updateUserXP({
            email: user.email,
            xp_delta: challenge.xp_reward,
          });
          return challenge;
        }
      }
      return null;
    },
    onSuccess: (challenge) => {
      queryClient.invalidateQueries({ queryKey: ["userChallenges"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      if (challenge) setCompletedChallenge(challenge);
    },
  });

  // This page is just for viewing challenges - actual checking happens via hook
  if (!user) return null;

  const today = new Date().toISOString().split("T")[0];
  const dailyChallenges = challenges.filter((c) => c.challenge_type === "daily");
  const weeklyChallenges = challenges.filter((c) => c.challenge_type === "weekly");
  const milestoneChallenges = challenges.filter((c) => c.challenge_type === "milestone");

  const getTodayProgress = (challengeId, challengeType) => {
    if (challengeType === "daily") {
      return userChallenges.find((uc) => uc.challenge_id === challengeId && uc.date === today);
    }
    return userChallenges.find((uc) => uc.challenge_id === challengeId);
  };

  const completedToday = dailyChallenges.filter(
    (c) => getTodayProgress(c.id, "daily")?.completed
  ).length;

  const totalDailyXP = dailyChallenges.reduce((sum, c) => {
    const uc = getTodayProgress(c.id, "daily");
    return sum + (uc?.completed ? c.xp_reward : 0);
  }, 0);

  const challengeIcons = {
    complete_lesson: BookOpen,
    earn_xp: Zap,
    complete_quiz: Star,
    login_streak: Flame,
    complete_course: Trophy,
  };

  const ChallengeCard = ({ challenge, userChallenge }) => {
    const Icon = challengeIcons[challenge.requirement] || Target;
    const progress = userChallenge?.progress || 0;
    const percentage = Math.min((progress / challenge.requirement_value) * 100, 100);
    const isCompleted = userChallenge?.completed;

    return (
      <Card
        className={`border-none shadow-lg transition-all ${
          isCompleted
            ? "bg-gradient-to-br from-green-50 to-lime-50 border-2 border-green-300"
            : "bg-white/80 backdrop-blur-sm hover:shadow-xl"
        }`}
      >
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-3">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  isCompleted
                    ? "bg-gradient-to-br from-green-400 to-lime-500"
                    : "bg-gradient-to-br from-lime-400 to-green-500"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle className="w-6 h-6 text-white" />
                ) : (
                  <Icon className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <CardTitle className="text-lg">{challenge.title}</CardTitle>
                <p className="text-sm text-gray-600 mt-1">{challenge.description}</p>
              </div>
            </div>
            <Badge
              className={
                isCompleted ? "bg-green-500 text-white" : "bg-lime-100 text-lime-700"
              }
            >
              +{challenge.xp_reward} XP
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                {progress} / {challenge.requirement_value}
              </span>
              <span className="font-semibold text-lime-600">{Math.round(percentage)}%</span>
            </div>
            <Progress value={percentage} className="h-2" />
            {isCompleted && (
              <p className="text-sm text-green-700 font-semibold flex items-center gap-2 mt-3">
                <CheckCircle className="w-4 h-4" />
                Challenge Completed! 🎉
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      {completedChallenge && (
        <ChallengeCompleteModal
          challenge={completedChallenge}
          onClose={() => setCompletedChallenge(null)}
        />
      )}
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Daily Challenges 🎯
            </h1>
            <p className="text-gray-600">
              Complete challenges to earn bonus XP and climb the leaderboard!
            </p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="border-none shadow-lg bg-gradient-to-br from-lime-400 to-green-500 text-white">
              <CardContent className="p-6">
                <Target className="w-8 h-8 mb-2" />
                <p className="text-3xl font-bold">{completedToday}</p>
                <p className="text-sm opacity-90">Completed Today</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-gradient-to-br from-yellow-400 to-orange-500 text-white">
              <CardContent className="p-6">
                <Zap className="w-8 h-8 mb-2" />
                <p className="text-3xl font-bold">{totalDailyXP}</p>
                <p className="text-sm opacity-90">XP Earned Today</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-gradient-to-br from-purple-400 to-pink-500 text-white">
              <CardContent className="p-6">
                <Flame className="w-8 h-8 mb-2" />
                <p className="text-3xl font-bold">{user.current_streak || 0}</p>
                <p className="text-sm opacity-90">Day Streak</p>
              </CardContent>
            </Card>
          </div>

          {/* Daily Challenges */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-lime-500" />
              Today's Challenges
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {dailyChallenges.map((challenge) => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  userChallenge={getTodayProgress(challenge.id, "daily")}
                />
              ))}
            </div>
          </div>

          {/* Weekly Challenges */}
          {weeklyChallenges.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-blue-500" />
                Weekly Challenges
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {weeklyChallenges.map((challenge) => {
                  const uc = getTodayProgress(challenge.id, "weekly");
                  return (
                    <ChallengeCard
                      key={challenge.id}
                      challenge={challenge}
                      userChallenge={uc}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Milestone Challenges */}
          {milestoneChallenges.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-6 h-6 text-orange-500" />
                Milestone Challenges
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {milestoneChallenges.map((challenge) => {
                  const uc = getTodayProgress(challenge.id, "milestone");
                  return (
                    <ChallengeCard
                      key={challenge.id}
                      challenge={challenge}
                      userChallenge={uc}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Info Card */}
          <Card className="border-none shadow-lg bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-500">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-2">💡 Pro Tip</h3>
              <p className="text-sm text-gray-700">
                Challenges reset daily at midnight. Complete them before the day ends to maximize your XP earnings and stay ahead on the leaderboard!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
