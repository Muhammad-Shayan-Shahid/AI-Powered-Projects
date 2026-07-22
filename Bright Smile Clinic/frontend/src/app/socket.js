import { io } from 'socket.io-client';

// Reuses the same host as the REST API, just without the /api suffix.
const SOCKET_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/api\/?$/, '');

let socket = null;

// One shared connection for the whole app, opened once on login and torn
// down on logout — never create a second connection per page/feature.
export function connectSocket() {
  if (socket?.connected) return socket;
  socket = io(SOCKET_URL, {
    withCredentials: true, // sends the httpOnly auth cookie so the server can identify the user
  });
  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}

export function getSocket() {
  return socket;
}
