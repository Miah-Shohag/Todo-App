import React, { useContext, useEffect } from "react";
import { TaskContext } from "../../hooks/TaskContext";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";

const getStatusColor = (status) => {
  switch (status) {
    case "pending":
      return "bg-purple-100 text-purple-600";
    case "in progress":
      return "bg-cyan-100 text-cyan-600";
    case "completed":
      return "bg-green-100 text-green-600";
    default:
      return "";
  }
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-600";
    case "medium":
      return "bg-yellow-100 text-yellow-600";
    case "low":
      return "bg-blue-100 text-blue-600";
    default:
      return "";
  }
};

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
const AllTasks = () => {
  const { tasks, getAllTasks, loading } = useContext(TaskContext);
  useEffect(() => {
    getAllTasks();
  }, []);
  return (
    <div>
      {loading ? (
        <p>Loading tasks...</p>
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
    </div>
  );
};

export default AllTasks;
