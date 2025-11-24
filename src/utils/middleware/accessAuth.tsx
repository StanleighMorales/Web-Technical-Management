import { Navigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import { getToken, removeToken } from "../token";
import logo from "../../assets/aclcLogo.webp"

interface RouteProps {
    children: React.ReactNode;
}

export const PublicRoute = ({ children }: RouteProps) => {
    const token = getToken()

    if (token) {
        return <Navigate to="/home/dashboard" replace />;
    }

    return <>{children}</>;
}

export const ProtectedRoute = ({ children }: RouteProps) => {
    const { loading, isAuthenticated } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-white">
                <img
                    src={logo}
                    alt="Aclc logo"
                    width={100}
                    height={150}
                    className="animate-pulse rounded-full"
                />
            </div>
        );
    }

    if (!isAuthenticated) {
        removeToken();
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};
