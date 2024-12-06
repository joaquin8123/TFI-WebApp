export const getStoreByCityId = async (cityId) => {
  try {
    const response = await fetch(`${process.env.BASE_URL}/store/${cityId}`, {
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
