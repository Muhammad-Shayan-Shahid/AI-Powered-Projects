import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from '../features/auth/pages/Login';
import Signup from '../features/auth/pages/Signup';
import DoctorLogin from '../features/auth/pages/DoctorLogin';
import DoctorSignup from '../features/auth/pages/DoctorSignup';
import PendingApproval from '../features/auth/pages/PendingApproval';
import AdminLogin from '../features/auth/pages/AdminLogin';

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
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}
