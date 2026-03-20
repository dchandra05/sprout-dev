/**
 * DSButton — Sprout Design System button
 *
 * Props:
 *   variant: "primary" | "dark" | "outline" | "ghost-white" | "white-on-dark" | "secondary"
 *   size:    "sm" | "md" | "lg"
 *   icon:    ReactNode (rendered before children)
 *   iconRight: ReactNode (rendered after children)
 *   className, style, onClick, disabled, type
 */
import React from "react";
import { color, radius, shadow } from "@/lib/theme";

const VARIANTS = {
  primary: {
    background: color.green,
    color: "#ffffff",
    border: "none",
    boxShadow: "0 2px 8px rgba(42,122,75,0.22)",
    "--hover-bg": color.greenHover,
  },
  secondary: {
    background: color.green50,
    color: color.green,
    border: `1.5px solid ${color.green200}`,
  },
  dark: {
    background: color.navy,
    color: "#ffffff",
    border: "none",
    "--hover-bg": color.navyHover,
  },
  outline: {
    background: "transparent",
    color: color.text2,
    border: `1.5px solid ${color.border}`,
  },
  "ghost-white": {
    background: "transparent",
    color: "#ffffff",
    border: "1.5px solid rgba(255,255,255,0.35)",
  },
  "white-on-dark": {
    background: "#ffffff",
    color: color.navy,
    border: "none",
    fontWeight: 700,
  },
};

const SIZES = {
  sm: { padding: "7px 16px",  fontSize: 12 },
  md: { padding: "10px 22px", fontSize: 13 },
  lg: { padding: "13px 28px", fontSize: 15 },
};

export default function DSButton({
  variant = "primary",
  size = "md",
  icon,
  iconRight,
  children,
  className = "",
  style = {},
  disabled,
  onClick,
  type = "button",
  ...rest
}) {
  const v = VARIANTS[variant] || VARIANTS.primary;
  const s = SIZES[size] || SIZES.md;

  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    fontWeight: 600,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.55 : 1,
    transition: "background 0.15s, box-shadow 0.15s, transform 0.1s",
    whiteSpace: "nowrap",
    lineHeight: 1,
    borderRadius: radius.pill,
    outline: "none",
    fontFamily: "inherit",
    ...v,
    ...s,
    ...style,
  };

  const [hovered, setHovered] = React.useState(false);
  const hoverStyle = hovered && !disabled ? {
    ...(variant === "primary"        ? { background: color.greenHover }  : {}),
    ...(variant === "dark"           ? { background: color.navyHover }   : {}),
    ...(variant === "secondary"      ? { background: color.green100 }    : {}),
    ...(variant === "outline"        ? { background: color.surfaceAlt, borderColor: color.text2 } : {}),
    ...(variant === "ghost-white"    ? { background: "rgba(255,255,255,0.12)" } : {}),
    ...(variant === "white-on-dark"  ? { background: "#f0faf4" }          : {}),
  } : {};

  return (
    <button
      type={type}
      disabled={disabled}
      className={className}
      style={{ ...base, ...hoverStyle }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      {...rest}
    >
      {icon && <span style={{ display: "flex", alignItems: "center" }}>{icon}</span>}
      {children}
      {iconRight && <span style={{ display: "flex", alignItems: "center" }}>{iconRight}</span>}
    </button>
  );
}
