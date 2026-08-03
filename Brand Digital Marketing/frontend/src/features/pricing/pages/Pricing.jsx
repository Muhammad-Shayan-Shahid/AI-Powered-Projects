import { motion } from 'framer-motion'
import { Check, Star } from 'lucide-react'
import Reveal from '../../../components/Reveal'
import Button from '../../../components/Button'
import { StaggerGroup, StaggerItem } from '../../../components/Stagger'

const plans = [
  {
    name: 'Starter',
    price: '$249',
    period: '/month',
    description: 'For small brands that need consistent, on-brand creative.',
    features: [
      '6 banner designs / month',
      '2 social media video edits',
      '2 rounds of revisions',
      'Delivery in 3–5 business days',
      'Shared asset drive',
    ],
    highlight: false,
  },
  {
    name: 'Growth',
    price: '$599',
    period: '/month',
    description: 'For growing brands running regular campaigns and launches.',
    features: [
      '16 banner designs / month',
      '6 social media video edits',
      'Unlimited revisions',
      'Delivery in 2–3 business days',
      'Dedicated creative lead',
      'Priority campaign support',
    ],
    highlight: true,
  },
  {
    name: 'Pro',
    price: '$1,199',
    period: '/month',
    description: 'For teams that need a full creative department on call.',
    features: [
      'Unlimited banner designs',
      '14 social media video edits',
      'Unlimited revisions',
      '24–48 hour delivery',
      'Dedicated creative lead',
      'Full brand kit & templates',
      'Monthly performance review',
    ],
    highlight: false,
  },
]

export default function Pricing() {
  return (
    <div className="pt-32 sm:pt-40">
      <section className="mx-auto max-w-6xl px-6 pb-16 text-center sm:px-8 sm:pb-20">
        <Reveal>
          <span className="inline-flex items-center rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Pricing
          </span>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 className="font-display mx-auto mt-6 max-w-3xl text-5xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl">
            Simple plans, no surprises
          </h1>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            Pick a plan that matches your content cadence. Every plan can be
            upgraded, downgraded, or paused any time — just get in touch.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-32 sm:px-8">
        <StaggerGroup className="grid grid-cols-1 items-start gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <StaggerItem key={plan.name}>
              <PlanCard plan={plan} />
            </StaggerItem>
          ))}
        </StaggerGroup>

        <Reveal delay={0.2}>
          <p className="mt-12 text-center text-sm text-muted">
            Need something custom? <span className="text-ink">One-off projects</span> and
            enterprise retainers are available too — reach out and let&rsquo;s
            talk scope.
          </p>
        </Reveal>
      </section>
    </div>
  )
}

function PlanCard({ plan }) {
  const { name, price, period, description, features, highlight } = plan

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className={`relative flex h-full flex-col rounded-3xl border p-8 ${
        highlight
          ? 'border-accent/50 bg-surface glow-accent'
          : 'border-border bg-surface'
      }`}
    >
      {highlight && (
        <div className="absolute -top-4 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-accent px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-bg">
          <Star size={12} className="fill-bg" />
          Most Popular
        </div>
      )}

      <h3 className="font-display text-xl font-semibold text-ink">{name}</h3>
      <p className="mt-2 text-sm text-muted">{description}</p>

      <div className="mt-6 flex items-end gap-1">
        <span className="font-display text-4xl font-semibold text-ink">{price}</span>
        <span className="pb-1 text-sm text-muted">{period}</span>
      </div>

      <ul className="mt-8 flex flex-1 flex-col gap-3">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-3 text-sm text-ink/90">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
              <Check size={12} />
            </span>
            {feature}
          </li>
        ))}
      </ul>

      <Button
        to="/contact"
        variant={highlight ? 'primary' : 'secondary'}
        className="mt-8 w-full justify-center"
      >
        Contact Us
      </Button>
    </motion.div>
  )
}
