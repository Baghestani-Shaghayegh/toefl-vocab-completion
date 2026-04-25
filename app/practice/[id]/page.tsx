'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Passage = {
  id: string
  text: string
  topic: string
  difficulty: number
}

type WordToken = {
  original: string
  clean: string        // letters only
  punct: string        // trailing punctuation
  shouldMask: boolean
  wordIndex: number
  // For masked words: which letter indices are hidden
  hiddenIndices: number[]
  // The "answer" is only the hidden letters joined
  answerLength: number
}

// How many letters to hide based on word length
function hiddenCount(len: number): number {
  if (len <= 4) return 1
  if (len <= 6) return 2
  if (len <= 8) return 3
  return 4
}

// Always hide letters from the middle/end, never the first letter
function pickHiddenIndices(clean: string): number[] {
  const len = clean.length
  const count = hiddenCount(len)
  // always hide the last `count` letters e.g. "polyps" -> "poly__"
  return Array.from({ length: count }, (_, i) => len - count + i)
}

function buildTokens(text: string): WordToken[] {
  return text.split(' ').map((word, i) => {
    const clean = word.replace(/[^a-zA-Z]/g, '')
    const punct = word.slice(clean.length)
    const shouldMask = clean.length > 3 && i % 3 === 2
    const hiddenIndices = shouldMask ? pickHiddenIndices(clean) : []
    return {
      original: word,
      clean,
      punct,
      shouldMask,
      wordIndex: i,
      hiddenIndices: hiddenIndices ?? [],
      answerLength: hiddenIndices.length,
    }
  })
}

function pad(n: number) { return String(n).padStart(2, '0') }

// Renders a word with only the hidden letters as blank slots
function WordSlots({
  token, typed, checked, isFocused,
  onFocus, onType, onBackspace, onEnter, slotRef,
}: {
  token: WordToken
  typed: string        // typed letters for hidden slots only
  checked: boolean
  isFocused: boolean
  onFocus: () => void
  onType: (ch: string) => void
  onBackspace: () => void
  onEnter: () => void
  slotRef: (el: HTMLSpanElement | null) => void
}) {
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') { e.preventDefault(); onEnter(); return }
    if (e.key === 'Backspace') { e.preventDefault(); onBackspace(); return }
    if (e.key === 'Tab') { e.preventDefault(); onEnter(); return }
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      e.preventDefault()
      onType(e.key)
    }
  }

  // build the visual character by character
  let hiddenTypedIdx = 0

  return (
    <span
      ref={slotRef}
      tabIndex={checked ? -1 : 0}
      onFocus={onFocus}
      onKeyDown={handleKeyDown}
      style={{
        outline: 'none',
        display: 'inline-flex',
        alignItems: 'flex-end',
        gap: '1px',
        margin: '0 1px',
        cursor: checked ? 'default' : 'text',
        verticalAlign: 'baseline',
      }}
    >
      {token.clean.split('').map((letter, ci) => {
        const isHidden = (token.hiddenIndices ?? []).includes(ci)

        if (!isHidden) {
          // visible letter — just render it
          return (
            <span key={ci} style={{
              fontSize: 16,
              fontFamily: '"Special Elite", cursive',
              color: '#222',
              lineHeight: 1.4,
            }}>
              {letter}
            </span>
          )
        }

        // hidden slot
        const slotPos = hiddenTypedIdx++
        const typedChar = typed[slotPos]
        const isFilled = typedChar !== undefined
        const isActiveCursor = isFocused && !checked && slotPos === typed.length

        let color = '#999'
        let borderColor = '#bbb'

        if (isFocused && !checked) {
          borderColor = isActiveCursor ? '#111' : '#ccc'
          color = isFilled ? '#111' : 'transparent'
        }

        if (checked) {
          if (isFilled) {
            const match = typedChar.toLowerCase() === letter.toLowerCase()
            color = match ? '#3a6b3a' : '#b05050'
            borderColor = match ? '#5a8c5a' : '#c07070'
          } else {
            color = 'transparent'
            borderColor = '#c07070'
          }
        }

        // only the active cursor slot shows _ , all others show nothing
        const displayChar = isFilled ? typedChar : (isActiveCursor ? '_' : ' ')

        return (
          <span key={ci} style={{
            display: 'inline-block',
            width: 11,
            textAlign: 'center',
            fontSize: 16,
            fontFamily: '"Special Elite", cursive',
            color,
            borderBottom: `1.5px solid ${borderColor}`,
            lineHeight: 1.4,
            paddingBottom: 1,
            animation: isActiveCursor ? 'slot-blink 1s step-end infinite' : 'none',
          }}>
            {displayChar}
          </span>
        )
      })}
      {token.punct && (
        <span style={{ fontSize: 16, fontFamily: '"Special Elite", cursive', color: '#222' }}>
          {token.punct}
        </span>
      )}
    </span>
  )
}

