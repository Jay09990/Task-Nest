import { Task } from "../models/task.model.js";
import { Project } from "../models/project.model.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

// Create a new task
const createTask = asyncHandler(async (req, res) => {
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
        throw new ApiError(400, 'Task title is required');
    }

    if (!description || !description.trim()) {
        throw new ApiError(400, 'Task description is required');
    }

    if (!dueDate) {
        throw new ApiError(400, 'Due date is required');
    }

    if (!category || !category.trim()) {
        throw new ApiError(400, 'Category is required');
    }

    // Validate project access if projectId is provided
    if (projectId) {
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            throw new ApiError(400, 'Invalid project ID');
        }

        const project = await Project.findOne({
            _id: projectId,
            teamMembers: userId
        });

        if (!project) {
            throw new ApiError(404, 'Project not found or access denied');
        }
    }

    // Validate and get assignee details
    let assigneeData = null;
    if (assigneeId) {
        if (!mongoose.Types.ObjectId.isValid(assigneeId)) {
            throw new ApiError(400, 'Invalid assignee ID');
        }

        const assignee = await User.findById(assigneeId);
        if (!assignee) {
            throw new ApiError(404, 'Assignee not found');
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

    res.status(201).json(new ApiResponse(201, task, 'Task created successfully'));
});

// Get all tasks for the authenticated user
const getUserTasks = asyncHandler(async (req, res) => {
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

    res.status(200).json(new ApiResponse(200, tasks, 'Tasks fetched successfully', {
        currentPage: parseInt(page),
        totalPages,
        totalTasks,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
    }));
});

// Get tasks by project ID
const getTasksByProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const userId = req.user.id;
    const { status, priority, assignee } = req.query;

    // Validate project ID
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new ApiError(400, 'Invalid project ID');
    }

    // Check if user has access to the project
    const project = await Project.findOne({
        _id: projectId,
        teamMembers: userId
    });

    if (!project) {
        throw new ApiError(404, 'Project not found or access denied');
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

    res.status(200).json(new ApiResponse(200, tasks, 'Tasks fetched successfully'));
});

// Get a specific task by ID
const getTaskById = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const userId = req.user.id;

    // Validate task ID
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
        throw new ApiError(400, 'Invalid task ID');
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
        throw new ApiError(404, 'Task not found or access denied');
    }

    res.status(200).json(new ApiResponse(200, task, 'Task fetched successfully'));
});

// Update a task
const updateTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const userId = req.user.id;
    const updateData = req.body;

    // Validate task ID
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
        throw new ApiError(400, 'Invalid task ID');
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
        throw new ApiError(404, 'Task not found or access denied');
    }

    // Remove sensitive fields
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.updatedAt;
    delete updateData.createdBy;

    // Handle assignee update
    if (updateData.assigneeId) {
        if (!mongoose.Types.ObjectId.isValid(updateData.assigneeId)) {
            throw new ApiError(400, 'Invalid assignee ID');
        }

        const assignee = await User.findById(updateData.assigneeId);
        if (!assignee) {
            throw new ApiError(404, 'Assignee not found');
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
            throw new ApiError(400, 'Invalid project ID');
        }

        const project = await Project.findOne({
            _id: updateData.projectId,
            teamMembers: userId
        });

        if (!project) {
            throw new ApiError(404, 'Project not found or access denied');
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

    res.status(200).json(new ApiResponse(200, updatedTask, 'Task updated successfully'));
});

// Delete a task
const deleteTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const userId = req.user.id;

    // Validate task ID
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
        throw new ApiError(400, 'Invalid task ID');
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
        throw new ApiError(404, 'Task not found or access denied');
    }

    res.status(200).json(new ApiResponse(200, null, 'Task deleted successfully'));
});

// Update task status
const updateTaskStatus = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    // Validate inputs
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
        throw new ApiError(400, 'Invalid task ID');
    }

    if (!['pending', 'in-progress', 'completed'].includes(status)) {
        throw new ApiError(400, 'Invalid status. Must be pending, in-progress, or completed');
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
        throw new ApiError(404, 'Task not found or access denied');
    }

    res.status(200).json(new ApiResponse(200, task, 'Task status updated successfully'));
});

// Get task statistics
const getTaskStats = asyncHandler(async (req, res) => {
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

    res.status(200).json(new ApiResponse(200, {
        totalTasks,
        overdueTasks,
        tasksDueToday,
        statusBreakdown: statusStats,
        priorityBreakdown: priorityStats
    }, 'Task statistics fetched successfully'));
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
