'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Header from '../components/Header'

type Session = {
  id: string
  passage_id: string
  score: number
  total: number
  time_seconds: number
  completed_at: string
  topic?: string
}

type MissedWord = { word: string; count: number }

function pad(n: number) { return String(n).padStart(2, '0') }
function formatTime(s: number) { return `${pad(Math.floor(s / 60))}:${pad(s % 60)}` }
function formatDate(str: string) {
  return new Date(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function calcStreak(sessions: Session[]): number {
  if (sessions.length === 0) return 0
  const days = [...new Set(sessions.map(s => new Date(s.completed_at).toDateString()))]
  const sorted = days.map(d => new Date(d)).sort((a, b) => b.getTime() - a.getTime())
  let streak = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  for (let i = 0; i < sorted.length; i++) {
    const d = new Date(sorted[i])
    d.setHours(0, 0, 0, 0)
    const expected = new Date(today)
    expected.setDate(today.getDate() - i)
    if (d.getTime() === expected.getTime()) streak++
    else break
  }
  return streak
}

function calcBestStreak(sessions: Session[]): number {
  if (sessions.length === 0) return 0
  const days = [...new Set(sessions.map(s => new Date(s.completed_at).toDateString()))]
  const sorted = days.map(d => new Date(d)).sort((a, b) => a.getTime() - b.getTime())
  let best = 1, current = 1
  for (let i = 1; i < sorted.length; i++) {
    const diff = (sorted[i].getTime() - sorted[i - 1].getTime()) / 86400000
    if (diff === 1) { current++; best = Math.max(best, current) }
    else current = 1
  }
  return best
}

export default function DashboardPage() {
  const router = useRouter()
  const [sessions, setSessions] = useState<Session[]>([])
  const [missedWords, setMissedWords] = useState<MissedWord[]>([])
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState('')
  const [showAllMissed, setShowAllMissed] = useState(false)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth?view=login'); return }

      setUserName(
        user.user_metadata?.given_name ||
        user.user_metadata?.full_name?.split(' ')[0] ||
        user.email?.split('@')[0] || 'there'
      )

      const { data: sessionData } = await supabase
        .from('sessions')
        .select('id, passage_id, score, total, time_seconds, completed_at')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(50)

      const raw = sessionData ?? []

      // fetch topics
      const ids = [...new Set(raw.map(s => s.passage_id).filter(Boolean))]
      let topicMap: Record<string, string> = {}
      if (ids.length > 0) {
        const { data: pd } = await supabase.from('passages').select('id, topic').in('id', ids)
        pd?.forEach(p => { topicMap[p.id] = p.topic })
      }

      const enriched = raw.map(s => ({ ...s, topic: topicMap[s.passage_id] ?? 'General' }))
      setSessions(enriched)

      // missed words
      const { data: attempts } = await supabase
        .from('word_attempts')
        .select('word, correct')
        .eq('user_id', user.id)
        .eq('correct', false)

      if (attempts?.length) {
        const counts: Record<string, number> = {}
        attempts.forEach((a: any) => { counts[a.word] = (counts[a.word] ?? 0) + 1 })
        setMissedWords(
          Object.entries(counts)
            .map(([word, count]) => ({ word, count }))
            .sort((a, b) => b.count - a.count)
        )
      }

      setLoading(false)
    }
    load()
  }, [])

  // computed stats
  const totalSessions = sessions.length
  const totalCorrect = sessions.reduce((s, x) => s + (x.score ?? 0), 0)
  const totalWords = sessions.reduce((s, x) => s + (x.total ?? 1), 0)
  const accuracy = totalWords > 0 ? Math.round((totalCorrect / totalWords) * 100) : 0
  const totalTime = sessions.reduce((s, x) => s + (x.time_seconds ?? 0), 0)
  const avgTime = totalSessions > 0 ? Math.round(totalTime / totalSessions) : 0
  const streak = calcStreak(sessions)
  const bestStreak = calcBestStreak(sessions)

  // XP system: 10 XP per session + 5 bonus if accuracy >= 80
  const xp = sessions.reduce((s, x) => {
    const acc = x.total > 0 ? x.score / x.total : 0
    return s + 10 + (acc >= 0.8 ? 5 : 0)
  }, 0)
  const xpPerLevel = 100
  const level = Math.floor(xp / xpPerLevel) + 1
  const xpInLevel = xp % xpPerLevel
  const xpProgress = Math.min((xpInLevel / xpPerLevel) * 100, 100)

  const visibleMissed = showAllMissed ? missedWords : missedWords.slice(0, 8)

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 100 }}>
      <p style={{ fontFamily: '"Special Elite", cursive', fontSize: 16, color: '#888' }}>Loading…</p>
    </div>
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Special+Elite&family=Caveat:wght@400;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f5f2eb; font-family: 'Special Elite', cursive; }

        .dash { width: 100%; padding: 48px 80px 80px; }

        /* ── HERO ── */
        .hero-section {
          margin-bottom: 32px;
        }

        .hero-eyebrow {
          font-family: 'Caveat', cursive; font-size: 13px; font-weight: 600;
          color: #aaa; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 6px;
        }

        .hero-name {
          font-family: 'Special Elite', cursive;
          font-size: 32px; color: #111; letter-spacing: -0.5px; margin-bottom: 4px;
        }

        .hero-sub {
          font-family: 'Caveat', cursive; font-size: 15px; color: #888;
        }

        /* ── XP BAR ── */
        .xp-card {
          background: #fffef9;
          border: 1.5px solid #d6d0c4;
          border-radius: 3px;
          padding: 20px 28px;
          margin-bottom: 28px;
          position: relative;
          box-shadow: 2px 3px 0 #d6d0c4, 4px 6px 0 #ece8de;
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .xp-card::after {
          content: ''; position: absolute; inset: 0;
          background-image: repeating-linear-gradient(transparent, transparent 27px, rgba(180,180,200,0.12) 27px, rgba(180,180,200,0.12) 28px);
          border-radius: 3px; pointer-events: none;
        }

        .xp-inner { position: relative; z-index: 1; flex: 1; }

        .xp-top {
          display: flex; align-items: center;
          justify-content: space-between; margin-bottom: 10px;
        }

        .xp-level {
          font-family: 'Special Elite', cursive;
          font-size: 13px; color: #333;
          border: 1.5px solid #d6d0c4;
          padding: 3px 10px; border-radius: 2px;
          box-shadow: 1px 1px 0 #d6d0c4;
        }

        .xp-nums {
          font-family: 'Caveat', cursive;
          font-size: 13px; color: #aaa;
        }

        .xp-track {
          height: 6px; background: #e8e4de;
          border-radius: 3px; overflow: hidden;
        }

        .xp-fill {
          height: 100%; background: #555;
          border-radius: 3px; transition: width 0.6s ease;
        }

        .streak-chip {
          position: relative; z-index: 1;
          display: flex; flex-direction: column;
          align-items: center; gap: 2px;
          background: #fffef9;
          border: 1.5px solid #d6d0c4;
          border-radius: 3px; padding: 10px 18px;
          box-shadow: 1px 1px 0 #d6d0c4;
          flex-shrink: 0;
        }

        .streak-num {
          font-family: 'Special Elite', cursive;
          font-size: 26px; color: #111; line-height: 1;
        }

        .streak-label {
          font-family: 'Caveat', cursive;
          font-size: 11px; font-weight: 600;
          color: #aaa; text-transform: uppercase; letter-spacing: 1.5px;
        }

        /* ── SECTION LABEL ── */
        .s-label {
          font-family: 'Caveat', cursive; font-size: 12px; font-weight: 600;
          color: #aaa; text-transform: uppercase; letter-spacing: 2px;
          margin-bottom: 12px; margin-top: 32px; display: block;
        }

        /* ── PRACTICE CARD ── */
        .practice-card {
          background: #fffef9;
          border: 1.5px solid #d6d0c4;
          border-radius: 3px;
          padding: 24px 28px;
          position: relative;
          box-shadow: 2px 3px 0 #d6d0c4, 4px 6px 0 #ece8de;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 28px;
        }

        .practice-card::after {
          content: ''; position: absolute; inset: 0;
          background-image: repeating-linear-gradient(transparent, transparent 31px, rgba(180,180,200,0.12) 31px, rgba(180,180,200,0.12) 32px);
          border-radius: 3px; pointer-events: none;
        }

        .practice-inner { position: relative; z-index: 1; }
        .practice-card-right { position: relative; z-index: 1; flex-shrink: 0; }

        .practice-count {
          font-family: 'Special Elite', cursive;
          font-size: 36px; color: #111; letter-spacing: -1px; line-height: 1; margin-bottom: 4px;
        }

        .practice-sub {
          font-family: 'Caveat', cursive; font-size: 14px; color: #888;
        }

        .btn-go {
          font-family: 'Special Elite', cursive; font-size: 14px;
          color: #fff; background: #222; border: 1.5px solid #111;
          padding: 10px 24px; border-radius: 3px; cursor: pointer;
          box-shadow: 2px 2px 0 #111; transition: all 0.1s;
        }
        .btn-go:hover  { transform: translate(-1px,-1px); box-shadow: 3px 3px 0 #111; }
        .btn-go:active { transform: translate(1px,1px);   box-shadow: 1px 1px 0 #111; }

        /* ── STATS GRID ── */
        .stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
  margin-bottom: 28px;
}

        .stat-card {
          background: #fffef9;
          border: 1.5px solid #d6d0c4;
          border-right: none;
          padding: 22px 16px;
          text-align: center;
          position: relative;
        }
        .stat-card:first-child { border-radius: 3px 0 0 3px; }
        .stat-card:last-child {
          border-right: 1.5px solid #d6d0c4;
          border-radius: 0 3px 3px 0;
          box-shadow: 2px 3px 0 #d6d0c4, 4px 6px 0 #ece8de;
        }
        .stat-card::after {
          content: ''; position: absolute; inset: 0;
          background-image: repeating-linear-gradient(transparent, transparent 27px, rgba(180,180,200,0.12) 27px, rgba(180,180,200,0.12) 28px);
          pointer-events: none; border-radius: inherit;
        }
        .stat-inner { position: relative; z-index: 1; }

        .stat-val {
          font-family: 'Special Elite', cursive;
          font-size: 26px; color: #111; letter-spacing: -0.5px; margin-bottom: 5px;
        }

        .stat-lbl {
          font-family: 'Caveat', cursive; font-size: 12px; font-weight: 600;
          color: #aaa; text-transform: uppercase; letter-spacing: 1.5px;
        }

        /* ── RECENT SESSIONS ── */
        .sessions-list { display: flex; flex-direction: column; margin-bottom: 8px; }

        .session-row {
          background: #fffef9;
          border: 1.5px solid #d6d0c4;
          border-bottom: none;
          padding: 14px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          position: relative;
        }

        .session-row::after {
          content: ''; position: absolute;
          bottom: 0; left: 24px; right: 24px;
          height: 1px; background: rgba(180,180,200,0.2); pointer-events: none;
        }

        .session-row:first-child { border-radius: 3px 3px 0 0; }
        .session-row:last-child {
          border-bottom: 1.5px solid #d6d0c4;
          border-radius: 0 0 3px 3px;
          box-shadow: 2px 3px 0 #d6d0c4, 4px 6px 0 #ece8de;
        }
        .session-row:only-child {
          border-bottom: 1.5px solid #d6d0c4; border-radius: 3px;
          box-shadow: 2px 3px 0 #d6d0c4, 4px 6px 0 #ece8de;
        }

        .session-left { display: flex; flex-direction: column; gap: 3px; }
        .session-topic { font-family: 'Special Elite', cursive; font-size: 14px; color: #222; }
        .session-date  { font-family: 'Caveat', cursive; font-size: 12px; color: #bbb; }

        .session-right { display: flex; align-items: center; gap: 20px; flex-shrink: 0; }

        .session-score { font-family: 'Special Elite', cursive; font-size: 13px; color: #555; }
        .session-time  { font-family: 'Caveat', cursive; font-size: 12px; color: #bbb; }

        .acc-badge {
          font-family: 'Caveat', cursive; font-size: 13px; font-weight: 600;
          min-width: 40px; text-align: right;
        }
        .acc-high { color: #5a8c5a; }
        .acc-mid  { color: #b8924a; }
        .acc-low  { color: #b06060; }

        /* ── MISSED WORDS ── */
        .missed-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
          gap: 10px;
        }

        .missed-card {
          background: #fffef9;
          border: 1.5px solid #e0bbbb;
          border-radius: 3px;
          padding: 10px 14px;
          box-shadow: 1px 2px 0 #e0bbbb;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          transition: background 0.12s;
        }
        .missed-card:hover { background: #fdf6f6; }

        .missed-word { font-family: 'Special Elite', cursive; font-size: 14px; color: #333; }
        .missed-count {
          font-family: 'Caveat', cursive; font-size: 12px; font-weight: 600;
          color: #b06060; background: #fdf0f0;
          border: 1px solid #e0bbbb; border-radius: 2px; padding: 1px 7px;
        }

        .btn-toggle {
          font-family: 'Special Elite', cursive; font-size: 13px;
          color: #888; background: none; border: 1px solid #d6d0c4;
          padding: 6px 16px; border-radius: 2px; cursor: pointer;
          margin-top: 14px; transition: all 0.12s;
          box-shadow: 1px 1px 0 #d6d0c4;
        }
        .btn-toggle:hover { border-color: #999; color: #333; }

        /* ── EMPTY ── */
        .empty-card {
          background: #fffef9; border: 1.5px solid #d6d0c4;
          border-radius: 3px; padding: 36px 24px; text-align: center;
          box-shadow: 2px 3px 0 #d6d0c4, 4px 6px 0 #ece8de;
        }
        .empty-title { font-family: 'Special Elite', cursive; font-size: 15px; color: #666; margin-bottom: 5px; }
        .empty-sub   { font-family: 'Caveat', cursive; font-size: 14px; color: #bbb; }

        @media (max-width: 640px) {
          .dash { padding: 32px 20px 60px; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .stat-card { border-right: 1.5px solid #d6d0c4; border-bottom: none; border-radius: 0; }
          .stat-card:nth-child(1) { border-radius: 3px 0 0 0; }
          .stat-card:nth-child(2) { border-radius: 0 3px 0 0; }
          .stat-card:nth-child(3) { border-radius: 0 0 0 3px; }
          .stat-card:nth-child(4) { border-bottom: 1.5px solid #d6d0c4; border-radius: 0 0 3px 0; box-shadow: 2px 3px 0 #d6d0c4, 4px 6px 0 #ece8de; }
          .xp-card { flex-direction: column; align-items: flex-start; }
          .practice-card { flex-direction: column; align-items: flex-start; }
          .session-right { gap: 10px; }
        }
      `}</style>
      <Header />

      <div className="dash">

        {/* HERO */}
        <div className="hero-section">
          <p className="hero-eyebrow">Dashboard</p>
          <h1 className="hero-name">Hello, {userName}</h1>
          <p className="hero-sub">Here's how your TOEFL prep is going.</p>
        </div>

        {/* XP + STREAK */}
        <div className="xp-card">
          <div className="xp-inner">
            <div className="xp-top">
              <span className="xp-level">Level {level}</span>
              <span className="xp-nums">{xpInLevel} / {xpPerLevel} XP to next level</span>
            </div>
            <div className="xp-track">
              <div className="xp-fill" style={{ width: `${xpProgress}%` }} />
            </div>
          </div>
          <div className="streak-chip">
            <span className="streak-num">{streak}</span>
            <span className="streak-label">day streak</span>
          </div>
        </div>

        {/* PRACTICE CARD */}
        <span className="s-label">Practice</span>
        <div className="practice-card">
          <div className="practice-inner">
            <div className="practice-count">{totalSessions}</div>
            <div className="practice-sub">
              {totalSessions === 1 ? 'passage completed' : 'passages completed'}
            </div>
          </div>
          <div className="practice-card-right">
            <button className="btn-go" onClick={() => router.push('/practice')}>
              Go to Practice Hub →
            </button>
          </div>
        </div>

        {/* STATS */}
        <span className="s-label">Your stats</span>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-inner">
              <div className="stat-val">{accuracy}%</div>
              <div className="stat-lbl">Accuracy</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-inner">
              <div className="stat-val">{bestStreak}</div>
              <div className="stat-lbl">Best streak</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-inner">
              <div className="stat-val">{formatTime(avgTime)}</div>
              <div className="stat-lbl">Avg time</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-inner">
              <div className="stat-val">{formatTime(totalTime)}</div>
              <div className="stat-lbl">Time spent practicing</div>
            </div>
          </div>
        </div>

        {/* RECENT SESSIONS */}
        <span className="s-label">Recent activity</span>
        {sessions.length === 0 ? (
          <div className="empty-card">
            <p className="empty-title">No sessions yet</p>
            <p className="empty-sub">Complete a practice to see your history here.</p>
          </div>
        ) : (
          <div className="sessions-list">
            {sessions.slice(0, 8).map(s => {
              const acc = s.total > 0 ? Math.round((s.score / s.total) * 100) : 0
              const cls = acc >= 80 ? 'acc-high' : acc >= 50 ? 'acc-mid' : 'acc-low'
              return (
                <div className="session-row" key={s.id}>
                  <div className="session-left">
                    <span className="session-topic">{s.topic}</span>
                    <span className="session-date">{formatDate(s.completed_at)}</span>
                  </div>
                  <div className="session-right">
                    <div>
                      <div className="session-score">{s.score}/{s.total} correct</div>
                      <div className="session-time">{formatTime(s.time_seconds ?? 0)}</div>
                    </div>
                    <span className={`acc-badge ${cls}`}>{acc}%</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* MISSED WORDS */}
        <span className="s-label" style={{ marginTop: 32 }}>Most missed words</span>
        {missedWords.length === 0 ? (
          <div className="empty-card">
            <p className="empty-title">No mistakes recorded yet</p>
            <p className="empty-sub">Words you miss will appear here.</p>
          </div>
        ) : (
          <>
            <div className="missed-grid">
              {visibleMissed.map(({ word, count }) => (
                <div
                  className="missed-card"
                  key={word}
                  title="Click to practice this word"
                  onClick={() => router.push(`/practice?word=${encodeURIComponent(word)}`)}
                >
                  <span className="missed-word">{word}</span>
                  <span className="missed-count">×{count}</span>
                </div>
              ))}
            </div>
            {missedWords.length > 8 && (
              <button className="btn-toggle" onClick={() => setShowAllMissed(v => !v)}>
                {showAllMissed ? `Show less ↑` : `Show all ${missedWords.length} words ↓`}
              </button>
            )}
          </>
        )}

      </div>
    </>
  )
}