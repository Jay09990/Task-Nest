// routes/task.routes.js
import express from 'express';
import {
    createTask,
    getUserTasks,
    getTasksByProject,
    getTaskById,
    updateTask,
    deleteTask,
    updateTaskStatus,
    getTaskStats
} from '../controllers/task.controller.js';
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(verifyJWT);

// Task CRUD routes
router.post('/', createTask);
router.get('/', getUserTasks);
router.get('/', getTaskStats);
router.get('/project/:projectId', getTasksByProject);
router.get('/:taskId', getTaskById);
router.put('/:taskId', updateTask);
router.delete('/:taskId', deleteTask);
router.patch('/:taskId/status', updateTaskStatus);

export default router;