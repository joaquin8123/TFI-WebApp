export const getServicesByUserId = async (userId) => {
  try {
    const response = await fetch(
      `http://localhost:3002/user/${userId}/services`,
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
export const getServicesByStoreId = async (storeId) => {
  try {
    const response = await fetch(
      `http://localhost:3002/store/${storeId}/services`,
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
    console.error("Error fetching services:", error);
    throw error;
  }
};
