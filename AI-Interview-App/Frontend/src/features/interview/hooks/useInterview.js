import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  setLoading, setSubmitting, setError,
  setLastEvaluation, startSession, nextQuestion, resetInterview
} from '../interviewSlice.js'
import {
  startSessionService, submitAnswerService, completeSessionService
} from '../services/interviewServices.js'

export function useInterview() {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const interview = useSelector(s => s.interview)

  async function handleStartSession({ domain, difficulty, totalQuestions }) {
    try {
      dispatch(setLoading(true))
      dispatch(setError(null))
      const data = await startSessionService({ domain, difficulty, totalQuestions })
      dispatch(startSession({
        sessionId:  data.sessionId,
        questions:  data.questions,
        domain,
        difficulty,
      }))
      navigate('/interview')
    } catch (err) {
      dispatch(setError(err.response?.data?.message || 'Failed to start session'))
    } finally {
      dispatch(setLoading(false))
    }
  }

  async function handleSubmitAnswer({ questionId, answerText, timeTaken }) {
    try {
      dispatch(setSubmitting(true))
      dispatch(setError(null))
      const data = await submitAnswerService({
        sessionId: interview.sessionId,
        questionId,
        answerText,
        timeTaken,
      })
      dispatch(setLastEvaluation(data.evaluation))
      return data.evaluation
    } catch (err) {
      dispatch(setError(err.response?.data?.message || 'Failed to submit answer'))
    } finally {
      dispatch(setSubmitting(false))
    }
  }

  async function handleNextQuestion(evaluationData) {
    dispatch(nextQuestion(evaluationData))
  }

  async function handleCompleteSession() {
    try {
      dispatch(setLoading(true))
      await completeSessionService({ sessionId: interview.sessionId })
      navigate(`/report/${interview.sessionId}`)
      dispatch(resetInterview())
    } catch (err) {
      dispatch(setError(err.response?.data?.message || 'Failed to complete session'))
    } finally {
      dispatch(setLoading(false))
    }
  }

  function handleResetInterview() {
    dispatch(resetInterview())
    navigate('/setup')
  }

  const currentQuestion = interview.questions[interview.currentIndex] || null
  const isLastQuestion  = interview.currentIndex === interview.questions.length - 1
  const progress        = interview.questions.length
    ? Math.round((interview.currentIndex / interview.questions.length) * 100)
    : 0

  return {
    ...interview,
    currentQuestion,
    isLastQuestion,
    progress,
    handleStartSession,
    handleSubmitAnswer,
    handleNextQuestion,
    handleCompleteSession,
    handleResetInterview,
  }
}