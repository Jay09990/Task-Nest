// App.jsx
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "./context/AppContext"; // Import your context
import AppRoutes from "./routes";
import AddTask from "./components/AddTask";
import CreateProject from "./components/CreateNewProject";
import { useApp } from "./context/AppContext";
import { useState } from "react";

// Create a separate component that uses the context
function AppContent() {
  const { tasks, projects, actions } = useApp();  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);

  const handleAddTask = (taskData) => {
    console.log("New task:", taskData);
    actions.addTask(taskData); // Use context method
    setIsAddTaskOpen(false);
  };

  const handleCreateProject = (projectData) => {
    console.log("New project:", projectData);
    actions.addProject(projectData); // Use context method
    setIsCreateProjectOpen(false);
  };

  const openAddTask = () => setIsAddTaskOpen(true);
  const closeAddTask = () => setIsAddTaskOpen(false);
  const openCreateProject = () => setIsCreateProjectOpen(true);
  const closeCreateProject = () => setIsCreateProjectOpen(false);

  return (
    <>
      <AppRoutes
        tasks={tasks}
        projects={projects}
        onAddTask={openAddTask}
        onCreateProject={openCreateProject}
      />

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
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
