require("dotenv").config();
console.log("API KEY LOADED:", !!process.env.OPENROUTE_API_KEY);
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/photos", express.static(path.join(__dirname, "photos")));

const cars = [
  {
    id: 1,
    name: "Swift",
    brand: "Maruti",
    type: "Hatchback",
    price: 1500,
    seats: 5,
    fuel: "Petrol",
    image:"http://localhost:5000/photos/maruti-Swift.avif"
  },
  {
    id: 2,
    name: "Creta",
    brand: "Hyundai",
    type: "SUV",
    price: 2500,
    seats: 5,
    fuel: "Petrol",
    image:"http://localhost:5000/photos/hyundai-creta.jpg"
  },
  {
    id: 3,
    name: "City",
    brand: "Honda",
    type: "Sedan",
    price: 2200,
    seats: 5,
    fuel: "Petrol",
    image:"http://localhost:5000/photos/honda-city.jpg"
  },
  {
    id: 4,
    name: "Thar",
    brand: "Mahindra",
    type: "SUV",
    price: 3000,
    seats: 4,
    fuel: "Diesel",
    image:"http://localhost:5000/photos/Mahindra-thar.jpg"
  },
  {
    id: 5,
    name: "Baleno",
    brand: "Maruti",
    type: "Hatchback",
    price: 1600,
    seats: 5,
    fuel: "Petrol",
    image:"http://localhost:5000/photos/maruti-baleno.avif"
  },
  {
    id: 6,
    name: "Verna",
    brand: "Hyundai",
    type: "Sedan",
    price: 2400,
    seats: 5,
    fuel: "Diesel",
    image:"http://localhost:5000/photos/Hyundai-verna.avif"
  }
];

// Helper function to get local date string YYYY-MM-DD
function getTodayISO() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

app.get("/api/cars", (req, res) => {
  res.json(cars);
});

app.get("/api/cars/:id", (req, res) => {
  const car = cars.find((c) => c.id === parseInt(req.params.id));
  if (!car) {
    return res.status(404).json({ success: false, error: "Car not found" });
  }
  res.json(car);
});

app.post("/api/calculate-route", async (req, res) => {
  const { pickupLocation, destination } = req.body;

  if (!pickupLocation || !destination) {
    return res.status(400).json({
      success: false,
      error: "Both pickup location and destination are required."
    });
  }

  const apiKey = process.env.OPENROUTE_API_KEY;

  if (!apiKey) {
    return res.status(503).json({
      success: false,
      error: "OpenRouteService API key is not configured on the server."
    });
  }

  try {
    // 1. Convert pickup location into coordinates
    const pickupResponse = await fetch(
      `https://api.openrouteservice.org/geocode/search?api_key=${apiKey}&text=${encodeURIComponent(pickupLocation)}`
    );

    if (!pickupResponse.ok) {
      throw new Error(`Pickup geocoding failed: ${pickupResponse.status}`);
    }

    const pickupData = await pickupResponse.json();

    if (!pickupData.features || pickupData.features.length === 0) {
      return res.status(400).json({
        success: false,
        error: `Could not find pickup location: ${pickupLocation}`
      });
    }

    const pickupCoords = pickupData.features[0].geometry.coordinates;

    // 2. Convert destination into coordinates
    const destinationResponse = await fetch(
      `https://api.openrouteservice.org/geocode/search?api_key=${apiKey}&text=${encodeURIComponent(destination)}`
    );

    if (!destinationResponse.ok) {
      throw new Error(`Destination geocoding failed: ${destinationResponse.status}`);
    }

    const destinationData = await destinationResponse.json();

    if (!destinationData.features || destinationData.features.length === 0) {
      return res.status(400).json({
        success: false,
        error: `Could not find destination: ${destination}`
      });
    }

    const destinationCoords =
      destinationData.features[0].geometry.coordinates;

    // 3. Calculate ONE route using the coordinates
    const routeResponse = await fetch(
      `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${pickupCoords[0]},${pickupCoords[1]}&end=${destinationCoords[0]},${destinationCoords[1]}`
    );

    if (!routeResponse.ok) {
      throw new Error(
        `OpenRouteService directions failed: ${routeResponse.status}`
      );
    }

    const routeData = await routeResponse.json();

    return res.json({
      success: true,
      data: routeData
    });

  } catch (error) {
    console.error("OpenRouteService API Error:", error.message);

    return res.status(502).json({
      success: false,
      error: "OpenRouteService route calculation is currently unavailable."
    });
  }
});

app.post("/api/bookings", (req, res) => {
  const {
    customerName,
    email,
    phone,
    pickupLocation,
    destination,
    pickupDate,
    returnDate,
    carId
  } = req.body;

  // 1. Required fields check
  if (
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
      success: false,
      error: "All booking fields are required."
    });
  }

  // 2. Validate car existence
  const car = cars.find((c) => c.id === parseInt(carId));
  if (!car) {
    return res.status(404).json({
      success: false,
      error: "Selected car is invalid or not available."
    });
  }

  // 3. Date Validation - Strict
  const todayISO = getTodayISO();

  if (pickupDate < todayISO) {
    return res.status(400).json({
      success: false,
      error: "Pickup date cannot be before today's date."
    });
  }

  if (returnDate < pickupDate) {
    return res.status(400).json({
      success: false,
      error: "Return date cannot be before the pickup date."
    });
  }

  // Calculate rental duration in days
  const start = new Date(pickupDate);
  const end = new Date(returnDate);
  const diffTime = end.getTime() - start.getTime();
  const calculatedDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const rentalDays = Math.max(1, calculatedDays);

  const dailyPrice = car.price;
  const basePrice = dailyPrice * rentalDays;
  const serviceCharge = 100;
  const totalPrice = basePrice + serviceCharge;

  const bookingId = "RR-" + Math.floor(100000 + Math.random() * 900000);

  const confirmedBooking = {
    bookingId,
    customerName,
    email,
    phone,
    pickupLocation,
    destination,
    pickupDate,
    returnDate,
    carId: car.id,
    carName: car.name,
    carBrand: car.brand,
    rentalDays,
    dailyPrice,
    basePrice,
    serviceCharge,
    totalPrice
  };

  return res.json({
    success: true,
    message: "Booking confirmed successfully!",
    booking: confirmedBooking
  });
});

app.get("/", (req, res) => {
  res.send("RentRoute backend is running!");
});

app.listen(PORT, () => {
  console.log(`RentRoute server running on port ${PORT}`);
});