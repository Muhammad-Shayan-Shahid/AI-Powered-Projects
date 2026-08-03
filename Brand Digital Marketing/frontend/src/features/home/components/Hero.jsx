import { motion } from 'framer-motion'
import { Sparkles, Star } from 'lucide-react'
import Button from '../../../components/Button'
import heroBanner from '../../../assets/hero-banner.webp'

const headline = ['Marketing', 'that', 'actually', 'stops', 'the', 'scroll.']

const wordVariants = {
  hidden: { opacity: 0, y: 32, rotateX: -40 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { delay: 0.15 + i * 0.08, duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden pb-20 pt-36 sm:pb-28 sm:pt-44">
      <div className="grid-glow pointer-events-none absolute inset-0 top-0 h-[700px]" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-accent/10 blur-[140px]" />

      <div className="relative mx-auto flex max-w-6xl flex-col items-center px-6 text-center sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-accent"
        >
          <Sparkles size={14} />
          MSH Services &mdash; Digital Marketing Studio
        </motion.div>

        <h1 className="font-display max-w-4xl text-[13vw] font-semibold leading-[0.98] tracking-tight text-ink sm:text-6xl md:text-7xl">
          {headline.map((word, i) => (
            <motion.span
              key={word + i}
              custom={i}
              initial="hidden"
              animate="show"
              variants={wordVariants}
              className={`mr-3 inline-block last:mr-0 ${
                word === 'stops' ? 'text-gradient' : ''
              }`}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mt-8 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
        >
          We design scroll-stopping banners and produce social media videos that
          turn casual scrollers into loyal customers &mdash; fast, bold, and
          built to convert.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.6 }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <Button to="/contact" size="lg">
            Start a Project
          </Button>
          <Button to="/portfolio" variant="secondary" size="lg" icon={false}>
            View Our Work
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-20 w-full max-w-4xl"
        >
          <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-border shadow-2xl">
            <img
              src={heroBanner}
              alt="MSH Services banner design"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>

          <motion.div
            animate={{ y: [0, -14, 0], rotate: [0, 4, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -left-6 -top-8 hidden items-center gap-2 rounded-2xl border border-border bg-surface px-4 py-3 shadow-xl backdrop-blur-xl sm:flex"
          >
            <Star size={16} className="fill-accent text-accent" />
            <span className="text-sm font-semibold text-ink">4.9/5 client rating</span>
          </motion.div>

          <motion.div
            animate={{ y: [0, 14, 0], rotate: [0, -3, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="absolute -bottom-8 -right-6 hidden items-center gap-2 rounded-2xl border border-border bg-surface px-4 py-3 shadow-xl backdrop-blur-xl sm:flex"
          >
            <span className="text-sm font-semibold text-ink">120+ projects delivered</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
