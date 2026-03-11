import { useEffect } from "react";
import ComparisonTable from "../../components/ComparisonTable.jsx";
import AirdropCalculator from "../../components/AirdropCalculator.jsx";
import Footer from "../../components/Footer.jsx";
import {
  REFERRAL_LINK,
  REFERRAL_CODE,
  MARKET_DATA,
  getWeeksRemaining,
} from "../../config.js";

const THEME = {
  bg: "#0a0e1a",
  text: "#e8ecf4",
  accent: "#60a5fa",
  secondary: "#3b82f6",
  muted: "#94a3b8",
  winHighlight: "#60a5fa",
};

const FONTS = {
  heading: "'DM Sans', sans-serif",
  body: "'DM Sans', sans-serif",
  mono: "'DM Mono', monospace",
};

const LABEL_FONT = "'Space Mono', monospace";

/* ---------- reusable style helpers ---------- */

const section = {
  maxWidth: 1100,
  margin: "0 auto",
  padding: "80px 24px",
};

const sectionLabel = {
  fontFamily: LABEL_FONT,
  fontSize: "clamp(0.7rem, 1.2vw, 0.82rem)",
  color: THEME.muted,
  letterSpacing: "0.04em",
  marginBottom: 16,
};

const sectionHeading = {
  fontFamily: FONTS.heading,
  fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
  fontWeight: 700,
  color: THEME.text,
  lineHeight: 1.2,
  marginBottom: 16,
};

const primaryBtn = {
  display: "inline-block",
  padding: "14px 32px",
  background: THEME.accent,
  color: THEME.bg,
  fontFamily: FONTS.heading,
  fontWeight: 700,
  fontSize: "1rem",
  borderRadius: 10,
  border: "none",
  cursor: "pointer",
  textDecoration: "none",
  transition: "transform 0.2s, box-shadow 0.2s",
};

const secondaryBtn = {
  display: "inline-block",
  padding: "14px 32px",
  background: "transparent",
  color: THEME.accent,
  fontFamily: FONTS.heading,
  fontWeight: 600,
  fontSize: "1rem",
  borderRadius: 10,
  border: `1px solid ${THEME.accent}55`,
  cursor: "pointer",
  textDecoration: "none",
  transition: "border-color 0.2s, background 0.2s",
};

const cardBase = {
  padding: "28px 24px",
  borderRadius: 12,
  border: `1px solid ${THEME.muted}22`,
  background: `${THEME.bg}ee`,
  transition: "transform 0.25s, border-color 0.25s, box-shadow 0.25s",
  textDecoration: "none",
  color: THEME.text,
  display: "block",
};

/* ---------- Tier data ---------- */

const TIERS = [
  { tier: "Iron", volume: "$0", boost: "1x", refund: "Standard", referral: "10%" },
  { tier: "Bronze", volume: "$100K", boost: "1.2x", refund: "Elevated", referral: "12%" },
  { tier: "Silver", volume: "$500K", boost: "1.5x", refund: "Higher", referral: "15%" },
  { tier: "Gold", volume: "$2.5M", boost: "2x", refund: "High", referral: "18%" },
  { tier: "Platinum", volume: "$10M", boost: "2.5x", refund: "Very High", referral: "20%" },
  { tier: "Diamond", volume: "$50M", boost: "3x", refund: "Maximum", referral: "22%" },
  { tier: "Master", volume: "$250M", boost: "4x", refund: "Maximum", referral: "25%" },
  { tier: "Grandmaster", volume: "$1B", boost: "5x", refund: "Maximum", referral: "27%" },
  { tier: "Infinity", volume: "$2.5B", boost: "8x", refund: "Maximum", referral: "30%" },
];

/* ---------- Feature card data ---------- */

