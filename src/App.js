import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import MainPage from './pages/MainPage';
import MyServicesPage from './pages/MyServicesPage';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<MainPage />} />
      <Route path="/services" element={<MyServicesPage />} />
    </Routes>
  );
};

export default App;
