import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import TaskCard from "./TaskCard";
import { Link } from "react-router-dom";
import GlobalButton from "../../components/GlobalButton";
import { AiOutlineEdit } from "react-icons/ai";
import { ImCancelCircle } from "react-icons/im";
import { LuTrash } from "react-icons/lu";

const getStatusStyle = {
  pending: "bg-purple-100 text-purple-600",
  "in progress": "bg-cyan-100 text-cyan-600",
  completed: "bg-green-100 text-green-600",
};

const getBorderColor = {
  pending: "border-l-4 border-purple-500",
  "in progress": "border-l-4 border-cyan-500",
  completed: "border-l-4 border-green-500",
};

const getPriorityStyle = {
  high: "bg-red-100 text-red-600",
  medium: "bg-yellow-100 text-yellow-600",
  low: "bg-blue-100 text-blue-600",
};
const ManageTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editTask, setEditTask] = useState(null);
  const [formData, setFormData] = useState(null);
  const [deleteToTask, setDeleteToTask] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/tasks/me", {
          credentials: "include",
        });
        const result = await res.json();
        if (res.ok) setTasks(result.tasks);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setTasks((prev) => prev.filter((t) => t._id !== id));
        toast.success(data.message);
        setLoading(false);
        setDeleteToTask(null);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Failed to delete task");
      setLoading(false);
    }
  };

  const onEdit = (id) => {
    const taskToEdit = tasks.find((t) => t._id === id);
    setEditTask(taskToEdit);
    setFormData({ ...taskToEdit });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/tasks/${editTask._id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setTasks((prev) =>
          prev.map((task) =>
            task._id === editTask._id ? { ...task, ...formData } : task
          )
        );
        toast.success("Task updated successfully!");
        setEditTask(null);
        setFormData(null);
        setLoading(false);
      } else {
        setLoading(false);
        toast.error(data.message || "Update failed");
      }
    } catch (err) {
      setLoading(false);
      toast.error("Something went wrong while updating");
    }
  };

  const onToggleStatus = async (id) => {
    const task = tasks.find((t) => t._id === id);
    if (!task) return;

    const newStatus = task.status === "completed" ? "pending" : "completed";

    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...task, status: newStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Status updated");
        setTasks((prev) =>
          prev.map((t) => (t._id === id ? { ...t, status: newStatus } : t))
        );
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Failed to update status.");
    }
  };

  const onDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      handleDelete(id);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Manage Tasks</h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <h2 className="mx-auto font-medium text-md">
          You haven't created any tasks yet. To create a task{" "}
          <Link className="text-secondary" to="/dashboard/create-todo">
            Create a new todo
          </Link>
        </h2>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task, index) => (
            <div
              key={index}
              className={`relative bg-white bg-opacity-90 backdrop-blur-lg p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-200 ${
                getBorderColor[task.status]
              } hover:scale-[1.02]`}
            >
              {/* Edit/Delete/Complete */}
              <div className="absolute top-4 right-4 flex gap-2 text-gray-400">
                <input
                  type="checkbox"
                  checked={task.status === "completed"}
                  onChange={() => onToggleStatus(task._id)}
                  className="accent-green-600 cursor-pointer"
                  title="Mark as completed"
                />
                <AiOutlineEdit
                  onClick={() => onEdit(task._id)}
                  className="cursor-pointer hover:text-blue-600"
                  size={20}
                />
                <LuTrash
                  onClick={() => setDeleteToTask(task)}
                  className="cursor-pointer hover:text-red-600"
                  size={20}
                />
              </div>

              {/* Status & Priority */}
              <div className="flex gap-2 mb-4 flex-wrap">
                <span
                  className={`px-3 py-0.5 rounded-full text-xs font-semibold capitalize ${
                    getStatusStyle[task.status]
                  }`}
                >
                  {task.status}
                </span>

                <span
                  className={`px-3 py-0.5 rounded-full text-xs font-semibold capitalize ${
                    getPriorityStyle[task.priority]
                  }`}
                >
                  {task.priority}
                </span>
              </div>

              {/* Title & Description */}
              <div className="flex items-center gap-5">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {task.title}
                </h3>
                <span
                  className={`px-3 py-0.5 rounded-full bg-teal-100 text-xs capitalize `}
                >
                  {task.category}
                </span>
              </div>
              <p className="text-sm text-gray-600 line-clamp-3">
                {task.description}
              </p>

              {/* Dates */}
              <div className="flex justify-between text-xs text-gray-500 mt-4">
                <div>
                  <p className="font-medium">Created</p>
                  <p>{new Date(task.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="font-medium">Due</p>
                  <p>
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editTask && formData && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <form
            onSubmit={handleUpdate}
            className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative"
          >
            <button
              type="button"
              onClick={() => {
                setEditTask(null);
                setFormData(null);
              }}
              className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl"
            >
              &times;
            </button>

            <h3 className="text-xl font-semibold mb-4">Edit Task</h3>

            {/* Title */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Task Title
              </label>
              <input
                t
                ype="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md"
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full border px-3 py-2 rounded-md"
              />
            </div>

            {/* Category & Due Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate?.substring(0, 10)}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-md"
                />
              </div>
            </div>

            {/* Status & Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-md"
                >
                  <option value="pending">Pending</option>
                  <option value="in progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Priority
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-md"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div className="text-right">
              <GlobalButton
                type="submit"
                title={loading ? "Updating" : "Update Task"}
              />
            </div>
          </form>
        </div>
      )}

      {deleteToTask && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative">
            <span className="flex justify-center items-center mb-2">
              <ImCancelCircle size={28} className="text-red-600" />
            </span>
            <span className="text-center text-xl block font-bold">
              Are you sure?
            </span>
            <span className="text-xs block text-center my-3">
              Are you sure you want to delete the task from the record? This
              process cannot be undone.
            </span>
            <div className="text-right flex gap-5 justify-center items-center mt-5">
              <button
                onClick={() => setDeleteToTask(null)}
                className="px-3 py-1 text-sm cursor-pointer font-medium capitalize bg-gray-200 text-black rounded-lg"
              >
                Cancel
              </button>
              <button
                disabled={loading}
                onClick={() => handleDelete(deleteToTask._id)}
                className={`px-3 py-1 text-sm cursor-pointer font-medium capitalize bg-red-600 text-white rounded-lg ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTasks;
