import { createSlice } from '@reduxjs/toolkit'

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    stats:       null,
    weakTopics:  [],
    improvement: [],
    confidence:  [],
    sessions:    [],
    loading:     false,
    error:       null,
  },
  reducers: {
    setLoading:     (state, action) => { state.loading     = action.payload },
    setError:       (state, action) => { state.error       = action.payload },
    setStats:       (state, action) => { state.stats       = action.payload },
    setWeakTopics:  (state, action) => { state.weakTopics  = action.payload },
    setImprovement: (state, action) => { state.improvement = action.payload },
    setConfidence:  (state, action) => { state.confidence  = action.payload },
    setSessions:    (state, action) => { state.sessions    = action.payload },
  },
})

export const {
  setLoading, setError, setStats,
  setWeakTopics, setImprovement, setConfidence, setSessions
} = dashboardSlice.actions

export default dashboardSlice.reducer