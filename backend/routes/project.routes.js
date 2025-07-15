import { Router } from "express";
import {
    createProject,
    getUserProjects,
    getProjectById,
    updateProject,
    deleteProject,
    addTeamMember,
    removeTeamMember,
    getProjectStats
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

// @route   PUT /api/projects/:projectId
// @desc    Update a project
router.put("/:projectId", updateProject);

// @route   DELETE /api/projects/:projectId
// @desc    Delete a project
router.delete("/:projectId", deleteProject);

// @route   POST /api/projects/:projectId/team
// @desc    Add a team member to a project
router.post("/:projectId/team", addTeamMember);

// @route   DELETE /api/projects/:projectId/team/:memberId
// @desc    Remove a team member from a project
router.delete("/:projectId/team/:memberId", removeTeamMember);

// @route   GET /api/projects/stats/overview
// @desc    Get project statistics for dashboard
router.get("/stats/overview", getProjectStats);

export default router;
