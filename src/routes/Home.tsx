import Sidebar from "../components/Sidebar";
import { Outlet } from "@tanstack/react-router";
import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminNotificationListener from "../components/AdminNotificationListener";
import { UserData } from "../utils/usersData/userData";

function HomeContent() {
  const { isSidebarExpanded } = useSidebar();
  const userData = UserData();

  const isAdminOrStaff =
    userData.userRole === "Admin" || userData.userRole === "Staff";

  return (
    <div className="layout-container relative flex min-h-[100vh] w-full">
      {/* Toast notifications container with custom styling */}
      <ToastContainer
        position="top-right"
        autoClose={8000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        limit={3}
        style={{ zIndex: 9999 }}
        toastStyle={{
          backgroundColor: "#fff",
          color: "#1f2937",
          fontSize: "15px",
          fontWeight: "500",
          borderRadius: "12px",
          boxShadow: "0 10px 25px rgba(249, 115, 22, 0.3)",
          border: "2px solid #fb923c",
        }}
        progressClassName="toast-progress-orange"
      />

      {/* Mount notification listener for Admin/Staff only */}
      {isAdminOrStaff && <AdminNotificationListener />}

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
