import { Edit } from "lucide-react";
import React, { createContext, useContext, useReducer } from "react";

// Initial state
const initialState = {
  tasks: [],
  projects: [],
  loading: false,
  error: null,
  activeProject: null,
  filters: {
    status: "all",
    priority: "all",
    project: "all",
    dateRange: "all",
  },
};

// Action types
const ActionTypes = {
  // Task actions
  SET_TASKS: "SET_TASKS",
  ADD_TASK: "ADD_TASK",
  UPDATE_TASK: "UPDATE_TASK",
  DELETE_TASK: "DELETE_TASK",
  EDIT_TASK: "EDIT_TASK",
  TOGGLE_TASK_COMPLETE: "TOGGLE_TASK_COMPLETE",
  TOGGLE_TASK_IMPORTANT: "TOGGLE_TASK_IMPORTANT",

  // Project actions
  SET_PROJECTS: "SET_PROJECTS",
  ADD_PROJECT: "ADD_PROJECT",
  UPDATE_PROJECT: "UPDATE_PROJECT",
  DELETE_PROJECT: "DELETE_PROJECT",
  SET_ACTIVE_PROJECT: "SET_ACTIVE_PROJECT",

  // General actions
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  SET_FILTERS: "SET_FILTERS",
  CLEAR_ERROR: "CLEAR_ERROR",
};

// Reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    // Task actions
    case ActionTypes.SET_TASKS:
      return { ...state, tasks: action.payload };

    case ActionTypes.ADD_TASK:
      return { ...state, tasks: [...state.tasks, action.payload] };

    case ActionTypes.UPDATE_TASK:
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? { ...task, ...action.payload } : task
        ),
      };

    case ActionTypes.EDIT_TASK:
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? { ...task, ...action.payload } : task
        ),
      };

    case ActionTypes.DELETE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      };

    case ActionTypes.TOGGLE_TASK_COMPLETE:
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload
            ? {
                ...task,
                status: task.status === "completed" ? "pending" : "completed",
              }
            : task
        ),
      };

    case ActionTypes.TOGGLE_TASK_IMPORTANT:
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload
            ? { ...task, isImportant: !task.isImportant }
            : task
        ),
      };

    // Project actions
    case ActionTypes.SET_PROJECTS:
      return { ...state, projects: action.payload };

    case ActionTypes.ADD_PROJECT:
      return { ...state, projects: [...state.projects, action.payload] };

    case ActionTypes.UPDATE_PROJECT:
      return {
        ...state,
        projects: state.projects.map((project) =>
          project.id === action.payload.id
            ? { ...project, ...action.payload }
            : project
        ),
      };

    case ActionTypes.DELETE_PROJECT:
      return {
        ...state,
        projects: state.projects.filter(
          (project) => project.id !== action.payload
        ),
        tasks: state.tasks.filter((task) => task.project !== action.payload),
      };

    case ActionTypes.SET_ACTIVE_PROJECT:
      return { ...state, activeProject: action.payload };

    // General actions
    case ActionTypes.SET_LOADING:
      return { ...state, loading: action.payload };

    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload };

    case ActionTypes.SET_FILTERS:
      return { ...state, filters: { ...state.filters, ...action.payload } };

    case ActionTypes.CLEAR_ERROR:
      return { ...state, error: null };

    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Helper functions to calculate project stats
  const getProjectStats = (projectId) => {
    const projectTasks = state.tasks.filter(
      (task) => task.project === projectId
    );
    const completedTasks = projectTasks.filter(
      (task) => task.status === "completed"
    );
    const progress =
      projectTasks.length > 0
        ? Math.round((completedTasks.length / projectTasks.length) * 100)
        : 0;

    return {
      taskCount: projectTasks.length,
      completedCount: completedTasks.length,
      progress,
    };
  };

  // Enhanced projects with calculated stats
  const enhancedProjects = state.projects.map((project) => ({
    ...project,
    ...getProjectStats(project.id),
  }));

  // Action creators
  const actions = {
    // Task actions
    setTasks: (tasks) =>
      dispatch({ type: ActionTypes.SET_TASKS, payload: tasks }),
    addTask: (task) => dispatch({ type: ActionTypes.ADD_TASK, payload: task }),
    updateTask: (task) =>
      dispatch({ type: ActionTypes.UPDATE_TASK, payload: task }),
    deleteTask: (taskId) =>
      dispatch({ type: ActionTypes.DELETE_TASK, payload: taskId }),
    toggleTaskComplete: (taskId) =>
      dispatch({ type: ActionTypes.TOGGLE_TASK_COMPLETE, payload: taskId }),
    toggleTaskImportant: (taskId) =>
      dispatch({ type: ActionTypes.TOGGLE_TASK_IMPORTANT, payload: taskId }),

    // Project actions
    setProjects: (projects) =>
      dispatch({ type: ActionTypes.SET_PROJECTS, payload: projects }),
    addProject: (project) =>
      dispatch({ type: ActionTypes.ADD_PROJECT, payload: project }),
    updateProject: (project) =>
      dispatch({ type: ActionTypes.UPDATE_PROJECT, payload: project }),
    deleteProject: (projectId) =>
      dispatch({ type: ActionTypes.DELETE_PROJECT, payload: projectId }),
    setActiveProject: (project) =>
      dispatch({ type: ActionTypes.SET_ACTIVE_PROJECT, payload: project }),

    // General actions
    setLoading: (loading) =>
      dispatch({ type: ActionTypes.SET_LOADING, payload: loading }),
    setError: (error) =>
      dispatch({ type: ActionTypes.SET_ERROR, payload: error }),
    setFilters: (filters) =>
      dispatch({ type: ActionTypes.SET_FILTERS, payload: filters }),
    clearError: () => dispatch({ type: ActionTypes.CLEAR_ERROR }),
  };

  const value = {
    ...state,
    projects: enhancedProjects,
    actions,
    getProjectStats,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

export default AppContext;
