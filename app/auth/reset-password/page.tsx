'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) { setError('At least 8 characters'); return }
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })
    if (error) { setError(error.message); setLoading(false); return }
    router.push('/dashboard')
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Special+Elite&family=Caveat:wght@400;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f5f2eb; font-family: 'Special Elite', cursive; min-height: 100vh; }
        .wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 40px 24px; }
        .card { background: #fffef9; border: 1.5px solid #d6d0c4; border-radius: 3px; padding: 44px 40px; width: 100%; max-width: 435px; position: relative; box-shadow: 3px 4px 0 #d6d0c4, 5px 7px 0 #ece8de; }
        .card::after { content: ''; position: absolute; inset: 0; background-image: repeating-linear-gradient(transparent, transparent 31px, rgba(180,180,200,0.13) 31px, rgba(180,180,200,0.13) 32px); border-radius: 3px; pointer-events: none; }
        .card::before { content: ''; position: absolute; left: 52px; top: 0; bottom: 0; width: 1px; background: rgba(220,100,100,0.18); pointer-events: none; }
        .inner { position: relative; z-index: 1; }
        .eyebrow { font-family: 'Caveat', cursive; font-size: 15px; font-weight: 600; color: #aaa; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px; }
        .title { font-family: 'Special Elite', cursive; font-size: 24px; color: #111; margin-bottom: 6px; }
        .sub { font-family: 'Special Elite', cursive; font-size: 15px; color: #888; margin-bottom: 28px; }
        .form { display: flex; flex-direction: column; gap: 16px; }
        .label { font-family: 'Special Elite', cursive; font-size: 14px; color: #333; display: block; margin-bottom: 6px; }
        .input { font-family: 'Special Elite', cursive; font-size: 15px; color: #111; background: #fffef9; border: 1.5px solid #d6d0c4; border-radius: 2px; padding: 10px 14px; outline: none; width: 100%; transition: border-color 0.12s; }
        .input:focus { border-color: #888; }
        .err { font-family: 'Special Elite', cursive; font-size: 13px; color: #b05050; margin-bottom: 4px; }
        .btn { font-family: 'Special Elite', cursive; font-size: 14px; color: #fff; background: #222; border: 1.5px solid #111; padding: 11px; border-radius: 3px; cursor: pointer; box-shadow: 2px 2px 0 #111; transition: all 0.1s; width: 100%; margin-top: 4px; }
        .btn:hover { transform: translate(-1px,-1px); box-shadow: 3px 3px 0 #111; }
        .btn:disabled { background: #aaa; border-color: #999; box-shadow: 1px 1px 0 #999; transform: none; cursor: default; }
      `}</style>
      <div className="wrap">
        <div className="card">
          <div className="inner">
            <p className="eyebrow">Reset password</p>
            <h1 className="title">Set a new password</h1>
            <p className="sub">Choose a strong password for your account</p>
            <form onSubmit={handleSubmit} className="form">
              <div>
                <label className="label">New password</label>
                <input
                  type="password" placeholder="At least 8 characters"
                  value={password} onChange={e => setPassword(e.target.value)}
                  className="input" autoComplete="new-password"
                />
              </div>
              {error && <p className="err">{error}</p>}
              <button type="submit" disabled={loading} className="btn">
                {loading ? 'Updating…' : 'Update password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}