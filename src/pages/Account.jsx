// src/pages/Account.jsx
import React, { useState, useEffect } from "react";
import { getCurrentUser, updateCurrentUserProfile, logout, listSchools } from "@/lib/appClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Mail, Phone, School, GraduationCap, LogOut,
  Edit, Check, Shield, ExternalLink
} from "lucide-react";
import { toast } from "sonner";

export default function Account() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    school_id: "",
    grade: "",
    username: "",
    show_on_leaderboard: true,
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        // ✅ Use Supabase-backed getCurrentUser, not the old dataClient
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        setFormData({
          phone: currentUser.phone || "",
          school_id: currentUser.school_id || "",
          grade: currentUser.grade || "",
          username: currentUser.username || "",
          show_on_leaderboard: currentUser.show_on_leaderboard !== false,
        });
      } catch {
        // Not authenticated — send to login
        navigate(createPageUrl("Login"));
      }
    };
    loadUser();
  }, [navigate]);

  const { data: schools = [] } = useQuery({
    queryKey: ["schools"],
    queryFn: listSchools,
  });

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      await updateCurrentUserProfile(data);
    },
    onSuccess: async () => {
      // Refresh user object after update
      const refreshed = await getCurrentUser();
      setUser(refreshed);
      queryClient.invalidateQueries(["user"]);
      setEditing(false);
      toast.success("Profile updated successfully!");
    },
    onError: () => {
      toast.error("Failed to update profile");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // ignore signOut errors
    }
    navigate(createPageUrl("Login"));
  };

  if (!user) return null;

  const selectedSchool = schools.find((s) => s.id === user.school_id);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">My Account</h1>
            <p className="text-gray-600 mt-1">Manage your profile and settings</p>
          </div>
          {user.role === "admin" && (
            <Link to={createPageUrl("Admin")}>
              <Button className="bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white shadow-lg">
                <Shield className="w-5 h-5 mr-2" />
                Admin Dashboard
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          )}
        </div>

        {/* Profile Card */}
        <Card className="border-none shadow-xl bg-[#1c2f3c] text-white">
          <CardContent className="p-8">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white">
                <span className="text-4xl font-bold">
                  {user.full_name?.charAt(0)?.toUpperCase() ?? "?"}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold">{user.full_name || "Student"}</h2>
                <p className="opacity-90">{user.email}</p>
                <p className="opacity-75 text-sm mt-1">
                  Level {user.level} · {user.xp_points} XP · {user.current_streak} day streak
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Info / Edit Form */}
        <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Profile Information</CardTitle>
              {!editing ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" /> Edit
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {editing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        value={formData.phone}
                        onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                        placeholder="Your phone number"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Username</Label>
                    <Input
                      value={formData.username}
                      onChange={(e) => setFormData((p) => ({ ...p, username: e.target.value }))}
                      placeholder="Choose a username"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>School</Label>
                    <Select
                      value={formData.school_id}
                      onValueChange={(v) => setFormData((p) => ({ ...p, school_id: v }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your school" />
                      </SelectTrigger>
                      <SelectContent>
                        {schools.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Grade</Label>
                    <Select
                      value={formData.grade}
                      onValueChange={(v) => setFormData((p) => ({ ...p, grade: v }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {["9", "10", "11", "12", "College", "Adult"].map((g) => (
                          <SelectItem key={g} value={g}>
                            {isNaN(Number(g)) ? g : `Grade ${g}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="leaderboard"
                    checked={formData.show_on_leaderboard}
                    onChange={(e) => setFormData((p) => ({ ...p, show_on_leaderboard: e.target.checked }))}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="leaderboard">Show me on the leaderboard</Label>
                </div>

                <Button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="bg-[#1c2f3c] hover:bg-[#152330] text-white"
                >
                  <Check className="w-4 h-4 mr-2" />
                  {updateMutation.isPending ? "Saving…" : "Save Changes"}
                </Button>
              </form>
            ) : (
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-3 text-gray-700">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{user.phone || "Not set"}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <School className="w-4 h-4 text-gray-400" />
                  <span>{selectedSchool?.name || "No school selected"}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <GraduationCap className="w-4 h-4 text-gray-400" />
                  <span>{user.grade ? `Grade ${user.grade}` : "Not set"}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Logout */}
        <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <Button
              variant="outline"
              onClick={handleLogout}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}