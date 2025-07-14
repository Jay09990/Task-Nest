import { Router } from "express";
import {
    createProject,
    getUserProjects,
    getProjectById,
<<<<<<< HEAD
=======
    updateProject,
    deleteProject
>>>>>>> 47a76f9a42b0d62a74ea9a6bc9b8980970be88b9
} from "../controllers/project.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

<<<<<<< HEAD
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
=======
// All project routes are protected
router.use(verifyJWT); // This applies the middleware to all routes below

router.route("/").post(createProject).get(getUserProjects);
router.route("/:projectId").get(getProjectById).put(updateProject).delete(deleteProject);
>>>>>>> 47a76f9a42b0d62a74ea9a6bc9b8980970be88b9

export default router;