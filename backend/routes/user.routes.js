import { Router } from "express"
import { loginUser, logOutUser, registerUser, refreshAccessToken } from "../controllers/user.controller.js"
import { verifyJWT } from "../middleware/auth.middleware.js"

const router = Router()

router.route("/register").post(
    registerUser
)

router.route("/login").post(loginUser)

// secured routes

router.route("/logout").post(verifyJWT, logOutUser)

router.route("/refreshToken").post(refreshAccessToken)

export default router