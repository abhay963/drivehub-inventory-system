import api from "./api";

export const getVehicles = async () => {
  const response = await api.get("/vehicles");
  return response.data;
};

export const searchVehicles = async (query) => {
  const response = await api.get(`/vehicles/search?brand=${query}`);
  return response.data;
};


export const addVehicle = async (vehicleData) => {
  const response = await api.post("/vehicles", vehicleData);
  return response.data;
};


export const getVehicleById = async (id) => {
  const response = await api.get(`/vehicles/${id}`);
  return response.data;
};

export const updateVehicle = async (id, vehicleData) => {
  const response = await api.put(`/vehicles/${id}`, vehicleData);
  return response.data;
};



export const deleteVehicle = async (id) => {
  const response = await api.delete(`/vehicles/${id}`);
  return response.data;
};



export const purchaseVehicle = async (id) => {
  const response = await api.post(`/vehicles/${id}/purchase`);
  return response.data;
};




export const getInventorySummary = async () => {
  const response = await api.get("/vehicles/summary");
  return response.data;
};




export const restockVehicle = async (id, quantity) => {
  const response = await api.post(
    `/vehicles/${id}/restock`,
    {
      quantity,
    }
  );

  return response.data;
};