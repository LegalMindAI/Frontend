import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session')
  const path = request.nextUrl.pathname

  // Protect /chat route
  if (path.startsWith('/chat') && !session) {
    // Redirect to the home page with a query parameter to show the login modal
    return NextResponse.redirect(new URL('/?login=true', request.url))
  }

  return NextResponse.next()
}

// Define which routes this middleware applies to
export const config = {
  matcher: ['/chat/:path*'],
} 