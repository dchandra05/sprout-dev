// src/pages/Landing.jsx
// Sprout landing page — dark forest green + crisp white
// First thing users see when they open the app (unauthenticated)
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { supabase } from "@/lib/supabaseClient";
import {
  Sprout, ArrowRight, BookOpen, TrendingUp, Shield, Users,
  Zap, CheckCircle, ChevronDown, Star, Award, Target
} from "lucide-react";

// ─── Data ────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: BookOpen,
    title: "Interactive Lessons",
    desc: "Bite-sized lessons built like a game. Learn budgeting, investing, credit, and more in under 10 minutes a day.",
  },
  {
    icon: TrendingUp,
    title: "Real Simulations",
    desc: "Practice reading a paycheck, building a budget, or managing a credit card — with real numbers and real stakes.",
  },
  {
    icon: Zap,
    title: "XP & Streaks",
    desc: "Earn XP, level up, and keep your streak alive. Financial literacy has never felt this rewarding.",
  },
  {
    icon: Shield,
    title: "Trusted Content",
    desc: "Every lesson is grounded in real financial principles. No ads. No sponsored content. Just clear education.",
  },
];

const COURSES = [
  {
    emoji: "💵",
    title: "Budgeting Basics",
    lessons: 6,
    level: "Beginner",
    color: "#22c55e",
  },
  {
    emoji: "📈",
    title: "Investing 101",
    lessons: 8,
    level: "Intermediate",
    color: "#16a34a",
  },
  {
    emoji: "💳",
    title: "Credit & Debt",
    lessons: 7,
    level: "Beginner",
    color: "#15803d",
  },
  {
    emoji: "🧾",
    title: "Understanding Paychecks",
    lessons: 5,
    level: "Beginner",
    color: "#166534",
  },
  {
    emoji: "🏠",
    title: "Saving for Goals",
    lessons: 6,
    level: "Intermediate",
    color: "#14532d",
  },
  {
    emoji: "🤖",
    title: "AI Literacy",
    lessons: 10,
    level: "All levels",
    color: "#1a7a3c",
  },
];

const STATS = [
  { value: "10+", label: "Courses" },
  { value: "100+", label: "Lessons" },
  { value: "Free", label: "Always" },
  { value: "5 min", label: "Per lesson" },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Create your account",
    desc: "Sign up in 30 seconds. No credit card. No spam.",
  },
  {
    step: "02",
    title: "Pick a course",
    desc: "Start with budgeting basics or jump to investing — your call.",
  },
  {
    step: "03",
    title: "Learn by doing",
    desc: "Answer questions, run simulations, and earn XP as you go.",
  },
  {
    step: "04",
    title: "Level up for real",
    desc: "Apply what you learn. Track your progress. Build real skills.",
  },
];

// ─── Subcomponents ────────────────────────────────────────────

function Nav({ scrolled }) {
  const navigate = useNavigate();
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0f2d1a]/95 backdrop-blur-xl border-b border-green-900/40 shadow-xl shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center">
            <Sprout className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">Sprout</span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-green-200">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#courses" className="hover:text-white transition-colors">Courses</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(createPageUrl("Login"))}
            className="text-sm font-medium text-green-200 hover:text-white transition-colors px-3 py-1.5"
          >
            Sign in
          </button>
          <button
            onClick={() => navigate(createPageUrl("Signup"))}
            className="text-sm font-bold bg-green-400 hover:bg-green-300 text-green-950 px-4 py-2 rounded-full transition-all duration-200 shadow-lg shadow-green-400/20"
          >
            Get started free
          </button>
        </div>
      </div>
    </header>
  );
}

