RootLayout.jsx;
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer/Footer.jsx";

export default function RootLayout() {
  return (
    <>
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
