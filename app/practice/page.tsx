 'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Passage = {
  id: string
  text: string
  topic: string
  difficulty: number
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  biology:    { bg: '#f0fdf4', text: '#15803d' },
  history:    { bg: '#fffbeb', text: '#b45309' },
  economics:  { bg: '#eff6ff', text: '#1d4ed8' },
  science:    { bg: '#f5f3ff', text: '#6d28d9' },
  geography:  { bg: '#fff1f2', text: '#be123c' },
  technology: { bg: '#ecfeff', text: '#0e7490' },
}

const DIFFICULTY_LABEL: Record<number, string> = {
  1: 'Easy',
  2: 'Medium',
  3: 'Hard',
}

const DIFFICULTY_COLOR: Record<number, { bg: string; text: string }> = {
  1: { bg: '#f0fdf4', text: '#15803d' },
  2: { bg: '#fffbeb', text: '#b45309' },
  3: { bg: '#fef2f2', text: '#dc2626' },
}

function getTitle(text: string, topic: string): string {
  // Make a readable title from first ~6 words of the passage
  const words = text.trim().split(' ').slice(0, 6).join(' ')
  return words.length < text.length ? words + '…' : words
}

function getExcerpt(text: string): string {
  return text.length > 120 ? text.slice(0, 120) + '…' : text
}

function getCategoryColor(topic: string) {
  const key = topic?.toLowerCase().trim()
  return CATEGORY_COLORS[key] ?? { bg: '#f9fafb', text: '#6b7280' }
}