function Hero({ navigate }) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-[#0a1f10]" />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `radial-gradient(ellipse 80% 50% at 50% -10%, #16a34a, transparent)`,
        }}
      />
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(#22c55e 1px, transparent 1px), linear-gradient(90deg, #22c55e 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/6 w-64 h-64 rounded-full bg-green-500/10 blur-3xl animate-pulse" style={{ animationDuration: "4s" }} />
      <div className="absolute bottom-1/4 right-1/6 w-48 h-48 rounded-full bg-emerald-400/10 blur-3xl animate-pulse" style={{ animationDuration: "6s" }} />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-green-900/60 border border-green-700/50 rounded-full px-4 py-1.5 mb-8 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-sm text-green-300 font-medium">Free for all students</span>
        </div>

        {/* Headline */}
        <h1
          className="text-5xl sm:text-6xl md:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Master your money.{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-400">
            One lesson at a time.
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-green-200/80 max-w-2xl mx-auto mb-10 leading-relaxed">
          Sprout teaches real-world personal finance through interactive lessons,
          hands-on simulations, and a system that makes learning addictive.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            onClick={() => navigate(createPageUrl("Signup"))}
            className="group flex items-center gap-2 bg-green-400 hover:bg-green-300 text-green-950 font-bold text-base px-8 py-4 rounded-full transition-all duration-200 shadow-2xl shadow-green-400/30 w-full sm:w-auto justify-center"
          >
            Start learning free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => navigate(createPageUrl("Login"))}
            className="flex items-center gap-2 border border-green-700/60 hover:border-green-500/60 text-green-200 hover:text-white font-semibold text-base px-8 py-4 rounded-full transition-all duration-200 backdrop-blur-sm w-full sm:w-auto justify-center"
          >
            I have an account
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-6 max-w-xl mx-auto">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-black text-white">{s.value}</p>
              <p className="text-xs text-green-400/70 font-medium mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-green-600 animate-bounce">
        <ChevronDown className="w-5 h-5" />
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="py-24 px-6 bg-[#0d2515]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-green-400 font-semibold text-sm uppercase tracking-widest mb-3">Why Sprout</p>
          <h2
            className="text-4xl md:text-5xl font-black text-white leading-tight"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Financial education{" "}
            <span className="text-green-400">that actually works</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="group bg-[#0f2d1a] hover:bg-[#122f1d] border border-green-900/50 hover:border-green-700/50 rounded-2xl p-8 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center justify-center mb-5 group-hover:bg-green-500/15 transition-colors">
                  <Icon className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{f.title}</h3>
                <p className="text-green-200/60 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Courses({ navigate }) {
  return (
    <section id="courses" className="py-24 px-6 bg-[#0a1f10]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-green-400 font-semibold text-sm uppercase tracking-widest mb-3">What you'll learn</p>
          <h2
            className="text-4xl md:text-5xl font-black text-white"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Real courses. Real skills.
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {COURSES.map((c) => (
            <div
              key={c.title}
              className="group bg-[#0f2d1a] border border-green-900/40 hover:border-green-600/40 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-green-900/30"
              onClick={() => navigate(createPageUrl("Signup"))}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-5 border border-white/5"
                style={{ backgroundColor: `${c.color}25` }}
              >
                {c.emoji}
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{c.title}</h3>
              <div className="flex items-center gap-3 text-sm text-green-200/50">
                <span>{c.lessons} lessons</span>
                <span>·</span>
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-medium border"
                  style={{ borderColor: `${c.color}50`, color: c.color, backgroundColor: `${c.color}15` }}
                >
                  {c.level}
                </span>
              </div>
              <div className="mt-4 pt-4 border-t border-green-900/40 flex items-center gap-1.5 text-green-400 text-sm font-medium group-hover:gap-2.5 transition-all">
                <span>Start course</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6 bg-[#0d2515]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-green-400 font-semibold text-sm uppercase tracking-widest mb-3">Getting started</p>
          <h2
            className="text-4xl md:text-5xl font-black text-white"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            How it works
          </h2>
        </div>

        <div className="space-y-6">
          {HOW_IT_WORKS.map((step, i) => (
            <div
              key={step.step}
              className="flex gap-6 items-start bg-[#0f2d1a] border border-green-900/40 rounded-2xl p-6"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex-shrink-0 w-12 h-12 bg-green-400/10 border border-green-400/20 rounded-xl flex items-center justify-center">
                <span
                  className="text-sm font-black text-green-400"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  {step.step}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">{step.title}</h3>
                <p className="text-green-200/60">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SocialProof() {
  const quotes = [
    {
      text: "I finally understand how my paycheck works. I learned more in one afternoon on Sprout than a full semester of econ.",
      name: "Marcus T.",
      role: "High school senior",
    },
    {
      text: "The budget simulator actually felt like a game. I didn't realize I was learning until I was already three lessons in.",
      name: "Priya K.",
      role: "College freshman",
    },
    {
      text: "Finally an app that teaches money stuff without making it boring. I've been recommending it to everyone.",
      name: "Jordan L.",
      role: "Community college student",
    },
  ];

  return (
    <section className="py-24 px-6 bg-[#0a1f10]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            ))}
          </div>
          <h2
            className="text-3xl md:text-4xl font-black text-white"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Students love Sprout
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {quotes.map((q) => (
            <div
              key={q.name}
              className="bg-[#0f2d1a] border border-green-900/40 rounded-2xl p-6"
            >
              <p className="text-green-100/80 leading-relaxed mb-5">"{q.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-green-800 rounded-full flex items-center justify-center text-green-300 font-bold text-sm">
                  {q.name[0]}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{q.name}</p>
                  <p className="text-green-400/60 text-xs">{q.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA({ navigate }) {
  return (
    <section className="py-24 px-6 bg-[#0d2515] relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage: `radial-gradient(ellipse 70% 60% at 50% 100%, #16a34a, transparent)`,
        }}
      />
      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Award className="w-8 h-8 text-green-400" />
        </div>
        <h2
          className="text-4xl md:text-5xl font-black text-white mb-5"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Your financial future starts today.
        </h2>
        <p className="text-green-200/70 text-lg mb-8">
          Join thousands of students already building smarter money habits. It's free, it's fast, and it actually works.
        </p>
        <button
          onClick={() => navigate(createPageUrl("Signup"))}
          className="group inline-flex items-center gap-2 bg-green-400 hover:bg-green-300 text-green-950 font-bold text-base px-8 py-4 rounded-full transition-all duration-200 shadow-2xl shadow-green-400/30"
        >
          Create free account
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
        <p className="text-green-600 text-sm mt-4">No credit card. No spam. Cancel anytime.</p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#08180d] border-t border-green-900/30 py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center">
            <Sprout className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-bold">Sprout</span>
        </div>
        <p className="text-green-700 text-sm">
          © {new Date().getFullYear()} Sprout. Built to grow your financial knowledge.
        </p>
        <div className="flex items-center gap-5 text-sm text-green-700">
          <span className="hover:text-green-400 cursor-pointer transition-colors">Privacy</span>
          <span className="hover:text-green-400 cursor-pointer transition-colors">Terms</span>
        </div>
      </div>
    </footer>
  );
}

// ─── Main component ───────────────────────────────────────────

export default function Landing() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  // Redirect authenticated users straight to their dashboard
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data?.session) navigate(createPageUrl("Dashboard"), { replace: true });
    });

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [navigate]);

  return (
    <>
      {/* Google Fonts for Syne */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&display=swap');
        html { scroll-behavior: smooth; }
        * { box-sizing: border-box; }
      `}</style>

      <div className="font-sans antialiased">
        <Nav scrolled={scrolled} />
        <Hero navigate={navigate} />
        <Features />
        <Courses navigate={navigate} />
        <HowItWorks />
        <SocialProof />
        <CTA navigate={navigate} />
        <Footer />
      </div>
    </>
  );
}