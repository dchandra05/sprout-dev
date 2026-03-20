/** DSBadge — variant: "green" | "navy" | "gray" | "orange" | "purple" */
import React from "react";
import { color, radius } from "@/lib/theme";

const VARIANTS = {
  green:  { background: color.green50,  color: color.green,  border: `1px solid ${color.green200}` },
  navy:   { background: color.navy50,   color: color.navy,   border: `1px solid ${color.navy100}` },
  gray:   { background: "#f3f4f6",      color: "#6b7280",    border: "1px solid #e5e7eb" },
  orange: { background: "#fff7ed",      color: "#c2410c",    border: "1px solid #fed7aa" },
  purple: { background: "#faf5ff",      color: "#7c3aed",    border: "1px solid #ddd6fe" },
};

export default function DSBadge({ variant = "gray", children, style = {}, className = "" }) {
  const v = VARIANTS[variant] || VARIANTS.gray;
  return (
    <span
      className={className}
      style={{
        display: "inline-flex", alignItems: "center", gap: 4,
        padding: "3px 10px", borderRadius: radius.pill,
        fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em",
        ...v, ...style,
      }}
    >
      {children}
    </span>
  );
}
