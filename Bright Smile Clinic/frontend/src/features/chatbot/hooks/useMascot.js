import { useCallback, useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

const ENTRANCE_SESSION_KEY = 'chatbotMascotEntrancePlayed';
// Matches the bounce-intro CSS animation exactly (1200ms delay + 2x700ms cycles,
// see --animate-chat-bubble-intro in app.css) so the frame swaps to idle right
// as the bounce finishes, instead of cutting it off mid-motion.
const ENTRANCE_DURATION_MS = 2600;
const GREETING_DURATION_MS = 500;
const DANCE_BREAK_MIN_MS = 10000;
const DANCE_BREAK_MAX_MS = 15000;
const DANCE_DURATION_MS = 1500;
const BLINK_MIN_MS = 3000;
const BLINK_MAX_MS = 6000;
const BLINK_DURATION_MS = 160;

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function getInitialPose(prefersReducedMotion) {
  if (prefersReducedMotion || typeof window === 'undefined') return 'idle';
  return window.sessionStorage.getItem(ENTRANCE_SESSION_KEY) ? 'idle' : 'entrance';
}

// Drives the mascot's discrete pose state machine (entrance/idle/dance/wave).
// Every visual effect is a plain CSS transform/opacity animation applied via a
// class or inline style (see app.css) -- this hook only ever decides *when* a
// pose swaps, it never animates a value itself (no JS-driven physics/rAF loops).
export function useMascot(isChatOpen) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [pose, setPose] = useState(() => getInitialPose(prefersReducedMotion));
  const [isBlinking, setIsBlinking] = useState(false);
  const greetingTimerRef = useRef(null);

  // entrance -> idle, once, remembered for the rest of the browser session
  // (sessionStorage, not localStorage -- a new tab/session should see it again).
  useEffect(() => {
    if (pose !== 'entrance') return undefined;
    const timer = setTimeout(() => {
      window.sessionStorage.setItem(ENTRANCE_SESSION_KEY, '1');
      setPose('idle');
    }, ENTRANCE_DURATION_MS);
    return () => clearTimeout(timer);
  }, [pose]);

  // Schedule the next dance break with a fresh random delay whenever we're
  // idle and the chat is closed. Closing the chat, opening it, or the dance
  // itself starting all change a dependency here, which cancels the pending
  // timer via the effect's cleanup -- that's what "pauses" the loop.
  useEffect(() => {
    if (prefersReducedMotion || isChatOpen || pose !== 'idle') return undefined;
    const timer = setTimeout(() => setPose('dance'), randomBetween(DANCE_BREAK_MIN_MS, DANCE_BREAK_MAX_MS));
    return () => clearTimeout(timer);
  }, [isChatOpen, pose, prefersReducedMotion]);

  // dance -> idle after its animation finishes.
  useEffect(() => {
    if (pose !== 'dance') return undefined;
    const timer = setTimeout(() => setPose('idle'), DANCE_DURATION_MS);
    return () => clearTimeout(timer);
  }, [pose]);

  // Occasional blink, only while calmly idle.
  useEffect(() => {
    if (prefersReducedMotion || pose !== 'idle' || isBlinking) return undefined;
    const timer = setTimeout(() => setIsBlinking(true), randomBetween(BLINK_MIN_MS, BLINK_MAX_MS));
    return () => clearTimeout(timer);
  }, [pose, isBlinking, prefersReducedMotion]);

  useEffect(() => {
    if (!isBlinking) return undefined;
    const timer = setTimeout(() => setIsBlinking(false), BLINK_DURATION_MS);
    return () => clearTimeout(timer);
  }, [isBlinking]);

  // Safety net: whatever pose we were in, closing the chat always settles
  // back to a calm idle float (entrance is left alone so a close during the
  // very first load doesn't cut off the one-time intro).
  useEffect(() => {
    if (isChatOpen) return;
    setPose((current) => (current === 'entrance' ? current : 'idle'));
  }, [isChatOpen]);

  useEffect(() => () => clearTimeout(greetingTimerRef.current), []);

  // Plays the greeting/wave pose briefly, then hands off to the caller to
  // actually open the chat panel (see useChatbot's open()).
  const playGreetingThenOpen = useCallback(
    (onOpen) => {
      if (prefersReducedMotion) {
        onOpen();
        return;
      }
      setPose('wave');
      greetingTimerRef.current = setTimeout(() => {
        setPose('idle');
        onOpen();
      }, GREETING_DURATION_MS);
    },
    [prefersReducedMotion]
  );

  return { pose, isBlinking: isBlinking && !prefersReducedMotion, prefersReducedMotion, playGreetingThenOpen };
}
