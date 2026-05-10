"use client";

import { useRouter } from "next/navigation";
import Header from "./components/Header";

const FEATURES = [
  {
    icon: "📄",
    title: "TOEFL-Style Passages",
    desc: "Practice with academic passages that mirror the real TOEFL Reading section, covering science, history, biology, economics and more.",
  },
  {
    icon: "⚡",
    title: "Instant Feedback",
    desc: "See exactly which words you got right or wrong the moment you finish. No waiting, no guessing.",
  },
  {
    icon: "📊",
    title: "Track Your Progress",
    desc: "Your dashboard tracks accuracy, streaks, time spent, and which words you keep missing. so you always know what to work on next.",
  },
];

const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Choose a passage",
    desc: "Pick from TOEFL-style academic reading passages across different topics and subjects.",
  },
  {
    step: "2",
    title: "Fill in the blanks",
    desc: "Read the passage and type the missing letters of key vocabulary words as you go.",
  },
  {
    step: "3",
    title: "Get instant results",
    desc: "See your score, time, and exactly which words you missed, then move to the next passage.",
  },
];

export default function Home() {
  const router = useRouter();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Special+Elite&family=Caveat:wght@400;600&family=Inter:wght@400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #f5f2eb;
          color: #1a1a1a;
          font-family: 'Special Elite', cursive;
          -webkit-font-smoothing: antialiased;
        }

        /* HERO */
        .hero {
          max-width: 830px;
          margin: 0 auto;
          padding: 0 24px;
          text-align: center;
          min-height: calc(100vh - 60px);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .hero-eyebrow {
          display: inline-block;
          font-family: 'Caveat', cursive;
          font-size: 18px;
          font-weight: 600;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 24px;
        }

        .hero h1 {
          font-family: 'Special Elite', cursive;
          font-size: clamp(32px, 5vw, 54px);
          line-height: 1.15;
          letter-spacing: -1px;
          color: #111;
          margin-bottom: 20px;
        }

        .hero h1 span {
          position: relative;
          display: inline-block;
        }

        .hero h1 span::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0; right: 0;
          height: 3px;
          background: #888;
          border-radius: 2px;
          opacity: 0.4;
        }

        .hero-sub {
          font-family: 'Special Elite', cursive;
          font-size: 18px;
          color: #555;
          line-height: 1.8;
          margin-bottom: 40px;
        }

        .btn-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'Special Elite', cursive;
          font-size: 16px;
          color: #fff;
          background: #222;
          border: 1.5px solid #111;
          padding: 13px 34px;
          border-radius: 3px;
          cursor: pointer;
          box-shadow: 3px 3px 0 #111;
          transition: all 0.1s;
        }
        .btn-cta:hover  { transform: translate(-1px,-1px); box-shadow: 4px 4px 0 #111; }
        .btn-cta:active { transform: translate(1px,1px);   box-shadow: 2px 2px 0 #111; }

        .hero-note {
          margin-top: 16px;
          font-family: 'Special Elite', cursive;
          font-size: 14px;
          color: #aaa;
        }

        /* DIVIDER */
        .divider-full {
          border: none;
          border-top: 1px solid #d6d0c4;
        }

        /* SECTION SHARED */
        .section-eyebrow {
          font-family: 'Caveat', cursive;
          font-size: 18px;
          font-weight: 600;
          color: #aaa;
          text-transform: uppercase;
          letter-spacing: 2px;
          text-align: center;
          margin-bottom: 10px;
        }

        .section-title {
          font-family: 'Special Elite', cursive;
          font-size: clamp(24px, 3vw, 32px);
          color: #111;
          text-align: center;
          margin-bottom: 12px;
          letter-spacing: -0.3px;
        }

        .section-sub {
          font-family: 'Special Elite', cursive;
          font-size: 16px;
          color: #888;
          text-align: center;
          margin-bottom: 48px;
          line-height: 1.7;
        }

        /* FEATURES */
        .features {
          max-width: 880px;
          margin: 0 auto;
          padding: 80px 24px;
        }

        .feat-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0;
        }

        .feat-card {
          background: #fffef9;
          border: 1.5px solid #d6d0c4;
          border-right: none;
          padding: 32px 28px;
          position: relative;
          transition: background 0.12s;
        }

        .feat-card:last-child { border-right: 1.5px solid #d6d0c4; box-shadow: 2px 3px 0 #d6d0c4, 4px 6px 0 #ece8de; }
        .feat-card:first-child { border-radius: 3px 0 0 3px; }
        .feat-card:last-child  { border-radius: 0 3px 3px 0; }
        .feat-card:hover { background: #fffcf3; }

        .feat-card::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: repeating-linear-gradient(
            transparent, transparent 27px,
            rgba(180,180,200,0.12) 27px, rgba(180,180,200,0.12) 28px
          );
          pointer-events: none;
          border-radius: inherit;
        }

        .feat-inner { position: relative; z-index: 1; }
        .feat-ico { font-size: 24px; margin-bottom: 14px; display: block; }
        .feat-title { font-family: 'Special Elite', cursive; font-size: 17px; color: #111; margin-bottom: 10px; }
        .feat-desc { font-family: 'Special Elite', cursive; font-size: 15px; color: #666; line-height: 1.7; }

        /* HOW IT WORKS */
        .how-wrap {
          background: #fffef9;
          border-top: 1px solid #d6d0c4;
          border-bottom: 1px solid #d6d0c4;
        }

        .how-inner {
          max-width: 880px;
          margin: 0 auto;
          padding: 80px 24px;
        }

        .how-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0;
        }

        .how-card {
          padding: 32px 28px;
          border-right: 1px solid #d6d0c4;
          position: relative;
        }

        .how-card:last-child { border-right: none; }

        .how-step {
          font-family: 'Caveat', cursive;
          font-size: 42px;
          font-weight: 600;
          color: #d6d0c4;
          line-height: 1;
          margin-bottom: 12px;
        }

        .how-title {
          font-family: 'Special Elite', cursive;
          font-size: 17px;
          color: #111;
          margin-bottom: 10px;
        }

        .how-desc {
          font-family: 'Special Elite', cursive;
          font-size: 15px;
          color: #666;
          line-height: 1.7;
        }

        /* BOTTOM CTA */
        .bottom-cta {
          padding: 88px 24px;
          text-align: center;
          max-width: 560px;
          margin: 0 auto;
        }

        .bottom-cta h2 {
          font-family: 'Special Elite', cursive;
          font-size: clamp(26px, 3.5vw, 36px);
          color: #111;
          letter-spacing: -0.5px;
          line-height: 1.25;
          margin-bottom: 14px;
        }

        .bottom-cta p {
          font-family: 'Special Elite', cursive;
          font-size: 17px;
          color: #777;
          line-height: 1.7;
          margin-bottom: 32px;
        }

        /* FOOTER */
        footer {
          border-top: 1px solid #d6d0c4;
          padding: 24px 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        }

        .footer-logo {
          font-family: 'Special Elite', cursive;
          font-size: 20px;
          color: #111;
          letter-spacing: -0.3px;
        }

        .footer-links {
          display: flex;
          gap: 20px;
          align-items: center;
        }

        .footer-link {
          font-family: 'Special Elite', cursive;
          font-size: 14px;
          color: #888;
          text-decoration: none;
          transition: color 0.12s;
        }
        .footer-link:hover { color: #333; }

        .footer-copy {
          font-family: 'Special Elite', cursive;
          font-size: 14px;
          color: #aaa;
        }

        @media (max-width: 700px) {
          .feat-grid { grid-template-columns: 1fr; }
          .feat-card { border-right: 1.5px solid #d6d0c4; border-bottom: none; border-radius: 0; }
          .feat-card:first-child { border-radius: 3px 3px 0 0; }
          .feat-card:last-child { border-bottom: 1.5px solid #d6d0c4; border-radius: 0 0 3px 3px; box-shadow: 2px 3px 0 #d6d0c4, 4px 6px 0 #ece8de; }
          .how-grid { grid-template-columns: 1fr; }
          .how-card { border-right: none; border-bottom: 1px solid #d6d0c4; }
          .how-card:last-child { border-bottom: none; }
          footer { flex-direction: column; text-align: center; padding: 20px; }
        }
      `}</style>

      <Header />

      {/* HERO */}
      <section className="hero">
        <span className="hero-eyebrow">Free TOEFL Reading Practice</span>
        <h1>
          Improve Your TOEFL Score <span>Word by Word</span>
        </h1>
        <p className="hero-sub">
          Fill in the missing letters of key vocabulary words inside real academic passages.
          <br />
          Practice daily and build the reading skills you need for the TOEFL exam.
        </p>
        <button className="btn-cta" onClick={() => router.push("/practice/sample")}>
          Start Practicing
        </button>
      </section>

      <hr className="divider-full" />

      {/* FEATURES */}
      <section className="features" id="features">
        <p className="section-eyebrow">Features</p>
        <h2 className="section-title">Everything you need to prepare for TOEFL Reading</h2>
        <p className="section-sub">
          Practice daily with real academic vocabulary in context, the most effective way to
          prepare.
        </p>
        <div className="feat-grid">
          {FEATURES.map((f) => (
            <div className="feat-card" key={f.title}>
              <div className="feat-inner">
                <span className="feat-ico">{f.icon}</span>
                <div className="feat-title">{f.title}</div>
                <p className="feat-desc">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="divider-full" />

      {/* HOW IT WORKS */}
      <section className="how-wrap">
        <div className="how-inner">
          <p className="section-eyebrow">How it works</p>
          <h2 className="section-title">Simple, focused TOEFL vocabulary practice</h2>
          <p className="section-sub">Three steps to better TOEFL reading comprehension.</p>
          <div className="how-grid">
            {HOW_IT_WORKS.map((h) => (
              <div className="how-card" key={h.step}>
                <div className="how-step">{h.step}</div>
                <div className="how-title">{h.title}</div>
                <p className="how-desc">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="bottom-cta">
        <h2>Ready to improve your TOEFL reading score?</h2>
        <p>
          Start building your academic vocabulary today with real TOEFL-style passages and instant
          feedback. <br />
          Completely free.
        </p>
        <button className="btn-cta" onClick={() => router.push("/practice/sample")}>
          Try it now. It's free.
        </button>
      </section>

      <hr className="divider-full" />

      <footer>
        <div className="footer-logo">Lexivo</div>
        <div className="footer-links">
          <a href="/terms" className="footer-link">
            Terms
          </a>
          <a href="/privacy" className="footer-link">
            Privacy
          </a>
          <a href="mailto:support@lexivo.io?subject=Lexivo Feedback" className="footer-link">
            Feedback
          </a>
        </div>
        <div className="footer-copy">© {new Date().getFullYear()} Lexivo</div>
      </footer>
    </>
  );
}
