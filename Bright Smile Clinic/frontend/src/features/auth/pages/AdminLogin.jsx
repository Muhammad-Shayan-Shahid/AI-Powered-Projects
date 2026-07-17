import { useState } from 'react';
import Card from '../../../components/Card';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import FormAlert from '../../../components/FormAlert';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    // TODO: wire up to POST /api/auth/admin/login once the backend endpoint exists.
    // Admin accounts are never created through a public signup route (see CLAUDE.md).
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
              required
            />

            <Input
              label="Password"
              type="password"
              tone="admin"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button type="submit" tone="admin" pill={false} loading={loading} className="mt-1">
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
        </Card>

        <div className="text-center text-xs text-ink-tertiary">Restricted access · Internal use only</div>
      </div>
    </div>
  );
}
