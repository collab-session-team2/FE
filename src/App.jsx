import { BrowserRouter, Routes, Route } from "react-router-dom";
import RootLayout from "../src/layout/RootLayout.jsx";
import Main from "../src/pages/Main/Main.jsx";
import MissionPage from "./pages/mission/MissionPage";

import RootLayout from "./layout/RootLayout";
import Home from "./pages/Home/Home";
import RoomCreate from "./pages/roomCreate/RoomCreate";
import DiaryMain from "./pages/diary/diaryMain";
import DiaryWrite from "./pages/diary/diaryWrite";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<Main />} />
          <Route path="/add" element={<></>} />{" "}
          <Route path="/mission" element={<MissionPage />} />
          {/* 추후 element에 상품 등록 페이지 들어가야함 */}
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<RoomCreate />} />
          <Route path="/diaryMain" element={<DiaryMain />} />
          <Route path="/diaryWrite" element={<DiaryWrite />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
