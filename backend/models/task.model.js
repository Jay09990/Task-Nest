import mongoose from "mongoose";
import { Project } from "./project.model.js";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      // required: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    dueDate: {
      type: Date,
      required: true,
      // default:"",
    },
    dueTime: {
      type: String,
      default: null,
    },
    project: {
      type: mongoose.Types.ObjectId,
      ref: "Project",
    },
    tag: [
      {
        type: String,
        default: null,
      },
    ],
    assignee: {
      name: {
        type: String,
        required: true,
      },
    },
  },
  { timeseries: true }
);

export const Task = mongoose.model("Task", taskSchema);
