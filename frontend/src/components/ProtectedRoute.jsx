import { useAuth } from "../admin/hook/useAuth";
import { Navigate } from "react-router";

const ProtectedRoute = ({ children, redirectTo = "/admin/login" }) => {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-primary-black">
        <p className="text-[#c9a84c] font-playfair text-xl animate-pulse">
          Loading...
        </p>
      </div>
    );
  }

  if (!isAdmin) return <Navigate to={redirectTo} replace />;
  return children;
};

export default ProtectedRoute;
