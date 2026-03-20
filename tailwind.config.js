// FILE: tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        /* shadcn semantic colors */
        background:  "hsl(var(--background))",
        foreground:  "hsl(var(--foreground))",
        card:        { DEFAULT: "hsl(var(--card))",        foreground: "hsl(var(--card-foreground))"        },
        primary:     { DEFAULT: "hsl(var(--primary))",     foreground: "hsl(var(--primary-foreground))"     },
        secondary:   { DEFAULT: "hsl(var(--secondary))",   foreground: "hsl(var(--secondary-foreground))"   },
        muted:       { DEFAULT: "hsl(var(--muted))",       foreground: "hsl(var(--muted-foreground))"       },
        accent:      { DEFAULT: "hsl(var(--accent))",      foreground: "hsl(var(--accent-foreground))"      },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        border:      "hsl(var(--border))",
        input:       "hsl(var(--input))",
        ring:        "hsl(var(--ring))",

        /* Sprout design-system tokens — usable as Tailwind classes */
        sprout: {
          green:       "#2a7a4b",
          "green-hover": "#1e5c37",
          "green-50":  "#f0faf4",
          "green-100": "#dcf0e6",
          "green-200": "#b6ddc8",
          navy:        "#1c2f3c",
          "navy-hover":"#152330",
          "navy-50":   "#f0f4f7",
          "navy-100":  "#c8dce6",
          "navy-muted":"#a8c4d4",
          page:        "#f8f9fa",
          surface:     "#ffffff",
          "surface-alt":"#f9fafb",
          border:      "#e5e7eb",
          "border-light":"#f3f4f6",
          "text-1":    "#111827",
          "text-2":    "#374151",
          "text-3":    "#6b7280",
          "text-muted":"#9ca3af",
        },
      },
      boxShadow: {
        "ds-xs": "0 1px 2px rgba(0,0,0,0.05)",
        "ds-sm": "0 1px 4px rgba(0,0,0,0.06)",
        "ds-md": "0 4px 16px rgba(0,0,0,0.08)",
        "ds-lg": "0 8px 28px rgba(0,0,0,0.10)",
      },
      fontSize: {
        "ds-display": ["40px", { fontWeight: "900", letterSpacing: "-1px", lineHeight: "1.1" }],
        "ds-h1":      ["32px", { fontWeight: "800", letterSpacing: "-0.4px", lineHeight: "1.2" }],
        "ds-h2":      ["24px", { fontWeight: "700", lineHeight: "1.3" }],
        "ds-h3":      ["18px", { fontWeight: "700", lineHeight: "1.4" }],
        "ds-body":    ["15px", { lineHeight: "1.65" }],
        "ds-sm":      ["13px", { lineHeight: "1.5" }],
        "ds-xs":      ["11px", { lineHeight: "1.4" }],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
