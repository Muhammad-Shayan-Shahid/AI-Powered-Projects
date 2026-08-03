import { ImageIcon, PlayCircle } from 'lucide-react'

/**
 * Flexible placeholder for images/video that will be swapped with real
 * assets later. Fills its parent completely (absolute inset-0) so callers
 * control the actual box size/aspect-ratio via a wrapping element — that
 * way dropping in a real <img>/<video> later never breaks the layout.
 */
export default function PlaceholderBox({
  label = 'IMAGE',
  type = 'image',
  className = '',
}) {
  const Icon = type === 'video' ? PlayCircle : ImageIcon

  return (
    <div
      className={`absolute inset-0 flex flex-col items-center justify-center gap-3 overflow-hidden rounded-[inherit] border border-dashed border-white/15 bg-[linear-gradient(135deg,#1b1b22_0%,#131318_60%)] ${className}`}
    >
      <div className="absolute inset-0 opacity-[0.06] grid-glow" />
      <Icon size={32} strokeWidth={1.5} className="text-muted" />
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
        {label}
      </span>
    </div>
  )
}
