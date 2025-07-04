import React from "react";

const InputField = ({ label, name, placeholder, type }) => {
  return (
    <div className="flex flex-col gap-2 w-full mt-3 relative">
      <label className="font-medium text-sm capitalize" htmlFor={name}>
        {label}
      </label>
      <input
        className="w-full border border-slate-300 px-4 py-2.5 text-sm text-black placeholder:text-slate-400 focus:ring-1 focus:ring-secondary focus:outline-none focus:border-0 rounded-sm"
        type={type}
        name={name}
        placeholder={placeholder}
        id={name}
      />
    </div>
  );
};

export default InputField;
