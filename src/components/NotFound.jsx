import { useNavigate } from "react-router-dom";
import { REFERRAL_LINK } from "../config.js";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0e1a",
        color: "#e8ecf4",
        fontFamily: "'DM Sans', system-ui, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: "6rem",
          fontWeight: 800,
          color: "#60a5fa",
          lineHeight: 1,
          marginBottom: 16,
          fontFamily: "'DM Mono', monospace",
        }}
      >
        404
      </div>
      <h1
        style={{
          fontSize: "1.4rem",
          fontWeight: 700,
          marginBottom: 12,
        }}
      >
        Page not found
      </h1>
      <p
        style={{
          fontSize: "0.95rem",
          color: "#94a3b8",
          maxWidth: 400,
          lineHeight: 1.6,
          marginBottom: 32,
        }}
      >
        This route doesn't exist. Head back to the homepage or start trading on Variational.
      </p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "12px 28px",
            background: "#60a5fa",
            color: "#0a0e1a",
            fontFamily: "inherit",
            fontWeight: 700,
            fontSize: "0.9rem",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
          }}
        >
          Go Home
        </button>
        <a
          href={REFERRAL_LINK}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: "12px 28px",
            background: "transparent",
            color: "#60a5fa",
            fontFamily: "inherit",
            fontWeight: 600,
            fontSize: "0.9rem",
            borderRadius: 8,
            border: "1px solid #60a5fa55",
            textDecoration: "none",
            cursor: "pointer",
          }}
        >
          Start Trading →
        </a>
      </div>
    </div>
  );
}
