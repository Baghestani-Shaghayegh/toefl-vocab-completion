'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Passage = {
  id: string
  text: string
  topic: string
  difficulty: number
}

type WordToken = {
  original: string
  clean: string
  punct: string
  shouldMask: boolean
  wordIndex: number
  hiddenIndices: number[]
  answerLength: number
}

function hiddenCount(len: number): number {
  if (len <= 4) return 1
  if (len <= 6) return 2
  if (len <= 8) return 3
  return 4
}

function pickHiddenIndices(clean: string): number[] {
  const len = clean.length
  const count = hiddenCount(len)
  return Array.from({ length: count }, (_, i) => len - count + i)
}

function buildTokens(text: string): WordToken[] {
  return text.split(' ').map((word, i) => {
    const clean = word.replace(/[^a-zA-Z]/g, '')
    const punct = word.slice(clean.length)
    const shouldMask = clean.length > 3 && i % 3 === 2
    const hiddenIndices = shouldMask ? pickHiddenIndices(clean) : []
    return {
      original: word, clean, punct, shouldMask,
      wordIndex: i,
      hiddenIndices: hiddenIndices ?? [],
      answerLength: hiddenIndices.length,
    }
  })
}

function pad(n: number) { return String(n).padStart(2, '0') }

function WordSlots({
  token, typed, checked, isFocused,
  onFocus, onType, onBackspace, onEnter, slotRef,
}: {
  token: WordToken
  typed: string
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
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) { e.preventDefault(); onType(e.key) }
  }

  let hiddenTypedIdx = 0

  return (
    <span
      ref={slotRef}
      tabIndex={checked ? -1 : 0}
      onFocus={onFocus}
      onKeyDown={handleKeyDown}
      style={{
        outline: 'none', display: 'inline-flex', alignItems: 'flex-end',
        gap: '1px', margin: '0 1px', cursor: checked ? 'default' : 'text',
        verticalAlign: 'baseline',
      }}
    >
      {token.clean.split('').map((letter, ci) => {
        const isHidden = (token.hiddenIndices ?? []).includes(ci)

        if (!isHidden) {
          return (
            <span key={ci} style={{ fontSize: 16, fontFamily: 'Inter, sans-serif', color: '#222', lineHeight: 1.4 }}>
              {letter}
            </span>
          )
        }

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
            color = 'transparent'; borderColor = '#c07070'
          }
        }

        const displayChar = isFilled ? typedChar : (isActiveCursor ? '_' : ' ')

        return (
          <span key={ci} style={{
            display: 'inline-block', width: 11, textAlign: 'center',
            fontSize: 16, fontFamily: 'Inter, sans-serif',
            color, borderBottom: `1.5px solid ${borderColor}`,
            lineHeight: 1.4, paddingBottom: 1,
            animation: isActiveCursor ? 'slot-blink 1s step-end infinite' : 'none',
          }}>
            {displayChar}
          </span>
        )
      })}
      {token.punct && (
        <span style={{ fontSize: 16, fontFamily: 'Inter, sans-serif', color: '#222' }}>
          {token.punct}
        </span>
      )}
    </span>
  )
}

