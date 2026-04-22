"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

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

function getExcerpt(text: string): string {
  return text.length > 110 ? text.slice(0, 110) + "…" : text;
}

export default function PracticePage() {
  const router = useRouter();
  const [passages, setPassages] = useState<Passage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data, error } = await supabase.from("passages").select("id, text, topic, difficulty");

      console.log("passages data:", data, "error:", error);

      if (error) {
        setError(error.message);
      } else {
        setPassages(data ?? []);
      }
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
          max-width: 720px;
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
          font-family: 'Caveat', cursive;
          font-size: 15px;
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
          font-size: 13px;
          color: #777;
          background: none;
          border: 1px solid #d6d0c4;
          padding: 4px 14px;
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
          padding: 20px 28px 20px 28px;
          display: flex;
          align-items: center;
          gap: 20px;
          position: relative;
          transition: background 0.12s;
        }

        /* ruled line at bottom of each card */
        .passage-card::after {
          content: '';
          position: absolute;
          bottom: 0; left: 28px; right: 28px;
          height: 1px;
          background: rgba(180,180,200,0.25);
          pointer-events: none;
        }

        /* red margin line */
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

        /* left: number */
        .card-num {
          font-family: 'Caveat', cursive;
          font-size: 15px;
          font-weight: 600;
          color: #ccc;
          width: 22px;
          flex-shrink: 0;
          text-align: center;
        }

        /* middle */
        .card-body { flex: 1; min-width: 0; }

        .card-meta {
          display: flex;
          align-items: center;
          gap: 7px;
          margin-bottom: 5px;
        }

        .card-topic {
          font-family: 'Caveat', cursive;
          font-size: 12px;
          font-weight: 600;
          color: #999;
          text-transform: uppercase;
          letter-spacing: 1.5px;
        }

        .card-dot {
          width: 3px; height: 3px;
          border-radius: 50%;
          background: #ccc;
          flex-shrink: 0;
        }

        .card-diff {
          font-family: 'Caveat', cursive;
          font-size: 12px;
          color: #bbb;
        }

        .card-excerpt {
          font-family: 'Special Elite', cursive;
          font-size: 14px;
          color: #444;
          line-height: 1.6;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* right: start btn */
        .card-action { flex-shrink: 0; }

        .btn-start {
          font-family: 'Special Elite', cursive;
          font-size: 13px;
          color: #222;
          background: #fffef9;
          border: 1.5px solid #888;
          padding: 6px 16px;
          border-radius: 2px;
          cursor: pointer;
          box-shadow: 2px 2px 0 #aaa;
          transition: all 0.1s;
          white-space: nowrap;
        }
        .btn-start:hover  { transform: translate(-1px,-1px); box-shadow: 3px 3px 0 #aaa; }
        .btn-start:active { transform: translate(1px,1px); box-shadow: 1px 1px 0 #aaa; }

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
          font-family: 'Caveat', cursive;
          font-size: 15px; color: #aaa;
        }

        .state-error {
          font-family: 'Special Elite', cursive;
          font-size: 13px; color: #c07070; margin-top: 8px;
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

      <div className="hub-wrap">
        <div className="hub-header">
          <h1 className="hub-title">Practice Hub</h1>
          <p className="hub-sub">Choose a passage and fill in the blanks.</p>
        </div>

        {/* FILTER TABS */}
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
            <p className="state-title">Could not load passages</p>
            <p className="state-error">{error}</p>
          </div>
        )}

        {/* EMPTY */}
        {!loading && !error && filtered.length === 0 && (
          <div className="state-center">
            <p className="state-title">No passages found</p>
            <p className="state-sub">
              {filter !== "all"
                ? `Nothing in "${filter}" yet.`
                : "No passages in the database yet."}
            </p>
          </div>
        )}

        {/* CARDS */}
        {!loading && !error && filtered.length > 0 && (
          <div className="cards-list">
            {filtered.map((passage, i) => (
              <div className="passage-card" key={passage.id}>
                <div className="card-num">{i + 1}</div>
                <div className="card-body">
                  <div className="card-meta">
                    <span className="card-topic">{passage.topic || "General"}</span>
                    <span className="card-dot" />
                    <span className="card-diff">
                      {DIFFICULTY_LABEL[passage.difficulty] ?? "Easy"}
                    </span>
                  </div>
                  <div className="card-excerpt">{getExcerpt(passage.text)}</div>
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
            ))}
          </div>
        )}
      </div>
    </>
  );
}
