import { useEffect, useState, useMemo } from "react";
import Footer from "../../components/Footer.jsx";
import {
  REFERRAL_LINK,
  REFERRAL_CODE,
  RATES_API_BASE,
  getWeeksRemaining,
} from "../../config.js";

/* ─── Theme tokens ───────────────────────────────────────────────── */
const THEME = {
  bg: "#0c0b09",
  text: "#e8e0d0",
  accent: "#fbbf24",
  positive: "#22c55e",
  negative: "#ef4444",
  muted: "#a89968",
  cardBg: "#141310",
  borderColor: "#a8996833",
};

const FONTS = {
  heading: "'IBM Plex Mono', monospace",
  body: "'IBM Plex Sans', sans-serif",
  mono: "'IBM Plex Mono', monospace",
};

/* ─── Mock data ──────────────────────────────────────────────────── */
const MOCK_OPPORTUNITIES = [
  { ticker: "BTC", var_rate_annual: 94.80, cex_exchange: "binance", cex_rate_annual: 2.81, spread_annual: 91.99, direction: "short_var_long_cex", daily_pnl_10k: 25.20, daily_pnl_50k: 126.00, daily_pnl_100k: 252.00, var_mark_price: 86250.00, volume_24h: 724957891 },
  { ticker: "ETH", var_rate_annual: 48.20, cex_exchange: "bybit", cex_rate_annual: 3.15, spread_annual: 45.05, direction: "short_var_long_cex", daily_pnl_10k: 12.34, daily_pnl_50k: 61.71, daily_pnl_100k: 123.42, var_mark_price: 2180.50, volume_24h: 412000000 },
  { ticker: "SOL", var_rate_annual: 38.10, cex_exchange: "hyperliquid", cex_rate_annual: -2.40, spread_annual: 40.50, direction: "short_var_long_cex", daily_pnl_10k: 11.10, daily_pnl_50k: 55.48, daily_pnl_100k: 110.96, var_mark_price: 138.20, volume_24h: 289000000 },
  { ticker: "DOGE", var_rate_annual: 35.60, cex_exchange: "binance", cex_rate_annual: 1.22, spread_annual: 34.38, direction: "short_var_long_cex", daily_pnl_10k: 9.42, daily_pnl_50k: 47.10, daily_pnl_100k: 94.19, var_mark_price: 0.1720, volume_24h: 156000000 },
  { ticker: "AVAX", var_rate_annual: 32.15, cex_exchange: "bybit", cex_rate_annual: 4.20, spread_annual: 27.95, direction: "short_var_long_cex", daily_pnl_10k: 7.66, daily_pnl_50k: 38.29, daily_pnl_100k: 76.58, var_mark_price: 22.40, volume_24h: 98000000 },
  { ticker: "ARB", var_rate_annual: 28.90, cex_exchange: "binance", cex_rate_annual: 2.10, spread_annual: 26.80, direction: "short_var_long_cex", daily_pnl_10k: 7.34, daily_pnl_50k: 36.71, daily_pnl_100k: 73.42, var_mark_price: 0.52, volume_24h: 67000000 },
  { ticker: "LINK", var_rate_annual: 25.40, cex_exchange: "hyperliquid", cex_rate_annual: -1.30, spread_annual: 26.70, direction: "short_var_long_cex", daily_pnl_10k: 7.32, daily_pnl_50k: 36.58, daily_pnl_100k: 73.15, var_mark_price: 14.80, volume_24h: 54000000 },
  { ticker: "OP", var_rate_annual: 22.80, cex_exchange: "bybit", cex_rate_annual: 1.85, spread_annual: 20.95, direction: "short_var_long_cex", daily_pnl_10k: 5.74, daily_pnl_50k: 28.70, daily_pnl_100k: 57.40, var_mark_price: 0.92, volume_24h: 43000000 },
  { ticker: "WIF", var_rate_annual: 19.50, cex_exchange: "binance", cex_rate_annual: 5.80, spread_annual: 13.70, direction: "short_var_long_cex", daily_pnl_10k: 3.75, daily_pnl_50k: 18.77, daily_pnl_100k: 37.53, var_mark_price: 0.68, volume_24h: 38000000 },
  { ticker: "PEPE", var_rate_annual: 18.20, cex_exchange: "binance", cex_rate_annual: 3.40, spread_annual: 14.80, direction: "short_var_long_cex", daily_pnl_10k: 4.05, daily_pnl_50k: 20.27, daily_pnl_100k: 40.55, var_mark_price: 0.0000089, volume_24h: 31000000 },
  { ticker: "MATIC", var_rate_annual: 15.60, cex_exchange: "bybit", cex_rate_annual: 2.30, spread_annual: 13.30, direction: "short_var_long_cex", daily_pnl_10k: 3.64, daily_pnl_50k: 18.22, daily_pnl_100k: 36.44, var_mark_price: 0.38, volume_24h: 28000000 },
  { ticker: "SUI", var_rate_annual: 14.20, cex_exchange: "hyperliquid", cex_rate_annual: 1.10, spread_annual: 13.10, direction: "short_var_long_cex", daily_pnl_10k: 3.59, daily_pnl_50k: 17.95, daily_pnl_100k: 35.89, var_mark_price: 2.85, volume_24h: 25000000 },
];

