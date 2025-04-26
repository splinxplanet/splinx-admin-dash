import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, token } = useContext(AuthContext);

  // If no user or token, redirect to login
  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  // If user role is not in the allowedRoles, redirect to unauthorized page
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If authenticated and role is allowed, allow access to the route
  return children;
};

export default ProtectedRoute;
