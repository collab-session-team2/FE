import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 응답 래퍼 언랩: 모든 응답이 { success, code, message, data } 형태이므로 data만 반환
api.interceptors.response.use(
  (res) => {
    if (res.data && typeof res.data === "object" && "data" in res.data) {
      return res.data.data;
    }
    return res.data;
  },
  (error) => {
    const msg = error?.response?.data?.message || error.message;
    return Promise.reject(new Error(msg));
  },
);

    // 서버가 { success:false, message } 형태로 에러 줄 수 있음
    const msg = error?.response?.data?.message || error.message;
    return Promise.reject(new Error(msg));
  }
);

// ⚠️ 인증 필요 시 (스웨거 자물쇠 아이콘 = 보호됨):
// TODO: 로그인/토큰 저장 방식이 확정되면 아래 요청 인터셉터 주석 해제
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("accessToken");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

export default api;
