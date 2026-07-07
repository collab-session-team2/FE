import api from "./axiosInstance";

export const uploadImage = (file, directory) => {
  const formData = new FormData();
  formData.append("file", file);

// 9. 이미지 업로드 → imageUrl 리턴
// directory: "DIARY_ROOM" | "DIARY" | "MISSION"
// 응답: { imageUrl }
export const uploadImage = (file, directory) => {
  const formData = new FormData();
  formData.append("file", file);
  return api.post("/api/images", formData, {
    params: { directory },
    headers: { "Content-Type": "multipart/form-data" },
  });
};
