import api from "./axiosInstance";

// [Diary] 일기 API
// - 공통 응답 { success, code, message, data } 는 axiosInstance 응답 인터셉터가
//   이미 data 로 언랩한다. (여기서는 data 를 그대로 반환)
// - ⚠️ 경로 표기 불일치 주의:
//     · 일기 작성/목록 : camelCase  /api/diaryRooms/{diaryRoomId}/diaries
//     · 일기 상세      : 소문자      /api/diaries/{diaryId}   (방 ID 없음)
//     · (참고) 미션 API : kebab-case /api/diary-rooms/...
//   → 명세 그대로 유지. 추후 백엔드에 통일 요청.
// - 일기 형태(작성/상세/목록 공통):
//   { diaryId, targetDate, sequence, title, userId, userName, content, diaryImage }

// 1. 일기 작성 (특정 방에 새 일기 등록)
// POST /api/diaryRooms/{diaryRoomId}/diaries
// body: { title, content, diaryImage }  (diaryImage = 업로드된 이미지 URL)
// 반환: Diary  (생성된 일기 — diaryId 포함)
export const createDiary = (diaryRoomId, body) =>
  api.post(`/api/diaryRooms/${diaryRoomId}/diaries`, body);

// 2. 일기 상세 조회
// GET /api/diaries/{diaryId}
// 반환: Diary
export const getDiary = (diaryId) => api.get(`/api/diaries/${diaryId}`);

// 3. 일기장 전체 / 날짜별 조회
// GET /api/diaryRooms/{diaryRoomId}/diaries?date=YYYY-MM-DD
// date 없으면 전체, 있으면 해당 날짜(YYYY-MM-DD)
// 반환: Diary[]
export const getDiaries = (diaryRoomId, date) =>
  api.get(`/api/diaryRooms/${diaryRoomId}/diaries`, {
    params: date ? { date } : {},
  });

// 4. 일기 수정 (title, content만 수정 가능)
// PUT /api/diaries/{diaryId}
export const updateDiary = (diaryId, body) =>
  api.put(`/api/diaries/${diaryId}`, body);
