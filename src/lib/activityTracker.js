// src/lib/activityTracker.js
//
// Writes tracking data to Supabase so the admin dashboard has real analytics.
// Uses both user_id (for profiles/user_lesson_progress) and user_email
// (for the legacy user_activity_events + ai_course_day_progress tables).
//
// HOW TO USE:
//   trackLogin()                        — call after Supabase signIn succeeds
//   upsertLessonProgress({...})         — call when an AIDay is completed
//   touchLastSeen()                     — call on every route change (throttled)
//   trackLessonStart(courseSlug, day)   — optional: call when a day opens

import { supabase } from "@/lib/supabaseClient";

// ── Internal helpers ─────────────────────────────────────────

async function getAuthUser() {
  const { data } = await supabase.auth.getUser();
  return data?.user ?? null;
}

async function insertActivityEvent(user, eventType, extras = {}) {
  if (!user?.email) return;
  const { error } = await supabase.from("user_activity_events").insert({
    user_id:    user.id   ?? null,
    user_email: user.email,
    event_type: eventType,
    event_data: extras,
    course_id:  extras.course_id ?? null,
    day_number: extras.day_number ?? null,
    metadata:   extras.metadata ?? null,
  });
  if (error) console.warn("[tracker] insertActivityEvent:", error.message);
}

async function resolveCourseId(courseSlug) {
  const { data, error } = await supabase
    .from("courses")
    .select("id, total_days")
    .eq("slug", courseSlug)
    .maybeSingle();
  if (error) console.warn("[tracker] resolveCourseId:", error.message);
  return data ?? null;
}

// ── touchLastSeen (throttled) ────────────────────────────────

let _lastSeenTs = 0;

export async function touchLastSeen() {
  const now = Date.now();
  if (now - _lastSeenTs < 60_000) return; // at most once per minute
  _lastSeenTs = now;

  const user = await getAuthUser();
  if (!user) return;

  const { error } = await supabase
    .from("profiles")
    .update({ last_seen_at: new Date().toISOString() })
    .eq("id", user.id);

  if (error) console.warn("[tracker] touchLastSeen:", error.message);
}

// ── upsertProfile ────────────────────────────────────────────
// Ensures a profiles row exists with correct name/email.

