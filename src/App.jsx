import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import RootLayout from "./layout/RootLayout";
import RequireAuth from "./layout/RequireAuth";

import Home from "./pages/Home/Home";
import RoomCreate from "./pages/roomCreate/RoomCreate";

import MissionPage from "./pages/Mission/MissionPage";
import MissionVerifyPage from "./pages/Mission/MissionVerifyPage";

import DiaryMain from "./pages/diary/DiaryMain";
import DiaryWrite from "./pages/diary/DiaryWrite";
import DiaryLook from "./pages/diary/DiaryLook";
import DiaryDetail from "./pages/diary/DiaryDetail";

import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";

import { DiaryProvider } from "./store/DiaryContext";

function App() {
  return (
    <DiaryProvider>
      <BrowserRouter>
        <Routes>
          {/* 로그인/회원가입 (public) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* 공통 레이아웃 (푸터 포함) */}
          <Route element={<RootLayout />}>
            {/* 전 구간 로그인 필요: 미로그인 시 /login 으로 이동.
                → 첫 진입(/)도 로그인해야 Home 이 보인다. */}
            <Route element={<RequireAuth />}>
              {/* 시작 페이지: 로그인 후 Home */}
              <Route path="/" element={<Home />} />

              <Route path="/create" element={<RoomCreate />} />

              <Route path="/mission" element={<MissionPage />} />
              <Route
                path="/mission/:missionId/verify"
                element={<MissionVerifyPage />}
              />

              {/* 일기: diaryId 파라미터 기반 라우팅 */}
              <Route path="/diary/:diaryId" element={<DiaryMain />} />
              <Route path="/diary/:diaryId/write" element={<DiaryWrite />} />
              <Route path="/diary/:diaryId/look" element={<DiaryLook />} />
              <Route
                path="/diary/:diaryId/entry/:entryId"
                element={<DiaryDetail />}
              />

              {/* 추후 상품 등록 페이지 */}
              <Route path="/add" element={<></>} />
            </Route>

            {/* 구 경로 접근 시 홈으로 리다이렉트 */}
            <Route path="/diaryMain" element={<Navigate to="/" replace />} />
            <Route path="/diaryWrite" element={<Navigate to="/" replace />} />
            <Route path="/diaryLook" element={<Navigate to="/" replace />} />
            <Route path="/diaryDetail" element={<Navigate to="/" replace />} />

            {/* 그 외/미구현 경로(예: 푸터 마이페이지)는 홈으로.
                → 로그인 안 됐으면 /(RequireAuth)에서 다시 /login 으로 유도된다.
                TODO: 마이페이지 화면이 생기면 /mypage 라우트를 추가하고 제외 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DiaryProvider>
  );
}

export default App;
