import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import './Login.css'

export default function Login() {
  const { handleLogin, loading, error } = useAuth()
  const [form, setForm]         = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)

  const onChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))
  const onSubmit = e => { e.preventDefault(); handleLogin(form) }

  return (
    <div className="login-root">
      <div className="login-blob1" />
      <div className="login-blob2" />
      <div className="login-blob3" />
      <div className="login-grid" />

      <div className="login-wrapper">

        {/* ── Left Panel ── */}
        <div className="login-left">
          <div className="login-logo-row">
            <div className="login-logo-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                  stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="login-logo-text">NeuralPrep</span>
          </div>

          <div className="login-left-content">
            <div className="login-tag-badge">AI-Powered Interview Training</div>
            <h1 className="login-headline">
              Master Every<br />
              <span className="gradient-text">Interview</span><br />
              With Confidence
            </h1>
            <p className="login-subtext">
              Practice with AI-generated questions, get instant feedback,
              and track your growth across every domain.
            </p>
            <div className="login-stats-row">
              {[['500+', 'Questions'], ['Real-time', 'AI Feedback'], ['10+', 'Domains']].map(([val, label]) => (
                <div key={label} className="login-stat-box">
                  <span className="login-stat-val">{val}</span>
                  <span className="login-stat-label">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="login-floating-card">
            <div className="login-fc-top">
              <div className="login-fc-avatar">A</div>
              <div>
                <div className="login-fc-name">Ali Hassan</div>
                <div className="login-fc-role">Full Stack Developer</div>
              </div>
              <div className="login-fc-score">9.2</div>
            </div>
            <div className="login-fc-bar">
              <div className="login-fc-bar-fill" />
            </div>
            <div className="login-fc-label">JavaScript · Hard · 92% score</div>
          </div>
        </div>

        {/* ── Right Panel ── */}
        <div className="login-right">
          <div className="login-form-card">
            <h2 className="login-form-title">Welcome back</h2>
            <p className="login-form-sub">Sign in to continue your journey</p>

            {error && (
              <div className="login-error-box">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{flexShrink:0}}>
                  <circle cx="12" cy="12" r="10" stroke="#f87171" strokeWidth="2"/>
                  <path d="M12 8v4m0 4h.01" stroke="#f87171" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={onSubmit} className="login-form">

              {/* Email */}
              <div className="login-field-group">
                <label className="login-label">Email address</label>
                <div className="login-input-wrap">
                  <svg className="login-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="1.5"/>
                    <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  <input
                    className="login-input"
                    name="email" type="email"
                    value={form.email} onChange={onChange}
                    required placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="login-field-group">
                <label className="login-label">Password</label>
                <div className="login-input-wrap">
                  <svg className="login-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  <input
                    className={`login-input ${showPass ? '' : 'login-input-pass'}`}
                    name="password" type={showPass ? 'text' : 'password'}
                    value={form.password} onChange={onChange}
                    required placeholder="••••••••"
                  />
                  <button type="button" className="login-eye-btn" onClick={() => setShowPass(p => !p)}>
                    {showPass
                      ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/><line x1="1" y1="1" x2="23" y2="23" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/></svg>
                      : <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#94a3b8" strokeWidth="1.5"/><circle cx="12" cy="12" r="3" stroke="#94a3b8" strokeWidth="1.5"/></svg>
                    }
                  </button>
                </div>
              </div>

              <button type="submit" className="login-submit-btn" disabled={loading}>
                {loading ? <><span className="login-spinner" /> Signing in...</> : 'Sign In →'}
              </button>
            </form>

            <div className="login-divider">
              <span className="login-divider-line" />
              <span className="login-divider-text">new here?</span>
              <span className="login-divider-line" />
            </div>

            <Link to="/signup" className="login-switch-link">Create your account</Link>
          </div>
        </div>

      </div>
    </div>
  )
}