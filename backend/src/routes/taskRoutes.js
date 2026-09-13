import express from "express";
import protect from "../middleware/authMiddleware.js";

import {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
    assignTask,
    updateTaskStatus
} from "../controllers/taskController.js";

const router = express.Router();

router.post("/", protect, createTask);
router.get("/", protect, getTasks);
router.get("/:id", protect, getTaskById);
router.put("/:id", protect, updateTask);
router.delete("/:id", protect, deleteTask);
router.patch("/:id/assign", protect, assignTask);
router.patch("/:id/status", protect, updateTaskStatus);

export default router;