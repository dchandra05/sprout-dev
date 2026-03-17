// src/pages/Dashboard.jsx
// Clean white + dark green. No emojis. Professional.
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { createPageUrl } from "@/utils";
import {
  Flame, Zap, BookOpen, Award, TrendingUp,
  ChevronRight, Target, Sprout, ArrowRight,
  CheckCircle, Clock,
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

// ─── Stat card ────────────────────────────────────────────────

function StatCard({ icon: Icon, value, label, sub, iconColor, borderColor }) {
  return (
    <div style={{
      background: "white", border: `1px solid ${borderColor || "#e5e7eb"}`,
      borderRadius: 14, padding: "20px 18px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      display: "flex", flexDirection: "column", gap: 4,
    }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: `${iconColor}15`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
        <Icon size={18} color={iconColor} />
      </div>
      <span style={{ fontSize: 26, fontWeight: 800, color: "#111827", lineHeight: 1 }}>{value}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{label}</span>
      {sub && <span style={{ fontSize: 12, color: "#9ca3af" }}>{sub}</span>}
    </div>
  );
}

// ─── Course progress card ─────────────────────────────────────

function CourseCard({ course, progress, onClick }) {
  const pct = Math.round(progress);
  return (
    <div
      onClick={onClick}
      style={{
        background: "white", border: "1px solid #e5e7eb", borderRadius: 14,
        padding: "18px 20px", cursor: "pointer", transition: "all 0.15s",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      }}
      onMouseOver={e => { e.currentTarget.style.borderColor = "#166534"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)"; }}
      onMouseOut={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)"; }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
        <div>
          <p style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: "0 0 3px" }}>{course.name}</p>
          <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>{course.lessons_count} lessons</p>
        </div>
        <ChevronRight size={16} color="#9ca3af" style={{ flexShrink: 0, marginTop: 2 }} />
      </div>
      {/* Progress bar */}
      <div style={{ height: 6, background: "#f3f4f6", borderRadius: 999 }}>
        <div style={{ height: "100%", width: `${pct}%`, background: "#166534", borderRadius: 999 }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 12 }}>
        <span style={{ color: "#9ca3af" }}>{pct}% complete</span>
        <span style={{ color: "#16a34a", fontWeight: 600, display: "flex", alignItems: "center", gap: 3 }}>
          <Zap size={11} /> {course.xp_reward} XP
        </span>
      </div>
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

  // Local progress
  const userProgress = useMemo(() => {
    if (!user?.email) return [];
    const all = getJSON("sprout_user_progress", []);
    return all.filter(p => p.user_email === user.email);
  }, [user?.email]);

  const completedLessons = userProgress.filter(p => p.completed).length;
  const userBadges = badges.filter(b => userProgress.some(p => p.badge_id === b.id));

  // Stats from user object (Supabase profile)
  const xp           = Number(user?.xp_points ?? 0);
  const level        = Number(user?.level ?? 1);
  const streak       = Number(user?.current_streak ?? 0);
  const xpForNext    = level * 500;
  const xpProgress   = xp % 500;

  // Course progress helper
  const getCourseProgress = (courseId) => {
    const course = courses.find(c => String(c.id) === String(courseId));
    if (!course) return 0;
    const done = userProgress.filter(p => String(p.course_id) === String(courseId) && p.completed).length;
    return (done / (Number(course.lessons_count) || 1)) * 100;
  };

  const inProgressCourses = courses.filter(c => {
    const p = getCourseProgress(c.id);
    return p > 0 && p < 100;
  });

  const featuredCourses = inProgressCourses.length > 0
    ? inProgressCourses.slice(0, 3)
    : courses.filter(c => c.is_featured).slice(0, 3);

  const name = user?.full_name?.split(" ")[0] || "there";

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px 80px" }}>

        {/* Welcome */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", margin: "0 0 4px" }}>
              Welcome back, {name}
            </h1>
            <p style={{ fontSize: 15, color: "#6b7280", margin: 0 }}>
              {inProgressCourses.length > 0
                ? `You have ${inProgressCourses.length} course${inProgressCourses.length > 1 ? "s" : ""} in progress.`
                : "Ready to start learning?"}
            </p>
          </div>
          <button
            onClick={() => navigate(createPageUrl("Learn"))}
            style={{ display: "flex", alignItems: "center", gap: 8, background: "#166534", color: "white", fontWeight: 700, fontSize: 14, padding: "11px 20px", borderRadius: 10, border: "none", cursor: "pointer" }}
          >
            <BookOpen size={16} />
            Browse Courses
          </button>
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 28 }}>
          <StatCard icon={Flame}    value={streak}           label="Day Streak"     sub="Keep it going" iconColor="#f97316" borderColor="#fed7aa" />
          <StatCard icon={Zap}      value={xp.toLocaleString()} label="Total XP"    sub={`Level ${level}`}  iconColor="#16a34a" borderColor="#bbf7d0" />
          <StatCard icon={BookOpen} value={completedLessons}  label="Lessons Done"  sub="Great work"    iconColor="#2563eb" borderColor="#bfdbfe" />
          <StatCard icon={Award}    value={userBadges.length}  label="Badges"       sub="Earned"        iconColor="#d97706" borderColor="#fde68a" />
        </div>

        {/* XP Level bar */}
        <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 14, padding: "18px 20px", marginBottom: 28, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <TrendingUp size={16} color="#166534" />
              <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>Level {level} Progress</span>
            </div>
            <span style={{ fontSize: 13, color: "#6b7280" }}>{xpProgress} / {xpForNext} XP</span>
          </div>
          <div style={{ height: 10, background: "#f3f4f6", borderRadius: 999 }}>
            <div style={{ height: "100%", width: `${Math.min((xpProgress / xpForNext) * 100, 100)}%`, background: "linear-gradient(90deg,#16a34a,#4ade80)", borderRadius: 999, transition: "width 0.5s" }} />
          </div>
          <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 6, marginBottom: 0 }}>
            {xpForNext - xpProgress} XP until Level {level + 1}
          </p>
        </div>

        {/* In-progress / featured courses */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: "#111827", margin: 0 }}>
              {inProgressCourses.length > 0 ? "Continue Learning" : "Featured Courses"}
            </h2>
            <button
              onClick={() => navigate(createPageUrl("Learn"))}
              style={{ fontSize: 13, color: "#166534", fontWeight: 600, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
            >
              See all <ChevronRight size={14} />
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
            {featuredCourses.map(c => (
              <CourseCard
                key={c.id}
                course={c}
                progress={getCourseProgress(c.id)}
                onClick={() => {
                  if (c.name?.toLowerCase().includes("ai literacy")) navigate(createPageUrl("AILiteracy"));
                  else navigate(createPageUrl(`CourseDetail?id=${c.id}`));
                }}
              />
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: "#111827", margin: "0 0 14px" }}>Quick Access</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
            {[
              { label: "All Courses",   icon: BookOpen,   page: "Learn",        color: "#166534" },
              { label: "Simulations",   icon: Target,     page: "Simulations",  color: "#0f766e" },
              { label: "Leaderboard",   icon: TrendingUp, page: "Leaderboard",  color: "#1e40af" },
              { label: "My Progress",   icon: CheckCircle,page: "Progress",     color: "#7c3aed" },
              { label: "Challenges",    icon: Zap,        page: "Challenges",   color: "#d97706" },
            ].map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.page}
                  onClick={() => navigate(createPageUrl(item.page))}
                  style={{
                    background: "white", border: "1px solid #e5e7eb", borderRadius: 12,
                    padding: "16px 14px", cursor: "pointer", textAlign: "center",
                    transition: "all 0.15s", boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = item.color; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `${item.color}12`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>
                    <Icon size={18} color={item.color} />
                  </div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#111827", margin: 0 }}>{item.label}</p>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}