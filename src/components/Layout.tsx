import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { Breadcrumbs } from "./Breadcrumbs";

export function Layout() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {!isHome && <Breadcrumbs />}
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
