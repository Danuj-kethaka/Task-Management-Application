import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log("MongoDB connected");

        const adminEmail = "admin@lesstaxi.com";
        const adminPassword = "Admin@12345";

        const existingAdmin = await User.findOne({
            email: adminEmail
        });

        if (existingAdmin) {
            console.log("Admin already exists");

            await mongoose.disconnect();
            return;
        }

        const hashedPassword = await bcrypt.hash(
            adminPassword,
            10
        );

        const admin = await User.create({
            name: "System Administrator",
            email: adminEmail,
            password: hashedPassword,
            role: "admin"
        });

        console.log("Admin created successfully");
        console.log("Email:", admin.email);
        console.log("Password:", adminPassword);

        await mongoose.disconnect();
    } catch (error) {
        console.error("Admin seed failed:", error);

        await mongoose.disconnect();
        process.exit(1);
    }
};

seedAdmin();