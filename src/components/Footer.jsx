export default function Footer({ theme }) {
  return (
    <footer
      style={{
        textAlign: "center",
        padding: "24px 16px",
        fontSize: "0.75rem",
        color: `${theme.text}66`,
        borderTop: `1px solid ${theme.muted}22`,
        lineHeight: 1.6,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      Contains referral link. Author earns points from referred volume. Not financial advice. DYOR.
    </footer>
  );
}
