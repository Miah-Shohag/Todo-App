import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";

const CompletedTasks = () => {
  const [completedTasks, setCompletedTasks] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleToggleStatus = async (id) => {
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

        if (newStatus === "completed") {
          // Just update the task in place
          setCompletedTasks((prev) =>
            prev.map((t) => (t._id === id ? { ...t, status: newStatus } : t))
          );
        } else {
          // If task is now pending, remove it from the completed list
          setCompletedTasks((prev) => prev.filter((t) => t._id !== id));
        }
      } else {
        toast.error(data.message || "Failed to update status.");
      }
    } catch (err) {
      toast.error("Failed to update status.");
      console.error(err);
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
              className={`relative bg-white bg-opacity-90 backdrop-blur-lg p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-200 `}
            >
              {/* Edit/Delete Icons */}
              <div className="absolute top-4 right-4 flex gap-2 text-gray-400">
                <input
                  type="checkbox"
                  checked={task.status === "completed"}
                  onChange={() => handleToggleStatus(task._id)}
                  className="cursor-pointer accent-green-500"
                />

                <AiFillEdit
                  onClick={() => handleEdit(task._id)}
                  className="cursor-pointer hover:text-blue-600"
                  size={20}
                />
                <AiFillDelete
                  onClick={() => handleDelete(task._id)}
                  className="cursor-pointer hover:text-red-600"
                  size={20}
                />
              </div>

              {/* Status & Priority */}
              <div className="flex gap-2 mb-4 flex-wrap">
                <span
                  className={`px-3 py-0.5 rounded-full text-xs font-semibold `}
                >
                  {task.status}
                </span>
                <span
                  className={`px-3 py-0.5 rounded-full text-xs font-semibold `}
                >
                  {task.priority}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {task.title}
              </h3>
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
    </div>
  );
};

export default CompletedTasks;
