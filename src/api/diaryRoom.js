import api from "./axiosInstance";

// ⚠️ 방 관련 경로는 케밥케이스(diary-rooms) 사용 (일기 작성/목록은 카멜케이스 diaryRooms)

// 1. 교환일기 방 전체 목록 조회 (내가 참여 중인 방들)
// 응답: [{ diaryRoomId, diaryRoomName, diaryRoomImage, currentMember, maxMember }]
export const getDiaryRooms = () => api.get("/api/diary-rooms");

// 2. 교환일기 방 상세 조회
// 응답: { diaryRoomId, diaryRoomName, diaryRoomImage, currentTurnUserName, myTurn }
export const getDiaryRoomDetail = (diaryRoomId) =>
  api.get(`/api/diary-rooms/${diaryRoomId}`);

// 3. 교환일기 방 생성
// body: { diaryRoomName, maxMember, diaryRoomImage }
// 응답: { diaryRoomId, diaryRoomName, inviteCode, maxMember, diaryRoomImage, createdAt }
export const createDiaryRoom = (body) => api.post("/api/diary-rooms", body);

// 4. 교환일기 방 참여 (초대코드로 입장)
// body: { inviteCode }
// 응답: { diaryRoomId, diaryRoomName, sequence, createdAt }
export const joinDiaryRoom = (inviteCode) =>
  api.post("/api/diary-rooms/join", { inviteCode });
