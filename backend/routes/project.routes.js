import { Router } from "express";
import {
    createProject,
    getUserProjects,
    getProjectById,
} from "../controllers/project.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// All project routes are protected by JWT
router.use(verifyJWT);

// @route   POST /api/projects
// @desc    Create a new project
router.post("/", createProject);

// @route   GET /api/projects
// @desc    Get all projects for authenticated user
router.get("/", getUserProjects);

// @route   GET /api/projects/:projectId
// @desc    Get project details by ID
router.get("/:projectId", getProjectById);

export default router;