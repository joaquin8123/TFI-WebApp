export const getStoreByCityId = async (cityId) => {
  try {
    const response = await fetch(`http://localhost:3002/store/${cityId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error fetching store:", error);
    throw error;
  }
};
export const updateServiceStatus = async (reservationId, status) => {
  try {
    const response = await fetch(`http://localhost:3002/store/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reservationId, status }),
    });
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error updating service status:", error);
    throw error;
  }
};
