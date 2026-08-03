import { ImageIcon, Video, Megaphone, Palette } from 'lucide-react'
import SectionHeading from '../../../components/SectionHeading'
import Card from '../../../components/Card'
import { StaggerGroup, StaggerItem } from '../../../components/Stagger'

const services = [
  {
    icon: ImageIcon,
    title: 'Banner Design',
    description:
      'Eye-catching static & animated banners for web, ads, and campaigns that grab attention in seconds.',
  },
  {
    icon: Video,
    title: 'Social Media Videos',
    description:
      'Short-form promo videos and reels engineered for retention, shares, and platform-native reach.',
  },
  {
    icon: Megaphone,
    title: 'Ad Creatives',
    description:
      'High-converting creative sets for Meta, Google, and TikTok ad campaigns, built to perform.',
  },
  {
    icon: Palette,
    title: 'Brand Kits',
    description:
      'Consistent visual systems — color, type, and templates — so every post feels unmistakably you.',
  },
]

export default function ServicesOverview() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-24 sm:px-8 sm:py-32">
      <SectionHeading
        eyebrow="What We Do"
        title="Creative firepower for every channel"
        subtitle="From the first banner to the final cut of a reel, everything we make is designed to make people stop, look, and act."
        className="mx-auto mb-16"
      />

      <StaggerGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {services.map(({ icon: Icon, title, description }) => (
          <StaggerItem key={title}>
            <Card className="group h-full">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-bg">
                <Icon size={22} />
              </div>
              <h3 className="font-display mb-2 text-lg font-semibold text-ink">{title}</h3>
              <p className="text-sm leading-relaxed text-muted">{description}</p>
            </Card>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </section>
  )
}
