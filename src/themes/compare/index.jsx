import { useEffect, useState, useMemo, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  REFERRAL_LINK,
  REFERRAL_CODE,
  RATES_API_BASE,
} from "../../config.js";

/* ─── Theme tokens ────────────────────────────────────────────────── */
const THEME = {
  bg: "#0A0A0A",
  cardBg: "#1A1A1A",
  text: "#e8e0d0",
  accent: "#FFB800",
  accentDim: "#FFB80044",
  positive: "#22c55e",
  negative: "#ef4444",
  muted: "#888888",
  mutedLight: "#666666",
  barGray: "#444444",
  borderColor: "#ffffff12",
};

const FONTS = {
  heading: "'IBM Plex Mono', monospace",
  body: "'IBM Plex Sans', sans-serif",
  mono: "'IBM Plex Mono', monospace",
};

/* ─── Inject Google Fonts + keyframes once ────────────────────────── */
function injectGlobalStyles() {
  const id = "compare-theme-globals";
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');

    @keyframes compare-pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }

    @keyframes compare-fade-in {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes compare-shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }

    * { box-sizing: border-box; }

    .compare-table-wrap::-webkit-scrollbar {
      height: 6px;
    }
    .compare-table-wrap::-webkit-scrollbar-track {
      background: ${THEME.bg};
    }
    .compare-table-wrap::-webkit-scrollbar-thumb {
      background: ${THEME.mutedLight};
      border-radius: 3px;
    }
  `;
  document.head.appendChild(style);
}

/* ─── Formatting helpers ──────────────────────────────────────────── */
function formatNumber(n) {
  if (!n && n !== 0) return "\u2014";
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

function formatTimestamp(iso) {
  if (!iso) return "\u2014";
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())} UTC`;
}

function timeSince(iso) {
  if (!iso) return "\u2014";
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  return `${Math.floor(seconds / 3600)}h ago`;
}

/* ─── Shared inline helpers ───────────────────────────────────────── */
const pageWrap = {
  minHeight: "100vh",
  background: THEME.bg,
  color: THEME.text,
  fontFamily: FONTS.body,
  margin: 0,
  padding: 0,
  overflowX: "hidden",
};

const container = {
  maxWidth: 1200,
  margin: "0 auto",
  padding: "0 24px",
};

/* ─── Data hook ───────────────────────────────────────────────────── */
function useCompareData() {
  const [protocols, setProtocols] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [lastAttempt, setLastAttempt] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      const attemptTime = new Date().toISOString();
      if (!cancelled) setLastAttempt(attemptTime);

      try {
        const [protocolRes, summaryRes] = await Promise.all([
          fetch(`${RATES_API_BASE}/api/compare/protocols`),
          fetch(`${RATES_API_BASE}/api/compare/summary`),
        ]);
        if (!protocolRes.ok || !summaryRes.ok) throw new Error("API error");

        const protocolData = await protocolRes.json();
        const summaryData = await summaryRes.json();

        if (!cancelled) {
          // Normalize: API returns display_name, frontend uses name
          setProtocols(
            (protocolData.protocols || []).map((p) => ({
              ...p,
              name: p.display_name || p.name || p.slug,
            }))
          );
          setSummary(summaryData);
          setLastUpdated(protocolData.last_updated || attemptTime);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 30 * 60 * 1000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return { protocols, summary, loading, error, lastUpdated, lastAttempt };
}

/* ═══════════════════════════════════════════════════════════════════════
   HEADER BAR
   ═══════════════════════════════════════════════════════════════════════ */
function HeaderBar({ lastUpdated }) {
  const bar = {
    position: "sticky",
    top: 0,
    zIndex: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 12,
    padding: "12px 24px",
    background: THEME.cardBg,
    borderBottom: `1px solid ${THEME.borderColor}`,
    fontFamily: FONTS.mono,
    fontSize: "0.78rem",
    fontWeight: 600,
  };

  const dot = {
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: THEME.positive,
    marginRight: 6,
    animation: "compare-pulse 1.8s ease-in-out infinite",
    flexShrink: 0,
  };

  return (
    <div style={bar}>
      <span
        style={{
          color: THEME.accent,
          fontWeight: 700,
          letterSpacing: "0.1em",
          fontSize: "0.85rem",
        }}
      >
        PERP DEX COMPARE
      </span>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          color: THEME.muted,
          fontSize: "0.72rem",
          letterSpacing: "0.06em",
          flexWrap: "wrap",
        }}
      >
        <span style={{ color: `${THEME.text}88` }}>Data from DefiLlama</span>
        <span
          style={{ display: "flex", alignItems: "center", color: THEME.text }}
        >
          <span style={dot} />
          LIVE
        </span>
        <span>{lastUpdated ? formatTimestamp(lastUpdated) : "\u2014"}</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   LOADING SKELETON
   ═══════════════════════════════════════════════════════════════════════ */
function SkeletonBlock({ width = "100%", height = 20, style: extra = {} }) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: 4,
        background: `linear-gradient(90deg, ${THEME.cardBg} 25%, #252525 50%, ${THEME.cardBg} 75%)`,
        backgroundSize: "200% 100%",
        animation: "compare-shimmer 1.5s ease-in-out infinite",
        ...extra,
      }}
    />
  );
}

