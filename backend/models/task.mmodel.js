import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium',
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending',
    },
    dueDate: {
        type: Date,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    assignee: {
        name: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
            default:
                'https://images.unsplash.com/photo-1494790108755-2616b332d3e1?w=40&h=40&fit=crop&crop=face',
        },
    },
    
}, { timeseries: true })


export const Task = mongoose.model('Task', taskSchema);


/*
    {
        id: 1,
        title: "Design System Update",
        description:
            "Update the design system components for better consistency across all platforms",
        priority: "high",
        status: "pending",
        dueDate: "2025-07-15",
        category: "work",
        assignee: {
            name: "Sarah Wilson",
            avatar:
                "https://images.unsplash.com/photo-1494790108755-2616b332d3e1?w=40&h=40&fit=crop&crop=face",
        },
      },

*/