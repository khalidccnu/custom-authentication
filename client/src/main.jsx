import "regenerator-runtime/runtime";

import React from "react";
import ReactDOM from "react-dom/client";
import { IKContext } from "imagekitio-react";
import { ToastContainer } from "react-toastify";
import App from "./App.jsx";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <IKContext
      urlEndpoint={`https://ik.imagekit.io/${import.meta.env.VITE_IK_ID}`}
    >
      <App />
    </IKContext>
    <ToastContainer />
  </React.StrictMode>,
);
