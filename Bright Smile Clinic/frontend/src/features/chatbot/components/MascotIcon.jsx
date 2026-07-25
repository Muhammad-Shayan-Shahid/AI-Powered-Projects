// Robot mascot SVG poses, imported from the Bright Smile Claude Design project
// ("Chat Widget.dc.html", v2). Shapes/colors are reproduced exactly as designed —
// the only additions are the blink toggle on the idle pose's eyes (a scaleY
// transform on a wrapping <g>, see useMascot.js) and the CSS animation classes
// applied by the caller (float/dance/bounce-intro all live in app.css).
const ABS_FILL = { width: '100%', height: '100%', position: 'absolute', inset: 0 };

function EntranceFrame() {
  return (
    <svg viewBox="0 0 100 100" style={ABS_FILL}>
      <g transform="rotate(-7 50 55)">
        <path d="M13,46 Q7,52 13,58" stroke="oklch(78% 0.12 35)" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.55" />
        <path d="M87,46 Q93,52 87,58" stroke="oklch(78% 0.12 35)" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.55" />
        <ellipse cx="50" cy="92" rx="19" ry="4.2" fill="oklch(16% 0.035 195 / 0.14)" />
        <path d="M50,16 Q42,10 44,4" stroke="oklch(46% 0.14 35)" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="44" cy="4" r="4.5" fill="oklch(70% 0.16 35)" stroke="oklch(46% 0.14 35)" strokeWidth="1.3" />
        <rect x="16" y="52" width="11" height="24" rx="5.5" fill="oklch(78% 0.12 35)" stroke="oklch(46% 0.14 35)" strokeWidth="2" />
        <rect x="73" y="52" width="11" height="24" rx="5.5" fill="oklch(78% 0.12 35)" stroke="oklch(46% 0.14 35)" strokeWidth="2" />
        <rect x="33" y="82" width="13" height="9" rx="4.5" fill="oklch(78% 0.12 35)" stroke="oklch(46% 0.14 35)" strokeWidth="2" />
        <rect x="54" y="82" width="13" height="9" rx="4.5" fill="oklch(78% 0.12 35)" stroke="oklch(46% 0.14 35)" strokeWidth="2" />
        <rect x="24" y="48" width="52" height="36" rx="16" fill="oklch(78% 0.12 35)" stroke="oklch(46% 0.14 35)" strokeWidth="2.5" />
        <rect x="44" y="42" width="12" height="8" fill="oklch(78% 0.12 35)" stroke="oklch(46% 0.14 35)" strokeWidth="1.5" />
        <circle cx="50" cy="65.5" r="6.5" fill="oklch(80% 0.14 35)" opacity="0.55" style={{ filter: 'blur(1px)' }} />
        <circle cx="50" cy="65.5" r="4" fill="oklch(70% 0.16 35)" stroke="oklch(46% 0.14 35)" strokeWidth="1.3" />
        <rect x="28" y="16" width="44" height="28" rx="13" fill="oklch(78% 0.12 35)" stroke="oklch(46% 0.14 35)" strokeWidth="2.5" />
        <rect x="36" y="25" width="9" height="12" rx="4.5" fill="oklch(32% 0.1 35)" />
        <rect x="55" y="25" width="9" height="12" rx="4.5" fill="oklch(32% 0.1 35)" />
        <rect x="38.3" y="27.5" width="3" height="4" rx="1.5" fill="oklch(78% 0.16 35)" opacity="0.9" style={{ filter: 'blur(0.4px)' }} />
        <rect x="57.3" y="27.5" width="3" height="4" rx="1.5" fill="oklch(78% 0.16 35)" opacity="0.9" style={{ filter: 'blur(0.4px)' }} />
        <rect x="42" y="39" width="16" height="3.5" rx="1.75" fill="oklch(46% 0.14 35)" opacity="0.7" />
      </g>
    </svg>
  );
}

