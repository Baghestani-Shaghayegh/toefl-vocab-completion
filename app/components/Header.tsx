'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    setDropdownOpen(false)
    router.push('/')
  }

  function getInitials(u: User) {
    const first = u.user_metadata?.given_name || u.user_metadata?.full_name?.split(' ')[0]
    const last = u.user_metadata?.family_name || u.user_metadata?.full_name?.split(' ')[1]
    if (first && last) return `${first[0]}${last[0]}`.toUpperCase()
    if (first) return first[0].toUpperCase()
    return u.email?.[0].toUpperCase() ?? 'U'
  }

  function getDisplayName(u: User) {
    return (
      u.user_metadata?.given_name ||
      u.user_metadata?.full_name?.split(' ')[0] ||
      u.email?.split('@')[0] ||
      'User'
    )
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Special+Elite&family=Caveat:wght@400;600&display=swap');

        .hdr {
          position: sticky;
          top: 0;
          z-index: 50;
          height: 60px;
          background: rgba(245,242,235,0.97);
          backdrop-filter: blur(8px);
          border-bottom: 1px solid #d6d0c4;
        }

        .hdr-inner {
          height: 100%;
          padding: 0 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .hdr-logo {
          font-family: 'Special Elite', cursive;
          font-size: 17px;
          color: #1a1a1a;
          text-decoration: none;
          flex-shrink: 0;
          letter-spacing: -0.2px;
        }

        .hdr-right {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        /* nav links */
        .hdr-nav-link {
          font-family: 'Special Elite', cursive;
          font-size: 14px;
          color: #888;
          text-decoration: none;
          padding: 5px 11px;
          border-radius: 2px;
          transition: color 0.12s, background 0.12s;
          white-space: nowrap;
        }
        .hdr-nav-link:hover { color: #222; background: rgba(0,0,0,0.04); }
        .hdr-nav-link.active { color: #222; background: rgba(0,0,0,0.05); }

        /* separator */
        .hdr-sep {
          width: 1px;
          height: 16px;
          background: #d6d0c4;
          margin: 0 6px;
          flex-shrink: 0;
        }

        /* ghost button */
        .hdr-btn-ghost {
          font-family: 'Special Elite', cursive;
          font-size: 13px;
          color: #555;
          background: none;
          border: 1px solid #c8c2b8;
          padding: 5px 14px;
          border-radius: 2px;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.12s;
          display: inline-flex;
          align-items: center;
          white-space: nowrap;
        }
        .hdr-btn-ghost:hover { border-color: #999; color: #222; }

        /* solid button */
        .hdr-btn-solid {
          font-family: 'Special Elite', cursive;
          font-size: 13px;
          color: #fff;
          background: #222;
          border: 1.5px solid #111;
          padding: 5px 14px;
          border-radius: 2px;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          white-space: nowrap;
          box-shadow: 2px 2px 0 #111;
          transition: all 0.1s;
        }
        .hdr-btn-solid:hover { transform: translate(-1px,-1px); box-shadow: 3px 3px 0 #111; }

        /* avatar button */
        .avatar-btn {
          display: flex;
          align-items: center;
          gap: 7px;
          background: #fffef9;
          border: 1px solid #c8c2b8;
          padding: 4px 10px 4px 5px;
          border-radius: 2px;
          cursor: pointer;
          transition: all 0.12s;
          font-family: inherit;
          box-shadow: 1px 1px 0 #d6d0c4;
        }
        .avatar-btn:hover { background: #fffcf3; border-color: #aaa; }

        .avatar-circle {
          width: 26px; height: 26px;
          border-radius: 50%;
          background: #555;
          color: #fffef9;
          font-family: 'Caveat', cursive;
          font-size: 12px;
          font-weight: 600;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        .avatar-name {
          font-family: 'Special Elite', cursive;
          font-size: 13px;
          color: #333;
        }

        .avatar-chevron {
          width: 13px; height: 13px;
          color: #aaa;
          transition: transform 0.12s;
          flex-shrink: 0;
        }
        .avatar-chevron.open { transform: rotate(180deg); }

        /* dropdown */
        .hdr-dropdown-wrap { position: relative; }

        .hdr-dropdown {
          position: absolute;
          right: 0;
          top: calc(100% + 8px);
          width: 210px;
          background: #fffef9;
          border: 1.5px solid #d6d0c4;
          border-radius: 3px;
          box-shadow: 3px 4px 0 #d6d0c4, 5px 7px 0 #ece8de;
          overflow: hidden;
          animation: dd-in 0.12s ease;
        }

        @keyframes dd-in {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .dd-user {
          padding: 11px 14px;
          border-bottom: 1px solid #e8e2d8;
        }
        .dd-user-name {
          font-family: 'Special Elite', cursive;
          font-size: 13px;
          color: #222;
          margin-bottom: 2px;
        }
        .dd-user-email {
          font-family: 'Caveat', cursive;
          font-size: 12px;
          color: #aaa;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .dd-section { padding: 5px 0; }
        .dd-section + .dd-section { border-top: 1px solid #e8e2d8; }

        .dd-item {
          display: flex; align-items: center; gap: 9px;
          padding: 7px 14px;
          font-family: 'Special Elite', cursive;
          font-size: 13px;
          color: #444;
          text-decoration: none;
          transition: background 0.1s;
          cursor: pointer;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
        }
        .dd-item:hover { background: rgba(0,0,0,0.03); }
        .dd-item.danger { color: #b05050; }
        .dd-item.danger:hover { background: #fdf0f0; }

        .dd-icon { width: 14px; height: 14px; color: #bbb; flex-shrink: 0; }
        .dd-item.danger .dd-icon { color: #d9a0a0; }

        @media (max-width: 600px) {
          .hdr-inner { padding: 0 16px; }
          .hdr-nav-link.hide-mobile { display: none; }
          .hdr-sep { display: none; }
        }
      `}</style>

      <header className="hdr">
        <div className="hdr-inner">

          <Link href="/" className="hdr-logo">TOEFLPrep</Link>

          <div className="hdr-right">
            {user ? (
              <>
                <Link href="/practice" className={`hdr-nav-link hide-mobile${pathname === '/practice' ? ' active' : ''}`}>
                  Practice Hub
                </Link>
                <Link href="/dashboard" className={`hdr-nav-link hide-mobile${pathname === '/dashboard' ? ' active' : ''}`}>
                  Dashboard
                </Link>

                <div style={{ width: 8 }} />

                <div className="hdr-dropdown-wrap" ref={dropdownRef}>
                  <button className="avatar-btn" onClick={() => setDropdownOpen(v => !v)}>
                    <div className="avatar-circle">{getInitials(user)}</div>
                    <span className="avatar-name">{getDisplayName(user)}</span>
                    <svg className={`avatar-chevron${dropdownOpen ? ' open' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {dropdownOpen && (
                    <div className="hdr-dropdown">
                      <div className="dd-user">
                        <div className="dd-user-name">{getDisplayName(user)}</div>
                        <div className="dd-user-email">{user.email}</div>
                      </div>
                      <div className="dd-section">
                        <Link href="/dashboard" className="dd-item" onClick={() => setDropdownOpen(false)}>
                          <svg className="dd-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                          Dashboard
                        </Link>
                        <Link href="/practice" className="dd-item" onClick={() => setDropdownOpen(false)}>
                          <svg className="dd-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          Practice Hub
                        </Link>
                        <Link href="/account" className="dd-item" onClick={() => setDropdownOpen(false)}>
                          <svg className="dd-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          My Account
                        </Link>
                      </div>
                      <div className="dd-section">
                        <button className="dd-item danger" onClick={handleSignOut}>
                          <svg className="dd-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <a href="#features" className="hdr-nav-link hide-mobile">Features</a>
                <a href="#pricing" className="hdr-nav-link hide-mobile">Pricing</a>
                <div className="hdr-sep hide-mobile" />
                <Link href="/auth?view=login" className="hdr-btn-ghost">Log in</Link>
                <Link href="/practice" className="hdr-btn-solid">Start free</Link>
              </>
            )}
          </div>

        </div>
      </header>
    </>
  )
}