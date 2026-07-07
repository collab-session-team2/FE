// 인증 상태 = 유효한 accessToken 보유 여부.
// 토큰 저장은 localStorage 하나로 통일한다. (refreshToken 없음 — 만료 시 재로그인)
const TOKEN_KEY = "accessToken";

export const getAccessToken = () => localStorage.getItem(TOKEN_KEY);

export const setAccessToken = (token) => {
  if (token) localStorage.setItem(TOKEN_KEY, token);
};

export const clearAccessToken = () => localStorage.removeItem(TOKEN_KEY);

// 로그인 여부(= accessToken 존재)
export const isAuthenticated = () => Boolean(getAccessToken());

// 별칭: 일부 컴포넌트(RequireAuth, Home)는 isLoggedIn 이름으로 import 한다.
export const isLoggedIn = isAuthenticated;

// ── 인터셉터(React 밖) ↔ AuthProvider(React) 브리지 ──────────────
// axios 응답 인터셉터에서 401을 만나면 여기로 알리고,
// AuthProvider가 등록해 둔 핸들러가 (토큰 제거 + 로그인 모달)을 처리한다.
let authRequiredHandler = null;

export const registerAuthRequiredHandler = (handler) => {
  authRequiredHandler = handler;
  return () => {
    if (authRequiredHandler === handler) authRequiredHandler = null;
  };
};

export const emitAuthRequired = () => {
  if (authRequiredHandler) authRequiredHandler();
};
