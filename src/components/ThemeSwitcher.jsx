import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const THEMES = [
  { path: "/", label: "Original", color: "#60a5fa" },
  { path: "/terminal", label: "Terminal", color: "#00ff88" },
  { path: "/bloomberg", label: "Bloomberg", color: "#fbbf24" },
  { path: "/neon", label: "Neon", color: "#818cf8" },
  { path: "/rates", label: "Rates", color: "#22c55e" },
];

export default function ThemeSwitcher() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const current = THEMES.find((t) => t.path === location.pathname) || THEMES[0];

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        zIndex: 99999,
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}
    >
      {open && (
        <div
          style={{
            position: "absolute",
            bottom: 48,
            right: 0,
            background: "rgba(15, 15, 20, 0.95)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 12,
            padding: "6px",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            minWidth: 140,
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          }}
        >
          {THEMES.map((t) => {
            const isActive = t.path === location.pathname;
            return (
              <button
                key={t.path}
                onClick={() => {
                  navigate(t.path);
                  setOpen(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 12px",
                  background: isActive ? "rgba(255,255,255,0.08)" : "transparent",
                  border: "none",
                  borderRadius: 8,
                  color: isActive ? "#fff" : "rgba(255,255,255,0.6)",
                  fontSize: "0.82rem",
                  fontWeight: isActive ? 600 : 400,
                  cursor: "pointer",
                  textAlign: "left",
                  width: "100%",
                  transition: "background 0.15s",
                  fontFamily: "inherit",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.target.style.background = "rgba(255,255,255,0.05)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.target.style.background = "transparent";
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: t.color,
                    flexShrink: 0,
                  }}
                />
                {t.label}
              </button>
            );
          })}
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "8px 14px",
          background: "rgba(15, 15, 20, 0.9)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 20,
          color: "rgba(255,255,255,0.7)",
          fontSize: "0.78rem",
          cursor: "pointer",
          boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
          transition: "all 0.2s",
          fontFamily: "inherit",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = current.color;
          e.currentTarget.style.color = "#fff";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
          e.currentTarget.style.color = "rgba(255,255,255,0.7)";
        }}
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: current.color,
          }}
        />
        Themes
        <span style={{ fontSize: "0.65rem", opacity: 0.5 }}>{open ? "▼" : "▲"}</span>
      </button>
    </div>
  );
}
