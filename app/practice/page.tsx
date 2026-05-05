"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Header from "../components/Header";

type Passage = {
  id: string;
  text: string;
  topic: string;
  difficulty: number;
};

const DIFFICULTY_LABEL: Record<number, string> = {
  1: "Easy",
  2: "Medium",
  3: "Hard",
};

export default function PracticePage() {
  const router = useRouter();
  const [passages, setPassages] = useState<Passage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<string>('all')
  const [completed, setCompleted] = useState<Set<string>>(new Set())

useEffect(() => {
  async function loadCompleted() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from('sessions')
      .select('passage_id')
      .eq('user_id', user.id)
    if (data) setCompleted(new Set(data.map((s: any) => s.passage_id)))
  }

  loadCompleted()

  window.addEventListener('focus', loadCompleted)
  return () => window.removeEventListener('focus', loadCompleted)
}, [])

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data, error } = await supabase.from("passages").select("id, text, topic, difficulty");
      if (error) setError(error.message)
      else setPassages(data ?? [])
      setLoading(false);
    }
    load();
  }, []);

  const topics = [
    "all",
    ...Array.from(new Set(passages.map((p) => p.topic?.toLowerCase()).filter(Boolean))),
  ];
  const filtered =
    filter === "all" ? passages : passages.filter((p) => p.topic?.toLowerCase() === filter);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Special+Elite&family=Caveat:wght@400;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f5f2eb; font-family: 'Special Elite', cursive; }

