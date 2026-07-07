import { Navigate, Outlet } from "react-router-dom";
import { isLoggedIn } from "../utils/auth";

// 로그인 되어있지 않으면 로그인 페이지로 이동시키는 라우트 가드
export default function RequireAuth() {
  return isLoggedIn() ? <Outlet /> : <Navigate to="/login" replace />;
}
