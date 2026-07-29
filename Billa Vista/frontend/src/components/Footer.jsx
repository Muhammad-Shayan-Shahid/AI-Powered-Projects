import { Link } from 'react-router-dom'
import { UtensilsCrossed, Instagram, Twitter, Facebook } from 'lucide-react'

const columns = [
  {
    title: 'Explore',
    links: [
      { label: 'Home', to: '/' },
      { label: 'Menu', to: '/menu' },
      { label: 'Reservations', to: '/booking' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', to: '/#about' },
      { label: 'Reviews', to: '/#reviews' },
      { label: 'Contact', to: '/#contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', to: '/#privacy' },
      { label: 'Terms of Service', to: '/#terms' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface/40">
      <div className="container grid grid-cols-1 gap-10 py-12 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary">
              <UtensilsCrossed className="h-4 w-4 text-white" />
            </span>
            <span className="text-lg font-semibold">Bella Vista</span>
          </Link>
          <p className="mt-3 max-w-xs text-sm text-muted">
            AI powered reservations. Zero wait time. Pure flavor.
          </p>
          <div className="mt-4 flex gap-3">
            {[Instagram, Twitter, Facebook].map((Icon, idx) => (
              <a
                key={idx}
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted transition-colors hover:text-white"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="text-sm font-semibold text-white">{col.title}</h4>
            <ul className="mt-4 space-y-2">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-muted transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border py-6 text-center text-xs text-muted">
        © {new Date().getFullYear()} Bella Vista. All rights reserved.
      </div>
    </footer>
  )
}
