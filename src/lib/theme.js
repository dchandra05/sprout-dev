/**
 * Sprout Design System — theme.js
 * Single source of truth for JS-side design tokens.
 * Use these in inline styles and component logic.
 * CSS counterparts live in index.css (:root).
 */

export const color = {
  /* Primary green */
  green:       "#2a7a4b",
  greenHover:  "#1e5c37",
  green50:     "#f0faf4",
  green100:    "#dcf0e6",
  green200:    "#b6ddc8",

  /* Accent navy (hero surfaces, logo, dark cards) */
  navy:        "#1c2f3c",
  navyHover:   "#152330",
  navy50:      "#f0f4f7",
  navy100:     "#c8dce6",
  navyMuted:   "#a8c4d4",
  navyAlt:     "#243b4c",   /* slightly lighter dark card */

  /* Backgrounds */
  page:        "#f8f9fa",   /* subtle page bg */
  surface:     "#ffffff",   /* card / panel bg */
  surfaceAlt:  "#f9fafb",

  /* Borders */
  border:      "#e5e7eb",
  borderLight: "#f3f4f6",

  /* Text */
  text1:       "#111827",   /* headings */
  text2:       "#374151",   /* body */
  text3:       "#6b7280",   /* secondary */
  textMuted:   "#9ca3af",   /* placeholders */

  /* Status */
  success:     "#16a34a",
  warning:     "#d97706",
  error:       "#ef4444",
  info:        "#2563eb",

  /* Pastel stat card backgrounds */
  statOrange:  "#fef3ec",
  statBlue:    "#eff6ff",
  statGreen:   "#f0faf4",
  statPurple:  "#faf5ff",

  /* Pastel stat icon colors */
  iconOrange:  "#ea6c2e",
  iconBlue:    "#2563eb",
  iconGreen:   "#2a7a4b",
  iconPurple:  "#9333ea",
};

export const radius = {
  sm:   "8px",
  md:   "12px",
  lg:   "16px",
  xl:   "20px",
  pill: "999px",
};

export const shadow = {
  xs: "0 1px 2px rgba(0,0,0,0.05)",
  sm: "0 1px 4px rgba(0,0,0,0.06)",
  md: "0 4px 16px rgba(0,0,0,0.08)",
  lg: "0 8px 28px rgba(0,0,0,0.10)",
};

export const font = {
  display: { fontSize: 40, fontWeight: 900, letterSpacing: "-1px", lineHeight: 1.1 },
  h1:      { fontSize: 32, fontWeight: 800, letterSpacing: "-0.4px", lineHeight: 1.2 },
  h2:      { fontSize: 24, fontWeight: 700, lineHeight: 1.3 },
  h3:      { fontSize: 18, fontWeight: 700, lineHeight: 1.4 },
  h4:      { fontSize: 16, fontWeight: 600, lineHeight: 1.4 },
  body:    { fontSize: 15, lineHeight: 1.65 },
  sm:      { fontSize: 13, lineHeight: 1.5 },
  xs:      { fontSize: 11, lineHeight: 1.4 },
  caption: { fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em" },
};

export const spacing = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
  "2xl": 48,
  "3xl": 64,
};

/* ── Shared inline-style recipes ─────────────────────────────
   Use these objects via spread in JSX:
   <div style={{ ...styles.card, padding: 20 }}>
─────────────────────────────────────────────────────────────── */
export const styles = {
  card: {
    background: color.surface,
    border: `1px solid ${color.border}`,
    borderRadius: radius.lg,
    boxShadow: shadow.sm,
  },
  cardDark: {
    background: color.navy,
    border: "none",
    borderRadius: radius.xl,
  },
  cardGreen: {
    background: color.green50,
    border: `1px solid ${color.green200}`,
    borderRadius: radius.lg,
    boxShadow: shadow.xs,
  },
  btnPrimary: {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    gap: 6, background: color.green, color: "#ffffff",
    fontWeight: 600, fontSize: 13, padding: "10px 22px",
    borderRadius: radius.pill, border: "none", cursor: "pointer",
    boxShadow: "0 2px 8px rgba(42,122,75,0.22)",
    transition: "background 0.15s",
  },
  btnPrimaryLg: {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    gap: 8, background: color.green, color: "#ffffff",
    fontWeight: 700, fontSize: 15, padding: "13px 28px",
    borderRadius: radius.pill, border: "none", cursor: "pointer",
    boxShadow: "0 2px 8px rgba(42,122,75,0.22)",
    transition: "background 0.15s",
  },
  btnDark: {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    gap: 6, background: color.navy, color: "#ffffff",
    fontWeight: 600, fontSize: 13, padding: "10px 22px",
    borderRadius: radius.pill, border: "none", cursor: "pointer",
    transition: "background 0.15s",
  },
  btnOutline: {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    gap: 6, background: "transparent", color: color.text2,
    fontWeight: 600, fontSize: 13, padding: "10px 22px",
    borderRadius: radius.pill, border: `1.5px solid ${color.border}`, cursor: "pointer",
    transition: "all 0.15s",
  },
  btnGhostWhite: {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    gap: 8, background: "transparent", color: "#ffffff",
    fontWeight: 600, fontSize: 14, padding: "11px 22px",
    borderRadius: radius.pill, border: "1.5px solid rgba(255,255,255,0.35)", cursor: "pointer",
    transition: "background 0.15s",
  },
  btnWhiteOnDark: {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    gap: 8, background: "#ffffff", color: color.navy,
    fontWeight: 700, fontSize: 14, padding: "11px 22px",
    borderRadius: radius.pill, border: "none", cursor: "pointer",
    transition: "background 0.15s",
  },
  pageWrapper: {
    minHeight: "100vh",
    background: color.page,
  },
  pageInner: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "32px 24px 80px",
  },
  sectionLabel: {
    fontSize: 11, fontWeight: 700, color: color.green,
    textTransform: "uppercase", letterSpacing: "0.1em",
    marginBottom: 10,
  },
  progressTrack: {
    height: 8, background: color.borderLight,
    borderRadius: radius.pill, overflow: "hidden",
  },
  progressFill: (pct) => ({
    height: "100%", width: `${pct}%`, background: color.green,
    borderRadius: radius.pill, transition: "width 0.5s ease",
  }),
};

export default { color, radius, shadow, font, spacing, styles };