const FEATURES = [
  {
    title: "Private Execution",
    desc: "Every trade is executed through a private RFQ engine. No one sees your orders.",
  },
  {
    title: "Zero Slippage",
    desc: "Block trades at deterministic prices. No sweeping the order book.",
  },
  {
    title: "Zero Trading Fees",
    desc: "0.00% trading fees, permanently. Not a promo \u2014 it\u2019s the protocol.",
  },
  {
    title: "Loss Refund Protocol",
    desc: "Unique program that refunds trading losses. $4M+ refunded to date.",
  },
];

/* ---------- Steps data ---------- */

const STEPS = [
  {
    step: 1,
    title: "Bridge to Arbitrum",
    desc: "Use the official bridge or a third-party bridge to move funds to Arbitrum.",
  },
  {
    step: 2,
    title: "Connect & Use Access Code",
    showCode: true,
  },
  {
    step: 3,
    title: "Trade & Accumulate Points",
    desc: "Trade any of 500+ markets. Earn points toward the $VAR airdrop.",
  },
];

/* ---------- Stats data ---------- */

const STATS = [
  { value: MARKET_DATA.variational.cumulativeVolume, label: "Cumulative Volume" },
  { value: MARKET_DATA.variational.openInterest, label: "Open Interest" },
  { value: MARKET_DATA.variational.markets, label: "Markets" },
  { value: MARKET_DATA.variational.refunded, label: "Losses Refunded" },
];

/* ---------- Component ---------- */

