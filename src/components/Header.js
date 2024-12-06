import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Header = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const pageTitle = location.pathname === '/services' ? 'Mis Servicios' : 'Gestión de Talleres';

  return (
    <div className="w-full flex justify-between items-center bg-gray-200 p-4">
      <h1 className="text-2xl">{pageTitle}</h1>
      <div className="flex space-x-4">
        {location.pathname !== '/services' && (
          <button
            onClick={() => navigate('/services')}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Mis Servicios
          </button>
        )}
        <button
          onClick={onLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default Header;