.hub-wrap {
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  padding: 48px 24px 80px;
}

        .hub-header { margin-bottom: 32px; }

        .hub-title {
          font-family: 'Special Elite', cursive;
          font-size: 26px;
          color: #111;
          letter-spacing: -0.3px;
          margin-bottom: 6px;
        }

        .hub-sub {
          font-family: 'Special Elite', cursive;
          font-size: 16px;
          color: #888;
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
          font-family: 'Special Elite', cursive;
          font-size: 14px;
          color: #777;
          background: none;
          border: 1px solid #d6d0c4;
          padding: 5px 16px;
          border-radius: 2px;
          cursor: pointer;
          transition: all 0.12s;
          text-transform: capitalize;
        }
        .filter-btn:hover { border-color: #999; color: #333; }
        .filter-btn.active {
          background: #222;
          border-color: #222;
          color: #fffef9;
        }

        /* STACKED PAPER CARDS */
        .cards-list {
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .passage-card {
          background: #fffef9;
          border: 1.5px solid #d6d0c4;
          border-bottom: none;
          padding: 22px 36px;
          display: flex;
          align-items: center;
          gap: 24px;
          position: relative;
          transition: background 0.12s;
        }

        .passage-card::after {
          content: '';
          position: absolute;
          bottom: 0; left: 28px; right: 28px;
          height: 1px;
          background: rgba(180,180,200,0.25);
          pointer-events: none;
        }

        .passage-card::before {
          content: '';
          position: absolute;
          left: 52px; top: 0; bottom: 0;
          width: 1px;
          background: rgba(220,100,100,0.15);
          pointer-events: none;
        }

        .passage-card:first-child { border-radius: 3px 3px 0 0; }
        .passage-card:last-child {
          border-bottom: 1.5px solid #d6d0c4;
          border-radius: 0 0 3px 3px;
          box-shadow: 2px 3px 0 #d6d0c4, 4px 6px 0 #ece8de;
        }
        .passage-card:only-child {
          border-bottom: 1.5px solid #d6d0c4;
          border-radius: 3px;
          box-shadow: 2px 3px 0 #d6d0c4, 4px 6px 0 #ece8de;
        }
        .passage-card:hover { background: #fffcf3; }

        .card-num {
          font-family: 'Special Elite', cursive;
          font-size: 16px;
          color: #aaa;
          width: 28px;
          flex-shrink: 0;
          text-align: center;
        }

        .card-body { flex: 1; min-width: 0; }

        .card-meta {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .card-topic {
          font-family: 'Special Elite', cursive;
          font-size: 16px;
          color: #2a2a2a;
        }

        .diff-easy   { font-family: 'Special Elite', cursive; font-size: 14px; color: #6a9e6a; }
        .diff-medium { font-family: 'Special Elite', cursive; font-size: 14px; color: #b8924a; }
        .diff-hard   { font-family: 'Special Elite', cursive; font-size: 14px; color: #b06060; }

        .card-action { flex-shrink: 0; }

        .btn-start {
          min-width: 90px;
          font-family: 'Special Elite', cursive;
          font-size: 14px;
          border: 1.5px solid;
          padding: 7px 18px;
          border-radius: 2px;
          cursor: pointer;
          transition: all 0.1s;
          white-space: nowrap;
        }
        .btn-start:hover  { transform: translate(-1px,-1px); }
        .btn-start:active { transform: translate(1px,1px); }

        .btn-go {
          color: #fff;
          background: #222;
          border-color: #111;
          box-shadow: 2px 2px 0 #111;
        }
        .btn-go:hover  { box-shadow: 3px 3px 0 #111; }
        .btn-go:active { box-shadow: 1px 1px 0 #111; }

        .btn-done {
          color: #999;
          background: #f5f2eb;
          border-color: #ccc;
          box-shadow: 1px 1px 0 #ccc;
          cursor: pointer;
        }
        .btn-done:hover  { box-shadow: 1px 1px 0 #ccc; transform: none; }
        .btn-done:active { box-shadow: 1px 1px 0 #ccc; transform: none; }

        /* STATES */
        .state-center {
          text-align: center;
          padding: 80px 0;
        }

        .state-title {
          font-family: 'Special Elite', cursive;
          font-size: 18px; color: #555; margin-bottom: 8px;
        }

        .state-sub {
          font-family: 'Special Elite', cursive;
          font-size: 15px; color: #aaa;
        }

        .state-error {
          font-family: 'Special Elite', cursive;
          font-size: 14px; color: #c07070; margin-top: 8px;
        }

        .spinner {
          width: 24px; height: 24px;
          border: 2px solid #d6d0c4;
          border-top-color: #555;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto 14px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }


        @media (max-width: 560px) {
          .hub-wrap { padding: 32px 16px 60px; }
          .passage-card { flex-wrap: wrap; gap: 10px; padding: 16px 20px; }
          .card-num { display: none; }
          .card-action { width: 100%; }
          .btn-start { width: 100%; text-align: center; }
        }
      `}</style>

      <Header />

      <div className="hub-wrap">
        <div className="hub-header">
          <h1 className="hub-title">Practice Hub</h1>
          <p className="hub-sub">Choose a passage and fill in the blanks.</p>
        </div>

        {!loading && passages.length > 0 && (
          <div className="filter-row">
            {topics.map((t) => (
              <button
                key={t}
                className={`filter-btn${filter === t ? " active" : ""}`}
                onClick={() => setFilter(t)}
              >
                {t === "all" ? "All" : t}
              </button>
            ))}
          </div>
        )}

        {loading && (
          <div className="state-center">
            <div className="spinner" />
            <p className="state-sub">Loading passages…</p>
          </div>
        )}

        {!loading && error && (
          <div className="state-center">
            <p className="state-title">Could not load passages</p>
            <p className="state-error">{error}</p>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="state-center">
            <p className="state-title">No passages found</p>
            <p className="state-sub">
              {filter !== "all" ? `Nothing in "${filter}" yet.` : "No passages in the database yet."}
            </p>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="cards-list">
            {filtered.map((passage, i) => (
              <div className="passage-card" key={passage.id}>
                <div className="card-num">{i + 1}</div>
                <div className="card-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <div className="card-meta">
                    <span className={`diff-${(DIFFICULTY_LABEL[passage.difficulty] ?? 'Easy').toLowerCase()}`}>
                      {DIFFICULTY_LABEL[passage.difficulty] ?? 'Easy'}
                    </span>
                    <span className="card-topic">{passage.topic || 'General'}</span>
                  </div>
                  <div className="card-action">
                    <button
                      className={`btn-start${completed.has(passage.id) ? ' btn-done' : ' btn-go'}`}
                      onClick={() => router.push(`/practice/${passage.id}`)}
                    >
                      {completed.has(passage.id) ? 'Done' : 'Start →'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}