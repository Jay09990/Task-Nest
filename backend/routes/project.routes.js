import { Router } from "express";
import {
    createProject,
    getUserProjects,
    getProjectById,
    updateProject,
    deleteProject
} from "../controllers/project.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// All project routes are protected
router.use(verifyJWT); // This applies the middleware to all routes below

router.route("/").post(createProject).get(getUserProjects);
router.route("/:projectId").get(getProjectById).put(updateProject).delete(deleteProject);

export default router;