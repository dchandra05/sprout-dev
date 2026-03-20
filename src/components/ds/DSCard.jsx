/**
 * DSCard — Sprout Design System card
 *
 * Props:
 *   variant: "default" | "dark" | "dark-alt" | "green" | "ghost"
 *   hover:   boolean — adds lift-on-hover effect
 *   padding: number | string — inner padding (default 20)
 *   className, style, onClick, children
 */
import React from "react";
import { color, radius, shadow } from "@/lib/theme";

const VARIANTS = {
  default: {
    background: color.surface,
    border: `1px solid ${color.border}`,
    borderRadius: radius.lg,
    boxShadow: shadow.sm,
  },
  dark: {
    background: color.navy,
    border: "none",
    borderRadius: radius.xl,
    boxShadow: shadow.md,
  },
  "dark-alt": {
    background: color.navyAlt,
    border: "none",
    borderRadius: radius.xl,
    boxShadow: shadow.md,
  },
  green: {
    background: color.green50,
    border: `1px solid ${color.green200}`,
    borderRadius: radius.lg,
    boxShadow: shadow.xs,
  },
  ghost: {
    background: "transparent",
    border: `1px solid ${color.border}`,
    borderRadius: radius.lg,
  },
};

export default function DSCard({
  variant = "default",
  hover = false,
  padding = 20,
  className = "",
  style = {},
  onClick,
  children,
  ...rest
}) {
  const [hovered, setHovered] = React.useState(false);
  const v = VARIANTS[variant] || VARIANTS.default;

  const hoverStyle = hover && hovered ? {
    boxShadow: shadow.md,
    transform: "translateY(-2px)",
    borderColor: variant === "default" ? color.green200 : undefined,
  } : {};

  return (
    <div
      className={className}
      style={{
        ...v,
        padding,
        cursor: (hover || onClick) ? "pointer" : undefined,
        transition: hover ? "box-shadow 0.18s, transform 0.18s, border-color 0.18s" : undefined,
        overflow: "hidden",
        ...hoverStyle,
        ...style,
      }}
      onClick={onClick}
      onMouseEnter={() => hover && setHovered(true)}
      onMouseLeave={() => hover && setHovered(false)}
      {...rest}
    >
      {children}
    </div>
  );
}
