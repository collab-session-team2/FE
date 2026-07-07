import { Outlet, useLocation } from "react-router-dom";
import Footer from "../components/Footer/Footer";

export default function RootLayout() {
  const location = useLocation();

  const hideFooter =
    location.pathname === "/create" || location.pathname === "/add";

  return (
    <>
      <main>
        <Outlet />
      </main>

      {!hideFooter && <Footer />}
    </>
  );
}
