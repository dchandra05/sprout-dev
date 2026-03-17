// src/pages/Learn.jsx
// White + dark green theme. No emojis. Clean icons.
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { createPageUrl } from "@/utils";
import {
  Search, TrendingUp, CreditCard, PiggyBank, Shield,
  Brain, Briefcase, GraduationCap, BookOpen, Zap, Clock,
  ChevronRight, Award, CheckCircle,
} from "lucide-react";

// ─── Data helpers ─────────────────────────────────────────────

const safeParse = (raw, fb) => { try { return raw ? JSON.parse(raw) : fb; } catch { return fb; } };
const getJSON   = (k, fb) => safeParse(localStorage.getItem(k), fb);
const setJSON   = (k, v)  => localStorage.setItem(k, JSON.stringify(v));
const getLocalUser = () => getJSON("sprout_user", null);

async function fetchJsonWithCache(url, cacheKey, fallback = []) {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`${res.status}`);
    const data = await res.json();
    setJSON(cacheKey, data);
    return Array.isArray(data) ? data : fallback;
  } catch {
    return getJSON(cacheKey, fallback);
  }
}

const dataClient = {
  listCourses: () => fetchJsonWithCache(`${import.meta.env.BASE_URL || "/"}data/courses.json`, "sprout_courses", []),
  listUserProgress: (email) => {
    const all = getJSON("sprout_user_progress", []);
    return email ? all.filter(p => p.user_email === email) : [];
  },
};

// ─── Category config (icons only, no emojis) ─────────────────

const CATEGORY_ICONS = {
  Investing:         TrendingUp,
  Saving:            PiggyBank,
  "Credit & Debt":   CreditCard,
  Insurance:         Shield,
  "AI & ML":         Brain,
  "Personal Finance": Briefcase,
  "Career Readiness": GraduationCap,
};

// Accent colors per category (all dark green family)
const CATEGORY_COLORS = {
  Investing:         { bg: "#f0fdf4", accent: "#166534", border: "#bbf7d0" },
  Saving:            { bg: "#f0fdf4", accent: "#15803d", border: "#bbf7d0" },
  "Credit & Debt":   { bg: "#f0fdf4", accent: "#14532d", border: "#86efac" },
  Insurance:         { bg: "#f0fdf4", accent: "#1a7a3c", border: "#bbf7d0" },
  "AI & ML":         { bg: "#eff6ff", accent: "#1e40af", border: "#bfdbfe" },
  "Personal Finance":{ bg: "#f0fdf4", accent: "#166534", border: "#bbf7d0" },
  "Career Readiness":{ bg: "#f0fdf4", accent: "#14532d", border: "#86efac" },
};

const defaultColor = { bg: "#f0fdf4", accent: "#166534", border: "#bbf7d0" };

// ─── Subcomponents ────────────────────────────────────────────

