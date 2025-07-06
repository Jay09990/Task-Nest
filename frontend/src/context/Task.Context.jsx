import { createContext, useContext, useState,  } from 'react';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [activeCategory, setActiveCategory] = useState('dashboard');

  // Methods for adding/updating tasks and projects
  const addTask = (task) => {
    setTasks(prev => [...prev, task]);
    // API call here
  };

  const addProject = (project) => {
    setProjects(prev => [...prev, project]);
    // API call here
  };

  // Provide context value
  const value = {
    tasks,
    projects,
    activeCategory,
    setActiveCategory,
    addTask,
    addProject
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTaskContext = () => useContext(TaskContext);