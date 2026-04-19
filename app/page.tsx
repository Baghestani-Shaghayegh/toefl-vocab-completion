'use client'

import { useRouter } from 'next/navigation'

const PREVIEW_WORDS = [
  { text: 'Built', masked: false },
  { text: 'by', masked: false },
  { text: 'tiny', masked: true },
  { text: 'animals', masked: true },
  { text: 'called', masked: false },
  { text: 'coral', masked: false },
  { text: 'polyps,', masked: true },
  { text: 'which', masked: false },
  { text: 'secrete', masked: true },
  { text: 'calcium', masked: false },
  { text: 'carbonate', masked: true },
  { text: 'to', masked: false },
  { text: 'form', masked: false },
  { text: 'hard', masked: false },
  { text: 'skeletons.', masked: false },
]

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

export default function Home() {
  const router = useRouter()

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Lora:ital,wght@0,700;1,700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #ffffff;
          color: #0f172a;
          font-family: 'Inter', sans-serif;
        }

        /* NAV */
        nav {
          border-bottom: 1px solid #f1f5f9;
          padding: 18px 48px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          font-family: 'Lora', serif;
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
        }
        .logo span { color: #2563eb; }

        .nav-right { display: flex; gap: 8px; }

        .btn-ghost {
          background: transparent;
          border: 1px solid #e2e8f0;
          color: #475569;
          padding: 8px 16px;
          border-radius: 7px;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s;
        }
        .btn-ghost:hover { border-color: #cbd5e1; color: #0f172a; }

        .btn-primary {
          background: #2563eb;
          border: none;
          color: #fff;
          padding: 8px 16px;
          border-radius: 7px;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.15s;
        }
        .btn-primary:hover { background: #1d4ed8; }

        /* HERO */
        .hero {
          max-width: 1080px;
          margin: 0 auto;
          padding: 88px 48px 80px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          color: #1d4ed8;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.4px;
          padding: 4px 12px;
          border-radius: 20px;
          margin-bottom: 24px;
        }

        .badge-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #2563eb;
        }

        h1 {
          font-family: 'Lora', serif;
          font-size: clamp(32px, 3.5vw, 48px);
          font-weight: 700;
          line-height: 1.15;
          letter-spacing: -0.5px;
          color: #0f172a;
          margin-bottom: 18px;
        }

        h1 em { font-style: italic; color: #2563eb; }

        .hero-sub {
          font-size: 16px;
          color: #64748b;
          line-height: 1.7;
          margin-bottom: 32px;
          max-width: 380px;
        }

        .btn-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #2563eb;
          border: none;
          color: #fff;
          padding: 13px 28px;
          border-radius: 8px;
          font-family: 'Inter', sans-serif;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(37,99,235,0.22);
          transition: all 0.15s;
        }
        .btn-cta:hover { background: #1d4ed8; transform: translateY(-1px); }
        .btn-cta-arrow { transition: transform 0.15s; }
        .btn-cta:hover .btn-cta-arrow { transform: translateX(3px); }

        .hero-note {
          margin-top: 14px;
          font-size: 13px;
          color: #94a3b8;
        }

        /* PREVIEW CARD */
        .preview-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 28px;
          box-shadow: 0 4px 24px rgba(15,23,42,0.07);
        }

        .preview-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .preview-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          color: #94a3b8;
        }

        .timer-pill {
          display: flex;
          align-items: center;
          gap: 5px;
          background: #fff7ed;
          border: 1px solid #fed7aa;
          color: #c2410c;
          font-size: 12px;
          font-weight: 600;
          padding: 3px 10px;
          border-radius: 20px;
        }

        .timer-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #f97316;
          animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .passage-preview {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 9px;
          padding: 18px 20px;
          font-family: 'Lora', serif;
          font-size: 15px;
          line-height: 2;
          color: #334155;
          margin-bottom: 18px;
        }

        .w-blank {
          display: inline-block;
          background: #eff6ff;
          border: 1.5px dashed #93c5fd;
          border-radius: 4px;
          padding: 1px 14px;
          margin: 0 2px;
          vertical-align: middle;
          min-width: 64px;
          height: 26px;
        }

        .w-text { color: #334155; }

        .preview-input-row {
          display: flex;
          gap: 8px;
          margin-bottom: 14px;
        }

        .preview-input {
          flex: 1;
          background: #fff;
          border: 1.5px solid #e2e8f0;
          border-radius: 7px;
          padding: 10px 14px;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          color: #94a3b8;
          pointer-events: none;
        }

        .preview-btn {
          background: #0f172a;
          border: none;
          color: #fff;
          padding: 10px 18px;
          border-radius: 7px;
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          font-weight: 600;
          pointer-events: none;
        }

        .preview-stats {
          display: flex;
          gap: 12px;
        }

        .stat-chip {
          flex: 1;
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 7px;
          padding: 10px 12px;
          text-align: center;
        }

        .stat-chip-num {
          font-size: 16px;
          font-weight: 600;
          color: #0f172a;
        }

        .stat-chip-label {
          font-size: 11px;
          color: #94a3b8;
          margin-top: 2px;
        }

        /* DIVIDER */
        .divider {
          border: none;
          border-top: 1px solid #f1f5f9;
          margin: 0;
        }

        /* FEATURES */
        .features-section {
          max-width: 1080px;
          margin: 0 auto;
          padding: 72px 48px;
        }

        .section-eyebrow {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          color: #94a3b8;
          margin-bottom: 10px;
        }

        .section-title {
          font-family: 'Lora', serif;
          font-size: 28px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 48px;
          line-height: 1.3;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .feat-card {
          border: 1px solid #f1f5f9;
          border-radius: 11px;
          padding: 24px;
          background: #fff;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .feat-card:hover { border-color: #cbd5e1; box-shadow: 0 2px 12px rgba(15,23,42,0.05); }

        .feat-icon {
          width: 36px; height: 36px;
          background: #eff6ff;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          margin-bottom: 14px;
          color: #2563eb;
        }

        .feat-title {
          font-size: 14px;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 6px;
        }

        .feat-desc {
          font-size: 13px;
          color: #64748b;
          line-height: 1.6;
        }

        /* PRICING */
        .pricing-section {
          background: #f8fafc;
          border-top: 1px solid #f1f5f9;
          border-bottom: 1px solid #f1f5f9;
          padding: 72px 48px;
        }

        .pricing-inner {
          max-width: 800px;
          margin: 0 auto;
        }

        .pricing-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-top: 48px;
        }

        .plan-card {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 32px;
        }

        .plan-card.featured {
          border-color: #2563eb;
          border-width: 2px;
          position: relative;
        }

        .plan-tag {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: #2563eb;
          color: #fff;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.5px;
          padding: 3px 12px;
          border-radius: 20px;
          white-space: nowrap;
        }

        .plan-name {
          font-size: 13px;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          margin-bottom: 10px;
        }

        .plan-price {
          font-family: 'Lora', serif;
          font-size: 36px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 4px;
        }

        .plan-price span {
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          font-weight: 400;
          color: #94a3b8;
        }

        .plan-desc {
          font-size: 13px;
          color: #64748b;
          margin-bottom: 24px;
          padding-bottom: 24px;
          border-bottom: 1px solid #f1f5f9;
        }

        .plan-features { list-style: none; display: flex; flex-direction: column; gap: 10px; }

        .plan-feature {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 13px;
          color: #475569;
        }

        .check {
          width: 16px; height: 16px;
          border-radius: 50%;
          background: #dcfce7;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          color: #15803d;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .plan-btn {
          display: block;
          width: 100%;
          margin-top: 28px;
          padding: 12px;
          border-radius: 8px;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s;
          text-align: center;
          border: none;
        }

        .plan-btn-outline {
          background: transparent;
          border: 1.5px solid #e2e8f0 !important;
          color: #475569;
        }
        .plan-btn-outline:hover { border-color: #cbd5e1 !important; color: #0f172a; }

        .plan-btn-solid {
          background: #2563eb;
          color: #fff;
          box-shadow: 0 4px 12px rgba(37,99,235,0.2);
        }
        .plan-btn-solid:hover { background: #1d4ed8; }

        /* CTA BANNER */
        .cta-banner {
          max-width: 1080px;
          margin: 0 auto;
          padding: 72px 48px;
          text-align: center;
        }

        .cta-banner h2 {
          font-family: 'Lora', serif;
          font-size: 30px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 12px;
        }

        .cta-banner p {
          font-size: 15px;
          color: #64748b;
          margin-bottom: 28px;
        }

        /* FOOTER */
        .footer-line {
          border-top: 1px solid #f1f5f9;
          padding: 24px 48px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1080px;
          margin: 0 auto;
        }

        .footer-logo {
          font-family: 'Lora', serif;
          font-size: 15px;
          font-weight: 700;
          color: #0f172a;
        }
        .footer-logo span { color: #2563eb; }

        .footer-copy { font-size: 13px; color: #94a3b8; }

        @media (max-width: 768px) {
          nav { padding: 16px 20px; }
          .hero { grid-template-columns: 1fr; gap: 40px; padding: 48px 20px 56px; }
          .features-section { padding: 48px 20px; }
          .features-grid { grid-template-columns: 1fr; }
          .pricing-section { padding: 48px 20px; }
          .pricing-grid { grid-template-columns: 1fr; }
          .cta-banner { padding: 48px 20px; }
          .footer-line { padding: 20px; flex-direction: column; gap: 8px; }
        }
      `}</style>

      {/* NAV */}
      <nav>
        <div className="logo">TOEFL<span>Prep</span></div>
        <div className="nav-right">
          <button className="btn-ghost" onClick={() => router.push('/login')}>Log in</button>
          <button className="btn-primary" onClick={() => router.push('/signup')}>Sign up free</button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div>
          <div className="badge"><span className="badge-dot" />TOEFL reading practice</div>
          <h1>Practice the words that <em>show up</em> on test day</h1>
          <p className="hero-sub">
            Fill in missing words from real TOEFL academic passages. Track your accuracy, beat the clock, and know exactly where you need to improve.
          </p>
          <button className="btn-cta" onClick={() => router.push('/signup')}>
            Try a sample passage <span className="btn-cta-arrow">→</span>
          </button>
          <p className="hero-note">Free to start · No credit card required</p>
        </div>

        {/* STATIC PREVIEW */}
        <div className="preview-card">
          <div className="preview-top">
            <span className="preview-label">Sample · Biology</span>
            <span className="timer-pill"><span className="timer-dot" />36:42 remaining</span>
          </div>
          <div className="passage-preview">
            Coral reefs are <span className="w-blank" /> by <span className="w-blank" /> animals
            called coral polyps, which <span className="w-blank" /> calcium carbonate
            to <span className="w-blank" /> hard skeletons that support diverse marine ecosystems.
          </div>
          <div className="preview-input-row">
            <div className="preview-input">Type your answer...</div>
            <div className="preview-btn">Check</div>
          </div>
          <div className="preview-stats">
            <div className="stat-chip">
              <div className="stat-chip-num">84%</div>
              <div className="stat-chip-label">Accuracy</div>
            </div>
            <div className="stat-chip">
              <div className="stat-chip-num">12</div>
              <div className="stat-chip-label">Streak</div>
            </div>
            <div className="stat-chip">
              <div className="stat-chip-num">3/7</div>
              <div className="stat-chip-label">Words left</div>
            </div>
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* FEATURES */}
      <section className="features-section">
        <p className="section-eyebrow">What you get</p>
        <h2 className="section-title">Everything built around the TOEFL format</h2>
        <div className="features-grid">
          <div className="feat-card">
            <div className="feat-icon">⏱</div>
            <div className="feat-title">Exam timer mode</div>
            <p className="feat-desc">Practice under real test conditions with the exact time limit you'll face on exam day.</p>
          </div>
          <div className="feat-card">
            <div className="feat-icon">◎</div>
            <div className="feat-title">Accuracy tracking</div>
            <p className="feat-desc">See your accuracy per session and over time. Know which words and topics trip you up most.</p>
          </div>
          <div className="feat-card">
            <div className="feat-icon">↻</div>
            <div className="feat-title">Most-missed words</div>
            <p className="feat-desc">After each session, see a report of your most common mistakes so you can focus your study.</p>
          </div>
          <div className="feat-card">
            <div className="feat-icon">✓</div>
            <div className="feat-title">Instant answer reveal</div>
            <p className="feat-desc">Every wrong answer shows you the correct word immediately — no guessing what you missed.</p>
          </div>
          <div className="feat-card">
            <div className="feat-icon">◈</div>
            <div className="feat-title">Adaptive AI practices</div>
            <p className="feat-desc">AI generates passages calibrated to your current level and focuses on your weak areas. <span style={{color:'#2563eb',fontWeight:600}}>Pro</span></p>
          </div>
          <div className="feat-card">
            <div className="feat-icon">◇</div>
            <div className="feat-title">AI answer explanations</div>
            <p className="feat-desc">Understand why an answer is correct — with context, meaning, and usage examples. <span style={{color:'#2563eb',fontWeight:600}}>Pro</span></p>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="pricing-section">
        <div className="pricing-inner">
          <p className="section-eyebrow" style={{textAlign:'center'}}>Pricing</p>
          <h2 className="section-title" style={{textAlign:'center',maxWidth:'100%'}}>Start free. Upgrade when you're ready.</h2>
          <div className="pricing-grid">
            <div className="plan-card">
              <p className="plan-name">Free</p>
              <p className="plan-price">$0 <span>/ forever</span></p>
              <p className="plan-desc">Everything you need to get started and build a daily habit.</p>
              <ul className="plan-features">
                {FREE_FEATURES.map(f => (
                  <li key={f} className="plan-feature">
                    <span className="check">✓</span>{f}
                  </li>
                ))}
              </ul>
              <button className="plan-btn plan-btn-outline" onClick={() => router.push('/signup')}>
                Get started free
              </button>
            </div>

            <div className="plan-card featured">
              <span className="plan-tag">Most popular</span>
              <p className="plan-name">Pro</p>
              <p className="plan-price">$9 <span>/ month</span></p>
              <p className="plan-desc">For serious test-takers who want unlimited practice and AI-powered feedback.</p>
              <ul className="plan-features">
                {PRO_FEATURES.map(f => (
                  <li key={f} className="plan-feature">
                    <span className="check">✓</span>{f}
                  </li>
                ))}
              </ul>
              <button className="plan-btn plan-btn-solid" onClick={() => router.push('/signup')}>
                Start Pro free trial
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="cta-banner">
        <h2>Ready to stop guessing on test day?</h2>
        <p>Join thousands of TOEFL learners who practice smarter, not harder.</p>
        <button className="btn-cta" onClick={() => router.push('/signup')}>
          Try a sample passage <span className="btn-cta-arrow">→</span>
        </button>
      </section>

      <hr className="divider" />

      <div className="footer-line">
        <div className="footer-logo">TOEFL<span>Prep</span></div>
        <div className="footer-copy">© {new Date().getFullYear()} TOEFLPrep · Built for serious test takers</div>
      </div>
    </>
  )
}