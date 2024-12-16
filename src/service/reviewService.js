export const createReview = async (storeId, userId, serviceId, rating) => {
  try {
    const response = await fetch(`http://localhost:3002/review`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        storeId,
        userId,
        serviceId,
        rating,
      }),
    });
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error fetching store:", error);
    throw error;
  }
};