const MOCK_SUMMARY = {
  total_markets_tracked: 142,
  total_opportunities: 98,
  best_spread_ticker: "BTC",
  best_spread_annual: 91.99,
  best_daily_10k: 25.20,
  avg_spread_annual: 34.5,
  updated_at: new Date().toISOString(),
};

/* ─── Mock history generator ─────────────────────────────────────── */
function generateMockHistory(baseRate, volatility = 2) {
  const points = [];
  let rate = baseRate;
  for (let i = 0; i < 168; i++) {
    rate += (Math.random() - 0.5) * volatility;
    rate = Math.max(rate * 0.3, Math.min(rate, baseRate * 3));
    const t = new Date(Date.now() - (168 - i) * 3600000).toISOString();
    points.push({ t, rate: Math.round(rate * 100) / 100 });
  }
  return points;
}

const MOCK_HISTORY_CACHE = {};
function getMockHistory(ticker) {
  if (MOCK_HISTORY_CACHE[ticker]) return MOCK_HISTORY_CACHE[ticker];
  const opp = MOCK_OPPORTUNITIES.find((o) => o.ticker === ticker);
  const varBase = opp ? opp.var_rate_annual : 20;
  const cexBase = opp ? opp.cex_rate_annual : 2;
  MOCK_HISTORY_CACHE[ticker] = {
    variational: generateMockHistory(varBase, 4),
    binance: generateMockHistory(cexBase, 0.8),
    bybit: generateMockHistory(cexBase + 0.5, 0.9),
    hyperliquid: generateMockHistory(cexBase - 0.3, 1.0),
  };
  return MOCK_HISTORY_CACHE[ticker];
}

/* ─── Inject Google Fonts + keyframes ────────────────────────────── */
function injectGlobalStyles() {
  const id = "rates-theme-globals";
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');

    @keyframes rates-ticker-scroll {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }

    @keyframes rates-pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }

    @keyframes rates-fade-in {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }

    * { box-sizing: border-box; }
  `;
  document.head.appendChild(style);
}

/* ─── Data hooks ─────────────────────────────────────────────────── */
function useRatesData() {
  const [data, setData] = useState({ opportunities: MOCK_OPPORTUNITIES, summary: MOCK_SUMMARY });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      try {
        const [oppRes, sumRes] = await Promise.all([
          fetch(`${RATES_API_BASE}/api/rates/opportunities?limit=50`),
          fetch(`${RATES_API_BASE}/api/rates/summary`),
        ]);
        if (!oppRes.ok || !sumRes.ok) throw new Error("API error");
        const oppData = await oppRes.json();
        const summary = await sumRes.json();
        if (!cancelled) {
          setData({ opportunities: oppData.opportunities || oppData, summary });
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setData({ opportunities: MOCK_OPPORTUNITIES, summary: MOCK_SUMMARY });
          setError(err.message);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  return { data, loading, error };
}

function useHistoricalRates(ticker) {
  const [series, setSeries] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function fetchHistory() {
      setLoading(true);
      try {
        const res = await fetch(
          `${RATES_API_BASE}/api/rates/history?ticker=${ticker}&hours=168`
        );
        if (!res.ok) throw new Error("API error");
        const data = await res.json();
        if (!cancelled) setSeries(data.series || data);
      } catch {
        if (!cancelled) setSeries(getMockHistory(ticker));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchHistory();
    return () => { cancelled = true; };
  }, [ticker]);

  return { series, loading };
}

/* ─── Shared inline style helpers ────────────────────────────────── */
const sectionLabel = {
  fontFamily: FONTS.mono,
  fontSize: "0.7rem",
  fontWeight: 600,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: THEME.muted,
  marginBottom: 8,
};

const sectionTitle = {
  fontFamily: FONTS.mono,
  fontSize: "1.15rem",
  fontWeight: 700,
  color: THEME.accent,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  marginBottom: 24,
};

const dataCell = {
  border: `1px solid ${THEME.borderColor}`,
  padding: "16px 20px",
  background: THEME.bg,
};

const ctaButton = {
  display: "inline-block",
  padding: "14px 36px",
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

/* ─── Utilities ──────────────────────────────────────────────────── */
function formatDateBloomberg(d) {
  const months = [
    "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
    "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
  ];
  const day = String(d.getDate()).padStart(2, "0");
  return `${day} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function fmtRate(val) {
  return `${val >= 0 ? "+" : ""}${val.toFixed(2)}%`;
}

