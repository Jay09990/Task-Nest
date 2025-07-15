// routes.jsx
import { Routes, Route } from "react-router-dom";
import  TaskNestLanding  from "./pages/Home.jsx";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./utils/NotFound";
import MainLayout from "./layout/MainLayout";
import TasksView from "./pages/TaskView.component";

function AppRoutes({ tasks, projects, onAddTask, onCreateProject }) {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<TaskNestLanding />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {/* Protected Routes */}
      <Route
        element={
          <MainLayout
            onAddTask={onAddTask}
            onCreateProject={onCreateProject}
            tasks={tasks}
            projects={projects}
          />
        }
      >
        <Route
          path="/Dashboard"
          element={<Dashboard tasks={tasks} projects={projects} />}
        />
        <Route
          path="/tasks/:category"
          element={<TasksView tasks={tasks} projects={projects} />}
        />
      </Route>

      {/* Fallback Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
