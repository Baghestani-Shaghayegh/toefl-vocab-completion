'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// ─── Data ────────────────────────────────────────────────────────────────────
// Each blank uses {id:hiddenLetters} syntax embedded in the paragraph string.
// prefix  → the visible letters shown BEFORE the input (e.g. "spe" in "spe___")
// answer  → what the user must type (just the hidden portion)
// full    → the complete word shown as a hint after wrong answers

type Blank = {
  id: number;
  prefix: string;
  answer: string;
  full: string;
};

type Passage = {
  title: string;
  topic: string;
  paragraphs: string[];
  blanks: Blank[];
};

const passage: Passage = {
  title: 'Marine Ecosystems',
  topic: 'Academic reading · Environment',
  paragraphs: [
    'Marine ecosystems are among the most diverse and productive environments on Earth. Coral reefs support an estimated 25% of all marine {1} despite covering less than 1% of the ocean floor. These vibrant communities depend on a delicate {2} between countless organisms, from microscopic algae to large predatory fish.',
    'Ocean {3}ification, caused by increasing atmospheric carbon dioxide, has diminished the ability of corals to build their calcium carbonate skeletons. Rising water temperatures trigger coral bleaching, where corals {4} their symbiotic algae, causing them to turn white and ultimately perish.',
    'Despite these threats, scientists are implementing innovative solutions. Marine protected areas have proven {5}ive in allowing coral populations to recover. Restoration projects involve {6}ating coral fragments in laboratories and transplanting them to degraded reefs.',
  ],
  // {n} tokens in paragraphs above reference these blank definitions by id.
  blanks: [
    { id: 1, prefix: '',       answer: 'species', full: 'species'    },
    { id: 2, prefix: '',       answer: 'balance', full: 'balance'    },
    { id: 3, prefix: '',       answer: 'acidif',  full: 'acidification' },
    { id: 4, prefix: '',       answer: 'expel',   full: 'expel'      },
    { id: 5, prefix: 'effect', answer: 'effect',  full: 'effective'  },
    { id: 6, prefix: 'cultiv', answer: 'cultiv',  full: 'cultivating'},
  ],
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatTime(s: number) {
  const m = Math.floor(s / 60).toString().padStart(2, '0');
  const sec = (s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
}

// Splits a paragraph string on {n} tokens and returns an array of segments
// with either plain text or a blank id.
function tokenise(text: string): Array<{ type: 'text'; value: string } | { type: 'blank'; id: number }> {
  const parts = text.split(/\{(\d+)\}/);
  return parts.map((p, i) =>
    i % 2 === 0
      ? { type: 'text' as const, value: p }
      : { type: 'blank' as const, id: parseInt(p) }
  );
}

// ─── Component ───────────────────────────────────────────────────────────────
type Phase = 'welcome' | 'practice' | 'results';
type CheckState = Record<number, boolean>;

export default function PracticePage() {
  const [phase, setPhase] = useState<Phase>('welcome');
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [checked, setChecked] = useState<CheckState | null>(null);
  const inputRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const orderedIds = passage.blanks.map((b) => b.id);

  // Timer
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  function handleStart() {
    setPhase('practice');
    setRunning(true);
    // Focus first blank after render
    setTimeout(() => inputRefs.current[orderedIds[0]]?.focus(), 80);
  }

  function handleChange(id: number, value: string) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>, id: number) {
    if (e.key === 'Tab') {
      e.preventDefault();
      const idx = orderedIds.indexOf(id);
      const next = orderedIds[idx + 1];
      if (next !== undefined) {
        inputRefs.current[next]?.focus();
      } else {
        (document.getElementById('check-btn') as HTMLButtonElement | null)?.focus();
      }
    }
  }

  function handleCheck() {
    setRunning(false);
    const result: CheckState = {};
    passage.blanks.forEach((b) => {
      const val = (answers[b.id] ?? '').toLowerCase().trim();
      result[b.id] = val === b.answer.toLowerCase();
    });
    setChecked(result);
    setPhase('results');
  }

  const correctCount = checked ? Object.values(checked).filter(Boolean).length : 0;
  const total = passage.blanks.length;
  const pct = Math.round((correctCount / total) * 100);

  // ── Render blank inline inside paragraph text ──
  function renderBlank(blank: Blank) {
    const isChecked = checked !== null;
    const isCorrect = checked?.[blank.id];
    const underscores = '_'.repeat(blank.answer.length);

    let borderColor = '#378ADD';   // active blue
    let bg = 'transparent';
    let textColor = 'inherit';

    if (isChecked) {
      if (isCorrect) {
        borderColor = '#3B6D11';
        bg = '#EAF3DE';
        textColor = '#27500A';
      } else {
        borderColor = '#A32D2D';
        bg = '#FCEBEB';
        textColor = '#791F1F';
      }
    }

    return (
      <span key={blank.id} className="inline-flex items-baseline gap-1">
        {blank.prefix && (
          <span className="font-mono tracking-wide">{blank.prefix}</span>
        )}
        <input
          ref={(el) => { inputRefs.current[blank.id] = el; }}
          id={`blank-${blank.id}`}
          type="text"
          value={answers[blank.id] ?? ''}
          onChange={(e) => handleChange(blank.id, e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, blank.id)}
          disabled={isChecked}
          placeholder={underscores}
          maxLength={blank.answer.length + 2}
          autoComplete="off"
          spellCheck={false}
          style={{
            borderBottom: `2px solid ${borderColor}`,
            background: bg,
            color: textColor,
            minWidth: `${Math.max(blank.answer.length, 4) * 10}px`,
            width: `${Math.max(blank.answer.length, 4) * 10}px`,
          }}
          className={[
            'inline-block text-center font-mono tracking-widest text-base',
            'outline-none bg-transparent transition-colors duration-150',
            'pb-0.5 mx-0.5',
            isChecked ? 'rounded-t cursor-not-allowed px-1.5' : 'cursor-text',
          ].join(' ')}
        />
        {isChecked && !isCorrect && (
          <span className="text-sm font-semibold text-emerald-700 ml-0.5 whitespace-nowrap">
            {blank.full}
          </span>
        )}
      </span>
    );
  }

  // ── Welcome screen ──────────────────────────────────────────────────────────
  if (phase === 'welcome') {
    return (
      <main className="min-h-screen bg-[#f8f9fa] flex items-center justify-center px-4">
        <div className="w-full max-w-lg">
          <div className="rounded-[2rem] bg-white border border-slate-200 shadow-[0_20px_50px_rgba(15,23,42,0.07)] p-10 text-center">
            {/* Icon */}
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
              <svg className="h-7 w-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
              </svg>
            </div>

            {/* Brand */}
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-600 mb-3">
              LexiLift · Free trial
            </p>

            <h1 className="text-3xl font-bold text-slate-950 tracking-tight mb-3">
              Ready to test your vocabulary?
            </h1>
            <p className="text-base leading-7 text-slate-600 mb-8 max-w-sm mx-auto">
              Fill in the missing letters inside a real academic passage and get instant feedback when you're done.
            </p>

            {/* Pills */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {['TOEFL-style', `${total} blanks`, '~3 minutes', 'Free'].map((label) => (
                <span
                  key={label}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600"
                >
                  {label}
                </span>
              ))}
            </div>

            <button
              onClick={handleStart}
              className="inline-flex items-center justify-center rounded-full bg-blue-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-950/20 transition hover:bg-blue-500 active:scale-[0.98]"
            >
              Start practice
            </button>

            <p className="mt-5 text-xs text-slate-400">No account needed to try this exercise.</p>
          </div>
        </div>
      </main>
    );
  }

  // ── Practice + Results screen ───────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-[#f8f9fa] px-4 py-12">
      <div className="mx-auto max-w-2xl">

        {/* Passage card */}
        <div className="rounded-[2rem] bg-white border border-slate-200 shadow-[0_20px_50px_rgba(15,23,42,0.07)] overflow-hidden">

          {/* Card header */}
          <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600 mb-0.5">
                {passage.topic}
              </p>
              <h2 className="text-lg font-semibold text-slate-950">{passage.title}</h2>
            </div>

            {/* Timer */}
            <div className="flex items-center gap-2">
              <span
                className={[
                  'h-2 w-2 rounded-full transition-colors',
                  running ? 'bg-emerald-500' : 'bg-slate-300',
                ].join(' ')}
              />
              <span className="tabular-nums text-sm font-medium text-slate-600">
                {formatTime(seconds)}
              </span>
            </div>
          </div>

          {/* Passage body */}
          <div className="px-8 py-7 space-y-5">
            {passage.paragraphs.map((para, pIdx) => (
              <p key={pIdx} className="text-[1.0625rem] leading-[1.9] text-slate-800">
                {tokenise(para).map((token, tIdx) => {
                  if (token.type === 'text') return <span key={tIdx}>{token.value}</span>;
                  const blank = passage.blanks.find((b) => b.id === token.id);
                  if (!blank) return null;
                  return renderBlank(blank);
                })}
              </p>
            ))}
          </div>

          {/* Check button */}
          <div className="px-8 pb-7 flex justify-end">
            <button
              id="check-btn"
              onClick={handleCheck}
              disabled={checked !== null}
              className={[
                'rounded-full px-7 py-3 text-sm font-semibold transition',
                checked === null
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/20 hover:bg-emerald-500 active:scale-[0.98]'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed',
              ].join(' ')}
            >
              Check answers
            </button>
          </div>
        </div>

        {/* Results panel — shown after check */}
        {phase === 'results' && checked !== null && (
          <div className="mt-5 space-y-4">

            {/* Score bar */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Score', value: `${correctCount}/${total}` },
                { label: 'Accuracy', value: `${pct}%` },
                { label: 'Time', value: formatTime(seconds) },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-[1.25rem] bg-white border border-slate-200 px-4 py-4 text-center"
                >
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-500 mb-1">{item.label}</p>
                  <p className="text-2xl font-semibold text-slate-950">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Upsell card */}
            <div className="rounded-[2rem] bg-[#173154] p-7 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-200 mb-3">
                {pct === 100
                  ? 'Perfect score — you crushed it'
                  : pct >= 60
                  ? 'Solid effort — keep building'
                  : 'Good start — practice makes perfect'}
              </p>
              <h3 className="text-2xl font-bold tracking-tight mb-2">
                Unlock 50+ practice passages.
              </h3>
              <p className="text-sm leading-6 text-slate-300 mb-6 max-w-md">
                Sign up free to get daily drills, progress tracking across sessions, and adaptive exercises that target your weak vocabulary areas.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/auth?view=signup"
                  className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
                >
                  Sign up — it's free
                </Link>
                <Link
                  href="/auth?view=login"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Log in
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Back to home
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}