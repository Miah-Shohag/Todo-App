import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "../../components/admin/Header";
import { ThemeContext } from "../../hooks/ThemeContext";

import toast, { Toaster } from "react-hot-toast";
const AdminLayout = () => {
  const { isOpenMenu } = useContext(ThemeContext);

  return (
    <div className="">
      <Toaster position="top-center" />
      <div
        className={`sidebar ${
          isOpenMenu ? "w-0" : "w-64"
        } fixed top-0 left-0 bg-white h-svh`}
      >
        {!isOpenMenu && <Sidebar />}
      </div>
      <div className={`main ${isOpenMenu ? "ml-0" : "ml-64"}`}>
        <Header />
        <div className="p-5">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
