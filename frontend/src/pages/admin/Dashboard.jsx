import React, { useEffect, useState } from "react";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { Toaster, toast } from "react-hot-toast";
import { Link } from "react-router-dom";

// Helper styles
const getStatusStyle = {
  pending: "bg-purple-100 text-purple-600",
  "in progress": "bg-cyan-100 text-cyan-600",
  completed: "bg-green-100 text-green-600",
};

const getPriorityStyle = {
  high: "bg-red-100 text-red-600",
  medium: "bg-yellow-100 text-yellow-600",
  low: "bg-blue-100 text-blue-600",
};

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editTask, setEditTask] = useState(null);

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/tasks/me", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          setTasks(data.tasks);
        } else {
          toast.error(data.message || "Failed to fetch tasks.");
        }
      } catch (error) {
        toast.error("Failed to fetch tasks.");
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  // Delete task
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        setTasks((prev) => prev.filter((task) => task._id !== id));
      } else {
        toast.error(data.message || "Failed to delete task.");
      }
    } catch (err) {
      toast.error("Error deleting task.");
    }
  };

  // Handle status toggle
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

  const onEdit = (id) => {
    const taskToEdit = tasks.find((t) => t._id === id);
    setEditTask(taskToEdit);
  };

  // Save edited task
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:5000/api/tasks/${editTask._id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editTask),
        }
      );
      const data = await res.json();
      if (res.ok) {
        toast.success("Task updated");
        setTasks((prev) =>
          prev.map((t) => (t._id === editTask._id ? editTask : t))
        );
        setEditTask(null);
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch (err) {
      toast.error("Failed to update task.");
    }
  };

  const getSummary = () => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "completed").length;
    const pending = tasks.filter((t) => t.status === "pending").length;
    return { total, completed, pending };
  };

  const summary = getSummary();

  return (
    <div className="p-5">
      <Toaster />
      <h1 className="text-2xl font-bold mb-4">Dashboard Summary</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow text-center">
          <h2 className="text-lg font-semibold">Total Tasks</h2>
          <p className="text-2xl font-bold text-blue-600">{summary.total}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h2 className="text-lg font-semibold">Completed</h2>
          <p className="text-2xl font-bold text-green-600">
            {summary.completed}
          </p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h2 className="text-lg font-semibold">Pending</h2>
          <p className="text-2xl font-bold text-purple-600">
            {summary.pending}
          </p>
        </div>
      </div>

      {/* Task Table */}
      {loading ? (
        <p>Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <h2 className="mx-auto font-medium text-md">
          You haven't created any tasks yet. To create a task{" "}
          <Link className="text-secondary" to="/dashboard/create-todo">
            Create a new todo
          </Link>
        </h2>
      ) : (
        <div className="overflow-x-auto w-full bg-white rounded-xl shadow-md">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-secondary text-left text-white uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Due Date</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tasks.map((task) => (
                <tr key={task._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {task.title}
                  </td>
                  <td className="px-4 py-3 text-gray-600 line-clamp-2 max-w-xs">
                    {task.description}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        getStatusStyle[task.status]
                      }`}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        getPriorityStyle[task.priority]
                      }`}
                    >
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center items-center gap-4">
                      <input
                        type="checkbox"
                        checked={task.status === "completed"}
                        onChange={() => onToggleStatus(task._id)}
                        className="accent-green-600 cursor-pointer"
                        title="Mark as completed"
                      />
                      <AiFillEdit
                        onClick={() => onEdit(task._id)}
                        className="text-blue-600 hover:text-blue-800 cursor-pointer"
                        size={18}
                      />
                      <AiFillDelete
                        onClick={() => onDelete(task._id)}
                        className="text-red-600 hover:text-red-800 cursor-pointer"
                        size={18}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {editTask && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Edit Task</h2>
            <form onSubmit={handleEditSubmit} className="space-y-3">
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={editTask.title}
                onChange={(e) =>
                  setEditTask({ ...editTask, title: e.target.value })
                }
              />
              <textarea
                className="w-full p-2 border rounded"
                value={editTask.description}
                onChange={(e) =>
                  setEditTask({ ...editTask, description: e.target.value })
                }
              />
              <select
                className="w-full p-2 border rounded"
                value={editTask.status}
                onChange={(e) =>
                  setEditTask({ ...editTask, status: e.target.value })
                }
              >
                <option value="pending">Pending</option>
                <option value="in progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <select
                className="w-full p-2 border rounded"
                value={editTask.priority}
                onChange={(e) =>
                  setEditTask({ ...editTask, priority: e.target.value })
                }
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 rounded"
                  onClick={() => setEditTask(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
