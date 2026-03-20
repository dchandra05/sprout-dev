// src/pages/Dashboard.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { createPageUrl } from "@/utils";
import {
  Flame, Zap, BookOpen, Award, TrendingUp, Target, Sprout,
  ArrowRight, CheckCircle, Play, ChevronRight,
  Calculator, Wallet, GraduationCap, Briefcase, Users, Home as HomeIcon,
  TrendingUp as TrendingUpIcon, PiggyBank, CreditCard, Brain, DollarSign, Shield,
} from "lucide-react";

// ─── Data helpers ─────────────────────────────────────────────

const safeParse = (r, fb) => { try { return r ? JSON.parse(r) : fb; } catch { return fb; } };
const getJSON   = (k, fb) => safeParse(localStorage.getItem(k), fb);
const setJSON   = (k, v)  => localStorage.setItem(k, JSON.stringify(v));
const getLocalUser = () => getJSON("sprout_user", null);

const BASE = import.meta.env.BASE_URL || "/";
async function fetchWithCache(url, key, fb = []) {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error();
    const d = await res.json();
    setJSON(key, d);
    return Array.isArray(d) ? d : fb;
  } catch { return getJSON(key, fb); }
}

// ─── Day label ────────────────────────────────────────────────
const DAY_NAMES   = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
function getTodayLabel() {
  const now = new Date();
  return `${DAY_NAMES[now.getDay()]}, ${MONTH_NAMES[now.getMonth()]} ${now.getDate()}`;
}

// ─── Category icons for courses ───────────────────────────────
const CATEGORY_ICONS = {
  Investing:          TrendingUpIcon,
  Saving:             PiggyBank,
  "Credit & Debt":    CreditCard,
  Insurance:          Shield,
  "AI & ML":          Brain,
  "Personal Finance": Briefcase,
  "Career Readiness": GraduationCap,
};

// ─── Simulation definitions ───────────────────────────────────
const SIMULATIONS = [
  { id: "budget-basics",      title: "Build Your First Budget",        desc: "Step-by-step walkthrough of a real budget sheet.",                              icon: Wallet,        tag: "Walkthrough"  },
  { id: "college-budget",     title: "College Student Budget",         desc: "Navigate variable income and irregular expenses as a college student.",         icon: GraduationCap, tag: "Simulation"   },
  { id: "first-job-budget",   title: "New Graduate Budget",            desc: "First full-time job, first real budget. Build an emergency fund.",              icon: Briefcase,     tag: "Simulation"   },
  { id: "dual-income-budget", title: "Early Career — Dual Income",     desc: "Two incomes, one budget. Save for a down payment.",                            icon: Users,         tag: "Simulation"   },
  { id: "family-budget",      title: "Mid-Career Family Budget",       desc: "Two kids, two incomes. Absorb new expenses without sacrificing retirement.",    icon: HomeIcon,      tag: "Simulation"   },
  { id: "paper-trading",      title: "Paper Trading",                  desc: "Practice investing with virtual money. Trade real stocks without any risk.",    icon: TrendingUp,    tag: "Interactive"  },
  { id: "investment-calculator", title: "Investment Growth Calculator", desc: "See how compound interest grows your money over time with adjustable inputs.", icon: Calculator,    tag: "Calculator"   },
];

// ─── Stat card ────────────────────────────────────────────────

