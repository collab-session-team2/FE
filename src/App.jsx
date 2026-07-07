import { BrowserRouter, Routes, Route } from "react-router-dom";
import MissionPage from "./pages/mission/MissionPage";

import { DiaryProvider } from "./store/DiaryContext";
import RootLayout from "./layout/RootLayout";
import Home from "./pages/Home/Home";
import RoomCreate from "./pages/roomCreate/RoomCreate";
import DiaryMain from "./pages/diary/DiaryMain";
import DiaryWrite from "./pages/diary/DiaryWrite";
import DiaryLook from "./pages/diary/DiaryLook";
import DiaryDetail from "./pages/diary/DiaryDetail";

function App() {
  return (
    <DiaryProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<RootLayout />}>
          <Route path="/add" element={<></>} />{" "}
          <Route path="/mission" element={<MissionPage />} />
          {/* 추후 element에 상품 등록 페이지 들어가야함 */}
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<RoomCreate />} />
          <Route path="/diaryMain" element={<DiaryMain />} />
          <Route path="/diaryWrite" element={<DiaryWrite />} />
          <Route path="/diaryDetail" element={<DiaryDetail />} />
          <Route path="/diaryLook" element={<DiaryLook />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DiaryProvider>
  );
}

export default App;
