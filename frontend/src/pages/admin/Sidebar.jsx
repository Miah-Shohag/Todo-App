import React, { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import Avatar from "../../assets/avatar.jpg";

import { ThemeContext } from "../../hooks/ThemeContext";

import {
  Home,
  ListChecks,
  ListTodo,
  Users,
  PlusCircle,
  CheckCircle2,
  UserCircle,
  Settings,
  LogOut,
} from "lucide-react";

const Sidebar = () => {
  const { user } = useContext(ThemeContext);
  const [openSubMenu, setOpenSubMenu] = useState(null);

  const toggleSubMenu = (name) => {
    setOpenSubMenu((prev) => (prev === name ? null : name));
  };

  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <Home className="w-4 h-4" />,
      roles: ["user", "admin"],
    },
    { name: "Tasks Management", roles: ["user", "admin"] },
    {
      name: "Manage Tasks",
      path: "/dashboard/manage-tasks",
      icon: <ListChecks className="w-4 h-4" />,
      roles: ["user", "admin"],
    },
    {
      name: "All Tasks",
      path: "/dashboard/all-tasks",
      icon: <ListTodo className="w-4 h-4" />,
      roles: ["admin"],
    },
    {
      name: "Create Todo",
      path: "/dashboard/create-todo",
      icon: <PlusCircle className="w-4 h-4" />,
      roles: ["user", "admin"],
    },
    {
      name: "Completed",
      path: "/dashboard/me/completed-tasks",
      icon: <CheckCircle2 className="w-4 h-4" />,
      roles: ["user", "admin"],
    },

    { name: "Accounts", roles: ["user", "admin"] },
    {
      name: "Users",
      path: "/dashboard/users",
      icon: <Users className="w-4 h-4" />,
      roles: ["admin"],
    },

    {
      name: "Profile",
      path: "/dashboard/profile",
      icon: <UserCircle className="w-4 h-4" />,
      roles: ["user", "admin"],
    },
    { name: "System", roles: ["user", "admin"] },
    {
      name: "Settings",
      path: "/dashboard/settings",
      icon: <Settings className="w-4 h-4" />,
      roles: ["admin"],
    },
    {
      name: "Logout",
      path: "/dashboard/logout",
      icon: <LogOut className="w-4 h-4" />,
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
        <ul className="flex flex-col gap-2 mx-5">
          {filteredNavItems.map((item, index) => (
            <li key={index} className="relative text-sm">
              {item.path ? (
                <NavLink
                  to={item.path}
                  end={item.path === "/dashboard"}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ml-2 ${
                      isActive
                        ? "bg-secondary text-white dark:bg-gray-700"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`
                  }
                >
                  <span className="">{item.icon}</span>
                  <span>{item.name}</span>
                </NavLink>
              ) : (
                <div className="mt-4 mb-1 px-4 font-semibold text-[10px] uppercase tracking-widest text-gray-500 dark:text-gray-400">
                  {item.name}
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
