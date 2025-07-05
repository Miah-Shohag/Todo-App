import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ThemeContext } from "../../hooks/ThemeContext";

const LogOut = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(ThemeContext);

  useEffect(() => {
    const handleLogout = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users/logout", {
          method: "POST",
          credentials: "include",
        });

        const data = await res.json();

        if (res.ok) {
          setUser(null); // Clear user from context
          toast.success(data.message || "Logged out");
          navigate("");
        } else {
          toast.error(data.message || "Logout failed");
        }
      } catch (error) {
        toast.error("Something went wrong during logout");
      }
    };

    handleLogout();
  }, [navigate, setUser]);

  return <div className="p-4 text-center text-gray-600">Logging out...</div>;
};

export default LogOut;
