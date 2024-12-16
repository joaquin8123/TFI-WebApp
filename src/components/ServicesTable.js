import React from "react";
import StarRating from "./StarRating";

const ServicesTable = ({ services, onRateService }) => {
  const renderStatus = (status) => {
    switch (status) {
      case "pending":
        return <span className="font-bold text-yellow-500">Pendiente</span>;
      case "cancelled":
        return <span className="font-bold text-red-500">Cancelado</span>;
      case "processing":
        return <span className="font-bold text-blue-500">En curso</span>;
      case "finished":
        return <span className="font-bold text-green-500">Finalizado</span>;
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="p-4">
      <table className="table-auto w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">Taller</th>
            <th className="px-4 py-2">Servicios</th>
            <th className="px-4 py-2">Monto</th>
            <th className="px-4 py-2">Fecha</th>
            <th className="px-4 py-2">Estado</th>
            <th className="px-4 py-2">Acción</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service.id}>
              <td className="border px-4 py-2">{service.shop}</td>
              <td className="border px-4 py-2">{service.services}</td>
              <td className="border px-4 py-2">${service.amount}</td>
              <td className="border px-4 py-2">{service.date}</td>
              <td className="border px-4 py-2">
                {renderStatus(service.status)}
              </td>
              <td className="border px-4 py-2">
                {service.status === "finished" && (
                  <StarRating
                    storeId={service.storeId}
                    serviceId={service.id}
                    currentRating={service.rating}
                    onRate={onRateService}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ServicesTable;
