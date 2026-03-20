/** DSStatCard — consistent stat display used across Dashboard, Progress, etc. */
import React from "react";
import { color, radius, shadow } from "@/lib/theme";

export default function DSStatCard({ icon: Icon, value, label, sub, accentColor, bgColor }) {
  return (
    <div style={{
      background: bgColor || "#ffffff",
      border: `1px solid ${color.border}`,
      borderRadius: radius.lg,
      padding: "18px 18px 16px",
      boxShadow: shadow.xs,
      display: "flex", flexDirection: "column", gap: 5,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 2 }}>
        {Icon && <Icon size={15} color={accentColor || color.green} />}
        <span style={{ fontSize: 11, fontWeight: 700, color: accentColor || color.green, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          {label}
        </span>
      </div>
      <span style={{ fontSize: 30, fontWeight: 800, color: color.text1, lineHeight: 1 }}>{value}</span>
      {sub && <span style={{ fontSize: 12, color: color.text3 }}>{sub}</span>}
    </div>
  );
}
