import axios from 'axios'

const api = axios.create({
  baseURL: 'https://ai-powered-projects.onrender.com',
  withCredentials: true
})

const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
})

export async function fetchSessionReport(sessionId) {
  const res = await api.get(`/api/session/report/${sessionId}`, authHeader())
  return res.data
}