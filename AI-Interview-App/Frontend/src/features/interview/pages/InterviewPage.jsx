import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../../components/Navbar.jsx'
import { useInterview } from '../hooks/useInterview.js'
import './InterviewPage.css'

const scoreColor = s => s >= 7 ? '#22c55e' : s >= 5 ? '#fbbf24' : '#f87171'
const confClass  = l => `iv-conf-val iv-conf-${l?.toLowerCase()}`

const diffBadgeClass = d => ({
  Easy:   'iv-badge iv-badge-diff-easy',
  Medium: 'iv-badge iv-badge-diff-medium',
  Hard:   'iv-badge iv-badge-diff-hard',
}[d] || 'iv-badge iv-badge-diff-medium')

export default function InterviewPage() {
  const navigate  = useNavigate()
  const {
    sessionId, questions, currentIndex, currentQuestion,
    domain, difficulty, isLastQuestion, progress,
    lastEvaluation, submitting, loading,
    handleSubmitAnswer, handleNextQuestion, handleCompleteSession, handleResetInterview,
  } = useInterview()

  const [answer,    setAnswer]    = useState('')
  const [startTime, setStartTime] = useState(Date.now())
  const [elapsed,   setElapsed]   = useState(0)
  const timerRef = useRef(null)

  /* start timer when question changes */
  useEffect(() => {
    setAnswer('')
    setStartTime(Date.now())
    setElapsed(0)
    timerRef.current = setInterval(() => {
      setElapsed(s => s + 1)
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [currentIndex])

  /* format timer */
  const fmt = s => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`

  /* no session guard */
  if (!sessionId) return (
    <>
      <Navbar />
      <div className="iv-root">
        <div className="iv-bg" />
        <div className="iv-container">
          <div className="iv-no-session">
            <div className="iv-no-session-box">
              <div className="iv-no-session-icon">🎯</div>
              <div className="iv-no-session-title">No Active Session</div>
              <div className="iv-no-session-sub">Set up an interview session first.</div>
              <button className="iv-no-session-btn" onClick={() => navigate('/setup')}>
                Go to Setup
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )

  const onSubmit = async () => {
    if (!answer.trim()) return
    clearInterval(timerRef.current)
    const timeTaken = Math.floor((Date.now() - startTime) / 1000)
    await handleSubmitAnswer({
      questionId: currentQuestion._id,
      answerText: answer.trim(),
      timeTaken,
    })
  }

  const onNext = async () => {
    await handleNextQuestion(lastEvaluation)
  }

  const onComplete = async () => {
    await handleCompleteSession()
  }

  return (
    <>
      <Navbar />
      <div className="iv-root">
        <div className="iv-bg" />
        <div className="iv-container">

          {/* ── Top Bar ── */}
          <div className="iv-topbar">
            <div className="iv-session-info">
              <span className="iv-badge iv-badge-domain">{domain}</span>
              <span className={diffBadgeClass(difficulty)}>{difficulty}</span>
              <span className="iv-counter">
                Question {currentIndex + 1} of {questions.length}
              </span>
            </div>
            <button className="iv-quit-btn" onClick={handleResetInterview}>
              ✕ Quit
            </button>
          </div>

          {/* ── Progress ── */}
          <div className="iv-progress-wrap">
            <div className="iv-progress-bar">
              <div className="iv-progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <div className="iv-progress-label">
              <span>{progress}% complete</span>
              <span>{questions.length - currentIndex - 1} remaining</span>
            </div>
          </div>

          {/* ── Question Card ── */}
          {currentQuestion && (
            <div className="iv-question-card">
              <div className="iv-q-header">
                <span className="iv-q-num">Question {currentIndex + 1}</span>
                <div className="iv-timer">
                  <div className="iv-timer-dot" />
                  {fmt(elapsed)}
                </div>
              </div>
              <p className="iv-question-text">{currentQuestion.questionText}</p>
              {currentQuestion.tags?.length > 0 && (
                <div className="iv-tags">
                  {currentQuestion.tags.map(t => (
                    <span key={t} className="iv-tag">{t}</span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Answer or Feedback ── */}
          {!lastEvaluation ? (
            <>
              <div className="iv-answer-card">
                <div className="iv-answer-label">Your Answer</div>
                <textarea
                  className="iv-textarea"
                  placeholder="Type your answer here... Be as detailed as possible."
                  value={answer}
                  onChange={e => setAnswer(e.target.value)}
                  disabled={submitting}
                />
                <div className="iv-char-count">{answer.length} characters</div>
              </div>

              <button
                className="iv-submit-btn"
                onClick={onSubmit}
                disabled={submitting || !answer.trim()}
              >
                {submitting
                  ? <><span className="iv-spinner" /> Evaluating with AI...</>
                  : <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"
                          stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Submit Answer
                    </>
                }
              </button>
            </>
          ) : (
            /* ── Feedback Card ── */
            <div
              className="iv-feedback-card"
              style={{
                background: `rgba(15,23,36,0.9)`,
                border: `1px solid ${scoreColor(lastEvaluation.score)}30`,
              }}
            >
              <div className="iv-feedback-header">
                <span className="iv-feedback-title">🤖 AI Evaluation</span>
                <div className="iv-score-badge">
                  <span className="iv-score-num" style={{ color: scoreColor(lastEvaluation.score) }}>
                    {lastEvaluation.score}
                  </span>
                  <span className="iv-score-max">/ 10</span>
                </div>
              </div>

              <div className="iv-feedback-text">{lastEvaluation.feedback}</div>

              <div className="iv-keywords-row">
                <div className="iv-keywords-col">
                  <div className="iv-kw-title covered">✓ Covered Keywords</div>
                  <div className="iv-kw-tags">
                    {lastEvaluation.keywordsCovered?.length > 0
                      ? lastEvaluation.keywordsCovered.map(k => (
                          <span key={k} className="iv-kw-tag covered">{k}</span>
                        ))
                      : <span style={{fontSize:'12px', color:'#334155'}}>None covered</span>
                    }
                  </div>
                </div>
                <div className="iv-keywords-col">
                  <div className="iv-kw-title missed">✗ Missed Keywords</div>
                  <div className="iv-kw-tags">
                    {lastEvaluation.keywordsMissed?.length > 0
                      ? lastEvaluation.keywordsMissed.map(k => (
                          <span key={k} className="iv-kw-tag missed">{k}</span>
                        ))
                      : <span style={{fontSize:'12px', color:'#334155'}}>None missed 🎉</span>
                    }
                  </div>
                </div>
              </div>

              <div className="iv-confidence">
                <span className="iv-conf-label">Confidence Level:</span>
                <span className={confClass(lastEvaluation.confidenceLevel)}>
                  {lastEvaluation.confidenceLevel}
                </span>
              </div>

              {isLastQuestion ? (
                <button
                  className="iv-next-btn complete"
                  onClick={onComplete}
                  disabled={loading}
                >
                  {loading
                    ? <><span className="iv-spinner" /> Finishing...</>
                    : <>🏁 Complete Interview &amp; See Report</>
                  }
                </button>
              ) : (
                <button className="iv-next-btn next" onClick={onNext}>
                  Next Question →
                </button>
              )}
            </div>
          )}

        </div>
      </div>
    </>
  )
}