function LoadingSkeleton() {
  return (
    <div style={pageWrap}>
      <div style={{ ...container, paddingTop: 80 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
            marginBottom: 40,
          }}
        >
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                background: THEME.cardBg,
                border: `1px solid ${THEME.borderColor}`,
                padding: 20,
              }}
            >
              <SkeletonBlock width="60%" height={12} style={{ marginBottom: 12 }} />
              <SkeletonBlock width="80%" height={28} />
            </div>
          ))}
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <SkeletonBlock
            key={i}
            height={48}
            style={{ marginBottom: 4 }}
          />
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   ERROR STATE
   ═══════════════════════════════════════════════════════════════════════ */
function ErrorState({ lastAttempt }) {
  return (
    <div
      style={{
        ...container,
        padding: "80px 24px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontFamily: FONTS.mono,
          fontSize: "1.1rem",
          fontWeight: 600,
          color: THEME.accent,
          marginBottom: 12,
        }}
      >
        DATA TEMPORARILY UNAVAILABLE
      </div>
      <div
        style={{
          fontFamily: FONTS.mono,
          fontSize: "0.78rem",
          color: THEME.muted,
        }}
      >
        Last attempt: {lastAttempt ? formatTimestamp(lastAttempt) : "\u2014"}
      </div>
      <div
        style={{
          fontFamily: FONTS.body,
          fontSize: "0.85rem",
          color: `${THEME.text}88`,
          marginTop: 16,
          maxWidth: 400,
          margin: "16px auto 0",
          lineHeight: 1.6,
        }}
      >
        The comparison data feed is currently offline. Data is refreshed
        automatically every 30 minutes. Please check back shortly.
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   SUMMARY STATS ROW
   ═══════════════════════════════════════════════════════════════════════ */
function SummaryStats({ summary, protocols, lastUpdated }) {
  const totalVolume24h = useMemo(() => {
    return protocols.reduce((sum, p) => sum + (p.volume_24h || 0), 0);
  }, [protocols]);

  const variational = protocols.find(
    (p) => p.name && p.name.toLowerCase() === "variational"
  );
  const marketShare =
    variational && totalVolume24h > 0
      ? ((variational.volume_24h || 0) / totalVolume24h) * 100
      : 0;

  const stats = [
    {
      label: "TOTAL DEX PERP VOLUME (24H)",
      value: formatNumber(summary?.total_volume_24h || totalVolume24h),
    },
    {
      label: "VARIATIONAL MARKET SHARE",
      value:
        summary?.variational_market_share != null
          ? `${summary.variational_market_share.toFixed(2)}%`
          : `${marketShare.toFixed(2)}%`,
    },
    {
      label: "PROTOCOLS TRACKED",
      value: String(summary?.protocol_count || protocols.length),
    },
    {
      label: "DATA FRESHNESS",
      value: timeSince(lastUpdated),
    },
  ];

  return (
    <section style={{ padding: "24px 0 0" }}>
      <div style={container}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 0,
            border: `1px solid ${THEME.borderColor}`,
          }}
          className="compare-summary-grid"
        >
          {stats.map((s, i) => (
            <div
              key={s.label}
              style={{
                padding: "18px 20px",
                background: THEME.cardBg,
                borderRight:
                  i < stats.length - 1
                    ? `1px solid ${THEME.borderColor}`
                    : "none",
              }}
            >
              <div
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: "0.62rem",
                  fontWeight: 500,
                  color: THEME.muted,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
              >
                {s.label}
              </div>
              <div
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: "1.3rem",
                  fontWeight: 700,
                  color: THEME.accent,
                }}
              >
                {s.value}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Responsive override for summary grid */}
      <style>{`
        @media (max-width: 768px) {
          .compare-summary-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .compare-summary-grid > div:nth-child(2) {
            border-right: none !important;
          }
          .compare-summary-grid > div:nth-child(1),
          .compare-summary-grid > div:nth-child(2) {
            border-bottom: 1px solid ${THEME.borderColor} !important;
          }
        }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   COMPARISON TABLE
   ═══════════════════════════════════════════════════════════════════════ */
function ComparisonTable({ protocols }) {
  const [sortKey, setSortKey] = useState("volume_24h");
  const [sortDir, setSortDir] = useState("desc");

  const handleSort = useCallback(
    (key) => {
      if (sortKey === key) {
        setSortDir((d) => (d === "desc" ? "asc" : "desc"));
      } else {
        setSortKey(key);
        setSortDir("desc");
      }
    },
    [sortKey]
  );

  const sorted = useMemo(() => {
    return [...protocols].sort((a, b) => {
      let av = a[sortKey];
      let bv = b[sortKey];
      // Handle strings for non-numeric sorts
      if (typeof av === "string") av = av.toLowerCase();
      if (typeof bv === "string") bv = bv.toLowerCase();
      // nulls/undefined last
      if (av == null) return 1;
      if (bv == null) return -1;
      if (sortDir === "desc") return av > bv ? -1 : av < bv ? 1 : 0;
      return av > bv ? 1 : av < bv ? -1 : 0;
    });
  }, [protocols, sortKey, sortDir]);

  const columns = [
    { key: "name", label: "Protocol", width: 170, sticky: true },
    { key: "architecture", label: "Architecture", width: 130 },
    { key: "volume_24h", label: "24h Volume", width: 120 },
    { key: "volume_7d", label: "7d Volume", width: 120 },
    { key: "open_interest", label: "Open Interest", width: 120 },
    { key: "tvl", label: "TVL", width: 100 },
    { key: "fee_model", label: "Fee Model", width: 140 },
    { key: "token_status", label: "Token", width: 100 },
    { key: "fdv", label: "FDV", width: 110 },
    { key: "community_allocation", label: "Community %", width: 110 },
  ];

  const arrow = (key) => {
    if (sortKey !== key) return "";
    return sortDir === "desc" ? " \u25BC" : " \u25B2";
  };

  function tokenBadge(status) {
    if (!status) return <span style={{ color: THEME.muted }}>N/A</span>;
    const lower = status.toLowerCase();
    let bg = THEME.muted;
    let label = status;
    if (lower === "live" || lower === "launched") {
      bg = THEME.positive;
      label = "Live";
    } else if (lower.includes("pre") || lower.includes("tge")) {
      bg = THEME.accent;
      label = "Pre-TGE";
    } else if (lower === "n/a" || lower === "none") {
      bg = THEME.muted;
      label = "N/A";
    }
    return (
      <span
        style={{
          display: "inline-block",
          padding: "2px 8px",
          borderRadius: 3,
          fontSize: "0.68rem",
          fontWeight: 600,
          fontFamily: FONTS.mono,
          background: `${bg}22`,
          color: bg,
          border: `1px solid ${bg}44`,
          letterSpacing: "0.04em",
        }}
      >
        {label}
      </span>
    );
  }

  function renderCell(protocol, col) {
    const val = protocol[col.key];
    switch (col.key) {
      case "name":
        return (
          <div>
            <div
              style={{
                fontWeight: 600,
                color: THEME.text,
                fontSize: "0.82rem",
              }}
            >
              {protocol.name}
            </div>
            {protocol.chain && (
              <div
                style={{
                  fontSize: "0.65rem",
                  color: THEME.muted,
                  marginTop: 2,
                }}
              >
                {protocol.chain}
              </div>
            )}
          </div>
        );
      case "volume_24h":
      case "volume_7d":
      case "open_interest":
      case "tvl":
        return (
          <span style={{ fontFamily: FONTS.mono, fontSize: "0.82rem" }}>
            {formatNumber(val)}
          </span>
        );
      case "fdv":
        if (!val && protocol.token_status?.toLowerCase().includes("pre")) {
          return (
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: "0.78rem",
                color: THEME.accent,
              }}
            >
              Pre-TGE
            </span>
          );
        }
        return (
          <span style={{ fontFamily: FONTS.mono, fontSize: "0.82rem" }}>
            {typeof val === "number" ? formatNumber(val) : val || "\u2014"}
          </span>
        );
      case "community_allocation":
        return (
          <span style={{ fontFamily: FONTS.mono, fontSize: "0.82rem" }}>
            {val != null
              ? String(val).includes("%") ? val : `${val}%`
              : "\u2014"}
          </span>
        );
      case "token_status":
        return tokenBadge(val);
      case "architecture":
      case "fee_model":
        return (
          <span style={{ fontSize: "0.78rem", color: `${THEME.text}cc` }}>
            {val || "\u2014"}
          </span>
        );
      default:
        return <span>{val != null ? String(val) : "\u2014"}</span>;
    }
  }

  const isVariational = (p) =>
    p.name && p.name.toLowerCase() === "variational";

  const thStyle = (col) => ({
    position: col.sticky ? "sticky" : "relative",
    left: col.sticky ? 0 : undefined,
    zIndex: col.sticky ? 2 : 1,
    minWidth: col.width,
    padding: "10px 14px",
    textAlign: "left",
    fontFamily: FONTS.mono,
    fontSize: "0.65rem",
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: THEME.muted,
    background: THEME.cardBg,
    borderBottom: `1px solid ${THEME.borderColor}`,
    cursor: "pointer",
    userSelect: "none",
    whiteSpace: "nowrap",
    transition: "color 0.15s",
  });

  const tdStyle = (col, isVar) => ({
    position: col.sticky ? "sticky" : "relative",
    left: col.sticky ? 0 : undefined,
    zIndex: col.sticky ? 1 : 0,
    minWidth: col.width,
    padding: "12px 14px",
    fontFamily: FONTS.body,
    fontSize: "0.82rem",
    color: THEME.text,
    background: isVar ? `${THEME.accent}08` : THEME.bg,
    borderBottom: `1px solid ${THEME.borderColor}`,
    whiteSpace: "nowrap",
  });

  return (
    <section style={{ padding: "24px 0" }}>
      <div style={container}>
        <div style={{ marginBottom: 12 }}>
          <span
            style={{
              fontFamily: FONTS.mono,
              fontSize: "0.7rem",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: THEME.muted,
            }}
          >
            PROTOCOL COMPARISON
          </span>
        </div>
        <div
          className="compare-table-wrap"
          style={{
            overflowX: "auto",
            border: `1px solid ${THEME.borderColor}`,
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: 1100,
            }}
          >
            <thead>
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    style={{
                      ...thStyle(col),
                      color: sortKey === col.key ? THEME.accent : THEME.muted,
                    }}
                    onClick={() => handleSort(col.key)}
                  >
                    {col.label}
                    {arrow(col.key)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((p, i) => {
                const isVar = isVariational(p);
                return (
                  <tr
                    key={p.name || i}
                    style={{
                      borderLeft: isVar
                        ? `3px solid ${THEME.accent}`
                        : "3px solid transparent",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      if (!isVar) {
                        e.currentTarget.style.background = `${THEME.cardBg}`;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isVar) {
                        e.currentTarget.style.background = "transparent";
                      }
                    }}
                  >
                    {columns.map((col) => (
                      <td key={col.key} style={tdStyle(col, isVar)}>
                        {renderCell(p, col)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   VOLUME CHART
   ═══════════════════════════════════════════════════════════════════════ */
function VolumeChart({ protocols }) {
  const chartData = useMemo(() => {
    return [...protocols]
      .filter((p) => p.volume_24h > 0)
      .sort((a, b) => (a.volume_24h || 0) - (b.volume_24h || 0))
      .map((p) => ({
        name: p.name,
        volume: p.volume_24h || 0,
        isVariational:
          p.name && p.name.toLowerCase() === "variational",
      }));
  }, [protocols]);

  const chartHeight = Math.max(300, chartData.length * 40);

  function CustomTooltip({ active, payload }) {
    if (!active || !payload || !payload.length) return null;
    const d = payload[0].payload;
    return (
      <div
        style={{
          background: THEME.cardBg,
          border: `1px solid ${THEME.borderColor}`,
          padding: "10px 14px",
          fontFamily: FONTS.mono,
          fontSize: "0.78rem",
        }}
      >
        <div
          style={{
            fontWeight: 600,
            color: d.isVariational ? THEME.accent : THEME.text,
            marginBottom: 4,
          }}
        >
          {d.name}
        </div>
        <div style={{ color: THEME.muted }}>
          24h Volume: {formatNumber(d.volume)}
        </div>
      </div>
    );
  }

  if (chartData.length === 0) return null;

  return (
    <section style={{ padding: "8px 0 24px" }}>
      <div style={container}>
        <div style={{ marginBottom: 12 }}>
          <span
            style={{
              fontFamily: FONTS.mono,
              fontSize: "0.7rem",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: THEME.muted,
            }}
          >
            24H VOLUME BY PROTOCOL
          </span>
        </div>
        <div
          style={{
            border: `1px solid ${THEME.borderColor}`,
            background: THEME.cardBg,
            padding: "20px 16px 12px",
          }}
        >
          <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 4, right: 40, bottom: 4, left: 10 }}
            >
              <XAxis
                type="number"
                tickFormatter={(v) => formatNumber(v)}
                tick={{
                  fontFamily: FONTS.mono,
                  fontSize: 11,
                  fill: THEME.muted,
                }}
                axisLine={{ stroke: THEME.borderColor }}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={120}
                tick={{
                  fontFamily: FONTS.mono,
                  fontSize: 11,
                  fill: THEME.text,
                }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: `${THEME.text}08` }}
              />
              <Bar dataKey="volume" radius={[0, 3, 3, 0]} maxBarSize={28}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.isVariational ? THEME.accent : THEME.barGray}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   WHY VARIATIONAL CALLOUT
   ═══════════════════════════════════════════════════════════════════════ */
function WhyVariational() {
  const points = [
    {
      label: "Zero Trading Fees",
      detail: "Unique among DEXs \u2014 no maker or taker fees, permanently",
    },
    {
      label: "Private Execution",
      detail:
        "RFQ engine with no visible positions, orders, or liquidation levels",
    },
    {
      label: "Loss Refund Protocol",
      detail: "$4M+ returned to traders since genesis",
    },
    {
      label: "~10% Community Allocation",
      detail: "VAR token with significant community distribution",
    },
    {
      label: "~500 Tradable Markets",
      detail: "Most markets of any perp DEX \u2014 crypto, RWAs, indices",
    },
  ];

  return (
    <section style={{ padding: "0 0 24px" }}>
      <div style={container}>
        <div
          style={{
            border: `1px solid ${THEME.accent}44`,
            background: `${THEME.accent}06`,
            padding: "28px 28px 24px",
          }}
        >
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: "0.85rem",
              fontWeight: 700,
              color: THEME.accent,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 20,
            }}
          >
            WHY VARIATIONAL?
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 16,
            }}
          >
            {points.map((pt) => (
              <div key={pt.label} style={{ display: "flex", gap: 10 }}>
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: THEME.accent,
                    marginTop: 7,
                    flexShrink: 0,
                  }}
                />
                <div>
                  <div
                    style={{
                      fontFamily: FONTS.mono,
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      color: THEME.text,
                      marginBottom: 2,
                    }}
                  >
                    {pt.label}
                  </div>
                  <div
                    style={{
                      fontFamily: FONTS.body,
                      fontSize: "0.78rem",
                      color: THEME.muted,
                      lineHeight: 1.5,
                    }}
                  >
                    {pt.detail}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   TOOL CROSS-LINKS
   ═══════════════════════════════════════════════════════════════════════ */
function ToolCrossLinks() {
  const linkStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 20px",
    border: `1px solid ${THEME.borderColor}`,
    background: `${THEME.accent}08`,
    color: THEME.text,
    fontFamily: FONTS.mono,
    fontSize: "0.75rem",
    fontWeight: 500,
    textDecoration: "none",
    letterSpacing: "0.04em",
    transition: "border-color 0.2s, background 0.2s",
  };

  return (
    <section style={{ padding: "16px 0 8px" }}>
      <div style={{ ...container, display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
        <a
          href="/rates"
          style={linkStyle}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = THEME.accent; e.currentTarget.style.background = `${THEME.accent}15`; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = THEME.borderColor; e.currentTarget.style.background = `${THEME.accent}08`; }}
        >
          <span style={{ color: THEME.accent }}>&#9679;</span> Funding Rate Arb &rarr;
        </a>
        <a
          href="/liquidations"
          style={linkStyle}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#00FF41"; e.currentTarget.style.background = "#00FF4115"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = THEME.borderColor; e.currentTarget.style.background = `${THEME.accent}08`; }}
        >
          <span style={{ color: "#00FF41" }}>&#9679;</span> Liquidation Monitor &rarr;
        </a>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   CTA SECTION
   ═══════════════════════════════════════════════════════════════════════ */
function CTASection() {
  const ctaButton = {
    display: "inline-block",
    padding: "14px 40px",
    background: THEME.accent,
    color: "#000",
    fontFamily: FONTS.mono,
    fontWeight: 700,
    fontSize: "0.9rem",
    letterSpacing: "0.06em",
    border: "none",
    borderRadius: 2,
    cursor: "pointer",
    textDecoration: "none",
    transition: "background 0.15s, transform 0.1s",
  };

  return (
    <section style={{ padding: "32px 0", textAlign: "center" }}>
      <div style={container}>
        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: "1.15rem",
            fontWeight: 700,
            color: THEME.text,
            marginBottom: 12,
            letterSpacing: "0.02em",
          }}
        >
          Start Trading on Variational
        </div>
        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: "0.75rem",
            color: THEME.muted,
            marginBottom: 20,
          }}
        >
          ACCESS CODE:{" "}
          <span style={{ color: THEME.accent, fontWeight: 600 }}>
            {REFERRAL_CODE}
          </span>
        </div>
        <a
          href={REFERRAL_LINK}
          target="_blank"
          rel="noopener noreferrer"
          style={ctaButton}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#E0A300";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = THEME.accent;
          }}
        >
          START TRADING &rarr;
        </a>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════════════════════════════════ */
function CompareFooter() {
  return (
    <footer
      style={{
        padding: "24px 0 32px",
        borderTop: `1px solid ${THEME.borderColor}`,
      }}
    >
      <div style={container}>
        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: "0.68rem",
            color: THEME.muted,
            lineHeight: 1.8,
            maxWidth: 680,
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <div>
            Data sourced from DefiLlama API. Protocol metadata manually curated.
            Updated every 30 minutes.
          </div>
          <div style={{ marginTop: 8, color: `${THEME.muted}aa` }}>
            This page contains a referral link. Trading perpetual contracts
            carries risk. Past performance is not indicative of future results.
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   MAIN PAGE EXPORT
   ═══════════════════════════════════════════════════════════════════════ */
export default function CompareTheme() {
  const [ready, setReady] = useState(false);
  const { protocols, summary, loading, error, lastUpdated, lastAttempt } =
    useCompareData();

  useEffect(() => {
    injectGlobalStyles();
    const t = setTimeout(() => setReady(true), 50);
    return () => clearTimeout(t);
  }, []);

  if (!ready || loading) {
    return (
      <div style={pageWrap}>
        <HeaderBar lastUpdated={null} />
        <LoadingSkeleton />
      </div>
    );
  }

  if (error && protocols.length === 0) {
    return (
      <div style={pageWrap}>
        <HeaderBar lastUpdated={lastUpdated} />
        <ErrorState lastAttempt={lastAttempt} />
      </div>
    );
  }

  return (
    <div style={pageWrap}>
      <HeaderBar lastUpdated={lastUpdated} />
      <SummaryStats
        summary={summary}
        protocols={protocols}
        lastUpdated={lastUpdated}
      />
      <ComparisonTable protocols={protocols} />
      <VolumeChart protocols={protocols} />
      <WhyVariational />
      <CTASection />
      <ToolCrossLinks />
      <CompareFooter />
    </div>
  );
}
