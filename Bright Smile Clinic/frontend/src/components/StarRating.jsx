const STAR_INDICES = [0, 1, 2, 3, 4];

/**
 * Read-only 5-star rating display — each star is independently fillable
 * (e.g. 4.3 stars renders the 5th star 30% filled) via a clipped overlay
 * span, matching the Claude Design "StarRating" component pixel-for-pixel.
 */
export default function StarRating({ rating = 0, reviewCount, size = 'sm', showCount = true }) {
  const isLg = size === 'lg';
  const starSizeClass = isLg ? 'text-[1.375rem]' : 'text-[0.9375rem]';
  const gapClass = isLg ? 'gap-2.5' : 'gap-1.5';
  const labelClass = isLg ? 'text-base font-bold' : 'text-[0.8125rem] font-semibold';

  const label =
    reviewCount !== undefined && reviewCount !== null
      ? `${rating.toFixed(1)} (${reviewCount} review${Number(reviewCount) === 1 ? '' : 's'})`
      : rating.toFixed(1);

  return (
    <div className={`inline-flex items-center ${gapClass}`}>
      <div className="inline-flex gap-0.5">
        {STAR_INDICES.map((i) => {
          const fillPct = Math.max(0, Math.min(100, (rating - i) * 100));
          return (
            <span key={i} className={`relative inline-block leading-none text-[oklch(88%_0.008_90)] ${starSizeClass}`}>
              ★
              <span className="absolute left-0 top-0 overflow-hidden text-warning-text" style={{ width: `${fillPct}%` }}>
                ★
              </span>
            </span>
          );
        })}
      </div>
      {showCount && <span className={`text-warning-text ${labelClass}`}>{label}</span>}
    </div>
  );
}
