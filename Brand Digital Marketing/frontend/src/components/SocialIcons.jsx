// lucide-react's brand icons were removed upstream, so these small inline
// glyphs stand in for the social links in the footer / contact areas.

export function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function LinkedinIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.5h4v11H3v-11Zm7 0h3.8v1.5h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.75v6.7h-4v-5.94c0-1.42-.03-3.25-2.05-3.25-2.06 0-2.37 1.55-2.37 3.15v6.04h-4v-11Z" />
    </svg>
  )
}

export function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M13.5 21v-8.1h2.7l.4-3.2h-3.1V7.7c0-.93.26-1.56 1.6-1.56h1.7V3.3C15.9 3.2 15 3.13 13.96 3.13c-2.6 0-4.36 1.58-4.36 4.5v2.07H6.9v3.2h2.7V21h3.9Z" />
    </svg>
  )
}
