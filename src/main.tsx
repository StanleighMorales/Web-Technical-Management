import { StrictMode, lazy, Suspense } from "react";
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
const Registration = lazy(() => import("./pages/Registration.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

import { DashboardSkeletonLoader } from "./loader/DashboardSkeletonLoader.tsx";
import InventoryListSkeletonLoader from "./loader/InventoryListSkeletonLoader.tsx";
import { UserSkeletonLoader } from "./loader/UserSkeletonLoader.tsx";
import HistoryListSkeletonLoader from "./loader/HistoryListSkeletonLoader.tsx";
import ArchiveSkeletonLoader from "./loader/ArchiveSkeletonLoader.tsx";
import SettingsSkeletonLoader from "./loader/SettingsSkeletonLoader.tsx";
import BorrowItemSkeletonLoader from "./loader/BorrowItemSkeletonLoader.tsx";
import RegistrationModuleSkeletonLoader from "./loader/RegistrationModuleSkeletonLoader.tsx";

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
        element:
          <Login />
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
        path: "dashboard", element:
          <Suspense fallback={<DashboardSkeletonLoader />}>
            <Dashboard />
          </Suspense>
      },
      {
        path: "inventory-list", element:
          <Suspense fallback={<InventoryListSkeletonLoader />}>
            <InventoryList />
          </Suspense>

      },
      {
        path: "user-management", element:
          <Suspense fallback={<UserSkeletonLoader />}>
            <UserManagement />
          </Suspense>
      },
      {
        path: "history-list", element:
          <Suspense fallback={<HistoryListSkeletonLoader />}>
            <HistoryList />
          </Suspense>
      },
      {
        path: "archive-table", element:
          <Suspense fallback={<ArchiveSkeletonLoader />}>
            <Archive />
          </Suspense>
      },
      {
        path: "borrow-item", element:
          <Suspense fallback={<BorrowItemSkeletonLoader />}>
            <BorrowItem />
          </Suspense>
      },
      {
        path: "settings", element:
          <Suspense fallback={<SettingsSkeletonLoader />}>
            <Settings />
          </Suspense>
      },
      {
        path: "registration-module", element:
          <Suspense fallback={<RegistrationModuleSkeletonLoader />}>
            <Registration />
          </Suspense>
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
