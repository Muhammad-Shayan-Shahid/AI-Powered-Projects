import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Login          from '../features/auth/pages/Login.jsx'
import Signup         from '../features/auth/pages/Signup.jsx'
import Dashboard      from '../features/dashboard/pages/Dashboard.jsx'
import InterviewSetup from '../features/interview/pages/InterviewSetup.jsx'
import InterviewPage  from '../features/interview/pages/InterviewPage.jsx'
import SessionReport  from '../features/report/pages/Report.jsx'
import Analytics      from '../features/analytics/pages/Analytics.jsx'

const ProtectedRoute = ({ children }) => {
  const { token } = useSelector(state => state.auth)
  return token ? children : <Navigate to="/login" />
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/"                   element={<Navigate to="/login" />} />
      <Route path="/login"              element={<Login />} />
      <Route path="/signup"             element={<Signup />} />
      <Route path="/dashboard"          element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/setup"              element={<ProtectedRoute><InterviewSetup /></ProtectedRoute>} />
      <Route path="/interview"          element={<ProtectedRoute><InterviewPage /></ProtectedRoute>} />
      <Route path="/report/:sessionId"  element={<ProtectedRoute><SessionReport /></ProtectedRoute>} />
      <Route path="/analytics"          element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
    </Routes>
  )
}