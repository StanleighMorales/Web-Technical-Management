import { createRoute, createRootRoute } from "@tanstack/react-router";

import App from "../App";
import Login from "./auth/Login";
import Dashboard from "./Dashboard";
import Home from "./Home";
import InventoryList from "./InventoryList";
import UserManagement from "./UserManagement";
import HistoryList from "./HistoryList";
import Archive from "./Archive";
import BorrowItem from "./BorrowItem";
import PendingReservations from "./PendingReservations";
import Settings from "./Settings";
import Registration from "./Registration";
import { ProtectedRoute, PublicRoute } from "../utils/middleware/accessAuth";
import ViewItem from "../components/ViewItem";

export const Route = createRootRoute({
    component: App,
});

const indexRoute = createRoute({
    getParentRoute: () => Route,
    path: "/",
    component: () => (
        <PublicRoute>
            <Login />,
        </PublicRoute>
    )
});

const homeRoute = createRoute({
    getParentRoute: () => Route,
    path: "home",
    component: () => (
        <ProtectedRoute>
            <Home />
        </ProtectedRoute>
    ),
});

const DashboardRoute = createRoute({
    getParentRoute: () => homeRoute,
    path: "dashboard",
    component: Dashboard,
});

const InventoryListRoute = createRoute({
    getParentRoute: () => homeRoute,
    path: "inventory-list",
    component: InventoryList,
});

const UserManagementRoute = createRoute({
    getParentRoute: () => homeRoute,
    path: "user-management",
    component: UserManagement,
});

const HistoryListRoute = createRoute({
    getParentRoute: () => homeRoute,
    path: "history-list",
    component: HistoryList,
});

const ArchiveRoute = createRoute({
    getParentRoute: () => homeRoute,
    path: "archive-table",
    component: Archive,
});

const BorrowItemRoute = createRoute({
    getParentRoute: () => homeRoute,
    path: "borrow-item",
    component: BorrowItem,
});

const PendingReservationRoute = createRoute({
    getParentRoute: () => homeRoute,
    path: "pending-reservations",
    component: PendingReservations,
});

const SettingsRoute = createRoute({
    getParentRoute: () => homeRoute,
    path: "settings",
    component: Settings,
});

const RegistrationModuleRoute = createRoute({
    getParentRoute: () => homeRoute,
    path: "registration-module",
    component: Registration,
});

export const ViewItemRoute = createRoute({
    getParentRoute: () => homeRoute,
    path: "item/$id",
    component: ViewItem
})

export const routeTree = Route.addChildren([
    indexRoute,
    homeRoute.addChildren([
        DashboardRoute,
        InventoryListRoute,
        UserManagementRoute,
        HistoryListRoute,
        ArchiveRoute,
        BorrowItemRoute,
        PendingReservationRoute,
        SettingsRoute,
        RegistrationModuleRoute,
        ViewItemRoute
    ]),
]);
