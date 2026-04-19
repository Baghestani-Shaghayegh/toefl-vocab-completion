'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

type View = 'login' | 'signup';

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function Field({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  autoComplete,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-[15px] text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-3 focus:ring-blue-100"
      />
    </div>
  );
}

function Divider() {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px flex-1 bg-slate-200" />
      <span className="text-sm text-slate-400">or</span>
      <span className="h-px flex-1 bg-slate-200" />
    </div>
  );
}

// ─── Login view ───────────────────────────────────────────────────────────────
function LoginView({ onSwitch }: { onSwitch: () => void }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      // Sign in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      if (!authData.user) {
        setError('Failed to log in');
        setLoading(false);
        return;
      }

      // Redirect to practice or dashboard
      router.push('/practice');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setLoading(false);
    }
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Welcome back</h1>
        <p className="text-[15px] text-slate-500">Log in to continue your practice.</p>
      </div>

      {error && (
        <div className="mb-5 p-4 rounded-lg bg-red-50 border border-red-200">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Field
          label="Email address"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={setEmail}
          autoComplete="email"
        />

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-700">Password</label>
            <button
              type="button"
              className="text-sm font-medium text-blue-600 hover:text-blue-700 transition"
            >
              Forgot password?
            </button>
          </div>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-[15px] text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-3 focus:ring-blue-100"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-blue-600 py-3 text-[15px] font-semibold text-white transition hover:bg-blue-500 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed mt-1"
        >
          {loading ? 'Logging in…' : 'Log in'}
        </button>

        <Divider />

        <button
          type="button"
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white py-3 text-[15px] font-medium text-slate-700 transition hover:bg-slate-50 active:scale-[0.98]"
        >
          <GoogleIcon />
          Continue with Google
        </button>
      </form>

      <p className="mt-8 text-center text-[14px] text-slate-500">
        Don&apos;t have an account?{' '}
        <button
          type="button"
          onClick={onSwitch}
          className="font-semibold text-blue-600 hover:text-blue-700 transition"
        >
          Sign up free
        </button>
      </p>
    </>
  );
}

// ─── Signup view ──────────────────────────────────────────────────────────────
function SignupView({ onSwitch }: { onSwitch: () => void }) {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      if (!authData.user) {
        setError('Failed to create account');
        setLoading(false);
        return;
      }

      // Insert user profile into users table
      const { error: insertError } = await supabase.from('users').insert([
        {
          id: authData.user.id,
          email,
          first_name: firstName,
          last_name: lastName,
          created_at: new Date().toISOString(),
        },
      ]);

      if (insertError) {
        setError('Account created but profile setup failed: ' + insertError.message);
        setLoading(false);
        return;
      }

      // Redirect to practice or dashboard
      router.push('/practice');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setLoading(false);
    }
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Create your account</h1>
        <p className="text-[15px] text-slate-500">Start practicing for free — no credit card needed.</p>
      </div>

      {error && (
        <div className="mb-5 p-4 rounded-lg bg-red-50 border border-red-200">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-3">
          <Field
            label="First name"
            placeholder="Alex"
            value={firstName}
            onChange={setFirstName}
            autoComplete="given-name"
          />
          <Field
            label="Last name"
            placeholder="Kim"
            value={lastName}
            onChange={setLastName}
            autoComplete="family-name"
          />
        </div>

        <Field
          label="Email address"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={setEmail}
          autoComplete="email"
        />

        <Field
          label="Password"
          type="password"
          placeholder="Min. 8 characters"
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-blue-600 py-3 text-[15px] font-semibold text-white transition hover:bg-blue-500 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed mt-1"
        >
          {loading ? 'Creating account…' : 'Create account'}
        </button>

        <Divider />

        <button
          type="button"
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white py-3 text-[15px] font-medium text-slate-700 transition hover:bg-slate-50 active:scale-[0.98]"
        >
          <GoogleIcon />
          Continue with Google
        </button>
      </form>

      <p className="mt-6 text-center text-[13px] text-slate-400 leading-relaxed">
        By signing up you agree to our{' '}
        <Link href="/terms" className="text-slate-600 underline underline-offset-2 hover:text-slate-900">
          Terms
        </Link>{' '}
        and{' '}
        <Link href="/privacy" className="text-slate-600 underline underline-offset-2 hover:text-slate-900">
          Privacy Policy
        </Link>.
      </p>

      <p className="mt-4 text-center text-[14px] text-slate-500">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitch}
          className="font-semibold text-blue-600 hover:text-blue-700 transition"
        >
          Log in
        </button>
      </p>
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AuthPage() {
  const searchParams = useSearchParams();
  const viewParam = searchParams.get('view');
  const [view, setView] = useState<View>((viewParam as View) || 'login');

  // Update view when URL changes
  useEffect(() => {
    if (viewParam === 'signup' || viewParam === 'login') {
      setView(viewParam);
    }
  }, [viewParam]);

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[420px]">

        {/* Brand */}
        <Link href="/" className="flex items-center justify-center gap-3 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#173154] text-[17px] font-bold text-white">
            L
          </div>
          <div>
            <p className="text-[17px] font-bold text-slate-900 leading-none">LexiLift</p>
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400 mt-0.5">Reading prep</p>
          </div>
        </Link>

        {/* Card */}
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm px-8 py-8">
          {view === 'login'
            ? <LoginView onSwitch={() => setView('signup')} />
            : <SignupView onSwitch={() => setView('login')} />
          }
        </div>

        <p className="text-center text-[13px] text-slate-400 mt-6">
          <Link href="/" className="hover:text-slate-600 transition">
            ← Back to home
          </Link>
        </p>

      </div>
    </main>
  );
}