function CourseCard({ course, progress, onClick }) {
  const Icon = CATEGORY_ICONS[course.category] || BookOpen;
  const c = CATEGORY_COLORS[course.category] || defaultColor;
  const pct = Math.round(progress);
  const isStarted = pct > 0;
  const isComplete = pct >= 100;

  return (
    <div
      onClick={onClick}
      style={{
        background: "white",
        border: "1px solid #e5e7eb",
        borderRadius: 16,
        overflow: "hidden",
        cursor: "pointer",
        transition: "all 0.18s",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        display: "flex",
        flexDirection: "column",
      }}
      onMouseOver={e => { e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseOut={e => { e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      {/* Header band */}
      <div style={{ background: c.bg, borderBottom: `1px solid ${c.border}`, padding: "24px 20px 20px", display: "flex", alignItems: "flex-start", gap: 14 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: "white", border: `1px solid ${c.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon size={20} color={c.accent} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: c.accent, background: `${c.accent}15`, padding: "2px 8px", borderRadius: 999, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {course.category}
            </span>
            <span style={{ fontSize: 11, color: "#9ca3af", background: "#f3f4f6", padding: "2px 8px", borderRadius: 999 }}>
              {course.difficulty || "Beginner"}
            </span>
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: 0, lineHeight: 1.35 }}>{course.name}</h3>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "16px 20px 20px", flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
        <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.55, margin: 0, flex: 1 }}>
          {course.description}
        </p>

        {/* Meta row */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 13, color: "#9ca3af" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <BookOpen size={13} />
            {course.lessons_count} lessons
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Zap size={13} color={c.accent} />
            <span style={{ color: c.accent, fontWeight: 600 }}>{course.xp_reward} XP</span>
          </span>
        </div>

        {/* Progress or start */}
        {isComplete ? (
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#16a34a", fontSize: 13, fontWeight: 600 }}>
            <CheckCircle size={15} />
            Completed
          </div>
        ) : isStarted ? (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#6b7280", marginBottom: 6 }}>
              <span>Progress</span>
              <span style={{ fontWeight: 600, color: c.accent }}>{pct}%</span>
            </div>
            <div style={{ height: 6, background: "#f3f4f6", borderRadius: 999 }}>
              <div style={{ height: "100%", width: `${pct}%`, background: c.accent, borderRadius: 999, transition: "width 0.4s" }} />
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, color: c.accent, fontWeight: 600 }}>Start course</span>
            <ChevronRight size={15} color={c.accent} />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────

export default function Learn() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("All");
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const u = getLocalUser();
    if (!u) { navigate(createPageUrl("Login")); return; }
    setUser(u);
  }, [navigate]);

  const { data: courses = [] } = useQuery({
    queryKey: ["courses_v2"],
    queryFn: dataClient.listCourses,
  });

  const userProgress = useMemo(() => dataClient.listUserProgress(user?.email), [user?.email, courses]);

  const categories = useMemo(() => ["All", ...new Set(courses.map(c => c.category).filter(Boolean))], [courses]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return courses.filter(c => {
      const matches = !q || c.name?.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q);
      const inCat   = selectedCat === "All" || c.category === selectedCat;
      return matches && inCat;
    });
  }, [courses, search, selectedCat]);

  const getCourseProgress = (courseId) => {
    const course = courses.find(c => String(c.id) === String(courseId));
    if (!course) return 0;
    const done = userProgress.filter(p => String(p.course_id) === String(courseId) && p.completed).length;
    return (done / (Number(course.lessons_count) || 1)) * 100;
  };

  const handleCourseClick = (course) => {
    // AI Literacy has a dedicated page
    if (course.name?.toLowerCase().includes("ai literacy") || course.slug === "ai-literacy") {
      navigate(createPageUrl("AILiteracy"));
    } else {
      navigate(createPageUrl(`CourseDetail?id=${course.id}`));
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px 80px" }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#111827", margin: "0 0 6px" }}>Courses</h1>
          <p style={{ fontSize: 15, color: "#6b7280", margin: 0 }}>Build real financial skills — one lesson at a time.</p>
        </div>

        {/* Search */}
        <div style={{ position: "relative", maxWidth: 480, marginBottom: 24 }}>
          <Search size={17} color="#9ca3af" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search courses..."
            style={{
              width: "100%", padding: "11px 14px 11px 42px",
              fontSize: 14, border: "1px solid #e5e7eb", borderRadius: 10,
              outline: "none", background: "white",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}
          />
        </div>

        {/* Category filter */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 32 }}>
          {categories.map(cat => {
            const active = selectedCat === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                style={{
                  padding: "7px 16px", borderRadius: 999, fontSize: 13, fontWeight: 600,
                  cursor: "pointer", transition: "all 0.15s",
                  background: active ? "#166534" : "white",
                  color: active ? "white" : "#374151",
                  border: active ? "1px solid #166534" : "1px solid #e5e7eb",
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
            {filtered.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                progress={getCourseProgress(course.id)}
                onClick={() => handleCourseClick(course)}
              />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "64px 24px" }}>
            <div style={{ width: 56, height: 56, background: "#f3f4f6", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Search size={24} color="#9ca3af" />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: "0 0 6px" }}>No courses found</h3>
            <p style={{ color: "#6b7280", margin: 0 }}>Try adjusting your search or selecting a different category.</p>
          </div>
        )}
      </div>
    </div>
  );
}