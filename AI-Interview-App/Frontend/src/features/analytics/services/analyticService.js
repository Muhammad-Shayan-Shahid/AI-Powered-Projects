import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
})

const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
})

export async function fetchDashboardStats() {
  const res = await api.get('/api/analytics/dashboard', authHeader())
  return res.data
}

export async function fetchWeakTopics() {
  const res = await api.get('/api/analytics/weak-topics', authHeader())
  return res.data
}

export async function fetchImprovement() {
  const res = await api.get('/api/analytics/improvement', authHeader())
  return res.data
}

export async function fetchConfidence() {
  const res = await api.get('/api/analytics/confidence', authHeader())
  return res.data
}

export async function fetchSessionHistory() {
  const res = await api.get('/api/analytics/session-history', authHeader())
  return res.data
}