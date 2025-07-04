import jwt from "jsonwebtoken";
import User from "../models/userSchema.js";
import bcrypt from "bcrypt";

import nodemailer from "nodemailer";

// create a user
const register = async (req, res, next) => {
  try {
    const { username, email, password, confirmPassword, role, image, otp } =
      req.body;

    if (!username || !email || !password || !confirmPassword) {
      return res.status(403).json({
        success: false,
        message: "All fields are required!",
      });
    }

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(403).json({
        success: false,
        message: "User already exists. Please try to login.",
      });
    }

    if (password !== confirmPassword) {
      return res.status(401).json({
        success: false,
        message: "Password does not match",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const user = new User({
      username,
      email,
      password: hashPassword,
      role,
      image,
      otp,
    });

    await user.save();
    return res.status(201).json({
      success: true,
      message: "Register successfuly",
    });
  } catch (error) {
    next(error);
  }
};

const uploadImage = async (req, res, next) => {
  try {
    const id = req.user.id;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    await User.findByIdAndUpdate(
      { _id: id },
      {
        image: req.file.path,
      },
      { new: true }
    );

    return res.status(200).json({
      message: "Image uploaded successfully",
      url: req.file.path,
      public_id: req.file.filename,
    });
  } catch (error) {
    next(error);
  }
};

// user login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "All fields are required!",
      });
    }

    const userExist = await User.findOne({ email });
    if (!userExist || !(await bcrypt.compare(password, userExist.password))) {
      return res.status(403).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: userExist._id, role: userExist.role },
      process.env.JWT_SECRET,
      {
        expiresIn: 7 * 24 * 60 * 60 * 1000,
      }
    );

    res.cookie("access_token", token, {
      httpOnly: true,
      sameSite: true, // or "lax" / true / false depending on your use case
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    return res.status(201).json({
      success: true,
      message: "Login successfuly",
      token,
      user: userExist,
    });
  } catch (error) {
    next(error);
  }
};

const logOut = async (req, res, next) => {
  try {
    res.clearCookie("access_token", {
      httpOnly: true,
    });

    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

// get all users
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password -__v");

    return res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      users,
    });
  } catch (error) {
    next(error);
  }
};

// Get single user with their tasks
const getSingleUser = async (req, res, next) => {
  try {
    const id = req.user.id;

    const user = await User.findById(id)
      .select("-password -__v")
      .populate("tasks", "title");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error); // Pass the actual error to next()
  }
};

// user update
const userUpdate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // Assumes verifyToken middleware attaches `req.user`

    if (id !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this user",
      });
    }

    const { username, password } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    if (username) {
      user.username = username;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: {
        id: user._id,
        username: user.username,
      },
    });
  } catch (error) {
    next(error);
  }
};

// user delete only admin
const userDelete = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // Assumes verifyToken middleware attaches `req.user`

    if (id !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this user",
      });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role === "admin") {
      await User.findByIdAndDelete(id);
    }

    return res.status(201).json({
      success: true,
      message: "User deleted successfuly",
    });
  } catch (error) {
    next(error);
  }
};

const updatePassword = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(401).json({
        success: false,
        message: "All fields are required!",
      });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const matchPassword = await bcrypt.compare(currentPassword, user.password);
    if (!matchPassword) {
      return res.status(401).json({
        success: false,
        message: "Current password doesn't match.",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(401).json({
        success: false,
        message: "Confirm Password should be matched with new password",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);

    const updatePassword = await User.findByIdAndUpdate(
      { _id: userId },
      { password: hashPassword },
      { new: true }
    );

    if (!updatePassword) {
      return res.status(401).json({
        success: false,
        message: "Password not updated. Something went wrong.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (error) {
    next(error);
  }
};

const sendOTP = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email field is required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User doesn't exist. Please sign up first",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Your HTML template (replace with your actual HTML string)
    const yourHtmlString = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #333;">Reset Your Password</h2>
        <p>Use the OTP below to reset your password:</p>
        <h1 style="background: #00B893; padding: 10px 20px; border-radius: 20px; width: fit; letter-spacing: 5px; color: #ffffff;">{{OTP}}</h1>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn’t request this, you can safely ignore this email.</p>
      </div>
    `;

    const htmlTemplate = yourHtmlString.replace("{{OTP}}", otp);

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Your App" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Reset your password",
      html: htmlTemplate,
    });

    user.resetOtp = otp;
    user.expiresOtp = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    return res.status(200).json({
      success: true,
      message: "OTP has been sent to your email",
      otp, // ❗ remove this in production
    });
  } catch (error) {
    next(error);
  }
};

export {
  register,
  uploadImage,
  getUsers,
  getSingleUser,
  login,
  logOut,
  userDelete,
  userUpdate,
  updatePassword,
  sendOTP,
};