function IdleFrame({ isBlinking, animate }) {
  return (
    <svg viewBox="0 0 100 100" style={ABS_FILL} className={animate ? 'animate-mascot-float' : ''}>
      <ellipse cx="50" cy="92" rx="19" ry="4.2" fill="oklch(16% 0.035 195 / 0.14)" />
      <line x1="50" y1="16" x2="50" y2="6" stroke="oklch(46% 0.14 35)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="50" cy="5" r="4.5" fill="oklch(70% 0.16 35)" stroke="oklch(46% 0.14 35)" strokeWidth="1.3" />
      <rect x="16" y="52" width="11" height="24" rx="5.5" fill="oklch(78% 0.12 35)" stroke="oklch(46% 0.14 35)" strokeWidth="2" />
      <rect x="73" y="52" width="11" height="24" rx="5.5" fill="oklch(78% 0.12 35)" stroke="oklch(46% 0.14 35)" strokeWidth="2" />
      <rect x="33" y="82" width="13" height="9" rx="4.5" fill="oklch(78% 0.12 35)" stroke="oklch(46% 0.14 35)" strokeWidth="2" />
      <rect x="54" y="82" width="13" height="9" rx="4.5" fill="oklch(78% 0.12 35)" stroke="oklch(46% 0.14 35)" strokeWidth="2" />
      <rect x="24" y="48" width="52" height="36" rx="16" fill="oklch(78% 0.12 35)" stroke="oklch(46% 0.14 35)" strokeWidth="2.5" />
      <rect x="44" y="42" width="12" height="8" fill="oklch(78% 0.12 35)" stroke="oklch(46% 0.14 35)" strokeWidth="1.5" />
      <circle cx="50" cy="65.5" r="6.5" fill="oklch(80% 0.14 35)" opacity="0.55" style={{ filter: 'blur(1px)' }} />
      <circle cx="50" cy="65.5" r="4" fill="oklch(70% 0.16 35)" stroke="oklch(46% 0.14 35)" strokeWidth="1.3" />
      <rect x="28" y="16" width="44" height="28" rx="13" fill="oklch(78% 0.12 35)" stroke="oklch(46% 0.14 35)" strokeWidth="2.5" />
      <g
        style={{
          transform: isBlinking ? 'scaleY(0.15)' : 'scaleY(1)',
          transformOrigin: '40.5px 31px',
          transition: 'transform 90ms ease-in-out',
        }}
      >
        <rect x="36" y="25" width="9" height="12" rx="4.5" fill="oklch(32% 0.1 35)" />
        <rect x="38.3" y="27.5" width="3" height="4" rx="1.5" fill="oklch(78% 0.16 35)" opacity="0.9" style={{ filter: 'blur(0.4px)' }} />
      </g>
      <g
        style={{
          transform: isBlinking ? 'scaleY(0.15)' : 'scaleY(1)',
          transformOrigin: '59.5px 31px',
          transition: 'transform 90ms ease-in-out',
        }}
      >
        <rect x="55" y="25" width="9" height="12" rx="4.5" fill="oklch(32% 0.1 35)" />
        <rect x="57.3" y="27.5" width="3" height="4" rx="1.5" fill="oklch(78% 0.16 35)" opacity="0.9" style={{ filter: 'blur(0.4px)' }} />
      </g>
      <rect x="42" y="39" width="16" height="3.5" rx="1.75" fill="oklch(46% 0.14 35)" opacity="0.7" />
    </svg>
  );
}

function DanceFrame({ animate }) {
  return (
    <svg viewBox="0 0 100 100" style={ABS_FILL} className={animate ? 'animate-mascot-dance' : ''}>
      <g transform="rotate(-9 50 55)">
        <ellipse cx="50" cy="92" rx="19" ry="4.2" fill="oklch(16% 0.035 195 / 0.14)" />
        <path d="M27,58 Q17,46 21,33" stroke="oklch(78% 0.12 35)" strokeWidth="11" fill="none" strokeLinecap="round" />
        <path d="M27,58 Q17,46 21,33" stroke="oklch(46% 0.14 35)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M73,58 Q84,68 90,80" stroke="oklch(78% 0.12 35)" strokeWidth="11" fill="none" strokeLinecap="round" />
        <path d="M73,58 Q84,68 90,80" stroke="oklch(46% 0.14 35)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <rect x="30" y="83" width="13" height="9" rx="4.5" fill="oklch(78% 0.12 35)" stroke="oklch(46% 0.14 35)" strokeWidth="2" transform="rotate(-8 36 87)" />
        <rect x="57" y="83" width="13" height="9" rx="4.5" fill="oklch(78% 0.12 35)" stroke="oklch(46% 0.14 35)" strokeWidth="2" transform="rotate(10 63 87)" />
        <rect x="24" y="48" width="52" height="36" rx="16" fill="oklch(78% 0.12 35)" stroke="oklch(46% 0.14 35)" strokeWidth="2.5" />
        <rect x="44" y="42" width="12" height="8" fill="oklch(78% 0.12 35)" stroke="oklch(46% 0.14 35)" strokeWidth="1.5" />
        <circle cx="50" cy="65.5" r="7" fill="oklch(80% 0.14 35)" opacity="0.65" style={{ filter: 'blur(1px)' }} />
        <circle cx="50" cy="65.5" r="4" fill="oklch(70% 0.16 35)" stroke="oklch(46% 0.14 35)" strokeWidth="1.3" />
        <g transform="rotate(9 50 30)">
          <path d="M50,16 Q59,9 56,3" stroke="oklch(46% 0.14 35)" strokeWidth="3" fill="none" strokeLinecap="round" />
          <circle cx="56" cy="3" r="4.5" fill="oklch(70% 0.16 35)" stroke="oklch(46% 0.14 35)" strokeWidth="1.3" />
          <rect x="28" y="16" width="44" height="28" rx="13" fill="oklch(78% 0.12 35)" stroke="oklch(46% 0.14 35)" strokeWidth="2.5" />
          <rect x="36" y="25" width="9" height="12" rx="4.5" fill="oklch(32% 0.1 35)" />
          <rect x="55" y="25" width="9" height="12" rx="4.5" fill="oklch(32% 0.1 35)" />
          <rect x="38.3" y="27.5" width="3" height="4" rx="1.5" fill="oklch(78% 0.16 35)" opacity="0.9" style={{ filter: 'blur(0.4px)' }} />
          <rect x="57.3" y="27.5" width="3" height="4" rx="1.5" fill="oklch(78% 0.16 35)" opacity="0.9" style={{ filter: 'blur(0.4px)' }} />
          <rect x="41" y="38" width="18" height="4" rx="2" fill="oklch(46% 0.14 35)" opacity="0.75" />
        </g>
      </g>
    </svg>
  );
}

