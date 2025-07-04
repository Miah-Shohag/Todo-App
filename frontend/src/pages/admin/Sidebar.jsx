import React, { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import Avatar from "../../assets/avatar.jpg";
import { MdDashboard, MdSettings, MdAccountCircle } from "react-icons/md";
import { AiOutlineLogout } from "react-icons/ai";
import { BiTask } from "react-icons/bi";
import { VscNewFile } from "react-icons/vsc";
import { ThemeContext } from "../../hooks/ThemeContext";

const Sidebar = () => {
  const { user } = useContext(ThemeContext);
  const [openSubMenu, setOpenSubMenu] = useState(null);

  const toggleSubMenu = (name) => {
    setOpenSubMenu((prev) => (prev === name ? null : name));
  };

  // Define nav items with roles allowed to see them
  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <MdDashboard />,
      roles: ["user", "admin"],
    },
    {
      name: "Manage Tasks",
      path: "/dashboard/manage-tasks",
      icon: <BiTask />,
      roles: ["admin", "user"],
    },
    {
      name: "All Tasks",
      path: "/dashboard/all-tasks",
      icon: <BiTask />,
      roles: ["admin"],
    },
    {
      name: "Users",
      path: "/dashboard/users",
      icon: <BiTask />,
      roles: ["admin"],
    },
    {
      name: "Create Todo",
      path: "/dashboard/create-todo",
      icon: <VscNewFile />,
      roles: ["user", "admin"],
    },
    {
      name: "Completed",
      path: "/dashboard/me/completed-tasks",
      icon: <VscNewFile />,
      roles: ["user", "admin"],
    },
    {
      name: "Profile",
      path: "/dashboard/profile",
      icon: <MdAccountCircle />,
      roles: ["user", "admin"],
    },
    {
      name: "Settings",
      path: "/dashboard/settings",
      icon: <MdSettings />,
      roles: ["admin"],
    },
    {
      name: "Logout",
      path: "/dashboard/logout",
      icon: <AiOutlineLogout />,
      roles: ["user", "admin"],
    },
  ];

  // Filter items by current user role
  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(user?.role)
  );

  return (
    <div className="w-full">
      <div className="flex flex-col items-center my-5 gap-2">
        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-secondary shadow group">
          <img
            src={user?.image || Avatar}
            alt="User avatar"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <span className="text-white font-medium px-4 py-1 bg-secondary rounded-full text-sm">
          {user?.role}
        </span>
      </div>

      <nav>
        <ul className="flex flex-col gap-2">
          {filteredNavItems.map((item, index) => (
            <li key={index} className="relative font-medium text-sm">
              <NavLink
                to={item.path}
                end={item.path === "/dashboard"}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 dark:hover:bg-gray-700 ${
                    isActive
                      ? "bg-green-100 text-green-600 dark:bg-gray-600 border-r-3 border-green-600"
                      : "hover:bg-gray-200"
                  }`
                }
              >
                <span>{item.icon}</span>
                <span className="hidden lg:block">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
