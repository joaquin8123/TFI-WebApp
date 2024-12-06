import React from 'react';

const Sidebar = ({ location, onLocationChange, onSearch, tags, selectedTags, onTagToggle, shops }) => {
  return (
    <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto">
      <h2 className="text-xl mb-4">Talleres</h2>
      <input
        type="text"
        value={location}
        onChange={(e) => onLocationChange(e.target.value)}
        placeholder="Ingrese una localidad"
        className="border w-full p-2 mb-4"
      />
      <button
        onClick={onSearch}
        className="bg-blue-500 text-white px-4 py-2 rounded w-full mb-4"
      >
        Buscar
      </button>
      <div className="mb-4">
        {tags.map((tag) => (
          <button
            key={tag}
            className={`px-4 py-2 rounded border ${
              selectedTags.includes(tag) ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => onTagToggle(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
      {shops.map((shop) => (
        <div key={shop.id} className="border-b pb-2 mb-2">
          <h3 className="font-bold">{shop.name}</h3>
          <p>{shop.description}</p>
          <div>{Array.from({ length: 5 }).map((_, index) => (
            <span
              key={index}
              className={index < shop.rating ? 'text-yellow-500' : 'text-gray-300'}
            >
              ★
            </span>
          ))}</div>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
