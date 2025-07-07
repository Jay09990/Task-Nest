import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TaskCard from "../components/Task.jsx"; // Fixed import path
import ProjectCard from "../components/Project.jsx"; // Fixed import path
import { Plus, Trash2, RotateCcw } from "lucide-react"; // Added icons

const TasksView = ({
  tasks = [], // Added default value
  projects = [], // Added default value
  onUpdateTask,
  onDeleteTask,
  onAddTask, // Added for create functionality
}) => {
  const [filteredTasks, setFilteredTasks] = useState([]);
  const { category } = useParams();

  // Filter tasks based on category
  useEffect(() => {
    // Safety check for category
    if (!category) {
      setFilteredTasks([]);
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    switch (category) {
      case "all-tasks":
        setFilteredTasks(
          tasks.filter((task) => task.status !== "completed" && !task.isDeleted)
        );
        break;
      case "today":
        setFilteredTasks(
          tasks.filter(
            (task) =>
              task.dueDate === today &&
              task.status !== "completed" &&
              !task.isDeleted
          )
        );
        break;
      case "upcoming":
        setFilteredTasks(
          tasks.filter(
            (task) =>
              task.dueDate > today &&
              task.status !== "completed" &&
              !task.isDeleted
          )
        );
        break;
      case "important":
        setFilteredTasks(
          tasks.filter(
            (task) =>
              task.isImportant && task.status !== "completed" && !task.isDeleted
          )
        );
        break;
      case "completed":
        setFilteredTasks(
          tasks.filter((task) => task.status === "completed" && !task.isDeleted)
        );
        break;
      case "trash":
        setFilteredTasks(tasks.filter((task) => task.isDeleted));
        break;
      default:
        // Handle project-specific tasks with safety check
        if (category && category.startsWith("project-")) {
          const projectId = category.replace("project-", "");
          setFilteredTasks(
            tasks.filter(
              (task) =>
                task.project === projectId &&
                task.status !== "completed" &&
                !task.isDeleted
            )
          );
        } else {
          setFilteredTasks([]);
        }
    }
  }, [category, tasks]);

  // Get category title
  const getCategoryTitle = () => {
    // Safety check for category
    if (!category) return "Tasks";

    switch (category) {
      case "all-tasks":
        return "All Tasks";
      case "today":
        return "Today's Tasks";
      case "upcoming":
        return "Upcoming Tasks";
      case "important":
        return "Important Tasks";
      case "completed":
        return "Completed Tasks";
      case "trash":
        return "Trash";
      default:
        if (category.startsWith("project-")) {
          const projectId = category.replace("project-", "");
          const project = projects.find((p) => p.id === projectId);
          return project ? `${project.name} Tasks` : "Project Tasks";
        }
        return "Tasks";
    }
  };

  // Handler functions for task operations
  const handleToggleComplete = (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      const updatedTask = {
        ...task,
        status: task.status === "completed" ? "pending" : "completed",
        completedAt:
          task.status === "completed" ? null : new Date().toISOString(),
      };
      onUpdateTask?.(updatedTask);
    }
  };

  const handleToggleImportant = (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      const updatedTask = {
        ...task,
        isImportant: !task.isImportant,
      };
      onUpdateTask?.(updatedTask);
    }
  };

  const handleEditTask = (task) => {
    // You can implement a modal or redirect to edit form
    console.log("Edit task:", task);
    // Example: Open edit modal
    // setEditModalOpen(true);
    // setEditingTask(task);
  };

  const handleDeleteTask = (taskId) => {
    // For trash category, permanently delete
    if (category === "trash") {
      onDeleteTask?.(taskId);
    } else {
      // For other categories, move to trash
      const task = tasks.find((t) => t.id === taskId);
      if (task) {
        const updatedTask = {
          ...task,
          isDeleted: true,
          deletedAt: new Date().toISOString(),
        };
        onUpdateTask?.(updatedTask);
      }
    }
  };

  const handleRestoreTask = (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      const updatedTask = {
        ...task,
        isDeleted: false,
        deletedAt: null,
      };
      onUpdateTask?.(updatedTask);
    }
  };

  const handleCreateTask = () => {
    // Call the parent's create task function
    onAddTask?.();
  };

  const handleEmptyTrash = () => {
    // Permanently delete all trash items
    const trashTasks = tasks.filter((task) => task.isDeleted);
    trashTasks.forEach((task) => {
      onDeleteTask?.(task.id);
    });
  };

  const getEmptyStateMessage = () => {
    switch (category) {
      case "trash":
        return "Your trash is empty";
      case "completed":
        return "No completed tasks yet";
      case "today":
        return "No tasks due today";
      case "upcoming":
        return "No upcoming tasks";
      case "important":
        return "No important tasks";
      default:
        return "No tasks in this category yet";
    }
  };

  return (
    <div className="p-6 w-full overflow-y-auto bg-gray-50 min-h-screen">
      {/* Header with category title and task count */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            {getCategoryTitle()}
          </h1>
          <p className="text-gray-600 mt-1">
            {filteredTasks.length}{" "}
            {filteredTasks.length === 1 ? "task" : "tasks"}
          </p>
        </div>

        {/* Add new task button for specific categories */}
        {!["completed", "trash"].includes(category) && (
          <button
            onClick={handleCreateTask}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 shadow-sm hover:shadow-md"
          >
            <Plus size={18} />
            <span>Add Task</span>
          </button>
        )}
      </div>

      {/* Tasks grid or empty state */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm">
          <div className="max-w-md mx-auto">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              No tasks found
            </h3>
            <p className="text-gray-500 mb-4">{getEmptyStateMessage()}</p>
            {!["completed", "trash"].includes(category) && (
              <button
                onClick={onAddTask}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-sm hover:shadow-md"
              >
                Create your first task
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleComplete={handleToggleComplete}
              onToggleImportant={handleToggleImportant}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              // Additional props for trash functionality
              showRestore={category === "trash"}
              showComplete={category !== "completed"}
              showImportant={category !== "trash"}
            />
          ))}
        </div>
      )}

      {/* Trash-specific actions */}
      {category === "trash" && filteredTasks.length > 0 && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-red-800 flex items-center">
                <Trash2 size={16} className="mr-2" />
                Trash
              </h3>
              <p className="text-sm text-red-600 mt-1">
                Items in trash will be permanently deleted after 30 days
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleEmptyTrash}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm flex items-center space-x-2"
              >
                <Trash2 size={16} />
                <span>Empty Trash</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Optional: Show restore all button in trash */}
      {category === "trash" && filteredTasks.length > 0 && (
        <div className="mt-2">
          <button
            onClick={() => {
              filteredTasks.forEach((task) => handleRestoreTask(task.id));
            }}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm flex items-center space-x-2"
          >
            <RotateCcw size={16} />
            <span>Restore All</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default TasksView;
