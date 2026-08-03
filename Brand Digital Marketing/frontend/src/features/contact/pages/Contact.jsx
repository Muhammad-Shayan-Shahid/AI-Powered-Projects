import { Mail, MapPin, Clock } from 'lucide-react'
import Reveal from '../../../components/Reveal'
import ContactForm from '../components/ContactForm'

const infoItems = [
  {
    icon: Mail,
    title: 'Email Us',
    detail: 'hello@mshservices.com',
  },
  {
    icon: MapPin,
    title: 'Studio',
    detail: 'Remote-first, serving clients worldwide',
  },
  {
    icon: Clock,
    title: 'Response Time',
    detail: 'Within 1 business day',
  },
]

export default function Contact() {
  return (
    <div className="pt-32 sm:pt-40">
      <section className="mx-auto max-w-6xl px-6 pb-16 text-center sm:px-8 sm:pb-20">
        <Reveal>
          <span className="inline-flex items-center rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Get In Touch
          </span>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 className="font-display mx-auto mt-6 max-w-3xl text-5xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl">
            Let&rsquo;s make your next campaign impossible to ignore
          </h1>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            Tell us a little about your brand and what you need — we&rsquo;ll
            reply with next steps, no obligation.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 pb-32 sm:px-8 md:grid-cols-[1fr_1.3fr] md:gap-8">
        <Reveal direction="left">
          <div className="flex h-full flex-col gap-4">
            {infoItems.map(({ icon: Icon, title, detail }) => (
              <div
                key={title}
                className="flex items-start gap-4 rounded-2xl border border-border bg-surface p-6"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Icon size={18} />
                </span>
                <div>
                  <p className="font-display text-sm font-semibold text-ink">{title}</p>
                  <p className="mt-1 text-sm text-muted">{detail}</p>
                </div>
              </div>
            ))}

            <div className="mt-auto rounded-2xl border border-accent/25 bg-accent/[0.06] p-6">
              <p className="text-sm leading-relaxed text-ink/90">
                Prefer instant messaging? Use the WhatsApp button in the
                corner of your screen to chat with us directly.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal direction="right" delay={0.1}>
          <ContactForm />
        </Reveal>
      </section>
    </div>
  )
}
