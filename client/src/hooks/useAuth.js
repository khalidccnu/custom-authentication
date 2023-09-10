import React, { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider.jsx";

const useAuth = () => useContext(AuthContext);

export default useAuth;
