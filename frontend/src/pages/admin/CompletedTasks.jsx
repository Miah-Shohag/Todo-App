import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";

import { ImCancelCircle } from "react-icons/im";
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

const CompletedTasks = () => {
  const [completedTasks, setCompletedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteToTask, setDeleteToTask] = useState(null);
  const showCompletedTasks = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/tasks/me/completed-tasks",
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await res.json();
      console.log(data);
      if (res.ok) {
        const completed = data.tasks.filter(
          (task) => task.status === "completed"
        );
        setCompletedTasks(completed);
      } else {
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    showCompletedTasks();
  }, []);

  const onToggleStatus = async (id) => {
    const task = completedTasks.find((t) => t._id === id);
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

        // ✅ Remove from list if status is no longer "completed"
        if (newStatus !== "completed") {
          setCompletedTasks((prev) => prev.filter((t) => t._id !== id));
        } else {
          // If for some reason you're toggling to "completed" (not needed here usually)
          setCompletedTasks((prev) =>
            prev.map((t) => (t._id === id ? { ...t, status: newStatus } : t))
          );
        }
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Failed to update status.");
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setCompletedTasks((prev) => prev.filter((t) => t._id !== id));
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
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Completed Tasks</h2>
      {loading ? (
        <p>Loading...</p>
      ) : completedTasks.length === 0 ? (
        <p>No completed tasks found.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {completedTasks.map((task) => (
            <div
              key={task._id}
              className={`relative bg-green-50 border-t-4 border-green-600 bg-opacity-90 backdrop-blur-lg p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-200 `}
            >
              {/* Edit/Delete Icons */}
              <div className="absolute top-4 right-4 flex gap-2 text-gray-400">
                <input
                  type="checkbox"
                  checked={task.status === "completed"}
                  onChange={() => onToggleStatus(task._id)}
                  className="cursor-pointer accent-green-500"
                />

                <AiFillEdit
                  onClick={() => handleEdit(task._id)}
                  className="cursor-pointer hover:text-blue-600"
                  size={20}
                />
                <AiFillDelete
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

export default CompletedTasks;
