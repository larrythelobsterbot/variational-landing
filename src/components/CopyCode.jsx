import { useState, useCallback } from "react";

/**
 * Click-to-copy referral code with toast feedback.
 * Accepts theme tokens to style itself contextually.
 */
export default function CopyCode({ code, theme, fonts, style = {} }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [code]);

  return (
    <div style={{ position: "relative", display: "inline-block", ...style }}>
      <button
        onClick={handleCopy}
        style={{
          fontFamily: fonts?.mono || fonts?.heading || "monospace",
          fontSize: "clamp(1rem, 2.5vw, 1.3rem)",
          fontWeight: 700,
          color: theme.accent,
          background: `${theme.accent}12`,
          border: `1px solid ${theme.accent}33`,
          borderRadius: 8,
          padding: "14px 24px",
          textAlign: "center",
          letterSpacing: "0.08em",
          cursor: "pointer",
          transition: "all 0.2s",
          display: "flex",
          alignItems: "center",
          gap: 10,
          width: "100%",
          justifyContent: "center",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = `${theme.accent}22`;
          e.currentTarget.style.borderColor = `${theme.accent}66`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = `${theme.accent}12`;
          e.currentTarget.style.borderColor = `${theme.accent}33`;
        }}
        title="Click to copy"
      >
        {code}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke={theme.accent}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ flexShrink: 0, opacity: 0.7 }}
        >
          {copied ? (
            <polyline points="20 6 9 17 4 12" />
          ) : (
            <>
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </>
          )}
        </svg>
      </button>

      {/* Toast */}
      <div
        style={{
          position: "absolute",
          top: -36,
          left: "50%",
          transform: `translateX(-50%) translateY(${copied ? "0" : "8px"})`,
          opacity: copied ? 1 : 0,
          background: theme.accent,
          color: theme.bg || "#000",
          fontFamily: fonts?.body || "system-ui",
          fontSize: "0.75rem",
          fontWeight: 600,
          padding: "4px 12px",
          borderRadius: 6,
          whiteSpace: "nowrap",
          pointerEvents: "none",
          transition: "all 0.2s ease",
          zIndex: 10,
        }}
      >
        Copied!
      </div>
    </div>
  );
}
