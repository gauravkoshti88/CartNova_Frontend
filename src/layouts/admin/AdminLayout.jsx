import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";
import { Outlet } from "react-router-dom";
import ScrollToTop from "../../components/ScrollToTop";
import AdminFooter from "./Footer/AdminFooter";
import { Loader } from "../../components/States";

const AdminLayout = () => {
  const { mode } = useSelector((state) => state.theme);
  const { loading } = useSelector((state) => state.website);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", mode === "dark");
  }, [mode]);

  if (loading) {
    return <Loader />;
  }
  return (
    <div className="bg-white dark:bg-slate-900">
      <ScrollToTop />
      <AdminNavbar />
      <AdminSidebar />
      <div className="ml-22 md:ml-64 mt-18 h-full bg-white dark:bg-slate-900">
        <Outlet />
      </div>
      <AdminFooter />
    </div>
  );
};

export default AdminLayout;
