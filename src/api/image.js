import api from "./axiosInstance";

// 9. 이미지 업로드 → imageUrl 리턴
// directory: "DIARY_ROOM" | "DIARY" | "MISSION"
// 응답: { imageUrl }
export const uploadImage = (file, directory) => {
  const formData = new FormData();
  formData.append("file", file);
  // Content-Type은 axios가 boundary 포함해 자동 설정하도록 둔다 (수동 지정 금지)
  return api.post("/api/images", formData, {
    params: { directory },
  });
};
