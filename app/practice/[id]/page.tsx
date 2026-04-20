"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Passage = {
  id: string;
  text: string;
  topic: string;
  difficulty: number;
};

function buildWords(text: string) {
  return text.split(" ").map((word, i) => {
    const clean = word.replace(/[^a-zA-Z]/g, "");
    const punct = word.slice(clean.length);
    const shouldMask = clean.length > 3 && i % 3 === 2;
    const masked = shouldMask ? "_".repeat(clean.length) : "";
    return { original: word, clean, punct, shouldMask, masked };
  });
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function ExercisePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [passage, setPassage] = useState<Passage | null>(null);
  const [allPassages, setAllPassages] = useState<Passage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [words, setWords] = useState<ReturnType<typeof buildWords>>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState<Record<number, boolean>>({});
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inputRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const firstBlankIndex = useRef<number>(-1);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const [{ data: p }, { data: all }] = await Promise.all([
        supabase.from("passages").select("*").eq("id", id).single(),
        supabase
          .from("passages")
          .select("id, text, topic, difficulty")
          .order("created_at", { ascending: false }),
      ]);
      if (!p) {
        setError("Passage not found.");
        setLoading(false);
        return;
      }
      setPassage(p);
      setAllPassages(all ?? []);
      const w = buildWords(p.text);
      setWords(w);
      firstBlankIndex.current = w.findIndex((word) => word.shouldMask);
      setLoading(false);
    }
    if (id) load();
  }, [id]);

  // Auto-focus first blank after load
  useEffect(() => {
    if (!loading && firstBlankIndex.current >= 0) {
      setTimeout(() => {
        inputRefs.current[firstBlankIndex.current]?.focus();
      }, 100);
    }
  }, [loading]);

  // Count-up timer
  useEffect(() => {
    if (checked) return;
    timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timerRef.current!);
  }, [checked]);

  useEffect(() => {
    setAnswers({});
    setChecked(false);
    setResults({});
    setSeconds(0);
  }, [id]);

  function handleInput(index: number, value: string) {
    if (checked) return;
    setAnswers((prev) => ({ ...prev, [index]: value }));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>, index: number) {
    if (e.key === "Enter") {
      e.preventDefault();
      // move to next blank or check if last
      const maskIndices = words.map((w, i) => (w.shouldMask ? i : -1)).filter((i) => i >= 0);
      const pos = maskIndices.indexOf(index);
      if (pos < maskIndices.length - 1) {
        inputRefs.current[maskIndices[pos + 1]]?.focus();
      } else {
        handleCheck();
      }
    }
  }

  function handleCheck() {
    clearInterval(timerRef.current!);
    const res: Record<number, boolean> = {};
    words.forEach((w, i) => {
      if (!w.shouldMask) return;
      const user = (answers[i] ?? "").trim().toLowerCase();
      const correct = w.clean.toLowerCase();
      res[i] = user === correct;
    });
    setResults(res);
    setChecked(true);
  }

  function handleNext() {
    if (!passage || allPassages.length === 0) return;
    const idx = allPassages.findIndex((p) => p.id === passage.id);
    const next = allPassages[idx + 1];
    router.push(next ? `/practice/${next.id}` : "/practice");
  }

  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  const timerStr = `${pad(m)}:${pad(s)}`;

  const maskedWords = words.filter((w) => w.shouldMask);
  const correctCount = Object.values(results).filter(Boolean).length;
  const isLast = allPassages.length > 0 && allPassages[allPassages.length - 1]?.id === id;

  if (loading)
    return (
      <div style={{ display: "flex", justifyContent: "center", paddingTop: 100 }}>
        <p style={{ fontFamily: '"Special Elite", cursive', fontSize: 16, color: "#888" }}>
          Loading…
        </p>
      </div>
    );

  if (error)
    return (
      <div
        style={{
          textAlign: "center",
          padding: "80px 24px",
          fontFamily: '"Special Elite", cursive',
        }}
      >
        <p style={{ fontSize: 18, color: "#111" }}>Passage not found.</p>
        <button
          onClick={() => router.push("/practice")}
          style={{
            marginTop: 20,
            background: "none",
            border: "1.5px solid #111",
            padding: "8px 20px",
            borderRadius: 4,
            fontFamily: "inherit",
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          ← Back
        </button>
      </div>
    );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Special+Elite&family=Caveat:wght@400;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f5f2eb; font-family: 'Special Elite', cursive; }

        .ex-wrap {
          max-width: 720px;
          margin: 0 auto;
          padding: 40px 24px 80px;
        }

        /* TOP BAR */
        .ex-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 32px;
        }

        .btn-back {
          font-family: 'Special Elite', cursive;
          font-size: 14px;
          color: #555;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          transition: color 0.12s;
        }
        .btn-back:hover { color: #111; }

        .ex-timer {
          font-family: 'Caveat', cursive;
          font-size: 22px;
          font-weight: 600;
          color: #111;
          letter-spacing: 1px;
        }

        /* PAPER CARD */
        .paper-card {
          background: #fffef9;
          border: 1.5px solid #d6d0c4;
          border-radius: 3px;
          padding: 36px 40px;
          position: relative;
          box-shadow: 2px 3px 0 #d6d0c4, 4px 6px 0 #ece8de;
        }

        /* red margin line on left like a notebook */
        .paper-card::before {
          content: '';
          position: absolute;
          left: 56px;
          top: 0;
          bottom: 0;
          width: 1px;
          background: rgba(220, 100, 100, 0.2);
        }

        /* ruled lines */
        .paper-card::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: repeating-linear-gradient(
            transparent,
            transparent 31px,
            rgba(180,180,200,0.15) 31px,
            rgba(180,180,200,0.15) 32px
          );
          border-radius: 3px;
          pointer-events: none;
        }

        .paper-content { position: relative; z-index: 1; }

        /* TOPIC LABEL */
        .topic-label {
          font-family: 'Caveat', cursive;
          font-size: 13px;
          font-weight: 600;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 6px;
        }

        /* PASSAGE TITLE */
        .passage-title {
          font-family: 'Special Elite', cursive;
          font-size: 20px;
          color: #111;
          margin-bottom: 24px;
          line-height: 1.3;
          border-bottom: 1px solid #d6d0c4;
          padding-bottom: 16px;
        }

        /* PASSAGE TEXT */
        .passage-text {
          font-family: 'Special Elite', cursive;
          font-size: 16px;
          line-height: 2.1;
          color: #222;
        }

        /* INLINE INPUT */
        .blank-input-wrap {
          display: inline;
        }

        .blank-input {
          font-family: 'Special Elite', cursive;
          font-size: 16px;
          color: #111;
          background: transparent;
          border: none;
          border-bottom: 1.5px solid #aaa;
          outline: none;
          padding: 0 2px;
          margin: 0 2px;
          text-align: center;
          transition: border-color 0.12s;
          vertical-align: baseline;
        }
        .blank-input:focus {
          border-bottom-color: #111;
        }
        .blank-input::placeholder {
          color: #bbb;
          font-family: 'Caveat', cursive;
          font-size: 15px;
        }
        .blank-input:disabled { cursor: default; }

        /* ANSWER RESULT CARDS */
        .results-section {
          margin-top: 32px;
        }

        .results-title {
          font-family: 'Caveat', cursive;
          font-size: 15px;
          font-weight: 600;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 14px;
        }

        .results-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 10px;
        }

        .result-card {
          border-radius: 3px;
          padding: 10px 14px;
          border: 1px solid;
          box-shadow: 1px 2px 0;
        }

        .result-card.correct {
          background: #f0f9f0;
          border-color: #b8ddb8;
          box-shadow-color: #b8ddb8;
          box-shadow: 1px 2px 0 #b8ddb8;
        }

        .result-card.wrong {
          background: #fdf0f0;
          border-color: #e0bbbb;
          box-shadow: 1px 2px 0 #e0bbbb;
        }

        .result-your {
          font-family: 'Special Elite', cursive;
          font-size: 14px;
          color: #333;
          margin-bottom: 3px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .result-correct {
          font-family: 'Caveat', cursive;
          font-size: 13px;
          color: #888;
        }

        .result-correct.show {
          color: #5a8c5a;
          font-weight: 600;
        }

        /* SCORE LINE */
        .score-line {
          font-family: 'Caveat', cursive;
          font-size: 18px;
          font-weight: 600;
          color: #444;
          margin-bottom: 16px;
        }

        /* FOOTER ACTIONS */
        .ex-footer {
          margin-top: 32px;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }

        .btn-check {
          font-family: 'Special Elite', cursive;
          font-size: 14px;
          color: #fff;
          background: #222;
          border: 1.5px solid #111;
          padding: 9px 24px;
          border-radius: 3px;
          cursor: pointer;
          box-shadow: 2px 2px 0 #111;
          transition: all 0.1s;
        }
        .btn-check:hover { transform: translate(-1px, -1px); box-shadow: 3px 3px 0 #111; }
        .btn-check:active { transform: translate(1px, 1px); box-shadow: 1px 1px 0 #111; }

        .btn-next {
          font-family: 'Special Elite', cursive;
          font-size: 14px;
          color: #222;
          background: #fffef9;
          border: 1.5px solid #555;
          padding: 9px 24px;
          border-radius: 3px;
          cursor: pointer;
          box-shadow: 2px 2px 0 #555;
          transition: all 0.1s;
        }
        .btn-next:hover { transform: translate(-1px, -1px); box-shadow: 3px 3px 0 #555; }
        .btn-next:active { transform: translate(1px, 1px); box-shadow: 1px 1px 0 #555; }

        @media (max-width: 560px) {
          .paper-card { padding: 24px 20px; }
          .paper-card::before { left: 36px; }
          .results-grid { grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); }
        }
      `}</style>

      <div className="ex-wrap">
        {/* TOP BAR */}
        <div className="ex-top">
          <button className="btn-back" onClick={() => router.push("/practice")}>
            ← Practice Hub
          </button>
          <span className="ex-timer">{timerStr}</span>
        </div>

        {/* PAPER CARD */}
        <div className="paper-card">
          <div className="paper-content">
            {/* topic + title */}
            <div className="topic-label">{passage?.topic || "General"}</div>
            <div className="passage-title">
              {passage?.text.trim().split(" ").slice(0, 7).join(" ")}…
            </div>

            {/* PASSAGE WITH BLANKS */}
            <div className="passage-text">
              {words.map((w, i) => {
                if (!w.shouldMask) {
                  return (
                    <span key={i}>
                      {i > 0 ? " " : ""}
                      {w.original}
                    </span>
                  );
                }

                const inputWidth = Math.max(60, w.clean.length * 12);
                const status = checked ? (results[i] ? "correct" : "wrong") : "";
                const colorStyle = checked
                  ? {
                      borderBottomColor: results[i] ? "#5a8c5a" : "#c07070",
                      color: results[i] ? "#3a6b3a" : "#b05050",
                    }
                  : {};

                return (
                  <span key={i} className="blank-input-wrap">
                    {i > 0 ? " " : ""}
                    <input
                      ref={(el) => {
                        inputRefs.current[i] = el;
                      }}
                      className="blank-input"
                      style={{ width: inputWidth, ...colorStyle }}
                      type="text"
                      value={answers[i] ?? ""}
                      onChange={(e) => handleInput(i, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, i)}
                      disabled={checked}
                      placeholder={"_".repeat(w.clean.length)}
                      autoComplete="off"
                      autoCorrect="off"
                      spellCheck={false}
                    />
                    {w.punct && <span>{w.punct}</span>}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* ANSWER RESULT CARDS — shown after check */}
        {checked && (
          <div className="results-section">
            <div className="score-line">
              {correctCount} / {maskedWords.length} correct · {timerStr}
            </div>
            <div className="results-grid">
              {maskedWords.map((w, idx) => {
                const globalIdx = words.findIndex(
                  (word, i) =>
                    word.shouldMask && words.slice(0, i).filter((x) => x.shouldMask).length === idx,
                );
                const isCorrect = results[globalIdx];
                const userAnswer = answers[globalIdx]?.trim() || "—";

                return (
                  <div key={idx} className={`result-card ${isCorrect ? "correct" : "wrong"}`}>
                    <div className="result-your">{userAnswer}</div>
                    {!isCorrect && <div className="result-correct show">{w.clean}</div>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* FOOTER ACTIONS */}
        <div className="ex-footer">
          {!checked ? (
            <button className="btn-check" onClick={handleCheck}>
              Check answers
            </button>
          ) : (
            <button className="btn-next" onClick={handleNext}>
              {isLast ? "← Back to Hub" : "Next passage →"}
            </button>
          )}
        </div>
      </div>
    </>
  );
}
