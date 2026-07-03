import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setLoading, setError, setAuth, logout } from '../authSlice.js'
import { loginService, signupService } from '../services/authServices.js'

export function useAuth() {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const { user, token, loading, error } = useSelector(state => state.auth)

  async function handleLogin({ email, password }) {
    try {
      dispatch(setLoading(true))
      dispatch(setError(null))
      const data = await loginService({ email, password })
      dispatch(setAuth({ user: data.user, token: data.token }))
      navigate('/dashboard')
    } catch (err) {
      dispatch(setError(err.response?.data?.message || 'Login failed'))
    } finally {
      dispatch(setLoading(false))
    }
  }

  async function handleSignup({ username, email, password, targetRole }) {
    try {
      dispatch(setLoading(true))
      dispatch(setError(null))
      const data = await signupService({ username, email, password, targetRole })
      dispatch(setAuth({ user: data.user, token: data.token }))
      navigate('/dashboard')
    } catch (err) {
      dispatch(setError(err.response?.data?.message || 'Signup failed'))
    } finally {
      dispatch(setLoading(false))
    }
  }

  function handleLogout() {
    dispatch(logout())
    navigate('/login')
  }

  return { user, token, loading, error, handleLogin, handleSignup, handleLogout }
}