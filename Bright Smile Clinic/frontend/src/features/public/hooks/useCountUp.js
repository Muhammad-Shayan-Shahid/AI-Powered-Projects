import { useEffect, useState } from 'react';

// Animates 0 -> target once `start` flips true (paired with useRevealOnScroll
// so it fires when the stat scrolls into view), via requestAnimationFrame so
// it stays smooth independent of React's render cadence. Reduced-motion users
// get the final number immediately instead of a moving count.
export function useCountUp(target, { start, duration = 1300, prefersReducedMotion }) {
  const [value, setValue] = useState(prefersReducedMotion ? target : 0);

  useEffect(() => {
    if (!start) return undefined;

    if (prefersReducedMotion) {
      setValue(target);
      return undefined;
    }

    let raf;
    const startTime = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - (1 - progress) ** 3; // ease-out cubic
      setValue(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target, duration, prefersReducedMotion]);

  return value;
}
