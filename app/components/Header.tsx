'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();

    // Get initial session
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setDropdownOpen(false);
    router.push('/');
  }

  // Get initials from name or email
  function getInitials(user: User) {
    const firstName = user.user_metadata?.given_name || user.user_metadata?.full_name?.split(' ')[0];
    const lastName = user.user_metadata?.family_name || user.user_metadata?.full_name?.split(' ')[1];
    if (firstName && lastName) return `${firstName[0]}${lastName[0]}`.toUpperCase();
    if (firstName) return firstName[0].toUpperCase();
    return user.email?.[0].toUpperCase() ?? 'U';
  }

  function getDisplayName(user: User) {
    return (
      user.user_metadata?.given_name ||
      user.user_metadata?.full_name?.split(' ')[0] ||
      user.email?.split('@')[0] ||
      'User'
    );
  }

  const navLinks = [
    { label: 'Practice', href: '/practice' },
    { label: 'Dashboard', href: '/dashboard' },
  ];

  return (
    <header className="sticky top-0 z-50 h-20 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 sm:px-10 lg:px-12">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/12 text-lg font-semibold text-white ring-1 ring-white/20 backdrop-blur">
            L
          </div>
          <div>
            <p className="text-base font-semibold tracking-tight text-white">
              LexiLift
            </p>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-200">
              Reading prep
            </p>
          </div>
        </Link>

        {/* Logged in: nav links + avatar dropdown */}
        {user ? (
          <div className="flex items-center gap-6">

            {/* Nav links */}
            <nav className="hidden items-center gap-6 sm:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={[
                    'text-sm font-medium transition',
                    pathname === link.href
                      ? 'text-white'
                      : 'text-slate-300 hover:text-white',
                  ].join(' ')}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Avatar dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className="flex items-center gap-2.5 rounded-full border border-white/15 bg-white/10 py-1.5 pl-1.5 pr-3 transition hover:bg-white/15"
              >
                {/* Avatar circle */}
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
                  {getInitials(user)}
                </div>
                <span className="text-sm font-medium text-white">
                  {getDisplayName(user)}
                </span>
                {/* Chevron */}
                <svg
                  className={`h-3.5 w-3.5 text-slate-300 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-white/10 bg-slate-900 py-1.5 shadow-xl shadow-slate-950/40">
                  {/* User info */}
                  <div className="border-b border-white/10 px-4 py-2.5">
                    <p className="text-[13px] font-medium text-white">{getDisplayName(user)}</p>
                    <p className="text-[12px] text-slate-400 truncate">{user.email}</p>
                  </div>

                  {/* Nav links (mobile fallback) */}
                  <div className="py-1 sm:hidden">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-slate-200 hover:bg-white/10 transition"
                      >
                        {link.label}
                      </Link>
                    ))}
                    <div className="my-1 border-t border-white/10" />
                  </div>

                  {/* Menu items */}
                  <div className="py-1">
                    <Link
                      href="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
                    >
                      <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      Dashboard
                    </Link>
                    <Link
                      href="/practice"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
                    >
                      <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      Practice
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
                    >
                      <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Settings
                    </Link>
                  </div>

                  {/* Sign out */}
                  <div className="border-t border-white/10 py-1">
                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-red-400 transition hover:bg-white/10"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Logged out: Log in + Start free */
          <div className="flex items-center gap-3">
            <Link
              href="/auth?view=login"
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-100 transition hover:text-white"
            >
              Log in
            </Link>
            <Link
              href="/auth?view=signup"
              className="inline-flex rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-950/20 transition hover:bg-blue-500"
            >
              Start free
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}