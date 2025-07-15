import { useEffect, useState } from "react";
import {
  CheckCircle,
  Calendar,
  Clock,
  Star,
  ListChecks,
  Target,
  Folder,
  Plus,
  AlertCircle,
  TrendingUp,
  FolderPlus,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import TaskCard from "../components/Task";
import ProjectCard from "../components/Project";
import AddTask from "../components/AddTask";
import CreateProject from "../components/CreateNewProject";
import axios from "axios";

const Dashboard = () => {
  const { tasks, projects, actions, loading, error } = useApp();

  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editingProject, setEditingProject] = useState(null);

  // Task organization states
  const [pendingTasks, setPendingTasks] = useState([]);
  const [inProgressTasks, setInProgressTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [todayTasks, setTodayTasks] = useState([]);

  // API base URL
  const API_BASE_URL = "http://localhost:8000/api";

  // Update task lists whenever tasks change
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];

    setPendingTasks(tasks.filter((task) => task.status === "pending"));
    setInProgressTasks(tasks.filter((task) => task.status === "in-progress"));
    setCompletedTasks(tasks.filter((task) => task.status === "completed"));
    setTodayTasks(
      tasks.filter(
        (task) => task.dueDate === today && task.status !== "completed"
      )
    );
  }, [tasks]);

  // Load projects on component mount
  useEffect(() => {
    const loadProjects = async () => {
      actions.setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/projects`, {
          withCredentials: true,
        });
        actions.setProjects(response.data.data);
      } catch (err) {
        console.error(
          "Load Projects Error:",
          err.response?.data || err.message
        );
        const errorMessage =
          err.response?.data?.message || "Failed to load projects";
        actions.setError(errorMessage);
      } finally {
        actions.setLoading(false);
      }
    };

    loadProjects();
  }, []);

  // Task statistics
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

  // Task handlers
  const handleToggleComplete = async (taskId) => {
    try {
      const task = tasks.find((t) => t._id === taskId);
      const newStatus = task.status === "completed" ? "pending" : "completed";

      await axios.patch(
        `${API_BASE_URL}/tasks/${taskId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      actions.toggleTaskComplete(taskId);
    } catch (err) {
      console.error("Toggle Complete Error:", err);
      actions.setError(
        err.response?.data?.message || "Failed to update task status"
      );
    }
  };

  const handleToggleImportant = async (taskId) => {
    try {
      const task = tasks.find((t) => t._id === taskId);
      const newImportantStatus = !task.isImportant;

      await axios.patch(
        `${API_BASE_URL}/tasks/${taskId}`,
        { isImportant: newImportantStatus },
        { withCredentials: true }
      );
      actions.toggleTaskImportant(taskId);
    } catch (err) {
      console.error("Toggle Important Error:", err);
      actions.setError(
        err.response?.data?.message || "Failed to update task importance"
      );
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowCreateTask(true);
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`${API_BASE_URL}/tasks/${taskId}`, {
        withCredentials: true,
      });
      actions.deleteTask(taskId);
    } catch (err) {
      console.error("Delete Task Error:", err);
      actions.setError(err.response?.data?.message || "Failed to delete task");
    }
  };

  // Project handlers
  const handleEditProject = (project) => {
    setEditingProject(project);
    setShowCreateProject(true);
  };

  const handleDeleteProject = async (projectId) => {
    try {
      await axios.delete(`${API_BASE_URL}/projects/${projectId}`, {
        withCredentials: true,
      });
      actions.deleteProject(projectId);
    } catch (err) {
      console.error("Delete Project Error:", err);
      actions.setError(
        err.response?.data?.message || "Failed to delete project"
      );
    }
  };

  const handleSelectProject = (project) => {
    actions.setActiveProject(project);
  };

  // Get recent projects
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

      {/* Create Task Modal */}
      {showCreateTask && (
        <AddTask
          isOpen={showCreateTask}
          onClose={() => {
            setShowCreateTask(false);
            setEditingTask(null);
          }}
          onSubmit={async (taskData) => {
            try {
              const endpoint = editingTask
                ? `${API_BASE_URL}/tasks/${editingTask._id}`
                : `${API_BASE_URL}/tasks`;

              const method = editingTask ? "put" : "post";

              const response = await axios[method](endpoint, taskData, {
                withCredentials: true,
              });

              editingTask
                ? actions.updateTask(response.data)
                : actions.addTask(response.data);

              setShowCreateTask(false);
              setEditingTask(null);
            } catch (err) {
              console.error("Task Error:", err);
              actions.setError(
                err.response?.data?.message || "Failed to save task"
              );
            }
          }}
          initialData={editingTask}
          projects={projects}
        />
      )}

      {/* Create Project Modal */}
      {showCreateProject && (
        <CreateProject
          isOpen={showCreateProject}
          onClose={() => {
            setShowCreateProject(false);
            setEditingProject(null);
          }}
          onSubmit={async (projectData) => {
            try {
              const endpoint = editingProject
                ? `${API_BASE_URL}/projects/${editingProject._id}`
                : `${API_BASE_URL}/projects`;

              const method = editingProject ? "put" : "post";

              const response = await axios[method](endpoint, projectData, {
                withCredentials: true,
              });

              editingProject
                ? actions.updateProject(response.data)
                : actions.addProject(response.data);

              setShowCreateProject(false);
              setEditingProject(null);
            } catch (err) {
              console.error("Project Error:", err);
              actions.setError(
                err.response?.data?.message || "Failed to save project"
              );
            }
          }}
          initialData={editingProject}
        />
      )}

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
            <div className="text-sm text-gray-500">Completed Projects</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {projectStats.avgProgress}%
            </div>
            <div className="text-sm text-gray-500">Avg. Progress</div>
          </div>
        </div>
      </div>

      {/* Recent Projects Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Recent Projects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {recentProjects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onEdit={handleEditProject}
              onDelete={handleDeleteProject}
              onSelect={handleSelectProject}
            />
          ))}
        </div>
      </div>

      {/* Today's Tasks Section */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Today’s Tasks
        </h2>
        {todayTasks.length === 0 ? (
          <p className="text-gray-500">No tasks due today.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {todayTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onToggleComplete={handleToggleComplete}
                onToggleImportant={handleToggleImportant}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;