// src/pages/Landing.jsx
// Landing page — dark forest green + white
// Auth redirect: checks localStorage for sprout_user (works with existing AuthContext stub)
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Sprout, ArrowRight, BookOpen, TrendingUp, Shield,
  Zap, ChevronDown, Star, Award,
} from "lucide-react";

// ─── Static data ──────────────────────────────────────────────

const FEATURES = [
  {
    icon: BookOpen,
    title: "Interactive Lessons",
    desc: "Bite-sized lessons built like a game. Learn budgeting, investing, credit, and more in under 10 minutes a day.",
  },
  {
    icon: TrendingUp,
    title: "Real Simulations",
    desc: "Practice reading a paycheck, building a budget, or managing a credit card — with real numbers, real consequences.",
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
  { emoji: "💵", title: "Budgeting Basics",         lessons: 6,  level: "Beginner",     color: "#22c55e" },
  { emoji: "📈", title: "Investing 101",             lessons: 8,  level: "Intermediate", color: "#16a34a" },
  { emoji: "💳", title: "Credit & Debt",             lessons: 7,  level: "Beginner",     color: "#15803d" },
  { emoji: "🧾", title: "Understanding Paychecks",   lessons: 5,  level: "Beginner",     color: "#166534" },
  { emoji: "🏠", title: "Saving for Goals",          lessons: 6,  level: "Intermediate", color: "#14532d" },
  { emoji: "🤖", title: "AI Literacy",               lessons: 10, level: "All levels",   color: "#1a7a3c" },
];

const STATS = [
  { value: "10+",   label: "Courses" },
  { value: "100+",  label: "Lessons" },
  { value: "Free",  label: "Always" },
  { value: "5 min", label: "Per lesson" },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Create your account",  desc: "Sign up in 30 seconds. No credit card. No spam." },
  { step: "02", title: "Pick a course",         desc: "Start with budgeting basics or jump to investing — your call." },
  { step: "03", title: "Learn by doing",        desc: "Answer questions, run simulations, and earn XP as you go." },
  { step: "04", title: "Level up for real",     desc: "Apply what you learn. Track your progress. Build real skills." },
];

const QUOTES = [
  { text: "I finally understand how my paycheck works. I learned more in one afternoon than a full semester of econ.", name: "Marcus T.", role: "High school senior" },
  { text: "The budget simulator actually felt like a game. I didn't realize I was learning until I was three lessons in.", name: "Priya K.", role: "College freshman" },
  { text: "Finally an app that teaches money stuff without making it boring. I recommend it to everyone.", name: "Jordan L.", role: "Community college student" },
];

// ─── Shared styles ────────────────────────────────────────────
const syne = { fontFamily: "'Syne', sans-serif" };

// ─── Sub-sections ─────────────────────────────────────────────

function Nav({ scrolled, navigate }) {
  return (
    <header
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        transition: "all 0.3s",
        background: scrolled ? "rgba(15,45,26,0.97)" : "transparent",
        borderBottom: scrolled ? "1px solid rgba(34,197,94,0.15)" : "1px solid transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, background: "linear-gradient(135deg,#4ade80,#16a34a)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Sprout size={18} color="white" />
          </div>
          <span style={{ ...syne, fontSize: 20, fontWeight: 900, color: "white" }}>Sprout</span>
        </div>

        {/* Nav links - desktop */}
        <nav style={{ display: "flex", gap: 32, fontSize: 14, fontWeight: 500, color: "rgba(134,239,172,0.8)" }} className="sprout-nav-links">
          <a href="#features" style={{ color: "inherit", textDecoration: "none" }} onMouseOver={e => e.target.style.color="#fff"} onMouseOut={e => e.target.style.color="rgba(134,239,172,0.8)"}>Features</a>
          <a href="#courses"  style={{ color: "inherit", textDecoration: "none" }} onMouseOver={e => e.target.style.color="#fff"} onMouseOut={e => e.target.style.color="rgba(134,239,172,0.8)"}>Courses</a>
          <a href="#how"      style={{ color: "inherit", textDecoration: "none" }} onMouseOver={e => e.target.style.color="#fff"} onMouseOut={e => e.target.style.color="rgba(134,239,172,0.8)"}>How it works</a>
        </nav>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button
            onClick={() => navigate(createPageUrl("Login"))}
            style={{ fontSize: 14, fontWeight: 600, color: "rgba(134,239,172,0.8)", background: "none", border: "none", cursor: "pointer", padding: "6px 12px" }}
          >
            Sign in
          </button>
          <button
            onClick={() => navigate(createPageUrl("Signup"))}
            style={{ fontSize: 14, fontWeight: 700, background: "#4ade80", color: "#052e16", padding: "9px 20px", borderRadius: 999, border: "none", cursor: "pointer", boxShadow: "0 4px 20px rgba(74,222,128,0.3)" }}
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
    <section style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "80px 24px 60px", overflow: "hidden", background: "#0a1f10" }}>
      {/* Radial glow */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 50% at 50% -10%, #16a34a55, transparent)", pointerEvents: "none" }} />
      {/* Grid */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "linear-gradient(#22c55e 1px,transparent 1px),linear-gradient(90deg,#22c55e 1px,transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 820, margin: "0 auto" }}>
        {/* Badge */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(20,83,45,0.7)", border: "1px solid rgba(74,222,128,0.25)", borderRadius: 999, padding: "6px 16px", marginBottom: 32, backdropFilter: "blur(8px)" }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
          <span style={{ fontSize: 13, color: "#86efac", fontWeight: 500 }}>Free for all students</span>
        </div>

        {/* Headline */}
        <h1 style={{ ...syne, fontSize: "clamp(40px,7vw,72px)", fontWeight: 900, color: "white", lineHeight: 1.05, marginBottom: 24, letterSpacing: "-1px" }}>
          Master your money.{" "}
          <span style={{ background: "linear-gradient(135deg,#86efac,#4ade80)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            One lesson at a time.
          </span>
        </h1>

        <p style={{ fontSize: "clamp(16px,2vw,20px)", color: "rgba(187,247,208,0.75)", maxWidth: 600, margin: "0 auto 40px", lineHeight: 1.65 }}>
          Sprout teaches real-world personal finance through interactive lessons, hands-on simulations, and a system that makes learning feel like a game.
        </p>

        {/* CTAs */}
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 60 }}>
          <button
            onClick={() => navigate(createPageUrl("Signup"))}
            style={{ display: "flex", alignItems: "center", gap: 8, background: "#4ade80", color: "#052e16", fontWeight: 700, fontSize: 16, padding: "14px 32px", borderRadius: 999, border: "none", cursor: "pointer", boxShadow: "0 8px 32px rgba(74,222,128,0.35)" }}
          >
            Start learning free <ArrowRight size={18} />
          </button>
          <button
            onClick={() => navigate(createPageUrl("Login"))}
            style={{ display: "flex", alignItems: "center", gap: 8, background: "transparent", color: "rgba(187,247,208,0.85)", fontWeight: 600, fontSize: 16, padding: "14px 32px", borderRadius: 999, border: "1px solid rgba(74,222,128,0.3)", cursor: "pointer" }}
          >
            I have an account
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24, maxWidth: 460, margin: "0 auto" }}>
          {STATS.map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <p style={{ ...syne, fontSize: 26, fontWeight: 900, color: "white", margin: 0 }}>{s.value}</p>
              <p style={{ fontSize: 11, color: "rgba(74,222,128,0.6)", fontWeight: 500, marginTop: 2 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <div style={{ position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)", color: "#15803d", animation: "bounce 2s infinite" }}>
        <ChevronDown size={22} />
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" style={{ padding: "96px 24px", background: "#0d2515" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#4ade80", marginBottom: 12 }}>Why Sprout</p>
          <h2 style={{ ...syne, fontSize: "clamp(30px,4vw,48px)", fontWeight: 900, color: "white", margin: 0 }}>
            Financial education{" "}
            <span style={{ color: "#4ade80" }}>that actually works</span>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20 }}>
          {FEATURES.map(f => {
            const Icon = f.icon;
            return (
              <div key={f.title} style={{ background: "#0f2d1a", border: "1px solid rgba(20,83,45,0.7)", borderRadius: 20, padding: 32 }}>
                <div style={{ width: 48, height: 48, background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.15)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                  <Icon size={22} color="#4ade80" />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "white", marginBottom: 8, marginTop: 0 }}>{f.title}</h3>
                <p style={{ color: "rgba(187,247,208,0.55)", lineHeight: 1.65, margin: 0, fontSize: 15 }}>{f.desc}</p>
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
    <section id="courses" style={{ padding: "96px 24px", background: "#0a1f10" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#4ade80", marginBottom: 12 }}>What you'll learn</p>
          <h2 style={{ ...syne, fontSize: "clamp(30px,4vw,48px)", fontWeight: 900, color: "white", margin: 0 }}>Real courses. Real skills.</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 18 }}>
          {COURSES.map(c => (
            <div
              key={c.title}
              onClick={() => navigate(createPageUrl("Signup"))}
              style={{ background: "#0f2d1a", border: "1px solid rgba(20,83,45,0.7)", borderRadius: 20, padding: 24, cursor: "pointer", transition: "all 0.2s" }}
              onMouseOver={e => { e.currentTarget.style.borderColor = "rgba(74,222,128,0.4)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = "rgba(20,83,45,0.7)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <div style={{ width: 52, height: 52, borderRadius: 16, background: `${c.color}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 16 }}>
                {c.emoji}
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: "white", margin: "0 0 6px" }}>{c.title}</h3>
              <p style={{ fontSize: 13, color: "rgba(134,239,172,0.45)", margin: "0 0 16px" }}>{c.lessons} lessons · <span style={{ color: c.color }}>{c.level}</span></p>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#4ade80", fontSize: 13, fontWeight: 600 }}>
                Start course <ArrowRight size={13} />
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
    <section id="how" style={{ padding: "96px 24px", background: "#0d2515" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#4ade80", marginBottom: 12 }}>Getting started</p>
          <h2 style={{ ...syne, fontSize: "clamp(30px,4vw,48px)", fontWeight: 900, color: "white", margin: 0 }}>How it works</h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {HOW_IT_WORKS.map(s => (
            <div key={s.step} style={{ display: "flex", gap: 20, alignItems: "flex-start", background: "#0f2d1a", border: "1px solid rgba(20,83,45,0.7)", borderRadius: 18, padding: 24 }}>
              <div style={{ flexShrink: 0, width: 48, height: 48, background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.18)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ ...syne, fontSize: 13, fontWeight: 900, color: "#4ade80" }}>{s.step}</span>
              </div>
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "white", margin: "0 0 6px" }}>{s.title}</h3>
                <p style={{ color: "rgba(187,247,208,0.55)", margin: 0, lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SocialProof() {
  return (
    <section style={{ padding: "96px 24px", background: "#0a1f10" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 16 }}>
            {[...Array(5)].map((_,i) => <Star key={i} size={18} color="#facc15" fill="#facc15" />)}
          </div>
          <h2 style={{ ...syne, fontSize: "clamp(26px,3.5vw,40px)", fontWeight: 900, color: "white", margin: 0 }}>Students love Sprout</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 18 }}>
          {QUOTES.map(q => (
            <div key={q.name} style={{ background: "#0f2d1a", border: "1px solid rgba(20,83,45,0.7)", borderRadius: 20, padding: 28 }}>
              <p style={{ color: "rgba(187,247,208,0.75)", lineHeight: 1.7, marginBottom: 20, marginTop: 0, fontSize: 15 }}>"{q.text}"</p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 36, height: 36, background: "#14532d", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#86efac", fontWeight: 700, fontSize: 14 }}>
                  {q.name[0]}
                </div>
                <div>
                  <p style={{ color: "white", fontWeight: 600, fontSize: 14, margin: 0 }}>{q.name}</p>
                  <p style={{ color: "rgba(74,222,128,0.5)", fontSize: 12, margin: 0 }}>{q.role}</p>
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
    <section style={{ padding: "96px 24px", background: "#0d2515", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 60% at 50% 100%,#16a34a44,transparent)", pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
        <div style={{ width: 64, height: 64, background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.18)", borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
          <Award size={30} color="#4ade80" />
        </div>
        <h2 style={{ ...syne, fontSize: "clamp(30px,4vw,50px)", fontWeight: 900, color: "white", margin: "0 0 20px" }}>Your financial future starts today.</h2>
        <p style={{ color: "rgba(187,247,208,0.65)", fontSize: 18, marginBottom: 32, lineHeight: 1.6 }}>
          Join thousands of students already building smarter money habits. Free, fast, and it actually works.
        </p>
        <button
          onClick={() => navigate(createPageUrl("Signup"))}
          style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#4ade80", color: "#052e16", fontWeight: 700, fontSize: 16, padding: "14px 36px", borderRadius: 999, border: "none", cursor: "pointer", boxShadow: "0 8px 32px rgba(74,222,128,0.35)" }}
        >
          Create free account <ArrowRight size={18} />
        </button>
        <p style={{ color: "#15803d", fontSize: 13, marginTop: 16 }}>No credit card. No spam. Cancel anytime.</p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ background: "#071510", borderTop: "1px solid rgba(20,83,45,0.4)", padding: "36px 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, background: "linear-gradient(135deg,#4ade80,#16a34a)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Sprout size={15} color="white" />
          </div>
          <span style={{ color: "white", fontWeight: 700 }}>Sprout</span>
        </div>
        <p style={{ color: "#166534", fontSize: 13, margin: 0 }}>© {new Date().getFullYear()} Sprout. Built to grow your financial knowledge.</p>
        <div style={{ display: "flex", gap: 20, fontSize: 13, color: "#166534" }}>
          <span style={{ cursor: "pointer" }}>Privacy</span>
          <span style={{ cursor: "pointer" }}>Terms</span>
        </div>
      </div>
    </footer>
  );
}

// ─── Main export ──────────────────────────────────────────────

export default function Landing() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Check if user is already logged in via localStorage (no Supabase call needed)
    // This is compatible with the existing AuthContext stub
    try {
      const raw = localStorage.getItem("sprout_user");
      if (raw) {
        const u = JSON.parse(raw);
        if (u && u.email) {
          navigate(createPageUrl("Dashboard"), { replace: true });
          return;
        }
      }
    } catch {
      // ignore parse errors
    }

    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [navigate]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&display=swap');
        html { scroll-behavior: smooth; }
        @keyframes bounce {
          0%,100% { transform: translateX(-50%) translateY(0); }
          50%      { transform: translateX(-50%) translateY(-8px); }
        }
        @media (max-width: 640px) {
          .sprout-nav-links { display: none !important; }
        }
      `}</style>
      <div style={{ fontFamily: "system-ui, sans-serif", WebkitFontSmoothing: "antialiased" }}>
        <Nav scrolled={scrolled} navigate={navigate} />
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