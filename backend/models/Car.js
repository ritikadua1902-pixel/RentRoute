import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Car name is required"],
            trim: true
        },
        brand: {
            type: String,
            default: "Standard",
            trim: true
        },
        type: {
            type: String,
            required: [true, "Car type is required"],
            trim: true
        },
        price: {
            type: Number,
            required: [true, "Daily rent price is required"],
            min: [1, "Price must be greater than 0"]
        },
        seats: {
            type: Number,
            default: 5
        },
        fuel: {
            type: String,
            default: "Petrol"
        },
        location: {
            type: String,
            required: [true, "Location is required"],
            trim: true
        },
        image: {
            type: String,
            required: [true, "Image URL is required"],
            trim: true
        },
        available: {
            type: Boolean,
            default: true
        },
        description: {
            type: String,
            default: "Reliable and comfortable rental vehicle for your journey."
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Car", carSchema);