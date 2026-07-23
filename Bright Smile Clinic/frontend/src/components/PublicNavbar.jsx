import { useState } from 'react';
import { Link } from 'react-router-dom';

const NAV_LINKS = [
  { label: 'Find a doctor', to: '/doctors' },
  { label: 'Services', to: '/services' },
];

/** Shared top nav for logged-out marketing/browse pages (Home, Browse Doctors, Doctor Profile, Browse Services). */
export default function PublicNavbar({ active }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="relative z-50 mx-auto flex w-full max-w-[1280px] items-center justify-between px-5 py-[18px] sm:px-8">
      <Link to="/" className="text-xl font-extrabold tracking-tight text-brand-ink no-underline">
        Bright Smile
      </Link>

      <button
        type="button"
        onClick={() => setMenuOpen((v) => !v)}
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
        className="flex h-10 w-10 items-center justify-center rounded-[10px] border-[1.5px] border-border bg-surface text-lg md:hidden"
      >
        ☰
      </button>

      <div
        className={`items-center gap-4 md:flex md:static md:z-auto md:gap-7 md:border-none md:bg-transparent md:p-0 md:shadow-none ${
          menuOpen
            ? 'fixed inset-x-0 top-16 z-40 flex flex-col gap-3.5 border-b border-border bg-surface px-5 py-4 shadow-[0_8px_20px_oklch(22%_0.05_265_/_0.12)]'
            : 'hidden'
        }`}
      >
        {NAV_LINKS.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            onClick={() => setMenuOpen(false)}
            className={`text-sm no-underline transition-colors duration-200 ease-in-out hover:text-brand ${
              active === link.to ? 'font-bold text-brand' : 'font-medium text-ink'
            }`}
          >
            {link.label}
          </Link>
        ))}
        <Link
          to="/login"
          onClick={() => setMenuOpen(false)}
          className="text-sm font-semibold text-ink no-underline transition-colors duration-200 ease-in-out hover:text-brand"
        >
          Patient login
        </Link>
        <Link
          to="/doctor/login"
          onClick={() => setMenuOpen(false)}
          className="inline-flex items-center rounded-full bg-brand px-5 py-2.5 text-[0.8125rem] font-semibold text-white no-underline transition-colors duration-200 ease-in-out hover:bg-brand-hover"
        >
          Doctor login
        </Link>
      </div>
    </nav>
  );
}
