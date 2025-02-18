import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";

const AuthenticatedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  // Ensure authentication check completes before rendering
  useEffect(() => {
    if (!loading) {
      setIsAuthChecked(true);
    }
  }, [loading]);

  // Show a loading state while checking authentication
  if (!isAuthChecked) {
    return <p>Loading...</p>; // Replace with a proper loading spinner if needed
  }

  // If user is logged in and tries to access auth pages, redirect to home
  if (
    user &&
    ["/login", "/signup", "/forgot-password"].includes(location.pathname)
  ) {
    return <Navigate to="/" replace />;
  }

  // If user is not logged in and tries to access a protected route, redirect to login
  if (
    !user &&
    !["/login", "/signup", "/forgot-password"].includes(location.pathname)
  ) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AuthenticatedRoute;
