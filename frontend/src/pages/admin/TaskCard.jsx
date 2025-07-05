import React from "react";
import toast from "react-hot-toast";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";

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

const TaskCard = ({ tasks, onEdit, onDelete, onToggleStatus }) => {
  onToggleStatus = async (id) => {
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

  return (
    <div
      className={`relative bg-white bg-opacity-90 backdrop-blur-lg p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-200 ${
        getBorderColor[tasks.status]
      } hover:scale-[1.02]`}
    >
      {/* Edit/Delete/Complete */}
      <div className="absolute top-4 right-4 flex gap-2 text-gray-400">
        <input
          type="checkbox"
          checked={tasks.status === "completed"}
          onChange={() => onToggleStatus(task._id)}
          className="accent-green-600 cursor-pointer"
          title="Mark as completed"
        />
        <AiFillEdit
          onClick={() => onEdit(task._id)}
          className="cursor-pointer hover:text-blue-600"
          size={20}
        />
        <AiFillDelete
          onClick={() => onDelete(task._id)}
          className="cursor-pointer hover:text-red-600"
          size={20}
        />
      </div>

      {/* Status & Priority */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <span
          className={`px-3 py-0.5 rounded-full text-xs font-semibold ${
            getStatusStyle[task.status]
          }`}
        >
          {task.status}
        </span>
        <span
          className={`px-3 py-0.5 rounded-full text-xs font-semibold ${
            getPriorityStyle[task.priority]
          }`}
        >
          {task.priority}
        </span>
      </div>

      {/* Title & Description */}
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{task.title}</h3>
      <p className="text-sm text-gray-600 line-clamp-3">{task.description}</p>

      {/* Dates */}
      <div className="flex justify-between text-xs text-gray-500 mt-4">
        <div>
          <p className="font-medium">Created</p>
          <p>{new Date(task.createdAt).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="font-medium">Due</p>
          <p>
            {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
