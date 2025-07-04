import React from "react";

const GlobalButton = ({ type, title, customClass }) => {
  return (
    <button
      type={type}
      className={`${customClass} bg-secondary px-4 py-2 text-white text-xs font-semibold rounded-lg shadow-lg shadow-secondary/30 hover:scale-102 transition-all duration-300 ease-in-out cursor-pointer`}
    >
      {title}
    </button>
  );
};

export default GlobalButton;