export default function PracticePage() {
  const router = useRouter()
  const [passages, setPassages] = useState<Passage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('passages')
        .select('id, text, topic, difficulty')
        .order('created_at', { ascending: false })

      if (error) {
        setError('Could not load passages. Please try again.')
      } else {
        setPassages(data ?? [])
      }
      setLoading(false)
    }
    load()
  }, [])

  // Get unique topics for filter tabs
  const topics = ['all', ...Array.from(new Set(passages.map(p => p.topic?.toLowerCase())))]

  const filtered = filter === 'all'
    ? passages
    : passages.filter(p => p.topic?.toLowerCase() === filter)

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body { background: #ffffff; font-family: 'Inter', sans-serif; }

        .practice-page {
          max-width: 760px;
          margin: 0 auto;
          padding: 48px 24px 80px;
        }

        /* PAGE HEADER */
        .page-header { margin-bottom: 32px; }

        .page-title {
          font-size: 24px;
          font-weight: 700;
          color: #111827;
          letter-spacing: -0.5px;
          margin-bottom: 6px;
        }

        .page-sub {
          font-size: 14px;
          color: #6b7280;
        }

        /* FILTER TABS */
        .filter-row {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
          margin-bottom: 28px;
        }

        .filter-btn {
          font-size: 13px;
          font-weight: 500;
          color: #6b7280;
          background: none;
          border: 1px solid #e5e7eb;
          padding: 5px 13px;
          border-radius: 99px;
          cursor: pointer;
          transition: all 0.12s;
          font-family: inherit;
          text-transform: capitalize;
        }
        .filter-btn:hover { border-color: #d1d5db; color: #111827; }
        .filter-btn.active {
          background: #111827;
          border-color: #111827;
          color: #fff;
        }

        /* PASSAGE CARDS */
        .cards-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .passage-card {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 20px 24px;
          display: flex;
          align-items: center;
          gap: 20px;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .passage-card:hover {
          border-color: #d1d5db;
          box-shadow: 0 2px 12px rgba(0,0,0,0.05);
        }

        /* left: number */
        .card-num {
          font-size: 13px;
          font-weight: 600;
          color: #d1d5db;
          width: 24px;
          flex-shrink: 0;
          text-align: center;
        }

        /* middle: content */
        .card-body { flex: 1; min-width: 0; }

        .card-badges {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 7px;
        }

        .badge-topic {
          font-size: 11px;
          font-weight: 600;
          padding: 2px 9px;
          border-radius: 99px;
          text-transform: capitalize;
          letter-spacing: 0.2px;
        }

        .badge-diff {
          font-size: 11px;
          font-weight: 500;
          padding: 2px 9px;
          border-radius: 99px;
        }

        .card-title {
          font-size: 15px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 5px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .card-excerpt {
          font-size: 13px;
          color: #9ca3af;
          line-height: 1.55;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* right: start btn */
        .card-action { flex-shrink: 0; }

        .btn-start {
          background: #2563eb;
          border: none;
          color: #fff;
          padding: 8px 18px;
          border-radius: 8px;
          font-family: inherit;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.12s;
          white-space: nowrap;
        }
        .btn-start:hover { background: #1d4ed8; }

        /* STATES */
        .state-center {
          text-align: center;
          padding: 80px 0;
        }

        .state-icon { font-size: 32px; margin-bottom: 12px; }

        .state-title {
          font-size: 16px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 6px;
        }

        .state-sub { font-size: 14px; color: #9ca3af; }

        .spinner {
          width: 28px; height: 28px;
          border: 2.5px solid #e5e7eb;
          border-top-color: #2563eb;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          margin: 0 auto 16px;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 560px) {
          .passage-card { flex-wrap: wrap; gap: 12px; }
          .card-num { display: none; }
          .card-action { width: 100%; }
          .btn-start { width: 100%; text-align: center; }
        }
      `}</style>

      <div className="practice-page">
        <div className="page-header">
          <h1 className="page-title">Practice Hub</h1>
          <p className="page-sub">Choose a passage and start filling in the blanks.</p>
        </div>

        {/* FILTER TABS */}
        {!loading && passages.length > 0 && (
          <div className="filter-row">
            {topics.map(t => (
              <button
                key={t}
                className={`filter-btn${filter === t ? ' active' : ''}`}
                onClick={() => setFilter(t)}
              >
                {t === 'all' ? 'All' : t}
              </button>
            ))}
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="state-center">
            <div className="spinner" />
            <p className="state-sub">Loading passages…</p>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="state-center">
            <div className="state-icon">⚠️</div>
            <p className="state-title">Something went wrong</p>
            <p className="state-sub">{error}</p>
          </div>
        )}

        {/* EMPTY */}
        {!loading && !error && filtered.length === 0 && (
          <div className="state-center">
            <div className="state-icon">📄</div>
            <p className="state-title">No passages found</p>
            <p className="state-sub">
              {filter !== 'all' ? `No passages in "${filter}" yet.` : 'No passages in the database yet.'}
            </p>
          </div>
        )}

        {/* CARDS */}
        {!loading && !error && filtered.length > 0 && (
          <div className="cards-list">
            {filtered.map((passage, i) => {
              const cat = getCategoryColor(passage.topic)
              const diff = DIFFICULTY_COLOR[passage.difficulty] ?? DIFFICULTY_COLOR[1]
              const diffLabel = DIFFICULTY_LABEL[passage.difficulty] ?? 'Easy'

              return (
                <div className="passage-card" key={passage.id}>
                  <div className="card-num">{i + 1}</div>

                  <div className="card-body">
                    <div className="card-badges">
                      <span
                        className="badge-topic"
                        style={{ background: cat.bg, color: cat.text }}
                      >
                        {passage.topic || 'General'}
                      </span>
                      <span
                        className="badge-diff"
                        style={{ background: diff.bg, color: diff.text }}
                      >
                        {diffLabel}
                      </span>
                    </div>
                    <div className="card-title">
                      {getTitle(passage.text, passage.topic)}
                    </div>
                    <div className="card-excerpt">
                      {getExcerpt(passage.text)}
                    </div>
                  </div>

                  <div className="card-action">
                    <button
                      className="btn-start"
                      onClick={() => router.push(`/practice/${passage.id}`)}
                    >
                      Start →
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}