import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

// Mirrors the chatbot feature's hook of the same name — kept as a small local
// copy here rather than a cross-feature import, per this codebase's
// per-feature hooks/ convention (see useRevealOnScroll.js in this folder).
export function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(QUERY).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(QUERY);
    const handleChange = (e) => setPrefersReducedMotion(e.matches);
    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}
