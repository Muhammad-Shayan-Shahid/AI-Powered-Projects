import { createSlice } from '@reduxjs/toolkit'

const token = localStorage.getItem('token')
const user  = JSON.parse(localStorage.getItem('user') || 'null')

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user,
    token,
    loading: false,
    error: null,
  },
  reducers: {
    setLoading: (state, action) => { state.loading = action.payload },
    setError:   (state, action) => { state.error   = action.payload },
    setAuth:    (state, action) => {
      state.user  = action.payload.user
      state.token = action.payload.token
      state.error = null
      localStorage.setItem('token', action.payload.token)
      localStorage.setItem('user',  JSON.stringify(action.payload.user))
    },
    logout: (state) => {
      state.user  = null
      state.token = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
  },
})

export const { setLoading, setError, setAuth, logout } = authSlice.actions
export default authSlice.reducer