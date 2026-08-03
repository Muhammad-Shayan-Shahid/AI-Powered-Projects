import { Target, Zap, HeartHandshake } from 'lucide-react'
import Reveal from '../../../components/Reveal'
import SectionHeading from '../../../components/SectionHeading'
import Button from '../../../components/Button'
import PlaceholderBox from '../../../components/PlaceholderBox'
import { StaggerGroup, StaggerItem } from '../../../components/Stagger'

const stats = [
  { value: '120+', label: 'Projects Delivered' },
  { value: '45+', label: 'Brands Served' },
  { value: '4.9/5', label: 'Avg. Client Rating' },
  { value: '3', label: 'Days Avg. Turnaround' },
]

const values = [
  {
    icon: Target,
    title: 'Built to Convert',
    description:
      'Every design decision is judged against one question: does this get more people to stop, watch, and act?',
  },
  {
    icon: Zap,
    title: 'Fast, Without the Sloppiness',
    description:
      'Quick turnarounds are non-negotiable, but so is craft — we don’t trade one for the other.',
  },
  {
    icon: HeartHandshake,
    title: 'Real Collaboration',
    description:
      'You get a creative partner who listens, iterates fast, and treats your brand like their own.',
  },
]

export default function About() {
  return (
    <div className="pt-32 sm:pt-40">
      <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 pb-24 sm:px-8 sm:pb-32 md:grid-cols-2 md:gap-16">
        <Reveal direction="left">
          <div>
            <span className="inline-flex items-center rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Our Story
            </span>
            <h1 className="font-display mt-6 text-4xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl">
              We started MSH because most agency work all looks the same.
            </h1>
            <p className="mt-6 text-sm leading-relaxed text-muted sm:text-base">
              MSH Services began with a simple frustration: too many small
              brands were stuck choosing between cheap, generic templates and
              expensive agencies that moved too slowly to keep up with the
              feed. We built MSH to close that gap — a lean studio focused
              entirely on two things brands need constantly: banners that
              grab attention, and videos that hold it.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
              Today we work with skincare labels, fitness brands, cafés, and
              retailers who need creative that performs on a weekly cadence
              — not just for one big campaign a year.
            </p>
            <div className="mt-8">
              <Button to="/contact">Work With Us</Button>
            </div>
          </div>
        </Reveal>

        <Reveal direction="right" delay={0.1}>
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-border">
            <PlaceholderBox label="TEAM / STUDIO PHOTO" />
          </div>
        </Reveal>
      </section>

      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:px-8">
          <StaggerGroup className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <StaggerItem key={stat.label} className="text-center">
                <p className="font-display text-4xl font-semibold text-accent sm:text-5xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-xs font-medium uppercase tracking-[0.14em] text-muted">
                  {stat.label}
                </p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24 sm:px-8 sm:py-32">
        <SectionHeading
          eyebrow="What Drives Us"
          title="The principles behind every project"
          className="mx-auto mb-16"
        />

        <StaggerGroup className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {values.map(({ icon: Icon, title, description }) => (
            <StaggerItem key={title}>
              <div className="flex h-full flex-col gap-4 rounded-2xl border border-border bg-surface p-7">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Icon size={20} />
                </span>
                <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
                <p className="text-sm leading-relaxed text-muted">{description}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>
    </div>
  )
}
