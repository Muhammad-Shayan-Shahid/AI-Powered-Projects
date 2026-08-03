import { motion } from 'framer-motion'
import Reveal from '../../../components/Reveal'
import Button from '../../../components/Button'

export default function CTASection() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 pb-24 sm:px-8 sm:pb-32">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] border border-border bg-surface px-8 py-16 text-center sm:px-16 sm:py-24">
          <div className="grid-glow pointer-events-none absolute inset-0" />
          <motion.div
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/20 blur-[120px]"
          />

          <div className="relative flex flex-col items-center">
            <h2 className="font-display max-w-2xl text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-5xl">
              Ready to make your brand impossible to scroll past?
            </h2>
            <p className="mt-5 max-w-md text-base text-muted sm:text-lg">
              Tell us about your project and we&rsquo;ll get back to you within one
              business day with next steps.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
              <Button to="/contact" size="lg">
                Get Your Free Quote
              </Button>
              <Button to="/pricing" variant="secondary" size="lg" icon={false}>
                See Pricing
              </Button>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
