import { Task } from "../models/task.model.js";
import { Project } from "../models/project.model.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

// Create a new task
const createTask = asyncHandler(async (req, res) => {
    try {
        const {
            title,
            description,
            priority,
            status,
            dueDate,
            dueTime,
            projectId,
            tags,
            category,
            assigneeId
        } = req.body;

        const userId = req.user.id;

        // Validate required fields
        if (!title || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Task title is required'
            });
        }

        if (!description || !description.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Task description is required'
            });
        }

        if (!dueDate) {
            return res.status(400).json({
                success: false,
                message: 'Due date is required'
            });
        }

        if (!category || !category.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Category is required'
            });
        }

        // Validate project access if projectId is provided
        if (projectId) {
            if (!mongoose.Types.ObjectId.isValid(projectId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid project ID'
                });
            }

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
        }

        // Validate and get assignee details
        let assigneeData = null;
        if (assigneeId) {
            if (!mongoose.Types.ObjectId.isValid(assigneeId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid assignee ID'
                });
            }

            const assignee = await User.findById(assigneeId);
            if (!assignee) {
                return res.status(404).json({
                    success: false,
                    message: 'Assignee not found'
                });
            }

            assigneeData = {
                _id: assignee._id,
                name: assignee.name,
                avatar: assignee.avatar || null
            };
        } else {
            // Default to current user if no assignee specified
            const currentUser = await User.findById(userId);
            assigneeData = {
                _id: currentUser._id,
                name: currentUser.name,
                avatar: currentUser.avatar || null
            };
        }

        // Create task data
        const taskData = {
            title: title.trim(),
            description: description.trim(),
            priority: priority || 'medium',
            status: status || 'pending',
            dueDate: new Date(dueDate),
            dueTime: dueTime || null,
            project: projectId || null,
            tags: tags || [],
            category: category.trim(),
            assignee: assigneeData,
            createdBy: userId
        };

        // Create the task
        const task = new Task(taskData);
        await task.save();

        // Populate project details if exists
        if (projectId) {
            await task.populate('project', 'name color icon');
        }

        res.status(201).json({
            success: true,
            message: 'Task created successfully',
            data: task
        });

    } catch (error) {
        console.error('Error creating task:', error);

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

// Get all tasks for the authenticated user
const getUserTasks = asyncHandler(async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            page = 1,
            limit = 10,
            status,
            priority,
            category,
            projectId,
            search,
            sortBy = 'dueDate',
            sortOrder = 'asc'
        } = req.query;

        // Build query - tasks assigned to user or created by user
        let query = {
            $or: [
                { 'assignee._id': new mongoose.Types.ObjectId(userId) },
                { createdBy: new mongoose.Types.ObjectId(userId) }
            ]
        };

        // Add filters
        if (status) query.status = status;
        if (priority) query.priority = priority;
        if (category) query.category = category;
        if (projectId) {
            if (mongoose.Types.ObjectId.isValid(projectId)) {
                query.project = new mongoose.Types.ObjectId(projectId);
            }
        }

        if (search) {
            query.$and = query.$and || [];
            query.$and.push({
                $or: [
                    { title: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } },
                    { tags: { $in: [new RegExp(search, 'i')] } }
                ]
            });
        }

        // Calculate skip value for pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        // Get tasks with pagination
        const tasks = await Task.find(query)
            .populate('project', 'name color icon')
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit));

        // Get total count for pagination
        const totalTasks = await Task.countDocuments(query);
        const totalPages = Math.ceil(totalTasks / parseInt(limit));

        res.status(200).json({
            success: true,
            data: tasks,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalTasks,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });

    } catch (error) {
        console.error('Error fetching user tasks:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// Get tasks by project ID
const getTasksByProject = asyncHandler(async (req, res) => {
    try {
        const { projectId } = req.params;
        const userId = req.user.id;
        const { status, priority, assignee } = req.query;

        // Validate project ID
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid project ID'
            });
        }

        // Check if user has access to the project
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

        // Build query
        let query = { project: new mongoose.Types.ObjectId(projectId) };

        if (status) query.status = status;
        if (priority) query.priority = priority;
        if (assignee) query['assignee._id'] = new mongoose.Types.ObjectId(assignee);

        // Get tasks
        const tasks = await Task.find(query)
            .populate('project', 'name color icon')
            .sort({ dueDate: 1 });

        res.status(200).json({
            success: true,
            data: tasks
        });

    } catch (error) {
        console.error('Error fetching project tasks:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// Get a specific task by ID
const getTaskById = asyncHandler(async (req, res) => {
    try {
        const { taskId } = req.params;
        const userId = req.user.id;

        // Validate task ID
        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid task ID'
            });
        }

        // Find task with access check
        const task = await Task.findOne({
            _id: taskId,
            $or: [
                { 'assignee._id': userId },
                { createdBy: userId }
            ]
        }).populate('project', 'name color icon');

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found or access denied'
            });
        }

        res.status(200).json({
            success: true,
            data: task
        });

    } catch (error) {
        console.error('Error fetching task:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// Update a task
const updateTask = asyncHandler(async (req, res) => {
    try {
        const { taskId } = req.params;
        const userId = req.user.id;
        const updateData = req.body;

        // Validate task ID
        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid task ID'
            });
        }

        // Find task with access check
        const task = await Task.findOne({
            _id: taskId,
            $or: [
                { 'assignee._id': userId },
                { createdBy: userId }
            ]
        });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found or access denied'
            });
        }

        // Remove sensitive fields
        delete updateData._id;
        delete updateData.createdAt;
        delete updateData.updatedAt;
        delete updateData.createdBy;

        // Handle assignee update
        if (updateData.assigneeId) {
            if (!mongoose.Types.ObjectId.isValid(updateData.assigneeId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid assignee ID'
                });
            }

            const assignee = await User.findById(updateData.assigneeId);
            if (!assignee) {
                return res.status(404).json({
                    success: false,
                    message: 'Assignee not found'
                });
            }

            updateData.assignee = {
                _id: assignee._id,
                name: assignee.name,
                avatar: assignee.avatar || null
            };
            delete updateData.assigneeId;
        }

        // Handle project update
        if (updateData.projectId) {
            if (!mongoose.Types.ObjectId.isValid(updateData.projectId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid project ID'
                });
            }

            const project = await Project.findOne({
                _id: updateData.projectId,
                teamMembers: userId
            });

            if (!project) {
                return res.status(404).json({
                    success: false,
                    message: 'Project not found or access denied'
                });
            }

            updateData.project = updateData.projectId;
            delete updateData.projectId;
        }

        // Update task
        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            updateData,
            { new: true, runValidators: true }
        ).populate('project', 'name color icon');

        res.status(200).json({
            success: true,
            message: 'Task updated successfully',
            data: updatedTask
        });

    } catch (error) {
        console.error('Error updating task:', error);

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

// Delete a task
const deleteTask = asyncHandler(async (req, res) => {
    try {
        const { taskId } = req.params;
        const userId = req.user.id;

        // Validate task ID
        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid task ID'
            });
        }

        // Find and delete task with access check
        const task = await Task.findOneAndDelete({
            _id: taskId,
            $or: [
                { 'assignee._id': userId },
                { createdBy: userId }
            ]
        });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found or access denied'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Task deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// Update task status
const updateTaskStatus = asyncHandler(async (req, res) => {
    try {
        const { taskId } = req.params;
        const { status } = req.body;
        const userId = req.user.id;

        // Validate inputs
        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid task ID'
            });
        }

        if (!['pending', 'in-progress', 'completed'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be pending, in-progress, or completed'
            });
        }

        // Find and update task
        const task = await Task.findOneAndUpdate(
            {
                _id: taskId,
                $or: [
                    { 'assignee._id': userId },
                    { createdBy: userId }
                ]
            },
            { status },
            { new: true }
        ).populate('project', 'name color icon');

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found or access denied'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Task status updated successfully',
            data: task
        });

    } catch (error) {
        console.error('Error updating task status:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// Get task statistics
const getTaskStats = asyncHandler(async (req, res) => {
    try {
        const userId = req.user.id;

        // Get task counts by status
        const statusStats = await Task.aggregate([
            {
                $match: {
                    $or: [
                        { 'assignee._id': new mongoose.Types.ObjectId(userId) },
                        { createdBy: new mongoose.Types.ObjectId(userId) }
                    ]
                }
            },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Get task counts by priority
        const priorityStats = await Task.aggregate([
            {
                $match: {
                    $or: [
                        { 'assignee._id': new mongoose.Types.ObjectId(userId) },
                        { createdBy: new mongoose.Types.ObjectId(userId) }
                    ]
                }
            },
            {
                $group: {
                    _id: '$priority',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Get overdue tasks count
        const overdueTasks = await Task.countDocuments({
            $or: [
                { 'assignee._id': new mongoose.Types.ObjectId(userId) },
                { createdBy: new mongoose.Types.ObjectId(userId) }
            ],
            dueDate: { $lt: new Date() },
            status: { $ne: 'completed' }
        });

        // Get tasks due today
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

        const tasksDueToday = await Task.countDocuments({
            $or: [
                { 'assignee._id': new mongoose.Types.ObjectId(userId) },
                { createdBy: new mongoose.Types.ObjectId(userId) }
            ],
            dueDate: { $gte: startOfDay, $lt: endOfDay },
            status: { $ne: 'completed' }
        });

        // Get total tasks
        const totalTasks = await Task.countDocuments({
            $or: [
                { 'assignee._id': new mongoose.Types.ObjectId(userId) },
                { createdBy: new mongoose.Types.ObjectId(userId) }
            ]
        });

        res.status(200).json({
            success: true,
            data: {
                totalTasks,
                overdueTasks,
                tasksDueToday,
                statusBreakdown: statusStats,
                priorityBreakdown: priorityStats
            }
        });

    } catch (error) {
        console.error('Error fetching task stats:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

export {
    createTask,
    getUserTasks,
    getTasksByProject,
    getTaskById,
    updateTask,
    deleteTask,
    updateTaskStatus,
    getTaskStats
};