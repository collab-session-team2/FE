import api from "./axiosInstance";

export const getDiaryRooms = () => api.get("/api/diary-rooms");

export const getDiaryRoomDetail = (diaryRoomId) =>
  api.get(`/api/diary-rooms/${diaryRoomId}`);

export const createDiaryRoom = (body) => api.post("/api/diary-rooms", body);

export const joinDiaryRoom = (inviteCode) =>
  api.post("/api/diary-rooms/join", { inviteCode });
