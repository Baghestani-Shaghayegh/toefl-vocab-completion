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
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        /* ...existing code... */

        body {
          background: #ffffff;
          color: #111827;
          font-family: 'Inter', sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        /* HERO */
        .hero {
          padding: 100px 24px 96px;
          text-align: center;
          max-width: 680px;
          margin: 0 auto;
        }

        .hero-eyebrow {
          display: inline-block;
          font-size: 13px;
          font-weight: 600;
          color: #2563eb;
          background: #eff6ff;
          border: 1px solid #dbeafe;
          padding: 4px 12px;
          border-radius: 99px;
          margin-bottom: 28px;
          letter-spacing: 0.2px;
        }

        .hero h1 {
          font-size: clamp(32px, 5vw, 52px);
          font-weight: 700;
          line-height: 1.15;
          letter-spacing: -1.5px;
          color: #111827;
          margin-bottom: 20px;
        }

        .hero h1 span { color: #2563eb; }

        .hero-sub {
          font-size: 17px;
          color: #6b7280;
          line-height: 1.7;
          margin-bottom: 36px;
          font-weight: 400;
        }

        .btn-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #2563eb;
          border: none;
          color: #fff;
          padding: 15px 32px;
          border-radius: 10px;
          font-family: 'Inter', sans-serif;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(37,99,235,0.3);
          transition: all 0.15s;
        }
        .btn-cta:hover { background: #1d4ed8; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(37,99,235,0.35); }

        .hero-note {
          margin-top: 16px;
          font-size: 13px;
          color: #9ca3af;
        }

        /* DIVIDER */
        .divider { border: none; border-top: 1px solid #f3f4f6; }

        /* FEATURES */
        .features {
          max-width: 960px;
          margin: 0 auto;
          padding: 88px 24px;
        }

        .section-header {
          text-align: center;
          margin-bottom: 56px;
        }

        .section-label {
          font-size: 13px;
          font-weight: 600;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin-bottom: 10px;
        }

        .section-title {
          font-size: clamp(24px, 3vw, 32px);
          font-weight: 700;
          color: #111827;
          letter-spacing: -0.5px;
          line-height: 1.25;
        }

        .feat-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .feat-card {
          padding: 32px 28px;
          border: 1px solid #f3f4f6;
          border-radius: 14px;
          background: #fafafa;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .feat-card:hover { border-color: #e5e7eb; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }

        .feat-ico {
          font-size: 24px;
          margin-bottom: 16px;
          display: block;
        }

        .feat-title {
          font-size: 15px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 8px;
          letter-spacing: -0.2px;
        }

        .feat-desc {
          font-size: 14px;
          color: #6b7280;
          line-height: 1.65;
        }

        /* PRICING */
        .pricing-wrap {
          background: #f9fafb;
          border-top: 1px solid #f3f4f6;
          border-bottom: 1px solid #f3f4f6;
          padding: 88px 24px;
        }

        .pricing-inner { max-width: 720px; margin: 0 auto; }

        .plans {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-top: 48px;
        }

        .plan {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          padding: 32px;
        }

        .plan.featured {
          border-color: #2563eb;
          border-width: 2px;
          position: relative;
        }

        .plan-badge {
          position: absolute;
          top: -13px;
          left: 50%;
          transform: translateX(-50%);
          background: #2563eb;
          color: #fff;
          font-size: 11px;
          font-weight: 600;
          padding: 3px 12px;
          border-radius: 99px;
          white-space: nowrap;
        }

        .plan-tier {
          font-size: 12px;
          font-weight: 600;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          margin-bottom: 8px;
        }

        .plan-price {
          font-size: 38px;
          font-weight: 700;
          color: #111827;
          letter-spacing: -1px;
          line-height: 1;
          margin-bottom: 6px;
        }

        .plan-price sub {
          font-size: 14px;
          font-weight: 400;
          color: #9ca3af;
          vertical-align: baseline;
          letter-spacing: 0;
        }

        .plan-tagline {
          font-size: 13px;
          color: #6b7280;
          line-height: 1.55;
          margin-bottom: 24px;
          padding-bottom: 24px;
          border-bottom: 1px solid #f3f4f6;
        }

        .plan-list { list-style: none; display: flex; flex-direction: column; gap: 10px; }

        .plan-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 13px;
          color: #374151;
          line-height: 1.4;
        }

        .chk {
          width: 16px; height: 16px;
          border-radius: 50%;
          background: #dcfce7;
          display: flex; align-items: center; justify-content: center;
          font-size: 9px;
          color: #16a34a;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .plan-btn {
          display: block;
          width: 100%;
          margin-top: 28px;
          padding: 12px;
          border-radius: 9px;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s;
          text-align: center;
        }

        .plan-btn-outline {
          background: none;
          border: 1.5px solid #e5e7eb;
          color: #6b7280;
        }
        .plan-btn-outline:hover { border-color: #d1d5db; color: #111827; }

        .plan-btn-filled {
          background: #2563eb;
          border: none;
          color: #fff;
          box-shadow: 0 4px 12px rgba(37,99,235,0.2);
        }
        .plan-btn-filled:hover { background: #1d4ed8; }

        /* BOTTOM CTA */
        .bottom-cta {
          padding: 96px 24px;
          text-align: center;
          max-width: 560px;
          margin: 0 auto;
        }

        .bottom-cta h2 {
          font-size: clamp(26px, 3.5vw, 36px);
          font-weight: 700;
          color: #111827;
          letter-spacing: -0.8px;
          line-height: 1.2;
          margin-bottom: 14px;
        }

        .bottom-cta p {
          font-size: 16px;
          color: #6b7280;
          line-height: 1.65;
          margin-bottom: 32px;
        }

        /* FOOTER */
        footer {
          border-top: 1px solid #f3f4f6;
          padding: 24px 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .footer-logo { font-size: 15px; font-weight: 700; color: #111827; }
        .footer-logo span { color: #2563eb; }
        .footer-copy { font-size: 13px; color: #d1d5db; }

        @media (max-width: 700px) {
          nav { padding: 0 16px; }
          .feat-grid { grid-template-columns: 1fr; }
          .plans { grid-template-columns: 1fr; }
          footer { flex-direction: column; gap: 8px; text-align: center; padding: 20px; }
        }
      `}</style>

      {/* HEADER */}
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

      <hr className="divider" />

      {/* FEATURES */}
      <section className="features" id='features'>
        <div className="section-header">
          <p className="section-label">Features</p>
          <h2 className="section-title">Everything you need to improve</h2>
        </div>
        <div className="feat-grid">
          {FEATURES.map(f => (
            <div className="feat-card" key={f.title}>
              <span className="feat-ico">{f.icon}</span>
              <div className="feat-title">{f.title}</div>
              <p className="feat-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="divider" />

      {/* PRICING */}
      <section className="pricing-wrap" id='pricing'>
        <div className="pricing-inner">
          <div className="section-header">
            <p className="section-label">Pricing</p>
            <h2 className="section-title">Start free. Upgrade when you're ready.</h2>
          </div>
          <div className="plans">
            <div className="plan">
              <p className="plan-tier">Free</p>
              <p className="plan-price">$0 <sub>/ forever</sub></p>
              <p className="plan-tagline">Everything you need to build a daily practice habit.</p>
              <ul className="plan-list">
                {FREE_FEATURES.map(f => (
                  <li key={f} className="plan-item"><span className="chk">✓</span>{f}</li>
                ))}
              </ul>
              <button className="plan-btn plan-btn-outline" onClick={() => router.push('/practice')}>
                Get started free
              </button>
            </div>
            <div className="plan featured">
              <span className="plan-badge">Most popular</span>
              <p className="plan-tier">Pro</p>
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
      </section>

      {/* BOTTOM CTA */}
      <section className="bottom-cta">
        <h2>Ready to Ace Your TOEFL Reading?</h2>
        <p>Join thousands of students improving their TOEFL scores through targeted practice.</p>
        <button className="btn-cta" onClick={() => router.push('/practice/sample')}>
          Get Started Free
        </button>
      </section>

      <hr className="divider" />

      <footer>
        <div className="footer-logo">TOEFL<span>Prep</span></div>
        <div className="footer-copy">© {new Date().getFullYear()} TOEFLPrep</div>
      </footer>
    </>
  )
}