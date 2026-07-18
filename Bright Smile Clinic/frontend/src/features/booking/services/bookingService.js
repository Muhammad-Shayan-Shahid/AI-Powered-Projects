const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Mirrors authService's request wrapper: always sends the httpOnly auth
// cookie and normalizes the backend's { success, data, message } shape into
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

export const bookingService = {
  listServices: () => request('/services'),
  listDoctors: () => request('/doctors'),
  getAvailableSlots: ({ doctorId, serviceId, date }) =>
    request(`/appointments/available-slots?doctorId=${doctorId}&serviceId=${serviceId}&date=${date}`),
  createAppointment: (payload) => request('/appointments', { method: 'POST', body: payload }),
  listMyAppointments: () => request('/appointments/mine'),
  cancelAppointment: (id) => request(`/appointments/${id}/cancel`, { method: 'PATCH' }),
};
