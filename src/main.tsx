import { StrictMode, lazy } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ProtectedRoute, PublicRoute } from "./utils/middleware/accessAuth.tsx";
import Login from "./auth/Login.tsx";

const App = lazy(() => import("./App.tsx"));
const Home = lazy(() => import("./layout/Home.tsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.tsx"));
const InventoryList = lazy(() => import("./pages/InventoryList.tsx"));
const UserManagement = lazy(() => import("./pages/UserManagement.tsx"));
const HistoryList = lazy(() => import("./pages/HistoryList.tsx"));
const Settings = lazy(() => import("./pages/Settings.tsx"));
const ViewItem = lazy(() => import("./components/ViewItem.tsx"));
const Archive = lazy(() => import("./pages/Archive.tsx"));
const BorrowItem = lazy(() => import("./pages/BorrowItem.tsx"));
const PendingReservations = lazy(() => import("./pages/PendingReservations.tsx"));
const Registration = lazy(() => import("./pages/Registration.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

const routes = createBrowserRouter([
    // Public routes
    {
        path: "/",
        element: (
            <PublicRoute>
                <App />
            </PublicRoute>
        ),
        children: [
            {
                index: true,
                element: <Login />,
            },
        ],
    },
    // Protected Routes
    {
        path: "/home",
        element: (
            <ProtectedRoute>
                <Home />
            </ProtectedRoute>
        ),
        children: [
            {
                path: "dashboard",
                element: (
                    <Dashboard />
                ),
            },
            {
                path: "inventory-list",
                element: (
                    <InventoryList />
                ),
            },
            {
                path: "user-management",
                element: (
                    <UserManagement />
                ),
            },
            {
                path: "history-list",
                element: (
                    <HistoryList />
                ),
            },
            {
                path: "archive-table",
                element: (
                    <Archive />
                ),
            },
            {
                path: "borrow-item",
                element: (
                    <BorrowItem />
                ),
            },
            {
                path: "pending-reservations",
                element: (
                    <PendingReservations />
                ),
            },
            {
                path: "settings",
                element: (
                    <Settings />
                ),
            },
            {
                path: "registration-module",
                element: (
                    <Registration />
                ),
            },
        ],
    },

    {
        path: "/item/:id",
        element: (
            <ProtectedRoute>
                <ViewItem />
            </ProtectedRoute>
        ),
    },
    {
        path: "*",
        element: <NotFound />,
    },
]);

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={routes} />
        </QueryClientProvider>
    </StrictMode>,
);