function fmtDollar(val) {
  return `$${val.toFixed(2)}`;
}

function exchangeAbbr(name) {
  const map = { binance: "BIN", bybit: "BYB", hyperliquid: "HL" };
  return map[(name || "").toLowerCase()] || name.toUpperCase().slice(0, 3);
}

function formatDirection(direction, cex) {
  if (!direction) return "-";
  const abbr = exchangeAbbr(cex);
  if (direction === "short_var_long_cex") return `Short VAR / Long ${abbr}`;
  if (direction === "long_var_short_cex") return `Long VAR / Short ${abbr}`;
  return direction;
}

/* ═════════════════════════════════════════════════════════════════════
   1. TOP BAR (sticky)
   ═════════════════════════════════════════════════════════════════════ */
function TopBar() {
  const bar = {
    position: "sticky",
    top: 0,
    zIndex: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 24px",
    height: 44,
    background: "#0f0e0c",
    borderBottom: `1px solid ${THEME.borderColor}`,
    fontFamily: FONTS.mono,
    fontSize: "0.78rem",
    fontWeight: 600,
  };

  const center = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    color: THEME.text,
    letterSpacing: "0.06em",
  };

  const dot = {
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: THEME.positive,
    animation: "rates-pulse 1.8s ease-in-out infinite",
  };

  return (
    <div style={bar}>
      <span style={{ color: THEME.accent, fontWeight: 700, letterSpacing: "0.1em", fontSize: "0.85rem" }}>
        VARIATIONAL
      </span>
      <div style={center}>
        <span style={{ color: THEME.muted, letterSpacing: "0.08em" }}>FUNDING RATES</span>
        <span style={dot} />
        <span style={{ color: THEME.positive, fontSize: "0.72rem", fontWeight: 700 }}>LIVE</span>
      </div>
      <span style={{ color: THEME.muted, letterSpacing: "0.06em" }}>
        {formatDateBloomberg(new Date())}
      </span>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════════
   2. TICKER BANNER (scrolling marquee)
   ═════════════════════════════════════════════════════════════════════ */
function TickerBanner({ opportunities }) {
  const top5 = (opportunities || []).slice(0, 5);
  const content = top5
    .map((o) => `${o.ticker} +${o.spread_annual.toFixed(1)}% APR`)
    .join("  \u2022  ") + "  \u2022  ";

  const track = {
    overflow: "hidden",
    background: "#100f0c",
    borderBottom: `1px solid ${THEME.borderColor}`,
    height: 28,
    display: "flex",
    alignItems: "center",
    whiteSpace: "nowrap",
  };

  const inner = {
    display: "inline-block",
    animation: "rates-ticker-scroll 28s linear infinite",
    fontFamily: FONTS.mono,
    fontSize: "0.72rem",
    fontWeight: 500,
    color: THEME.accent,
    letterSpacing: "0.1em",
  };

  return (
    <div style={track}>
      <div style={inner}>
        <span>{content}</span>
        <span>{content}</span>
        <span>{content}</span>
        <span>{content}</span>
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════════
   3. SUMMARY STATS
   ═════════════════════════════════════════════════════════════════════ */
function SummaryStats({ summary }) {
  const cells = [
    { label: "MARKETS TRACKED", value: String(summary.total_markets_tracked) },
    { label: "AVG ANNUAL SPREAD", value: `${summary.avg_spread_annual.toFixed(1)}%` },
    { label: "BEST SPREAD", value: `${summary.best_spread_ticker} ${summary.best_spread_annual.toFixed(1)}%` },
    { label: "BEST DAILY $10K", value: fmtDollar(summary.best_daily_10k) },
  ];

  return (
    <section style={{ padding: "0", borderBottom: `1px solid ${THEME.borderColor}` }}>
      <div style={container}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 0,
            border: `1px solid ${THEME.borderColor}`,
          }}
        >
          {cells.map((c, i) => (
            <div
              key={c.label}
              style={{
                ...dataCell,
                borderLeft: i === 0 ? "none" : `1px solid ${THEME.borderColor}`,
                borderTop: "none",
                borderBottom: "none",
                borderRight: "none",
                padding: "20px 24px",
              }}
            >
              <div
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: "0.62rem",
                  fontWeight: 500,
                  color: THEME.muted,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
              >
                {c.label}
              </div>
              <div
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: "1.35rem",
                  fontWeight: 700,
                  color: THEME.accent,
                }}
              >
                {c.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═════════════════════════════════════════════════════════════════════
   4. HERO SECTION
   ═════════════════════════════════════════════════════════════════════ */
function Hero() {
  return (
    <section style={{ padding: "60px 0", borderBottom: `1px solid ${THEME.borderColor}` }}>
      <div style={container}>
        <div style={{ ...sectionLabel, marginBottom: 12 }}>
          FUNDING RATE ARBITRAGE
        </div>
        <h1
          style={{
            fontFamily: FONTS.heading,
            fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
            fontWeight: 700,
            color: THEME.text,
            lineHeight: 1.15,
            margin: "0 0 20px",
            letterSpacing: "-0.01em",
          }}
        >
          Earn while you hedge.
        </h1>
        <p
          style={{
            fontFamily: FONTS.body,
            fontSize: "1rem",
            lineHeight: 1.7,
            color: `${THEME.text}bb`,
            maxWidth: 640,
            margin: "0 0 32px",
          }}
        >
          Capture funding rate spreads between Variational and CEX/DEX exchanges.
          Zero trading fees on Variational means more alpha in your pocket.
        </p>
        <a
          href={REFERRAL_LINK}
          target="_blank"
          rel="noopener noreferrer"
          style={ctaButton}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#f59e0b"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = THEME.accent; }}
        >
          START TRADING &rarr;
        </a>
      </div>
    </section>
  );
}

/* ═════════════════════════════════════════════════════════════════════
   5. OPPORTUNITIES TABLE
   ═════════════════════════════════════════════════════════════════════ */
function OpportunitiesTable({ opportunities }) {
  const [sortKey, setSortKey] = useState("spread_annual");
  const [sortDir, setSortDir] = useState("desc");
  const [showAll, setShowAll] = useState(false);

  const sorted = useMemo(() => {
    const arr = [...opportunities];
    arr.sort((a, b) => {
      const aVal = a[sortKey] ?? 0;
      const bVal = b[sortKey] ?? 0;
      return sortDir === "desc" ? bVal - aVal : aVal - bVal;
    });
    return arr;
  }, [opportunities, sortKey, sortDir]);

  const visible = showAll ? sorted : sorted.slice(0, 15);

  function handleSort(key) {
    if (sortKey === key) {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const columns = [
    { key: "ticker", label: "ASSET", sortable: true },
    { key: "var_rate_annual", label: "VAR RATE", sortable: true },
    { key: "cex_exchange", label: "BEST CEX", sortable: false },
    { key: "cex_rate_annual", label: "CEX RATE", sortable: true },
    { key: "spread_annual", label: "SPREAD", sortable: true },
    { key: "direction", label: "DIRECTION", sortable: false },
    { key: "daily_pnl_10k", label: "$10K/DAY", sortable: true },
    { key: "daily_pnl_50k", label: "$50K/DAY", sortable: true },
    { key: "action", label: "ACTION", sortable: false },
  ];

  const thBase = {
    fontFamily: FONTS.mono,
    fontSize: "0.62rem",
    fontWeight: 600,
    letterSpacing: "0.1em",
    color: THEME.muted,
    textTransform: "uppercase",
    padding: "12px 14px",
    textAlign: "left",
    borderBottom: `1px solid ${THEME.borderColor}`,
    whiteSpace: "nowrap",
    userSelect: "none",
    background: "#0f0e0b",
    position: "sticky",
    top: 0,
  };

  const tdBase = {
    fontFamily: FONTS.mono,
    fontSize: "0.8rem",
    padding: "11px 14px",
    borderBottom: `1px solid ${THEME.borderColor}`,
    whiteSpace: "nowrap",
  };

  const sortArrow = (key) => {
    if (sortKey !== key) return "";
    return sortDir === "desc" ? " \u25BC" : " \u25B2";
  };

  return (
    <section style={{ padding: "60px 0", borderBottom: `1px solid ${THEME.borderColor}` }}>
      <div style={container}>
        <div style={sectionLabel}>SECTION 02</div>
        <div style={sectionTitle}>TOP OPPORTUNITIES</div>
        <div
          style={{
            overflowX: "auto",
            border: `1px solid ${THEME.borderColor}`,
            background: THEME.cardBg,
          }}
        >
          <table
            style={{
              width: "100%",
              minWidth: 900,
              borderCollapse: "collapse",
              borderSpacing: 0,
            }}
          >
            <thead>
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    style={{
                      ...thBase,
                      cursor: col.sortable ? "pointer" : "default",
                    }}
                    onClick={() => col.sortable && handleSort(col.key)}
                  >
                    {col.label}{col.sortable ? sortArrow(col.key) : ""}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((row, idx) => {
                const rowBg = idx % 2 === 0 ? THEME.cardBg : "#1a1814";
                return (
                  <tr key={row.ticker + idx} style={{ background: rowBg }}>
                    <td style={{ ...tdBase, fontWeight: 700, color: THEME.text }}>
                      {row.ticker}
                    </td>
                    <td style={{ ...tdBase, color: row.var_rate_annual >= 0 ? THEME.positive : THEME.negative }}>
                      {fmtRate(row.var_rate_annual)}
                    </td>
                    <td style={{ ...tdBase, color: THEME.muted, fontSize: "0.72rem", letterSpacing: "0.06em" }}>
                      {exchangeAbbr(row.cex_exchange)}
                    </td>
                    <td style={{ ...tdBase, color: row.cex_rate_annual >= 0 ? THEME.positive : THEME.negative }}>
                      {fmtRate(row.cex_rate_annual)}
                    </td>
                    <td style={{ ...tdBase, color: THEME.accent, fontWeight: 700 }}>
                      {fmtRate(row.spread_annual)}
                    </td>
                    <td style={{ ...tdBase, color: `${THEME.text}99`, fontSize: "0.72rem" }}>
                      {formatDirection(row.direction, row.cex_exchange)}
                    </td>
                    <td style={{ ...tdBase, color: THEME.positive, fontWeight: 600 }}>
                      {fmtDollar(row.daily_pnl_10k)}
                    </td>
                    <td style={{ ...tdBase, color: THEME.positive, fontWeight: 600 }}>
                      {fmtDollar(row.daily_pnl_50k)}
                    </td>
                    <td style={{ ...tdBase }}>
                      <a
                        href={REFERRAL_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontFamily: FONTS.mono,
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          color: "#000",
                          background: THEME.accent,
                          padding: "5px 12px",
                          borderRadius: 2,
                          textDecoration: "none",
                          letterSpacing: "0.04em",
                          whiteSpace: "nowrap",
                        }}
                      >
                        TRADE &rarr;
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {sorted.length > 15 && (
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <button
              onClick={() => setShowAll((v) => !v)}
              style={{
                fontFamily: FONTS.mono,
                fontSize: "0.75rem",
                fontWeight: 600,
                color: THEME.accent,
                background: "transparent",
                border: `1px solid ${THEME.borderColor}`,
                padding: "8px 24px",
                cursor: "pointer",
                letterSpacing: "0.06em",
              }}
            >
              {showAll ? "SHOW LESS" : `SHOW ALL (${sorted.length})`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

/* ═════════════════════════════════════════════════════════════════════
   6. EARNINGS CALCULATOR
   ═════════════════════════════════════════════════════════════════════ */
function EarningsCalculator({ opportunities }) {
  const notionalOptions = [10000, 25000, 50000, 100000, 250000];
  const topTickers = useMemo(
    () => (opportunities || []).slice(0, 6).map((o) => o.ticker),
    [opportunities]
  );

  const [notional, setNotional] = useState(10000);
  const [selectedTicker, setSelectedTicker] = useState(
    topTickers[0] || "BTC"
  );

  const selectedOpp = useMemo(
    () => (opportunities || []).find((o) => o.ticker === selectedTicker),
    [opportunities, selectedTicker]
  );

  const spread = selectedOpp ? selectedOpp.spread_annual : 0;
  const exchange = selectedOpp ? selectedOpp.cex_exchange : "";
  const daily = (notional * spread) / 100 / 365;
  const weekly = daily * 7;
  const monthly = daily * 30;
  const annual = daily * 365;

  const btnGroupStyle = (active) => ({
    fontFamily: FONTS.mono,
    fontSize: "0.78rem",
    fontWeight: active ? 700 : 500,
    color: active ? "#000" : THEME.text,
    background: active ? THEME.accent : "transparent",
    border: `1px solid ${active ? THEME.accent : THEME.borderColor}`,
    padding: "8px 18px",
    cursor: "pointer",
    letterSpacing: "0.04em",
    transition: "all 0.15s",
  });

  const outputCard = {
    border: `1px solid ${THEME.borderColor}`,
    padding: "20px 18px",
    background: THEME.cardBg,
  };

  const earnings = [
    { label: "DAILY EARNINGS", value: daily },
    { label: "WEEKLY EARNINGS", value: weekly },
    { label: "MONTHLY EARNINGS", value: monthly },
    { label: "ANNUAL EARNINGS", value: annual },
  ];

  return (
    <section style={{ padding: "60px 0", borderBottom: `1px solid ${THEME.borderColor}` }}>
      <div style={container}>
        <div style={sectionLabel}>SECTION 03</div>
        <div style={sectionTitle}>EARNINGS CALCULATOR</div>

        <div
          style={{
            border: `1px solid ${THEME.borderColor}`,
            padding: "32px 28px",
            background: "#0f0e0b",
          }}
        >
          {/* Notional size */}
          <div style={{ marginBottom: 24 }}>
            <div
              style={{
                fontFamily: FONTS.mono,
                fontSize: "0.68rem",
                fontWeight: 600,
                color: THEME.muted,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 10,
              }}
            >
              NOTIONAL SIZE
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 0 }}>
              {notionalOptions.map((n) => (
                <button
                  key={n}
                  onClick={() => setNotional(n)}
                  style={btnGroupStyle(notional === n)}
                >
                  ${(n / 1000).toFixed(0)}K
                </button>
              ))}
            </div>
          </div>

          {/* Pair selector */}
          <div style={{ marginBottom: 28 }}>
            <div
              style={{
                fontFamily: FONTS.mono,
                fontSize: "0.68rem",
                fontWeight: 600,
                color: THEME.muted,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 10,
              }}
            >
              SELECT PAIR
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 0 }}>
              {topTickers.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTicker(t)}
                  style={btnGroupStyle(selectedTicker === t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Output cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 0,
              border: `1px solid ${THEME.borderColor}`,
            }}
          >
            {earnings.map((e, i) => (
              <div
                key={e.label}
                style={{
                  ...outputCard,
                  borderLeft: i === 0 ? "none" : `1px solid ${THEME.borderColor}`,
                  borderTop: "none",
                  borderBottom: "none",
                  borderRight: "none",
                }}
              >
                <div
                  style={{
                    fontFamily: FONTS.mono,
                    fontSize: "0.62rem",
                    fontWeight: 500,
                    color: THEME.muted,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom: 8,
                  }}
                >
                  {e.label}
                </div>
                <div
                  style={{
                    fontFamily: FONTS.mono,
                    fontSize: e.label === "DAILY EARNINGS" ? "1.6rem" : "1.25rem",
                    fontWeight: 700,
                    color: THEME.positive,
                  }}
                >
                  {fmtDollar(e.value)}
                </div>
              </div>
            ))}
          </div>

          {/* Context line */}
          <div
            style={{
              marginTop: 16,
              fontFamily: FONTS.body,
              fontSize: "0.8rem",
              color: `${THEME.text}88`,
              lineHeight: 1.5,
            }}
          >
            Based on current spread of {spread.toFixed(1)}% APR between Variational
            and {exchange ? exchange.charAt(0).toUpperCase() + exchange.slice(1) : "CEX"}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═════════════════════════════════════════════════════════════════════
   7. HISTORICAL CHART (SVG)
   ═════════════════════════════════════════════════════════════════════ */
function HistoricalChart({ opportunities }) {
  const topTickers = useMemo(
    () => (opportunities || []).slice(0, 6).map((o) => o.ticker),
    [opportunities]
  );
  const [selectedTicker, setSelectedTicker] = useState(topTickers[0] || "BTC");
  const { series, loading } = useHistoricalRates(selectedTicker);

  const W = 800;
  const H = 320;
  const PAD = { top: 30, right: 20, bottom: 50, left: 60 };
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;

  const exchangeColors = {
    variational: THEME.accent,
    binance: "#e8e0d0",
    bybit: "#60a5fa",
    hyperliquid: "#a855f7",
  };

  const chartData = useMemo(() => {
    if (!series) return null;
    const allRates = [];
    for (const key of Object.keys(series)) {
      for (const pt of series[key]) {
        allRates.push(pt.rate);
      }
    }
    if (allRates.length === 0) return null;
    const minRate = Math.min(...allRates);
    const maxRate = Math.max(...allRates);
    const range = maxRate - minRate || 1;
    const padded = { min: minRate - range * 0.08, max: maxRate + range * 0.08 };
    const totalRange = padded.max - padded.min || 1;

    function toPath(points) {
      return points
        .map((pt, i) => {
          const x = PAD.left + (i / (points.length - 1)) * plotW;
          const y = PAD.top + plotH - ((pt.rate - padded.min) / totalRange) * plotH;
          return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
        })
        .join(" ");
    }

    const paths = {};
    for (const [key, points] of Object.entries(series)) {
      paths[key] = toPath(points);
    }

    // Y axis ticks
    const yTicks = [];
    const step = totalRange / 5;
    for (let i = 0; i <= 5; i++) {
      const val = padded.min + step * i;
      const y = PAD.top + plotH - (i / 5) * plotH;
      yTicks.push({ val, y });
    }

    // X axis labels (7 days)
    const xLabels = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(Date.now() - (6 - d) * 24 * 3600000);
      const label = `${date.getDate()} ${["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"][date.getMonth()]}`;
      const x = PAD.left + (d / 6) * plotW;
      xLabels.push({ label, x });
    }

    return { paths, yTicks, xLabels };
  }, [series]);

  const btnStyle = (active) => ({
    fontFamily: FONTS.mono,
    fontSize: "0.75rem",
    fontWeight: active ? 700 : 500,
    color: active ? "#000" : THEME.text,
    background: active ? THEME.accent : "transparent",
    border: `1px solid ${active ? THEME.accent : THEME.borderColor}`,
    padding: "6px 16px",
    cursor: "pointer",
    letterSpacing: "0.04em",
  });

  return (
    <section style={{ padding: "60px 0", borderBottom: `1px solid ${THEME.borderColor}` }}>
      <div style={container}>
        <div style={sectionLabel}>SECTION 04</div>
        <div style={sectionTitle}>
          RATE HISTORY &mdash; {selectedTicker}
        </div>

        {/* Ticker selector */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 0, marginBottom: 24 }}>
          {topTickers.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTicker(t)}
              style={btnStyle(selectedTicker === t)}
            >
              {t}
            </button>
          ))}
        </div>

        <div
          style={{
            border: `1px solid ${THEME.borderColor}`,
            background: THEME.cardBg,
            padding: "24px 20px 16px",
            overflowX: "auto",
          }}
        >
          {loading || !chartData ? (
            <div
              style={{
                height: 320,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: FONTS.mono,
                fontSize: "0.8rem",
                color: THEME.muted,
              }}
            >
              LOADING RATE DATA...
            </div>
          ) : (
            <svg
              viewBox={`0 0 ${W} ${H}`}
              style={{ width: "100%", height: "auto", maxHeight: 400, display: "block" }}
            >
              {/* Grid lines */}
              {chartData.yTicks.map((tick, i) => (
                <g key={i}>
                  <line
                    x1={PAD.left}
                    y1={tick.y}
                    x2={W - PAD.right}
                    y2={tick.y}
                    stroke={`${THEME.muted}22`}
                    strokeWidth={1}
                  />
                  <text
                    x={PAD.left - 8}
                    y={tick.y + 4}
                    textAnchor="end"
                    fill={THEME.muted}
                    fontFamily={FONTS.mono}
                    fontSize={10}
                  >
                    {tick.val.toFixed(1)}%
                  </text>
                </g>
              ))}

              {/* X axis labels */}
              {chartData.xLabels.map((lbl, i) => (
                <text
                  key={i}
                  x={lbl.x}
                  y={H - PAD.bottom + 20}
                  textAnchor="middle"
                  fill={THEME.muted}
                  fontFamily={FONTS.mono}
                  fontSize={10}
                >
                  {lbl.label}
                </text>
              ))}

              {/* Data lines */}
              {Object.entries(chartData.paths).map(([exchange, path]) => (
                <path
                  key={exchange}
                  d={path}
                  fill="none"
                  stroke={exchangeColors[exchange] || THEME.text}
                  strokeWidth={exchange === "variational" ? 2.5 : 1.5}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  opacity={exchange === "variational" ? 1 : 0.7}
                />
              ))}

              {/* Axis lines */}
              <line
                x1={PAD.left}
                y1={PAD.top}
                x2={PAD.left}
                y2={PAD.top + plotH}
                stroke={`${THEME.muted}44`}
                strokeWidth={1}
              />
              <line
                x1={PAD.left}
                y1={PAD.top + plotH}
                x2={W - PAD.right}
                y2={PAD.top + plotH}
                stroke={`${THEME.muted}44`}
                strokeWidth={1}
              />
            </svg>
          )}

          {/* Legend */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 20,
              marginTop: 16,
              paddingTop: 12,
              borderTop: `1px solid ${THEME.borderColor}`,
            }}
          >
            {Object.entries(exchangeColors).map(([name, color]) => (
              <div
                key={name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontFamily: FONTS.mono,
                  fontSize: "0.68rem",
                  color: THEME.muted,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: color,
                    display: "inline-block",
                    flexShrink: 0,
                  }}
                />
                {name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═════════════════════════════════════════════════════════════════════
   8. HOW IT WORKS
   ═════════════════════════════════════════════════════════════════════ */
function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "IDENTIFY",
      desc: "Find assets where Variational's funding rate diverges from CEX rates. Larger spreads = more profit potential.",
    },
    {
      num: "02",
      title: "HEDGE",
      desc: "Go short where the funding rate is positive (collect payments), long on the other exchange. Delta-neutral = market-neutral.",
    },
    {
      num: "03",
      title: "COLLECT",
      desc: "Funding payments settle every 1-8 hours. Your hedged position earns the spread automatically, regardless of price direction.",
    },
  ];

  return (
    <section style={{ padding: "60px 0", borderBottom: `1px solid ${THEME.borderColor}` }}>
      <div style={container}>
        <div style={sectionLabel}>SECTION 05</div>
        <div style={sectionTitle}>HOW FUNDING RATE ARB WORKS</div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 0,
            border: `1px solid ${THEME.borderColor}`,
          }}
        >
          {steps.map((s, i) => (
            <div
              key={s.num}
              style={{
                padding: "28px 24px",
                borderRight:
                  i < steps.length - 1
                    ? `1px solid ${THEME.borderColor}`
                    : "none",
                animation: `rates-fade-in 0.5s ease ${i * 0.15}s both`,
              }}
            >
              <div
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: "2rem",
                  fontWeight: 700,
                  color: `${THEME.accent}44`,
                  marginBottom: 8,
                  lineHeight: 1,
                }}
              >
                {s.num}
              </div>
              <div
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  color: THEME.accent,
                  letterSpacing: "0.08em",
                  marginBottom: 12,
                }}
              >
                {s.title}
              </div>
              <div
                style={{
                  fontFamily: FONTS.body,
                  fontSize: "0.85rem",
                  color: `${THEME.text}bb`,
                  lineHeight: 1.65,
                }}
              >
                {s.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═════════════════════════════════════════════════════════════════════
   8b. TOOL LINKS
   ═════════════════════════════════════════════════════════════════════ */
function ToolLinks() {
  const linkStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 20px",
    border: `1px solid ${THEME.borderColor}`,
    background: "transparent",
    color: THEME.muted,
    fontFamily: FONTS.mono,
    fontSize: "0.78rem",
    textDecoration: "none",
    transition: "all 0.2s",
  };

  return (
    <section style={{ padding: "0 0 24px", textAlign: "center" }}>
      <div style={{ ...container, display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
        <a
          href="/compare"
          style={linkStyle}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#FFB800"; e.currentTarget.style.color = "#FFB800"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = THEME.borderColor; e.currentTarget.style.color = THEME.muted; }}
        >
          Compare All DEXs &rarr;
        </a>
        <a
          href="/liquidations"
          style={linkStyle}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#00FF41"; e.currentTarget.style.color = "#00FF41"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = THEME.borderColor; e.currentTarget.style.color = THEME.muted; }}
        >
          Liquidation Monitor &rarr;
        </a>
      </div>
    </section>
  );
}

/* ═════════════════════════════════════════════════════════════════════
   9. CTA FOOTER
   ═════════════════════════════════════════════════════════════════════ */
function CTAFooter() {
  const weeksRemaining = getWeeksRemaining();

  return (
    <section style={{ padding: "60px 0 24px", textAlign: "center" }}>
      <div style={container}>
        <div
          style={{
            fontFamily: FONTS.heading,
            fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
            fontWeight: 700,
            color: THEME.accent,
            marginBottom: 20,
            lineHeight: 1.3,
          }}
        >
          Start capturing funding rate alpha.
        </div>
        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: "0.82rem",
            color: THEME.muted,
            marginBottom: 6,
          }}
        >
          Access code:
        </div>
        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: "1.4rem",
            fontWeight: 700,
            color: THEME.text,
            letterSpacing: "0.15em",
            marginBottom: 12,
          }}
        >
          {REFERRAL_CODE}
        </div>
        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: "0.85rem",
            color: THEME.accent,
            marginBottom: 28,
          }}
        >
          {weeksRemaining} weeks until points program closes
        </div>
        <a
          href={REFERRAL_LINK}
          target="_blank"
          rel="noopener noreferrer"
          style={{ ...ctaButton, fontSize: "1rem", padding: "16px 48px" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#f59e0b"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = THEME.accent; }}
        >
          OPEN POSITION &rarr;
        </a>
      </div>
    </section>
  );
}

/* ═════════════════════════════════════════════════════════════════════
   10. DISCLAIMER
   ═════════════════════════════════════════════════════════════════════ */
function Disclaimer() {
  return (
    <div
      style={{
        padding: "24px",
        maxWidth: 1200,
        margin: "0 auto",
      }}
    >
      <p
        style={{
          fontFamily: FONTS.body,
          fontSize: "0.68rem",
          color: `${THEME.text}55`,
          lineHeight: 1.7,
          textAlign: "center",
          maxWidth: 800,
          margin: "0 auto",
        }}
      >
        Funding rates are snapshots and change every funding interval. Actual execution
        requires accounting for spreads, slippage, gas costs, and margin requirements.
        Historical rates do not guarantee future returns. Not financial advice.
      </p>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════════
   MAIN PAGE EXPORT
   ═════════════════════════════════════════════════════════════════════ */
export default function RatesTheme() {
  const [ready, setReady] = useState(false);
  const { data, loading } = useRatesData();

  useEffect(() => {
    injectGlobalStyles();
    const t = setTimeout(() => setReady(true), 50);
    return () => clearTimeout(t);
  }, []);

  if (!ready || loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: THEME.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: THEME.accent,
          fontFamily: "monospace",
          fontSize: "0.9rem",
        }}
      >
        LOADING RATES...
      </div>
    );
  }

  const { opportunities, summary } = data;

  return (
    <div style={pageWrap}>
      <TopBar />
      <TickerBanner opportunities={opportunities} />
      <SummaryStats summary={summary} />
      <Hero />
      <OpportunitiesTable opportunities={opportunities} />
      <EarningsCalculator opportunities={opportunities} />
      <HistoricalChart opportunities={opportunities} />
      <HowItWorks />
      <ToolLinks />
      <CTAFooter />
      <Disclaimer />
      <Footer theme={THEME} />
    </div>
  );
}
