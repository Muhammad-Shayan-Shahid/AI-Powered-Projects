import { motion, AnimatePresence } from 'framer-motion'
import { Expand, PlayCircle } from 'lucide-react'
import PlaceholderBox from '../../../components/PlaceholderBox'
import { getPortfolioImage } from './portfolioAssets'

export default function GalleryGrid({ items, onSelect }) {
  return (
    <motion.div layout className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <AnimatePresence mode="popLayout">
        {items.map((item, i) => {
          const gridImage = getPortfolioImage(item.asset, 'grid')

          return (
            <motion.button
              key={item.id}
              layout
              layoutId={`gallery-${item.id}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.35, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => onSelect(item)}
              className="group relative aspect-4/3 w-full overflow-hidden rounded-2xl border border-border text-left"
            >
              <motion.div layoutId={`gallery-media-${item.id}`} className="absolute inset-0">
                {gridImage ? (
                  <img
                    src={gridImage}
                    alt={item.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <PlaceholderBox
                    label={item.type === 'video' ? 'VIDEO THUMBNAIL' : 'PROJECT IMAGE'}
                    type={item.type}
                  />
                )}
              </motion.div>

              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/10 to-transparent p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
                  {item.category}
                </p>
                <p className="mt-1 font-display text-base font-semibold text-white">
                  {item.title}
                </p>
              </div>

              <div className="absolute right-4 top-4 flex h-9 w-9 translate-y-1 items-center justify-center rounded-full bg-white/10 text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                {item.type === 'video' ? <PlayCircle size={16} /> : <Expand size={16} />}
              </div>
            </motion.button>
          )
        })}
      </AnimatePresence>
    </motion.div>
  )
}
