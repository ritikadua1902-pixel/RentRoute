import express from "express";
import mongoose from "mongoose";

import Car from "../models/Car.js";
import verifyAdmin from "../middleware/verifyAdmin.mjs";

const router = express.Router();

// Get all cars

router.get("/cars", async (req, res) => {
    try {
        const cars = await Car.find();

        const formattedCars = cars.map((car) => ({
            ...car.toObject(),
            id: car._id.toString()
        }));

        res.json(formattedCars);

    } catch (err) {
        console.error("Error fetching cars:", err);

        res.status(500).json({
            error: "Failed to fetch cars from database."
        });
    }
});


// Get car by ID

router.get("/cars/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({
                error: "Car not found"
            });
        }

        const car = await Car.findById(id);

        if (!car) {
            return res.status(404).json({
                error: "Car not found"
            });
        }

        res.json({
            ...car.toObject(),
            id: car._id.toString()
        });

    } catch (err) {
        console.error("Error fetching car details:", err);

        res.status(500).json({
            error: "Server error fetching car details."
        });
    }
});


// Add new car - Admin only

router.post("/cars", verifyAdmin, async (req, res) => {
    try {
        const {
            name,
            type,
            price,
            location,
            image,
            brand,
            seats,
            fuel,
            available,
            description
        } = req.body;

        if (
            !name ||
            !type ||
            !price ||
            !location ||
            !image
        ) {
            return res.status(400).json({
                error:
                    "Car name, type, price, location, and image are required fields."
            });
        }

        const numericPrice = Number(price);

        if (!numericPrice || numericPrice <= 0) {
            return res.status(400).json({
                error:
                    "Price must be a valid number greater than 0."
            });
        }

        const newCar = new Car({
            name,
            type,
            price: numericPrice,
            location,
            image,
            brand: brand || "Standard",
            seats: seats || 5,
            fuel: fuel || "Petrol",
            available:
                available !== undefined
                    ? available
                    : true,
            description:
                description ||
                "Reliable and comfortable rental vehicle."
        });

        const savedCar = await newCar.save();

        res.status(201).json({
            success: true,
            car: {
                ...savedCar.toObject(),
                id: savedCar._id.toString()
            }
        });

    } catch (err) {
        console.error("Error saving car:", err);

        res.status(500).json({
            error:
                "Server error while saving car to database."
        });
    }
});


// Location search

router.get("/location-search", async (req, res) => {
    try {
        const text = req.query.text;

        if (!text || text.trim().length < 3) {
            return res.json({
                success: true,
                locations: []
            });
        }

        const url =
            `https://api.openrouteservice.org/geocode/search?api_key=${process.env.OPENROUTE_API_KEY}` +
            `&text=${encodeURIComponent(text)}&size=5`;

        const response = await fetch(url);
        const data = await response.json();

        if (!data.features) {
            return res.json({
                success: true,
                locations: []
            });
        }

        const locations = data.features.map((feature) => ({
            label: feature.properties.label,
            coordinates: feature.geometry.coordinates
        }));

        res.json({
            success: true,
            locations
        });

    } catch (err) {
        console.error("Location search error:", err);

        res.status(500).json({
            error: "Unable to search locations."
        });
    }
});

export default router;