import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.mjs";
import carRoutes from "./routes/carRoutes.mjs";
import bookingRoutes from "./routes/bookingRoutes.mjs";
import adminRoutes from "./routes/adminRoutes.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use(
    "/photos",
    express.static(path.join(__dirname, "photos"))
);

app.use("/", authRoutes);
app.use("/api", carRoutes);
app.use("/api", bookingRoutes);
app.use("/api", adminRoutes);

app.get("/", (req, res) => {
    res.send("RentRoute backend is running!");
});

// MongoDB Atlas Connection

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error(
        "CRITICAL ERROR: MONGO_URI environment variable is missing in .env!"
    );
} else {
    mongoose
        .connect(MONGO_URI)
        .then(() => {
            console.log("MongoDB connected successfully");
        })
        .catch((err) => {
            console.error(
                "MongoDB connection failed:",
                err.message
            );
        });
}

app.listen(PORT, () => {
    console.log(
        `RentRoute server running on port ${PORT}`
    );
});