// 모든 API 경로를 이 파일 한 곳에서만 관리한다. (경로 표기 불일치로 인한 실수 방지)
//
// ⚠️ [백엔드 팀 확인 요청] 경로 표기가 통일되어 있지 않다.
//   - 일기 "목록/작성"만 camelCase(diaryRooms)   → ENDPOINTS.diaries
//   - 그 외 방 관련은 전부 kebab-case(diary-rooms) → ENDPOINTS.diaryRooms 등
//   실제 백엔드가 각각 그 경로로 열려 있어 문서 그대로 유지한다. 추후 통일을 요청할 것.

export const ENDPOINTS = {
  // [Auth] 인증 (public: 토큰 불필요)
  login: "/api/auth/login",

  // [User] 사용자 (public: 토큰 불필요)
  signup: "/api/users",

  // [DiaryRoom] 교환일기 방 — kebab-case
  diaryRooms: "/api/diary-rooms",
  diaryRoom: (diaryRoomId) => `/api/diary-rooms/${diaryRoomId}`,
  joinDiaryRoom: "/api/diary-rooms/join",

  // [Diary] 일기 — ⚠️ 목록/작성만 camelCase(diaryRooms)
  diaries: (diaryRoomId) => `/api/diaryRooms/${diaryRoomId}/diaries`,
  diary: (diaryId) => `/api/diaries/${diaryId}`,

  // [Comment] 댓글 — path가 아니라 query param diaryId 사용
  comments: "/api/comments",

  // [Mission] 미션 — kebab-case
  missions: (diaryRoomId) => `/api/diary-rooms/${diaryRoomId}/missions`,
  missionVerify: (diaryRoomId, missionId) =>
    `/api/diary-rooms/${diaryRoomId}/missions/${missionId}/verifications`,

  // [Image] 이미지 업로드
  images: "/api/images",
};

// 이미지 업로드 directory enum
export const IMAGE_DIRECTORY = {
  DIARY_ROOM: "DIARY_ROOM",
  DIARY: "DIARY",
  MISSION: "MISSION",
};
