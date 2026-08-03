import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'
import Reveal from './Reveal'
import { InstagramIcon, LinkedinIcon, FacebookIcon } from './SocialIcons'

const columns = [
  {
    title: 'Sitemap',
    links: [
      { label: 'Home', to: '/' },
      { label: 'Services', to: '/services' },
      { label: 'Portfolio', to: '/portfolio' },
      { label: 'Pricing', to: '/pricing' },
      { label: 'About', to: '/about' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    title: 'Services',
    links: [
      { label: 'Banner Design', to: '/services' },
      { label: 'Social Media Videos', to: '/services' },
      { label: 'Ad Creatives', to: '/services' },
      { label: 'Brand Kits', to: '/services' },
    ],
  },
]

const socials = [
  { icon: InstagramIcon, href: 'https://instagram.com', label: 'Instagram' },
  { icon: LinkedinIcon, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: FacebookIcon, href: 'https://facebook.com', label: 'Facebook' },
  { icon: Mail, href: 'mailto:hello@mshservices.com', label: 'Email' },
]

export default function Footer() {
  return (
    <footer className="relative border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <Reveal>
            <div className="flex flex-col gap-4">
              <Link to="/" className="flex items-center gap-2 self-start">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent font-display text-lg font-bold text-bg">
                  M
                </span>
                <span className="font-display text-lg font-semibold text-ink">
                  MSH<span className="text-accent">.</span>
                </span>
              </Link>
              <p className="max-w-xs text-sm leading-relaxed text-muted">
                A digital marketing studio crafting scroll-stopping banners and
                social media videos for brands who refuse to blend in.
              </p>
              <div className="flex gap-3 pt-2">
                {socials.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted transition-all duration-200 hover:-translate-y-1 hover:border-accent/50 hover:text-accent"
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>
          </Reveal>

          {columns.map((col, i) => (
            <Reveal key={col.title} delay={0.1 + i * 0.08}>
              <div className="flex flex-col gap-4">
                <h4 className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-ink">
                  {col.title}
                </h4>
                <ul className="flex flex-col gap-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        className="text-sm text-muted transition-colors hover:text-accent"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-xs text-muted sm:flex-row">
          <p>&copy; {new Date().getFullYear()} MSH Services. All rights reserved.</p>
          <p>Designed &amp; built with intent.</p>
        </div>
      </div>
    </footer>
  )
}
