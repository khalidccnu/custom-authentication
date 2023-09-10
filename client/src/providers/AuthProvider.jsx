import React, { createContext, useEffect, useState } from "react";
import useAxiosIns from "../hooks/useAxiosIns.js";

export const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
  const axiosIns = useAxiosIns();
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isUserLoading, setUserLoading] = useState(true);
  const [user, setUser] = useState(null);

  const signIn = (values) => {
    setUserLoading(true);

    return axiosIns.post(`/signin`, values).then((response) => {
      setLoggedIn(!isLoggedIn);
      return response;
    });
  };

  const createUser = async (values) => {
    setUserLoading(true);

    let userImg;
    const formData = new FormData();
    formData.append("userImg", values.userImg);

    await axiosIns
      .post(`/users/upload`, formData)
      .then((response) => (userImg = response.data.filePath));

    return axiosIns
      .post(`/signup`, { ...values, userImg })
      .then(() => setLoggedIn(!isLoggedIn));
  };

  const logOut = () => {
    return axiosIns.get("/signout").then((response) => {
      setLoggedIn(!isLoggedIn);
      return response;
    });
  };

  const authInfo = {
    isUserLoading,
    setUserLoading,
    user,
    signIn,
    createUser,
    logOut,
  };

  useEffect(() => {
    (async () => {
      const response = await axiosIns
        .get(`/loggedIn`)
        .then((response) => response.data._id);

      if (response) {
        setUser(response);
        sessionStorage.setItem("_vu", JSON.stringify(true));
      } else {
        setUser(null);
      }

      setUserLoading(false);
    })();
  }, [isLoggedIn]);

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
