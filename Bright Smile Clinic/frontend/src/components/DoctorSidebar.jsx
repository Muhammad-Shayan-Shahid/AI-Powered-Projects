import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';
import { getInitials } from '../utils/getInitials';

const NAV_LINKS = [
  { label: 'Dashboard', to: '/doctor/dashboard' },
  { label: 'Appointment requests', to: '/doctor/appointment-requests' },
  { label: 'My availability', to: '/doctor/availability' },
  { label: 'Patient history', to: '/doctor/patient-history' },
  { label: 'Profile', to: '/doctor/profile' },
];

/** Sidebar shared by every doctor-portal screen (Dashboard, Requests, Availability, History, Profile). */
export default function DoctorSidebar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  async function handleLogout() {
    await logout();
    navigate('/doctor/login');
  }

  return (
    <aside className="sticky top-0 flex h-screen w-60 flex-shrink-0 flex-col bg-brand-ink p-4 text-white max-md:relative max-md:h-auto max-md:w-full max-md:flex-row max-md:items-center max-md:gap-3">
      <div className="mb-2 px-2 text-lg font-extrabold tracking-tight max-md:mb-0 max-md:whitespace-nowrap">
        Bright Smile
      </div>

      <button
        onClick={() => setMenuOpen((open) => !open)}
        className="ml-auto hidden h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border-none bg-white/[0.14] text-lg text-white max-md:flex"
        aria-label="Toggle menu"
      >
        ☰
      </button>

      <div className="mx-2 my-2 mb-6 flex w-fit items-center gap-1.5 rounded-full bg-white/[0.14] px-3 py-1.5 text-[0.6875rem] font-bold max-md:hidden">
        <span className="h-[7px] w-[7px] rounded-full bg-[oklch(78%_0.16_145)]" />
        Doctor Portal
      </div>

      <nav
        className={[
          'flex-col gap-1 md:flex',
          menuOpen
            ? 'fixed left-0 right-0 top-16 z-40 flex flex-col gap-1 bg-brand-ink p-4 shadow-lg'
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
                active ? 'bg-white/[0.14] font-bold text-white' : 'font-semibold text-white/75 hover:text-white',
              ].join(' ')}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="mt-auto flex items-center gap-2.5 border-none border-t border-white/[0.14] bg-transparent p-2 pt-3 text-left max-md:hidden"
        title="Log out"
      >
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-clinician-subtle text-[0.8125rem] font-bold text-clinician">
          {getInitials(user?.name)}
        </div>
        <div className="min-w-0">
          <div className="overflow-hidden text-ellipsis whitespace-nowrap text-[0.8125rem] font-bold">
            Dr. {user?.name}
          </div>
          <div className="text-xs text-white/60">{user?.specialization || 'Specialization not set'}</div>
        </div>
      </button>
    </aside>
  );
}
