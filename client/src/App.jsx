import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthProvider from "./providers/AuthProvider.jsx";
import LogOffRoute from "./routes/LogOffRoute.jsx";
import PrivateRoute from "./routes/PrivateRoute.jsx";
import Root from "./Root.jsx";
import SignIn from "./pages/SignIn.jsx";
import Success from "./pages/Success.jsx";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <AuthProvider>
          <Root />
        </AuthProvider>
      ),
      children: [
        {
          index: true,
          element: (
            <LogOffRoute>
              <SignIn />
            </LogOffRoute>
          ),
        },
        {
          path: "success",
          element: (
            <PrivateRoute>
              <Success />
            </PrivateRoute>
          ),
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
