import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Search,
  TrendingUp,
  PiggyBank,
  CreditCard,
  Shield,
  Brain,
  Briefcase,
  GraduationCap,
  Zap,
  Clock,
  Target,
} from "lucide-react";

/** ----------------------------
 * Hybrid data client (public/data -> localStorage fallback)
 * ---------------------------- */
const safeParse = (raw, fallback) => {
  try {
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const getLocalUser = () => safeParse(localStorage.getItem("sprout_user"), null);

const getJSON = (key, fallback) => safeParse(localStorage.getItem(key), fallback);
const setJSON = (key, value) => localStorage.setItem(key, JSON.stringify(value));

async function fetchJsonWithCache(url, cacheKey, fallback = []) {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    const data = await res.json();
    // cache
    setJSON(cacheKey, data);
    return Array.isArray(data) ? data : fallback;
  } catch {
    // fallback
    return getJSON(cacheKey, fallback);
  }
}

const dataClient = {
  async listCourses() {
    return fetchJsonWithCache("/data/courses.json", "sprout_courses", []);
  },
  async listUserProgress(userEmail) {
    // your Lesson.jsx uses "sprout_user_progress" (array of objects)
    const all = getJSON("sprout_user_progress", []);
    return all.filter((p) => p.user_email === userEmail);
  },
};

const categoryIcons = {
  Investing: TrendingUp,
  Saving: PiggyBank,
  "Credit & Debt": CreditCard,
  Insurance: Shield,
  "AI & ML": Brain,
  "Personal Finance": Briefcase,
  "Career Readiness": GraduationCap,
};

const categoryColors = {
  Investing: "from-green-400 to-emerald-500",
  Saving: "from-blue-400 to-cyan-500",
  "Credit & Debt": "from-purple-400 to-pink-500",
  Insurance: "from-orange-400 to-red-500",
  "AI & ML": "from-indigo-400 to-purple-500",
  "Personal Finance": "from-yellow-400 to-orange-500",
  "Career Readiness": "from-lime-400 to-green-500",
};

export default function Learn() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [user, setUser] = useState(null);

  React.useEffect(() => {
    const currentUser = getLocalUser();
    if (!currentUser) {
      navigate(createPageUrl("Login"));
      return;
    }
    setUser(currentUser);
  }, [navigate]);

  const { data: courses = [] } = useQuery({
    queryKey: ["courses_hybrid"],
    queryFn: () => dataClient.listCourses(),
  });

  const { data: userProgress = [] } = useQuery({
    queryKey: ["userProgress_hybrid", user?.email],
    queryFn: () => dataClient.listUserProgress(user?.email),
    enabled: !!user?.email,
  });

  const categories = useMemo(
    () => ["All", ...new Set(courses.map((c) => c.category).filter(Boolean))],
    [courses]
  );

  const filteredCourses = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return courses.filter((course) => {
      const name = (course.name || "").toLowerCase();
      const desc = (course.description || "").toLowerCase();
      const matchesSearch = name.includes(q) || desc.includes(q);
      const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [courses, searchQuery, selectedCategory]);

  const getCourseProgress = (courseId) => {
    const course = courses.find((c) => String(c.id) === String(courseId));
    if (!course) return 0;

    const completed = userProgress.filter(
      (p) => String(p.course_id) === String(courseId) && p.completed
    ).length;

    const denom = Number(course.lessons_count || 0) || 1;
    return (completed / denom) * 100;
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Explore Courses 📚
          </h1>
          <p className="text-gray-600">Master real-world skills that matter</p>
        </div>

        {/* Search */}
        <div className="relative max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-14 bg-white/80 backdrop-blur-sm border-gray-200 shadow-lg"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => {
            const Icon = categoryIcons[category] || Target;
            const isActive = selectedCategory === category;

            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-lime-400 to-green-500 text-white shadow-lg shadow-lime-200"
                    : "bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {category !== "All" && <Icon className="w-4 h-4" />}
                {category}
              </button>
            );
          })}
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const Icon = categoryIcons[course.category] || Target;
            const progress = getCourseProgress(course.id);
            const gradientClass = categoryColors[course.category] || "from-gray-400 to-gray-500";

            return (
              <Card
                key={course.id}
                className="border-none shadow-lg hover:shadow-2xl transition-all cursor-pointer group overflow-hidden bg-white/80 backdrop-blur-sm"
                onClick={() => navigate(createPageUrl(`CourseDetail?id=${course.id}`))}
              >
                <div
                  className={`h-40 bg-gradient-to-br ${gradientClass} flex items-center justify-center relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                  <Icon className="w-16 h-16 text-white/90 relative z-10" />
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-white/90 text-gray-900 backdrop-blur-sm">
                      {course.difficulty || "Beginner"}
                    </Badge>
                  </div>
                </div>

                <CardHeader>
                  <CardTitle className="text-xl group-hover:text-lime-600 transition-colors">
                    {course.name}
                  </CardTitle>
                  <p className="text-sm text-gray-600 line-clamp-2 mt-2">{course.description}</p>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Clock className="w-4 h-4" />
                      {course.lessons_count} lessons
                    </div>
                    <div className="flex items-center gap-1 text-lime-600 font-semibold">
                      <Zap className="w-4 h-4" />
                      {course.xp_reward} XP
                    </div>
                  </div>

                  {progress > 0 ? (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="text-lime-600 font-medium">{Math.round(progress)}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  ) : (
                    <Badge
                      variant="outline"
                      className="w-full justify-center py-2 border-lime-500 text-lime-600"
                    >
                      Start Learning
                    </Badge>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600">
              If you just added JSON, hard refresh + clear localStorage (I’ll walk you through next).
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
