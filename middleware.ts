import { createClient } from '@/lib/supabase/middleware'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request)
  const { data: { user } } = await supabase.auth.getUser()

  if (user && request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (!user && ['/dashboard', '/practice'].includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/auth?view=login', request.url))
  }

  return response
}

export const config = {
  matcher: ['/', '/dashboard', '/practice'],
}