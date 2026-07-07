import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (res) => {
    if (res.data && typeof res.data === "object" && "data" in res.data) {
      return res.data.data;
    }
    return res.data;
  },
  (error) => {
    const msg = error?.response?.data?.message || error.message;
    return Promise.reject(new Error(msg));
  },
);

export default api;