export default function OriginalTheme() {
  useEffect(() => {
    if (!document.getElementById("var-original-fonts")) {
      const link = document.createElement("link");
      link.id = "var-original-fonts";
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap";
      document.head.appendChild(link);
    }
  }, []);

  const weeksLeft = getWeeksRemaining();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: THEME.bg,
        color: THEME.text,
        fontFamily: FONTS.body,
        backgroundImage: `
          linear-gradient(${THEME.muted}08 1px, transparent 1px),
          linear-gradient(90deg, ${THEME.muted}08 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
        overflowX: "hidden",
      }}
    >
      {/* ===== HERO ===== */}
      <section style={{ ...section, paddingTop: 100, paddingBottom: 60 }}>
        <div style={sectionLabel}>// Peer-to-peer derivatives protocol</div>

        <h1
          style={{
            ...sectionHeading,
            fontSize: "clamp(2rem, 5vw, 3.2rem)",
            maxWidth: 800,
            marginBottom: 24,
          }}
        >
          Trade 500+ perpetual markets.{" "}
          <span style={{ color: THEME.accent }}>Zero fees.</span> Zero slippage.
          Total privacy.
        </h1>

        <p
          style={{
            fontSize: "clamp(1rem, 2vw, 1.15rem)",
            color: `${THEME.text}bb`,
            lineHeight: 1.7,
            maxWidth: 620,
            marginBottom: 36,
          }}
        >
          Variational is a peer-to-peer derivatives protocol on Arbitrum. Trades
          execute through a private RFQ engine with deterministic pricing, zero
          fees, and zero slippage. No order book. No front-running.
        </p>

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <a
            href={REFERRAL_LINK}
            target="_blank"
            rel="noopener noreferrer"
            style={primaryBtn}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = `0 8px 32px ${THEME.accent}40`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Start Trading on Variational
          </a>
          <a
            href="#calculator"
            style={secondaryBtn}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = THEME.accent;
              e.currentTarget.style.background = `${THEME.accent}11`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = `${THEME.accent}55`;
              e.currentTarget.style.background = "transparent";
            }}
          >
            Airdrop Calculator ↓
          </a>
        </div>

        {/* Stats bar */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 24,
            marginTop: 64,
            padding: "28px 0",
            borderTop: `1px solid ${THEME.muted}22`,
            borderBottom: `1px solid ${THEME.muted}22`,
          }}
        >
          {STATS.map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: "clamp(1.4rem, 3vw, 1.8rem)",
                  fontWeight: 700,
                  color: THEME.accent,
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontFamily: LABEL_FONT,
                  fontSize: "0.72rem",
                  color: THEME.muted,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginTop: 6,
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== WHY VARIATIONAL ===== */}
      <section style={section}>
        <div style={sectionLabel}>// Why Variational</div>
        <h2 style={{ ...sectionHeading, marginBottom: 40 }}>
          Built different from every other perp DEX
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 20,
          }}
        >
          {FEATURES.map((f) => (
            <a
              key={f.title}
              href={REFERRAL_LINK}
              target="_blank"
              rel="noopener noreferrer"
              style={cardBase}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.borderColor = `${THEME.accent}55`;
                e.currentTarget.style.boxShadow = `0 8px 30px ${THEME.accent}12`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = `${THEME.muted}22`;
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <h3
                style={{
                  fontFamily: FONTS.heading,
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: THEME.accent,
                  marginBottom: 10,
                }}
              >
                {f.title}
              </h3>
              <p
                style={{
                  fontSize: "0.92rem",
                  color: `${THEME.text}cc`,
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {f.desc}
              </p>
            </a>
          ))}
        </div>
      </section>

      {/* ===== COMPARISON TABLE ===== */}
      <section style={section}>
        <div style={sectionLabel}>// Protocol comparison</div>
        <h2 style={{ ...sectionHeading, marginBottom: 32 }}>
          How Variational compares
        </h2>
        <ComparisonTable theme={THEME} fonts={FONTS} compact={false} />
      </section>

      {/* ===== AIRDROP CALCULATOR ===== */}
      <section id="calculator" style={section}>
        <div style={sectionLabel}>// Airdrop calculator</div>
        <h2 style={{ ...sectionHeading, marginBottom: 32 }}>
          Estimate your <span style={{ color: THEME.accent }}>$VAR</span>{" "}
          allocation
        </h2>
        <AirdropCalculator theme={THEME} fonts={FONTS} />
      </section>

      {/* ===== GET STARTED ===== */}
      <section style={section}>
        <div style={sectionLabel}>// Get started</div>
        <h2 style={{ ...sectionHeading, marginBottom: 40 }}>
          Three steps to start earning
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 20,
          }}
        >
          {STEPS.map((s) => (
            <div
              key={s.step}
              style={{
                ...cardBase,
                position: "relative",
                cursor: "default",
              }}
            >
              <div
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: "0.72rem",
                  color: THEME.accent,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 12,
                }}
              >
                Step {s.step}
              </div>
              <h3
                style={{
                  fontFamily: FONTS.heading,
                  fontSize: "1.05rem",
                  fontWeight: 700,
                  color: THEME.text,
                  marginBottom: 10,
                }}
              >
                {s.title}
              </h3>
              {s.showCode ? (
                <div>
                  <div
                    style={{
                      fontFamily: FONTS.mono,
                      fontSize: "clamp(1rem, 2.5vw, 1.3rem)",
                      fontWeight: 700,
                      color: THEME.accent,
                      background: `${THEME.accent}12`,
                      border: `1px solid ${THEME.accent}33`,
                      borderRadius: 8,
                      padding: "14px 18px",
                      textAlign: "center",
                      letterSpacing: "0.08em",
                      marginTop: 4,
                      userSelect: "all",
                      wordBreak: "break-all",
                    }}
                  >
                    {REFERRAL_CODE}
                  </div>
                  <div
                    style={{
                      fontSize: "0.78rem",
                      color: THEME.muted,
                      marginTop: 8,
                      textAlign: "center",
                    }}
                  >
                    Use this access code when you connect
                  </div>
                </div>
              ) : (
                <p
                  style={{
                    fontSize: "0.92rem",
                    color: `${THEME.text}bb`,
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {s.desc}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ===== REWARD TIERS ===== */}
      <section style={section}>
        <div style={sectionLabel}>// Reward tiers</div>
        <h2 style={{ ...sectionHeading, marginBottom: 32 }}>
          Volume unlocks higher rewards
        </h2>

        <div
          style={{
            width: "100%",
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
            borderRadius: 12,
            border: `1px solid ${THEME.muted}22`,
          }}
        >
          <table
            style={{
              width: "100%",
              minWidth: 640,
              borderCollapse: "collapse",
              fontFamily: FONTS.body,
              fontSize: "0.88rem",
            }}
          >
            <thead>
              <tr>
                {["Tier", "30d Volume", "Points Boost", "Loss Refund Odds", "Referral Rate"].map(
                  (h) => (
                    <th
                      key={h}
                      style={{
                        padding: "14px 18px",
                        textAlign: "left",
                        fontFamily: LABEL_FONT,
                        fontWeight: 700,
                        fontSize: "0.75rem",
                        color: THEME.muted,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        borderBottom: `2px solid ${THEME.muted}33`,
                        background: `${THEME.bg}`,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {TIERS.map((row, i) => {
                const isTop = i >= TIERS.length - 3;
                return (
                  <tr
                    key={row.tier}
                    style={{
                      background: isTop ? `${THEME.accent}08` : "transparent",
                    }}
                  >
                    <td
                      style={{
                        padding: "12px 18px",
                        borderBottom: `1px solid ${THEME.muted}18`,
                        fontWeight: 700,
                        color: isTop ? THEME.accent : THEME.text,
                        fontFamily: FONTS.heading,
                      }}
                    >
                      {row.tier}
                    </td>
                    <td
                      style={{
                        padding: "12px 18px",
                        borderBottom: `1px solid ${THEME.muted}18`,
                        fontFamily: FONTS.mono,
                        color: `${THEME.text}cc`,
                      }}
                    >
                      {row.volume}
                    </td>
                    <td
                      style={{
                        padding: "12px 18px",
                        borderBottom: `1px solid ${THEME.muted}18`,
                        fontFamily: FONTS.mono,
                        fontWeight: 600,
                        color: isTop ? THEME.accent : `${THEME.text}cc`,
                      }}
                    >
                      {row.boost}
                    </td>
                    <td
                      style={{
                        padding: "12px 18px",
                        borderBottom: `1px solid ${THEME.muted}18`,
                        color: `${THEME.text}bb`,
                      }}
                    >
                      {row.refund}
                    </td>
                    <td
                      style={{
                        padding: "12px 18px",
                        borderBottom: `1px solid ${THEME.muted}18`,
                        fontFamily: FONTS.mono,
                        color: `${THEME.text}cc`,
                      }}
                    >
                      {row.referral}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* ===== FOOTER CTA ===== */}
      <section
        style={{
          ...section,
          textAlign: "center",
          paddingBottom: 40,
        }}
      >
        <div
          style={{
            fontFamily: LABEL_FONT,
            fontSize: "0.82rem",
            color: THEME.muted,
            marginBottom: 20,
          }}
        >
          Points program closing Q3 2026.{" "}
          <span style={{ color: THEME.accent, fontWeight: 700 }}>
            {weeksLeft} weeks remaining.
          </span>
        </div>

        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: "0.85rem",
            color: THEME.muted,
            marginBottom: 8,
          }}
        >
          Referral Code
        </div>
        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: "clamp(1.2rem, 3vw, 1.6rem)",
            fontWeight: 700,
            color: THEME.accent,
            letterSpacing: "0.1em",
            marginBottom: 32,
            userSelect: "all",
          }}
        >
          {REFERRAL_CODE}
        </div>

        <a
          href={REFERRAL_LINK}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            ...primaryBtn,
            fontSize: "1.1rem",
            padding: "16px 48px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = `0 8px 32px ${THEME.accent}40`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          Start Trading on Variational
        </a>

        <div style={{ marginTop: 48 }}>
          <Footer theme={THEME} />
        </div>
      </section>
    </div>
  );
}
