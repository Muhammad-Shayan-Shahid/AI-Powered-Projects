import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import PlaceholderBox from '../../../components/PlaceholderBox'
import { getPortfolioImage } from './portfolioAssets'

export default function Lightbox({ item, onClose, onPrev, onNext }) {
  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md sm:p-8"
          onClick={onClose}
        >
          <button
            onClick={onClose}
            aria-label="Close preview"
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:bg-white/10 sm:right-8 sm:top-8"
          >
            <X size={18} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              onPrev()
            }}
            aria-label="Previous"
            className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:bg-white/10 sm:left-8"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onNext()
            }}
            aria-label="Next"
            className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:bg-white/10 sm:right-8"
          >
            <ChevronRight size={20} />
          </button>

          <motion.div
            layoutId={`gallery-${item.id}`}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-surface"
          >
            <motion.div layoutId={`gallery-media-${item.id}`} className="relative aspect-video w-full">
              {getPortfolioImage(item.asset, 'lightbox') ? (
                <img
                  src={getPortfolioImage(item.asset, 'lightbox')}
                  alt={item.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <PlaceholderBox
                  label={item.type === 'video' ? 'VIDEO PREVIEW' : 'PROJECT IMAGE'}
                  type={item.type}
                />
              )}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.3 }}
              className="flex flex-col gap-1 p-6 text-left sm:p-8"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                {item.category} &middot; {item.client}
              </p>
              <h3 className="font-display text-2xl font-semibold text-ink">{item.title}</h3>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
