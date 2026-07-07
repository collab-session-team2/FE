import api from "./axiosInstance";

// [Comment] 댓글 API
// - 공통 응답 { success, code, message, data } 는 axiosInstance 응답 인터셉터가
//   이미 data 로 언랩한다. (여기서는 data 를 그대로 반환)
// - ⚠️ diaryId 는 path 가 아니라 query 파라미터로 보낸다. (/api/comments?diaryId=1)
// - 댓글 형태: { commentId, userId, userName, content }

// 1. 특정 일기 댓글 조회
// GET /api/comments?diaryId={diaryId}
// 반환: Comment[]
export const getComments = (diaryId) =>
  api.get("/api/comments", { params: { diaryId } });

// 2. 특정 일기 댓글 작성
// POST /api/comments?diaryId={diaryId}
// body: { content }
// 반환: Comment  (생성된 댓글)
export const createComment = (diaryId, body) =>
  api.post("/api/comments", body, { params: { diaryId } });
