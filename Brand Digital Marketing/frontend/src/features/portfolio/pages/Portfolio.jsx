import { useMemo, useState } from 'react'
import Reveal from '../../../components/Reveal'
import FilterTabs from '../components/FilterTabs'
import GalleryGrid from '../components/GalleryGrid'
import Lightbox from '../components/Lightbox'
import { portfolioItems } from '../components/portfolioData'

export default function Portfolio() {
  const [active, setActive] = useState('All')
  const [selected, setSelected] = useState(null)

  const filtered = useMemo(
    () =>
      active === 'All'
        ? portfolioItems
        : portfolioItems.filter((item) => item.category === active),
    [active],
  )

  const goRelative = (offset) => {
    setSelected((current) => {
      if (!current) return current
      const index = filtered.findIndex((item) => item.id === current.id)
      const next = filtered[(index + offset + filtered.length) % filtered.length]
      return next
    })
  }

  return (
    <div className="pt-32 sm:pt-40">
      <section className="mx-auto max-w-6xl px-6 pb-12 text-center sm:px-8 sm:pb-16">
        <Reveal>
          <span className="inline-flex items-center rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Our Work
          </span>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 className="font-display mx-auto mt-6 max-w-3xl text-5xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl">
            A portfolio built on results
          </h1>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            A sample of banners and social videos we&rsquo;ve produced for
            brands across skincare, fitness, food, and retail.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24 sm:px-8 sm:pb-32">
        <Reveal className="mb-10 flex justify-center">
          <FilterTabs active={active} onChange={setActive} />
        </Reveal>

        <GalleryGrid items={filtered} onSelect={setSelected} />
      </section>

      <Lightbox
        item={selected}
        onClose={() => setSelected(null)}
        onPrev={() => goRelative(-1)}
        onNext={() => goRelative(1)}
      />
    </div>
  )
}
