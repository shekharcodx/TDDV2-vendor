import React from "react";

import Layout from "@/pages/layout/Layout";
import Profile from "@/pages/profile/Profile";
import CarListing from "@/pages/mycar/CarListing";
import DashboardPage from "@/pages/mycar/DashboardPage";
import Cards from "@/pages/dash/Cards";
import { useRoutes } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import UserForm from "@/pages/spam/UserForm";
import Unauthorized from "@/components/unauthorised";
import ErrorPage from "@/components/ErrorPage";
import DetailsForm from "./pages/signup/DetailsForm";
import SignupForm from "./pages/signup/SignupForm";
import AllListings from "./pages/mycar/AllListings";
import Login from "./pages/signup/Login";
import ForgetPassword from "./pages/signup/Forgetpass";
import Resetpass from "./pages/signup/Resetpass";
import ChangePass from "@/pages/signup/ChangePass";
import EditCar from "./pages/mycar/EditCar";
// Optional: Keep only if used in future

import Details from "./pages/signup/DetailsForm";

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
            { path: "create-listing", element: <CarListing /> },
            { path: "my-listings", element: <AllListings /> },
             { path: "/edit", element: <EditCar /> },
            { path: "card", element: <Cards /> },
          ],
        },
      ],
    },

    { path: "/unauthorized", element: <Unauthorized /> },
    { path: "/login", element: <Login /> },
    { path: "/Forget-pass", element: <ForgetPassword /> },
    { path: "/register", element: <SignupForm /> },
    { path: "/details", element: <DetailsForm /> },
    { path: "*", element: <ErrorPage /> },
    { path: "/reset-pass", element: <Resetpass /> },
    { path: "/change-password", element: <ChangePass /> },
  ];

  return useRoutes(routes);

  // <Router>
  //   <Routes>
  //     <Route path="/" element={<Layout />}>
  //        <Route index element={<DashboardPage/>} />
  //       <Route path="/profile" element={<Profile />} />
  //       {/* Uncomment the next line if UserForm is implemented and imported */}
  //       {/* <Route path="user-form" element={<UserForm />} /> */}
  //       <Route path="car-listing" element={<CarListing />} />
  //       <Route path="admin-car" element={<CarListing />} />
  //       <Route path="/car-listing" element={<CarListing />} />
  //       <Route path="/card" element={<Cards />} />
  //       <Route path="/DashboardPage" element={<DashboardPage />} />
  //     </Route>
  //   </Routes>
  // </Router>
}

export default App;
