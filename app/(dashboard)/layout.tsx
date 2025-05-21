import Footer from "@/components/footer";
import { MainNav } from "@/components/layout/main-nav";
import { MobileHeader } from "@/components/layout/mobile-header";
import { SidebarAwareContent } from "@/components/layout/sidebar-aware-content";
import { SidebarProvider } from "@/lib/sidebar-context";
import { VisibilityProvider } from "@/lib/visibility-context";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (

        <VisibilityProvider>
            <SidebarProvider>
                {/* Sidebar para desktop */}
                <MainNav />
                {/* Contenido principal */}
                <SidebarAwareContent>
                    {/* Header para móvil */}
                    <MobileHeader />
                    <div className="p-4 lg:p-6">
                    {children}
                    </div>
                    <Footer />
                </SidebarAwareContent>
            </SidebarProvider>
        </VisibilityProvider>

    )
};
