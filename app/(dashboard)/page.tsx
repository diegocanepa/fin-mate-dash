'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ENVIRONMENT } from "@/lib/supabase";
import { createClient } from "@/utils/supabase/client";
import { FileCode, LogOut } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";

export default function DashboardPage() {
    // Verificar si estamos en un entorno de cliente o servidor
    const environment =
        typeof window !== "undefined"
            ? window.localStorage.getItem("ENVIRONMENT") || ENVIRONMENT || "prod"
            : ENVIRONMENT || "prod";
    const supabase = createClient();

    const handleSignOut = () => {
        // Aquí puedes agregar la lógica para cerrar sesión
        supabase.auth.signOut();
        redirect("/auth/signin");
    }

    return (
        <div className="flex flex-col">
            <div className="flex items-center justify-between space-y-2 py-4">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard Financiero</h2>
            </div>

            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Bienvenido a FinMate</CardTitle>
                    <CardDescription>Tu asistente financiero personal</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-10">
                    <div className="mb-6 relative">
                        <Image
                            src="/images/finmate-logo.png"
                            alt="FinMate Logo"
                            width={150}
                            height={150}
                            className="animate-pulse"
                        />
                    </div>
                    <div className="text-center max-w-md">
                        <h3 className="text-xl font-medium mb-2">Gestiona tus finanzas con facilidad</h3>
                        <p className="text-muted-foreground mb-6">
                            FinMate te ayuda a rastrear tus gastos, inversiones y ahorros en un solo lugar. Accede a las diferentes
                            secciones desde el menú de navegación.
                        </p>
                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                            <FileCode className="h-4 w-4" />
                            <span>Versión en desarrollo - Entorno: {environment.toUpperCase()}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <div className="fixed bottom-4 right-4 z-50">
                <Button variant="outline" size="sm" onClick={handleSignOut} className="flex items-center gap-2">
                    <LogOut className="h-4 w-4" />
                    <span>Cerrar sesión</span>
                </Button>
            </div>
        </div>
    )
};
