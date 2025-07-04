import React, { useContext, useState } from "react";
import Avatar from "../../assets/avatar.jpg";
import GlobalButton from "../../components/GlobalButton";
import { LuEye, LuEyeOff, LuUpload } from "react-icons/lu";
import { ThemeContext } from "../../hooks/ThemeContext";
import toast from "react-hot-toast";

const Profile = () => {
  const [file, setFile] = useState(null);
  const { user } = useContext(ThemeContext);

  const [formData, setFormData] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const togglePassword = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleFile = (e) => {
    setFile(e.target.files[0]);
  };

  // Upload avatar
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please select a file");

    const imageForm = new FormData();
    imageForm.append("image", file);

    try {
      const res = await fetch("http://localhost:5000/api/users/upload", {
        method: "POST",
        credentials: "include",
        body: imageForm,
      });

      const data = await res.json();
      res.ok ? toast.success(data.message) : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Update password
  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "http://localhost:5000/api/users/updatePassword",
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword: formData.current,
            newPassword: formData.new,
            confirmPassword: formData.confirm,
          }),
        }
      );

      const data = await res.json();
      res.ok ? toast.success(data.message) : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 bg-white dark:bg-[#1f1f2e] shadow-lg rounded-2xl p-8 flex flex-col md:flex-row gap-10">
      {/* Avatar Upload */}
      <div className="flex flex-col items-center gap-5 md:w-1/3">
        <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-secondary shadow group">
          <img
            src={file ? URL.createObjectURL(file) : user?.image || Avatar}
            alt="User avatar"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-4 w-full"
        >
          <div className="relative">
            <label
              htmlFor="image"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-white cursor-pointer shadow-md transition-colors"
            >
              <LuUpload className="text-lg" />
              Select new avatar
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              className="hidden"
              onChange={handleFile}
            />
          </div>

          <button
            type="submit"
            className="bg-secondary text-white px-6 py-2 rounded-md shadow-md hover:scale-[1.02] transition-all text-sm"
          >
            Upload Avatar
          </button>
        </form>
      </div>

      {/* User Info & Password Section */}
      <div className="flex-1">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-slate-800 dark:text-white">
            {user?.username}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-300">
            {user?.email}
          </p>
        </div>

        <form className="flex flex-col gap-5" onSubmit={handleUpdatePassword}>
          {[
            { label: "Current", name: "current" },
            { label: "New", name: "new" },
            { label: "Confirm", name: "confirm" },
          ].map(({ label, name }) => (
            <div key={name}>
              <label
                htmlFor={name}
                className="block text-sm font-medium text-slate-700 dark:text-slate-200 capitalize mb-1"
              >
                {label} Password
              </label>
              <div className="relative">
                <input
                  type={showPassword[name] ? "text" : "password"}
                  name={name}
                  id={name}
                  value={formData[name]}
                  onChange={handleChange}
                  placeholder={`${label} Password`}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-secondary dark:bg-[#2a2a40] dark:text-white"
                />
                <div
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-600 dark:text-slate-300"
                  onClick={() => togglePassword(name)}
                >
                  {showPassword[name] ? <LuEyeOff /> : <LuEye />}
                </div>
              </div>
            </div>
          ))}

          <GlobalButton
            type="submit"
            title="Update Password"
            customClass="mt-2"
          />
        </form>
      </div>
    </div>
  );
};

export default Profile;
