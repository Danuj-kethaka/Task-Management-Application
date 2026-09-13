import express from "express";
import protect from "../middleware/authMiddleware.js";
import requireAdmin from "../middleware/adminMiddleware.js";
import {getAllUsers,getAllTasks} from "../controllers/adminController.js";

const router = express.Router();

router.get("/dashboard",protect,requireAdmin,(req, res) => {res.json({message: "Welcome to the admin dashboard",user: req.user});});
router.get("/users",protect,requireAdmin,getAllUsers);
router.get("/tasks",protect,requireAdmin,getAllTasks);

export default router;