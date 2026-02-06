import React, { useState, useEffect } from "react";
import { dataClient } from "@/api/dataClient";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Users, TrendingUp, BookOpen, Trophy, Search, Shield,
  Mail, Zap, School
} from "lucide-react";
import { format } from "date-fns";

export default function Admin() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await dataClient.auth.me();
        if (currentUser.role !== "admin") {
          navigate(createPageUrl("Dashboard"));
          return;
        }
        setUser(currentUser);
      } catch (error) {
        navigate(createPageUrl("Login"));
      }
    };
    checkAuth();
  }, [navigate]);

  const { data: allUsers = [] } = useQuery({
    queryKey: ["allUsers"],
    queryFn: () => dataClient.entities.User.list(),
    enabled: !!user && user.role === "admin",
  });

  const { data: schools = [] } = useQuery({
    queryKey: ["schools"],
    queryFn: () => dataClient.entities.School.list(),
    enabled: !!user,
  });

  const { data: allProgress = [] } = useQuery({
    queryKey: ["allProgress"],
    queryFn: () => dataClient.entities.UserProgress.list(),
    enabled: !!user && user.role === "admin",
  });

  const { data: allBadges = [] } = useQuery({
    queryKey: ["allBadges"],
    queryFn: () => dataClient.entities.UserBadge.list(),
    enabled: !!user && user.role === "admin",
  });

  if (!user || user.role !== "admin") return null;

  const filteredUsers = allUsers.filter((u) =>
    u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.school_id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalXP = allUsers.reduce((sum, u) => sum + (u.xp_points || 0), 0);
  const avgXP = allUsers.length > 0 ? Math.round(totalXP / allUsers.length) : 0;
  const totalLessons = allProgress.filter((p) => p.completed).length;
  const activeUsers = allUsers.filter((u) => (u.xp_points || 0) > 0).length;

  const getSchoolName = (schoolId) => {
    const school = schools.find((s) => s.id === schoolId);
    return school?.name || "No School";
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Manage users and monitor platform activity</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-none shadow-lg bg-gradient-to-br from-blue-400 to-cyan-500 text-white">
            <CardContent className="p-6">
              <Users className="w-8 h-8 mb-2" />
              <p className="text-3xl font-bold">{allUsers.length}</p>
              <p className="text-sm opacity-90">Total Users</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-gradient-to-br from-lime-400 to-green-500 text-white">
            <CardContent className="p-6">
              <TrendingUp className="w-8 h-8 mb-2" />
              <p className="text-3xl font-bold">{activeUsers}</p>
              <p className="text-sm opacity-90">Active Users</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-gradient-to-br from-purple-400 to-pink-500 text-white">
            <CardContent className="p-6">
              <BookOpen className="w-8 h-8 mb-2" />
              <p className="text-3xl font-bold">{totalLessons}</p>
              <p className="text-sm opacity-90">Lessons Completed</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-gradient-to-br from-orange-400 to-red-500 text-white">
            <CardContent className="p-6">
              <Zap className="w-8 h-8 mb-2" />
              <p className="text-3xl font-bold">{avgXP}</p>
              <p className="text-sm opacity-90">Avg XP per User</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search users by name, email, or school..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-base border-gray-200"
              />
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-500" />
              All Users ({filteredUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">User</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Email</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">School</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Grade</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Level</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">XP</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Lessons</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => {
                    const userProgress = allProgress.filter((p) => p.user_email === u.email && p.completed);
                    const userBadges = allBadges.filter((b) => b.user_email === u.email);

                    return (
                      <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-lime-400 to-green-500 rounded-full flex items-center justify-center text-white font-bold">
                              {u.full_name?.[0]?.toUpperCase() || "U"}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{u.full_name || "Unnamed"}</p>
                              {u.role === "admin" && (
                                <Badge className="bg-red-100 text-red-700 text-xs">Admin</Badge>
                              )}
                              {userBadges.length > 0 && (
                                <Badge variant="outline" className="ml-2 text-xs">
                                  {userBadges.length} badges
                                </Badge>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Mail className="w-4 h-4" />
                            <span className="text-sm">{u.email}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <School className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-700">{getSchoolName(u.school_id)}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          {u.grade ? (
                            <Badge variant="outline" className="text-xs">
                              {u.grade}
                            </Badge>
                          ) : (
                            <span className="text-gray-400 text-sm">-</span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-yellow-500" />
                            <span className="font-semibold text-gray-900">{u.level || 1}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-lime-500" />
                            <span className="font-semibold text-lime-600">{u.xp_points || 0}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-blue-500" />
                            <span className="font-semibold text-blue-600">{userProgress.length}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600">
                          {u.created_date ? format(new Date(u.created_date), "MMM d, yyyy") : "-"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No users found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Schools Overview */}
        <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <School className="w-6 h-6 text-purple-500" />
              Schools Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {schools.map((school) => {
                const schoolUsers = allUsers.filter((u) => u.school_id === school.id);
                const schoolXP = schoolUsers.reduce((sum, u) => sum + (u.xp_points || 0), 0);

                return (
                  <Card key={school.id} className="border border-gray-200">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">{school.name}</h3>
                          {school.location && <p className="text-sm text-gray-600">{school.location}</p>}
                        </div>
                        <Badge variant="outline">{school.type}</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Students</span>
                          <span className="font-semibold">{schoolUsers.length}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Total XP</span>
                          <span className="font-semibold text-lime-600">{schoolXP}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
