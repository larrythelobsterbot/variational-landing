import { useEffect } from "react";

/**
 * Sets document.title and meta description per route.
 */
const PAGE_META = {
  "/": {
    title: "Trade Perpetuals with Zero Fees | Variational",
    description:
      "Trade 500+ perpetual markets with zero fees, zero slippage, and complete execution privacy on Variational's RFQ engine. Built on Arbitrum.",
  },
  "/terminal": {
    title: "Trade in the Dark | Variational Terminal",
    description:
      "Zero fees. Zero slippage. Total stealth. Trade 500+ perpetual markets on Variational's private RFQ engine.",
  },
  "/bloomberg": {
    title: "Market Brief | Variational Protocol Analysis",
    description:
      "Bloomberg-style analysis of Variational's zero-fee perpetual trading infrastructure on Arbitrum.",
  },
  "/neon": {
    title: "Your Edge Stays Invisible | Variational",
    description:
      "Private execution, zero slippage, zero fees. Trade 500+ perpetual markets where your strategy stays yours.",
  },
  "/rates": {
    title: "Funding Rate Arbitrage Scanner | Variational Tools",
    description:
      "Live funding rate arbitrage opportunities between Variational and CEXs. Find spreads and estimate daily PnL.",
  },
  "/compare": {
    title: "Perp DEX Comparison | Variational Tools",
    description:
      "Live comparison of perpetual DEX protocols — volume, open interest, fees, TVL. Data from DefiLlama.",
  },
  "/liquidations": {
    title: "Liquidation Heatmap | Variational Tools",
    description:
      "Real-time liquidation level monitor across major perpetual markets. Visualize risk zones by leverage.",
  },
};

export default function PageMeta({ path }) {
  useEffect(() => {
    const meta = PAGE_META[path] || PAGE_META["/"];
    document.title = meta.title;

    let descTag = document.querySelector('meta[name="description"]');
    if (descTag) {
      descTag.setAttribute("content", meta.description);
    }

    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (canonicalTag) {
      canonicalTag.setAttribute(
        "href",
        `https://tryvariational.xyz${path === "/" ? "" : path}`
      );
    }
  }, [path]);

  return null;
}
