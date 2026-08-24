require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const cars = [
  {
    id: 1,
    name: "Swift",
    brand: "Maruti",
    type: "Hatchback",
    price: 1500,
    seats: 5,
    fuel: "Petrol"
  },
  {
    id: 2,
    name: "Creta",
    brand: "Hyundai",
    type: "SUV",
    price: 2500,
    seats: 5,
    fuel: "Petrol"
  },
  {
    id: 3,
    name: "City",
    brand: "Honda",
    type: "Sedan",
    price: 2200,
    seats: 5,
    fuel: "Petrol"
  },
  {
    id: 4,
    name: "Thar",
    brand: "Mahindra",
    type: "SUV",
    price: 3000,
    seats: 4,
    fuel: "Diesel"
  },
  {
    id: 5,
    name: "Baleno",
    brand: "Maruti",
    type: "Hatchback",
    price: 1600,
    seats: 5,
    fuel: "Petrol"
  },
  {
    id: 6,
    name: "Verna",
    brand: "Hyundai",
    type: "Sedan",
    price: 2400,
    seats: 5,
    fuel: "Diesel"
  }
];

// GET request to get all cars
app.get("/api/cars", (req, res) => {
  res.json(cars);
});

// Simple test route
app.get("/", (req, res) => {
  res.send("RentRoute backend is running!");
});

app.listen(PORT, () => {
  console.log(`RentRoute server running on port ${PORT}`);
});