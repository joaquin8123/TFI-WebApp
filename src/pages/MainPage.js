import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Map, { Marker, Popup } from "react-map-gl";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "mapbox-gl/dist/mapbox-gl.css";
import { getCityByName } from "../service/cityService";
import { getStoreByCityId } from "../service/storeService";

const MainPage = () => {
  const [locationInput, setLocationInput] = useState("");
  const [viewport, setViewport] = useState({
    latitude: -34.6037, // Buenos Aires inicial
    longitude: -58.3816,
    zoom: 12,
  });
  const [stores, setStore] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showReservation, setShowReservation] = useState(false);
  const [excludedDates, setExcludedDates] = useState([]);

  useEffect(() => {
    // Generar fechas de la próxima semana para excluirlas
    const today = new Date();
    const nextWeek = [];
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      nextWeek.push(date);
    }
    setExcludedDates(nextWeek);
  }, []);

  const handleSearch = async () => {
    const location = await getCityByName(locationInput);
    if (location) {
      const { latitude, longitude, id: cityId } = location;
      setViewport({
        latitude,
        longitude,
        zoom: 13,
      });
      const stores = await getStoreByCityId(cityId);
      setStore(stores);
    } else {
      alert("No hay información disponible para esta localidad");
    }
  };

  const handleReserve = (store) => {
    setSelectedShop(store);
    setShowReservation(true);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <Header onLogout={() => alert("Cerrar Sesión")} />

      <div className="flex w-full h-full">
        {/* Panel Izquierdo */}
        <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto">
          <h1 className="text-2xl mb-4">Buscar Localidad</h1>
          <input
            type="text"
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
            placeholder="Ingrese una localidad"
            className="border w-full p-2 mb-4"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white px-4 py-2 rounded w-full"
          >
            Buscar
          </button>

          {/* Lista de Talleres */}
          <div className="mt-4">
            {stores.map((store) => (
              <div key={store.id} className="border-b pb-2 mb-2">
                <h3 className="font-bold">{store.name}</h3>
                <p>{store.description}</p>
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <span
                      key={index}
                      className={
                        index < store.rating
                          ? "text-yellow-500"
                          : "text-gray-300"
                      }
                    >
                      ★
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => handleReserve(store)}
                  className="text-blue-500 underline mt-1"
                >
                  Reservar Turno
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Mapa */}
        <div className="w-3/4 relative">
          <Map
            {...viewport}
            mapboxAccessToken="pk.eyJ1Ijoiam9hcXVpbjgxMjMiLCJhIjoiY20zdjJ3MW4yMHF4cDJpbzkybHh4dTF4NyJ9.lbLFSbOrPgdgUhD4chKCgg"
            style={{ width: "100%", height: "100%" }}
            onMove={(evt) => setViewport(evt.viewState)}
            mapStyle="mapbox://styles/mapbox/streets-v11"
          >
            {stores.map((store) => (
              <Marker
                key={store.id}
                latitude={store.latitude}
                longitude={store.longitude}
                anchor="center"
              >
                <div
                  onClick={() => setSelectedShop(store)}
                  className="cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="red"
                    viewBox="0 0 24 24"
                    width="32"
                    height="32"
                  >
                    <path d="M12 2C8.134 2 5 5.134 5 9c0 3.866 7 13 7 13s7-9.134 7-13c0-3.866-3.134-7-7-7zm0 10.5c-1.933 0-3.5-1.567-3.5-3.5s1.567-3.5 3.5-3.5 3.5 1.567 3.5 3.5-1.567 3.5-3.5 3.5z" />
                  </svg>
                </div>
              </Marker>
            ))}

            {selectedShop && (
              <Popup
                latitude={selectedShop.latitude}
                longitude={selectedShop.longitude}
                onClose={() => setSelectedShop(null)}
                closeOnClick={false}
                anchor="top"
              >
                <div className="text-center">
                  <h2 className="text-lg font-bold">{selectedShop.name}</h2>
                  <p>{selectedShop.description}</p>
                  <button
                    onClick={() => handleReserve(selectedShop)}
                    className="bg-blue-500 text-white px-2 py-1 rounded mt-2"
                  >
                    Reservar Turno
                  </button>
                </div>
              </Popup>
            )}
          </Map>

          {/* Ventana de Reservar Turno */}
          {showReservation && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded shadow-lg">
                <h2 className="text-2xl mb-4">Reservar Turno</h2>
                <p className="mb-4">
                  Selecciona una fecha para {selectedShop?.name}
                </p>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  className="border p-2 w-full mb-4"
                  minDate={new Date()} // Deshabilitar fechas anteriores a hoy
                  excludeDates={excludedDates} // Fechas excluidas
                  placeholderText="Seleccione una fecha"
                />
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowReservation(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => {
                      if (selectedDate) {
                        alert(`Turno reservado para ${selectedDate}`);
                        setShowReservation(false);
                      } else {
                        alert("Por favor, seleccione una fecha válida.");
                      }
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainPage;
