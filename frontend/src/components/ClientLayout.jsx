import { Outlet } from "react-router";
import NavBar from "./NavBar";
import Footer from "./Footer";

function ClientLayout() {
  return (
    <div className="min-h-screen">
      <NavBar />
      <Outlet />
      <Footer />
    </div>
  );
}

export default ClientLayout;
