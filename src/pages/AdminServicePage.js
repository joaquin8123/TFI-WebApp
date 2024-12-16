import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import { getServicesByStoreId } from "../service/userService";
import { updateServiceStatus } from "../service/storeService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const AdminServicePage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const storeId = localStorage.getItem("storeId");
        const data = await getServicesByStoreId(parseInt(storeId));
        setServices(data);
      } catch (error) {
        console.error("Error al obtener los servicios:", error);
        alert("No se pudieron cargar los servicios.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleStatusChange = async (serviceId, newStatus) => {
    try {
      setServices((prev) =>
        prev.map((service) =>
          service.id === serviceId ? { ...service, status: newStatus } : service
        )
      );
      await updateServiceStatus(serviceId, newStatus);
      toast.success("Estado del servicio actualizado exitosamente", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      toast.error("No se pudo actualizar el estado del servicio.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
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
      />
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Administrar Servicios</h1>
        {loading ? (
          <p>Cargando servicios...</p>
        ) : (
          <table className="table-auto w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2">Servicio</th>
                <th className="px-4 py-2">Cliente</th>
                <th className="px-4 py-2">Monto</th>
                <th className="px-4 py-2">Fecha</th>
                <th className="px-4 py-2">Estado</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id}>
                  <td className="border px-4 py-2">{service.serviceName}</td>
                  <td className="border px-4 py-2">{service.clientName}</td>
                  <td className="border px-4 py-2">${service.servicePrice}</td>
                  <td className="border px-4 py-2">{service.date}</td>
                  <td className="border px-4 py-2 font-bold">
                    {service.status.toUpperCase()}
                  </td>
                  <td className="border px-4 py-2 space-x-2">
                    {/* Lógica de visibilidad de botones */}
                    {service.status === "pending" && (
                      <>
                        <button
                          onClick={() =>
                            handleStatusChange(service.id, "processing")
                          }
                          className="bg-blue-500 text-white px-2 py-1 rounded"
                        >
                          Confirmar
                        </button>
                        <button
                          onClick={() =>
                            handleStatusChange(service.id, "cancelled")
                          }
                          className="bg-red-500 text-white px-2 py-1 rounded"
                        >
                          Cancelar
                        </button>
                      </>
                    )}
                    {service.status === "processing" && (
                      <>
                        <button
                          onClick={() =>
                            handleStatusChange(service.id, "finished")
                          }
                          className="bg-green-500 text-white px-2 py-1 rounded"
                        >
                          Finalizar
                        </button>
                        <button
                          onClick={() =>
                            handleStatusChange(service.id, "cancelled")
                          }
                          className="bg-red-500 text-white px-2 py-1 rounded"
                        >
                          Cancelar
                        </button>
                      </>
                    )}
                    {/* Si el estado es "finished", no se muestran botones */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminServicePage;
