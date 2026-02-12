import React, { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Sprout, Mail, Lock, User, ArrowRight } from "lucide-react";

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

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();

const genId = () => {
  try {
    return crypto?.randomUUID?.() || `id_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  } catch {
    return `id_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  }
};

const data = {
  async listUsers() {
    return getJSON("sprout_users", []);
  },
  async upsertUser(user) {
    const users = getJSON("sprout_users", []);
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx >= 0) users[idx] = { ...users[idx], ...user };
    else users.push(user);
    setJSON("sprout_users", users);
    return user;
  },
  async findUserByEmail(email) {
    const users = getJSON("sprout_users", []);
    const e = normalizeEmail(email);
    return users.find((u) => normalizeEmail(u.email) === e) || null;
  },
  async setCurrentUser(user) {
    setJSON("sprout_user", user);
  },
};

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const emailNormalized = useMemo(() => normalizeEmail(form.email), [form.email]);

  const validate = () => {
    const fullName = String(form.full_name || "").trim();
    const email = emailNormalized;
    const password = String(form.password || "");
    const confirm = String(form.confirm_password || "");

    if (!fullName) return "Please enter your name.";
    if (!email || !email.includes("@")) return "Please enter a valid email.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    if (password !== confirm) return "Passwords do not match.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }

    setIsSubmitting(true);
    try {
      const existing = await data.findUserByEmail(emailNormalized);
      if (existing) {
        toast.error("An account with that email already exists. Try logging in.");
        setIsSubmitting(false);
        return;
      }

      const newUser = {
        id: genId(),
        full_name: String(form.full_name || "").trim(),
        email: emailNormalized,

        // ⚠️ Demo-only local auth (not secure). Replace with real auth later.
        password: String(form.password || ""),

        // onboarding + stats defaults
        onboarding_completed: false,
        school_id: "",
        grade: "",
        xp_points: 0,
        level: 1,
        current_streak: 0,
        longest_streak: 0,
        total_lessons_completed: 0,
        total_courses_completed: 0,

        created_at: new Date().toISOString(),
      };

      await data.upsertUser(newUser);
      await data.setCurrentUser(newUser);

      toast.success("Account created! 🌱");
      navigate(createPageUrl("SchoolSelection"));
    } catch (error) {
      console.error(error);
      toast.error("Signup failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-lime-50 via-white to-green-50">
      <div className="w-full max-w-lg space-y-6">
        {/* Brand */}
        <div className="flex justify-center">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-gradient-to-br from-lime-400 to-green-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Sprout className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Sprout</h1>
              <p className="text-sm text-gray-500">Create your account</p>
            </div>
          </div>
        </div>

        <Card className="border-none shadow-2xl bg-white/90 backdrop-blur-xl">
          <CardHeader className="text-center pb-6 bg-gradient-to-r from-lime-50 to-green-50 border-b">
            <CardTitle className="text-2xl font-bold">Sign up</CardTitle>
            <p className="text-gray-600 mt-2">
              Start learning with progress tracking, XP, and simulations.
            </p>
          </CardHeader>

          <CardContent className="p-8">

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div className="space-y-2">
                <Label className="text-gray-700 font-semibold">Full name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    value={form.full_name}
                    onChange={(e) => setForm((p) => ({ ...p, full_name: e.target.value }))}
                    placeholder="e.g., Brooklyn Ruffler"
                    className="pl-10 h-12"
                    autoComplete="name"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label className="text-gray-700 font-semibold">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    placeholder="you@example.com"
                    className="pl-10 h-12"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label className="text-gray-700 font-semibold">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                    placeholder="At least 6 characters"
                    className="pl-10 h-12"
                    autoComplete="new-password"
                    required
                  />
                </div>
              </div>

              {/* Confirm */}
              <div className="space-y-2">
                <Label className="text-gray-700 font-semibold">Confirm password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="password"
                    value={form.confirm_password}
                    onChange={(e) => setForm((p) => ({ ...p, confirm_password: e.target.value }))}
                    placeholder="Re-enter your password"
                    className="pl-10 h-12"
                    autoComplete="new-password"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 text-base bg-gradient-to-r from-lime-400 to-green-500 hover:from-lime-500 hover:to-green-600 text-white shadow-lg shadow-lime-200"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>

              <p className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link to={createPageUrl("Login")} className="text-lime-700 font-semibold hover:underline">
                  Log in
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
