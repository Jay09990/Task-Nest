import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken // || req.header("Authorization")?.replace("Bearer ", "")
        console.log(token);
        
        if (!token) {
            return next(new ApiError(401, "Access token is missing"));
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id).select("-password -refreshTokens")

        if (!user) {

            throw new ApiError(401, "access token is invalid");
        }

        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Access token is invalid or expired");
    }
})

// Optional authentication middleware (for routes that work with or without auth)
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (token) {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            const user = await User.findById(decoded._id).select('-password -refreshTokens');
            if (user) {
                req.user = user;
            }
        }

        next();
    } catch (error) {
        // Continue without authentication
        next();
    }
};

export {
    verifyJWT,
    optionalAuth
};