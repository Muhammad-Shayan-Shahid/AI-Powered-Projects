const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Mirrors authService/doctorService's request wrapper: always sends the httpOnly
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

function buildQuery(params) {
  const query = new URLSearchParams();
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value) query.set(key, value);
  });
  const qs = query.toString();
  return qs ? `?${qs}` : '';
}

export const adminService = {
  listPendingDoctors: () => request('/admin/doctors/pending'),
  approveDoctor: (id) => request(`/admin/doctors/${id}/approve`, { method: 'PATCH' }),
  rejectDoctor: (id, reason) => request(`/admin/doctors/${id}/reject`, { method: 'PATCH', body: { reason } }),

  listActiveDoctors: () => request('/doctors'),

  listServices: () => request('/services'),
  createService: (payload) => request('/services', { method: 'POST', body: payload }),
  updateService: (id, payload) => request(`/services/${id}`, { method: 'PUT', body: payload }),
  deleteService: (id) => request(`/services/${id}`, { method: 'DELETE' }),

  listDocuments: () => request('/admin/documents'),
  createDocument: (payload) => request('/admin/documents', { method: 'POST', body: payload }),
  updateDocument: (id, payload) => request(`/admin/documents/${id}`, { method: 'PUT', body: payload }),
  deleteDocument: (id) => request(`/admin/documents/${id}`, { method: 'DELETE' }),

  listAllAppointments: (filters) => request(`/admin/appointments${buildQuery(filters)}`),
};
