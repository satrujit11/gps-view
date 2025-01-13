import { API_URL } from "../config/api";

export const getDevices = async () => {
  try {
    const response = await fetch(`${API_URL}api/devices`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json", // Ensures the server understands the request type
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching devices:", error);
    throw error; // Re-throw the error to handle it in the caller
  }
};


export const deleteDevice = async (deviceId: string) => {
  try {
    const response = await fetch(`${API_URL}api/devices/${deviceId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json", // Ensures the server understands the request type
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting device:", error);
    throw error; // Re-throw the error to handle it in the caller
  }
};

export const editDevice = async (data: any) => {
  try {
    const response = await fetch(`${API_URL}api/devices`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Ensures the server understands the request type
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error editing device:", error);
    throw error; // Re-throw the error to handle it in the caller
  }
};
