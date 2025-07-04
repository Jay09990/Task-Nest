import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./utils/NotFound";
import MainLayout from "./layout/MainLayout";
import AddTask from "./components/AddTask";
import CreateProject from "./components/CreateNewProject";

function App() {
  console.log("App component rendered");
  
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
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          element={
            <MainLayout
              onAddTask={openAddTask}
              onCreateProject={openCreateProject}
              tasks={tasks}
              projects={projects}
            />
          }
        >
          <Route path="/" element={<Dashboard />} />
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>

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
    </>
  );
}

export default App;
