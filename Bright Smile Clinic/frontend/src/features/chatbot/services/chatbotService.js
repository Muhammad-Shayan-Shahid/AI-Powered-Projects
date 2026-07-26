// Relative path: same-origin in production, proxied by Vite locally (see vite.config.js).
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Same request/error-normalization pattern as authService.js — public endpoint,
// but credentials stay included for consistency with every other service call.
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

export const chatbotService = {
  sendMessage: (payload) => request('/chatbot/message', { method: 'POST', body: payload }),
};
