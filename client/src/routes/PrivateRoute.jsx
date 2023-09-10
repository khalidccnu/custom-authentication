import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";

const PrivateRoute = ({ children }) => {
  const { isUserLoading, user } = useAuth();
  const location = useLocation();

  return !isUserLoading ? (
    user ? (
      children
    ) : (
      <Navigate to="/" state={{ fromURL: location }}></Navigate>
    )
  ) : null;
};

export default PrivateRoute;
