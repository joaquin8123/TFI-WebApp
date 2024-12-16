import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import ServicesTable from "../components/ServicesTable";
import { useNavigate } from "react-router-dom";
import { getServicesByUserId } from "../service/userService";
import { createReview } from "../service/reviewService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MyServicesPage = () => {
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const { services } = await getServicesByUserId(parseInt(userId));

        const formattedServices = services.map((service) => ({
          id: service.serviceId,
          shop: service.storeName,
          services: service.serviceName,
          amount: parseFloat(service.servicePrice),
          date: new Date(service.date).toLocaleDateString(),
          status: service.status.toLowerCase(),
          rating: service.rating,
          storeId: service.store_id,
        }));
        setServices(formattedServices);
      } catch (error) {
        console.error("Error al obtener los servicios:", error);
        alert("No se pudieron cargar los servicios.");
      }
    };

    fetchServices();
  }, []);

  const handleRateService = async (storeId, serviceId, rating) => {
    setServices((prevServices) =>
      prevServices.map((service) =>
        service.id === serviceId ? { ...service, rating } : service
      )
    );
    const userId = localStorage.getItem("userId");
    await createReview(storeId, parseInt(userId), serviceId, rating);
    toast.success("¡Valoración realizada con éxito!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  return (
    <div className="flex flex-col h-screen">
      <Header
        onLogout={() => {
          localStorage.removeItem("userId");
          localStorage.removeItem("token");
          localStorage.removeItem("storeId");
          navigate("/");
        }}
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
