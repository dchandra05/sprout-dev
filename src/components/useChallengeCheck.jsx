import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useQueryClient } from "@tanstack/react-query";

export function useChallengeCheck(user) {
  const [completedChallenge, setCompletedChallenge] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user?.id) return;

    const todayISO = new Date().toISOString().split("T")[0];

    const checkChallenges = async () => {
      try {
        const [
          { data: challenges, error: chErr },
          { data: userChallenges, error: ucErr },
          { data: userProgress, error: upErr },
          { data: dailyActivity, error: daErr },
        ] = await Promise.all([
          supabase.from("challenges").select("*"),
          supabase.from("user_challenges").select("*").eq("user_id", user.id),
          supabase.from("user_progress").select("*").eq("user_id", user.id),
          supabase.from("daily_activity").select("*").eq("user_id", user.id),
        ]);

        if (chErr) throw chErr;
        if (ucErr) throw ucErr;
        if (upErr) throw upErr;
        if (daErr) throw daErr;

        const todayActivity = (dailyActivity || []).find((a) => a.date === todayISO);

        for (const challenge of challenges || []) {
          const existingUserChallenge = (userChallenges || []).find((uc) => {
            if (challenge.challenge_type === "daily") {
              return uc.challenge_id === challenge.id && uc.date === todayISO;
            }
            return uc.challenge_id === challenge.id;
          });

          if (existingUserChallenge?.completed) continue;

          let progress = 0;
          let completed = false;

          switch (challenge.requirement) {
            case "complete_lesson":
              progress =
                challenge.challenge_type === "daily"
                  ? todayActivity?.lessons_completed || 0
                  : user.total_lessons_completed || 0;
              completed = progress >= challenge.requirement_value;
              break;

            case "earn_xp":
              progress =
                challenge.challenge_type === "daily"
                  ? todayActivity?.xp_earned || 0
                  : user.xp_points || 0;
              completed = progress >= challenge.requirement_value;
              break;

            case "complete_quiz":
              if (challenge.challenge_type === "daily") {
                const quizCount = (userProgress || []).filter(
                  (p) => p.completed && p.quiz_score !== null && p.completed_date?.startsWith(todayISO)
                ).length;
                progress = quizCount;
              } else {
                progress = (userProgress || []).filter((p) => p.completed && p.quiz_score !== null).length;
              }
              completed = progress >= challenge.requirement_value;
              break;

            case "login_streak":
              progress = user.current_streak || 0;
              completed = progress >= challenge.requirement_value;
              break;

            case "complete_course":
              progress = user.total_courses_completed || 0;
              completed = progress >= challenge.requirement_value;
              break;

            default:
              continue;
          }

          const existingProgress = existingUserChallenge?.progress || 0;
          const shouldUpdate =
            progress !== existingProgress || (completed && !existingUserChallenge?.completed);

          if (!shouldUpdate) continue;

          if (existingUserChallenge) {
            const { error: updateErr } = await supabase
              .from("user_challenges")
              .update({
                progress,
                completed,
                completed_date: completed ? new Date().toISOString() : null,
              })
              .eq("id", existingUserChallenge.id);

            if (updateErr) throw updateErr;
          } else {
            const { error: insertErr } = await supabase.from("user_challenges").insert({
              user_id: user.id,
              challenge_id: challenge.id,
              progress,
              completed,
              completed_date: completed ? new Date().toISOString() : null,
              date: challenge.challenge_type === "daily" ? todayISO : null,
            });

            if (insertErr) throw insertErr;
          }

          if (completed && !existingUserChallenge?.completed) {
            const newXP = (user.xp_points || 0) + (challenge.xp_reward || 0);
            const newLevel = Math.floor(newXP / 100) + 1;

            const { error: profileErr } = await supabase
              .from("profiles")
              .update({
                xp_points: newXP,
                level: newLevel,
              })
              .eq("id", user.id);

            if (profileErr) throw profileErr;

            setCompletedChallenge(challenge);

            queryClient.invalidateQueries({ queryKey: ["userChallenges"] });
            queryClient.invalidateQueries({ queryKey: ["user"] });
            queryClient.invalidateQueries({ queryKey: ["profile"] });
          }
        }
      } catch (error) {
        console.error("Challenge check error:", error);
      }
    };

    checkChallenges();
  }, [user, queryClient]);

  return {
    completedChallenge,
    clearCompletedChallenge: () => setCompletedChallenge(null),
  };
}
