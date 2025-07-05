import React, { useContext, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "../../components/admin/Header";
import { ThemeContext } from "../../hooks/ThemeContext";
import toast, { Toaster } from "react-hot-toast";

const AdminLayout = () => {
  const { isOpenMenu, setIsOpenMenu } = useContext(ThemeContext);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsOpenMenu(true); // Close sidebar on small screens
      }
    };

    handleResize(); // Check on initial load
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [setIsOpenMenu]);

  return (
    <div className="relative">
      <Toaster position="top-center" />
      <div
        className={`sidebar transition-all duration-300 ${
          isOpenMenu ? "w-0" : "w-64"
        } fixed top-0 left-0 bg-white h-svh overflow-hidden`}
      >
        {!isOpenMenu && <Sidebar />}
      </div>

      <div
        className={`main transition-all duration-300 ${
          isOpenMenu ? "ml-0" : "ml-64"
        }`}
      >
        <Header />
        <div className="p-5">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
