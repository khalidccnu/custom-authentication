import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAuth from "./useAuth.js";

const axiosIns = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

const useAxiosSecure = () => {
  const { logOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    axiosIns.interceptors.request.use((config) => config);

    axiosIns.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err.response && [401, 403].includes(err.response.status)) {
          logOut().then(() => {
            sessionStorage.removeItem("_vu");
            navigate("/");
          });
        }

        return Promise.reject(err);
      },
    );
  }, [logOut, navigate, axiosIns]);

  return axiosIns;
};

export default useAxiosSecure;
