import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from '../features/public/pages/Home';
import BrowseDoctors from '../features/public/pages/BrowseDoctors';
import DoctorProfile from '../features/public/pages/DoctorProfile';
import BrowseServices from '../features/public/pages/BrowseServices';
import Login from '../features/auth/pages/Login';
import Signup from '../features/auth/pages/Signup';
import DoctorLogin from '../features/auth/pages/DoctorLogin';
import DoctorSignup from '../features/auth/pages/DoctorSignup';
import PendingApproval from '../features/auth/pages/PendingApproval';
import AdminLogin from '../features/auth/pages/AdminLogin';
import PatientDashboard from '../features/patient/pages/PatientDashboard';
import DoctorDashboard from '../features/doctor/pages/DoctorDashboard';
import AppointmentRequests from '../features/doctor/pages/AppointmentRequests';
import MyAvailability from '../features/doctor/pages/MyAvailability';
import ProfileEdit from '../features/doctor/pages/ProfileEdit';
import PatientHistory from '../features/doctor/pages/PatientHistory';
import AdminDashboard from '../features/admin/pages/AdminDashboard';
import PendingDoctors from '../features/admin/pages/PendingDoctors';
import ManageDoctors from '../features/admin/pages/ManageDoctors';
import ManageServices from '../features/admin/pages/ManageServices';
import KnowledgeBase from '../features/admin/pages/KnowledgeBase';
import AllAppointments from '../features/admin/pages/AllAppointments';
import BookAppointment from '../features/booking/pages/BookAppointment';
import MyAppointments from '../features/booking/pages/MyAppointments';
import BookingConfirmation from '../features/booking/pages/BookingConfirmation';
import ProtectedRoute from './ProtectedRoute';

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/doctors', element: <BrowseDoctors /> },
  { path: '/doctors/:id', element: <DoctorProfile /> },
  { path: '/services', element: <BrowseServices /> },
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
    path: '/doctor/appointment-requests',
    element: (
      <ProtectedRoute roles={['doctor']}>
        <AppointmentRequests />
      </ProtectedRoute>
    ),
  },
  {
    path: '/doctor/availability',
    element: (
      <ProtectedRoute roles={['doctor']}>
        <MyAvailability />
      </ProtectedRoute>
    ),
  },
  {
    path: '/doctor/patient-history',
    element: (
      <ProtectedRoute roles={['doctor']}>
        <PatientHistory />
      </ProtectedRoute>
    ),
  },
  {
    path: '/doctor/profile',
    element: (
      <ProtectedRoute roles={['doctor']}>
        <ProfileEdit />
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
  {
    path: '/admin/pending-doctors',
    element: (
      <ProtectedRoute roles={['admin']}>
        <PendingDoctors />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/manage-doctors',
    element: (
      <ProtectedRoute roles={['admin']}>
        <ManageDoctors />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/manage-services',
    element: (
      <ProtectedRoute roles={['admin']}>
        <ManageServices />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/knowledge-base',
    element: (
      <ProtectedRoute roles={['admin']}>
        <KnowledgeBase />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/all-appointments',
    element: (
      <ProtectedRoute roles={['admin']}>
        <AllAppointments />
      </ProtectedRoute>
    ),
  },
  {
    path: '/booking/book',
    element: (
      <ProtectedRoute roles={['patient']}>
        <BookAppointment />
      </ProtectedRoute>
    ),
  },
  {
    path: '/booking/my-appointments',
    element: (
      <ProtectedRoute roles={['patient']}>
        <MyAppointments />
      </ProtectedRoute>
    ),
  },
  {
    path: '/booking/confirmation',
    element: (
      <ProtectedRoute roles={['patient']}>
        <BookingConfirmation />
      </ProtectedRoute>
    ),
  },
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}
