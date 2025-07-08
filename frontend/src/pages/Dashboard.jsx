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
  TrendingUp,
  Users,
  FolderPlus,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import TaskCard from "../components/Task";
import ProjectCard from "../components/Project";

const Dashboard = () => {
  const { tasks, projects, actions, loading, error } = useApp();

  // Local state for dashboard-specific functionality
  const [selectedTimeRange, setSelectedTimeRange] = useState("today");
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);

  // Task organization states
  const [pendingTasks, setPendingTasks] = useState([]);
  const [inProgressTasks, setInProgressTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [todayTasks, setTodayTasks] = useState([]);

  // Update task lists whenever tasks change
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];

    // Filter tasks by status
    setPendingTasks(tasks.filter((task) => task.status === "pending"));
    setInProgressTasks(tasks.filter((task) => task.status === "in-progress"));
    setCompletedTasks(tasks.filter((task) => task.status === "completed"));

    // Filter today's tasks
    setTodayTasks(
      tasks.filter(
        (task) => task.dueDate === today && task.status !== "completed"
      )
    );
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
    overdue: tasks.filter((task) => {
      const today = new Date().toISOString().split("T")[0];
      return task.dueDate < today && task.status !== "completed";
    }).length,
  };

  // Enhanced summary cards with more metrics
  const summaryCards = [
    {
      title: "All Tasks",
      count: getCount.all,
      icon: ListChecks,
      color: "bg-blue-100 text-blue-600",
      trend: "+12% from last week",
      trendUp: true,
    },
    {
      title: "Today",
      count: getCount.today,
      icon: Calendar,
      color: "bg-green-100 text-green-600",
      trend: "3 completed",
      trendUp: true,
    },
    {
      title: "Upcoming",
      count: getCount.upcoming,
      icon: Clock,
      color: "bg-yellow-100 text-yellow-600",
      trend: "Next 7 days",
      trendUp: false,
    },
    {
      title: "Important",
      count: getCount.important,
      icon: Star,
      color: "bg-pink-100 text-pink-600",
      trend: "High priority",
      trendUp: false,
    },
    {
      title: "Completed",
      count: getCount.completed,
      icon: Target,
      color: "bg-purple-100 text-purple-600",
      trend: `${Math.round(
        (getCount.completed / (getCount.completed + getCount.all)) * 100
      )}% completion rate`,
      trendUp: true,
    },
    {
      title: "Overdue",
      count: getCount.overdue,
      icon: AlertCircle,
      color: "bg-red-100 text-red-600",
      trend: "Needs attention",
      trendUp: false,
    },
  ];

  // Project statistics
  const projectStats = {
    total: projects.length,
    active: projects.filter((p) => p.status === "in-progress").length,
    completed: projects.filter((p) => p.status === "completed").length,
    avgProgress:
      projects.length > 0
        ? Math.round(
            projects.reduce((sum, p) => sum + (p.progress || 0), 0) /
              projects.length
          )
        : 0,
  };

  // Handler functions for TaskCard interactions
  const handleToggleComplete = (taskId) => {
    actions.toggleTaskComplete(taskId);
  };

  const handleToggleImportant = (taskId) => {
    actions.toggleTaskImportant(taskId);
  };

  const handleEditTask = (task) => {
    // TODO: Implement edit task modal
    console.log("Edit task:", task);
  };

  const handleDeleteTask = (taskId) => {
    actions.deleteTask(taskId);
  };

  // Handler functions for ProjectCard interactions
  const handleEditProject = (project) => {
    // TODO: Implement edit project modal
    console.log("Edit project:", project);
  };

  const handleDeleteProject = (projectId) => {
    actions.deleteProject(projectId);
  };

  const handleSelectProject = (project) => {
    actions.setActiveProject(project);
    // TODO: Navigate to project detail page
    console.log("Selected project:", project);
  };

  // Get recent projects (last 3 updated)
  const recentProjects = projects
    .sort(
      (a, b) =>
        new Date(b.updatedAt || b.createdAt) -
        new Date(a.updatedAt || a.createdAt)
    )
    .slice(0, 3);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 text-red-600">
          <AlertCircle className="w-5 h-5" />
          <span>Error: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here's what's happening today.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowCreateTask(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
          <button
            onClick={() => setShowCreateProject(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <FolderPlus className="w-4 h-4" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {summaryCards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-sm border-2 border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${card.color}`}>
                <card.icon className="w-6 h-6" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-800">
                  {card.count}
                </div>
                <div className="text-sm text-gray-500">{card.title}</div>
              </div>
            </div>
            <div className="flex items-center space-x-1 text-xs">
              <TrendingUp
                className={`w-3 h-3 ${
                  card.trendUp ? "text-green-500" : "text-gray-400"
                }`}
              />
              <span className="text-gray-500">{card.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Project Stats Bar */}
      <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-gray-200 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Project Overview
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {projectStats.total}
            </div>
            <div className="text-sm text-gray-500">Total Projects</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {projectStats.active}
            </div>
            <div className="text-sm text-gray-500">Active Projects</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {projectStats.completed}
            </div>
            <div className="text-sm text-gray-500">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {projectStats.avgProgress}%
            </div>
            <div className="text-sm text-gray-500">Avg Progress</div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Tasks Section */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border-2 border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Today's Tasks
              </h2>
              <p className="text-sm text-gray-500">
                {todayTasks.length} tasks scheduled
              </p>
            </div>
            <button className="text-blue-500 hover:text-blue-600 text-sm font-medium">
              View All
            </button>
          </div>

          {todayTasks.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <p className="text-gray-500">No tasks for today 🎉</p>
              <p className="text-sm text-gray-400 mt-2">
                Great job staying on top of things!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayTasks.slice(0, 6).map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleComplete={handleToggleComplete}
                  onToggleImportant={handleToggleImportant}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  projectName={
                    projects.find((p) => p.id === task.project)?.name
                  }
                />
              ))}
            </div>
          )}

          {todayTasks.length > 6 && (
            <button className="w-full mt-4 py-2 text-blue-500 hover:text-blue-600 text-sm font-medium border-t pt-4">
              View {todayTasks.length - 6} more tasks
            </button>
          )}
        </div>

        {/* Recent Projects Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Recent Projects
              </h2>
              <p className="text-sm text-gray-500">Latest updates</p>
            </div>
            <button className="text-blue-500 hover:text-blue-600 text-sm font-medium">
              View All
            </button>
          </div>

          {recentProjects.length === 0 ? (
            <div className="text-center py-8">
              <Folder className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">No projects yet</p>
              <button
                onClick={() => setShowCreateProject(true)}
                className="text-blue-500 hover:text-blue-600 text-sm font-medium"
              >
                Create your first project
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onEdit={handleEditProject}
                  onDelete={handleDeleteProject}
                  onSelect={handleSelectProject}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Task Distribution Section */}
      <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border-2 border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Task Distribution
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {pendingTasks.length}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
            <div className="text-xs text-gray-500 mt-1">
              {pendingTasks.length > 0 ? "Ready to start" : "All caught up!"}
            </div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {inProgressTasks.length}
            </div>
            <div className="text-sm text-gray-600">In Progress</div>
            <div className="text-xs text-gray-500 mt-1">
              {inProgressTasks.length > 0
                ? "Keep going!"
                : "Start something new"}
            </div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {completedTasks.length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
            <div className="text-xs text-gray-500 mt-1">
              {completedTasks.length > 0
                ? "Great work!"
                : "Complete your first task"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
