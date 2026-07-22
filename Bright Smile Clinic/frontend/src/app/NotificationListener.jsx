import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../features/auth/hooks/useAuth';
import { connectSocket, disconnectSocket } from './socket';

// Maps each role to the appointment events relevant to *their own*
// appointments — a patient never listens for another patient's booking, a
// doctor never listens for another doctor's confirm/reject.
const EVENTS_BY_ROLE = {
  doctor: ['appointment:created', 'doctor:approved', 'doctor:rejected'],
  patient: ['appointment:confirmed', 'appointment:rejected'],
};

// App-wide socket listener: connects once a session exists, disconnects on
// logout, and surfaces every incoming event as a toast. Mounted once in
// app.jsx rather than per-page.
export default function NotificationListener() {
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      disconnectSocket();
      return undefined;
    }

    const socket = connectSocket();
    const events = EVENTS_BY_ROLE[user.role] || [];
    const handleEvent = (payload) => toast.info(payload.message);

    events.forEach((event) => socket.on(event, handleEvent));

    return () => {
      events.forEach((event) => socket.off(event, handleEvent));
    };
  }, [isAuthenticated, user?.role]);

  return null;
}
