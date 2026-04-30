import { Navigate } from "@tanstack/react-router";
import { useAuth } from "../../routes/auth/useAuth";
import { getToken, removeToken } from "../token";
import newAclcLogo from "../../assets/newAclcLogo.webp"

interface RouteProps {
  children: React.ReactNode;
}

export const PublicRoute = ({ children }: RouteProps) => {
  const token = getToken();

  if (token) {
    return <Navigate to="/home/dashboard" replace />;
  }

  return <>{children}</>;
};

export const ProtectedRoute = ({ children }: RouteProps) => {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <img
          src={newAclcLogo}
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
