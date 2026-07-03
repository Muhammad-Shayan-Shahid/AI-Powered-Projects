import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts'
import Navbar from '../../../components/Navbar.jsx'
import { useDashboard } from '../hooks/useDashboard.js'
import './Dashboard.css'

/* ── helpers ── */
const scoreColor = s => s >= 7 ? '#22c55e' : s >= 5 ? '#f59e0b' : '#ef4444'
const diffClass  = d => `dash-badge dash-badge-${d?.toLowerCase()}`

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background:'#0f1724', border:'1px solid rgba(255,255,255,0.08)',
      borderRadius:'10px', padding:'10px 14px', fontSize:'13px'
    }}>
      <div style={{color:'#475569', marginBottom:'4px'}}>Week {label}</div>
      <div style={{color:'#3b82f6', fontWeight:700}}>{payload[0].value} / 10</div>
    </div>
  )
}

export default function Dashboard() {
  const navigate   = useNavigate()
  const { user }   = useSelector(s => s.auth)
  const { stats, weakTopics, improvement, confidence, sessions, loading, error, reload } = useDashboard()

  /* ── Loading ── */
  if (loading) return (
    <div className="dash-loader">
      <div className="dash-loader-inner">
        <div className="dash-loader-spinner" />
        <span className="dash-loader-text">Loading your dashboard...</span>
      </div>
    </div>
  )

  /* ── Error ── */
  if (error) return (
    <div className="dash-error">
      <div className="dash-error-box">
        <div className="dash-error-icon">⚠️</div>
        <div className="dash-error-title">Something went wrong</div>
        <div className="dash-error-msg">{error}</div>
        <button className="dash-retry-btn" onClick={reload}>Try Again</button>
      </div>
    </div>
  )

  /* ── Stat cards config ── */
  const statCards = [
    {
      icon: '🎯', bg: 'rgba(59,130,246,0.1)',
      val: stats?.sessions?.totalSessions ?? 0,
      label: 'Total Sessions',
      sub: 'interviews completed',
    },
    {
      icon: '⭐', bg: 'rgba(251,191,36,0.1)',
      val: stats?.answers?.avgScore ?? '—',
      label: 'Avg Score',
      sub: 'out of 10 per answer',
    },
    {
      icon: '✅', bg: 'rgba(34,197,94,0.1)',
      val: stats?.answers?.totalAnswers ?? 0,
      label: 'Total Answers',
      sub: 'questions attempted',
    },
    {
      icon: '🏆', bg: 'rgba(139,92,246,0.1)',
      val: stats?.bestDomain?.domain ?? '—',
      label: 'Best Domain',
      sub: `avg ${stats?.bestDomain?.avgScore ?? 0} / 10`,
    },
  ]

  /* ── Radar data from confidence ── */
  const radarData = confidence.map(c => ({
    domain: c.domain,
    score: c.confidenceBreakdown?.find(b => b.level === 'High')?.count ?? 0,
  }))

  /* ── Improvement chart data ── */
  const chartData = improvement.map(i => ({
    name: `W${i.week}`,
    score: i.avgScore,
  }))

  return (
    <>
      <Navbar />
      <div className="dash-root">
        <div className="dash-bg" />
        <div className="dash-container">

          {/* ── Header ── */}
          <div className="dash-header">
            <div>
              <div className="dash-greeting-label">WELCOME BACK</div>
              <div className="dash-greeting-name">
                Hey, <span className="gradient-text">{user?.username?.split(' ')[0]} 👋</span>
              </div>
              <div className="dash-greeting-sub">
                Ready to sharpen your skills today?
              </div>
            </div>
            <button className="dash-start-btn" onClick={() => navigate('/setup')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/>
                <polygon points="10,8 16,12 10,16" fill="white"/>
              </svg>
              Start Interview
            </button>
          </div>

          {/* ── Stats Row ── */}
          <div className="dash-stats-row">
            {statCards.map(c => (
              <div key={c.label} className="dash-stat-card">
                <div className="dash-stat-icon" style={{ background: c.bg }}>{c.icon}</div>
                <div className="dash-stat-val">{c.val}</div>
                <div className="dash-stat-label">{c.label}</div>
                <div className="dash-stat-sub">{c.sub}</div>
              </div>
            ))}
          </div>

          {/* ── Charts Row ── */}
          <div className="dash-grid">

            {/* Improvement Line Chart */}
            <div className="dash-card">
              <div className="dash-card-title">📈 Improvement Over Time</div>
              <div className="dash-card-sub">Your average score week by week</div>
              {chartData.length === 0 ? (
                <div className="dash-empty">
                  <div className="dash-empty-icon">📊</div>
                  <div className="dash-empty-text">Complete sessions to see your progress</div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={chartData}>
                    <XAxis dataKey="name" stroke="#334155" tick={{ fill: '#475569', fontSize: 12 }} />
                    <YAxis domain={[0,10]} stroke="#334155" tick={{ fill: '#475569', fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone" dataKey="score"
                      stroke="url(#lineGrad)" strokeWidth={2.5}
                      dot={{ fill: '#3b82f6', r: 4, strokeWidth: 0 }}
                      activeDot={{ r: 6, fill: '#8b5cf6' }}
                    />
                    <defs>
                      <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#3b82f6"/>
                        <stop offset="100%" stopColor="#8b5cf6"/>
                      </linearGradient>
                    </defs>
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Radar Chart */}
            <div className="dash-card">
              <div className="dash-card-title">🎯 Confidence Radar</div>
              <div className="dash-card-sub">High-confidence answers per domain</div>
              {radarData.length === 0 ? (
                <div className="dash-empty">
                  <div className="dash-empty-icon">🧭</div>
                  <div className="dash-empty-text">No confidence data yet</div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.05)" />
                    <PolarAngleAxis dataKey="domain" tick={{ fill: '#475569', fontSize: 11 }} />
                    <PolarRadiusAxis tick={{ fill: '#334155', fontSize: 10 }} />
                    <Radar
                      name="Confidence" dataKey="score"
                      stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.15}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* ── Weak Topics ── */}
          <div className="dash-grid">
            <div className="dash-card">
              <div className="dash-card-title">⚠️ Weak Topics</div>
              <div className="dash-card-sub">Domains that need more practice</div>
              {weakTopics.length === 0 ? (
                <div className="dash-empty">
                  <div className="dash-empty-icon">🎉</div>
                  <div className="dash-empty-text">No weak topics detected yet</div>
                </div>
              ) : (
                <div className="dash-weak-list">
                  {weakTopics.map(t => (
                    <div key={t.domain} className="dash-weak-item">
                      <div className="dash-weak-row">
                        <span className="dash-weak-domain">{t.domain}</span>
                        <span className="dash-weak-score" style={{ color: scoreColor(t.avgScore) }}>
                          {t.avgScore} / 10
                        </span>
                      </div>
                      <div className="dash-weak-bar">
                        <div className="dash-weak-fill" style={{
                          width: `${(t.avgScore / 10) * 100}%`,
                          background: scoreColor(t.avgScore),
                          opacity: 0.7,
                        }} />
                      </div>
                      <div className="dash-weak-answers">{t.totalAnswers} answers recorded</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Best Session highlight */}
            <div className="dash-card">
              <div className="dash-card-title">🏅 Best Performance</div>
              <div className="dash-card-sub">Your highest scoring session</div>
              {sessions.length === 0 ? (
                <div className="dash-empty">
                  <div className="dash-empty-icon">🚀</div>
                  <div className="dash-empty-text">Complete your first interview</div>
                </div>
              ) : (() => {
                const best = [...sessions].sort((a,b) => b.finalScore - a.finalScore)[0]
                return (
                  <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                      <div>
                        <div style={{ fontSize:'14px', fontWeight:600, color:'#f1f5f9', marginBottom:'4px' }}>
                          {best.domain}
                        </div>
                        <span className={diffClass(best.difficulty)}>{best.difficulty}</span>
                      </div>
                      <div style={{
                        fontFamily:'Syne,sans-serif', fontSize:'48px',
                        fontWeight:800, color:'#3b82f6', lineHeight:1,
                      }}>
                        {best.finalScore}
                        <span style={{ fontSize:'16px', color:'#334155' }}>%</span>
                      </div>
                    </div>
                    <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
                      {[
                        ['Questions', best.totalQuestions],
                        ['Answered', best.totalAnswers],
                        ['Date', new Date(best.startedAt).toLocaleDateString()],
                      ].map(([k,v]) => (
                        <div key={k} style={{ display:'flex', justifyContent:'space-between' }}>
                          <span style={{ fontSize:'13px', color:'#475569' }}>{k}</span>
                          <span style={{ fontSize:'13px', color:'#94a3b8', fontWeight:500 }}>{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })()}
            </div>
          </div>

          {/* ── Session History Table ── */}
          <div className="dash-card dash-grid-full">
            <div className="dash-card-title">📋 Session History</div>
            <div className="dash-card-sub">All your completed interview sessions</div>
            {sessions.length === 0 ? (
              <div className="dash-empty">
                <div className="dash-empty-icon">📭</div>
                <div className="dash-empty-text">No sessions yet — start your first interview!</div>
              </div>
            ) : (
              <div className="dash-table-wrap">
                <table className="dash-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Domain</th>
                      <th>Difficulty</th>
                      <th>Questions</th>
                      <th>Score</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.map((s, i) => (
                      <tr key={s._id}>
                        <td style={{ color:'#334155' }}>{i + 1}</td>
                        <td style={{ color:'#f1f5f9', fontWeight:500 }}>{s.domain}</td>
                        <td><span className={diffClass(s.difficulty)}>{s.difficulty}</span></td>
                        <td>{s.totalAnswers} / {s.totalQuestions}</td>
                        <td>
                          <span className="dash-score-pill" style={{ color: scoreColor(s.finalScore / 10) }}>
                            {s.finalScore}%
                          </span>
                        </td>
                        <td>{new Date(s.startedAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  )
}