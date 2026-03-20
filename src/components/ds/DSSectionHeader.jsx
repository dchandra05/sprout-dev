/** DSSectionHeader — consistent section title + optional subtitle */
import React from "react";
import { color } from "@/lib/theme";

export default function DSSectionHeader({ label, title, subtitle, align = "left", style = {} }) {
  return (
    <div style={{ marginBottom: 20, textAlign: align, ...style }}>
      {label && (
        <p style={{ fontSize: 11, fontWeight: 700, color: color.green, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 6px" }}>
          {label}
        </p>
      )}
      <h2 style={{ fontSize: 22, fontWeight: 800, color: color.text1, margin: "0 0 4px", letterSpacing: "-0.3px" }}>
        {title}
      </h2>
      {subtitle && (
        <p style={{ fontSize: 14, color: color.text3, margin: 0, lineHeight: 1.6 }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
