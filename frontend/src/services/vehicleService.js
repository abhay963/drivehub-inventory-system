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
  const formData = new FormData();

  formData.append("brand", vehicleData.brand);
  formData.append("model", vehicleData.model);
  formData.append("category", vehicleData.category);
  formData.append("year", vehicleData.year);
  formData.append("price", vehicleData.price);
  formData.append("quantity", vehicleData.quantity);

  if (vehicleData.image) {
    formData.append("image", vehicleData.image);
  }

  const response = await api.post("/vehicles", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const getVehicleById = async (id) => {
  const response = await api.get(`/vehicles/${id}`);
  return response.data;
};

export const updateVehicle = async (id, vehicleData) => {
  const formData = new FormData();

  formData.append("brand", vehicleData.brand);
  formData.append("model", vehicleData.model);
  formData.append("category", vehicleData.category);
  formData.append("year", vehicleData.year);
  formData.append("price", vehicleData.price);
  formData.append("quantity", vehicleData.quantity);

  if (vehicleData.image) {
    formData.append("image", vehicleData.image);
  }

  const response = await api.put(`/vehicles/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

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



export const getPurchaseHistory = async () => {
  const response = await api.get("/vehicles/purchases");
  return response.data;
};


export const getAllPurchaseHistory = async () => {
  const response = await api.get("/vehicles/all-purchases");
  return response.data;
};