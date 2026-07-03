import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../../../components/Navbar.jsx'
import { useReport } from '../hooks/useReport.js'
import './Report.css'

const scoreColor = s => s >= 7 ? '#22c55e' : s >= 5 ? '#fbbf24' : '#f87171'

const getGrade = score => {
  if (score >= 80) return { label: '🏆 Excellent',  cls: 'report-grade report-grade-a' }
  if (score >= 65) return { label: '👍 Good',        cls: 'report-grade report-grade-b' }
  if (score >= 50) return { label: '📈 Average',     cls: 'report-grade report-grade-c' }
  return              { label: '💪 Keep Practicing', cls: 'report-grade report-grade-d' }
}

const confClass = l => `report-conf-badge report-conf-${l?.toLowerCase()}`

export default function SessionReport() {
  const { sessionId } = useParams()
  const navigate      = useNavigate()
  const { session, report, loading, error } = useReport(sessionId)
  const [expanded, setExpanded] = useState(null)

  const toggle = i => setExpanded(p => p === i ? null : i)

  /* ── Loader ── */
  if (loading) return (
    <div className="report-loader">
      <div className="report-loader-inner">
        <div className="report-spinner" />
        <span className="report-loader-text">Loading your report...</span>
      </div>
    </div>
  )

  /* ── Error ── */
  if (error || !session) return (
    <>
      <Navbar />
      <div className="report-root">
        <div className="report-bg" />
        <div className="report-container" style={{ textAlign:'center', paddingTop:'80px' }}>
          <div style={{ fontSize:'48px', marginBottom:'16px' }}>😕</div>
          <div style={{ fontFamily:'Syne,sans-serif', fontSize:'22px', fontWeight:700, marginBottom:'8px' }}>
            Report not found
          </div>
          <div style={{ color:'#475569', marginBottom:'24px' }}>{error}</div>
          <button className="report-btn-primary" style={{ maxWidth:'200px', margin:'0 auto' }}
            onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </button>
        </div>
      </div>
    </>
  )

  const grade   = getGrade(session.finalScore)
  const answers = report?.answers || []

  return (
    <>
      <Navbar />
      <div className="report-root">
        <div className="report-bg" />
        <div className="report-container">

          {/* ── Header ── */}
          <div className="report-header">
            <div className="report-tag">✅ Interview Complete</div>
            <h1 className="report-title">
              Your <span className="gradient-text">Session Report</span>
            </h1>
            <p className="report-subtitle">
              {session.domain} · {session.difficulty} · {new Date(session.startedAt).toLocaleDateString()}
            </p>
          </div>

          {/* ── Score Hero ── */}
          <div className="report-score-hero">
            <div className="report-score-left">
              <div className="report-score-label">Final Score</div>
              <div className="report-score-big" style={{ color: scoreColor(session.finalScore / 10) }}>
                {session.finalScore}
                <span className="report-score-suffix">%</span>
              </div>
              <div className={grade.cls}>{grade.label}</div>
            </div>

            <div className="report-score-right">
              {[
                ['Domain',    session.domain],
                ['Difficulty',session.difficulty],
                ['Questions', `${session.answeredCount} / ${session.totalQuestions}`],
                ['Avg Score', `${report?.avgScore?.toFixed(1) ?? '—'} / 10`],
              ].map(([k, v]) => (
                <div key={k} className="report-meta-item">
                  <span className="report-meta-key">{k}</span>
                  <span className="report-meta-val">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Answer Breakdown ── */}
          <div className="report-section-title">📋 Answer Breakdown</div>
          <div className="report-answers">
            {answers.map((a, i) => (
              <div key={i} className="report-answer-card">

                {/* Top row — always visible */}
                <div className="report-answer-top" onClick={() => toggle(i)}>
                  <div style={{ flex: 1 }}>
                    <div className="report-answer-q-num">Question {i + 1}</div>
                    <div className="report-answer-q-text">{a.question}</div>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'4px' }}>
                    <div className="report-answer-score" style={{ color: scoreColor(a.score) }}>
                      {a.score}/10
                    </div>
                    <svg
                      width="16" height="16" viewBox="0 0 24 24" fill="none"
                      style={{ color:'#334155', transform: expanded === i ? 'rotate(180deg)' : 'rotate(0)', transition:'0.2s' }}
                    >
                      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                </div>

                {/* Expanded body */}
                {expanded === i && (
                  <div className="report-answer-body">

                    <div className="report-ans-label">Your Answer</div>
                    <div className="report-ans-text">{a.answer}</div>

                    <div className="report-ans-label">AI Feedback</div>
                    <div className="report-feedback-text">{a.feedback}</div>

                    <div className="report-kw-row">
                      <div className="report-kw-col">
                        <div className="report-kw-head covered">✓ Covered</div>
                        <div className="report-kw-tags">
                          {a.keywordsCovered?.length > 0
                            ? a.keywordsCovered.map(k => <span key={k} className="report-kw-tag covered">{k}</span>)
                            : <span style={{fontSize:'12px',color:'#334155'}}>None</span>
                          }
                        </div>
                      </div>
                      <div className="report-kw-col">
                        <div className="report-kw-head missed">✗ Missed</div>
                        <div className="report-kw-tags">
                          {a.keywordsMissed?.length > 0
                            ? a.keywordsMissed.map(k => <span key={k} className="report-kw-tag missed">{k}</span>)
                            : <span style={{fontSize:'12px',color:'#334155'}}>None 🎉</span>
                          }
                        </div>
                      </div>
                    </div>

                    <div className={confClass(a.confidenceLevel)}>
                      Confidence: {a.confidenceLevel}
                    </div>
                  </div>
                )}

              </div>
            ))}
          </div>

          {/* ── Action Buttons ── */}
          <div className="report-actions">
            <button className="report-btn-secondary" onClick={() => navigate('/dashboard')}>
              🏠 Dashboard
            </button>
            <button className="report-btn-primary" onClick={() => navigate('/setup')}>
              🔄 Try Again
            </button>
          </div>

        </div>
      </div>
    </>
  )
}