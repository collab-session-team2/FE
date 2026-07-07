import { BrowserRouter, Routes, Route } from "react-router-dom";

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
