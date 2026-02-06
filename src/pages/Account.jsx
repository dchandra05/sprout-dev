import React, { useState, useEffect } from "react";
import { dataClient } from "@/api/dataClient";
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
        const currentUser = await dataClient.auth.me();
        setUser(currentUser);
        setFormData({
          phone: currentUser.phone || "",
          school_id: currentUser.school_id || "",
          grade: currentUser.grade || "",
          username: currentUser.username || "",
          show_on_leaderboard: currentUser.show_on_leaderboard !== false,
        });
      } catch (error) {
        navigate(createPageUrl("Login"));
      }
    };
    loadUser();
  }, [navigate]);

  const { data: schools = [] } = useQuery({
    queryKey: ["schools"],
    queryFn: () => dataClient.entities.School.list(),
  });

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      await dataClient.auth.updateMe(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);
      setEditing(false);
      toast.success("Profile updated successfully!");
      window.location.reload();
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
    await dataClient.auth.logout();
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
        <Card className="border-none shadow-xl bg-gradient-to-br from-lime-400 to-green-500 text-white">
          <CardContent className="p-8">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white">
                <span className="text-4xl font-bold">{user.full_name?.[0]?.toUpperCase() || "U"}</span>
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-2">{user.full_name}</h2>
                <p className="text-lg opacity-90">{user.email}</p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    <span className="font-semibold">Level {user.level || 1}</span>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    <span className="font-semibold">{user.xp_points || 0} XP</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details */}
        <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Profile Information</CardTitle>
            {!editing && (
              <Button onClick={() => setEditing(true)} variant="outline" className="gap-2">
                <Edit className="w-4 h-4" />
                Edit Profile
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {!editing ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50">
                  <Mail className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50">
                  <Phone className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-semibold">{user.phone || "Not provided"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50">
                  <School className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">School</p>
                    <p className="font-semibold">{selectedSchool?.name || "Not selected"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50">
                  <GraduationCap className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Grade</p>
                    <p className="font-semibold">{user.grade || "Not provided"}</p>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(123) 456-7890"
                  />
                </div>

                <div className="space-y-2">
                  <Label>School</Label>
                  <Select
                    value={formData.school_id}
                    onValueChange={(value) => setFormData({ ...formData, school_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your school" />
                    </SelectTrigger>
                    <SelectContent>
                      {schools.map((school) => (
                        <SelectItem key={school.id} value={school.id}>
                          {school.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Grade</Label>
                  <Select
                    value={formData.grade}
                    onValueChange={(value) => setFormData({ ...formData, grade: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6th Grade">6th Grade</SelectItem>
                      <SelectItem value="7th Grade">7th Grade</SelectItem>
                      <SelectItem value="8th Grade">8th Grade</SelectItem>
                      <SelectItem value="9th Grade (Freshman)">9th Grade (Freshman)</SelectItem>
                      <SelectItem value="10th Grade (Sophomore)">10th Grade (Sophomore)</SelectItem>
                      <SelectItem value="11th Grade (Junior)">11th Grade (Junior)</SelectItem>
                      <SelectItem value="12th Grade (Senior)">12th Grade (Senior)</SelectItem>
                      <SelectItem value="Freshman">College Freshman</SelectItem>
                      <SelectItem value="Sophomore">College Sophomore</SelectItem>
                      <SelectItem value="Junior">College Junior</SelectItem>
                      <SelectItem value="Senior">College Senior</SelectItem>
                      <SelectItem value="Graduate Student">Graduate Student</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Username */}
                <div className="space-y-2">
                  <Label htmlFor="username">Username (Display Name)</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="How you appear on leaderboards"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  />
                  <p className="text-sm text-gray-500">
                    This name will be visible to other users on the leaderboard
                  </p>
                </div>

                {/* Privacy Setting */}
                <div className="space-y-3 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200">
                  <Label className="text-base font-semibold flex items-center gap-2">
                    <span>🔒 Privacy Settings</span>
                  </Label>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="show_on_leaderboard"
                      checked={formData.show_on_leaderboard}
                      onChange={(e) => setFormData({ ...formData, show_on_leaderboard: e.target.checked })}
                      className="w-5 h-5 rounded border-gray-300 text-lime-600 focus:ring-lime-500"
                    />
                    <label htmlFor="show_on_leaderboard" className="text-sm text-gray-700 cursor-pointer">
                      Show my profile on the leaderboard
                    </label>
                  </div>
                  <p className="text-xs text-gray-600">
                    {formData.show_on_leaderboard
                      ? "Your username and stats will be visible to others"
                      : "You will be hidden from leaderboards but can still track your own progress"}
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button type="submit" className="bg-lime-500 hover:bg-lime-600 flex-1">
                    <Check className="w-5 h-5 mr-2" />
                    Save Changes
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditing(false);
                      setFormData({
                        phone: user.phone || "",
                        school_id: user.school_id || "",
                        grade: user.grade || "",
                        username: user.username || "",
                        show_on_leaderboard: user.show_on_leaderboard !== false,
                      });
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>My Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200">
                <p className="text-sm text-gray-600 mb-1">Lessons Completed</p>
                <p className="text-3xl font-bold text-blue-600">{user.total_lessons_completed || 0}</p>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200">
                <p className="text-sm text-gray-600 mb-1">Current Streak</p>
                <p className="text-3xl font-bold text-purple-600">{user.current_streak || 0} days</p>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200">
                <p className="text-sm text-gray-600 mb-1">Longest Streak</p>
                <p className="text-3xl font-bold text-orange-600">{user.longest_streak || 0} days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logout */}
        <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full h-12 border-red-200 text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Log Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
