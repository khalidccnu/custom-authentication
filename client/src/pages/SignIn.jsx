import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import useAuth from "../hooks/useAuth.js";
import Signup from "../components/Signup.jsx";

const validateForm = (values) => {
  const errors = {};

  if (!values.phone) errors.phone = "Required";
  else if (isNaN(values.phone)) errors.phone = "Must be numbers";
  else if (values.phone.length !== 10) errors.phone = "Must be 10 numbers";

  if (!values.password) errors.password = "Required";
  else if (values.password.length < 8)
    errors.password = "Must be 8 characters or up";

  return errors;
};

const SignIn = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isUserLoading, setUserLoading, signIn } = useAuth();
  const fromURL = location.state?.fromURL.pathname;

  const formik = useFormik({
    initialValues: {
      phone: "",
      password: "",
    },
    validate: validateForm,
    onSubmit: (values, formikHelpers) => {
      signIn(values)
        .then((response) => {
          toast.success(response.data.message);
          navigate(fromURL || "/success");
        })
        .catch((err) => {
          setUserLoading(false);

          formikHelpers.resetForm();
          toast.error(err.response.data.message);
        });
    },
  });

  useEffect(() => {
    if (fromURL)
      toast.error(
        "Only registered user can access this page. Please, login first!",
      );
  }, []);

  return (
    <section className="py-10">
      <div className="container">
        <div className="card sm:max-w-sm sm:mx-auto bg-sky-100">
          <div className="card-body">
            <form
              className="form-control gap-y-4"
              onSubmit={formik.handleSubmit}
            >
              <div className="flex flex-col gap-1">
                <div className="join">
                  <span className="join-item input input-sm input-bordered border-blue-500 rounded-l text-blue-500">
                    +880
                  </span>
                  <input
                    type="text"
                    placeholder="1711223344"
                    name="phone"
                    className="join-item input input-sm input-bordered border-blue-500 rounded-r w-full focus:outline-0 text-blue-500"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                  />
                </div>
                {formik.errors.phone ? (
                  <small className="text-red-600 ml-0.5">
                    {formik.errors.phone}
                  </small>
                ) : null}
              </div>
              <div className="flex flex-col gap-1">
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  className="input input-sm input-bordered border-blue-500 rounded w-full focus:outline-0 text-blue-500"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                />
                {formik.errors.password ? (
                  <small className="text-red-600 ml-0.5">
                    {formik.errors.password}
                  </small>
                ) : null}
              </div>
              <button
                type="submit"
                className="btn btn-sm w-full bg-blue-500 hover:bg-transparent text-white hover:text-blue-500 !border-blue-500 rounded normal-case"
              >
                <span>SignIn</span>
                {isUserLoading ? (
                  <span
                    className="inline-block h-4 w-4 border-2 border-current border-r-transparent rounded-full animate-spin"
                    role="status"
                  ></span>
                ) : null}
              </button>
              <div className="flex flex-col lg:flex-row lg:justify-center lg:space-x-2">
                <span>New?</span>
                <span
                  className="text-blue-500 hover:text-blue-500/70 w-fit cursor-pointer transition-colors duration-500"
                  onClick={() => window.signup_modal.showModal()}
                >
                  Create New Account
                </span>
              </div>
            </form>
          </div>
        </div>
        <dialog id="signup_modal" className="modal">
          <Signup />
        </dialog>
      </div>
    </section>
  );
};

export default SignIn;
