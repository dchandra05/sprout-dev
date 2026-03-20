/** DSProgressBar — consistent progress track + fill */
import React from "react";
import { color, radius } from "@/lib/theme";

export default function DSProgressBar({ value = 0, height = 8, fillColor, style = {} }) {
  return (
    <div style={{ height, background: color.borderLight, borderRadius: radius.pill, overflow: "hidden", ...style }}>
      <div style={{
        height: "100%",
        width: `${Math.min(Math.max(value, 0), 100)}%`,
        background: fillColor || color.green,
        borderRadius: radius.pill,
        transition: "width 0.5s ease",
      }} />
    </div>
  );
}
