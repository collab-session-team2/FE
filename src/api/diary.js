import api from "./axiosInstance";

// ⚠️ 일기 작성/목록 경로는 카멜케이스(diaryRooms) 사용 (방 관련은 케밥케이스 diary-rooms)

// 5. 일기 작성 (특정 방에 새 일기 등록)
// body: { title, content, diaryImage }
export const createDiary = (diaryRoomId, body) =>
  api.post(`/api/diaryRooms/${diaryRoomId}/diaries`, body);

// date 없으면 전체, 있으면 해당 날짜(YYYY-MM-DD)
// 6. 일기장 전체/날짜별 조회
// date 없으면 전체, 있으면 해당 날짜(YYYY-MM-DD)
// 응답: [{ diaryId, targetDate, sequence, title, userId, userName, content, diaryImage }]
export const getDiaries = (diaryRoomId, date) =>
  api.get(`/api/diaryRooms/${diaryRoomId}/diaries`, {
    params: date ? { date } : {},
  });

export const getDiaryDetail = (diaryId) => api.get(`/api/diaries/${diaryId}`);

// 7. 일기 상세 조회
// 응답: { diaryId, targetDate, sequence, title, userId, userName, content, diaryImage }
export const getDiaryDetail = (diaryId) => api.get(`/api/diaries/${diaryId}`);

// 8. 일기 수정 (title, content만 수정 가능)
export const updateDiary = (diaryId, body) =>
  api.put(`/api/diaries/${diaryId}`, body);