export default function ExercisePage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string

  const [passage, setPassage] = useState<Passage | null>(null)
  const [allPassages, setAllPassages] = useState<Passage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tokens, setTokens] = useState<WordToken[]>([])
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [focusedIndex, setFocusedIndex] = useState<number>(-1)
  const [checked, setChecked] = useState(false)
  const [results, setResults] = useState<Record<number, boolean>>({})
  const [seconds, setSeconds] = useState(0)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const slotRefs = useRef<Record<number, HTMLSpanElement | null>>({})

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const [{ data: p }, { data: all }] = await Promise.all([
        supabase.from('passages').select('*').eq('id', id).single(),
        supabase.from('passages').select('id,text,topic,difficulty').order('created_at', { ascending: false }),
      ])
      if (!p) { setError('Passage not found.'); setLoading(false); return }
      setPassage(p)
      setAllPassages(all ?? [])
      setTokens(buildTokens(p.text))
      setLoading(false)
    }
    if (id) load()
  }, [id])

  // Auto-focus first blank
  useEffect(() => {
    if (!loading && tokens.length > 0) {
      const first = tokens.find(t => t.shouldMask)
      if (first) {
        setTimeout(() => {
          slotRefs.current[first.wordIndex]?.focus()
          setFocusedIndex(first.wordIndex)
        }, 150)
      }
    }
  }, [loading, tokens])

  // Timer
  useEffect(() => {
    if (checked) { clearInterval(timerRef.current!); return }
    timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000)
    return () => clearInterval(timerRef.current!)
  }, [checked])

  useEffect(() => {
    setAnswers({}); setChecked(false); setResults({}); setSeconds(0); setFocusedIndex(-1)
  }, [id])

  const maskIndices = tokens.filter(t => t.shouldMask).map(t => t.wordIndex)

  function focusSlot(wordIndex: number) {
    slotRefs.current[wordIndex]?.focus()
    setFocusedIndex(wordIndex)
  }

  function goNext(currentWordIndex: number) {
    const pos = maskIndices.indexOf(currentWordIndex)
    if (pos < maskIndices.length - 1) focusSlot(maskIndices[pos + 1])
    else handleCheck()
  }

  function handleType(wordIndex: number, ch: string) {
    const token = tokens.find(t => t.wordIndex === wordIndex)
    if (!token) return
    const current = answers[wordIndex] ?? ''
    if (current.length >= token.answerLength) return
    const next = current + ch
    setAnswers(prev => ({ ...prev, [wordIndex]: next }))
    // auto-advance when all hidden slots are filled
    if (next.length >= token.answerLength) {
      setTimeout(() => goNext(wordIndex), 80)
    }
  }

  function handleBackspace(wordIndex: number) {
    const current = answers[wordIndex] ?? ''
    if (current.length > 0) {
      setAnswers(prev => ({ ...prev, [wordIndex]: current.slice(0, -1) }))
    } else {
      const pos = maskIndices.indexOf(wordIndex)
      if (pos > 0) focusSlot(maskIndices[pos - 1])
    }
  }

