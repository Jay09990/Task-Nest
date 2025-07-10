// controllers/project.controller.js
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {Project}  from "../models/project.model.js";

// Create a new project
export const createProject = asyncHandler(async (req, res) => {
    try {
        const { name, description, color, icon, category, startDate, endDate, isPrivate, priority, goals } = req.body;

        // Get user ID from the authenticated user
        const userId = req.user._id;
        
        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
                
                if (!incomingRefreshToken) {
                    throw new ApiError(401, "Unauthorized: No refresh token provided");
                }

        // Validate required fields
        if (!name?.trim()) {
            throw new ApiError(400, "Project name is required");
        }

        // Create project with user ID
        const project = await Project.create({
            name: name.trim(),
            description: description?.trim(),
            color: color || '#3B82F6',
            icon: icon || 'folder',
            category: category || 'work',
            startDate,
            endDate,
            isPrivate: isPrivate || false,
            priority: priority || 'medium',
            goals: goals || [],
            user: userId // This is the key part - assigning the logged-in user's ID
        });

        return res.status(201).json(
            new ApiResponse(201, project, "Project created successfully")
        );
    } catch (error) {
        throw new ApiError(500, error?.message || "Internal server error while creating project");
    }
});

// Get all projects for the logged-in user
export const getUserProjects = asyncHandler(async (req, res) => {
    try {        
        const userId = req.user._id;

        const projects = await Project.find({ user: userId }).sort({ createdAt: -1 });

        return res.status(200).json(
            new ApiResponse(200, projects, "Projects fetched successfully")
        );
    } catch (error) {
        throw new ApiError(500, "Internal server error while fetching projects");
    }
});

// Get a specific project (only if it belongs to the user)
export const getProjectById = asyncHandler(async (req, res) => {
    try {
        const { projectId } = req.params;
        const userId = req.user._id;

        const project = await Project.findOne({ _id: projectId, user: userId });

        if (!project) {
            throw new ApiError(404, "Project not found or you don't have access to this project");
        }

        return res.status(200).json(
            new ApiResponse(200, project, "Project fetched successfully")
        );
    } catch (error) {
        throw new ApiError(500, "Internal server error while fetching project");
    }
});

// Update project (only if it belongs to the user)
export const updateProject = asyncHandler(async (req, res) => {
    try {
        const { projectId } = req.params;
        const userId = req.user._id;
        const updateData = req.body;

        const project = await Project.findOneAndUpdate(
            { _id: projectId, user: userId },
            updateData,
            { new: true, runValidators: true }
        );

        if (!project) {
            throw new ApiError(404, "Project not found or you don't have access to this project");
        }

        return res.status(200).json(
            new ApiResponse(200, project, "Project updated successfully")
        );
    } catch (error) {
        throw new ApiError(500, "Internal server error while updating project");
    }
});

// Delete project (only if it belongs to the user)
export const deleteProject = asyncHandler(async (req, res) => {
    try {
        const { projectId } = req.params;
        const userId = req.user._id;

        const project = await Project.findOneAndDelete({ _id: projectId, user: userId });

        if (!project) {
            throw new ApiError(404, "Project not found or you don't have access to this project");
        }

        return res.status(200).json(
            new ApiResponse(200, {}, "Project deleted successfully")
        );
    } catch (error) {
        throw new ApiError(500, "Internal server error while deleting project");
    }
});