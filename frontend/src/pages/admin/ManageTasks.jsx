import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import TaskCard from "./TaskCard";
import { Link } from "react-router-dom";
import GlobalButton from "../../components/GlobalButton";

const ManageTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editTask, setEditTask] = useState(null);
  const [formData, setFormData] = useState(null);

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
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setTasks((prev) => prev.filter((t) => t._id !== id));
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete task");
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
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while updating");
    }
  };
  const handleToggleStatus = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === id
          ? {
              ...task,
              status: task.status === "completed" ? "pending" : "completed", // or "in progress"
            }
          : task
      )
    );
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
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={onEdit}
              onDelete={handleDelete}
              onStatusToggle={handleToggleStatus}
            />
          ))}
        </div>
      )}

      {editTask && formData && (
        <div className="absolute top-0 left-0 bg-black/30 w-full h-full z-50 flex items-center justify-center">
          <form
            onSubmit={handleUpdate}
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl relative"
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
              <GlobalButton type="submit" title="Update Task" />
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ManageTasks;