function handleCheck() {
  clearInterval(timerRef.current!)
  const res: Record<number, boolean> = {}
  tokens.forEach(t => {
    if (!t.shouldMask) return
    const typed = answers[t.wordIndex] ?? ''
    const correct = (t.hiddenIndices ?? []).map(i => t.clean[i]).join('')
    res[t.wordIndex] = typed.toLowerCase() === correct.toLowerCase()
  })
  setResults(res)
  setChecked(true)
  // ── save to localStorage ──
  if (id) {
    const stored = localStorage.getItem('completed_passages')
    const prev: string[] = stored ? JSON.parse(stored) : []
    if (!prev.includes(id)) {
      localStorage.setItem('completed_passages', JSON.stringify([...prev, id]))
    }
  }
}

  function handleNextPassage() {
    if (!passage) return
    const idx = allPassages.findIndex(p => p.id === passage.id)
    const next = allPassages[idx + 1]
    router.push(next ? `/practice/${next.id}` : '/practice')
  }

  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  const timerStr = `${pad(m)}:${pad(s)}`
  const maskedTokens = tokens.filter(t => t.shouldMask)
  const correctCount = Object.values(results).filter(Boolean).length
  const isLast = allPassages.length > 0 && allPassages[allPassages.length - 1]?.id === id

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 100 }}>
      <p style={{ fontFamily: '"Special Elite", cursive', fontSize: 16, color: '#888' }}>Loading…</p>
    </div>
  )

  if (error) return (
    <div style={{ textAlign: 'center', padding: '80px 24px', fontFamily: '"Special Elite", cursive' }}>
      <p style={{ fontSize: 18 }}>Passage not found.</p>
      <button onClick={() => router.push('/practice')} style={{
        marginTop: 20, background: 'none', border: '1.5px solid #111',
        padding: '8px 20px', borderRadius: 4, fontFamily: 'inherit', fontSize: 14, cursor: 'pointer',
      }}>← Back</button>
    </div>
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Special+Elite&family=Caveat:wght@400;600&display=swap');

        @keyframes slot-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.2; }
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f5f2eb; font-family: 'Special Elite', cursive; }

        .ex-wrap { max-width: 720px; margin: 0 auto; padding: 40px 24px 80px; }

        .ex-top {
          display: flex; align-items: center;
          justify-content: space-between; margin-bottom: 32px;
        }

        .btn-back {
          font-family: 'Special Elite', cursive; font-size: 14px;
          color: #555; background: none; border: none;
          cursor: pointer; padding: 0; transition: color 0.12s;
        }
        .btn-back:hover { color: #111; }

        .ex-timer {
          font-family: 'Caveat', cursive; font-size: 22px;
          font-weight: 600; color: #111; letter-spacing: 1px;
        }

        .paper-card {
          background: #fffef9;
          border: 1.5px solid #d6d0c4;
          border-radius: 3px;
          padding: 36px 40px;
          position: relative;
          box-shadow: 2px 3px 0 #d6d0c4, 4px 6px 0 #ece8de;
        }
        .paper-card::before {
          content: '';
          position: absolute;
          left: 56px; top: 0; bottom: 0; width: 1px;
          background: rgba(220,100,100,0.2);
          pointer-events: none;
        }
        .paper-card::after {
          content: '';
          position: absolute; inset: 0;
          background-image: repeating-linear-gradient(
            transparent, transparent 31px,
            rgba(180,180,200,0.15) 31px, rgba(180,180,200,0.15) 32px
          );
          border-radius: 3px;
          pointer-events: none;
        }
        .paper-content { position: relative; z-index: 1; }

        .topic-label {
          font-family: 'Caveat', cursive; font-size: 13px; font-weight: 600;
          color: #888; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 20px;
        }

        .passage-text {
          font-family: 'Special Elite', cursive;
          font-size: 16px; line-height: 2.1; color: #222;
        }

        .results-section { margin-top: 32px; }
        .results-header { display: flex; align-items: baseline; gap: 12px; margin-bottom: 16px; }
        .score-line { font-family: 'Caveat', cursive; font-size: 18px; font-weight: 600; color: #444; }
        .time-line  { font-family: 'Special Elite', cursive; font-size: 16px; color: #999; }

        .results-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 10px;
        }

        .result-card {
          border-radius: 3px; padding: 10px 14px; border: 1px solid;
          font-family: 'Special Elite', cursive;
        }
        .result-card.correct { background: #f0f9f0; border-color: #b8ddb8; box-shadow: 1px 2px 0 #b8ddb8; }
        .result-card.wrong   { background: #fdf0f0; border-color: #e0bbbb; box-shadow: 1px 2px 0 #e0bbbb; }
        .result-your    { font-size: 13px; color: #555; margin-bottom: 2px; }
        .result-word    { font-size: 15px; color: #333; margin-bottom: 2px; }
        .result-row  { display: flex; align-items: center; gap: 6px; font-size: 13px; }
.result-wrong-letters { color: #b05050; text-decoration: line-through; }
.result-arrow { color: #bbb; font-size: 11px; }
.result-right-letters { color: #3a6b3a; font-weight: 600; }
        .result-correct { font-family: 'Caveat', cursive; font-size: 13px; color: #5a8c5a; font-weight: 600; }

        .ex-footer { margin-top: 32px; display: flex; justify-content: flex-end; gap: 10px; }

        .btn-check {
          font-family: 'Special Elite', cursive; font-size: 14px;
          color: #fff; background: #222; border: 1.5px solid #111;
          padding: 9px 24px; border-radius: 3px; cursor: pointer;
          box-shadow: 2px 2px 0 #111; transition: all 0.1s;
        }
        .btn-check:hover  { transform: translate(-1px,-1px); box-shadow: 3px 3px 0 #111; }
        .btn-check:active { transform: translate(1px,1px);   box-shadow: 1px 1px 0 #111; }

        .btn-next {
          font-family: 'Special Elite', cursive; font-size: 14px;
          color: #222; background: #fffef9; border: 1.5px solid #555;
          padding: 9px 24px; border-radius: 3px; cursor: pointer;
          box-shadow: 2px 2px 0 #555; transition: all 0.1s;
        }
        .btn-next:hover  { transform: translate(-1px,-1px); box-shadow: 3px 3px 0 #555; }
        .btn-next:active { transform: translate(1px,1px);   box-shadow: 1px 1px 0 #555; }

        @media (max-width: 560px) {
          .paper-card { padding: 24px 20px; }
          .paper-card::before { left: 36px; }
          .results-grid { grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); }
        }
      `}</style>

      <div className="ex-wrap">
        <div className="ex-top">
          <button className="btn-back" onClick={() => router.push('/practice')}>
            ← Practice Hub
          </button>
          <span className="ex-timer">{timerStr}</span>
        </div>

        <div className="paper-card">
          <div className="paper-content">
            {/* small topic label only — no big title */}
            <div className="topic-label">{passage?.topic || 'General'}</div>

            <div className="passage-text">
              {tokens.map((t, i) => {
                if (!t.shouldMask) {
                  return <span key={i}>{i > 0 ? ' ' : ''}{t.original}</span>
                }
                return (
                  <span key={i} style={{ whiteSpace: 'nowrap' }}>
                    {i > 0 ? ' ' : ''}
                    <WordSlots
                      token={t}
                      typed={answers[t.wordIndex] ?? ''}
                      checked={checked}
                      isFocused={focusedIndex === t.wordIndex}
                      onFocus={() => setFocusedIndex(t.wordIndex)}
                      onType={ch => handleType(t.wordIndex, ch)}
                      onBackspace={() => handleBackspace(t.wordIndex)}
                      onEnter={() => goNext(t.wordIndex)}
                      slotRef={el => { slotRefs.current[t.wordIndex] = el }}
                    />
                  </span>
                )
              })}
            </div>
          </div>
        </div>

        {checked && (
          <div className="results-section">
            <div className="results-header">
              <span className="score-line">{correctCount} / {maskedTokens.length} correct</span>
              <span className="time-line">in {timerStr}</span>
            </div>
            <div className="results-grid">
              {maskedTokens.map(t => {
                const isCorrect = results[t.wordIndex]
                const typed = answers[t.wordIndex] ?? '—'
                const correctLetters = (t.hiddenIndices ?? []).map(i => t.clean[i]).join('')
                return (
<div key={t.wordIndex} className={`result-card ${isCorrect ? 'correct' : 'wrong'}`}>
  <div className="result-word">{t.clean}</div>
  {!isCorrect && (
    <div className="result-row">
      <span className="result-wrong-letters">{typed || '—'}</span>
      <span className="result-arrow">→</span>
      <span className="result-right-letters">{correctLetters}</span>
    </div>
  )}
</div>
                )
              })}
            </div>
          </div>
        )}

        <div className="ex-footer">
          {!checked ? (
            <button className="btn-check" onClick={handleCheck}>Check answers</button>
          ) : (
            <button className="btn-next" onClick={handleNextPassage}>
              {isLast ? '← Back to Hub' : 'Next passage →'}
            </button>
          )}
        </div>
      </div>
    </>
  )
}