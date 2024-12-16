export const getCityByName = async (name) => {
  try {
    const response = await fetch(`http://localhost:3002/city/${name}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error fetching city:", error);
    throw error;
  }
};
