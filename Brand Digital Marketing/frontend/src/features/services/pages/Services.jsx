import { motion } from 'framer-motion'
import {
  ImageIcon,
  Video,
  Megaphone,
  Palette,
  Check,
  Sparkles,
} from 'lucide-react'
import SectionHeading from '../../../components/SectionHeading'
import Reveal from '../../../components/Reveal'
import Button from '../../../components/Button'
import PlaceholderBox from '../../../components/PlaceholderBox'

const services = [
  {
    icon: ImageIcon,
    title: 'Banner Design',
    tagline: 'Static & animated banners that earn the click',
    description:
      'From web headers to paid ad creatives, we design banners tuned for the platform they live on — sharp typography, on-brand color, and a layout hierarchy that guides the eye straight to your CTA.',
    features: [
      'Web & display banners',
      'Animated / motion banners',
      'Multi-size ad sets for campaigns',
      'Seasonal & promotional creative',
    ],
    type: 'image',
    reverse: false,
  },
  {
    icon: Video,
    title: 'Social Media Videos',
    tagline: 'Short-form video built to be watched, not skipped',
    description:
      'Reels, stories, and promo cuts edited for retention from frame one. We handle pacing, captions, sound design, and platform-native formatting so your content feels made for the feed, not repurposed for it.',
    features: [
      'Reels & TikTok-style edits',
      'Product & promo videos',
      'Story & motion graphics',
      'Captioning & sound design',
    ],
    type: 'video',
    reverse: true,
  },
  {
    icon: Megaphone,
    title: 'Ad Creatives',
    tagline: 'Performance-first creative for paid campaigns',
    description:
      'We build full creative sets for Meta, Google, and TikTok Ads — including hooks, variants, and iterations informed by what is actually converting, not just what looks good in a mockup.',
    features: [
      'Meta & TikTok ad sets',
      'Google display creative',
      'A/B creative variants',
      'Landing page visuals',
    ],
    type: 'image',
    reverse: false,
  },
  {
    icon: Palette,
    title: 'Brand Kits',
    tagline: 'A visual system your whole team can run with',
    description:
      'Color palettes, type pairings, templates, and usage guidelines so every banner, post, and video feels unmistakably yours — even when different people are producing it.',
    features: [
      'Color & typography system',
      'Reusable social templates',
      'Logo usage guidelines',
      'Brand style one-pager',
    ],
    type: 'image',
    reverse: true,
  },
]

export default function Services() {
  return (
    <div className="pt-32 sm:pt-40">
      <section className="relative mx-auto max-w-6xl px-6 pb-16 text-center sm:px-8 sm:pb-24">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            <Sparkles size={14} />
            Our Services
          </span>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 className="font-display mx-auto mt-6 max-w-3xl text-5xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl">
            Everything your brand needs to show up loud
          </h1>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            Four core services, one consistent creative direction. Mix and
            match what your brand needs right now.
          </p>
        </Reveal>
      </section>

      <div className="mx-auto flex max-w-6xl flex-col gap-24 px-6 pb-32 sm:px-8 sm:gap-32">
        {services.map((service, i) => (
          <ServiceRow key={service.title} service={service} index={i} />
        ))}
      </div>
    </div>
  )
}

function ServiceRow({ service, index }) {
  const { icon: Icon, title, tagline, description, features, type, reverse } = service

  return (
    <div
      className={`grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16 ${
        reverse ? 'md:[&>*:first-child]:order-2' : ''
      }`}
    >
      <Reveal direction={reverse ? 'right' : 'left'}>
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-border">
          <PlaceholderBox label={type === 'video' ? 'VIDEO PREVIEW' : 'BANNER IMAGE'} type={type} />
        </div>
      </Reveal>

      <Reveal direction={reverse ? 'left' : 'right'} delay={0.1}>
        <div>
          <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
            <Icon size={22} />
          </span>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            {String(index + 1).padStart(2, '0')} &mdash; {tagline}
          </p>
          <h2 className="font-display mb-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            {title}
          </h2>
          <p className="mb-6 text-sm leading-relaxed text-muted sm:text-base">{description}</p>

          <ul className="mb-8 flex flex-col gap-3">
            {features.map((feature, fi) => (
              <motion.li
                key={feature}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ delay: fi * 0.07, duration: 0.4 }}
                className="flex items-center gap-3 text-sm text-ink/90"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/15 text-accent">
                  <Check size={12} />
                </span>
                {feature}
              </motion.li>
            ))}
          </ul>

          <Button to="/contact" variant="secondary">
            Discuss This Service
          </Button>
        </div>
      </Reveal>
    </div>
  )
}
