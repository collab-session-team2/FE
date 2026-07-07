import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import MissionPage from "./pages/Mission/MissionPage";
import MissionVerifyPage from "./pages/Mission/MissionVerifyPage";

import { DiaryProvider } from "./store/DiaryContext";
import RootLayout from "./layout/RootLayout";
import Home from "./pages/Home/Home";
import RoomCreate from "./pages/roomCreate/RoomCreate";
import DiaryMain from "./pages/diary/diaryMain";
import DiaryWrite from "./pages/diary/diaryWrite";
import DiaryLook from "./pages/diary/DiaryLook";
import DiaryDetail from "./pages/diary/DiaryDetail";

import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";

function App() {
  return (
    <DiaryProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          <Route element={<RootLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/add" element={<></>} />
            <Route path="/create" element={<RoomCreate />} />
            <Route path="/mission" element={<MissionPage />} />
            <Route
              path="/mission/:missionId/verify"
              element={<MissionVerifyPage />}
            />

            <Route path="/diary/:diaryId" element={<DiaryMain />} />
            <Route path="/diary/:diaryId/write" element={<DiaryWrite />} />
            <Route path="/diary/:diaryId/look" element={<DiaryLook />} />
            <Route
              path="/diary/:diaryId/entry/:entryId"
              element={<DiaryDetail />}
            />

            <Route
              path="/diaryMain"
              element={<Navigate to="/" replace />}
            />
            <Route
              path="/diaryWrite"
              element={<Navigate to="/" replace />}
            />
            <Route
              path="/diaryLook"
              element={<Navigate to="/" replace />}
            />
            <Route
              path="/diaryDetail"
              element={<Navigate to="/" replace />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </DiaryProvider>
  );
}

export default App;
