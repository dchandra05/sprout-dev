import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sprout, Mail, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const normalized = email.trim().toLowerCase();
    if (!normalized || !normalized.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    try {
      const redirectTo = `${window.location.origin}/#/reset-password`;
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(normalized, {
        redirectTo,
      });

      if (resetError) {
        setError(resetError.message || "Failed to send reset email. Please try again.");
        return;
      }

      setSubmitted(true);
    } catch (err) {
      console.error("[ForgotPassword] unexpected error:", err);
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
            {!submitted ? (
              <>
                <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
                <CardDescription className="text-base">
                  Enter your email and we'll send you a reset link
                </CardDescription>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-[#f0f7f4] rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-[#2a7a4b]" />
                </div>
                <CardTitle className="text-2xl font-bold">Check Your Email</CardTitle>
                <CardDescription className="text-base">
                  We've sent password reset instructions to {email}
                </CardDescription>
              </>
            )}
          </CardHeader>

          <CardContent>
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="flex items-start gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(""); }}
                      className="pl-10 h-12 border-gray-200"
                      autoComplete="email"
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
                      Sending…
                    </div>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>

                <Link to={createPageUrl("Login")}>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-12 mt-2"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Login
                  </Button>
                </Link>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[#f0f4f7] border border-[#c8dce6]">
                  <p className="text-sm text-gray-700">
                    Didn't receive the email? Check your spam folder or try again in a few minutes.
                  </p>
                </div>

                <Link to={createPageUrl("Login")}>
                  <Button className="w-full h-12 bg-[#2a7a4b] hover:bg-[#1e5c37] text-white font-bold">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Login
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
