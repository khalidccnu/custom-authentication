import React from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { FaUpload } from "react-icons/fa";
import useAuth from "../hooks/useAuth.js";

const validateForm = (values) => {
  const errors = {};

  if (!values.name) errors.name = "Required";
  else if (values.name.length > 20)
    errors.name = "Must be 20 characters or less";

  if (!values.phone) errors.phone = "Required";
  else if (isNaN(values.phone)) errors.phone = "Must be numbers";
  else if (values.phone.length !== 10) errors.phone = "Must be 10 numbers";

  if (!values.email) errors.email = "Required";
  else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email))
    errors.email = "Invalid email address";

  if (!values.password) errors.password = "Required";
  else if (values.password.length < 8)
    errors.password = "Must be 8 characters or up";

  if (!values.userImg) errors.userImg = "Required";

  return errors;
};

const Signup = () => {
  const { isUserLoading, setUserLoading, createUser } = useAuth();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: "",
      phone: "",
      email: "",
      password: "",
      userImg: null,
    },
    validate: validateForm,
    onSubmit: (values) => {
      createUser(values)
        .then(() => {
          navigate("/success");
          toast.success("Your account has been created successfully!");
        })
        .catch((err) => {
          setUserLoading(false);
          toast.error(err.response.data.message);
        });
    },
  });

  return (
    <div className="modal-box max-w-sm">
      <div className={`flex justify-between items-center`}>
        <div>
          <h3 className="font-bold text-lg">Sign Up</h3>
          <p className="text-gray-500">It's quick and easy.</p>
        </div>
        <form method="dialog">
          <button className="btn focus:outline-0">Close</button>
        </form>
      </div>
      <form
        onSubmit={formik.handleSubmit}
        className="form-control grid grid-cols-1 gap-4 mt-5"
      >
        <div className="flex flex-col gap-0.5">
          <input
            type="text"
            placeholder="Name"
            name="name"
            className="input input-sm input-bordered rounded w-full focus:outline-0"
            value={formik.values.name}
            onChange={formik.handleChange}
          />
          {formik.errors.name ? (
            <small className="text-red-600 ml-0.5">{formik.errors.name}</small>
          ) : null}
        </div>
        <div className="flex flex-col gap-0.5">
          <div className="join">
            <span className="join-item input input-sm input-bordered rounded-l">
              +880
            </span>
            <input
              type="text"
              placeholder="1711223344"
              name="phone"
              className="join-item input input-sm input-bordered rounded-r w-full focus:outline-0"
              value={formik.values.phone}
              onChange={formik.handleChange}
            />
          </div>
          {formik.errors.phone ? (
            <small className="text-red-600 ml-0.5">{formik.errors.phone}</small>
          ) : null}
        </div>
        <div className="flex flex-col gap-0.5">
          <input
            type="email"
            placeholder="Email"
            name="email"
            className="input input-sm input-bordered rounded w-full focus:outline-0"
            value={formik.values.email}
            onChange={formik.handleChange}
          />
          {formik.errors.email ? (
            <small className="text-red-600 ml-0.5">{formik.errors.email}</small>
          ) : null}
        </div>
        <div className="flex flex-col gap-0.5">
          <input
            type="password"
            placeholder="New password"
            name="password"
            className="input input-sm input-bordered rounded w-full focus:outline-0"
            value={formik.values.password}
            onChange={formik.handleChange}
          />
          {formik.errors.password ? (
            <small className="text-red-600 ml-0.5">
              {formik.errors.password}
            </small>
          ) : null}
        </div>
        <div>
          <input
            type="file"
            name="userImg"
            id="userImg"
            className="hidden"
            accept="image/*"
            onChange={(e) =>
              formik.setFieldValue("userImg", e.currentTarget.files[0])
            }
          />
          <label
            htmlFor="userImg"
            className="btn btn-sm w-full bg-transparent hover:bg-blue-500 text-blue-500 hover:text-white !border-blue-500 rounded normal-case"
          >
            {formik.values.userImg ? (
              formik.values.userImg.name?.substring(
                0,
                formik.values.userImg.name?.lastIndexOf("."),
              )
            ) : (
              <>
                <span>Choose profile photo</span>
                <FaUpload />
              </>
            )}
          </label>
          {formik.errors.userImg ? (
            <small className="text-red-600 ml-0.5">
              {formik.errors.userImg}
            </small>
          ) : null}
        </div>
        <button
          type="submit"
          className="btn btn-sm w-full bg-blue-500 hover:bg-transparent text-white hover:text-blue-500 !border-blue-500 rounded normal-case"
        >
          <span>Signup</span>
          {isUserLoading ? (
            <span
              className="inline-block h-4 w-4 border-2 border-current border-r-transparent rounded-full animate-spin"
              role="status"
            ></span>
          ) : null}
        </button>
      </form>
    </div>
  );
};

export default Signup;
