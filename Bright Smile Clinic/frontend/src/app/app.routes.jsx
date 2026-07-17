import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from '../features/auth/pages/Login';
import Signup from '../features/auth/pages/Signup';
import DoctorLogin from '../features/auth/pages/DoctorLogin';
import DoctorSignup from '../features/auth/pages/DoctorSignup';
import PendingApproval from '../features/auth/pages/PendingApproval';
import AdminLogin from '../features/auth/pages/AdminLogin';
import PatientDashboard from '../features/patient/pages/PatientDashboard';
import DoctorDashboard from '../features/doctor/pages/DoctorDashboard';
import AdminDashboard from '../features/admin/pages/AdminDashboard';
import ProtectedRoute from './ProtectedRoute';

function Home() {
  return <p>Frontend connected</p>;
}

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <Signup /> },
  { path: '/doctor/login', element: <DoctorLogin /> },
  { path: '/doctor/signup', element: <DoctorSignup /> },
  { path: '/pending-approval', element: <PendingApproval /> },
  { path: '/admin/login', element: <AdminLogin /> },
  {
    path: '/patient/dashboard',
    element: (
      <ProtectedRoute roles={['patient']}>
        <PatientDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/doctor/dashboard',
    element: (
      <ProtectedRoute roles={['doctor']}>
        <DoctorDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/dashboard',
    element: (
      <ProtectedRoute roles={['admin']}>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}
