import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages and Layouts
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Profile from "./pages/admin/Profile";
import Settings from "./pages/admin/Settings";
import NotFound from "./pages/NotFound";
import CreateTodo from "./pages/admin/CreateTodo";
import ManageTasks from "./pages/admin/ManageTasks";
import SignUp from "./pages/admin/SignUp";
import SignIn from "./pages/admin/SignIn";
import LogOut from "./pages/admin/LogOut";
import CompletedTasks from "./pages/admin/CompletedTasks";

import ProtectedRoute from "./components/ProtectedRoute";
import { ThemeContext } from "./hooks/ThemeContext";
import AllTasks from "./pages/admin/AllTasks";
import Users from "./pages/admin/Users";
import { TaskContextProvider } from "./hooks/TaskContext";

const App = () => {
  const { user, loading } = useContext(ThemeContext);

  return (
    <TaskContextProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />

          {/* Protected routes for any logged-in user */}
          <Route element={<ProtectedRoute allowedRoles={["user", "admin"]} />}>
            <Route path="/dashboard" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="manage-tasks" element={<ManageTasks />} />
              <Route path="create-todo" element={<CreateTodo />} />
              <Route path="me/completed-tasks" element={<CompletedTasks />} />
              <Route path="profile" element={<Profile />} />
              <Route path="logout" element={<LogOut />} />
            </Route>
          </Route>

          {/* Admin-only routes */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/dashboard" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="manage-tasks" element={<ManageTasks />} />
              <Route path="all-tasks" element={<AllTasks />} />
              <Route path="users" element={<Users />} />
              <Route path="settings" element={<Settings />} />
              {/* Add more admin-only routes here */}
            </Route>
          </Route>
          {/* Catch all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </TaskContextProvider>
  );
};

export default App;
