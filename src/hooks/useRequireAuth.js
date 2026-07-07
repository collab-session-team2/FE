import { useCallback } from "react";
import { useAuth } from "../store/AuthContext";

// 보호가 필요한 동작(방 입장/생성/참여, 일기 작성, 댓글 작성, 미션 인증 등)을 감싸는 가드.
//   const requireAuth = useRequireAuth();
//   <button onClick={() => requireAuth(() => navigate("/create"))}>...
// 로그인 상태면 콜백 실행, 아니면 "로그인 필요" 모달을 띄운다(→ 확인 시 /login).
export function useRequireAuth() {
  const { isAuthenticated, requireLogin } = useAuth();

  return useCallback(
    (callback) => {
      if (isAuthenticated) {
        callback?.();
        return true;
      }
      requireLogin();
      return false;
    },
    [isAuthenticated, requireLogin]
  );
}
