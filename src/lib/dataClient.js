// FILE: src/lib/dataClient.js
const safeParse = (raw, fallback) => {
  try {
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const getJSON = (key, fallback) => safeParse(localStorage.getItem(key), fallback);
const setJSON = (key, value) => localStorage.setItem(key, JSON.stringify(value));

const CACHE_PREFIX = "sprout_cache_";
const cacheKey = (name) => `${CACHE_PREFIX}${name}`;
const metaKey = (name) => `${CACHE_PREFIX}${name}_meta`;

async function fetchJSON(path) {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch ${path}: ${res.status}`);
  return res.json();
}

/**
 * Hybrid strategy:
 * - Source of truth: /public/data/*.json (today)
 * - Cache: localStorage (fast repeat loads, offline-ish)
 * - Later swap fetchJSON(...) with Supabase calls and keep same API.
 */
async function getCatalog(name, url, { forceRefresh = false } = {}) {
  const cached = getJSON(cacheKey(name), null);

  if (!forceRefresh && cached && Array.isArray(cached) && cached.length) {
    return cached;
  }

  const data = await fetchJSON(url);
  setJSON(cacheKey(name), data);
  setJSON(metaKey(name), { refreshed_at: new Date().toISOString() });
  return data;
}

/** ---------- PUBLIC API USED BY PAGES ---------- */
export const dataClient = {
  // Catalog tables
  listCourses: (opts) => getCatalog("courses", "/data/courses.json", opts),
  listLessons: (opts) => getCatalog("lessons", "/data/lessons.json", opts),
  listSchools: (opts) => getCatalog("schools", "/data/schools.json", opts),
  listBadges: (opts) => getCatalog("badges", "/data/badges.json", opts),
  listChallenges: (opts) => getCatalog("challenges", "/data/challenges.json", opts),

  // User tables (local for now)
  getLocalUser() {
    return getJSON("sprout_user", null);
  },
  setLocalUser(user) {
    setJSON("sprout_user", user);
  },

  listUserProgress({ user_email, course_id, lesson_id } = {}) {
    const all = getJSON("sprout_user_progress", []);
    return all.filter((p) => {
      if (user_email && p.user_email !== user_email) return false;
      if (course_id && String(p.course_id) !== String(course_id)) return false;
      if (lesson_id && String(p.lesson_id) !== String(lesson_id)) return false;
      return true;
    });
  },

  upsertUserProgress(record) {
    const all = getJSON("sprout_user_progress", []);
    const idx = all.findIndex((p) => p.id === record.id);
    if (idx >= 0) all[idx] = { ...all[idx], ...record };
    else all.push(record);
    setJSON("sprout_user_progress", all);
    return record;
  },
};
