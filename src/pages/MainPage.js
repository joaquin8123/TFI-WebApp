import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Map, { Marker, Popup } from "react-map-gl";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "mapbox-gl/dist/mapbox-gl.css";
import { getCityByName } from "../service/cityService";
import { getStoreByCityId } from "../service/storeService";
import {
  getOccupiedDays,
  createReservation,
} from "../service/reservationService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const MainPage = () => {
  const navigate = useNavigate();
  const [locationInput, setLocationInput] = useState("");
  const [viewport, setViewport] = useState({
    latitude: -34.6037,
    longitude: -58.3816,
    zoom: 12,
  });
  const [stores, setStore] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showReservation, setShowReservation] = useState(false);
  const [excludedDates, setExcludedDates] = useState([]);
  const [storesWithDates, setStoresWithDates] = useState({});

  const loadBuenosAiresStores = async () => {
    try {
      const buenosAires = await getCityByName("Buenos Aires");
      if (buenosAires) {
        const stores = await getStoreByCityId(buenosAires.id);

        const storesOccupiedDates = {};
        await Promise.all(
          stores.map(async (store) => {
            try {
              const occupiedDaysResponse = await getOccupiedDays(
                store.id,
                store.serviceId
              );
              const excludedDates = occupiedDaysResponse.days.map((dateStr) => {
                const date = new Date(dateStr);
                date.setHours(0, 0, 0, 0);
                return date;
              });
              storesOccupiedDates[store.id] = excludedDates;
            } catch (error) {
              console.error(
                `Error al obtener días ocupados para store ${store.id}:`,
                error
              );
              storesOccupiedDates[store.id] = [];
            }
          })
        );

        setStoresWithDates(storesOccupiedDates);
        setStore(stores);
      }
    } catch (error) {
      console.error("Error loading Buenos Aires stores:", error);
    }
  };

  useEffect(() => {
    loadBuenosAiresStores();
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

      const storesOccupiedDates = {};
      await Promise.all(
        stores.map(async (store) => {
          try {
            const occupiedDaysResponse = await getOccupiedDays(
              store.store_id,
              store.serviceId
            );
            const excludedDates = occupiedDaysResponse.days.map((dateStr) => {
              const date = new Date(dateStr);
              date.setHours(0, 0, 0, 0);
              return date;
            });
            storesOccupiedDates[store.store_id] = excludedDates;
          } catch (error) {
            console.error(
              `Error al obtener días ocupados para store ${store.store_id}:`,
              error
            );
            storesOccupiedDates[store.store_id] = [];
          }
        })
      );

      setStoresWithDates(storesOccupiedDates);
      setStore(stores);
    } else {
      alert("No hay información disponible para esta localidad");
    }
  };

  const handleReserve = (store) => {
    setSelectedShop(store);
    setShowReservation(true);
    const storeDates = storesWithDates[store.store_id] || [];
    setExcludedDates(storeDates);
  };

  const handleCreateReservation = async () => {
    if (selectedDate && selectedShop) {
      try {
        const userId = localStorage.getItem("userId");
        const reservationData = {
          userId: parseInt(userId),
          storeId: selectedShop.id,
          serviceId: selectedShop.serviceId,
          date: selectedDate.toISOString(),
          status: "PENDING",
        };
        await createReservation(reservationData);
        toast.success("¡Reserva creada exitosamente!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setShowReservation(false);
        setSelectedDate(null);

        // Actualizar las fechas ocupadas
        const occupiedDaysResponse = await getOccupiedDays(
          selectedShop.store_id,
          selectedShop.serviceId
        );
        const newExcludedDates = occupiedDaysResponse.days.map((dateStr) => {
          const date = new Date(dateStr);
          date.setHours(0, 0, 0, 0);
          return date;
        });
        setExcludedDates(newExcludedDates);
      } catch (error) {
        console.error("Error al crear la reserva:", error);
        toast.error(
          "Error al crear la reserva. Por favor, intente nuevamente.",
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
      }
    } else {
      toast.warning("Por favor, seleccione una fecha válida.", {
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

      <div className="flex w-full h-full">
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

          <div className="mt-4">
            {stores.map((store) => (
              <div key={store.store_id} className="border-b pb-2 mb-2">
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
                key={store.store_id}
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
                  minDate={new Date()}
                  excludeDates={excludedDates}
                  placeholderText="Seleccione una fecha"
                  dateFormat="dd/MM/yyyy"
                  showTimeSelect={false}
                  isClearable={true}
                />
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowReservation(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleCreateReservation}
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
