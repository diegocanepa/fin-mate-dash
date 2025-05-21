import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "./utils/supabase/middleware";

export async function middleware(req: NextRequest) {
  const reqUrl = new URL(req.url)
  const { res, session } = await updateSession(req)

  // Verificar si hay un usuario autenticado
  const isAuthenticated = !!session.data.user

  // Definir páginas públicas y protegidas
  const isLoginPage = reqUrl.pathname === "/sign-in"
  const isLandingPage = reqUrl.pathname === "/"

  // Lógica de redirección mejorada
  if (isLoginPage && isAuthenticated) {
    // Si el usuario ya está autenticado y está en la página de login, redirigir al dashboard
    return NextResponse.redirect(new URL("/", req.url))
  }

  if (!isAuthenticated) {
    // Si el usuario no está autenticado y está en la página de inicio, redirigir a la página de login
    return NextResponse.redirect(new URL("/sign-in", req.url))
  }

  if (!isAuthenticated && !isLoginPage && !isLandingPage) {
    // Si el usuario no está autenticado y está intentando acceder a una página protegida
    return NextResponse.redirect(new URL("/sign-in", req.url))
  }

  // En todos los demás casos, continuar con la solicitud
  return res
}

export const config = {
  matcher: [
    /*
     * Match all routes except:
     * - Auth callback route
     * - Sign-in page
     * - Public assets
     * - API routes that no requieren autenticación
     */
    "/((?!auth/callback|sign-in|_next/static|_next/image|favicon.ico|api/public|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
