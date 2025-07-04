import React, { useState } from "react";
import { LuEye, LuEyeOff } from "react-icons/lu";

const InputField = ({ label, name, placeholder, type }) => {
  const [showPassword, setShowPassword] = useState();

  return (
    <div className="flex flex-col gap-1 w-full mt-3">
      <label className="font-medium text-sm capitalize" htmlFor={name}>
        {label}
      </label>
      <div className="relative">
        <input
          className="w-full border border-slate-300 px-4 py-2 text-sm font-medium text-black placeholder:text-slate-400 focus:ring-1 focus:ring-secondary focus:outline-none focus:border-0 rounded-md"
          type={type}
          name={name}
          placeholder={placeholder}
          id={name}
        />
        <LuEye className="absolute top-1/2 right-4 -translate-y-1/2 " />
      </div>
    </div>
  );
};

export default InputField;
