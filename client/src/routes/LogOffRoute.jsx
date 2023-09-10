import React from "react";
import { Navigate } from "react-router-dom";

const LogOffRoute = ({ children }) => {
  const isValidUser = sessionStorage.getItem("_vu");

  return !isValidUser ? children : <Navigate to="/success" />;
};

export default LogOffRoute;