function WaveFrame() {
  return (
    <svg viewBox="0 0 100 100" style={ABS_FILL}>
      <ellipse cx="50" cy="92" rx="19" ry="4.2" fill="oklch(16% 0.035 195 / 0.14)" />
      <line x1="50" y1="16" x2="50" y2="6" stroke="oklch(46% 0.14 35)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="50" cy="5" r="4.5" fill="oklch(70% 0.16 35)" stroke="oklch(46% 0.14 35)" strokeWidth="1.3" />
      <rect x="16" y="52" width="11" height="24" rx="5.5" fill="oklch(78% 0.12 35)" stroke="oklch(46% 0.14 35)" strokeWidth="2" />
      <path d="M72,52 Q82,40 78,26" stroke="oklch(78% 0.12 35)" strokeWidth="11" fill="none" strokeLinecap="round" />
      <path d="M72,52 Q82,40 78,26" stroke="oklch(46% 0.14 35)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <circle cx="78" cy="24" r="7" fill="oklch(78% 0.12 35)" stroke="oklch(46% 0.14 35)" strokeWidth="2" />
      <rect x="33" y="82" width="13" height="9" rx="4.5" fill="oklch(78% 0.12 35)" stroke="oklch(46% 0.14 35)" strokeWidth="2" />
      <rect x="54" y="82" width="13" height="9" rx="4.5" fill="oklch(78% 0.12 35)" stroke="oklch(46% 0.14 35)" strokeWidth="2" />
      <rect x="24" y="48" width="52" height="36" rx="16" fill="oklch(78% 0.12 35)" stroke="oklch(46% 0.14 35)" strokeWidth="2.5" />
      <rect x="44" y="42" width="12" height="8" fill="oklch(78% 0.12 35)" stroke="oklch(46% 0.14 35)" strokeWidth="1.5" />
      <circle cx="50" cy="65.5" r="6.5" fill="oklch(85% 0.08 35)" opacity="0.55" />
      <circle cx="50" cy="65.5" r="4" fill="oklch(70% 0.16 35)" stroke="oklch(46% 0.14 35)" strokeWidth="1.3" />
      <rect x="28" y="16" width="44" height="28" rx="13" fill="oklch(78% 0.12 35)" stroke="oklch(46% 0.14 35)" strokeWidth="2.5" />
      <rect x="36" y="25" width="9" height="12" rx="4.5" fill="oklch(32% 0.1 35)" />
      <rect x="55" y="25" width="9" height="12" rx="4.5" fill="oklch(32% 0.1 35)" />
      <rect x="38.3" y="27.5" width="3" height="4" rx="1.5" fill="oklch(78% 0.16 35)" opacity="0.9" style={{ filter: 'blur(0.4px)' }} />
      <rect x="57.3" y="27.5" width="3" height="4" rx="1.5" fill="oklch(78% 0.16 35)" opacity="0.9" style={{ filter: 'blur(0.4px)' }} />
      <rect x="42" y="39" width="16" height="3.5" rx="1.75" fill="oklch(46% 0.14 35)" opacity="0.7" />
    </svg>
  );
}

// Static mini version used docked beside the chat panel header while open —
// same face/antenna motif as the floating mascot, just a fixed simplified pose.
export function MascotHeaderIcon() {
  return (
    <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
      <line x1="50" y1="22" x2="50" y2="13" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="50" cy="12" r="3.5" fill="oklch(78% 0.12 35)" stroke="white" strokeWidth="1.3" />
      <rect x="30" y="22" width="40" height="26" rx="12" fill="oklch(96.5% 0.02 35)" stroke="white" strokeWidth="2" />
      <rect x="38" y="30" width="8" height="10" rx="4" fill="oklch(46% 0.14 35)" />
      <rect x="54" y="30" width="8" height="10" rx="4" fill="oklch(46% 0.14 35)" />
      <rect x="43" y="42" width="14" height="3" rx="1.5" fill="white" opacity="0.85" />
    </svg>
  );
}

export default function MascotIcon({ pose, isBlinking, animationsEnabled }) {
  if (pose === 'entrance') return <EntranceFrame />;
  if (pose === 'dance') return <DanceFrame animate={animationsEnabled} />;
  if (pose === 'wave') return <WaveFrame />;
  return <IdleFrame isBlinking={isBlinking} animate={animationsEnabled} />;
}
