import { io } from 'socket.io-client';

// Reuses the same host as the REST API, just without the /api suffix. When
// VITE_API_URL isn't set, leave this undefined so socket.io-client connects
// to same-origin (window.location) — correct in production (single Render
// service) and locally, where Vite's dev proxy forwards the /socket.io
// handshake to the backend (see vite.config.js) so no host needs hardcoding.
const SOCKET_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '')
  : undefined;

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
