import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Link, Navigate, useNavigate } from "react-router-dom";
import InputField from "../../components/InputField";
import GlobalButton from "../../components/GlobalButton";

const SignUp = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/users/create-user", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      });

      const result = await res.json();
      if (res.ok) {
        toast.success(result.message || "Account created successfully!");
        // Optionally reset form
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        setIsLoading(false);
        navigate("/signin");
      } else {
        toast.error(result.message || "Something went wrong.");
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      toast.error(error.message || "Network error.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md">
        <div className="p-6 space-y-4">
          <h2 className="text-2xl font-bold text-center">Sign Up</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-2 w-full mt-3 relative">
              <label
                className="font-medium text-sm capitalize"
                htmlFor="username"
              >
                Username
              </label>
              <input
                className="w-full border border-slate-300 px-4 py-2.5 text-sm text-black placeholder:text-slate-400 focus:ring-1 focus:ring-secondary focus:outline-none focus:border-0 rounded-sm"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
              />
            </div>

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
              />
            </div>

            <div className="flex flex-col gap-2 w-full mt-3 relative">
              <label
                className="font-medium text-sm capitalize"
                htmlFor="confirmPassword"
              >
                Confirm Password
              </label>
              <input
                className="w-full border border-slate-300 px-4 py-2.5 text-sm text-black placeholder:text-slate-400 focus:ring-1 focus:ring-secondary focus:outline-none focus:border-0 rounded-sm"
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
              />
            </div>
            <GlobalButton
              type="submit"
              title={`${isLoading ? "Submitting" : "Sign Up"}`}
              customClass="w-full"
            />
          </form>
          <div className="flex items-center justify-center">
            Do you have already an account?
            <Link className="ml-2 font-medium text-blue-600" to="/">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
