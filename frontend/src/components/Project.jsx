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

const ProjectCard = ({ project, onEdit, onDelete, onSelect }) => {
  const [showActions, setShowActions] = useState(false);

  const getProgressColor = (progress) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 50) return "bg-yellow-500";
    return "bg-blue-500";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "on-hold":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "planning":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border-2 border-gray-200 hover:shadow-md hover:scale-105 transition-all duration-200 cursor-pointer">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                project.color || "bg-blue-500"
              }`}
            >
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 text-lg">
                {project.name}
              </h3>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                  project.status
                )}`}
              >
                {project.status?.replace("-", " ").charAt(0).toUpperCase() +
                  project.status?.replace("-", " ").slice(1)}
              </span>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowActions(!showActions);
              }}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-gray-400" />
            </button>

            {showActions && (
              <div className="absolute right-0 top-10 bg-white rounded-lg shadow-lg border z-10 py-1 min-w-[120px]">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.(project);
                    setShowActions(false);
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
                >
                  <Edit3 className="w-4 h-4" />
                  <span className="text-sm">Edit</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.(project.id);
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

        {/* Description */}
        {project.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {project.description}
          </p>
        )}

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Progress</span>
            <span className="text-sm font-semibold text-gray-800">
              {project.progress || 0}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(
                project.progress || 0
              )}`}
              style={{ width: `${project.progress || 0}%` }}
            ></div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">
              {project.taskCount || 0}
            </div>
            <div className="text-xs text-gray-500">Tasks</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">
              {project.memberCount || 0}
            </div>
            <div className="text-xs text-gray-500">Members</div>
          </div>
        </div>

        {/* Due Date */}
        {project.dueDate && (
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <Calendar className="w-4 h-4" />
            <span>Due {new Date(project.dueDate).toLocaleDateString()}</span>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-500">
              Created {new Date(project.createdAt).toLocaleDateString()}
            </span>
          </div>
          {project.team && project.team.length > 0 && (
            <div className="flex -space-x-2">
              {project.team.slice(0, 3).map((member, index) => (
                <div
                  key={index}
                  className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 border-2 border-white flex items-center justify-center text-xs text-white font-semibold"
                >
                  {member.charAt(0).toUpperCase()}
                </div>
              ))}
              {project.team.length > 3 && (
                <div className="w-6 h-6 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs text-gray-600 font-semibold">
                  +{project.team.length - 3}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Click handler for the entire card */}
      <div
        className="absolute inset-0 z-0"
        onClick={() => onSelect?.(project)}
      />
    </div>
  );
};

export default ProjectCard;
