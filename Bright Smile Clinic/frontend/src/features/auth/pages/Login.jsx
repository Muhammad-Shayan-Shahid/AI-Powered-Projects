import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import AuthCard from '../../../components/AuthCard';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import FormAlert from '../../../components/FormAlert';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const navigate = useNavigate();
  const { loginPatient, isLoading, error, fieldErrors, clearAuthError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Wipe any leftover error from a previous auth form (e.g. a failed login)
  // so it doesn't bleed into this page on navigation.
  useEffect(() => {
    clearAuthError();
  }, [clearAuthError]);

  async function handleSubmit(e) {
    e.preventDefault();
    clearAuthError();
    const result = await loginPatient({ email, password });
    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/patient/dashboard');
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-page">
      <Navbar />

      <main className="flex flex-1 items-center justify-center p-4 sm:p-10">
        <AuthCard
          tone="brand"
          hero={
            <>
              <div className="w-fit rounded-full bg-white/14 px-4 py-1.5 text-xs font-semibold tracking-wide">
                Patient Portal
              </div>

              <div className="flex flex-col items-start gap-5">
                <div className="flex h-[120px] w-[120px] flex-shrink-0 items-center justify-center overflow-hidden rounded-full border-[3px] border-white/25 bg-white/10">
                  <svg viewBox="0 0 24 24" fill="none" className="h-14 w-14 text-white/50">
                    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
                    <path
                      d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <div className="inline-flex items-center rounded-xl bg-surface px-4 py-2.5 text-[0.8125rem] font-bold text-brand-ink shadow-[0_8px_20px_oklch(22%_0.05_265_/_0.2)]">
                  2,400+ patients trust us
                </div>
              </div>

              <div>
                <h1 className="m-0 mb-2 text-[1.625rem] font-bold leading-tight tracking-tight">
                  Welcome back to your smile journey.
                </h1>
                <p className="m-0 text-[0.9375rem] leading-normal text-white/75">
                  Log in to manage your appointments and records.
                </p>
              </div>
            </>
          }
        >
          <div>
            <h2 className="m-0 mb-1.5 text-2xl font-bold leading-tight tracking-tight text-ink">
              Log in to your account
            </h2>
            <p className="m-0 text-[0.9375rem] text-ink-secondary">Enter your details to continue.</p>
          </div>

          <FormAlert>{error}</FormAlert>

          <form onSubmit={handleSubmit} className="flex flex-col gap-[18px]">
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={fieldErrors?.email}
              required
            />

            <Input
              label="Password"
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
                  className="rounded px-1 py-0.5 text-xs font-semibold text-ink-secondary transition-colors duration-200 ease-in-out hover:text-ink"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              }
            />

            <div className="flex justify-end">
              <a
                href="#"
                className="text-[0.8125rem] font-semibold text-brand no-underline transition-colors duration-200 ease-in-out hover:text-brand-hover"
              >
                Forgot password?
              </a>
            </div>

            <Button type="submit" tone="brand" loading={isLoading}>
              {isLoading ? 'Logging in…' : 'Log In'}
            </Button>
          </form>

          <div className="my-1 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs font-medium text-ink-tertiary">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <p className="m-0 text-center text-[0.9375rem] text-ink-secondary">
            New to Bright Smile?{' '}
            <Link
              to="/signup"
              className="font-semibold text-brand no-underline transition-colors duration-200 ease-in-out hover:text-brand-hover"
            >
              Create an account
            </Link>
          </p>
        </AuthCard>
      </main>

      <Footer />
    </div>
  );
}
