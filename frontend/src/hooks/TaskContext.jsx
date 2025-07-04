import React, { createContext, useEffect, useState } from "react";

export const TaskContext = createContext();

export const TaskContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]);

  //   Add Task controller
  const addPost = async (newPost) => {
    try {
      const res = await fetch("http://localhost:5000/api/tasks/create-task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(newPost),
      });
      const data = await res.json();
      if (res.ok) {
        setTasks((prev) => [data.post, ...prev]);
        return { success: true, post: data.post };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  //   Get tasks

  const getAllTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/tasks", {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();
      console.log(data);
      if (res.ok) {
        setLoading(false);
        setTasks(data.tasks);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
  };

  return (
    <TaskContext.Provider
      value={{ loading, setLoading, addPost, getAllTasks, tasks }}
    >
      {children}
    </TaskContext.Provider>
  );
};
