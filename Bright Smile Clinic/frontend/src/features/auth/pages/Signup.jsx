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

const PERKS = ['Book appointments online', 'Manage records anytime', 'Reminders before every visit'];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Signup() {
  const navigate = useNavigate();
  const { registerPatient, isLoading, error, fieldErrors, clearAuthError } = useAuth();
  const [fields, setFields] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [touched, setTouched] = useState({});

  function update(field, value) {
    setFields((f) => ({ ...f, [field]: value }));
  }

  function touch(field) {
    setTouched((t) => ({ ...t, [field]: true }));
  }

  function validate() {
    const errors = {};
    if (touched.name && fields.name.trim().length < 2) errors.name = 'Please enter your full name.';
    if (touched.email && !EMAIL_RE.test(fields.email)) errors.email = 'Enter a valid email address.';
    if (touched.phone && fields.phone.replace(/\D/g, '').length < 10) errors.phone = 'Enter a valid phone number.';
    if (touched.password && fields.password.length < 8) errors.password = 'Password must be at least 8 characters.';
    if (touched.confirm && fields.confirm !== fields.password) errors.confirm = "Passwords don't match.";
    return errors;
  }

  const clientErrors = validate();
  // Backend field errors (e.g. duplicate email) win once the request comes back.
  const errors = { ...clientErrors, ...fieldErrors };

  async function handleSubmit(e) {
    e.preventDefault();
    clearAuthError();
    setTouched({ name: true, email: true, phone: true, password: true, confirm: true });
    if (Object.keys(validate()).length > 0) return;

    const result = await registerPatient({
      name: fields.name,
      email: fields.email,
      phone: fields.phone,
      password: fields.password,
    });
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

              <HeroPerks perks={PERKS} />

              <div>
                <h1 className="m-0 mb-2 text-[1.625rem] font-bold leading-tight tracking-tight">
                  Book your first visit in minutes.
                </h1>
                <p className="m-0 text-[0.9375rem] leading-normal text-white/75">
                  Create your account to get started.
                </p>
              </div>
            </>
          }
        >
          <div>
            <h2 className="m-0 mb-1.5 text-2xl font-bold leading-tight tracking-tight text-ink">
              Create your account
            </h2>
            <p className="m-0 text-[0.9375rem] text-ink-secondary">Just a few details to get you booked.</p>
          </div>

          <FormAlert>{error}</FormAlert>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Full name"
              placeholder="Jordan Rivera"
              value={fields.name}
              onChange={(e) => update('name', e.target.value)}
              onBlur={() => touch('name')}
              error={errors.name}
            />

            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={fields.email}
              onChange={(e) => update('email', e.target.value)}
              onBlur={() => touch('email')}
              error={errors.email}
              success={touched.email && !errors.email && fields.email.length > 0 ? 'Looks good.' : undefined}
            />

            <Input
              label="Phone number"
              type="tel"
              placeholder="(555) 555-0100"
              value={fields.phone}
              onChange={(e) => update('phone', e.target.value)}
              onBlur={() => touch('phone')}
              error={errors.phone}
            />

            <Input
              label="Password"
              type="password"
              placeholder="At least 8 characters"
              value={fields.password}
              onChange={(e) => update('password', e.target.value)}
              onBlur={() => touch('password')}
              error={errors.password}
            />

            <Input
              label="Confirm password"
              type="password"
              placeholder="Re-enter your password"
              value={fields.confirm}
              onChange={(e) => update('confirm', e.target.value)}
              onBlur={() => touch('confirm')}
              error={errors.confirm}
              success={touched.confirm && !errors.confirm && fields.confirm.length > 0 ? 'Passwords match.' : undefined}
            />

            <Button type="submit" tone="brand" loading={isLoading} className="mt-1">
              {isLoading ? 'Creating account…' : 'Create Account'}
            </Button>
          </form>

          <p className="m-0 text-center text-[0.9375rem] text-ink-secondary">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-brand no-underline hover:text-brand-hover">
              Log in
            </Link>
          </p>
        </AuthCard>
      </main>

      <Footer />
    </div>
  );
}
