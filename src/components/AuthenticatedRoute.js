import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // Adjust the path to your AuthContext

const AuthenticatedRoute = ({ children }) => {
  const { user } = useAuth();

  // If user is authenticated, render the children, otherwise redirect to login
  return user ? children : <Navigate to="/login" />;
};

export default AuthenticatedRoute;
