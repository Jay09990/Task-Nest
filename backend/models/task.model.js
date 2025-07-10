import mongoose from "mongoose";
import { Project } from "./project.model";
import { User } from "./user.model";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
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
    category: {
      type: String,
      required: true,
    },
    assignee: {
      name: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
      }
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timeseries: true }
);

export const Task = mongoose.model("Task", taskSchema);

/*
    ({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
    dueTime: "",
    project: "",
    tags: [],
    assignee: "",
    isImportant: false,
  });

*/
