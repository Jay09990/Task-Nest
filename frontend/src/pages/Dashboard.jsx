import { useEffect, useState } from "react";
import {
  CheckCircle,
  Calendar,
  Clock,
  Star,
  ListChecks,
  Target,
  Folder,
  MoreHorizontal,
  Plus,
  ArrowRight,
  CheckSquare,
  Circle,
  AlertCircle,
} from "lucide-react";

const Dashboard = ({ tasks = [], projects = [] }) => {
  // Task organization states
  const [pendingTasks, setPendingTasks] = useState([]);
  const [inProgressTasks, setInProgressTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [todayTasks, setTodayTasks] = useState([]);
  // Removed viewMode state since we're only using Bento view now

  // Update task lists whenever tasks prop changes
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    
    // Filter tasks by status
    setPendingTasks(tasks.filter(task => task.status === "pending"));
    setInProgressTasks(tasks.filter(task => task.status === "in-progress"));
    setCompletedTasks(tasks.filter(task => task.status === "completed"));
    
    // Filter today's tasks
    setTodayTasks(tasks.filter(
      (task) => task.dueDate === today && task.status !== "completed"
    ));
  }, [tasks]);

  // Calculate task counts for summary cards
  const getCount = {
    all: tasks.filter((task) => task.status !== "completed").length,
    today: tasks.filter(
      (task) => task.dueDate === new Date().toISOString().split("T")[0]
    ).length,
    upcoming: tasks.filter(
      (task) => task.dueDate > new Date().toISOString().split("T")[0]
    ).length,
    important: tasks.filter((task) => task.isImportant).length,
    completed: tasks.filter((task) => task.status === "completed").length,
  };

  const summaryCards = [
    {
      title: "All Tasks",
      count: getCount.all,
      icon: ListChecks,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Today",
      count: getCount.today,
      icon: Calendar,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Upcoming",
      count: getCount.upcoming,
      icon: Clock,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      title: "Important",
      count: getCount.important,
      icon: Star,
      color: "bg-pink-100 text-pink-600",
    },
    {
      title: "Completed",
      count: getCount.completed,
      icon: Target,
      color: "bg-purple-100 text-purple-600",
    },
  ];

  // Function to get project name by ID
  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : projectId;
  };

  // Function to get status icon
  const getStatusIcon = (status) => {
    switch(status) {
      case "pending":
        return <Circle size={16} className="text-gray-400" />;
      case "in-progress":
        return <AlertCircle size={16} className="text-blue-500" />;
      case "completed":
        return <CheckSquare size={16} className="text-green-500" />;
      default:
        return <Circle size={16} className="text-gray-400" />;
    }
  };

  // Task card component
  const TaskCard = ({ task }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all duration-200">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center space-x-2">
          {getStatusIcon(task.status)}
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            task.priority === "high" ? "bg-red-100 text-red-700" :
            task.priority === "medium" ? "bg-yellow-100 text-yellow-700" :
            "bg-green-100 text-green-700"
          }`}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </span>
        </div>
        <div className="flex items-center">
          {task.isImportant && <Star size={16} className="text-yellow-500 fill-yellow-500 mr-2" />}
          <button className="text-gray-400 hover:text-gray-600">
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>
      
      <h3 className="font-medium text-gray-800 mb-1">{task.title}</h3>
      
      <p className="text-gray-500 text-sm line-clamp-2 mb-3">{task.description}</p>
      
      <div className="flex justify-between items-center text-xs text-gray-500">
        <div className="flex items-center space-x-1">
          <Calendar size={14} />
          <span>{task.dueDate}</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <Folder size={14} />
          <span>{getProjectName(task.project)}</span>
        </div>
      </div>
      
      {task.assignee && (
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center">
          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-medium mr-2">
            {task.assignee.name.charAt(0)}
          </div>
          <span className="text-xs text-gray-600">{task.assignee.name}</span>
        </div>
      )}
    </div>
  );

  // Project card component
  const ProjectCard = ({ project }) => {
    const projectTasks = tasks.filter(task => task.project === project.id);
    const completedCount = projectTasks.filter(task => task.status === "completed").length;
    const progress = projectTasks.length > 0 ? Math.round((completedCount / projectTasks.length) * 100) : 0;
    
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all duration-200">
        <div className="flex justify-between items-start mb-3">
          <div className={`w-8 h-8 rounded-lg ${project.bgColor || "bg-blue-100"} flex items-center justify-center ${project.textColor || "text-blue-700"}`}>
            <Folder size={16} />
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <MoreHorizontal size={16} />
          </button>
        </div>
        
        <h3 className="font-medium text-gray-800 mb-1">{project.name}</h3>
        
        <div className="mt-3 mb-2">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-500">Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div 
              className="bg-blue-500 h-1.5 rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex justify-between items-center text-xs text-gray-500 mt-3">
          <div className="flex items-center space-x-1">
            <CheckSquare size={14} />
            <span>{completedCount}/{projectTasks.length} tasks</span>
          </div>
          
          {project.endDate && (
            <div className="flex items-center space-x-1">
              <Calendar size={14} />
              <span>Due {project.endDate}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 w-full overflow-y-auto">
      {/* Header - Removed View Toggle */}
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Dashboard Overview
      </h1>

      {/* Summary Cards - Bento Style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {summaryCards.map((card, index) => (
          <div
            key={index}
            className={`p-4 rounded-xl shadow-sm ${card.color} flex items-center justify-between transition-transform hover:scale-[1.02] duration-200`}
          >
            <div>
              <p className="text-sm font-medium">{card.title}</p>
              <h3 className="text-2xl font-bold">{card.count}</h3>
            </div>
            <card.icon size={28} className="opacity-60" />
          </div>
        ))}
      </div>

      {/* Bento Grid Layout - Now the only view */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Today's Tasks Section */}
        <div className="md:col-span-2 bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Today's Tasks</h2>
            <span className="text-sm text-gray-500">{todayTasks.length} tasks</span>
          </div>
          
          {todayTasks.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-gray-500">No tasks for today 🎉</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {todayTasks.slice(0, 4).map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
          
          {todayTasks.length > 4 && (
            <div className="mt-4 text-center">
              <button className="text-blue-600 text-sm font-medium flex items-center justify-center mx-auto">
                <span>View all</span>
                <ArrowRight size={14} className="ml-1" />
              </button>
            </div>
          )}
        </div>
        
        {/* Projects Section */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Projects</h2>
            <button className="text-blue-600 hover:text-blue-700">
              <Plus size={18} />
            </button>
          </div>
          
          <div className="space-y-4">
            {projects.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-gray-500">No projects yet</p>
                <button className="mt-2 text-blue-600 text-sm font-medium">Create your first project</button>
              </div>
            ) : (
              projects.slice(0, 3).map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))
            )}
          </div>
        </div>
        
        {/* Task Distribution */}
        <div className="md:col-span-3 bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Task Distribution</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-3xl font-bold text-blue-600 mb-1">{pendingTasks.length}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="text-3xl font-bold text-yellow-600 mb-1">{inProgressTasks.length}</div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-3xl font-bold text-green-600 mb-1">{completedTasks.length}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
