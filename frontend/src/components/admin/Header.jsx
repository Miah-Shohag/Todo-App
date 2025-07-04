import React, { useContext, useEffect, useRef, useState } from "react";
import { LuBell, LuMenu, LuMessageCircle } from "react-icons/lu";
import { ThemeContext } from "../../hooks/ThemeContext";

const Header = () => {
  const { setIsOpenMenu, user } = useContext(ThemeContext);
  const dropdownRef = useRef(null);
  const [openDropdown, setOpenDropdown] = useState(null); // 'notification' | 'message' | null

  const toggleDropdown = (type) => {
    setOpenDropdown((prev) => (prev === type ? null : type));
  };

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-white p-5 sticky top-0 z-20 flex justify-between items-center shadow-sm">
      {/* Left: Menu Button */}
      <button
        onClick={() => setIsOpenMenu((prev) => !prev)}
        className="bg-slate-100 p-2 rounded-full hover:bg-slate-200 transition"
      >
        <LuMenu className="text-xl" />
      </button>

      {/* Right: Icons */}
      <div className="flex items-center gap-4 relative" ref={dropdownRef}>
        {/* Notification */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown("notification")}
            className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition relative"
          >
            <LuBell className="text-xl" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full" />
          </button>

          {openDropdown === "notification" && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-md p-3 z-50">
              <p className="text-sm font-semibold mb-2">Notifications</p>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>🔔 New comment on your post</li>
                <li>📌 Weekly update available</li>
                <li>✅ Task completed</li>
              </ul>
            </div>
          )}
        </div>

        {/* Message */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown("message")}
            className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition relative"
          >
            <LuMessageCircle className="text-xl" />
            <span className="absolute -top-1 right-0 w-3 h-3 bg-red-600 rounded-full" />
          </button>

          {openDropdown === "message" && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-md p-3 z-50">
              <p className="text-sm font-semibold mb-2">Messages</p>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>💬 John: "Hey, are you available?"</li>
                <li>💬 Anna: "Check out this update."</li>
                <li>💬 Admin: "System maintenance tonight."</li>
              </ul>
            </div>
          )}
        </div>

        <h3>Hi, {user?.username}</h3>
      </div>
    </div>
  );
};

export default Header;
