import { useEffect, useRef, useState } from 'react';

// Flips to visible once, the first time the element scrolls into view, then
// stops observing — mirrors the Home design's one-shot scroll-reveal effect.
// Global reduced-motion handling in app.css already collapses the resulting
// animate-fade-in-up transition for users who've asked for it.
export function useRevealOnScroll() {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}
