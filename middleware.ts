import { type NextRequest, NextResponse } from "next/server"
import { verifySession } from "@/lib/auth-service"

// Add paths that should be public
const publicPaths = ["/_next", "/favicon.ico", "/api/auth/login", "/api/auth/session"]

export async function middleware(request: NextRequest) {
  // Check if the path should be accessible without authentication
  const { pathname } = request.nextUrl
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // For API routes, verify session
  if (pathname.startsWith("/api/")) {
    const isAuthenticated = await verifySession()
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.next()
  }

  // For page routes, let the client-side auth handle it
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all API routes except auth-related ones
     * Match all page routes
     */
    "/api/:path*",
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