export async function upsertProfile() {
  const user = await getAuthUser();
  if (!user) return;

  const { error } = await supabase.from("profiles").upsert(
    {
      id:           user.id,
      email:        user.email,
      full_name:    user.user_metadata?.full_name ?? user.email.split("@")[0],
      last_seen_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  );
  if (error) console.warn("[tracker] upsertProfile:", error.message);
}

// ── trackLogin ───────────────────────────────────────────────

export async function trackLogin() {
  await upsertProfile();
  const user = await getAuthUser();
  await insertActivityEvent(user, "login");
  await touchLastSeen();
}

// ── upsertLessonProgress ─────────────────────────────────────
// The main call to make when a day/lesson is completed.
// Also writes to the legacy ai_course_day_progress so existing
// admin views keep working during the transition.

export async function upsertLessonProgress({
  courseSlug,
  dayNumber,
  quizScore = null,
  xpEarned = 0,
  totalDays = 10,
  lessonType = null,
}) {
  const user = await getAuthUser();
  if (!user) return;

  const now = new Date().toISOString();

  // Always write the activity event first so the admin feed is populated
  // even if the course slug can't be resolved below.
  await insertActivityEvent(user, "lesson_completed", {
    course_slug: courseSlug,
    day_number:  dayNumber,
    metadata:    { quiz_score: quizScore, xp_earned: xpEarned },
  });

  // 1. Resolve course row
  const courseRow = await resolveCourseId(courseSlug);
  if (!courseRow) {
    console.warn("[tracker] upsertLessonProgress: course not found:", courseSlug);
    return;
  }

  const courseId = courseRow.id;
  const totalD   = courseRow.total_days ?? totalDays;

  // 2. Upsert user_lesson_progress (new schema)
  const { error: ulpErr } = await supabase
    .from("user_lesson_progress")
    .upsert(
      {
        user_id:      user.id,
        course_id:    courseId,
        day_number:   dayNumber,
        status:       "completed",
        quiz_score:   quizScore,
        xp_earned:    xpEarned,
        lesson_type:  lessonType,
        completed_at: now,
        updated_at:   now,
      },
      { onConflict: "user_id,course_id,day_number" }
    );
  if (ulpErr) console.warn("[tracker] ulp upsert:", ulpErr.message);

  // 3. Recount to update user_course_progress
  const { data: completedRows } = await supabase
    .from("user_lesson_progress")
    .select("day_number")
    .eq("user_id",   user.id)
    .eq("course_id", courseId)
    .eq("status",    "completed");

  const completedCount = completedRows?.length ?? 0;
  const pct = Math.min(100, Math.round((completedCount / totalD) * 100));

  const { error: ucpErr } = await supabase
    .from("user_course_progress")
    .upsert(
      {
        user_id:            user.id,
        course_id:          courseId,
        completed_days:     completedCount,
        percent_complete:   pct,
        last_day_completed: dayNumber,
        total_xp:           xpEarned,
        enrolled_at:        now,
        updated_at:         now,
      },
      { onConflict: "user_id,course_id" }
    );
  if (ucpErr) console.warn("[tracker] ucp upsert:", ucpErr.message);

  // 4. Also write legacy ai_course_day_progress (keeps old admin queries working)
  if (courseSlug === "ai-literacy") {
    const { error: legacyErr } = await supabase
      .from("ai_course_day_progress")
      .upsert(
        {
          user_email:         user.email,
          day_number:         dayNumber,
          completed:          true,
          completed_date:     now,
          activity_completed: true,
          quiz_score:         quizScore,
          updated_at:         now,
        },
        { onConflict: "user_email,day_number" }
      );
    if (legacyErr) console.warn("[tracker] legacy upsert:", legacyErr.message);
  }

  // Activity event already written above (before course resolution) so
  // the admin feed is populated even when the slug lookup fails.
}

// ── trackLessonStart ─────────────────────────────────────────
// Optional: call when a day page opens to track in-progress state.

export async function trackLessonStart(courseSlug, dayNumber) {
  const user = await getAuthUser();
  if (!user) return;

  const courseRow = await resolveCourseId(courseSlug);
  if (!courseRow) return;

  const courseId = courseRow.id;

  await supabase
    .from("user_lesson_progress")
    .upsert(
      {
        user_id:    user.id,
        course_id:  courseId,
        day_number: dayNumber,
        status:     "in_progress",
        updated_at: new Date().toISOString(),
      },
      {
        onConflict:       "user_id,course_id,day_number",
        ignoreDuplicates: true, // don't overwrite a completed row
      }
    );

  // Ensure enrolled
  await supabase
    .from("user_course_progress")
    .upsert(
      {
        user_id:    user.id,
        course_id:  courseId,
        enrolled_at: new Date().toISOString(),
        updated_at:  new Date().toISOString(),
      },
      { onConflict: "user_id,course_id", ignoreDuplicates: true }
    );

  await insertActivityEvent(user, "lesson_started", {
    course_id:  courseId,
    day_number: dayNumber,
  });
}

// ── trackLessonComplete ───────────────────────────────────────
// Call when any lesson, quiz, or exam is completed.
//
// Usage:
//   trackLessonComplete("budgeting-fundamentals", 1)
//   trackLessonComplete("budgeting-fundamentals", 3, 87)
//   trackLessonComplete("investing-fundamentals", 5, 92, "quiz")
//   trackLessonComplete("ai-literacy",           10, 95, "exam")
//
export async function trackLessonComplete(courseSlug, dayNumber, quizScore = null, lessonType = null) {
  await upsertLessonProgress({ courseSlug, dayNumber, quizScore, lessonType });
}

// ── Generic event tracker ─────────────────────────────────────
// Use when you don't have a Supabase course UUID / slug —
// always writes to user_activity_events, never throws.

export async function trackEvent(eventType, metadata = {}) {
  const user = await getAuthUser();
  if (!user) return;
  await insertActivityEvent(user, eventType, metadata);
}

// ── Simulations ───────────────────────────────────────────────

/**
 * Call when a user opens / starts a simulation.
 * @param {string} simulationSlug  e.g. "paper-trading"
 * @param {string} simulationName  e.g. "Paper Trading"
 */
export async function trackSimulationStart(simulationSlug, simulationName) {
  const user = await getAuthUser();
  if (!user) return;
  await insertActivityEvent(user, "simulation_start", {
    simulation_slug: simulationSlug,
    simulation_name: simulationName,
  });
}

/**
 * Call when a user finishes / submits a simulation.
 * @param {string} simulationSlug  e.g. "paper-trading"
 * @param {string} simulationName  e.g. "Paper Trading"
 * @param {object} metadata        Sim-specific results (final_balance, roi, etc.)
 */
export async function trackSimulationComplete(simulationSlug, simulationName, metadata = {}) {
  const user = await getAuthUser();
  if (!user) return;
  await insertActivityEvent(user, "simulation_complete", {
    simulation_slug: simulationSlug,
    simulation_name: simulationName,
    ...metadata,
  });
}

/**
 * Generic page view event — useful for funnel analysis.
 * @param {string} pageName
 */
export async function trackPageView(pageName) {
  const user = await getAuthUser();
  if (!user) return;
  await insertActivityEvent(user, "page_view", { page: pageName });
}