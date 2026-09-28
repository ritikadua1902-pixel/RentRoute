import express from "express";
import mongoose from "mongoose";

import Booking from "../models/Booking.js";
import Car from "../models/Car.js";
import verifyAdmin from "../middleware/verifyAdmin.mjs";
import getTodayISO from "../utils/dateUtils.mjs";

const router = express.Router();

// Get bookings of a particular user

router.get("/bookings/user/:userId", async (req, res) => {
    try {
        const bookings = await Booking.find({
            userId: req.params.userId
        }).sort({
            createdAt: -1
        });

        res.json({
            success: true,
            bookings
        });

    } catch (err) {
        console.error("Error fetching user bookings:", err);

        res.status(500).json({
            error: "Failed to fetch your bookings."
        });
    }
});


// Create booking

router.post("/bookings", async (req, res) => {
    try {
        const {
            userId,
            customerName,
            email,
            phone,
            pickupLocation,
            destination,
            pickupDate,
            returnDate,
            carId
        } = req.body;

        if (
            !userId||
            !customerName ||
            !email ||
            !phone ||
            !pickupLocation ||
            !destination ||
            !pickupDate ||
            !returnDate ||
            !carId
        ) {
            return res.status(400).json({
                error: "All booking fields are required."
            });
        }

        if (phone.length < 10) {
            return res.status(400).json({
                error: "Phone number must be at least 10 digits."
            });
        }

        let car;

        if (mongoose.Types.ObjectId.isValid(carId)) {
            car = await Car.findById(carId);
        } else {
            car = await Car.findOne({
                id: carId
            });
        }

        if (!car) {
            return res.status(404).json({
                error: "Selected car is invalid or not found."
            });
        }

        const todayISO = getTodayISO();

        if (pickupDate < todayISO) {
            return res.status(400).json({
                error: "Pickup date cannot be before today's date."
            });
        }

        if (returnDate < pickupDate) {
            return res.status(400).json({
                error: "Return date cannot be before the pickup date."
            });
        }

        const startDate = new Date(pickupDate);
        const endDate = new Date(returnDate);

        const diffTime = endDate - startDate;

        const calculatedDays = Math.ceil(
            diffTime / (1000 * 60 * 60 * 24)
        );

        const rentalDays = Math.max(1, calculatedDays);

        const dailyPrice = car.price;

        const basePrice = dailyPrice * rentalDays;

        const serviceCharge = 100;

        const totalPrice = basePrice + serviceCharge;

        const bookingId =
            "RR-" +
            Math.floor(
                100000 + Math.random() * 900000
            );

        const newBooking = new Booking({
            bookingId,
            userId,
            customerName,
            email,
            phone,
            pickupLocation,
            destination,
            pickupDate,
            returnDate,
            carId: car._id.toString(),
            carName: car.name,
            carBrand: car.brand,
            rentalDays,
            dailyPrice,
            basePrice,
            serviceCharge,
            totalPrice
        });

        const savedBooking = await newBooking.save();

        res.status(201).json({
            success: true,
            message: "Booking confirmed successfully!",
            booking: savedBooking
        });

    } catch (err) {
        console.error("Booking error:", err);

        res.status(500).json({
            error: "Server error while processing booking."
        });
    }
});


// Get all bookings - Admin only

router.get("/bookings", verifyAdmin, async (req, res) => {
    try {
        const bookings = await Booking.find().sort({
            createdAt: -1
        });

        res.json({
            success: true,
            bookings
        });

    } catch (err) {
        console.error("Error fetching all bookings:", err);

        res.status(500).json({
            error: "Failed to fetch bookings."
        });
    }
});

export default router;