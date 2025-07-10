import mongoose from 'mongoose';
const { Schema } = mongoose;
import { User } from './user.model.js'; // Assuming User model is defined in user.model.js

const projectSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  color: {
    type: String,
    default: '#3B82F6',
    enum: [
      { name: "Blue", value: "#3B82F6", bg: "bg-blue-500" },
      { name: "Green", value: "#10B981", bg: "bg-green-500" },
      { name: "Purple", value: "#8B5CF6", bg: "bg-purple-500" },
      { name: "Red", value: "#EF4444", bg: "bg-red-500" },
      { name: "Orange", value: "#F59E0B", bg: "bg-orange-500" },
      { name: "Pink", value: "#EC4899", bg: "bg-pink-500" },
      { name: "Indigo", value: "#6366F1", bg: "bg-indigo-500" },
      { name: "Teal", value: "#14B8A6", bg: "bg-teal-500" },
    ]
  },
  icon: {
    type: String,
    default: 'folder',
    enum: [
      { name: 'folder', icon: 'Folder' },
      { name: 'briefcase', icon: 'Briefcase' },
      { name: 'project-diagram', icon: 'Project Diagram' },
      { name: 'tasks', icon: 'Tasks' }
    ],
  },
  category: {
    type: String,
    default: 'work',
    enum: [
      { value: "work", label: "Work" },
      { value: "personal", label: "Personal" },
      { value: "learning", label: "Learning" },
      { value: "health", label: "Health & Fitness" },
      { value: "creative", label: "Creative" },
      { value: "finance", label: "Finance" },
    ]
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  teamMembers: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  isPrivate: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    default: 'medium',
    enum: [
      { value: "low", label: "Low" },
      { value: "medium", label: "Medium" },
      { value: "high", label: "High" }
    ]
  },
  goals: [{
    type: String
  }],
  user: {
    type: Schema.Types.ObjectId,
    ref: User,
    required: true
  },
}, {
  timestamps: true
});

export const Project = mongoose.model('Project', projectSchema);