import { useState } from 'react'
import { useSelector } from 'react-redux'
import Navbar from '../../../components/Navbar.jsx'
import { useInterview } from '../hooks/useInterview.js'
import './InterviewSetup.css'

const DOMAINS = [
  { name: 'JavaScript',     icon: '⚡' },
  { name: 'Python',         icon: '🐍' },
  { name: 'DSA',            icon: '🧩' },
  { name: 'System Design',  icon: '🏗️' },
  { name: 'HR',             icon: '🤝' },
  { name: 'DevOps',         icon: '⚙️' },
  { name: 'Data Science',   icon: '📊' },
]

const DIFFICULTIES = [
  { label: 'Easy',   sub: 'Beginner friendly',  cls: 'easy'   },
  { label: 'Medium', sub: 'Some experience',     cls: 'medium' },
  { label: 'Hard',   sub: 'Senior level',        cls: 'hard'   },
]

const COUNTS = [5, 10, 15]

export default function InterviewSetup() {
  const { username }                    = useSelector(s => s.auth.user) || {}
  const { handleStartSession, loading, error } = useInterview()

  const [domain,     setDomain]     = useState('JavaScript')
  const [difficulty, setDifficulty] = useState('Medium')
  const [count,      setCount]      = useState(5)

  const onStart = () => handleStartSession({ domain, difficulty, totalQuestions: count })

  return (
    <>
      <Navbar />
      <div className="setup-root">
        <div className="setup-bg" />
        <div className="setup-container">

          {/* Header */}
          <div className="setup-header">
            <div className="setup-tag">🎯 Configure Your Session</div>
            <h1 className="setup-title">
              Ready to practice,{' '}
              <span className="gradient-text">{username ?? 'Developer'}?</span>
            </h1>
            <p className="setup-subtitle">
              Choose your domain, difficulty, and number of questions to begin.
            </p>
          </div>

          <div className="setup-card">

            {/* Domain */}
            <div className="setup-section">
              <div className="setup-section-label">01 — Select Domain</div>
              <div className="setup-domain-grid">
                {DOMAINS.map(d => (
                  <button
                    key={d.name}
                    className={`setup-domain-btn ${domain === d.name ? 'active' : ''}`}
                    onClick={() => setDomain(d.name)}
                  >
                    <span className="setup-domain-icon">{d.icon}</span>
                    <span className="setup-domain-name">{d.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div className="setup-section">
              <div className="setup-section-label">02 — Select Difficulty</div>
              <div className="setup-diff-row">
                {DIFFICULTIES.map(d => (
                  <button
                    key={d.label}
                    className={`setup-diff-btn ${d.cls} ${difficulty === d.label ? 'active' : ''}`}
                    onClick={() => setDifficulty(d.label)}
                  >
                    <span className="setup-diff-label">{d.label}</span>
                    <span className="setup-diff-sub">{d.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Count */}
            <div className="setup-section">
              <div className="setup-section-label">03 — Number of Questions</div>
              <div className="setup-count-row">
                {COUNTS.map(n => (
                  <button
                    key={n}
                    className={`setup-count-btn ${count === n ? 'active' : ''}`}
                    onClick={() => setCount(n)}
                  >
                    <span className="setup-count-num">{n}</span>
                    <span className="setup-count-label">questions</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Summary */}
          <div className="setup-summary">
            {[
              ['Domain',     domain],
              ['Difficulty', difficulty],
              ['Questions',  count],
            ].map(([k, v]) => (
              <div key={k} className="setup-summary-item">
                <span className="setup-summary-key">{k}</span>
                <span className="setup-summary-val">{v}</span>
              </div>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="setup-error">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{flexShrink:0}}>
                <circle cx="12" cy="12" r="10" stroke="#f87171" strokeWidth="2"/>
                <path d="M12 8v4m0 4h.01" stroke="#f87171" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              {error}
            </div>
          )}

          {/* Start */}
          <button className="setup-start-btn" onClick={onStart} disabled={loading}>
            {loading
              ? <><span className="setup-spinner" /> Generating Questions...</>
              : <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/>
                    <polygon points="10,8 16,12 10,16" fill="white"/>
                  </svg>
                  Start Interview
                </>
            }
          </button>

        </div>
      </div>
    </>
  )
}