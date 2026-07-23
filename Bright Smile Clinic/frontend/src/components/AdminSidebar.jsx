import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';

const NAV_LINKS = [
  { label: 'Dashboard', to: '/admin/dashboard' },
  { label: 'Pending doctors', to: '/admin/pending-doctors' },
  { label: 'Manage doctors', to: '/admin/manage-doctors' },
  { label: 'Manage services', to: '/admin/manage-services' },
  { label: 'Knowledge base', to: '/admin/knowledge-base' },
  { label: 'All appointments', to: '/admin/all-appointments' },
];

/** Sidebar shared by every admin-portal screen (Dashboard, Pending Doctors, Manage Services, Knowledge Base, All Appointments). */
export default function AdminSidebar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  async function handleLogout() {
    await logout();
    navigate('/admin/login');
  }

  return (
    <aside className="sticky top-0 flex h-screen w-60 flex-shrink-0 flex-col bg-admin-ink p-4 text-white max-md:relative max-md:h-auto max-md:w-full max-md:flex-row max-md:items-center max-md:gap-3">
      <div className="mb-6 px-2 text-lg font-extrabold tracking-tight max-md:mb-0 max-md:whitespace-nowrap">
        Bright Smile <span className="font-semibold opacity-50">Admin</span>
      </div>

      <button
        onClick={() => setMenuOpen((open) => !open)}
        className="ml-auto hidden h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border-none bg-white/[0.14] text-lg text-white max-md:flex"
        aria-label="Toggle menu"
      >
        ☰
      </button>

      <nav
        className={[
          'flex-col gap-1 md:flex',
          menuOpen
            ? 'fixed left-0 right-0 top-16 z-40 flex flex-col gap-1 bg-admin-ink p-4 shadow-lg'
            : 'hidden',
        ].join(' ')}
      >
        {NAV_LINKS.map((link) => {
          const active = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={[
                'rounded-[10px] px-3 py-2.5 text-sm no-underline transition-colors duration-150 ease-in-out',
                active ? 'bg-white/[0.12] font-bold text-white' : 'font-semibold text-white/70 hover:text-white',
              ].join(' ')}
            >
              {link.label}
            </Link>
          );
        })}

        {/* Desktop has its own logout button in the profile block below (hidden on
            mobile); this copy lives in the dropdown so mobile has one too. */}
        <button
          type="button"
          onClick={handleLogout}
          className="hidden rounded-[10px] border-t border-white/[0.12] px-3 py-2.5 pt-4 text-left text-sm font-semibold text-white/70 transition-colors duration-150 ease-in-out hover:text-white max-md:block"
        >
          Log out
        </button>
      </nav>

      <div className="mt-auto flex items-center gap-2.5 border-t border-white/[0.12] p-2 pt-3 max-md:hidden">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[oklch(30%_0.01_260)] text-[0.8125rem] font-bold text-white">
          A
        </div>
        <div className="min-w-0 flex-1">
          <div className="overflow-hidden text-ellipsis whitespace-nowrap text-[0.8125rem] font-bold">
            {user?.name || 'Admin'}
          </div>
          <div className="text-xs text-white/55">Clinic operations</div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="flex-shrink-0 rounded-lg border-none bg-white/[0.1] px-3 py-1.5 text-xs font-semibold text-white/80 transition-colors duration-150 ease-in-out hover:bg-white/[0.18] hover:text-white"
          title="Log out"
        >
          Log out
        </button>
      </div>
    </aside>
  );
}
