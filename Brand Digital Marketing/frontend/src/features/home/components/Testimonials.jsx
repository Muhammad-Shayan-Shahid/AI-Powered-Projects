import { Quote, Star } from 'lucide-react'
import SectionHeading from '../../../components/SectionHeading'
import Card from '../../../components/Card'
import { StaggerGroup, StaggerItem } from '../../../components/Stagger'

const testimonials = [
  {
    name: 'Aisha Rahman',
    role: 'Founder, Lumen Skincare',
    quote:
      "MSH redesigned our ad banners in a week and our click-through rate nearly doubled. They actually get what stops people mid-scroll.",
    initials: 'AR',
  },
  {
    name: 'Daniel Cho',
    role: 'Growth Lead, Northwind Coffee',
    quote:
      'The reels they cut for our launch felt native to every platform we posted on. Zero awkward crops, zero generic templates.',
    initials: 'DC',
  },
  {
    name: 'Priya Nair',
    role: 'Marketing Manager, Vertex Fitness',
    quote:
      'Fast turnarounds, sharp creative direction, and they actually listen to feedback. Our best agency relationship by far.',
    initials: 'PN',
  },
]

export default function Testimonials() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-24 sm:px-8 sm:py-32">
      <SectionHeading
        eyebrow="Client Love"
        title="Don't just take our word for it"
        subtitle="A few words from brands we've helped show up louder, sharper, and more consistently."
        className="mx-auto mb-16"
      />

      <StaggerGroup className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {testimonials.map((t) => (
          <StaggerItem key={t.name}>
            <Card className="flex h-full flex-col gap-6">
              <Quote size={28} className="text-accent" />
              <p className="flex-1 text-sm leading-relaxed text-ink/90">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3 pt-2">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-2 text-sm font-semibold text-accent">
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">{t.name}</p>
                  <p className="text-xs text-muted">{t.role}</p>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={12} className="fill-accent text-accent" />
                  ))}
                </div>
              </div>
            </Card>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </section>
  )
}
