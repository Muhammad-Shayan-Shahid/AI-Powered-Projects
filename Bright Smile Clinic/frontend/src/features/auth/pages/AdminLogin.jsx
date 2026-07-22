import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../../components/Card';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import FormAlert from '../../../components/FormAlert';
import { useAuth } from '../hooks/useAuth';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { loginAdmin, isLoading, error, fieldErrors, clearAuthError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Wipe any leftover error from a previous auth form (e.g. a failed login)
  // so it doesn't bleed into this page on navigation.
  useEffect(() => {
    clearAuthError();
  }, [clearAuthError]);

  async function handleSubmit(e) {
    e.preventDefault();
    clearAuthError();
    const result = await loginAdmin({ email, password });
    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/admin/dashboard');
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-page-admin p-4 sm:p-10">
      <div className="flex w-full max-w-[380px] animate-fade-in-up flex-col gap-6">
        <div className="flex flex-col items-center gap-2.5 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-admin text-base font-bold text-white">
            BS
          </div>
          <div>
            <div className="text-lg font-bold tracking-tight text-ink">Admin console</div>
            <div className="mt-0.5 text-[0.8125rem] text-ink-tertiary">Bright Smile Dental Clinic</div>
          </div>
        </div>

        <Card className="flex flex-col gap-[18px] border-border-admin p-8 shadow-[0_8px_24px_oklch(22%_0.01_260_/_0.06)]">
          <FormAlert>{error}</FormAlert>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Email address"
              type="email"
              tone="admin"
              placeholder="admin@brightsmile.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={fieldErrors?.email}
              required
            />

            <Input
              label="Password"
              type="password"
              tone="admin"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={fieldErrors?.password}
              required
            />

            <Button type="submit" tone="admin" pill={false} loading={isLoading} className="mt-1">
              {isLoading ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
        </Card>

        <div className="text-center text-xs text-ink-tertiary">Restricted access · Internal use only</div>
      </div>
    </div>
  );
}
