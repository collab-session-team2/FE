import api from "./axiosInstance";

export async function login({ email, password }) {
  const response = await api.post("/api/auth/login", { email, password });

  const accessToken = response?.accessToken;

  if (accessToken) {
    localStorage.setItem("accessToken", accessToken);
  }

  return response;
}
