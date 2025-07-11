import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  CheckSquare,
  Calendar,
  Clock,
  Star,
  Trash2,
  Plus,
  Settings,
  User,
  ChevronDown,
  ChevronRight,
  Target,
  MoreVertical,
  Edit3,
  Trash,
} from "lucide-react";
import { useApp } from "../context/AppContext";

const Sidebar = ({
  onAddTask,
  onCreateProject,
  onEditProject, // optional, for edit modal
  onCategorySelect, // Add this prop to communicate with parent
}) => {
  const { tasks, projects, actions } = useApp();
  const [isProjectsExpanded, setIsProjectsExpanded] = useState(true);
  const [showProjectMenu, setShowProjectMenu] = useState(null); // project id or null
  const location = useLocation();

  const getCurrentActiveItem = () => {
    const path = location.pathname;
    if (path === "/" || path === "/dashboard") return "dashboard";
    if (path.startsWith("/tasks/")) return path.replace("/tasks/", "");
    if (path.startsWith("/projects/")) return path.replace("/projects/", "");
    return "dashboard";
  };
  const activeItem = getCurrentActiveItem();

  // Task counts
  const today = new Date().toISOString().split("T")[0];
  const getTodayTasksCount = () =>
    tasks.filter((task) => task.dueDate === today && !task.completed && !task.isDeleted).length;
  const getUpcomingTasksCount = () =>
    tasks.filter((task) => task.dueDate > today && !task.completed && !task.isDeleted).length;
  const getImportantTasksCount = () =>
    tasks.filter((task) => task.isImportant && !task.completed && !task.isDeleted).length;
  const getCompletedTasksCount = () =>
    tasks.filter((task) => task.completed && !task.isDeleted).length;
  const getAllTasksCount = () =>
    tasks.filter((task) => !task.completed && !task.isDeleted).length;
  const getTrashTasksCount = () =>
    tasks.filter((task) => task.isDeleted).length;
  const getProjectTasksCount = (projectId) =>
    tasks.filter((task) => task.project === projectId && !task.completed && !task.isDeleted).length;

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, count: null, path: "/dashboard" },
    { id: "all-tasks", label: "All Tasks", icon: CheckSquare, count: getAllTasksCount(), path: "/tasks/all-tasks" },
    { id: "today", label: "Today", icon: Calendar, count: getTodayTasksCount(), path: "/tasks/today" },
    { id: "upcoming", label: "Upcoming", icon: Clock, count: getUpcomingTasksCount(), path: "/tasks/upcoming" },
    { id: "important", label: "Important", icon: Star, count: getImportantTasksCount(), path: "/tasks/important" },
    { id: "completed", label: "Completed", icon: Target, count: getCompletedTasksCount(), path: "/tasks/completed" },
    { id: "trash", label: "Trash", icon: Trash2, count: getTrashTasksCount(), path: "/tasks/trash" },
  ];

  // Default projects (fallback if no projects created)
  const defaultProjects = [
    { id: "work", name: "Work Projects", dotColor: "bg-blue-500", bgColor: "bg-blue-100", textColor: "text-blue-700", count: getProjectTasksCount("work") },
    { id: "personal", name: "Personal", dotColor: "bg-green-500", bgColor: "bg-green-100", textColor: "text-green-700", count: getProjectTasksCount("personal") },
    { id: "learning", name: "Learning", dotColor: "bg-purple-500", bgColor: "bg-purple-100", textColor: "text-purple-700", count: getProjectTasksCount("learning") },
    { id: "health", name: "Health & Fitness", dotColor: "bg-red-500", bgColor: "bg-red-100", textColor: "text-red-700", count: getProjectTasksCount("health") },
  ];

  // Convert created projects to sidebar format
  const getColorClasses = (hexColor) => {
    const colorMap = {
      "#3B82F6": { dot: "bg-blue-500", bg: "bg-blue-100", text: "text-blue-700" },
      "#10B981": { dot: "bg-green-500", bg: "bg-green-100", text: "text-green-700" },
      "#8B5CF6": { dot: "bg-purple-500", bg: "bg-purple-100", text: "text-purple-700" },
      "#EF4444": { dot: "bg-red-500", bg: "bg-red-100", text: "text-red-700" },
      "#F59E0B": { dot: "bg-orange-500", bg: "bg-orange-100", text: "text-orange-700" },
      "#EC4899": { dot: "bg-pink-500", bg: "bg-pink-100", text: "text-pink-700" },
      "#6366F1": { dot: "bg-indigo-500", bg: "bg-indigo-100", text: "text-indigo-700" },
      "#14B8A6": { dot: "bg-teal-500", bg: "bg-teal-100", text: "text-teal-700" },
    };
    return (
      colorMap[hexColor] || { dot: "bg-gray-500", bg: "bg-gray-100", text: "text-gray-700" }
    );
  };
  const createdProjects = projects.map((project) => {
    const colorClasses = getColorClasses(project.color);
    return {
      id: project.id,
      name: project.name,
      dotColor: colorClasses.dot,
      bgColor: colorClasses.bg,
      textColor: colorClasses.text,
      count: getProjectTasksCount(project.id),
      raw: project, // keep original for actions
    };
  });
  const displayProjects = createdProjects.length > 0 ? createdProjects : defaultProjects;

  // Handle navigation - communicate with parent component
  const handleNavigation = (itemId) => {
    if (onCategorySelect) onCategorySelect(itemId);
  };

  const MenuItem = ({ item, isActive }) => {
    const Icon = item.icon;
    return (
      <Link
        to={item.path}
        className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 group ${
          isActive ? "bg-blue-100 text-blue-700 shadow-sm" : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
        }`}
        onClick={() => handleNavigation(item.id)}
      >
        <div className="flex items-center space-x-3">
          <Icon size={18} className={`${isActive ? "text-blue-600" : "text-gray-500 group-hover:text-gray-700"}`} />
          <span className="font-medium text-sm">{item.label}</span>
        </div>
        {item.count !== null && (
          <span className={`text-xs px-2 py-1 rounded-full ${isActive ? "bg-blue-200 text-blue-700" : "bg-gray-200 text-gray-600 group-hover:bg-gray-300"}`}>{item.count}</span>
        )}
      </Link>
    );
  };

  const ProjectItem = ({ project }) => {
    const isActive = activeItem === `project-${project.id}`;
    const projectPath = `/tasks/project-${project.id}`;
    return (
      <div className="relative group">
        <Link
          to={projectPath}
          className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 group ${
            isActive ? `${project.bgColor} ${project.textColor} shadow-sm` : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
          }`}
          onClick={() => handleNavigation(`project-${project.id}`)}
        >
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${project.dotColor}`}></div>
            <span className="font-medium text-sm">{project.name}</span>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${isActive ? `${project.bgColor} ${project.textColor}` : "bg-gray-200 text-gray-600 group-hover:bg-gray-300"}`}>{project.count}</span>
          <button
            className="ml-2 p-1 rounded-full hover:bg-gray-200"
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              setShowProjectMenu(showProjectMenu === project.id ? null : project.id);
            }}
          >
            <MoreVertical size={16} className="text-gray-400 group-hover:text-gray-600" />
          </button>
        </Link>
        {/* Project context menu */}
        {showProjectMenu === project.id && (
          <div className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border z-20 py-1 min-w-[120px]">
            <button
              onClick={e => {
                e.stopPropagation();
                setShowProjectMenu(null);
                if (onEditProject) onEditProject(project.raw);
                else console.log("Edit project:", project.raw);
              }}
              className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
            >
              <Edit3 className="w-4 h-4" />
              <span className="text-sm">Edit</span>
            </button>
            <button
              onClick={e => {
                e.stopPropagation();
                setShowProjectMenu(null);
                if (window.confirm("Are you sure you want to delete this project?")) {
                  actions.deleteProject(project.id);
                }
              }}
              className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center space-x-2 text-red-600"
            >
              <Trash className="w-4 h-4" />
              <span className="text-sm">Delete</span>
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-screen w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <Link to="/">
        <div className="p-6 border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <CheckSquare className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">TaskNest</h1>
              <p className="text-sm text-gray-500">Manage your tasks</p>
            </div>
          </div>
        </div>
      </Link>
      
      {/* Quick Actions */}
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={onAddTask}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <Plus size={18} />
          <span>New Task</span>
        </button>
      </div>
      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-1">
          {menuItems.map((item) => (
            <MenuItem key={item.id} item={item} isActive={activeItem === item.id} />
          ))}
        </div>
        {/* Projects Section */}
        <div className="px-4 py-2">
          <div
            className="flex items-center justify-between py-2 cursor-pointer group"
            onClick={() => setIsProjectsExpanded(!isProjectsExpanded)}
          >
            {/* Toggle Projects Section */}
            <div className="flex items-center space-x-2">
              {isProjectsExpanded ? (
                <ChevronDown size={16} className="text-gray-400 group-hover:text-gray-600" />
              ) : (
                <ChevronRight size={16} className="text-gray-400 group-hover:text-gray-600" />
              )}
              <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Projects</span>
            </div>
            <button
              onClick={e => {
                e.stopPropagation();
                onCreateProject();
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 rounded hover:bg-gray-200"
              title="Create New Project"
            >
              <Plus size={14} className="text-gray-400 hover:text-gray-600" />
            </button>
          </div>
          {isProjectsExpanded && (
            <div className="space-y-1 ml-2">
              {displayProjects.map((project) => (
                <ProjectItem key={project.id} project={project} />
              ))}
              {/* Add Project Button */}
              <button
                onClick={onCreateProject}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200 group"
              >
                <Plus size={16} className="text-white" />
                <span className="font-medium text-sm">Add Project</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
