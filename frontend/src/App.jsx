// App.jsx
import { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import AddTask from "./components/AddTask";
import CreateProject from "./components/CreateNewProject";


function App() {
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);

  const handleAddTask = (taskData) => {
    console.log("New task:", taskData);
    setTasks((prev) => [...prev, taskData]);
    setIsAddTaskOpen(false);
    // TODO: Send to backend API
  };

  const handleCreateProject = (projectData) => {
    console.log("New project:", projectData);
    setProjects((prev) => [...prev, projectData]);
    setIsCreateProjectOpen(false);
    // TODO: Send to backend API
  };

  const openAddTask = () => setIsAddTaskOpen(true);
  const closeAddTask = () => setIsAddTaskOpen(false);

  const openCreateProject = () => setIsCreateProjectOpen(true);
  const closeCreateProject = () => setIsCreateProjectOpen(false);

  return (
    <BrowserRouter>
      {/* Your Routes Component */}
      <AppRoutes
        tasks={tasks}
        projects={projects}
        onAddTask={openAddTask}
        onCreateProject={openCreateProject}
      />

      {/* Global Modals */}
      <AddTask
        isOpen={isAddTaskOpen}
        onClose={closeAddTask}
        onSubmit={handleAddTask}
      />

      <CreateProject
        isOpen={isCreateProjectOpen}
        onClose={closeCreateProject}
        onSubmit={handleCreateProject}
      />
    </BrowserRouter>
  );
}

export default App;
