import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, maxlength: 50 },
    email: { type: String, unique: true, maxlength: 50 },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: [
        "gfpi",
        "admin",
      ],
      default: "gfpi",
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
