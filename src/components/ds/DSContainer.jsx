/** DSContainer — consistent max-width page wrapper */
import React from "react";

export default function DSContainer({ children, maxWidth = 1200, padding = "32px 24px 80px", style = {} }) {
  return (
    <div style={{ maxWidth, margin: "0 auto", padding, ...style }}>
      {children}
    </div>
  );
}
