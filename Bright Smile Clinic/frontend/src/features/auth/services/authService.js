const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Thin wrapper around fetch that always sends the httpOnly auth cookie and
// normalizes the backend's { success, data, message } response shape into
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

export const authService = {
  registerPatient: (payload) => request('/auth/patient/signup', { method: 'POST', body: payload }),
  loginPatient: (payload) => request('/auth/patient/login', { method: 'POST', body: payload }),

  registerDoctor: (payload) => request('/auth/doctor/signup', { method: 'POST', body: payload }),
  loginDoctor: (payload) => request('/auth/doctor/login', { method: 'POST', body: payload }),

  loginAdmin: (payload) => request('/auth/admin/login', { method: 'POST', body: payload }),

  logout: () => request('/auth/logout', { method: 'POST' }),
  getMe: () => request('/auth/me'),
};
