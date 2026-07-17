import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import AuthCard from '../../../components/AuthCard';
import HeroPerks from '../../../components/HeroPerks';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import FormAlert from '../../../components/FormAlert';
import { useAuth } from '../hooks/useAuth';

const PERKS = ['Manage your schedule', 'View patient records', 'Get new booking alerts'];

export default function DoctorLogin() {
  const navigate = useNavigate();
  const { loginDoctor, isLoading, error, fieldErrors, clearAuthError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    clearAuthError();
    const result = await loginDoctor({ email, password });
    if (result.meta.requestStatus !== 'fulfilled') return;

    // A "pending" login isn't an error — route straight to the waiting screen
    // instead of showing a generic failure message (see CLAUDE.md auth strategy).
    if (result.payload.pending) {
      navigate('/pending-approval');
    } else {
      navigate('/doctor/dashboard');
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-page">
      <Navbar />

      <main className="flex flex-1 items-center justify-center p-4 sm:p-10">
        <AuthCard
          tone="clinician"
          hero={
            <>
              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/16 px-4 py-1.5 text-xs font-bold tracking-wide">
                <span className="h-[7px] w-[7px] rounded-full bg-[oklch(78%_0.16_145)]" />
                Doctor Portal
              </div>

              <HeroPerks perks={PERKS} />

              <div>
                <h1 className="m-0 mb-2 text-[1.625rem] font-bold leading-tight tracking-tight">
                  Welcome back, doctor.
                </h1>
                <p className="m-0 text-[0.9375rem] leading-normal text-white/75">
                  Log in to view your schedule and patients.
                </p>
              </div>
            </>
          }
        >
          <div>
            <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-full bg-clinician-subtle px-3 py-1.5 text-[0.6875rem] font-bold tracking-wide text-clinician">
              FOR CLINICIANS
            </div>
            <h2 className="m-0 mb-1.5 text-2xl font-bold leading-tight tracking-tight text-ink">
              Log in to your practice
            </h2>
            <p className="m-0 text-[0.9375rem] text-ink-secondary">Enter your credentials to continue.</p>
          </div>

          <FormAlert>{error}</FormAlert>

          <form onSubmit={handleSubmit} className="flex flex-col gap-[18px]">
            <Input
              label="Email address"
              type="email"
              tone="clinician"
              placeholder="doctor@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={fieldErrors?.email}
              required
            />

            <Input
              label="Password"
              tone="clinician"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={fieldErrors?.password}
              required
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="rounded px-1 py-0.5 text-xs font-semibold text-ink-secondary transition-colors hover:text-ink"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              }
            />

            <div className="flex justify-end">
              <a
                href="#"
                className="text-[0.8125rem] font-semibold text-clinician no-underline hover:text-clinician-hover"
              >
                Forgot password?
              </a>
            </div>

            <Button type="submit" tone="clinician" loading={isLoading}>
              {isLoading ? 'Logging in…' : 'Log In'}
            </Button>
          </form>

          <p className="m-0 text-center text-[0.9375rem] text-ink-secondary">
            New provider?{' '}
            <Link
              to="/doctor/signup"
              className="font-semibold text-clinician no-underline hover:text-clinician-hover"
            >
              Apply to join
            </Link>
          </p>
        </AuthCard>
      </main>

      <Footer />
    </div>
  );
}
