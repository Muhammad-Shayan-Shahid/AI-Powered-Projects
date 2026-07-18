import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';
import { getInitials } from '../utils/getInitials';

const NAV_LINKS = [
  { label: 'Home', to: '/patient/dashboard' },
  { label: 'Find a doctor', to: '/booking/book' },
  { label: 'My appointments', to: '/booking/my-appointments' },
];

/** Logged-in patient nav shared by the booking screens (Book Appointment, My Appointments, Booking Confirmation). */
export default function PatientNavbar() {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <nav className="mx-auto flex w-full max-w-[1280px] flex-wrap items-center justify-between gap-y-2.5 border-b border-border px-5 py-[18px] sm:px-8">
      <Link to="/patient/dashboard" className="text-xl font-extrabold tracking-tight text-brand-ink no-underline">
        Bright Smile
      </Link>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 sm:gap-x-7">
        {NAV_LINKS.map((link) => {
          const active = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm no-underline ${active ? 'font-bold text-brand' : 'font-medium text-ink'}`}
            >
              {link.label}
            </Link>
          );
        })}
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
          {getInitials(user?.name)}
        </div>
      </div>
    </nav>
  );
}
