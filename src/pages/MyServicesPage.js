import React, { useState } from "react";
import Header from "../components/Header";
import ServicesTable from "../components/ServicesTable";
import { useNavigate } from "react-router-dom";

const MyServicesPage = () => {
  const [services, setServices] = useState([
    {
      id: 1,
      shop: "Taller Juan",
      services: "Cambio de aceite",
      amount: 1500,
      date: "2024-12-01",
      status: "finalizado",
      rating: null,
    },
    {
      id: 2,
      shop: "AutoFix Rosario",
      services: "Revisión general",
      amount: 5000,
      date: "2024-11-30",
      status: "pendiente",
      rating: null,
    },
  ]);

  const handleRateService = (serviceId, rating) => {
    setServices((prevServices) =>
      prevServices.map((service) =>
        service.id === serviceId ? { ...service, rating } : service
      )
    );
    alert(`Has valorado el servicio ${serviceId} con ${rating} estrellas.`);
  };

  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen">
      <Header
        onLogout={() => alert("Cerrar Sesión")}
        onUpdateAccount={() => alert("Actualizar Datos")}
      />
      <ServicesTable services={services} onRateService={handleRateService} />
      <div className="flex justify-center mt-4">
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-500 text-white text-sm px-6 py-3 rounded"
        >
          Volver
        </button>
      </div>
    </div>
  );
};

export default MyServicesPage;
