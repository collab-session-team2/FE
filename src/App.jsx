import { BrowserRouter, Routes, Route } from "react-router-dom";
import RootLayout from "../src/layout/RootLayout.jsx";
import Main from "../src/pages/Main/Main.jsx";
import MissionPage from "./pages/mission/MissionPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<Main />} />
          <Route path="/add" element={<></>} />{" "}
          <Route path="/mission" element={<MissionPage />} />
          {/* 추후 element에 상품 등록 페이지 들어가야함 */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
