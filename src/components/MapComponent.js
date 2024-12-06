import React, { useRef, useEffect } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';

const MapComponent = ({ viewport, onViewportChange, shops, selectedShop, onSelectShop, onClosePopup }) => {
  const mapRef = useRef();

  useEffect(() => {
    if (shops.length > 0 && mapRef.current) {
      // Ajustar el mapa automáticamente a los límites de los shops
      const bounds = shops.reduce(
        (acc, shop) => [
          Math.min(acc[0], shop.longitude),
          Math.min(acc[1], shop.latitude),
          Math.max(acc[2], shop.longitude),
          Math.max(acc[3], shop.latitude),
        ],
        [Infinity, Infinity, -Infinity, -Infinity]
      );

      mapRef.current.fitBounds(
        [
          [bounds[0], bounds[1]], // Esquina inferior izquierda
          [bounds[2], bounds[3]], // Esquina superior derecha
        ],
        { padding: 50 }
      );
    }
  }, [shops]);

  return (
    <div className="w-3/4">
      <Map
        {...viewport}
        ref={mapRef}
        mapboxAccessToken="pk.eyJ1Ijoiam9hcXVpbjgxMjMiLCJhIjoiY20zdjJ3MW4yMHF4cDJpbzkybHh4dTF4NyJ9.lbLFSbOrPgdgUhD4chKCgg"
        style={{ width: '100%', height: '100%' }}
        onMove={(evt) => onViewportChange(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/streets-v11"
      >
        {shops.map((shop) => (
          <Marker
            key={shop.id}
            latitude={shop.latitude}
            longitude={shop.longitude}
            anchor="center"
          >
            <div onClick={() => onSelectShop(shop)} className="cursor-pointer">
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
            onClose={onClosePopup}
            closeOnClick={false}
            anchor="top"
          >
            <div className="text-center">
              <h2 className="text-lg font-bold">{selectedShop.name}</h2>
              <p>{selectedShop.description}</p>
              <button
                onClick={() => alert('Reservar Turno')}
                className="bg-green-500 text-white px-2 py-1 rounded mt-2"
              >
                Reservar Turno
              </button>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
};

export default MapComponent;
