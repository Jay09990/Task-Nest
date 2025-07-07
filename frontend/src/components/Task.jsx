import React, { useState } from "react";
import {
  Calendar,
  Clock,
  Star,
  CheckCircle,
  Circle,
  Edit3,
  Trash2,
  Flag,
  Users,
  FileText,
  MoreVertical,
  AlertCircle,
} from "lucide-react";


//
const TaskCard = ({
  category,
  task,
  onToggleComplete,
  onToggleImportant,
  onEdit,
  onDelete,
}) => {
  const [showActions, setShowActions] = useState(false);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-500 bg-red-50";
      case "medium":
        return "text-yellow-500 bg-yellow-50";
      case "low":
        return "text-green-500 bg-green-50";
      default:
        return "text-gray-500 bg-gray-50";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 border-green-300";
      case "in-progress":
        return "bg-blue-100 border-blue-300";
      case "pending":
        return "bg-yellow-100 border-yellow-300";
      default:
        return "bg-gray-100 border-gray-300";
    }
  };

  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "completed";
  const isDueToday = task.dueDate === new Date().toISOString().split("T")[0];

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border-2 transition-all duration-200 hover:shadow-md hover:scale-105 ${
        task.status === "completed" ? "opacity-75" : ""
      } ${getStatusColor(task.status)}`}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onToggleComplete?.(task.id)}
              className="flex-shrink-0 hover:scale-110 transition-transform"
            >
              {task.status === "completed" ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <Circle className="w-5 h-5 text-gray-400 hover:text-blue-500" />
              )}
            </button>
            <h3
              className={`font-semibold text-gray-800 ${
                task.status === "completed" ? "line-through text-gray-500" : ""
              }`}
            >
              {task.title}
            </h3>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onToggleImportant?.(task.id)}
              className="hover:scale-110 transition-transform"
            >
              <Star
                className={`w-4 h-4 ${
                  task.isImportant
                    ? "text-yellow-500 fill-current"
                    : "text-gray-400"
                }`}
              />
            </button>
            <div className="relative">
              <button
                onClick={() => setShowActions(!showActions)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <MoreVertical className="w-4 h-4 text-gray-400" />
              </button>

              {showActions && (
                <div className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border z-10 py-1 min-w-[120px]">
                  <button
                    onClick={() => {
                      onEdit?.(task);
                      setShowActions(false);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span className="text-sm">Edit</span>
                  </button>
                  <button
                    onClick={() => {
                      onDelete?.(task.id);
                      setShowActions(false);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center space-x-2 text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="text-sm">Delete</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Priority and Due Date */}
        <div className="flex items-center justify-between mb-3">
          {task.priority && (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                task.priority
              )}`}
            >
              <Flag className="w-3 h-3 inline mr-1" />
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </span>
          )}

          {task.dueDate && (
            <div
              className={`flex items-center space-x-1 text-xs ${
                isOverdue
                  ? "text-red-500"
                  : isDueToday
                  ? "text-orange-500"
                  : "text-gray-500"
              }`}
            >
              {isOverdue && <AlertCircle className="w-3 h-3" />}
              <Calendar className="w-3 h-3" />
              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {task.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>Created {new Date(task.createdAt).toLocaleDateString()}</span>
          </div>
          {task.assignedTo && (
            <div className="flex items-center space-x-1">
              <Users className="w-3 h-3" />
              <span>{task.assignedTo}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;