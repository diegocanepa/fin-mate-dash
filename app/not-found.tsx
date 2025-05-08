import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h2 className="text-3xl font-bold mb-4">Página no encontrada</h2>
      <p className="text-muted-foreground mb-8">Lo sentimos, la página que estás buscando no existe.</p>
      <Link
        href="/"
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
      >
        Volver al inicio
      </Link>
    </div>
  )
}
