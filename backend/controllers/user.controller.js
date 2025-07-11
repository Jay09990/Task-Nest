import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"
import { User } from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"

const generateAccessTokenAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshTokens = refreshToken;
        await user.save({ validateBeforeSave: false });

        return {
            accessToken,
            refreshToken
        };
    } catch (error) {
        throw new ApiError(500, "Internal server error while generating tokens")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    // Better validation for request body
    if (!req.body || Object.keys(req.body).length === 0) {
        throw new ApiError(400, "Request body is missing or empty")
    }

    const { name, email, userName, password } = req.body

    // Validate required fields
    if (!name?.trim()) {
        throw new ApiError(400, "Name is required");
    }

    if (!email?.trim()) {
        throw new ApiError(400, "Email is required");
    }

    if (!userName?.trim()) {
        throw new ApiError(400, "Username is required");
    }

    if (!password?.trim()) {
        throw new ApiError(400, "Password is required");
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new ApiError(400, "Please provide a valid email address");
    }

    // Password strength validation
    if (password.length < 6) {
        throw new ApiError(400, "Password must be at least 6 characters long");
    }

    // Check for existing user
    const existingUser = await User.findOne({
        $or: [
            { userName: userName.toLowerCase() },
            { email: email.toLowerCase() }
        ]
    })

    if (existingUser) {
        const field = existingUser.email === email.toLowerCase() ? 'email' : 'username';
        throw new ApiError(409, `User already exists with this ${field}`);
    }

    // Create user
    const user = await User.create({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password,
        userName: userName.toLowerCase().trim()
    })

    // Get created user without sensitive fields
    const createdUser = await User.findById(user._id).select("-password -refreshTokens")

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully")
    )
})

const loginUser = asyncHandler(async (req, res) => {
    // Validate request body
    if (!req.body || Object.keys(req.body).length === 0) {
        throw new ApiError(400, "Request body is missing or empty")
    }

    const { email, userName, password } = req.body

    // Validate login credentials
    if (!email?.trim() && !userName?.trim()) {
        throw new ApiError(400, "Email or username is required for login");
    }

    if (!password?.trim()) {
        throw new ApiError(400, "Password is required for login");
    }

    // Find user
    const user = await User.findOne({
        $or: [
            { userName: userName?.toLowerCase().trim() },
            { email: email?.toLowerCase().trim() }
        ]
    })

    if (!user) {
        throw new ApiError(404, "User not found with the provided email or username");
    }

    // Verify password
    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid password");
    }

    // Generate tokens
    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id);

    // Get user data without sensitive fields
    const loggedInUser = await User.findById(user._id).select("-password -refreshTokens")

    // Cookie options
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    }

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, {
                user: loggedInUser,
                accessToken,
                refreshToken
            }, "User logged in successfully")
        )
})

const logOutUser = asyncHandler(async (req, res) => {
    // Clear refresh token from database
    await User.findByIdAndUpdate(
        req.user._id,
        { $unset: { refreshTokens: 1 } },
        { new: true }
    )

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    }

    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, null, "User logged out successfully"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Refresh token is required");
    }

    try {
        // Verify refresh token
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

        // Find user
        const user = await User.findById(decodedToken?._id);

        if (!user) {
            throw new ApiError(401, "Invalid refresh token");
        }

        // Check if refresh token matches
        if (incomingRefreshToken !== user?.refreshTokens) {
            throw new ApiError(401, "Refresh token is expired or used");
        }

        // Generate new tokens
        const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id);

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        }

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(200, {
                accessToken,
                refreshToken
            }, "Access token refreshed successfully"));

    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body

    // Validate input
    if (!oldPassword?.trim() || !newPassword?.trim()) {
        throw new ApiError(400, "Both old and new passwords are required");
    }

    if (newPassword.length < 6) {
        throw new ApiError(400, "New password must be at least 6 characters long");
    }

    if (oldPassword === newPassword) {
        throw new ApiError(400, "New password must be different from old password");
    }

    // Get user
    const user = await User.findById(req.user?._id)
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Verify old password
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password");
    }

    // Update password
    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"))
})

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "Current user fetched successfully"))
})

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { name, email } = req.body

    // Validate input
    if (!name?.trim() && !email?.trim()) {
        throw new ApiError(400, "At least one field (name or email) is required to update");
    }

    // Build update object
    const updateData = {};
    if (name?.trim()) {
        updateData.name = name.trim();
    }
    if (email?.trim()) {
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new ApiError(400, "Please provide a valid email address");
        }

        // Check if email already exists
        const existingUser = await User.findOne({
            email: email.toLowerCase().trim(),
            _id: { $ne: req.user._id }
        });

        if (existingUser) {
            throw new ApiError(409, "Email already exists");
        }

        updateData.email = email.toLowerCase().trim();
    }

    // Update user
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        { $set: updateData },
        { new: true }
    ).select("-password -refreshTokens")

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Account details updated successfully"))
})

const getUserAndToken = asyncHandler(async (req, res) => {
    try {
        // req.user is available because of the auth middleware
        const user = req.user;
        const  token = req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        
    } catch (error) {
        throw new ApiError(500, "Internal server error while getting user");
    }
});

// Get user by ID (if you need this for other purposes)
const getUserById = asyncHandler(async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).select("-password -refreshToken");

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        return res.status(200).json(
            new ApiResponse(200, user, "User fetched successfully")
        );
    } catch (error) {
        throw new ApiError(500, "Internal server error while getting user");
    }
});

export {
    registerUser,
    loginUser,
    logOutUser,
    refreshAccessToken,
    getCurrentUser,
    changeCurrentPassword,
    getUserAndToken,
    getUserById,
    updateAccountDetails
}