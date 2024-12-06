import React, { useState } from 'react';

const StarRating = ({ serviceId, currentRating, onRate }) => {
  const [hoveredRating, setHoveredRating] = useState(0);

  return (
    <div className="flex space-x-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`cursor-pointer ${
            (hoveredRating || currentRating) >= star ? 'text-yellow-500' : 'text-gray-300'
          }`}
          onMouseEnter={() => setHoveredRating(star)}
          onMouseLeave={() => setHoveredRating(0)}
          onClick={() => onRate(serviceId, star)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
