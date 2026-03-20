/** DSEmptyState — consistent empty state within cards/sections */
import React from "react";
import { color } from "@/lib/theme";

export default function DSEmptyState({ icon: Icon, title, subtitle, action }) {
  return (
    <div style={{ textAlign: "center", padding: "48px 24px" }}>
      {Icon && (
        <div style={{ width: 52, height: 52, background: color.borderLight, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          <Icon size={22} color={color.textMuted} />
        </div>
      )}
      <p style={{ fontSize: 16, fontWeight: 700, color: color.text1, margin: "0 0 6px" }}>{title}</p>
      {subtitle && <p style={{ fontSize: 13, color: color.text3, margin: "0 0 20px" }}>{subtitle}</p>}
      {action}
    </div>
  );
}
