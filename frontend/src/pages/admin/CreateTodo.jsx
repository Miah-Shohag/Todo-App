import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import GlobalButton from "../../components/GlobalButton";
import toast from "react-hot-toast";
import { TaskContext } from "../../hooks/TaskContext";

const CreateTodo = () => {
  const { addPost } = useContext(TaskContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    status: "pending",
    priority: "medium",
    dueDate: "",
  });

  const wordCount = formData.description
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Limit description to 50 words
    if (name === "description") {
      const words = value.trim().split(/\s+/).filter(Boolean);
      if (words.length > 50) return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await addPost(formData);

    if (result.success) {
      toast.success("Post added successfully!");
      setFormData({
        title: "",
        description: "",
        category: "",
        status: "draft",
      });
      navigate("/dashboard/manage-tasks");
    } else {
      toast.error(result.message || "Failed to add post");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white dark:bg-[#1f1f2e] rounded-2xl shadow-xl p-8 transition-all">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Create New Task
        </h2>
        <Link
          to="/dashboard/manage-tasks"
          className="bg-secondary text-white px-4 py-2 text-sm font-semibold rounded-lg hover:scale-105 transition-transform"
        >
          View All Tasks
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
            Task Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Finish React Assignment"
            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary focus:outline-none dark:bg-[#2a2a40] dark:text-white dark:border-gray-600"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Describe the task (max 50 words)"
            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-secondary focus:outline-none dark:bg-[#2a2a40] dark:text-white dark:border-gray-600"
          />
          <div className="text-xs mt-1 text-right text-gray-500 dark:text-gray-400">
            Words: {wordCount} / 50
          </div>
        </div>

        {/* Grid: Category & Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
              Category
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g. School, Work, Personal"
              className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary focus:outline-none dark:bg-[#2a2a40] dark:text-white dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
              Due Date
            </label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary focus:outline-none dark:bg-[#2a2a40] dark:text-white dark:border-gray-600"
            />
          </div>
        </div>

        {/* Grid: Status & Priority */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary focus:outline-none dark:bg-[#2a2a40] dark:text-white dark:border-gray-600"
            >
              <option value="pending">Pending</option>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
              Priority
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary focus:outline-none dark:bg-[#2a2a40] dark:text-white dark:border-gray-600"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div className="pt-4">
          <GlobalButton type="submit" title="Create Task" />
        </div>
      </form>
    </div>
  );
};

export default CreateTodo;
