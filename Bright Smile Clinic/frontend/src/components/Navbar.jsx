import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="mx-auto flex w-full max-w-[1280px] items-center justify-between px-5 py-5 sm:px-8">
      <Link to="/" className="text-xl font-extrabold tracking-tight text-brand-ink no-underline">
        Bright Smile
      </Link>
      <a
        href="#"
        className="text-sm font-medium text-ink-secondary no-underline transition-colors duration-200 ease-in-out hover:text-brand"
      >
        Need help? Contact support
      </a>
    </nav>
  );
}
