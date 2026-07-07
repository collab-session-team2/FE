import api from "./axiosInstance";

export const uploadImage = (file, directory) => {
  const formData = new FormData();
  formData.append("file", file);

  return api.post("/api/images", formData, {
    params: { directory },
    headers: { "Content-Type": "multipart/form-data" },
  });
};
