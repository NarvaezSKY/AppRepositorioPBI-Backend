import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, maxlength: 50 },
    description: { type: String, unique: true, maxlength: 300 },
    reportCount: { type: Number, default: 0 },
    visibleToRoles: {
      type: [
        {
          type: String,
          enum: ["admin", "gfpi"],
        },
      ],
      default: [],
      index: true,
    },
  },
  { timestamps: true }
);

export const Component = mongoose.model("Module", moduleSchema);
