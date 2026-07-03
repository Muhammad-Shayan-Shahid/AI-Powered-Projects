import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading, setError, setReport } from '../reportSlice.js'
import { fetchSessionReport } from '../services/reportService.js'

export function useReport(sessionId) {
  const dispatch = useDispatch()
  const { session, report, loading, error } = useSelector(s => s.report)

  useEffect(() => {
    if (sessionId) loadReport()
  }, [sessionId])

  async function loadReport() {
    try {
      dispatch(setLoading(true))
      dispatch(setError(null))
      const data = await fetchSessionReport(sessionId)
      dispatch(setReport({ session: data.session, report: data.report }))
    } catch (err) {
      dispatch(setError(err.response?.data?.message || 'Failed to load report'))
    } finally {
      dispatch(setLoading(false))
    }
  }

  return { session, report, loading, error, reload: loadReport }
}