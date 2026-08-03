import { motion } from 'framer-motion'
import { categories } from './portfolioData'

export default function FilterTabs({ active, onChange }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {categories.map((cat) => {
        const isActive = active === cat
        return (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className={`relative rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
              isActive ? 'text-bg' : 'text-muted hover:text-ink'
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="filter-pill"
                className="absolute inset-0 rounded-full bg-accent"
                transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              />
            )}
            <span className="relative">{cat}</span>
          </button>
        )
      })}
    </div>
  )
}
