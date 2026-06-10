import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, maxlength: 50 },
    description: { type: String, unique: true, maxlength: 50 },

  },
  { timestamps: true }
);

export const Component = mongoose.model("Module", moduleSchema);
