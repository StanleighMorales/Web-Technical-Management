import Sidebar from "../components/Sidebar"
import { Outlet } from "react-router-dom"
import { SidebarProvider, useSidebar } from "../context/SidebarContext"

function HomeContent() {
    const { isSidebarExpanded } = useSidebar();

    return (
        <div className="layout-container relative flex min-h-[100vh] w-full">
            {/* Sidebar component for navigation */}
            <Sidebar />
            {/* Main content area with left margin to account for fixed sidebar */}
            <main
                className={`flex-1 w-full transition-all duration-300 ${isSidebarExpanded ? "lg:ml-[270px]" : "lg:ml-[75px]"
                    }`}
            >
                <Outlet />
            </main>
        </div>
    );
}

export default function Home() {
    return (
        <SidebarProvider>
            <HomeContent />
        </SidebarProvider>
    );
}
