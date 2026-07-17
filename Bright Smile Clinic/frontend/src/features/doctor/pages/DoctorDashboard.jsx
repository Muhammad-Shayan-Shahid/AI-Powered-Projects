import { useNavigate } from 'react-router-dom';
import Button from '../../../components/Button';
import { useAuth } from '../../auth/hooks/useAuth';

// Placeholder — replace with the real doctor dashboard.
export default function DoctorDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  async function handleLogout() {
    await logout();
    navigate('/doctor/login');
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-page p-10 text-center">
      <h1 className="text-2xl font-bold text-ink">Welcome, Dr. {user?.name}</h1>
      <p className="text-ink-secondary">Doctor dashboard placeholder.</p>
      <Button tone="clinician" fullWidth={false} onClick={handleLogout}>
        Log out
      </Button>
    </div>
  );
}
