import axios from 'axios';

const API_URL = 'http://localhost:8081/api';

export const api = {
  // Productos
  getProducts: async (params?: any) => {
    const { data } = await axios.get(`${API_URL}/products`, { params });
    return data;
  },

  getProduct: async (id: string) => {
    const { data } = await axios.get(`${API_URL}/products/${id}`);
    return data;
  },

  // Categorías
  getCategories: async () => {
    const { data } = await axios.get(`${API_URL}/categories`);
    return data;
  },

  // Zonas
  getZones: async () => {
    const { data } = await axios.get(`${API_URL}/zones`);
    return data;
  },

  // Checkout
  processCheckout: async (payload: any) => {
    const { data } = await axios.post(`${API_URL}/checkout`, payload);
    return data;
  },

  // Despacho a domicilio
  searchDeliveryWindows: async (searchData: { date: string; sessionId: string; zoneId?: string }) => {
    const { data } = await axios.post(`${API_URL}/delivery/search`, searchData);
    return data;
  },

  createSoftReservation: async (payload: { deliveryWindowId: string; sessionId: string; zoneId: string }) => {
    const { data } = await axios.post(`${API_URL}/delivery/soft-reserve`, payload);
    return data;
  },

  cancelReservation: async (sessionId: string) => {
    await axios.delete(`${API_URL}/delivery/cancel-reservation/${sessionId}`);
  },


  // ML Busquedas KNN
  mlSearch: async (query: string, topK: number = 5) => {
    const { data } = await axios.post(`${API_URL}/ml-search`, {
      query,
      top_k: topK,
    });

 
    return data;
  },

};
