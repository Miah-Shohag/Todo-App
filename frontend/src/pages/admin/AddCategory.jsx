import React, { useState } from "react";
import GlobalButton from "../../components/GlobalButton";
import InputField from "../../components/InputField";
import { Link } from "react-router-dom";

const AddCategory = () => {
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!categoryName.trim()) {
      setError("Category name is required.");
      setSuccess(false);
      return;
    }

    // Simulate a successful submission
    console.log("Category Submitted:", { categoryName, description });
    setError("");
    setSuccess(true);

    // Reset form
    setCategoryName("");
    setDescription("");
  };

  return (
    <div className="p-6 max-w-[80%] mx-auto bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center gap-5">
        <h2 className="text-xl font-semibold">Add New Category</h2>
        <Link
          to="/dashboard/categories"
          className="bg-secondary px-4 py-2 text-white text-xs font-semibold rounded-lg shadow-lg shadow-secondary/30 my-3 hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer"
        >
          All Categories
        </Link>
      </div>

      {error && <div className="text-red-600 mb-2">{error}</div>}
      {success && (
        <div className="text-green-600 mb-2">Category added successfully!</div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <InputField
            label="Category Name"
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Enter category name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">
            Description (optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full text-sm p-2 border border-slate-300 rounded-md focus:outline-none focus:ring focus:border-secondary"
            rows="3"
            placeholder="Add some details"
          />
        </div>

        <GlobalButton type="submit" title="Add Category" />
      </form>
    </div>
  );
};

export default AddCategory;
