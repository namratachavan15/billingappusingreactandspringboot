import axios from "axios";
export const API_URI="http://localhost:5454";

export const api = axios.create({
    baseURL: API_URI,
    headers: { "Content-Type": "application/json" },
  });

  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });