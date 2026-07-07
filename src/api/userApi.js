import api from "./axiosInstance";

export async function signup({ userName, email, password }) {
  return api.post("/api/users", { userName, email, password });
}
