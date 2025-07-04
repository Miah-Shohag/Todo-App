import React from "react";

const SelectField = ({ label, name, value = [] }) => {
  return (
    <>
      <label className="block font-medium mb-2 text-sm">{label}</label>
      <select
        name="status"
        className="w-full border border-slate-300 px-4 py-2.5 text-sm text-black placeholder:text-slate-400 focus:ring-1 focus:ring-secondary focus:outline-none focus:border-0 rounded-sm"
      >
        {value.map((item, index) => (
          <option key={index} value={item.toLowerCase()}>
            {item}
          </option>
        ))}
      </select>
    </>
  );
};

export default SelectField;
