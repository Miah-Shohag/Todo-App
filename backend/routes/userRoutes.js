import { Router } from "express";
import {
  getUsers,
  getSingleUser,
  login,
  register,
  userDelete,
  uploadImage,
  userUpdate,
  logOut,
  updatePassword,
  resetPassword,
  sendOTP,
} from "../controllers/userControllers.js";
import { adminOnly, verifyToken } from "../middlewares/verifyToken.js";
import { upload } from "../middlewares/uploadImage.js";

const userRouter = Router();

// GET all users (admin only)
userRouter.get("/", verifyToken, adminOnly, getUsers);

// GET current logged-in user info
userRouter.get("/me", verifyToken, getSingleUser);

// Register a new user
userRouter.post("/create-user", register);

// Image upload
userRouter.post("/upload", verifyToken, upload.single("image"), uploadImage);

// Login a user
userRouter.post("/login", login);

// Login a user
userRouter.post("/logout", logOut);

// Login a user
userRouter.post("/reset-password", sendOTP);

userRouter.put("/updatePassword", verifyToken, updatePassword);

// Update user info (self only)
userRouter.put("/:id", verifyToken, userUpdate);

// Delete user (admin only)
userRouter.delete("/:id", verifyToken, adminOnly, userDelete);

export default userRouter;
