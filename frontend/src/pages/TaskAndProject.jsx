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

// Example usage component showing how to integrate with your TasksView
const ExampleUsage = () => {
  const [tasks, setTasks] = useState([
    {
      id: "1",
      title: "Complete project proposal",
      description:
        "Finish the detailed project proposal for the client meeting",
      status: "in-progress",
      priority: "high",
      dueDate: "2025-01-10",
      isImportant: true,
      tags: ["work", "urgent"],
      createdAt: "2025-01-05",
      assignedTo: "John Doe",
      project: "proj-1",
    },
    {
      id: "2",
      title: "Review design mockups",
      description: "Review and provide feedback on the new design mockups",
      status: "pending",
      priority: "medium",
      dueDate: "2025-01-12",
      isImportant: false,
      tags: ["design", "review"],
      createdAt: "2025-01-06",
      assignedTo: "Jane Smith",
      project: "proj-1",
    },
  ]);

  const [projects, setProjects] = useState([
    {
      id: "proj-1",
      name: "Website Redesign",
      description: "Complete redesign of the company website with modern UI/UX",
      status: "in-progress",
      progress: 65,
      taskCount: 12,
      memberCount: 4,
      dueDate: "2025-02-15",
      createdAt: "2025-01-01",
      color: "bg-blue-500",
      team: ["John", "Jane", "Mike", "Sarah"],
    },
    {
      id: "proj-2",
      name: "Mobile App Development",
      description: "Develop a mobile app for task management",
      status: "planning",
      progress: 25,
      taskCount: 8,
      memberCount: 3,
      dueDate: "2025-03-30",
      createdAt: "2025-01-02",
      color: "bg-green-500",
      team: ["Alice", "Bob", "Charlie"],
    },
  ]);

  const handleToggleComplete = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: task.status === "completed" ? "pending" : "completed",
            }
          : task
      )
    );
  };

  const handleToggleImportant = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, isImportant: !task.isImportant } : task
      )
    );
  };

  const handleEditTask = (task) => {
    console.log("Edit task:", task);
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const handleEditProject = (project) => {
    console.log("Edit project:", project);
  };

  const handleDeleteProject = (projectId) => {
    setProjects(projects.filter((project) => project.id !== projectId));
  };

  const handleSelectProject = (project) => {
    console.log("Selected project:", project);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Tasks Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Tasks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={handleToggleComplete}
                onToggleImportant={handleToggleImportant}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        </div>

        {/* Projects Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={handleEditProject}
                onDelete={handleDeleteProject}
                onSelect={handleSelectProject}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExampleUsage;
export { TaskCard, ProjectCard };
