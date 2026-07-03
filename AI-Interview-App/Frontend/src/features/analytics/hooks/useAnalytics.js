import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  setLoading, setError, setStats,
  setWeakTopics, setImprovement, setConfidence, setSessions
} from '../analyticsSlice.js'
import {
  fetchDashboardStats, fetchWeakTopics,
  fetchImprovement, fetchConfidence, fetchSessionHistory
} from '../services/analyticService.js'

export function useAnalytics() {
  const dispatch = useDispatch()
  const { stats, weakTopics, improvement, confidence, sessions, loading, error } =
    useSelector(s => s.analytics)

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    try {
      dispatch(setLoading(true))
      dispatch(setError(null))
      const [statsRes, weakRes, impRes, confRes, sessRes] = await Promise.all([
        fetchDashboardStats(),
        fetchWeakTopics(),
        fetchImprovement(),
        fetchConfidence(),
        fetchSessionHistory(),
      ])
      dispatch(setStats(statsRes))
      dispatch(setWeakTopics(weakRes.weakTopics   || []))
      dispatch(setImprovement(impRes.improvement  || []))
      dispatch(setConfidence(confRes.confidence   || []))
      dispatch(setSessions(sessRes.sessions       || []))
    } catch (err) {
      dispatch(setError(err.response?.data?.message || 'Failed to load analytics'))
    } finally {
      dispatch(setLoading(false))
    }
  }

  return { stats, weakTopics, improvement, confidence, sessions, loading, error, reload: loadAll }
}