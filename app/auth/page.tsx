'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type View = 'login' | 'signup'

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}

function Field({
  label, type = 'text', placeholder, value, onChange,
  autoComplete, error,
}: {
  label: string; type?: string; placeholder?: string
  value: string; onChange: (v: string) => void
  autoComplete?: string; error?: string
}) {
  return (
    <div className="field-wrap">
      <label className="field-label">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        autoComplete={autoComplete}
        onChange={e => onChange(e.target.value)}
        className={`field-input${error ? ' field-input-error' : ''}`}
      />
      {error && <p className="field-error">{error}</p>}
    </div>
  )
}

function LoginView({ onSwitch }: { onSwitch: () => void }) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  function validate() {
    const e: Record<string, string> = {}
    if (!email.trim()) e.email = 'Email is required'
    if (!password.trim()) e.password = 'Password is required'
    setFieldErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setFieldErrors({ password: 'Incorrect email or password' })
      setLoading(false)
      return
    }
    router.push('/')
  }

  async function handleGoogle() {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  return (
    <>
      <p className="auth-eyebrow">Welcome back</p>
      <h1 className="auth-title">Log in to TOEFLPrep</h1>
      <p className="auth-sub">Pick up where you left off</p>

      <form onSubmit={handleSubmit} className="auth-form">
        <Field label="Email" type="email" placeholder="your@email.com"
          value={email} onChange={v => { setEmail(v); if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: '' }) }}
          autoComplete="email" error={fieldErrors.email} />

        <div className="field-wrap">
          <div className="field-label-row">
            <label className="field-label">Password</label>
            <button type="button" className="forgot-btn">Forgot password?</button>
          </div>
          <input
            type="password" placeholder="••••••••" value={password}
            autoComplete="current-password"
            onChange={e => { setPassword(e.target.value); if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: '' }) }}
            className={`field-input${fieldErrors.password ? ' field-input-error' : ''}`}
          />
          {fieldErrors.password && <p className="field-error">{fieldErrors.password}</p>}
        </div>

        <button type="submit" disabled={loading} className="btn-submit">
          {loading ? 'Logging in…' : 'Log in'}
        </button>

        <div className="auth-divider"><span>or</span></div>

        <button type="button" onClick={handleGoogle} className="btn-google">
          <GoogleIcon /> Continue with Google
        </button>
      </form>

      <p className="auth-switch">
        No account?{' '}
        <button type="button" onClick={onSwitch} className="auth-switch-btn">Sign up free</button>
      </p>
    </>
  )
}

function SignupView({ onSwitch }: { onSwitch: () => void }) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  function validate() {
    const e: Record<string, string> = {}
    if (!name.trim()) e.name = 'Name is required'
    if (!email.trim()) e.email = 'Email is required'
    if (!password.trim()) e.password = 'Password is required'
    if (password.length > 0 && password.length < 8) e.password = 'At least 8 characters'
    setFieldErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!validate()) return
    setLoading(true)
    const supabase = createClient()
    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password })
    if (authError) { setError(authError.message); setLoading(false); return }
    if (!authData.user) { setError('Failed to create account'); setLoading(false); return }
    await supabase.from('users').insert([{
      id: authData.user.id, email,
      first_name: name, created_at: new Date().toISOString(),
    }])
    router.push('/')
  }

  async function handleGoogle() {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  return (
    <>
      <p className="auth-eyebrow">Get started</p>
      <h1 className="auth-title">Create your account</h1>
      <p className="auth-sub">Free to start · no credit card needed</p>

      {error && <div className="auth-error">{error}</div>}

      <form onSubmit={handleSubmit} className="auth-form">
        <Field label="Name" placeholder="Your name"
          value={name} onChange={v => { setName(v); if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: '' }) }}
          autoComplete="name" error={fieldErrors.name} />
        <Field label="Email" type="email" placeholder="your@email.com"
          value={email} onChange={v => { setEmail(v); if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: '' }) }}
          autoComplete="email" error={fieldErrors.email} />
        <Field label="Password" type="password" placeholder="Min. 8 characters"
          value={password} onChange={v => { setPassword(v); if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: '' }) }}
          autoComplete="new-password" error={fieldErrors.password} />

        <button type="submit" disabled={loading} className="btn-submit">
          {loading ? 'Creating account…' : 'Create account'}
        </button>

        <div className="auth-divider"><span>or</span></div>

        <button type="button" onClick={handleGoogle} className="btn-google">
          <GoogleIcon /> Continue with Google
        </button>
      </form>

      <p className="auth-terms">
        By signing up you agree to our{' '}
        <Link href="/terms" className="auth-terms-link">Terms</Link> and{' '}
        <Link href="/privacy" className="auth-terms-link">Privacy Policy</Link>.
      </p>

      <p className="auth-switch">
        Already have an account?{' '}
        <button type="button" onClick={onSwitch} className="auth-switch-btn">Log in</button>
      </p>
    </>
  )
}

