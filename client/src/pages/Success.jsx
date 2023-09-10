import React from "react";
import { useNavigate } from "react-router-dom";
import { IKImage } from "imagekitio-react";
import { FaEnvelope } from "react-icons/fa";
import useAuth from "../hooks/useAuth.js";
import useUser from "../hooks/useUser.js";
import { toast } from "react-toastify";

const Success = () => {
  const navigate = useNavigate();
  const { logOut } = useAuth();
  const { user } = useUser();
  const { name, email, userImg } = user ?? {};

  const handleLogout = () => {
    logOut().then((response) => {
      toast.success(response.data.message);
      sessionStorage.removeItem("_vu");
      navigate("/");
    });
  };

  return (
    <section className="py-10">
      <div className="container">
        <div className="card sm:max-w-sm sm:mx-auto bg-sky-100">
          <div className="card-body text-center">
            <figure
              className={`w-16 h-16 rounded-full mx-auto overflow-hidden`}
            >
              <IKImage path={userImg} alt={``} className={`w-full h-full`} />
            </figure>
            <div className={`my-3`}>
              <h3>{name}</h3>
              <p className={`flex justify-center items-center space-x-1`}>
                <FaEnvelope />
                <span>{email}</span>
              </p>
            </div>
            <button
              type="button"
              className="btn btn-sm w-fit mx-auto bg-blue-500 hover:bg-transparent text-white hover:text-blue-500 !border-blue-500 rounded normal-case"
              onClick={handleLogout}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Success;