export default function SamplePage() {
  const router = useRouter()

  const [passage, setPassage] = useState<Passage | null>(null)
  const [loading, setLoading] = useState(true)
  const [tokens, setTokens] = useState<WordToken[]>([])
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [focusedIndex, setFocusedIndex] = useState<number>(-1)
  const [checked, setChecked] = useState(false)
  const [results, setResults] = useState<Record<number, boolean>>({})
  const [seconds, setSeconds] = useState(0)
  const [started, setStarted] = useState(false)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const slotRefs = useRef<Record<number, HTMLSpanElement | null>>({})

  // Always load the first passage (oldest inserted = first in list)
  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase
        .from('passages')
        .select('*')
        .limit(1)
        .single()
      if (data) {
        setPassage(data)
        setTokens(buildTokens(data.text))
      }
      setLoading(false)
    }
    load()
  }, [])

  // Auto-focus first blank after start
  useEffect(() => {
    if (started && tokens.length > 0) {
      const first = tokens.find(t => t.shouldMask)
      if (first) {
        setTimeout(() => {
          slotRefs.current[first.wordIndex]?.focus()
          setFocusedIndex(first.wordIndex)
        }, 150)
      }
    }
  }, [started, tokens])

  // Timer — only runs after started
  useEffect(() => {
    if (!started || checked) { clearInterval(timerRef.current!); return }
    timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000)
    return () => clearInterval(timerRef.current!)
  }, [started, checked])

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
  }

  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  const timerStr = `${pad(m)}:${pad(s)}`
  const maskedTokens = tokens.filter(t => t.shouldMask)
  const correctCount = Object.values(results).filter(Boolean).length

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 100 }}>
      <p style={{ fontFamily: '"Special Elite", cursive', fontSize: 16, color: '#888' }}>Loading…</p>
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

        .sample-wrap { max-width: 720px; margin: 0 auto; padding: 40px 24px 80px; }

        .sample-top {
          display: flex; align-items: center;
          justify-content: space-between; margin-bottom: 32px;
        }

        .btn-back {
          font-family: 'Special Elite', cursive; font-size: 14px;
          color: #555; background: none; border: none;
          cursor: pointer; padding: 0; transition: color 0.12s;
        }
        .btn-back:hover { color: #111; }

        .sample-timer {
          font-family: 'Caveat', cursive; font-size: 22px;
          font-weight: 600; color: #111; letter-spacing: 1px;
        }

        /* WELCOME CARD */
        .welcome-card {
          background: #fffef9;
          border: 1.5px solid #d6d0c4;
          border-radius: 3px;
          padding: 52px 48px;
          text-align: center;
          box-shadow: 2px 3px 0 #d6d0c4, 4px 6px 0 #ece8de;
          position: relative;
        }
        .welcome-card::after {
          content: '';
          position: absolute; inset: 0;
          background-image: repeating-linear-gradient(
            transparent, transparent 31px,
            rgba(180,180,200,0.13) 31px, rgba(180,180,200,0.13) 32px
          );
          border-radius: 3px; pointer-events: none;
        }
        .welcome-inner { position: relative; z-index: 1; }

        .welcome-eyebrow {
          font-family: 'Caveat', cursive; font-size: 13px; font-weight: 600;
          color: #aaa; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 16px;
        }

        .welcome-title {
          font-family: 'Special Elite', cursive;
          font-size: clamp(22px, 4vw, 30px);
          color: #111; line-height: 1.25; margin-bottom: 14px;
        }

        .welcome-desc {
          font-family: 'Special Elite', cursive;
          font-size: 15px; color: #666; line-height: 1.75;
          max-width: 400px; margin: 0 auto 32px;
        }

        .btn-start-welcome {
          font-family: 'Special Elite', cursive; font-size: 15px;
          color: #fff; background: #222; border: 1.5px solid #111;
          padding: 12px 36px; border-radius: 3px; cursor: pointer;
          box-shadow: 3px 3px 0 #111; transition: all 0.1s; display: inline-block;
        }
        .btn-start-welcome:hover  { transform: translate(-1px,-1px); box-shadow: 4px 4px 0 #111; }
        .btn-start-welcome:active { transform: translate(1px,1px);   box-shadow: 2px 2px 0 #111; }

        .welcome-note {
          font-family: 'Caveat', cursive; font-size: 13px;
          color: #bbb; margin-top: 14px;
        }

        /* PAPER CARD */
        .paper-card {
          background: #fffef9; border: 1.5px solid #d6d0c4;
          border-radius: 3px; padding: 36px 40px; position: relative;
          box-shadow: 2px 3px 0 #d6d0c4, 4px 6px 0 #ece8de;
        }
        .paper-card::before {
          content: ''; position: absolute;
          left: 56px; top: 0; bottom: 0; width: 1px;
          background: rgba(220,100,100,0.2); pointer-events: none;
        }
        .paper-card::after {
          content: ''; position: absolute; inset: 0;
          background-image: repeating-linear-gradient(
            transparent, transparent 31px,
            rgba(180,180,200,0.15) 31px, rgba(180,180,200,0.15) 32px
          );
          border-radius: 3px; pointer-events: none;
        }
        .paper-content { position: relative; z-index: 1; }

        .topic-label {
          font-family: 'Caveat', cursive; font-size: 13px; font-weight: 600;
          color: #888; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 20px;
        }

        .passage-text {
  font-family: 'Inter', sans-serif;
  font-size: 16px; line-height: 2.1; color: #222;
}

        /* RESULTS */
        .results-section { margin-top: 32px; }
        .results-header { display: flex; align-items: baseline; gap: 10px; margin-bottom: 16px; }
        .score-line { font-family: 'Special Elite', cursive; font-size: 16px; color: #333; }
        .time-line  { font-family: 'Special Elite', cursive; font-size: 14px; color: #888; }

        .results-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 10px;
          margin-bottom: 28px;
        }

        .result-card {
          border-radius: 3px; padding: 10px 14px; border: 1px solid;
          font-family: 'Special Elite', cursive;
        }
        .result-card.correct { background: #f0f9f0; border-color: #b8ddb8; box-shadow: 1px 2px 0 #b8ddb8; }
        .result-card.wrong   { background: #fdf0f0; border-color: #e0bbbb; box-shadow: 1px 2px 0 #e0bbbb; }
        .result-word { font-size: 15px; color: #333; margin-bottom: 4px; }
        .result-row  { display: flex; align-items: center; gap: 6px; font-size: 13px; }
        .result-wrong-letters { color: #b05050; text-decoration: line-through; }
        .result-arrow { color: #bbb; font-size: 11px; }
        .result-right-letters { color: #3a6b3a; font-weight: 600; }

        /* UPSELL */
        .upsell-card {
          background: #fffef9; border: 1.5px solid #d6d0c4;
          border-radius: 3px; padding: 28px 32px; position: relative;
          box-shadow: 2px 3px 0 #d6d0c4, 4px 6px 0 #ece8de;
        }
        .upsell-card::after {
          content: ''; position: absolute; inset: 0;
          background-image: repeating-linear-gradient(
            transparent, transparent 31px,
            rgba(180,180,200,0.12) 31px, rgba(180,180,200,0.12) 32px
          );
          border-radius: 3px; pointer-events: none;
        }
        .upsell-inner { position: relative; z-index: 1; }

        .upsell-eyebrow {
          font-family: 'Caveat', cursive; font-size: 13px; font-weight: 600;
          color: #aaa; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 10px;
        }

        .upsell-title {
          font-family: 'Special Elite', cursive; font-size: 20px;
          color: #111; margin-bottom: 10px; letter-spacing: -0.3px;
        }

        .upsell-desc {
          font-family: 'Special Elite', cursive; font-size: 14px;
          color: #666; line-height: 1.7; margin-bottom: 22px;
        }

        .upsell-btns { display: flex; flex-wrap: wrap; gap: 10px; }

        .btn-solid {
          font-family: 'Special Elite', cursive; font-size: 13px;
          color: #fff; background: #222; border: 1.5px solid #111;
          padding: 8px 22px; border-radius: 3px; cursor: pointer;
          box-shadow: 2px 2px 0 #111; transition: all 0.1s;
          text-decoration: none; display: inline-block;
        }
        .btn-solid:hover { transform: translate(-1px,-1px); box-shadow: 3px 3px 0 #111; }

        .btn-ghost {
          font-family: 'Special Elite', cursive; font-size: 13px;
          color: #555; background: none; border: 1.5px solid #aaa;
          padding: 8px 22px; border-radius: 3px; cursor: pointer;
          box-shadow: 2px 2px 0 #ccc; transition: all 0.1s;
          text-decoration: none; display: inline-block;
        }
        .btn-ghost:hover { transform: translate(-1px,-1px); box-shadow: 3px 3px 0 #ccc; }

        /* FOOTER ACTIONS */
        .ex-footer { margin-top: 28px; display: flex; justify-content: flex-end; gap: 10px; }

        .btn-check {
          font-family: 'Special Elite', cursive; font-size: 14px;
          color: #fff; background: #222; border: 1.5px solid #111;
          padding: 9px 24px; border-radius: 3px; cursor: pointer;
          box-shadow: 2px 2px 0 #111; transition: all 0.1s;
        }
        .btn-check:hover  { transform: translate(-1px,-1px); box-shadow: 3px 3px 0 #111; }
        .btn-check:active { transform: translate(1px,1px);   box-shadow: 1px 1px 0 #111; }

        @media (max-width: 560px) {
          .paper-card { padding: 24px 20px; }
          .paper-card::before { left: 36px; }
          .welcome-card { padding: 36px 24px; }
          .results-grid { grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); }
        }
      `}</style>

      <div className="sample-wrap">

        <div className="sample-top">
          <button className="btn-back" onClick={() => router.push('/')}>← Home</button>
          {started && !checked && <span className="sample-timer">{timerStr}</span>}
          {checked && <span className="sample-timer" style={{ color: '#888' }}>{timerStr}</span>}
        </div>

        {/* WELCOME */}
        {!started && (
          <div className="welcome-card">
            <div className="welcome-inner">
              <p className="welcome-eyebrow">Sample · {passage?.topic || 'Reading'}</p>
              <h1 className="welcome-title">Ready to test your vocabulary?</h1>
              <p className="welcome-desc">
                Fill in the missing letters inside a real academic passage and get instant feedback when you're done.
              </p>
              <button className="btn-start-welcome" onClick={() => setStarted(true)}>
                Start practice
              </button>
              <p className="welcome-note">{maskedTokens.length} blanks · no account needed</p>
            </div>
          </div>
        )}

        {/* PRACTICE */}
        {started && (
          <div className="paper-card">
            <div className="paper-content">
              <div className="topic-label">{passage?.topic || 'General'}</div>
              <div className="passage-text">
                {tokens.map((t, i) => {
if (!t.shouldMask) {
  return <span key={i} style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, color: '#222' }}>{i > 0 ? ' ' : ''}{t.original}</span>
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
        )}

        {/* RESULT CARDS */}
        {checked && (
          <div className="results-section">
            <div className="results-header">
              <span className="score-line">{correctCount} / {maskedTokens.length} correct</span>
              <span className="time-line">in {timerStr}</span>
            </div>
            <div className="results-grid">
              {maskedTokens.map(t => {
                const isCorrect = results[t.wordIndex]
                const typed = answers[t.wordIndex]?.trim() || '—'
                const correctLetters = (t.hiddenIndices ?? []).map(i => t.clean[i]).join('')
                return (
                  <div key={t.wordIndex} className={`result-card ${isCorrect ? 'correct' : 'wrong'}`}>
                    <div className="result-word">{t.clean}</div>
                    {!isCorrect && (
                      <div className="result-row">
                        <span className="result-wrong-letters">{typed}</span>
                        <span className="result-arrow">→</span>
                        <span className="result-right-letters">{correctLetters}</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="upsell-card">
              <div className="upsell-inner">
                <p className="upsell-eyebrow">
                  {correctCount === maskedTokens.length ? 'Perfect score' : correctCount / maskedTokens.length >= 0.6 ? 'Good effort' : 'Keep practicing'}
                </p>
                <h2 className="upsell-title">Unlock 50+ practice passages</h2>
                <p className="upsell-desc">
                  Sign up free to get daily drills, progress tracking, and adaptive exercises that target your weak vocabulary areas.
                </p>
                <div className="upsell-btns">
                  <a href="/auth?view=signup" className="btn-solid">Sign up free</a>
                  <button className="btn-ghost" onClick={() => router.push('/')}>← Home</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CHECK BTN */}
        {started && !checked && (
          <div className="ex-footer">
            <button className="btn-check" onClick={handleCheck}>Check answers</button>
          </div>
        )}

      </div>
    </>
  )
}