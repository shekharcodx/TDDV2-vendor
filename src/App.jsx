import React from "react";

import Layout from "@/pages/layout/Layout";
import Profile from "@/pages/profile/Profile";
import CreateCar from "@/pages/Cars/CreateCar";
import DashboardPage from "@/pages/dash/DashboardPage";
import Cards from "@/pages/dash/Cards";
import { useRoutes } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import UserForm from "@/pages/spam/UserForm";
import Unauthorized from "@/components/unauthorised";
import ErrorPage from "@/components/ErrorPage";
import DetailsForm from "@/pages/signup/DetailsForm";
import SignupForm from "@/pages/signup/SignupForm";
import AllCars from "@/pages/Cars";
import Login from "@/pages/Login/Login";
import ForgetPassword from "@/pages/ForgetPassword/Forgetpass";
import Resetpass from "@/pages/ResetPassword/Resetpass";
import ChangePass from "@/pages/ChangePassword/ChangePass";
import EditCar from "./pages/Cars/EditCar";
// Optional: Keep only if used in future

import Details from "./pages/signup/DetailsForm";
import PagesLayout from "./pages/layout/PagesLayout";
import ViewCar from "./pages/Cars/ViewCar";
import Booking from "./pages/bookings";

// 🔧 FIX: Import missing UserForm if it's created
// import UserForm from "./pages/spam/UserForm"; // ← Only if this file exists

function App() {
  const routes = [
    {
      path: "/",
      element: <ProtectedRoute redirect={"/login"} />,
      children: [
        {
          path: "/",
          element: <Layout />,
          children: [
            { index: true, element: <DashboardPage /> },
            { path: "profile", element: <Profile /> },
            { path: "user-form", element: <UserForm /> },
            { path: "bookings", element: <Booking /> },
            {
              path: "/cars",
              element: <PagesLayout />,
              children: [
                { index: true, element: <AllCars /> },
                { path: "view/:id", element: <ViewCar /> },
                {
                  path: "create",
                  element: <CreateCar />,
                },
                {
                  path: "edit",
                  element: <EditCar />,
                },
              ],
            },
            // { path: "my-listings", element: <AllListings /> },
            // { path: "/edit", element: <EditCar /> },
            { path: "card", element: <Cards /> },
          ],
        },
      ],
    },

    { path: "/unauthorized", element: <Unauthorized /> },
    { path: "/login", element: <Login /> },
    { path: "/forget-password", element: <ForgetPassword /> },
    { path: "/register", element: <SignupForm /> },
    { path: "/register-details", element: <DetailsForm /> },
    { path: "*", element: <ErrorPage /> },
    { path: "/reset-password", element: <Resetpass /> },
    { path: "/change-password", element: <ChangePass /> },
  ];

  return useRoutes(routes);
}

export default App;
