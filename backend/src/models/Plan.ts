import mongoose from "mongoose";
import Task from "./Task";

// Define the Plan Schema
const planSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Name of the plan (e.g., "Mow 2000 meters of lawn")
    goal: { type: Number, required: true }, // The overall goal (e.g., 2000 meters)
    startDate: { type: Date, required: true }, // The start date of the plan
    endDate: { type: Date, required: true }, // End date of the plan, calculated from startDate and duration
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    tasks: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Task" }, // Reference to tasks associated with this plan
    ],
    completedAmount: { type: Number, default: 0 }, // Track total progress of the plan (e.g., completed meters)
    progress: { type: Number, default: 0 },
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    status: {
      type: String,
      enum: ["Active", "Completed"],
      default: "Active",
    },
  },
  { timestamps: true }
);

planSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    const plan = this as any;
    await Task.deleteMany({ planId: plan._id });
    next();
  }
);

export default mongoose.model("Plan", planSchema);
