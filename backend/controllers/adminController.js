import User from "../models/User.js";
import Task from "../models/Task.js";

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select("-password")
            .sort({ createdAt: -1 });

        res.json({
            users
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find()
            .populate("creator", "name email")
            .populate("assignedUser", "name email")
            .sort({ createdAt: -1 });

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

export {
    getAllUsers,
    getAllTasks
};