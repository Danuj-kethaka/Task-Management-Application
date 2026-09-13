import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js"
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

//auth routes
app.use("/api/auth", authRoutes);

//user routes
app.use("/api/users", userRoutes);

//admin routes
app.use("/api/admin", adminRoutes);

//task routes
app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Less Taxi Task Manager API is running"
    });
});

//db connection
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB connected");

        app.listen(process.env.PORT || 5000, () => {
            console.log(
                `Server running on port ${process.env.PORT || 5000}`
            );
        });
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error);
    });