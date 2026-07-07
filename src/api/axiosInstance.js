import axios from "axios";
import {
  getAccessToken,
  clearAccessToken,
  emitAuthRequired,
} from "../utils/auth";

// 단일 axios 인스턴스.
// - Content-Type을 인스턴스 기본값으로 강제하지 않는다.
//   → JSON 바디는 axios가 application/json으로, FormData는 multipart/form-data(+boundary)로 자동 설정.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// 요청 인터셉터: 토큰이 있으면 Authorization 헤더 자동 첨부.
// (login/signup 등 public 요청은 config.skipAuthInterceptor === true 로 토큰을 붙이지 않음)
api.interceptors.request.use((config) => {
  if (!config.skipAuthInterceptor) {
    const token = getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터: 공통 응답 규격 { success, code, message, data } 파싱.
// 성공 판단은 반드시 success === true 기준. (data 유무로 판단하지 않음)
api.interceptors.response.use(
  (res) => {
    const body = res.data;
    if (body && typeof body === "object" && "success" in body) {
      if (body.success) return body.data;
      // HTTP 200이지만 success:false 인 경우도 실패로 처리
      return Promise.reject(new Error(body.message || "요청에 실패했습니다."));
    }
    return body;
  },
  (error) => {
    // 401: 토큰 만료/무효 → 토큰 제거 + "로그인 필요" 모달 유도.
    // 단, public 요청(로그인 실패 등)은 전역 모달을 띄우지 않고 호출부에서 에러 노출.
    if (error?.response?.status === 401 && !error.config?.skipAuthInterceptor) {
      clearAccessToken();
      emitAuthRequired();
    }
    // 서버가 { success:false, message } 형태로 에러 줄 수 있음
    const msg = error?.response?.data?.message || error.message;
    return Promise.reject(new Error(msg));
  }
);

export default api;
