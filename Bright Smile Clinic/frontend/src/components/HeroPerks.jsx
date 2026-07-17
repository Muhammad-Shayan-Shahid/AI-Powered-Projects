export default function HeroPerks({ perks }) {
  return (
    <div className="flex flex-col gap-3.5">
      {perks.map((perk) => (
        <div key={perk} className="flex items-center gap-3">
          <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-white/15 text-[0.8125rem] font-bold">
            ✓
          </span>
          <span className="text-[0.9375rem] font-medium">{perk}</span>
        </div>
      ))}
    </div>
  );
}