function StatCard({ icon: Icon, value, label, sub, accentColor, bgColor }) {
  return (
    <div style={{ background: bgColor, borderRadius: 16, padding: "20px 20px 18px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
        <Icon size={16} color={accentColor} />
        <span style={{ fontSize: 11, fontWeight: 700, color: accentColor, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</span>
      </div>
      <span style={{ fontSize: 32, fontWeight: 800, color: "#111827", lineHeight: 1 }}>{value}</span>
      {sub && <span style={{ fontSize: 13, color: "#6b7280" }}>{sub}</span>}
    </div>
  );
}

// ─── Course card ──────────────────────────────────────────────

function CourseCard({ course, progress, onClick }) {
  const Icon = CATEGORY_ICONS[course.category] || BookOpen;
  const pct  = Math.round(progress);
  const isComplete = pct >= 100;
  const isStarted  = pct > 0;

  return (
    <div
      onClick={onClick}
      style={{
        background: "white", border: "1px solid #e5e7eb", borderRadius: 16,
        overflow: "hidden", cursor: "pointer", transition: "all 0.18s",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column",
      }}
      onMouseOver={e => { e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseOut={e => { e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      {/* Header band */}
      <div style={{ background: "#f0f7f4", borderBottom: "1px solid #b6ddc8", padding: "20px 18px 18px", display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div style={{ width: 42, height: 42, borderRadius: 12, background: "white", border: "1px solid #b6ddc8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon size={20} color="#2a7a4b" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, flexWrap: "wrap" }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: "#2a7a4b", background: "#2a7a4b15", padding: "2px 8px", borderRadius: 999, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {course.category}
            </span>
            <span style={{ fontSize: 10, color: "#9ca3af", background: "#f3f4f6", padding: "2px 8px", borderRadius: 999 }}>
              {course.difficulty || "Beginner"}
            </span>
          </div>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: 0, lineHeight: 1.35 }}>{course.name}</h3>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "14px 18px 18px", flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
        <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.55, margin: 0, flex: 1 }}>{course.description}</p>

        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 12, color: "#9ca3af" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <BookOpen size={12} /> {course.lessons_count} lessons
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Zap size={12} color="#2a7a4b" />
            <span style={{ color: "#2a7a4b", fontWeight: 600 }}>{course.xp_reward} XP</span>
          </span>
        </div>

        {isComplete ? (
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#2a7a4b", fontSize: 13, fontWeight: 600 }}>
            <CheckCircle size={14} /> Completed
          </div>
        ) : isStarted ? (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#6b7280", marginBottom: 5 }}>
              <span>Progress</span>
              <span style={{ fontWeight: 600, color: "#2a7a4b" }}>{pct}%</span>
            </div>
            <div style={{ height: 5, background: "#f3f4f6", borderRadius: 999 }}>
              <div style={{ height: "100%", width: `${pct}%`, background: "#2a7a4b", borderRadius: 999 }} />
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, color: "#2a7a4b", fontWeight: 600 }}>Start course</span>
            <ChevronRight size={14} color="#2a7a4b" />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Simulation card ──────────────────────────────────────────

function SimCard({ sim, onLaunch }) {
  const Icon = sim.icon;
  return (
    <div
      style={{
        background: "white", border: "1px solid #e5e7eb", borderRadius: 16,
        padding: "18px 18px 16px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        display: "flex", flexDirection: "column", gap: 10,
        transition: "all 0.18s", cursor: "pointer",
      }}
      onClick={onLaunch}
      onMouseOver={e => { e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = "#c8dce6"; }}
      onMouseOut={e => { e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "#e5e7eb"; }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div style={{ width: 42, height: 42, borderRadius: 12, background: "#1c2f3c", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon size={20} color="white" />
        </div>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: "#1c2f3c", textTransform: "uppercase", letterSpacing: "0.06em", background: "#f0f4f7", border: "1px solid #c8dce6", borderRadius: 999, padding: "2px 8px", display: "inline-block", marginBottom: 4 }}>
            {sim.tag}
          </span>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: 0, lineHeight: 1.35 }}>{sim.title}</h3>
        </div>
      </div>
      <p style={{ fontSize: 12, color: "#6b7280", margin: 0, lineHeight: 1.55, flex: 1 }}>{sim.desc}</p>
      <button
        onClick={e => { e.stopPropagation(); onLaunch(); }}
        style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, width: "100%", padding: "9px 0", background: "#1c2f3c", color: "white", fontWeight: 600, fontSize: 13, borderRadius: 10, border: "none", cursor: "pointer" }}
      >
        <Play size={13} /> Launch
      </button>
    </div>
  );
}

// ─── Section header ───────────────────────────────────────────

function SectionHeader({ title, subtitle }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: "#111827", margin: "0 0 4px" }}>{title}</h2>
      {subtitle && <p style={{ fontSize: 14, color: "#6b7280", margin: 0 }}>{subtitle}</p>}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const u = getLocalUser();
    if (!u) { navigate(createPageUrl("Login")); return; }
    setUser(u);
  }, [navigate]);

  const { data: courses = [] } = useQuery({
    queryKey: ["dash_courses"],
    queryFn: () => fetchWithCache(`${BASE}data/courses.json`, "sprout_courses"),
  });

  const { data: badges = [] } = useQuery({
    queryKey: ["dash_badges"],
    queryFn: () => fetchWithCache(`${BASE}data/badges.json`, "sprout_badges"),
  });

  const userProgress = useMemo(() => {
    if (!user?.email) return [];
    const all = getJSON("sprout_user_progress", []);
    return all.filter(p => p.user_email === user.email);
  }, [user?.email]);

  const completedLessons = userProgress.filter(p => p.completed).length;
  const userBadges = badges.filter(b => userProgress.some(p => p.badge_id === b.id));

  const xp         = Number(user?.xp_points ?? 0);
  const level      = Number(user?.level ?? 1);
  const streak     = Number(user?.current_streak ?? 0);
  const xpForNext  = level * 100;
  const xpProgress = xp % 100;
  const xpPct      = Math.min((xpProgress / xpForNext) * 100, 100);

  const getCourseProgress = (courseId) => {
    const course = courses.find(c => String(c.id) === String(courseId));
    if (!course) return 0;
    const done = userProgress.filter(p => String(p.course_id) === String(courseId) && p.completed).length;
    return (done / (Number(course.lessons_count) || 1)) * 100;
  };

  const handleCourseClick = (course) => {
    if (course.name?.toLowerCase().includes("ai literacy") || course.slug === "ai-literacy") {
      navigate(createPageUrl("AILiteracy"));
    } else {
      navigate(createPageUrl(`CourseDetail?id=${course.id}`));
    }
  };

  const handleSimLaunch = (simId) => {
    navigate(createPageUrl(`Simulations?launch=${simId}`));
  };

  const name = user?.full_name?.split(" ")[0] || "learner";

  if (!user) return null;

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 24px 80px" }}>

        {/* ── Hero Banner ───────────────────────────────────── */}
        <div style={{
          background: "#1c2f3c", borderRadius: 20, padding: "36px 40px",
          marginBottom: 20, display: "grid", gridTemplateColumns: "1fr auto", gap: 40, alignItems: "center",
        }}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
              {getTodayLabel()}
            </p>
            <h1 style={{ fontSize: 38, fontWeight: 900, color: "white", margin: "0 0 10px", lineHeight: 1.15 }}>
              Hello, {name}!
            </h1>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", margin: "0 0 24px", lineHeight: 1.5 }}>
              Build real-world skills through interactive courses, simulations, and practical challenges.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button
                onClick={() => document.getElementById("dash-courses")?.scrollIntoView({ behavior: "smooth" })}
                style={{ display: "flex", alignItems: "center", gap: 8, background: "white", color: "#1c2f3c", fontWeight: 700, fontSize: 14, padding: "11px 22px", borderRadius: 999, border: "none", cursor: "pointer" }}
              >
                Browse Courses <ArrowRight size={15} />
              </button>
              <button
                onClick={() => document.getElementById("dash-simulations")?.scrollIntoView({ behavior: "smooth" })}
                style={{ display: "flex", alignItems: "center", gap: 8, background: "transparent", color: "white", fontWeight: 600, fontSize: 14, padding: "11px 22px", borderRadius: 999, border: "1.5px solid rgba(255,255,255,0.35)", cursor: "pointer" }}
              >
                Try Simulations
              </button>
            </div>
          </div>

          {/* Progress panel */}
          <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 16, padding: "22px 24px", minWidth: 220, flexShrink: 0 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 14px" }}>
              Your Progress
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <Sprout size={18} color="#4aad74" />
              <span style={{ fontSize: 14, fontWeight: 700, color: "white" }}>Level {level}</span>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginLeft: "auto" }}>{xpProgress}/{xpForNext} XP</span>
            </div>
            <div style={{ height: 6, background: "rgba(255,255,255,0.12)", borderRadius: 999, marginBottom: 18 }}>
              <div style={{ height: "100%", width: `${xpPct}%`, background: "#4aad74", borderRadius: 999, transition: "width 0.5s" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              {[
                { label: "Streak",  value: streak,            icon: Flame },
                { label: "Lessons", value: completedLessons,  icon: BookOpen },
                { label: "Badges",  value: userBadges.length, icon: Award },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} style={{ textAlign: "center" }}>
                  <Icon size={14} color="rgba(255,255,255,0.4)" style={{ marginBottom: 4 }} />
                  <p style={{ fontSize: 18, fontWeight: 800, color: "white", margin: "0 0 2px", lineHeight: 1 }}>{value}</p>
                  <p style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", margin: 0, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Stat Cards ────────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 32 }}>
          <StatCard icon={Flame}    value={streak}              label="Day Streak"    sub="Keep it up"      accentColor="#ea6c2e" bgColor="#fef3ec" />
          <StatCard icon={Zap}      value={xp.toLocaleString()} label="Total XP"      sub={`Level ${level}`} accentColor="#2563eb" bgColor="#eff6ff" />
          <StatCard icon={BookOpen} value={completedLessons}     label="Lessons Done"  sub="Great progress"   accentColor="#2a7a4b" bgColor="#f0faf4" />
          <StatCard icon={Award}    value={userBadges.length}    label="Badges Earned" sub="Collector"        accentColor="#9333ea" bgColor="#faf5ff" />
        </div>

        {/* ── XP Level Bar ──────────────────────────────────── */}
        <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 14, padding: "18px 20px", marginBottom: 40, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <TrendingUp size={16} color="#1c2f3c" />
              <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>Level {level} Progress</span>
            </div>
            <span style={{ fontSize: 13, color: "#6b7280" }}>{xpProgress} / {xpForNext} XP</span>
          </div>
          <div style={{ height: 10, background: "#f3f4f6", borderRadius: 999 }}>
            <div style={{ height: "100%", width: `${xpPct}%`, background: "linear-gradient(90deg,#2a7a4b,#4aad74)", borderRadius: 999, transition: "width 0.5s" }} />
          </div>
          <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 6, marginBottom: 0 }}>
            {xpForNext - xpProgress} XP until Level {level + 1}
          </p>
        </div>

        {/* ── All Courses ───────────────────────────────────── */}
        <div id="dash-courses" style={{ marginBottom: 48 }}>
          <SectionHeader
            title="Courses"
            subtitle="Build real financial skills — one lesson at a time."
          />
          {courses.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 18 }}>
              {courses.map(course => (
                <CourseCard
                  key={course.id}
                  course={course}
                  progress={getCourseProgress(course.id)}
                  onClick={() => handleCourseClick(course)}
                />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "48px 24px", background: "white", borderRadius: 16, border: "1px solid #e5e7eb" }}>
              <BookOpen size={32} color="#9ca3af" style={{ marginBottom: 12 }} />
              <p style={{ color: "#6b7280", margin: 0 }}>Loading courses...</p>
            </div>
          )}
        </div>

        {/* ── All Simulations ───────────────────────────────── */}
        <div id="dash-simulations" style={{ marginBottom: 48 }}>
          <SectionHeader
            title="Simulations"
            subtitle="Practice real-world financial scenarios in a safe, interactive environment."
          />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
            {SIMULATIONS.map(sim => (
              <SimCard
                key={sim.id}
                sim={sim}
                onLaunch={() => handleSimLaunch(sim.id)}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
