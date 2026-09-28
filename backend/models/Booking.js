import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        bookingId: {
            type: String,
            required: true,
            unique: true
        },
        userId: {
            type: String,
            required: true
        },
        customerName: {
            type: String,
            required: [true, "Customer name is required"],
            trim: true
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            trim: true
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
            trim: true
        },
        pickupLocation: {
            type: String,
            required: [true, "Pickup location is required"],
            trim: true
        },
        destination: {
            type: String,
            required: [true, "Destination is required"],
            trim: true
        },
        pickupDate: {
            type: String,
            required: [true, "Pickup date is required"]
        },
        returnDate: {
            type: String,
            required: [true, "Return date is required"]
        },
        carId: {
            type: String,
            required: [true, "Car ID is required"]
        },
        carName: {
            type: String
        },
        carBrand: {
            type: String
        },
        rentalDays: {
            type: Number,
            default: 1
        },
        dailyPrice: {
            type: Number
        },
        basePrice: {
            type: Number
        },
        serviceCharge: {
            type: Number,
            default: 100
        },
        totalPrice: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Booking", bookingSchema);