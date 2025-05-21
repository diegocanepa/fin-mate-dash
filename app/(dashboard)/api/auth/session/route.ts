import { NextResponse } from "next/server"
import { verifySession } from "@/lib/auth-service"

export async function GET() {
  try {
    const isAuthenticated = await verifySession()
    return NextResponse.json({ authenticated: isAuthenticated })
  } catch (error) {
    console.error("Session verification error:", error)
    return NextResponse.json({ error: "An unexpected error occurred", authenticated: false }, { status: 500 })
  }
}
