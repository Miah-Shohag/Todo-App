import React from "react";

const Card = ({ label, summary }) => {
  return (
    <div className="bg-white p-4 shadow text-center rounded-xl border-t-4 border-secondary">
      <h2 className="text-lg font-semibold">{label}</h2>
      <p className="text-2xl font-bold text-green-600">{summary}</p>
    </div>
  );
};

export default Card;
