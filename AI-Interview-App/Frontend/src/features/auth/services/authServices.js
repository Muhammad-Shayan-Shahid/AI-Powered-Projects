import axios from 'axios'

const api = axios.create({
  baseURL: 'https://ai-powered-projects.onrender.com',
  withCredentials: true,
})

export async function loginService({ email, password }) {
  const response = await api.post('/api/auth/login', { email, password })
  return response.data
}

export async function signupService({ username, email, password, targetRole }) {
  const response = await api.post('/api/auth/register', { username, email, password, targetRole })
  return response.data
}