import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, maxlength: 100 },
    description: { type: String, maxlength: 300 },
    url: { type: String, required: true, maxlength: 500 },
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      required: true,
    },
    directnavigate: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Report = mongoose.model("Report", reportSchema);
