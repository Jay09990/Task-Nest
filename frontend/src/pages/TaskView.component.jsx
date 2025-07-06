import { useEffect, useState } from "react";
import TaskCard from "../components/Task.jsx";
import ProjectCard from "../components/Project.jsx";

const TasksView = ({
  category,
  tasks,
  projects,
  onUpdateTask,
  onDeleteTask,
}) => {
  const [filteredTasks, setFilteredTasks] = useState([]);

  // Filter tasks based on category
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];

    switch (category) {
      case "all-tasks":
        setFilteredTasks(tasks.filter((task) => task.status !== "completed"));
        break;
      case "today":
        setFilteredTasks(
          tasks.filter(
            (task) => task.dueDate === today && task.status !== "completed"
          )
        );
        break;
      case "upcoming":
        setFilteredTasks(
          tasks.filter(
            (task) => task.dueDate > today && task.status !== "completed"
          )
        );
        break;
      case "important":
        setFilteredTasks(
          tasks.filter(
            (task) => task.isImportant && task.status !== "completed"
          )
        );
        break;
      case "completed":
        setFilteredTasks(tasks.filter((task) => task.status === "completed"));
        break;
      case "trash":
        setFilteredTasks(tasks.filter((task) => task.isDeleted));
        break;
      default:
        // Handle project-specific tasks
        if (category.startsWith("project-")) {
          const projectId = category.replace("project-", "");
          setFilteredTasks(
            tasks.filter(
              (task) =>
                task.project === projectId && task.status !== "completed"
            )
          );
        } else {
          setFilteredTasks([]);
        }
    }
  }, [category, tasks]);

  // Get category title
  const getCategoryTitle = () => {
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

        {/* Optional: Add new task button for specific categories */}
        {!["completed", "trash"].includes(category) && (
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2">
            <span>+ Add Task</span>
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
            <p className="text-gray-500">
              {category === "trash"
                ? "Your trash is empty"
                : category === "completed"
                ? "No completed tasks yet"
                : "No tasks in this category yet"}
            </p>
            {!["completed", "trash"].includes(category) && (
              <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
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
              onRestore={category === "trash" ? handleRestoreTask : undefined}
              showRestore={category === "trash"}
              showComplete={category !== "completed"}
              showImportant={category !== "trash"}
            />
          ))}
        </div>
      )}

      {/* Optional: Show category-specific actions */}
      {category === "trash" && filteredTasks.length > 0 && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-red-800">Trash</h3>
              <p className="text-sm text-red-600">
                Items in trash will be permanently deleted after 30 days
              </p>
            </div>
            <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm">
              Empty Trash
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksView;
