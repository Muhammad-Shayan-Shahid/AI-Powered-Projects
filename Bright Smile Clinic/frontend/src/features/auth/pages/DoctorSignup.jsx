import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import AuthCard from '../../../components/AuthCard';
import HeroPerks from '../../../components/HeroPerks';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import FormAlert from '../../../components/FormAlert';
import { useAuth } from '../hooks/useAuth';

const PERKS = ['Manage your own schedule', 'Grow your patient base', 'Get paid faster'];

const SPECIALIZATIONS = [
  'General dentistry',
  'Orthodontics',
  'Endodontics',
  'Periodontics',
  'Oral surgery',
  'Pediatric dentistry',
];

const FIELD_CLASSES =
  'w-full rounded-xl border-[1.5px] border-border bg-surface px-4 py-3 font-sans text-[0.9375rem] text-ink outline-none transition-all duration-200 ease-in-out placeholder:text-ink-tertiary hover:border-clinician/40 focus:border-clinician focus:ring-[3px] focus:ring-clinician-ring';

export default function DoctorSignup() {
  const navigate = useNavigate();
  const { registerDoctor, isLoading, error, fieldErrors, clearAuthError } = useAuth();
  const fileInputRef = useRef(null);
  // Photo preview only — no file upload backend exists yet, so photoUrl isn't submitted.
  const [photoPreview, setPhotoPreview] = useState(null);
  const [fields, setFields] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: SPECIALIZATIONS[0],
    bio: '',
    password: '',
    confirm: '',
  });
  const [touched, setTouched] = useState({});

  // Wipe any leftover error from a previous auth form (e.g. a failed login)
  // so it doesn't bleed into this page on navigation.
  useEffect(() => {
    clearAuthError();
  }, [clearAuthError]);

  function update(field, value) {
    setFields((f) => ({ ...f, [field]: value }));
  }

  function touch(field) {
    setTouched((t) => ({ ...t, [field]: true }));
  }

  function validate() {
    const errors = {};
    if (touched.name && fields.name.trim().length < 2) errors.name = 'Please enter your full name.';
    if (touched.password && fields.password.length < 8) errors.password = 'Password must be at least 8 characters.';
    if (touched.confirm && fields.confirm !== fields.password) errors.confirm = "Passwords don't match.";
    return errors;
  }

  const clientErrors = validate();
  const errors = { ...clientErrors, ...fieldErrors };

  function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    if (file) setPhotoPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    clearAuthError();
    setTouched({ name: true, password: true, confirm: true });
    if (Object.keys(validate()).length > 0) return;

    const result = await registerDoctor({
      name: fields.name,
      email: fields.email,
      phone: fields.phone,
      password: fields.password,
      specialization: fields.specialization,
      bio: fields.bio,
    });
    // New doctor accounts start as status "pending" — route to /pending-approval on success.
    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/pending-approval');
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
                  Join our provider network.
                </h1>
                <p className="m-0 text-[0.9375rem] leading-normal text-white/75">
                  Apply below — our team reviews every application.
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
              Create your provider account
            </h2>
            <p className="m-0 text-[0.9375rem] text-ink-secondary">Tell us about your practice.</p>
          </div>

          <FormAlert>{error}</FormAlert>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="flex flex-col gap-2">
              <span className="text-[0.8125rem] font-semibold text-ink-secondary">Profile photo</span>
              <div className="flex items-center gap-3.5">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-full bg-clinician-subtle bg-cover bg-center transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-md active:scale-100"
                  style={photoPreview ? { backgroundImage: `url(${photoPreview})` } : undefined}
                  aria-label="Upload profile photo"
                >
                  {!photoPreview && (
                    <svg viewBox="0 0 24 24" fill="none" className="mx-auto h-6 w-6 text-clinician/60">
                      <path
                        d="M4 8a2 2 0 0 1 2-2h1.5l1-1.5h7l1 1.5H18a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <circle cx="12" cy="13" r="3.2" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                <span className="text-[0.8125rem] leading-snug text-ink-tertiary">
                  Drag a photo into the circle, or click to browse.
                </span>
              </div>
            </label>

            <Input
              label="Full name"
              tone="clinician"
              placeholder="Dr. Amara Okoye"
              value={fields.name}
              onChange={(e) => update('name', e.target.value)}
              onBlur={() => touch('name')}
              error={errors.name}
              required
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Email address"
                type="email"
                tone="clinician"
                placeholder="doctor@example.com"
                value={fields.email}
                onChange={(e) => update('email', e.target.value)}
                error={errors.email}
                required
              />
              <Input
                label="Phone number"
                type="tel"
                tone="clinician"
                placeholder="(555) 555-0100"
                value={fields.phone}
                onChange={(e) => update('phone', e.target.value)}
                error={errors.phone}
                required
              />
            </div>

            <label className="flex flex-col gap-1.5">
              <span className="text-[0.8125rem] font-semibold text-ink-secondary">Specialization</span>
              <select
                className={FIELD_CLASSES}
                value={fields.specialization}
                onChange={(e) => update('specialization', e.target.value)}
              >
                {SPECIALIZATIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-[0.8125rem] font-semibold text-ink-secondary">Short bio</span>
              <textarea
                placeholder="A sentence or two about your background and approach to care."
                rows={3}
                value={fields.bio}
                onChange={(e) => update('bio', e.target.value)}
                className={`${FIELD_CLASSES} resize-y leading-normal`}
              />
            </label>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Password"
                type="password"
                tone="clinician"
                placeholder="At least 8 characters"
                value={fields.password}
                onChange={(e) => update('password', e.target.value)}
                onBlur={() => touch('password')}
                error={errors.password}
                required
              />
              <Input
                label="Confirm password"
                type="password"
                tone="clinician"
                placeholder="Re-enter password"
                value={fields.confirm}
                onChange={(e) => update('confirm', e.target.value)}
                onBlur={() => touch('confirm')}
                error={errors.confirm}
                required
              />
            </div>

            <div className="flex items-start gap-2.5 rounded-xl bg-clinician-subtle px-4 py-3.5">
              <span className="flex-shrink-0 leading-tight text-clinician">ℹ</span>
              <span className="text-[0.8125rem] leading-relaxed font-medium text-clinician">
                Your profile will be reviewed by our team before you can access the dashboard.
              </span>
            </div>

            <Button type="submit" tone="clinician" loading={isLoading}>
              {isLoading ? 'Submitting…' : 'Submit Application'}
            </Button>
          </form>

          <p className="m-0 text-center text-[0.9375rem] text-ink-secondary">
            Already have an account?{' '}
            <Link
              to="/doctor/login"
              className="font-semibold text-clinician no-underline transition-colors duration-200 ease-in-out hover:text-clinician-hover"
            >
              Log in
            </Link>
          </p>
        </AuthCard>
      </main>

      <Footer />
    </div>
  );
}
