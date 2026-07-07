import api from "./axiosInstance";
import { ENDPOINTS } from "./endpoints";

// [Mission] 미션 API
// - 공통 응답 { success, code, message, data } 는 axiosInstance 응답 인터셉터가
//   이미 data 로 언랩한다. (여기서는 data 를 그대로 반환)
// - 서버 미션 형태(목록 아이템 / 인증 응답 동일):
//   { missionStatusId, missionId, missionTitle, exp, complete }

// 1. 미션 목록 조회
// GET /api/diary-rooms/{diaryRoomId}/missions?sort=asc|desc
// sort 기본값 asc(오름차순). 항상 쿼리로 전송한다.
// 반환: Mission[]  (응답 data 배열)
export const getMissions = (diaryRoomId, sort = "asc") =>
  api.get(ENDPOINTS.missions(diaryRoomId), { params: { sort } });

// 2. 미션 인증 완료
// POST /api/diary-rooms/{diaryRoomId}/missions/{missionId}/verifications
// body: { missionImage: "<업로드된 이미지 URL>" }
//   ⚠️ missionImage 는 파일이 아니라 업로드된 이미지의 URL(string).
//      먼저 uploadImage(file, "MISSION") 로 URL 을 받은 뒤 여기로 전달한다.
// 반환: Mission  (인증 처리된 미션 단일 객체 — 목록 아이템과 동일 형태)
export const verifyMission = (diaryRoomId, missionId, body) =>
  api.post(ENDPOINTS.missionVerify(diaryRoomId, missionId), body);
