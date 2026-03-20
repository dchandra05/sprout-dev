// src/pages/Login.jsx
// Fixed: uses supabase.auth.signInWithPassword() instead of localStorage
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sprout, Mail, Lock, AlertCircle } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [email,        setEmail]        = useState("");
  const [password,     setPassword]     = useState("");
  const [error,        setError]        = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

      // Check onboarding status from profiles table
      const { data: profile } = await supabase
        .from("profiles")
        .select("onboarding_completed")
        .eq("id", data.session.user.id)
        .maybeSingle();

      if (profile?.onboarding_completed === false) {
        navigate(createPageUrl("SchoolSelection"), { replace: true });
      } else {
        navigate(createPageUrl("Dashboard"), { replace: true });
      }
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
                <Label className="text-gray-700">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    placeholder="Your password"
                    className="pl-10 h-12 border-gray-200"
                    autoComplete="current-password"
                    required
                  />
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