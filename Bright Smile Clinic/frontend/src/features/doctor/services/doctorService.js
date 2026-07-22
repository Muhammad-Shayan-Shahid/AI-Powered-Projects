import { uploadRequest } from '../../../utils/uploadRequest';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Mirrors authService/bookingService's request wrapper: always sends the httpOnly
// auth cookie and normalizes the backend's { success, data, message } shape into
// a thrown error when the request fails, so callers only handle the happy path.
async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method || 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const body = await response.json().catch(() => null);

  if (!response.ok || !body?.success) {
    const error = new Error(body?.message || 'Something went wrong. Please try again.');
    error.fieldErrors = body?.data?.errors || null;
    error.status = response.status;
    throw error;
  }

  return body.data;
}

export const doctorService = {
  getStats: () => request('/appointments/doctor/stats'),
  listAppointments: () => request('/appointments/doctor'),
  confirmAppointment: (id) => request(`/appointments/${id}/confirm`, { method: 'PATCH' }),
  rejectAppointment: (id, reason) => request(`/appointments/${id}/reject`, { method: 'PATCH', body: { reason } }),

  listAvailability: () => request('/availability'),
  createAvailability: (payload) => request('/availability', { method: 'POST', body: payload }),
  updateAvailability: (id, payload) => request(`/availability/${id}`, { method: 'PATCH', body: payload }),
  deleteAvailability: (id) => request(`/availability/${id}`, { method: 'DELETE' }),

  // multipart/form-data (specialization, bio, optional `photo` file) so a
  // real image upload can flow through to ImageKit — see upload.service.js.
  // Built on XHR (uploadRequest), not the fetch-based request() above, so an
  // onProgress callback can drive a real progress bar.
  uploadProfile: (formData, onProgress) =>
    uploadRequest('/users/doctor-profile', formData, { method: 'PATCH', onProgress }),
};
