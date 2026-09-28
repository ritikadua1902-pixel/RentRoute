import express from "express";
import bcrypt from "bcrypt";

import User from "../models/User.js";

const router = express.Router();

// Signup

router.post("/signupdata", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required!"
            });
        }

        const existingUser = await User.findOne({
            $or: [
                { name: name },
                { email: email }
            ]
        });

        if (existingUser) {
            return res.status(400).json({
                message: "User or email already registered!"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();

        res.status(201).json({
            message: "Signup successful!",
            redirectedURL: "/login"
        });

    } catch (err) {
        console.error("Signup error:", err);

        res.status(500).json({
            message: "Server error during signup."
        });
    }
});


// Login

router.post("/logindata", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required!"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        res.json({
            message: "Login successful!",
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email
            }
        });

    } catch (err) {
        console.error("Login error:", err);

        res.status(500).json({
            message: "Server error during login."
        });
    }
});

export default router;