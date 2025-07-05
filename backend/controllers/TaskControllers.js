import Task from "../models/TaskSchema.js";
import User from "../models/userSchema.js";

const createTask = async (req, res, next) => {
  try {
    const { title, description, category, status, dueDate } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }

    // Check for existing task (case-insensitive)
    const taskExist = await Task.findOne({
      title: { $regex: new RegExp(`^${title}$`, "i") },
    });

    if (taskExist) {
      return res.status(400).json({
        success: false,
        message:
          "Task already exists. Please create a new task with a different title.",
      });
    }

    const task = new Task({
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      status,
      createdBy: req.user.id,
      dueDate,
    });

    await task.save();
    await User.findByIdAndUpdate(req.user.id, {
      $push: { tasks: task._id },
    });

    return res.status(201).json({
      success: true,
      message: "Task added successfully",
      task,
    });
  } catch (error) {
    next(error);
  }
};

const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find();

    return res.status(200).json({
      success: true,
      message: "Tsers retrieved successfully",
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

const getMyTasks = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).populate({
      path: "tasks",
    });

    return res.status(200).json({
      success: true,
      tasks: user.tasks, // just send the populated tasks
    });
  } catch (error) {
    next(error);
  }
};

const getSingleTask = async (req, res, next) => {
  try {
    const taskid = req.params.id;
    const userId = req.user.id;

    const task = await Task.findById(taskid);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    if (task.createdBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized",
      });
    }

    return res.status(200).json({
      success: false,
      message: "Task retrived successfully.",
      title: task.title,
      description: task.description,
      status: task.status,
      category: task.category,
      priority: task.priority,
    });
  } catch (error) {
    next(error);
  }
};
const updateTask = async (req, res, next) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.id;
    const { title, description, category, status, priority, dueDate } =
      req.body;

    // Find the task
    const task = await Task.findById(taskId);

    // Check if task exists
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Optional: Check if the user owns the task (unless admin can edit)
    if (task.createdBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this task",
      });
    }

    // Update fields if provided
    task.title = title?.trim() || task.title;
    task.description = description?.trim() || task.description;
    task.category = category?.trim() || task.category;
    task.status = status || task.status;
    task.priority = priority || task.priority;
    task.dueDate = dueDate || task.dueDate;

    await task.save();

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/tasks/:id
const deleteTask = async (req, res, next) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const task = await Task.findById(taskId);

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    if (task.createdBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this task",
      });
    }

    await Task.findByIdAndDelete(taskId);

    // 🛠️ Correct way to remove the task from the user's task list
    const user = await User.findById(userId);
    if (user) {
      user.tasks.pull(taskId);
      await user.save();
    }

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const isCompletedTask = async (req, res, next) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.id;

    const task = await Task.findById(taskId);
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    if (task.createdBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    task.isCompleted = !task.isCompleted;
    task.status = "completed";
    await task.save();

    return res.status(200).json({
      success: true,
      message: "Task marked as completed",
      task,
    });
  } catch (err) {
    next(err);
  }
};

const showCompletedTask = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Fetch completed tasks created by the logged-in user
    const tasks = await Task.find({
      status: "completed",
      createdBy: userId,
    });

    if (tasks.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No completed tasks found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Completed tasks retrieved successfully",
      tasks,
    });
  } catch (err) {
    next(err);
  }
};

export {
  createTask,
  getTasks,
  getMyTasks,
  getSingleTask,
  updateTask,
  deleteTask,
  showCompletedTask,
  isCompletedTask,
};
