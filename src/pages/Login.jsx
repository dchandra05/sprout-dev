// src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sprout, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [email,        setEmail]        = useState("");
  const [password,     setPassword]     = useState("");
  const [error,        setError]        = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // If already logged in, skip straight to dashboard
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data?.session) {
        navigate(createPageUrl("Dashboard"), { replace: true });
      }
    });
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setError("");

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !normalizedEmail.includes("@")) {
      setError("Please enter a valid email.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email:    normalizedEmail,
        password: password,
      });

      if (signInError) {
        const msg = signInError.message ?? "";
        if (
          msg.toLowerCase().includes("invalid login") ||
          msg.toLowerCase().includes("invalid credentials") ||
          msg.toLowerCase().includes("email not confirmed")
        ) {
          setError(
            "Incorrect email or password. If you just signed up, please confirm your email first."
          );
        } else {
          setError(msg || "Sign in failed. Please try again.");
        }
        return;
      }

      if (!data?.session) {
        setError("Login failed — no session returned. Please try again.");
        return;
      }

      // Fetch the full profile so we can write it to localStorage.
      // This ensures all pages that use getLocalUser() immediately see
      // the correct user — not stale data from a previous session.
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.session.user.id)
        .maybeSingle();

      const authUser = data.session.user;
      const merged = {
        id:                      authUser.id,
        email:                   authUser.email,
        full_name:               profile?.full_name
                                   ?? authUser.user_metadata?.full_name
                                   ?? authUser.user_metadata?.name
                                   ?? "",
        phone:                   profile?.phone                    ?? "",
        school_id:               profile?.school_id                ?? "",
        school_name:             profile?.school_name              ?? "",
        grade:                   profile?.grade                    ?? "",
        username:                profile?.username                 ?? "",
        show_on_leaderboard:     profile?.show_on_leaderboard      ?? true,
        role:                    profile?.role                     ?? "user",
        level:                   profile?.level                    ?? 1,
        xp_points:               profile?.xp_points                ?? 0,
        total_lessons_completed: profile?.total_lessons_completed  ?? 0,
        current_streak:          profile?.current_streak           ?? 0,
        longest_streak:          profile?.longest_streak           ?? 0,
        onboarding_completed:    profile?.onboarding_completed     ?? false,
      };
      localStorage.setItem("sprout_user", JSON.stringify(merged));

      navigate(createPageUrl("Dashboard"), { replace: true });
    } catch (err) {
      console.error("[Login] unexpected error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#f8f9fa]">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <span style={{ fontSize: 30, fontWeight: 900, color: "#1c2f3c", letterSpacing: "-0.4px", lineHeight: 1 }}>Sprout</span>
            <Sprout className="w-8 h-8" style={{ color: "#1c2f3c" }} strokeWidth={2} />
          </div>
        </div>

        <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-xl">
          <CardHeader className="space-y-1 text-center pb-6">
            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <CardDescription className="text-base">
              Sign in to continue learning
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-start gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-gray-700">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    placeholder="you@example.com"
                    className="pl-10 h-12 border-gray-200"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-gray-700">Password</Label>
                  <Link
                    to={createPageUrl("ForgotPassword")}
                    className="text-sm text-[#2a7a4b] hover:underline font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    placeholder="Your password"
                    className="pl-10 pr-10 h-12 border-gray-200"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-[#2a7a4b] hover:bg-[#1e5c37] text-white font-bold text-base shadow-lg"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in…
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>

              <p className="text-center text-sm text-gray-600 pt-2">
                Don't have an account?{" "}
                <Link
                  to={createPageUrl("Signup")}
                  className="text-[#1c2f3c] font-semibold hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}