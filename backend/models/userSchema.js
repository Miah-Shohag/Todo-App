import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      minlength: [6, "Password should be at least 6 characters."],
      trim: true,
    },

    image: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    resetOtp: { type: String },
    expiresOtp: { type: Date },

    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
