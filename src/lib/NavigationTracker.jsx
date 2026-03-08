// src/lib/NavigationTracker.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { isIframe } from "@/lib/utils";
import { touchLastSeen } from "@/lib/activityTracker";

export default function NavigationTracker() {
  const location = useLocation();

  useEffect(() => {
    // Keep existing iframe messaging
    if (isIframe) {
      window.parent?.postMessage(
        { type: "app_changed_url", url: window.location.href },
        "*"
      );
    }

    // Update last_seen_at on every navigation (throttled to once/min inside touchLastSeen)
    touchLastSeen().catch(() => {});
  }, [location]);

  return null;
}