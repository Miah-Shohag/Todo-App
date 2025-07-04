import { Router } from "express";
import {
  createTask,
  deleteTask,
  getSingleTask,
  getTasks,
  updateTask,
  getMyTasks,
  isCompletedTask,
  showCompletedTask,
} from "../controllers/TaskControllers.js";
import { adminOnly, verifyToken } from "../middlewares/verifyToken.js";

const taskRouter = Router();

taskRouter.get("", verifyToken, adminOnly, getTasks);
taskRouter.get("/me", verifyToken, getMyTasks);
taskRouter.get("/me/completed-tasks", verifyToken, showCompletedTask);
taskRouter.get("/:id", verifyToken, getSingleTask);
taskRouter.post("/create-task", verifyToken, createTask);
taskRouter.put("/:id", verifyToken, updateTask);
taskRouter.delete("/:id", verifyToken, deleteTask);
taskRouter.put("/isCompleted/:id", verifyToken, isCompletedTask);

export default taskRouter;
