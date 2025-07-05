import React, { useEffect, useState } from "react";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { Toaster, toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import Card from "../../components/admin/Card";
import { ImCancelCircle } from "react-icons/im";

// Styles
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
  const [deleteToTask, setDeleteToTask] = useState(null);

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

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        setTasks((prev) => prev.filter((task) => task._id !== id));
        setLoading(false);
        setDeleteToTask(null);
      } else {
        setLoading(false);
        toast.error(data.message || "Failed to delete task.");
      }
    } catch {
      toast.error("Error deleting task.");
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

  const onEdit = (id) => {
    const taskToEdit = tasks.find((t) => t._id === id);
    setEditTask(taskToEdit);
  };

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
    } catch {
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
    <div className="p-4 sm:p-5">
      <Toaster />
      <div className="flex flex-col gap-2 mb-10 text-center">
        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold leading-tight">
          Welcome to Todo Dashboard Management.
        </h1>
        <p className="text-sm sm:text-base text-gray-600 font-medium">
          Make your day more productive and enjoyable.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card label="Total tasks" summary={summary.total} />
        <Card label="Completed" summary={summary.completed} />
        <Card label="Pending" summary={summary.pending} />
        <Card label="Pending" summary={summary.pending} />
      </div>

      {/* Task Table */}
      {loading ? (
        <p className="text-center">Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <h2 className="text-center font-medium text-md">
          You haven't created any tasks yet.{" "}
          <Link
            className="text-secondary underline"
            to="/dashboard/create-todo"
          >
            Create a new todo
          </Link>
        </h2>
      ) : (
        <div className="overflow-x-auto w-full bg-white rounded-xl shadow-md">
          <table className="min-w-full divide-y divide-gray-200 text-sm sm:text-base">
            <thead className="bg-secondary text-white uppercase tracking-wider">
              <tr>
                <th className="px-2 py-2 sm:px-4 sm:py-3">Title</th>
                <th className="px-2 py-2 sm:px-4 sm:py-3">Description</th>
                <th className="px-2 py-2 sm:px-4 sm:py-3">Status</th>
                <th className="px-2 py-2 sm:px-4 sm:py-3">Priority</th>
                <th className="px-2 py-2 sm:px-4 sm:py-3">Due Date</th>
                <th className="px-2 py-2 sm:px-4 sm:py-3 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tasks.map((task) => (
                <tr key={task._id} className="hover:bg-gray-50">
                  <td className="px-2 sm:px-4 py-3 font-medium text-gray-800">
                    {task.title.slice(0, 10)}...
                  </td>
                  <td className="px-2 sm:px-4 py-3 text-gray-600 line-clamp-2 max-w-xs">
                    {task.description.slice(0, 20)}...
                  </td>
                  <td className="px-2 sm:px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        getStatusStyle[task.status]
                      }`}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td className="px-2 sm:px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        getPriorityStyle[task.priority]
                      }`}
                    >
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-2 sm:px-4 py-3 text-gray-500">
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "N/A"}
                  </td>
                  <td className="px-2 sm:px-4 py-3 text-center">
                    <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4">
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
                        onClick={() => setDeleteToTask(task)}
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
          <div className="bg-white p-6 rounded shadow w-full max-w-md mx-2 sm:mx-0">
            <h2 className="text-lg font-bold mb-4">Edit Task</h2>
            <form onSubmit={handleEditSubmit} className="space-y-3">
              <input
                type="text"
                className="w-full p-2 sm:p-3 text-sm sm:text-base border rounded"
                value={editTask.title}
                onChange={(e) =>
                  setEditTask({ ...editTask, title: e.target.value })
                }
              />
              <textarea
                className="w-full p-2 sm:p-3 text-sm sm:text-base border rounded"
                value={editTask.description}
                onChange={(e) =>
                  setEditTask({ ...editTask, description: e.target.value })
                }
              />
              <select
                className="w-full p-2 sm:p-3 text-sm sm:text-base border rounded"
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
                className="w-full p-2 sm:p-3 text-sm sm:text-base border rounded"
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
                className="px-3 py-1 text-sm font-medium cursor-pointer capitalize bg-gray-200 text-black rounded-lg"
              >
                Cancel
              </button>
              <button
                disabled={loading}
                onClick={() => handleDelete(deleteToTask._id)}
                className={`px-3 py-1 text-sm font-medium cursor-pointer capitalize bg-red-600 text-white rounded-lg ${
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

export default Dashboard;
