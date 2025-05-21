import { createClient } from "@/utils/supabase/server";

export default async function Footer() {
    
    const client = await createClient();
    const user = await client.auth.getUser();

    return (
        <footer className="border-t py-4">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
                <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                    © 2025 FinMate - Todos los derechos reservados. <span>- Usuario: {user.data.user && user.data.user?.user_metadata.name}</span>
                    {process.env.ENVIRONMENT && process.env.ENVIRONMENT.toLowerCase() !== "prod" && (
                        <span className="ml-2 text-xs text-warning">
                            ({process.env.ENVIRONMENT.toUpperCase()})
                        </span>
                    )}
                </p>
            </div>
        </footer>
    )
};
