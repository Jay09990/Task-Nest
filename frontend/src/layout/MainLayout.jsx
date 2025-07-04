import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function MainLayout({ onAddTask, onCreateProject, tasks, projects }) {
  return (
    <div className="flex h-screen">
      <Sidebar
        onAddTask={onAddTask}
        onCreateProject={onCreateProject}
        tasks={tasks}
        projects={projects}
      />

      <div className="flex-1 flex flex-col">
        <Navbar onAddTask={onAddTask} />
        <main className="p-4 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
