<<<<<<< HEAD
import { Project } from "../models/project.model.js"
import mongoose from "mongoose"
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"


// Create a new project
const createProject = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      description,
      color,
      icon,
      category,
      startDate,
      endDate,
      teamMembers,
      isPrivate,
      priority,
      goals
    } = req.body;

    // Get user ID from authenticated user (assuming middleware sets req.user)
    const userId = req.user.id;

    // Validate required fields
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Project name is required'
      });
    }

    // Create project data

    const projectData = {
      name: name.trim(),
      description: description?.trim() || '',
      color: color || '#3B82F6',
      icon: icon || 'folder',
      category: category || 'work',
      isPrivate: isPrivate || false,
      priority: priority || 'medium',
      goals: goals || [],
      createdBy: userId, // ✅ Add this to fix the error
      teamMembers: [userId]
    };


    // Add dates if provided
    if (startDate) projectData.startDate = new Date(startDate);
    if (endDate) projectData.endDate = new Date(endDate);

    // Add additional team members if provided
    if (teamMembers && Array.isArray(teamMembers)) {
      // Filter out duplicates and ensure creator is included
      const uniqueMembers = [...new Set([userId, ...teamMembers])];
      projectData.teamMembers = uniqueMembers;
    }

    // Create the project
    const project = new Project(projectData);
    await project.save();

    // Populate team members for response
    await project.populate('teamMembers', 'name email');

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project
    });

  } catch (error) {
    console.error('Error creating project:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Get all projects for the authenticated user
const getUserProjects = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, category, priority, search } = req.query;

    // Build query
    let query = {
      teamMembers: userId // Projects where user is a team member
    };

    // Add filters
    if (category) query.category = category;
    if (priority) query.priority = priority;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate skip value for pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get projects with pagination
    const projects = await Project.find(query)
      .populate('teamMembers', 'name email')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const totalProjects = await Project.countDocuments(query);
    const totalPages = Math.ceil(totalProjects / parseInt(limit));

    res.status(200).json({
      success: true,
      data: projects,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalProjects,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching user projects:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Get a specific project by ID
const getProjectById = asyncHandler(async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;

    // Validate project ID
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID'
      });
    }

    // Find project and check if user has access
    const project = await Project.findOne({
      _id: projectId,
      teamMembers: userId
    }).populate('teamMembers', 'name email');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found or access denied'
      });
    }

    res.status(200).json({
      success: true,
      data: project
    });

  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Update a project
const updateProject = asyncHandler(async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;
    const updateData = req.body;

    // Validate project ID
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID'
      });
    }

    // Find project and check if user has access
    const project = await Project.findOne({
      _id: projectId,
      teamMembers: userId
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found or access denied'
      });
    }

    // Remove sensitive fields that shouldn't be updated directly
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    // Handle team members update
    if (updateData.teamMembers) {
      // Ensure creator remains in team
      const uniqueMembers = [...new Set([userId, ...updateData.teamMembers])];
      updateData.teamMembers = uniqueMembers;
    }

    // Update project
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      updateData,
      { new: true, runValidators: true }
    ).populate('teamMembers', 'name email');

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: updatedProject
    });

  } catch (error) {
    console.error('Error updating project:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Delete a project
const deleteProject = asyncHandler(async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;

    // Validate project ID
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID'
      });
    }

    // Find and delete project (only if user is a team member)
    const project = await Project.findOneAndDelete({
      _id: projectId,
      teamMembers: userId
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found or access denied'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Add team member to project
const addTeamMember = asyncHandler(async (req, res) => {
  try {
    const { projectId } = req.params;
    const { memberId } = req.body;
    const userId = req.user.id;

    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(memberId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID or member ID'
      });
    }

    // Find project and check if user has access
    const project = await Project.findOne({
      _id: projectId,
      teamMembers: userId
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found or access denied'
      });
    }

    // Check if member is already in team
    if (project.teamMembers.includes(memberId)) {
      return res.status(400).json({
        success: false,
        message: 'User is already a team member'
      });
    }

    // Add member to team
    project.teamMembers.push(memberId);
    await project.save();

    // Populate and return updated project
    await project.populate('teamMembers', 'name email');

    res.status(200).json({
      success: true,
      message: 'Team member added successfully',
      data: project
    });

  } catch (error) {
    console.error('Error adding team member:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Remove team member from project
const removeTeamMember = asyncHandler(async (req, res) => {
  try {
    const { projectId, memberId } = req.params;
    const userId = req.user.id;

    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(memberId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID or member ID'
      });
    }

    // Find project and check if user has access
    const project = await Project.findOne({
      _id: projectId,
      teamMembers: userId
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found or access denied'
      });
    }

    // Remove member from team
    project.teamMembers = project.teamMembers.filter(
      member => member.toString() !== memberId
    );

    await project.save();

    // Populate and return updated project
    await project.populate('teamMembers', 'name email');

    res.status(200).json({
      success: true,
      message: 'Team member removed successfully',
      data: project
    });

  } catch (error) {
    console.error('Error removing team member:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Get project statistics for dashboard
const getProjectStats = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;

    // Get projects count by status/category
    const stats = await Project.aggregate([
      { $match: { teamMembers: mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalProjects: { $sum: 1 },
          categories: { $addToSet: '$category' },
          priorities: { $addToSet: '$priority' },
          avgGoals: { $avg: { $size: '$goals' } },
          avgTeamSize: { $avg: { $size: '$teamMembers' } }
        }
      }
    ]);

    // Get projects by category
    const categoryStats = await Project.aggregate([
      { $match: { teamMembers: mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get projects by priority
    const priorityStats = await Project.aggregate([
      { $match: { teamMembers: mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: stats[0] || {
          totalProjects: 0,
          categories: [],
          priorities: [],
          avgGoals: 0,
          avgTeamSize: 0
        },
        categoryBreakdown: categoryStats,
        priorityBreakdown: priorityStats
      }
    });

  } catch (error) {
    console.error('Error fetching project stats:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});


export {
  createProject,
  getUserProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addTeamMember,
  removeTeamMember,
  getProjectStats
}
=======
// controllers/project.controller.js
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {Project}  from "../models/project.model.js";
import cookies from "cookies";

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
>>>>>>> 47a76f9a42b0d62a74ea9a6bc9b8980970be88b9
