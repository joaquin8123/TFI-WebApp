import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import MainPage from "./pages/MainPage";
import MyServicesPage from "./pages/MyServicesPage";
import AdminPage from "./pages/AdminServicePage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/home" element={<MainPage />} />
        <Route path="/services" element={<MyServicesPage />} />
      </Routes>
      <ToastContainer />
    </>
  );
};

export default App;
