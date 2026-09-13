import Task from "../models/Task.js";

const createTask = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title || !description) {
            return res.status(400).json({
                message: "Title and description are required",
            });
        }

        const task = await Task.create({
            title,
            description,
            creator: req.user.userId,
            assignedUser: null,
            status: "todo",
        });

        res.status(201).json({
            message: "Task created successfully",
            task,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error",
        });
    }
};

const getTasks = async (req, res) => {
    try {
        let tasks;

        if (req.user.role === "admin") {
            tasks = await Task.find()
                .populate("creator", "name email")
                .populate("assignedUser", "name email")
                .sort({ createdAt: -1 });
        } else {
            tasks = await Task.find({
                $or: [
                    { creator: req.user.userId },
                    { assignedUser: req.user.userId }
                ]
            })
                .populate("creator", "name email")
                .populate("assignedUser", "name email")
                .sort({ createdAt: -1 });
        }

        res.json({
            tasks
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate("creator", "name email")
            .populate("assignedUser", "name email");

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        const isOwner =
            task.creator._id.toString() === req.user.userId ||
            (task.assignedUser &&
                task.assignedUser._id.toString() === req.user.userId);

        const isAdmin = req.user.role === "admin";

        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                message: "You do not have access to this task"
            });
        }

        res.json({
            task
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const updateTask = async (req, res) => {
    try {
        const { title, description } = req.body;

        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        const isCreator =
            task.creator.toString() === req.user.userId;

        const isAdmin = req.user.role === "admin";

        if (!isCreator && !isAdmin) {
            return res.status(403).json({
                message: "You do not have permission to update this task"
            });
        }

        if (title !== undefined) {
            task.title = title;
        }

        if (description !== undefined) {
            task.description = description;
        }

        await task.save();

        res.json({
            message: "Task updated successfully",
            task
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        const isCreator =
            task.creator.toString() === req.user.userId;

        const isAdmin = req.user.role === "admin";

        if (!isCreator && !isAdmin) {
            return res.status(403).json({
                message: "You do not have permission to delete this task"
            });
        }

        await Task.findByIdAndDelete(req.params.id);

        res.json({
            message: "Task deleted successfully"
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const assignTask = async (req, res) => {
    try {
        const { userId } = req.body;

        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        // Admin can assign or unassign any task
        if (req.user.role === "admin") {
            task.assignedUser = userId || null;

            await task.save();

            const updatedTask = await Task.findById(task._id)
                .populate("creator", "name email")
                .populate("assignedUser", "name email");

            return res.json({
                message: "Task assignment updated successfully",
                task: updatedTask
            });
        }

        // Normal user can only assign an unassigned task to themselves
        if (task.assignedUser) {
            return res.status(403).json({
                message: "This task is already assigned"
            });
        }

        if (userId !== req.user.userId) {
            return res.status(403).json({
                message: "You can only assign a task to yourself"
            });
        }

        task.assignedUser = req.user.userId;

        await task.save();

        const updatedTask = await Task.findById(task._id)
            .populate("creator", "name email")
            .populate("assignedUser", "name email");

        res.json({
            message: "Task assigned successfully",
            task: updatedTask
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const updateTaskStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const validStatuses = ["todo", "doing", "done"];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid status"
            });
        }

        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        const isCreator =
            task.creator.toString() === req.user.userId;

        const isAssignedUser =
            task.assignedUser &&
            task.assignedUser.toString() === req.user.userId;

        const isAdmin = req.user.role === "admin";

        if (!isCreator && !isAssignedUser && !isAdmin) {
            return res.status(403).json({
                message: "You do not have permission to update this task"
            });
        }

        task.status = status;

        await task.save();

        res.json({
            message: "Task status updated successfully",
            task
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

export {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
    assignTask,
    updateTaskStatus
};