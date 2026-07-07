import api from "./axiosInstance";

// body: { title, content, diaryImage }
export const createDiary = (diaryRoomId, body) =>
  api.post(`/api/diaryRooms/${diaryRoomId}/diaries`, body);

// date 없으면 전체, 있으면 해당 날짜(YYYY-MM-DD)
export const getDiaries = (diaryRoomId, date) =>
  api.get(`/api/diaryRooms/${diaryRoomId}/diaries`, {
    params: date ? { date } : {},
  });

export const getDiaryDetail = (diaryId) => api.get(`/api/diaries/${diaryId}`);

export const updateDiary = (diaryId, body) =>
  api.put(`/api/diaries/${diaryId}`, body);
