// src/pages/Signup.jsx
// Fixed: uses supabase.auth.signUp() instead of localStorage
import React, { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Sprout, Mail, Lock, User, ArrowRight } from "lucide-react";

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();

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
    const password = String(form.password || "");
    const confirm  = String(form.confirm_password || "");

    if (!fullName) return "Please enter your name.";
    if (!emailNormalized || !emailNormalized.includes("@")) return "Please enter a valid email.";
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
      // ── Step 1: Create Supabase Auth user ──────────────────────────────────
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email:    emailNormalized,
        password: form.password,
        options: {
          data: {
            full_name: String(form.full_name || "").trim(),
          },
        },
      });

      if (signUpError) {
        // Surface recognisable error messages clearly
        const msg = signUpError.message ?? "";
        if (msg.toLowerCase().includes("already registered") || msg.toLowerCase().includes("already exists")) {
          toast.error("An account with that email already exists. Try logging in.");
        } else {
          toast.error(msg || "Signup failed. Please try again.");
        }
        return;
      }

      const user = authData?.user;
      if (!user) {
        // Supabase project has email confirmation enabled:
        // the user is created but the session is null until the email is confirmed.
        toast.success("Account created! Check your email to confirm before logging in. 📧");
        navigate(createPageUrl("Login"));
        return;
      }

      // ── Step 2: Upsert profile row ──────────────────────────────────────────
      // The DB trigger (handle_new_user) should do this automatically,
      // but we upsert here as a safety net in case the trigger hasn't run yet.
      const { error: profileError } = await supabase.from("profiles").upsert(
        {
          id:           user.id,
          email:        emailNormalized,
          full_name:    String(form.full_name || "").trim(),
          role:         "user",
          xp_points:    0,
          level:        1,
          created_at:   new Date().toISOString(),
          last_seen_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );

      if (profileError) {
        // Not fatal — the trigger may have already created the row
        console.warn("[Signup] profile upsert warning:", profileError.message);
      }

      toast.success("Account created! 🌱");
      // If a session was returned, navigate to onboarding; otherwise ask to log in
      if (authData?.session) {
        navigate(createPageUrl("SchoolSelection"));
      } else {
        toast("Please check your email to confirm your account before logging in.");
        navigate(createPageUrl("Login"));
      }
    } catch (error) {
      console.error("[Signup] unexpected error:", error);
      toast.error("Signup failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#f8f9fa]">
      <div className="w-full max-w-lg space-y-6">
        {/* Brand */}
        <div className="flex justify-center">
          <div className="flex items-center gap-3">
            <span style={{ fontSize: 30, fontWeight: 900, color: "#1c2f3c", letterSpacing: "-0.4px", lineHeight: 1 }}>Sprout</span>
            <Sprout className="w-8 h-8" style={{ color: "#1c2f3c" }} strokeWidth={2} />
          </div>
        </div>

        <Card className="border-none shadow-2xl bg-white/90 backdrop-blur-xl">
          <CardHeader className="text-center pb-6 bg-[#f0f4f7] border-b">
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
                    placeholder="e.g., John Smith"
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
                    type="email"
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

              {/* Confirm password */}
              <div className="space-y-2">
                <Label className="text-gray-700 font-semibold">Confirm password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="password"
                    value={form.confirm_password}
                    onChange={(e) => setForm((p) => ({ ...p, confirm_password: e.target.value }))}
                    placeholder="Repeat your password"
                    className="pl-10 h-12"
                    autoComplete="new-password"
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
                    Creating account…
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Create Account
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </Button>

              <p className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link to={createPageUrl("Login")} className="text-[#1c2f3c] font-semibold hover:underline">
                  Sign in
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}