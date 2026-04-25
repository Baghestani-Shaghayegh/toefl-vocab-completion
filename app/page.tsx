'use client'

import { useRouter } from 'next/navigation'
import Header from './components/Header'

const FREE_FEATURES = [
  '5 practice passages per day',
  'Timer mode — real exam countdown',
  'Accuracy & progress tracking',
  'Most-missed words report',
  'Correct answers after each session',
]

const PRO_FEATURES = [
  'Unlimited daily practices',
  'AI-generated passages adaptive to your level',
  'AI explanations for every wrong answer',
  'Full performance history',
  'Priority support',
]

const FEATURES = [
  {
    icon: '📄',
    title: 'TOEFL-Style Content',
    desc: 'Practice with passages that mirror the actual TOEFL Reading test format and difficulty level.',
  },
  {
    icon: '⚡',
    title: 'Instant Feedback',
    desc: 'Get immediate results and explanations to understand your mistakes and improve faster.',
  },
  {
    icon: '📚',
    title: 'Build Vocabulary',
    desc: 'Expand your academic vocabulary through contextual learning in authentic reading passages.',
  },
]

export default function Home() {
  const router = useRouter()

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

        /* ── HERO ── */
        .hero {
          max-width: 680px;
          margin: 0 auto;
          padding: 96px 24px 88px;
          text-align: center;
        }

        .hero-eyebrow {
          display: inline-block;
          font-family: 'Caveat', cursive;
          font-size: 13px;
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

        /* hand-drawn underline effect */
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
          font-size: 16px;
          color: #666;
          line-height: 1.8;
          margin-bottom: 40px;
        }

        .btn-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'Special Elite', cursive;
          font-size: 15px;
          color: #fff;
          background: #222;
          border: 1.5px solid #111;
          padding: 12px 32px;
          border-radius: 3px;
          cursor: pointer;
          box-shadow: 3px 3px 0 #111;
          transition: all 0.1s;
        }
        .btn-cta:hover  { transform: translate(-1px,-1px); box-shadow: 4px 4px 0 #111; }
        .btn-cta:active { transform: translate(1px,1px);   box-shadow: 2px 2px 0 #111; }

        .hero-note {
          margin-top: 16px;
          font-family: 'Caveat', cursive;
          font-size: 14px;
          color: #aaa;
        }

        /* ── DIVIDER ── */
        .divider {
          border: none;
          border-top: 1px solid #d6d0c4;
          max-width: 720px;
          margin: 0 auto;
        }

        .divider-full {
          border: none;
          border-top: 1px solid #d6d0c4;
        }

        /* ── FEATURES ── */
        .features {
          max-width: 760px;
          margin: 0 auto;
          padding: 80px 24px;
        }

        .section-eyebrow {
          font-family: 'Caveat', cursive;
          font-size: 13px;
          font-weight: 600;
          color: #aaa;
          text-transform: uppercase;
          letter-spacing: 2px;
          text-align: center;
          margin-bottom: 10px;
        }

        .section-title {
          font-family: 'Special Elite', cursive;
          font-size: clamp(22px, 3vw, 30px);
          color: #111;
          text-align: center;
          margin-bottom: 48px;
          letter-spacing: -0.3px;
        }

        .feat-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0;
        }

        /* paper-stacked feature cards */
        .feat-card {
          background: #fffef9;
          border: 1.5px solid #d6d0c4;
          border-right: none;
          padding: 28px 24px;
          position: relative;
          transition: background 0.12s;
        }

        .feat-card:last-child { border-right: 1.5px solid #d6d0c4; }
        .feat-card:first-child { border-radius: 3px 0 0 3px; }
        .feat-card:last-child  { border-radius: 0 3px 3px 0; }

        .feat-card:hover { background: #fffcf3; }

        /* ruled lines on feature cards */
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

        .feat-ico {
          font-size: 22px;
          margin-bottom: 12px;
          display: block;
        }

        .feat-title {
          font-family: 'Special Elite', cursive;
          font-size: 15px;
          color: #111;
          margin-bottom: 8px;
        }

        .feat-desc {
          font-family: 'Special Elite', cursive;
          font-size: 13px;
          color: #666;
          line-height: 1.7;
        }

        /* ── PRICING ── */
        .pricing-wrap {
          padding: 80px 24px;
        }

        .pricing-inner {
          max-width: 720px;
          margin: 0 auto;
        }

        .plans {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          margin-top: 48px;
        }

        .plan {
          background: #fffef9;
          border: 1.5px solid #d6d0c4;
          border-right: none;
          padding: 32px 28px;
          position: relative;
        }

        .plan:last-child {
          border-right: 1.5px solid #d6d0c4;
          box-shadow: 3px 4px 0 #d6d0c4, 5px 7px 0 #ece8de;
        }

        .plan:first-child { border-radius: 3px 0 0 3px; }
        .plan:last-child  { border-radius: 0 3px 3px 0; }

        /* ruled lines */
        .plan::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: repeating-linear-gradient(
            transparent, transparent 31px,
            rgba(180,180,200,0.12) 31px, rgba(180,180,200,0.12) 32px
          );
          pointer-events: none;
          border-radius: inherit;
        }

        .plan-inner { position: relative; z-index: 1; }

        .plan-badge {
          display: inline-block;
          font-family: 'Caveat', cursive;
          font-size: 12px;
          font-weight: 600;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin-bottom: 12px;
        }

        .plan-badge.highlight { color: #5a8c5a; }

        .plan-price {
          font-family: 'Special Elite', cursive;
          font-size: 40px;
          color: #111;
          letter-spacing: -1px;
          line-height: 1;
          margin-bottom: 4px;
        }

        .plan-price sub {
          font-family: 'Caveat', cursive;
          font-size: 14px;
          color: #aaa;
          vertical-align: baseline;
          letter-spacing: 0;
        }

        .plan-tagline {
          font-family: 'Special Elite', cursive;
          font-size: 13px;
          color: #777;
          line-height: 1.6;
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid #d6d0c4;
        }

        .plan-list { list-style: none; display: flex; flex-direction: column; gap: 9px; }

        .plan-item {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-family: 'Special Elite', cursive;
          font-size: 13px;
          color: #444;
          line-height: 1.4;
        }

        .chk {
          font-family: 'Caveat', cursive;
          font-size: 14px;
          font-weight: 600;
          color: #6a9e6a;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .plan-btn {
          display: block;
          width: 100%;
          margin-top: 24px;
          padding: 10px;
          border-radius: 2px;
          font-family: 'Special Elite', cursive;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.1s;
          text-align: center;
        }

        .plan-btn-outline {
          background: none;
          border: 1.5px solid #aaa;
          color: #555;
          box-shadow: 2px 2px 0 #ccc;
        }
        .plan-btn-outline:hover { transform: translate(-1px,-1px); box-shadow: 3px 3px 0 #ccc; }

        .plan-btn-filled {
          background: #222;
          border: 1.5px solid #111;
          color: #fff;
          box-shadow: 2px 2px 0 #111;
        }
        .plan-btn-filled:hover { transform: translate(-1px,-1px); box-shadow: 3px 3px 0 #111; }

        /* ── BOTTOM CTA ── */
        .bottom-cta {
          padding: 88px 24px;
          text-align: center;
          max-width: 560px;
          margin: 0 auto;
        }

        .bottom-cta h2 {
          font-family: 'Special Elite', cursive;
          font-size: clamp(24px, 3.5vw, 34px);
          color: #111;
          letter-spacing: -0.5px;
          line-height: 1.25;
          margin-bottom: 14px;
        }

        .bottom-cta p {
          font-family: 'Special Elite', cursive;
          font-size: 15px;
          color: #777;
          line-height: 1.7;
          margin-bottom: 32px;
        }

        /* ── FOOTER ── */
        footer {
          border-top: 1px solid #d6d0c4;
          padding: 24px 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

.footer-logo {
  font-family: 'Special Elite', cursive;
  font-size: 20px;
  color: #111;
  letter-spacing: -0.3px;
}

.footer-copy {
  font-family: 'Special Elite', cursive;
  font-size: 15px;
  color: #666;
}

        @media (max-width: 700px) {
          .feat-grid { grid-template-columns: 1fr; }
          .feat-card { border-right: 1.5px solid #d6d0c4; border-bottom: none; border-radius: 0; }
          .feat-card:first-child { border-radius: 3px 3px 0 0; }
          .feat-card:last-child  { border-bottom: 1.5px solid #d6d0c4; border-radius: 0 0 3px 3px; box-shadow: 2px 3px 0 #d6d0c4, 4px 6px 0 #ece8de; }
          .plans { grid-template-columns: 1fr; }
          .plan { border-right: 1.5px solid #d6d0c4; border-bottom: none; border-radius: 0; }
          .plan:first-child { border-radius: 3px 3px 0 0; }
          .plan:last-child  { border-bottom: 1.5px solid #d6d0c4; border-radius: 0 0 3px 3px; }
          footer { flex-direction: column; gap: 8px; text-align: center; padding: 20px; }
        }
      `}</style>

      <Header />

      {/* HERO */}
      <section className="hero">
        <span className="hero-eyebrow">TOEFL Reading Practice</span>
        <h1>Master TOEFL Reading <span>Word by Word</span></h1>
        <p className="hero-sub">
          Practice fill-in-the-blank exercises with real TOEFL-style passages. Build vocabulary and improve your reading comprehension skills.
        </p>
        <button className="btn-cta" onClick={() => router.push('/practice/sample')}>
          Start Practicing Now
        </button>
        <p className="hero-note">Free to start · No credit card required</p>
      </section>

      <hr className="divider-full" />

      {/* FEATURES */}
      <section className="features" id="features">
        <p className="section-eyebrow">Features</p>
        <h2 className="section-title">Everything you need to improve</h2>
        <div className="feat-grid">
          {FEATURES.map(f => (
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

      {/* PRICING */}
      <section className="pricing-wrap" id="pricing">
        <div className="pricing-inner">
          <p className="section-eyebrow">Pricing</p>
          <h2 className="section-title">Start free. Upgrade when you're ready.</h2>
          <div className="plans">
            <div className="plan">
              <div className="plan-inner">
                <span className="plan-badge">Free</span>
                <p className="plan-price">$0 <sub>/ forever</sub></p>
                <p className="plan-tagline">Everything you need to build a daily practice habit.</p>
                <ul className="plan-list">
                  {FREE_FEATURES.map(f => (
                    <li key={f} className="plan-item"><span className="chk">✓</span>{f}</li>
                  ))}
                </ul>
                <button className="plan-btn plan-btn-outline" onClick={() => router.push('/practice/sample')}>
                  Get started free
                </button>
              </div>
            </div>
            <div className="plan">
              <div className="plan-inner">
                <span className="plan-badge highlight">Pro</span>
                <p className="plan-price">$9 <sub>/ month</sub></p>
                <p className="plan-tagline">For serious test-takers who need unlimited practice and AI-powered feedback.</p>
                <ul className="plan-list">
                  {PRO_FEATURES.map(f => (
                    <li key={f} className="plan-item"><span className="chk">✓</span>{f}</li>
                  ))}
                </ul>
                <button className="plan-btn plan-btn-filled" onClick={() => router.push('/signup')}>
                  Start free trial
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="divider-full" />

      {/* BOTTOM CTA */}
      <section className="bottom-cta">
        <h2>Ready to Ace Your TOEFL Reading?</h2>
        <p>Join thousands of students improving their TOEFL scores through targeted practice.</p>
        <button className="btn-cta" onClick={() => router.push('/practice/sample')}>
          Get Started Free
        </button>
      </section>

      <hr className="divider-full" />

      <footer>
        <div className="footer-logo">Lexivo</div>
<div className="footer-copy">© {new Date().getFullYear()} Lexivo · Built for TOEFL test takers</div>
      </footer>
    </>
  )
}