import { useNavigate } from "react-router-dom";

const TOOLS = [
  {
    path: "/rates",
    label: "Funding Rates",
    desc: "Live arb spreads",
    icon: (color) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
    ),
  },
  {
    path: "/compare",
    label: "DEX Compare",
    desc: "Protocol rankings",
    icon: (color) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    path: "/liquidations",
    label: "Liquidations",
    desc: "Risk heatmap",
    icon: (color) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
];

/**
 * Tool navigation buttons shown next to the Airdrop Calculator button on landing themes.
 * Accepts theme tokens for styling.
 */
export default function ToolButtons({ theme, fonts, layout = "row" }) {
  const navigate = useNavigate();

  const isRow = layout === "row";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isRow ? "row" : "column",
        gap: 10,
        flexWrap: "wrap",
      }}
    >
      {TOOLS.map((tool) => (
        <button
          key={tool.path}
          onClick={() => navigate(tool.path)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 18px",
            background: "transparent",
            border: `1px solid ${theme.muted}44`,
            borderRadius: 10,
            color: `${theme.text}cc`,
            fontFamily: fonts.body || fonts.heading,
            fontSize: "0.85rem",
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.2s",
            textAlign: "left",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = `${theme.accent}88`;
            e.currentTarget.style.background = `${theme.accent}0a`;
            e.currentTarget.style.color = theme.text;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = `${theme.muted}44`;
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = `${theme.text}cc`;
          }}
        >
          {tool.icon(theme.accent)}
          <span>
            {tool.label}
            {!isRow && (
              <span
                style={{
                  display: "block",
                  fontSize: "0.72rem",
                  color: theme.muted,
                  fontWeight: 400,
                  marginTop: 1,
                }}
              >
                {tool.desc}
              </span>
            )}
          </span>
        </button>
      ))}
    </div>
  );
}
