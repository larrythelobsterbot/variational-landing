import { useState, useEffect, useRef } from "react";

/**
 * Animated count-up number that triggers when scrolled into view.
 * Supports prefix (e.g. "$") and suffix (e.g. "B+", "M+", "K").
 *
 * Usage: <AnimatedCounter value={175} prefix="$" suffix="B+" duration={1800} />
 */
export default function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  duration = 1800,
  decimals = 0,
  style = {},
}) {
  const [display, setDisplay] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animate();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasAnimated]);

  function animate() {
    const start = performance.now();
    const end = value;

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(eased * end);
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        setDisplay(end);
      }
    }
    requestAnimationFrame(tick);
  }

  const formatted = decimals > 0 ? display.toFixed(decimals) : Math.round(display);

  return (
    <span ref={ref} style={style}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
