import { BrowserRouter, Routes, Route } from "react-router-dom";

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
          {/* 로그인/회원가입 */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* 공통 레이아웃 */}
          <Route element={<RootLayout />}>
            {/* 시작 페이지(공개): 로그인 없이도 볼 수 있음 */}
            <Route path="/" element={<Home />} />

            {/* 로그인 필요: 미로그인 시 /login 으로 이동 */}
            <Route element={<RequireAuth />}>
              <Route path="/create" element={<RoomCreate />} />

              <Route path="/mission" element={<MissionPage />} />
              <Route
                path="/mission/:missionId/verify"
                element={<MissionVerifyPage />}
              />

              <Route path="/diaryMain" element={<DiaryMain />} />
              <Route path="/diaryWrite" element={<DiaryWrite />} />
              <Route path="/diaryDetail" element={<DiaryDetail />} />
              <Route path="/diaryLook" element={<DiaryLook />} />

              {/* 추후 상품 등록 페이지 */}
              <Route path="/add" element={<></>} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </DiaryProvider>
  );
}

export default App;
