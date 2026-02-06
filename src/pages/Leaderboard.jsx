import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal, TrendingUp, Flame, Zap, Crown } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// ----- Local user + local leaderboard store (migration placeholder) -----
const getLocalUser = () => {
  try {
    const raw = localStorage.getItem("sprout_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

// Optional: you can seed this key with an array of users
// localStorage.setItem("sprout_leaderboard_users", JSON.stringify([...]))
const getAllUsersLocal = () => {
  try {
    const raw = localStorage.getItem("sprout_leaderboard_users");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const normalizeUsers = (users = []) => {
  return users
    .map((u) => ({
      id: u.id || u.email || u.username || String(Math.random()),
      email: u.email,
      username: u.username,
      full_name: u.full_name || u.name,
      xp_points: u.xp_points ?? 0,
      current_streak: u.current_streak ?? 0,
      level: u.level ?? 1,
      school_id: u.school_id ?? null,
      grade: u.grade ?? null,
      show_on_leaderboard: u.show_on_leaderboard !== false,
    }))
    .filter((u) => u.show_on_leaderboard !== false);
};

export default function Leaderboard() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("school");

  React.useEffect(() => {
    const currentUser = getLocalUser();
    if (currentUser) setUser(currentUser);
  }, []);

  const { data: allUsers = [] } = useQuery({
    queryKey: ["leaderboard_local_all"],
    queryFn: async () => {
      const currentUser = getLocalUser();
      const stored = normalizeUsers(getAllUsersLocal());

      // If nothing stored yet, at least show the current user (if available)
      const combined = currentUser
        ? normalizeUsers([currentUser, ...stored])
        : stored;

      // De-dupe by email/id
      const seen = new Set();
      const deduped = combined.filter((u) => {
        const key = u.email || u.id;
        if (!key) return true;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      return deduped.sort((a, b) => (b.xp_points || 0) - (a.xp_points || 0));
    },
  });

  const { data: schoolUsers = [] } = useQuery({
    queryKey: ["leaderboard_local_school", user?.school_id],
    queryFn: async () => {
      if (!user?.school_id) return [];
      return allUsers
        .filter((u) => u.school_id === user.school_id)
        .sort((a, b) => (b.xp_points || 0) - (a.xp_points || 0));
    },
    enabled: !!user?.school_id && allUsers.length > 0,
  });

  const { data: gradeUsers = [] } = useQuery({
    queryKey: ["leaderboard_local_grade", user?.grade, user?.school_id],
    queryFn: async () => {
      if (!user?.grade || !user?.school_id) return [];
      return allUsers
        .filter((u) => u.school_id === user.school_id && u.grade === user.grade)
        .sort((a, b) => (b.xp_points || 0) - (a.xp_points || 0));
    },
    enabled: !!user?.grade && !!user?.school_id && allUsers.length > 0,
  });

  const getDisplayUsers = () => {
    switch (activeTab) {
      case "school":
        return user?.school_id ? schoolUsers : allUsers;
      case "grade":
        return (user?.grade && user?.school_id) ? gradeUsers : allUsers;
      case "global":
        return allUsers;
      default:
        return allUsers;
    }
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-orange-600" />;
    return null;
  };

  const getRankBadge = (rank) => {
    if (rank === 1) return "bg-gradient-to-r from-yellow-400 to-orange-500";
    if (rank === 2) return "bg-gradient-to-r from-gray-300 to-gray-400";
    if (rank === 3) return "bg-gradient-to-r from-orange-400 to-orange-600";
    return "bg-gray-100";
  };

  const displayUsers = getDisplayUsers();
  const myRank = user?.email
    ? displayUsers.findIndex((u) => u.email === user.email) + 1
    : -1;

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <Trophy className="w-9 h-9 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Leaderboard 🏆
          </h1>
          <p className="text-gray-600">Compete with fellow learners</p>
        </div>

        {/* My Rank Card */}
        {user && myRank > 0 && (
          <Card className="border-none shadow-lg bg-gradient-to-r from-lime-400 to-green-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl font-bold">
                    #{myRank}
                  </div>
                  <div>
                    <p className="text-sm opacity-90">Your Rank</p>
                    <p className="text-2xl font-bold">{user.full_name}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1">
                        <Zap className="w-4 h-4" />
                        <span className="text-sm">{user.xp_points || 0} XP</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Flame className="w-4 h-4" />
                        <span className="text-sm">{user.current_streak || 0} day streak</span>
                      </div>
                    </div>
                  </div>
                </div>
                <TrendingUp className="w-12 h-12 opacity-20" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="school">My School</TabsTrigger>
            <TabsTrigger value="grade">My Grade</TabsTrigger>
            <TabsTrigger value="global">Global</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {/* Top 3 Podium */}
            {displayUsers.length >= 3 && displayUsers[0] && displayUsers[1] && displayUsers[2] && (
              <div className="grid grid-cols-3 gap-4 mb-8">
                {/* 2nd Place */}
                <div className="flex flex-col items-center pt-12">
                  <div className={`w-20 h-20 ${getRankBadge(2)} rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg mb-3`}>
                    {((displayUsers[1]?.username || displayUsers[1]?.full_name || "?")[0]).toUpperCase()}
                  </div>
                  <Medal className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="font-semibold text-center text-sm">{displayUsers[1]?.username || displayUsers[1]?.full_name || "Anonymous"}</p>
                  <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                    <Zap className="w-3 h-3 text-lime-500" />
                    {displayUsers[1]?.xp_points || 0} XP
                  </p>
                </div>

                {/* 1st Place */}
                <div className="flex flex-col items-center">
                  <div className={`w-24 h-24 ${getRankBadge(1)} rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-xl mb-3`}>
                    {((displayUsers[0]?.username || displayUsers[0]?.full_name || "?")[0]).toUpperCase()}
                  </div>
                  <Crown className="w-10 h-10 text-yellow-500 mb-2" />
                  <p className="font-bold text-center">{displayUsers[0]?.username || displayUsers[0]?.full_name || "Anonymous"}</p>
                  <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                    <Zap className="w-4 h-4 text-lime-500" />
                    {displayUsers[0]?.xp_points || 0} XP
                  </p>
                </div>

                {/* 3rd Place */}
                <div className="flex flex-col items-center pt-16">
                  <div className={`w-20 h-20 ${getRankBadge(3)} rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg mb-3`}>
                    {((displayUsers[2]?.username || displayUsers[2]?.full_name || "?")[0]).toUpperCase()}
                  </div>
                  <Medal className="w-8 h-8 text-orange-600 mb-2" />
                  <p className="font-semibold text-center text-sm">{displayUsers[2]?.username || displayUsers[2]?.full_name || "Anonymous"}</p>
                  <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                    <Zap className="w-3 h-3 text-lime-500" />
                    {displayUsers[2]?.xp_points || 0} XP
                  </p>
                </div>
              </div>
            )}

            {/* Rest of Rankings */}
            <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Rankings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {displayUsers.slice(3).map((u, idx) => {
                  const rank = idx + 4;
                  const isCurrentUser = u.email && user?.email && u.email === user.email;

                  return (
                    <div
                      key={u.id}
                      className={`flex items-center justify-between p-4 rounded-xl transition-all ${
                        isCurrentUser
                          ? "bg-gradient-to-r from-lime-50 to-green-50 border-2 border-lime-400"
                          : "bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 flex items-center justify-center rounded-full font-bold ${
                            isCurrentUser ? "bg-lime-500 text-white" : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {rank}
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {((u.username || u.full_name || "?")[0]).toUpperCase()}
                        </div>
                        <div>
                          <p className={`font-semibold ${isCurrentUser ? "text-lime-700" : "text-gray-900"}`}>
                            {u.username || u.full_name || "Anonymous"}
                            {isCurrentUser && <span className="ml-2 text-xs">(You)</span>}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Flame className="w-3 h-3 text-orange-500" />
                              {u.current_streak || 0}
                            </span>
                            <span>•</span>
                            <span>Level {u.level || 1}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-lime-600">{u.xp_points || 0}</p>
                        <p className="text-xs text-gray-500">XP</p>
                      </div>
                    </div>
                  );
                })}

                {displayUsers.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No data available yet. Start learning to appear on the leaderboard!
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
