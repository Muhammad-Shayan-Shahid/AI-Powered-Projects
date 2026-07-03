import axios from 'axios'

const api = axios.create({
   baseURL: 'http://localhost:3000',
  withCredentials: true,
})

const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
})

export async function startSessionService({ domain, difficulty, totalQuestions }) {
  const res = await api.post('/api/session/start', { domain, difficulty, totalQuestions }, authHeader())
  return res.data
}

export async function submitAnswerService({ sessionId, questionId, answerText, timeTaken }) {
  const res = await api.post('/api/answer/submit', { sessionId, questionId, answerText, timeTaken }, authHeader())
  return res.data
}

export async function completeSessionService({ sessionId }) {
  const res = await api.post('/api/session/complete', { sessionId }, authHeader())
  return res.data
}