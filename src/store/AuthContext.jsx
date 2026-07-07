import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import LoginRequiredModal from "../components/common/LoginRequiredModal";
import {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
  registerAuthRequiredHandler,
} from "../utils/auth";

const AuthContext = createContext(null);

// 전역 인증 상태.
// isAuthenticated = 유효한 accessToken 보유 여부.
export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [token, setToken] = useState(() => getAccessToken());
  const [modalOpen, setModalOpen] = useState(false);

  const isAuthenticated = Boolean(token);

  // 로그인 성공 시: accessToken 저장 + 전역 상태 갱신
  const login = useCallback((accessToken) => {
    setAccessToken(accessToken);
    setToken(accessToken);
  }, []);

  // 로그아웃: 토큰 제거 + 상태 갱신
  const logout = useCallback(() => {
    clearAccessToken();
    setToken(null);
  }, []);

  // 보호된 동작을 시도했으나 미로그인일 때: "로그인 필요" 모달 표시
  const requireLogin = useCallback(() => setModalOpen(true), []);

  // 401 인터셉터 → 토큰 제거 + 로그인 모달 (React 밖에서 들어오는 신호 처리)
  useEffect(() => {
    return registerAuthRequiredHandler(() => {
      clearAccessToken();
      setToken(null);
      setModalOpen(true);
    });
  }, []);

  // 모달 확인 → /login 이동
  const handleConfirm = () => {
    setModalOpen(false);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, requireLogin }}
    >
      {children}
      {modalOpen && <LoginRequiredModal onConfirm={handleConfirm} />}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
