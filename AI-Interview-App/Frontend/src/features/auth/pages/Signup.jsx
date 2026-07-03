import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import './Signup.css'

const ROLES = ['Frontend', 'Backend', 'Full Stack', 'Data Science', 'DevOps']

const strengthColors = ['', '#ef4444', '#f59e0b', '#22c55e']
const strengthLabels = ['', 'Weak', 'Fair', 'Strong']

export default function Signup() {
  const { handleSignup, loading, error } = useAuth()
  const [form, setForm]         = useState({ username: '', email: '', password: '', targetRole: 'Full Stack' })
  const [showPass, setShowPass] = useState(false)

  const onChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))
  const onSubmit = e => { e.preventDefault(); handleSignup(form) }

  const strength = form.password.length === 0 ? 0
    : form.password.length < 5 ? 1
    : form.password.length < 8 ? 2 : 3

  return (
    <div className="signup-root">
      <div className="signup-blob1" />
      <div className="signup-blob2" />
      <div className="signup-grid" />

      <div className="signup-wrapper">

        {/* ── Left Panel ── */}
        <div className="signup-left">
          <div className="signup-logo-row">
            <div className="signup-logo-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                  stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="signup-logo-text">NeuralPrep</span>
          </div>

          <div className="signup-left-content">
            <div className="signup-tag-badge">Start Free Today</div>
            <h1 className="signup-headline">
              Your AI<br />
              <span className="gradient-text">Interview Coach</span><br />
              Awaits
            </h1>
            <p className="signup-subtext">
              Join thousands of developers who improved their interview
              performance with personalized AI feedback.
            </p>
            <div className="signup-feature-list">
              {[
                ['🎯', 'Questions tailored to your domain'],
                ['⚡', 'Instant AI-powered evaluation'],
                ['📈', 'Track your improvement over time'],
                ['🧠', 'Detect and fix weak topics'],
              ].map(([icon, text]) => (
                <div key={text} className="signup-feature-item">
                  <span className="signup-feature-icon">{icon}</span>
                  <span className="signup-feature-text">{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="signup-testimonial">
            <div className="signup-stars">{'★'.repeat(5)}</div>
            <p className="signup-testimonial-text">
              "Went from failing interviews to landing my dream job in 6 weeks."
            </p>
            <div className="signup-testimonial-author">— Sara K., Frontend Developer @ Google</div>
          </div>
        </div>

        {/* ── Right Panel ── */}
        <div className="signup-right">
          <div className="signup-form-card">
            <h2 className="signup-form-title">Create account</h2>
            <p className="signup-form-sub">Fill in your details to get started</p>

            {error && (
              <div className="signup-error-box">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{flexShrink:0}}>
                  <circle cx="12" cy="12" r="10" stroke="#f87171" strokeWidth="2"/>
                  <path d="M12 8v4m0 4h.01" stroke="#f87171" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={onSubmit} className="signup-form">

              {/* Username */}
              <div className="signup-field-group">
                <label className="signup-label">Username</label>
                <div className="signup-input-wrap">
                  <svg className="signup-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.5"/>
                    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  <input
                    className="signup-input"
                    name="username" value={form.username} onChange={onChange}
                    required placeholder="Ali Hassan"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="signup-field-group">
                <label className="signup-label">Email Address</label>
                <div className="signup-input-wrap">
                  <svg className="signup-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="1.5"/>
                    <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  <input
                    className="signup-input"
                    name="email" type="email" value={form.email} onChange={onChange}
                    required placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="signup-field-group">
                <label className="signup-label">Password</label>
                <div className="signup-input-wrap">
                  <svg className="signup-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  <input
                    className={`signup-input ${!showPass ? 'signup-input-pass' : ''}`}
                    name="password" type={showPass ? 'text' : 'password'}
                    value={form.password} onChange={onChange}
                    required placeholder="min. 6 characters"
                  />
                  <button type="button" className="signup-eye-btn" onClick={() => setShowPass(p => !p)}>
                    {showPass
                      ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/><line x1="1" y1="1" x2="23" y2="23" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/></svg>
                      : <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#94a3b8" strokeWidth="1.5"/><circle cx="12" cy="12" r="3" stroke="#94a3b8" strokeWidth="1.5"/></svg>
                    }
                  </button>
                </div>

                {form.password.length > 0 && (
                  <div className="signup-strength-row">
                    <div className="signup-strength-bars">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="signup-strength-bar" style={{
                          background: i <= strength ? strengthColors[strength] : 'rgba(255,255,255,0.06)'
                        }} />
                      ))}
                    </div>
                    <span className="signup-strength-text" style={{ color: strengthColors[strength] }}>
                      {strengthLabels[strength]}
                    </span>
                  </div>
                )}
              </div>

              {/* Target Role */}
              <div className="signup-field-group">
                <label className="signup-label">Target Role</label>
                <div className="signup-roles-grid">
                  {ROLES.map(role => (
                    <button
                      key={role} type="button"
                      className={`signup-role-btn ${form.targetRole === role ? 'active' : ''}`}
                      onClick={() => setForm(p => ({ ...p, targetRole: role }))}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" className="signup-submit-btn" disabled={loading}>
                {loading ? <><span className="signup-spinner" /> Creating account...</> : 'Get Started →'}
              </button>
            </form>

            <div className="signup-divider">
              <span className="signup-divider-line" />
              <span className="signup-divider-text">already have an account?</span>
              <span className="signup-divider-line" />
            </div>

            <Link to="/login" className="signup-switch-link">Sign in instead</Link>
          </div>
        </div>

      </div>
    </div>
  )
}