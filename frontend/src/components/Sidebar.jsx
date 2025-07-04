import { useState } from "react";
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
} from "lucide-react";

const Sidebar = ({ onAddTask, onCreateProject, tasks = [], projects = [] }) => {
  const [isProjectsExpanded, setIsProjectsExpanded] = useState(true);
  const [activeItem, setActiveItem] = useState("dashboard");

  // Calculate task counts dynamically
  const getTodayTasksCount = () => {
    const today = new Date().toISOString().split('T')[0];
    return tasks.filter(task => task.dueDate === today && !task.completed).length;
  };

  const getUpcomingTasksCount = () => {
    const today = new Date().toISOString().split('T')[0];
    return tasks.filter(task => task.dueDate > today && !task.completed).length;
  };

  const getImportantTasksCount = () => {
    return tasks.filter(task => task.isImportant && !task.completed).length;
  };

  const getCompletedTasksCount = () => {
    return tasks.filter(task => task.completed).length;
  };

  const getAllTasksCount = () => {
    return tasks.filter(task => !task.completed).length;
  };

  const getProjectTasksCount = (projectId) => {
    return tasks.filter(task => task.project === projectId && !task.completed).length;
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, count: null },
    { id: "all-tasks", label: "All Tasks", icon: CheckSquare, count: getAllTasksCount() },
    { id: "today", label: "Today", icon: Calendar, count: getTodayTasksCount() },
    { id: "upcoming", label: "Upcoming", icon: Clock, count: getUpcomingTasksCount() },
    { id: "important", label: "Important", icon: Star, count: getImportantTasksCount() },
    { id: "completed", label: "Completed", icon: Target, count: getCompletedTasksCount() },
    { id: "trash", label: "Trash", icon: Trash2, count: 0 },
  ];

  // Default projects (fallback if no projects created)
  const defaultProjects = [
    {
      id: "work",
      name: "Work Projects",
      dotColor: "bg-blue-500",
      bgColor: "bg-blue-100",
      textColor: "text-blue-700",
      count: getProjectTasksCount("work"),
    },
    {
      id: "personal",
      name: "Personal",
      dotColor: "bg-green-500",
      bgColor: "bg-green-100",
      textColor: "text-green-700",
      count: getProjectTasksCount("personal"),
    },
    {
      id: "learning",
      name: "Learning",
      dotColor: "bg-purple-500",
      bgColor: "bg-purple-100",
      textColor: "text-purple-700",
      count: getProjectTasksCount("learning"),
    },
    {
      id: "health",
      name: "Health & Fitness",
      dotColor: "bg-red-500",
      bgColor: "bg-red-100",
      textColor: "text-red-700",
      count: getProjectTasksCount("health"),
    },
  ];

  // Convert created projects to sidebar format
  const createdProjects = projects.map(project => {
    // Convert hex color to Tailwind classes
    const getColorClasses = (hexColor) => {
      const colorMap = {
        '#3B82F6': { dot: 'bg-blue-500', bg: 'bg-blue-100', text: 'text-blue-700' },
        '#10B981': { dot: 'bg-green-500', bg: 'bg-green-100', text: 'text-green-700' },
        '#8B5CF6': { dot: 'bg-purple-500', bg: 'bg-purple-100', text: 'text-purple-700' },
        '#EF4444': { dot: 'bg-red-500', bg: 'bg-red-100', text: 'text-red-700' },
        '#F59E0B': { dot: 'bg-orange-500', bg: 'bg-orange-100', text: 'text-orange-700' },
        '#EC4899': { dot: 'bg-pink-500', bg: 'bg-pink-100', text: 'text-pink-700' },
        '#6366F1': { dot: 'bg-indigo-500', bg: 'bg-indigo-100', text: 'text-indigo-700' },
        '#14B8A6': { dot: 'bg-teal-500', bg: 'bg-teal-100', text: 'text-teal-700' },
      };
      return colorMap[hexColor] || { dot: 'bg-gray-500', bg: 'bg-gray-100', text: 'text-gray-700' };
    };

    const colorClasses = getColorClasses(project.color);
    
    return {
      id: project.id,
      name: project.name,
      dotColor: colorClasses.dot,
      bgColor: colorClasses.bg,
      textColor: colorClasses.text,
      count: getProjectTasksCount(project.id),
    };
  });

  // Use created projects if available, otherwise use default projects
  const displayProjects = createdProjects.length > 0 ? createdProjects : defaultProjects;

  const MenuItem = ({ item, isActive, onClick }) => {
    const Icon = item.icon;
    return (
      <div
        onClick={() => onClick(item.id)}
        className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 group ${
          isActive
            ? "bg-blue-100 text-blue-700 shadow-sm"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
        }`}
      >
        <div className="flex items-center space-x-3">
          <Icon
            size={18}
            className={`${
              isActive
                ? "text-blue-600"
                : "text-gray-500 group-hover:text-gray-700"
            }`}
          />
          <span className="font-medium text-sm">{item.label}</span>
        </div>
        {item.count !== null && (
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              isActive
                ? "bg-blue-200 text-blue-700"
                : "bg-gray-200 text-gray-600 group-hover:bg-gray-300"
            }`}
          >
            {item.count}
          </span>
        )}
      </div>
    );
  };

  const ProjectItem = ({ project, onClick }) => {
    const isActive = activeItem === project.id;
    return (
      <div
        onClick={() => onClick(project.id)}
        className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 group ${
          isActive
            ? `${project.bgColor} ${project.textColor} shadow-sm`
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${project.dotColor}`}></div>
          <span className="font-medium text-sm">{project.name}</span>
        </div>
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            isActive
              ? `${project.bgColor} ${project.textColor}`
              : "bg-gray-200 text-gray-600 group-hover:bg-gray-300"
          }`}
        >
          {project.count}
        </span>
      </div>
    );
  };

  return (
    <div className="h-screen w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <CheckSquare className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">TaskFlow</h1>
            <p className="text-sm text-gray-500">Manage your tasks</p>
          </div>
        </div>
      </div>

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
            <MenuItem
              key={item.id}
              item={item}
              isActive={activeItem === item.id}
              onClick={setActiveItem}
            />
          ))}
        </div>

        {/* Projects Section */}
        <div className="px-4 py-2">
          <div
            className="flex items-center justify-between py-2 cursor-pointer group"
            onClick={() => setIsProjectsExpanded(!isProjectsExpanded)}
          >
            <div className="flex items-center space-x-2">
              {isProjectsExpanded ? (
                <ChevronDown
                  size={16}
                  className="text-gray-400 group-hover:text-gray-600"
                />
              ) : (
                <ChevronRight
                  size={16}
                  className="text-gray-400 group-hover:text-gray-600"
                />
              )}
              <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Projects
              </span>
            </div>
            <button 
              onClick={(e) => {
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
                <ProjectItem
                  key={project.id}
                  project={project}
                  onClick={setActiveItem}
                />
              ))}
              
              {/* Add Project Button */}
              <button
                onClick={onCreateProject}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg bg-blue-500  text-white hover:bg-blue-50 hover:text-gray-700 transition-all duration-200 group"
              >
                <Plus size={16} className="text-white group-hover:text-blue-600" />
                <span className="font-medium text-sm">Add Project</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <div className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors duration-200">
          <div className="flex items-center space-x-3">
            <Settings size={18} className="text-gray-500" />
            <span className="font-medium text-sm text-gray-600">Settings</span>
          </div>
        </div>

        <div className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors duration-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <User size={14} className="text-white" />
            </div>
            <div>
              <span className="font-medium text-sm text-gray-700">
                John Doe
              </span>
              <p className="text-xs text-gray-500">john@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;