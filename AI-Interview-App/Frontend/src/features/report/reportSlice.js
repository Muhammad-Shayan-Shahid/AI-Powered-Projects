import { createSlice } from '@reduxjs/toolkit'

const reportSlice = createSlice({
  name: 'report',
  initialState: {
    session: null,
    report:  null,
    loading: false,
    error:   null,
  },
  reducers: {
    setLoading: (state, action) => { state.loading = action.payload },
    setError:   (state, action) => { state.error   = action.payload },
    setReport:  (state, action) => {
      state.session = action.payload.session
      state.report  = action.payload.report
    },
    clearReport: (state) => {
      state.session = null
      state.report  = null
    },
  },
})

export const { setLoading, setError, setReport, clearReport } = reportSlice.actions
export default reportSlice.reducer