import { useNavigate } from 'react-router-dom'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, Cell,
} from 'recharts'
import Navbar from '../../../components/Navbar.jsx'
import { useAnalytics } from '../hooks/useAnalytics.js'
import './Analytics.css'

const scoreColor = s => s >= 7 ? '#22c55e' : s >= 5 ? '#f59e0b' : '#ef4444'
const diffClass  = d => `an-badge an-badge-${d?.toLowerCase()}`

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background:'#0f1724', border:'1px solid rgba(255,255,255,0.08)',
      borderRadius:'10px', padding:'10px 14px', fontSize:'13px'
    }}>
      <div style={{color:'#475569', marginBottom:'4px'}}>{label}</div>
      <div style={{color:'#3b82f6', fontWeight:700}}>{payload[0].value} / 10</div>
    </div>
  )
}

export default function Analytics() {
  const navigate = useNavigate()
  const { stats, weakTopics, improvement, confidence, sessions, loading, error, reload } = useAnalytics()

  /* ── Loader ── */
  if (loading) return (
    <div className="an-loader">
      <div className="an-loader-inner">
        <div className="an-spinner" />
        <span className="an-loader-text">Loading analytics...</span>
      </div>
    </div>
  )

  /* ── Error ── */
  if (error) return (
    <>
      <Navbar />
      <div className="an-root">
        <div className="an-bg" />
        <div className="an-container" style={{textAlign:'center', paddingTop:'80px'}}>
          <div style={{fontSize:'48px', marginBottom:'16px'}}>⚠️</div>
          <div style={{fontFamily:'Syne,sans-serif', fontSize:'22px', fontWeight:700, marginBottom:'8px'}}>
            Failed to load analytics
          </div>
          <div style={{color:'#475569', marginBottom:'24px'}}>{error}</div>
          <button onClick={reload} style={{
            padding:'12px 28px', borderRadius:'10px', border:'none',
            background:'#3b82f6', color:'white', fontSize:'14px',
            fontWeight:600, cursor:'pointer'
          }}>Retry</button>
        </div>
      </div>
    </>
  )

  /* ── Stat cards ── */
  const statCards = [
    { icon:'🎯', bg:'rgba(59,130,246,0.1)',   val: stats?.sessions?.totalSessions ?? 0,      label:'Total Sessions',   sub:'completed'           },
    { icon:'⭐', bg:'rgba(251,191,36,0.1)',   val: stats?.answers?.avgScore ?? '—',          label:'Avg Score',        sub:'per answer out of 10' },
    { icon:'✅', bg:'rgba(34,197,94,0.1)',    val: stats?.answers?.totalAnswers ?? 0,         label:'Total Answers',    sub:'questions attempted'  },
    { icon:'🏆', bg:'rgba(139,92,246,0.1)',   val: stats?.sessions?.bestSession ?? '—',      label:'Best Session',     sub:'highest final score'  },
  ]

  /* ── Chart data ── */
  const lineData  = improvement.map(i => ({ name: `W${i.week}`, score: i.avgScore }))
  const radarData = confidence.map(c => ({
    domain: c.domain,
    high:   c.confidenceBreakdown?.find(b => b.level === 'High')?.count   ?? 0,
  }))
  const barData = weakTopics.map(t => ({ name: t.domain, score: t.avgScore }))

  return (
    <>
      <Navbar />
      <div className="an-root">
        <div className="an-bg" />
        <div className="an-container">

          {/* ── Header ── */}
          <div className="an-header">
            <div className="an-tag">📊 Deep Analytics</div>
            <h1 className="an-title">
              Your <span className="gradient-text">Performance Insights</span>
            </h1>
            <p className="an-subtitle">Detailed breakdown of your interview performance over time.</p>
          </div>

          {/* ── Stats Row ── */}
          <div className="an-stats-row">
            {statCards.map(c => (
              <div key={c.label} className="an-stat-card">
                <div className="an-stat-icon" style={{background: c.bg}}>{c.icon}</div>
                <div className="an-stat-val">{c.val}</div>
                <div className="an-stat-label">{c.label}</div>
                <div className="an-stat-sub">{c.sub}</div>
              </div>
            ))}
          </div>

          {/* ── Line + Radar ── */}
          <div className="an-grid-2">

            {/* Improvement Line Chart */}
            <div className="an-card">
              <div className="an-card-title">📈 Score Improvement</div>
              <div className="an-card-sub">Average score per week over time</div>
              {lineData.length === 0 ? (
                <div className="an-empty">
                  <div className="an-empty-icon">📊</div>
                  <div className="an-empty-text">Complete more sessions to see trends</div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={lineData}>
                    <XAxis dataKey="name" stroke="#334155" tick={{fill:'#475569', fontSize:12}}/>
                    <YAxis domain={[0,10]} stroke="#334155" tick={{fill:'#475569', fontSize:12}}/>
                    <Tooltip content={<CustomTooltip />}/>
                    <defs>
                      <linearGradient id="anLineGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%"   stopColor="#3b82f6"/>
                        <stop offset="100%" stopColor="#8b5cf6"/>
                      </linearGradient>
                    </defs>
                    <Line
                      type="monotone" dataKey="score"
                      stroke="url(#anLineGrad)" strokeWidth={2.5}
                      dot={{fill:'#3b82f6', r:4, strokeWidth:0}}
                      activeDot={{r:6, fill:'#8b5cf6'}}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Confidence Radar */}
            <div className="an-card">
              <div className="an-card-title">🧭 Confidence Radar</div>
              <div className="an-card-sub">High-confidence answers per domain</div>
              {radarData.length === 0 ? (
                <div className="an-empty">
                  <div className="an-empty-icon">🧭</div>
                  <div className="an-empty-text">No confidence data yet</div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.05)"/>
                    <PolarAngleAxis dataKey="domain" tick={{fill:'#475569', fontSize:11}}/>
                    <PolarRadiusAxis tick={{fill:'#334155', fontSize:10}}/>
                    <Radar name="Confidence" dataKey="high"
                      stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.15}/>
                  </RadarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* ── Bar Chart + Confidence Breakdown ── */}
          <div className="an-grid-2">

            {/* Weak Topics Bar */}
            <div className="an-card">
              <div className="an-card-title">⚠️ Weak Topics</div>
              <div className="an-card-sub">Your lowest scoring domains</div>
              {barData.length === 0 ? (
                <div className="an-empty">
                  <div className="an-empty-icon">🎉</div>
                  <div className="an-empty-text">No weak topics found</div>
                </div>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={barData} barSize={28}>
                      <XAxis dataKey="name" stroke="#334155" tick={{fill:'#475569', fontSize:11}}/>
                      <YAxis domain={[0,10]} stroke="#334155" tick={{fill:'#475569', fontSize:11}}/>
                      <Tooltip
                        contentStyle={{background:'#0f1724', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'10px', fontSize:'13px'}}
                        labelStyle={{color:'#475569'}}
                      />
                      <Bar dataKey="score" radius={[6,6,0,0]}>
                        {barData.map((entry, i) => (
                          <Cell key={i} fill={scoreColor(entry.score)} fillOpacity={0.7}/>
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="an-weak-list" style={{marginTop:'16px'}}>
                    {weakTopics.map(t => (
                      <div key={t.domain} className="an-weak-item">
                        <div className="an-weak-row">
                          <span className="an-weak-domain">{t.domain}</span>
                          <span className="an-weak-score" style={{color: scoreColor(t.avgScore)}}>
                            {t.avgScore} / 10
                          </span>
                        </div>
                        <div className="an-weak-bar">
                          <div className="an-weak-fill" style={{
                            width:`${(t.avgScore/10)*100}%`,
                            background: scoreColor(t.avgScore), opacity:0.7
                          }}/>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Confidence Per Domain */}
            <div className="an-card">
              <div className="an-card-title">🎯 Confidence Breakdown</div>
              <div className="an-card-sub">Low / Medium / High per domain</div>
              {confidence.length === 0 ? (
                <div className="an-empty">
                  <div className="an-empty-icon">📉</div>
                  <div className="an-empty-text">No confidence data yet</div>
                </div>
              ) : (
                <>
                  <div className="an-conf-legend" style={{marginBottom:'16px'}}>
                    {[['#ef4444','Low'],['#f59e0b','Medium'],['#22c55e','High']].map(([c,l]) => (
                      <div key={l} className="an-conf-legend-item">
                        <div className="an-conf-dot" style={{background:c}}/>
                        {l}
                      </div>
                    ))}
                  </div>
                  <div className="an-conf-list">
                    {confidence.map(c => {
                      const total = c.totalAnswers || 1
                      const low    = c.confidenceBreakdown?.find(b => b.level==='Low')?.count    ?? 0
                      const medium = c.confidenceBreakdown?.find(b => b.level==='Medium')?.count ?? 0
                      const high   = c.confidenceBreakdown?.find(b => b.level==='High')?.count   ?? 0
                      return (
                        <div key={c.domain} className="an-conf-item">
                          <div className="an-conf-domain">{c.domain}</div>
                          <div className="an-conf-bars">
                            {low    > 0 && <div className="an-conf-seg an-conf-seg-low"    style={{flex: low}}    />}
                            {medium > 0 && <div className="an-conf-seg an-conf-seg-medium" style={{flex: medium}} />}
                            {high   > 0 && <div className="an-conf-seg an-conf-seg-high"   style={{flex: high}}   />}
                          </div>
                          <div style={{fontSize:'11px', color:'#334155'}}>
                            {low} Low · {medium} Medium · {high} High
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ── Session History Table ── */}
          <div className="an-card an-full">
            <div className="an-card-title">📋 Full Session History</div>
            <div className="an-card-sub">Every interview session you have completed</div>
            {sessions.length === 0 ? (
              <div className="an-empty">
                <div className="an-empty-icon">📭</div>
                <div className="an-empty-text">No sessions yet</div>
              </div>
            ) : (
              <div className="an-table-wrap">
                <table className="an-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Domain</th>
                      <th>Difficulty</th>
                      <th>Questions</th>
                      <th>Avg Score</th>
                      <th>Final Score</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.map((s, i) => (
                      <tr key={s._id}>
                        <td style={{color:'#334155'}}>{i + 1}</td>
                        <td style={{color:'#f1f5f9', fontWeight:500}}>{s.domain}</td>
                        <td><span className={diffClass(s.difficulty)}>{s.difficulty}</span></td>
                        <td>{s.totalAnswers} / {s.totalQuestions}</td>
                        <td style={{color: scoreColor(s.avgScore), fontWeight:600}}>
                          {s.avgScore?.toFixed(1) ?? '—'} / 10
                        </td>
                        <td>
                          <span style={{
                            fontFamily:'Syne,sans-serif', fontWeight:700,
                            color: scoreColor(s.finalScore / 10)
                          }}>
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