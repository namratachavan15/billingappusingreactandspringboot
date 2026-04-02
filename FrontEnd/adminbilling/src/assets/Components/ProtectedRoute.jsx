import { Navigate } from "react-router-dom";
import { useAuth } from "./States/AuthContext";

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) return null; // or spinner

  if (!user) return <Navigate to="/login" />;

  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;

  return children;
};

export default ProtectedRoute;
