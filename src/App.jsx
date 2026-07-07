import { BrowserRouter, Routes, Route } from "react-router-dom";
import RootLayout from "../src/layout/RootLayout.jsx";
import Home from "../src/pages/Home/Home.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<></>} />{" "}
          {/* 추후 element에 상품 등록 페이지 들어가야함 */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
