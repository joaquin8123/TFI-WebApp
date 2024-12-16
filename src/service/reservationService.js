export const getOccupiedDays = async (storeId, serviceId) => {
  try {
    const response = await fetch(
      `http://localhost:3002/reservation/${storeId}/occupied/${serviceId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error fetching store:", error);
    throw error;
  }
};

export const createReservation = async (reservationData) => {
  try {
    const response = await fetch(`http://localhost:3002/reservation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reservationData),
    });
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error fetching store:", error);
    throw error;
  }
};
