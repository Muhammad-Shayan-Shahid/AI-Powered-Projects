import { configureStore } from '@reduxjs/toolkit'
import authReducer      from '../features/auth/authSlice.js'
import dashboardReducer from '../features/dashboard/dashboardSlice.js'
import interviewReducer from '../features/interview/interviewSlice.js'
import reportReducer    from '../features/report/reportSlice.js'
import analyticsReducer from '../features/analytics/analyticsSlice.js'

export const store = configureStore({
  reducer: {
    auth:      authReducer,
    dashboard: dashboardReducer,
    interview: interviewReducer,
    report:    reportReducer,
    analytics: analyticsReducer,
  },
})