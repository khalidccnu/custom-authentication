import React from "react";
import useSWR from "swr";
import useAuth from "./useAuth.js";
import useAxiosSecure from "./useAxiosSecure.js";

const useUser = () => {
  const { isUserLoading, user: userId } = useAuth();
  const axiosSecure = useAxiosSecure();

  const fetcher = (url) =>
    axiosSecure.get(url).then((response) => response.data);

  const { isLoading, data: user = null } = useSWR(
    !isUserLoading && userId ? `/users/${userId}` : null,
    fetcher,
  );

  return {
    isLoading,
    user,
  };
};

export default useUser;
