// src/pages/ResetPassword.jsx
// Handles the password reset flow after user clicks the link in their email.
// Supabase fires a PASSWORD_RECOVERY event which we listen for here.
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sprout, Lock, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    // Listen for the PASSWORD_RECOVERY event that Supabase fires
    // when the user lands on this page via the reset email link.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setSessionReady(true);
      }
    });

    // Also check if there's already a recovery session (e.g. page reload)
    supabase.auth.getSession().then(({ data }) => {
      if (data?.session) {
        setSessionReady(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) {
        setError(updateError.message || "Failed to update password. Please try again.");
        return;
      }
      setDone(true);
      setTimeout(() => navigate(createPageUrl("Login"), { replace: true }), 2500);
    } catch (err) {
      console.error("[ResetPassword] unexpected error:", err);
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
            {done ? (
              <>
                <div className="w-16 h-16 bg-[#f0f7f4] rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-[#2a7a4b]" />
                </div>
                <CardTitle className="text-2xl font-bold">Password Updated</CardTitle>
                <CardDescription className="text-base">
                  Your password has been reset. Redirecting to login…
                </CardDescription>
              </>
            ) : (
              <>
                <CardTitle className="text-2xl font-bold">Set New Password</CardTitle>
                <CardDescription className="text-base">
                  Enter your new password below
                </CardDescription>
              </>
            )}
          </CardHeader>

          {!done && (
            <CardContent>
              {!sessionReady ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-4 border-gray-200 border-t-[#2a7a4b] rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-sm text-gray-500">Verifying reset link…</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="flex items-start gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label className="text-gray-700">New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setError(""); }}
                        placeholder="At least 6 characters"
                        className="pl-10 pr-10 h-12 border-gray-200"
                        autoComplete="new-password"
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

                  <div className="space-y-2">
                    <Label className="text-gray-700">Confirm New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type={showConfirm ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
                        placeholder="Repeat your password"
                        className="pl-10 pr-10 h-12 border-gray-200"
                        autoComplete="new-password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        tabIndex={-1}
                      >
                        {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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
                        Updating…
                      </div>
                    ) : (
                      "Set New Password"
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
