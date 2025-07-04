// src/pages/admin/SignIn.jsx
import React, { useContext, useState } from "react";
import GlobalButton from "../../components/GlobalButton";
import { Link, Navigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { ThemeContext } from "../../hooks/ThemeContext";

const SignIn = () => {
  const { user, setUser } = useContext(ThemeContext);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // If user is already logged in, redirect immediately
  if (user) return <Navigate to="/dashboard" />;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const result = await res.json();

      if (res.ok) {
        toast.success(result.message || "Login successfully!");
        setUser(result.user); // <-- Update context user here for instant redirect
        setFormData({ email: "", password: "" });
      } else {
        toast.error(result.message || "Something went wrong.");
      }
    } catch (error) {
      toast.error(error.message || "Network error.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg">
        <div className="p-6 space-y-4">
          <h2 className="text-2xl font-bold text-center">Sign In</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-2 w-full mt-3 relative">
              <label className="font-medium text-sm capitalize" htmlFor="email">
                Email
              </label>
              <input
                className="w-full border border-slate-300 px-4 py-2.5 text-sm text-black placeholder:text-slate-400 focus:ring-1 focus:ring-secondary focus:outline-none focus:border-0 rounded-sm"
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="flex flex-col gap-2 w-full mt-3 relative">
              <label
                className="font-medium text-sm capitalize"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="w-full border border-slate-300 px-4 py-2.5 text-sm text-black placeholder:text-slate-400 focus:ring-1 focus:ring-secondary focus:outline-none focus:border-0 rounded-sm"
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>
            <GlobalButton
              type="submit"
              title={isLoading ? "Submitting..." : "Sign In"}
              customClass="w-full"
              disabled={isLoading}
            />
          </form>
          <div className="flex items-center justify-center">
            Don't have an account?
            <Link className="ml-2 font-medium text-blue-600" to="/signup">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