export default function AuthPage() {
  const searchParams = useSearchParams()
  const viewParam = searchParams.get('view')
  const [view, setView] = useState<View>((viewParam as View) || 'login')

  useEffect(() => {
    if (viewParam === 'signup' || viewParam === 'login') setView(viewParam)
  }, [viewParam])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Special+Elite&family=Caveat:wght@400;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #f5f2eb;
          font-family: 'Special Elite', cursive;
          min-height: 100vh;
        }

        .auth-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
        }

        /* PAPER CARD */
        .auth-card {
          background: #fffef9;
          border: 1.5px solid #d6d0c4;
          border-radius: 3px;
          padding: 44px 40px;
          width: 100%;
          max-width: 420px;
          position: relative;
          box-shadow: 3px 4px 0 #d6d0c4, 5px 7px 0 #ece8de;
        }

        /* ruled lines */
        .auth-card::after {
          content: '';
          position: absolute; inset: 0;
          background-image: repeating-linear-gradient(
            transparent, transparent 31px,
            rgba(180,180,200,0.13) 31px, rgba(180,180,200,0.13) 32px
          );
          border-radius: 3px;
          pointer-events: none;
        }

        /* red margin line */
        .auth-card::before {
          content: '';
          position: absolute;
          left: 52px; top: 0; bottom: 0; width: 1px;
          background: rgba(220,100,100,0.18);
          pointer-events: none;
        }

        .auth-card-inner { position: relative; z-index: 1; }

        /* HEADER */
        .auth-eyebrow {
          font-family: 'Caveat', cursive;
          font-size: 13px; font-weight: 600;
          color: #aaa; text-transform: uppercase;
          letter-spacing: 2px; margin-bottom: 8px;
        }

        .auth-title {
          font-family: 'Special Elite', cursive;
          font-size: 24px; color: #111;
          letter-spacing: -0.3px; margin-bottom: 6px;
        }

        .auth-sub {
          font-family: 'Caveat', cursive;
          font-size: 15px; color: #888; margin-bottom: 28px;
        }

        .auth-error {
          font-family: 'Special Elite', cursive;
          font-size: 13px; color: #b05050;
          background: #fdf0f0; border: 1px solid #e0bbbb;
          border-radius: 3px; padding: 10px 14px;
          margin-bottom: 18px;
          box-shadow: 1px 1px 0 #e0bbbb;
        }

        /* FORM */
        .auth-form { display: flex; flex-direction: column; gap: 16px; }

        .field-wrap { display: flex; flex-direction: column; gap: 6px; }

        .field-label {
          font-family: 'Special Elite', cursive;
          font-size: 14px; color: #333;
        }

        .field-label-row {
          display: flex; align-items: center;
          justify-content: space-between;
        }

        .forgot-btn {
          font-family: 'Caveat', cursive;
          font-size: 13px; font-weight: 600;
          color: #888; background: none; border: none;
          cursor: pointer; transition: color 0.12s;
        }
        .forgot-btn:hover { color: #333; }

        .field-input {
          font-family: 'Special Elite', cursive;
          font-size: 15px; color: #111;
          background: #fffef9;
          border: 1.5px solid #d6d0c4;
          border-radius: 2px;
          padding: 10px 14px;
          outline: none;
          width: 100%;
          transition: border-color 0.12s;
        }
        .field-input:focus { border-color: #888; }
        .field-input-error { border-color: #c07070 !important; }
        .field-input::placeholder { color: #bbb; }

        .field-error {
          font-family: 'Caveat', cursive;
          font-size: 13px; font-weight: 600;
          color: #b05050;
        }

        /* BUTTONS */
        .btn-submit {
          font-family: 'Special Elite', cursive;
          font-size: 14px; color: #fff;
          background: #222; border: 1.5px solid #111;
          padding: 11px; border-radius: 3px;
          cursor: pointer; box-shadow: 2px 2px 0 #111;
          transition: all 0.1s; width: 100%;
          margin-top: 4px;
        }
        .btn-submit:hover  { transform: translate(-1px,-1px); box-shadow: 3px 3px 0 #111; }
        .btn-submit:active { transform: translate(1px,1px);   box-shadow: 1px 1px 0 #111; }
        .btn-submit:disabled { background: #aaa; border-color: #999; box-shadow: 1px 1px 0 #999; transform: none; cursor: default; }

        .auth-divider {
          display: flex; align-items: center; gap: 10px;
          font-family: 'Caveat', cursive; font-size: 13px; color: #bbb;
        }
        .auth-divider::before,
        .auth-divider::after {
          content: ''; flex: 1; height: 1px; background: #d6d0c4;
        }

        .btn-google {
          font-family: 'Special Elite', cursive;
          font-size: 14px; color: #444;
          background: #fffef9; border: 1.5px solid #c8c2b8;
          padding: 10px; border-radius: 3px;
          cursor: pointer; box-shadow: 2px 2px 0 #d6d0c4;
          transition: all 0.1s; width: 100%;
          display: flex; align-items: center;
          justify-content: center; gap: 10px;
        }
        .btn-google:hover  { transform: translate(-1px,-1px); box-shadow: 3px 3px 0 #d6d0c4; }
        .btn-google:active { transform: translate(1px,1px);   box-shadow: 1px 1px 0 #d6d0c4; }

        /* FOOTER */
        .auth-terms {
          font-family: 'Caveat', cursive;
          font-size: 12px; color: #aaa;
          text-align: center; margin-top: 16px; line-height: 1.6;
        }
        .auth-terms-link { color: #888; text-decoration: underline; }
        .auth-terms-link:hover { color: #444; }

        .auth-switch {
          font-family: 'Special Elite', cursive;
          font-size: 14px; color: #666;
          text-align: center; margin-top: 20px;
        }

        .auth-switch-btn {
          font-family: 'Special Elite', cursive;
          font-size: 14px; color: #333;
          background: none; border: none;
          cursor: pointer; text-decoration: underline;
          transition: color 0.12s;
        }
        .auth-switch-btn:hover { color: #111; }

        /* BACK LINK */
        .auth-back {
          font-family: 'Special Elite', cursive;
          font-size: 14px; color: #888;
          text-decoration: none; margin-top: 20px;
          transition: color 0.12s; display: block;
          text-align: center;
        }
        .auth-back:hover { color: #333; }

        @media (max-width: 480px) {
          .auth-card { padding: 32px 24px; }
          .auth-card::before { left: 36px; }
        }
      `}</style>

      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-card-inner">
            {view === 'login'
              ? <LoginView onSwitch={() => setView('signup')} />
              : <SignupView onSwitch={() => setView('login')} />
            }
          </div>
        </div>
        <Link href="/" className="auth-back">← Back to home</Link>
      </div>
    </>
  )
}