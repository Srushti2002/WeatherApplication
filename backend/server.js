// server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const weatherRoutes = require("./routes/weatherRoutes");
const cityRoutes = require("./routes/cityRoutes");
const authRoutes = require("./routes/authRoutes");

dotenv.config();
connectDB(); // MongoDB connection

const app = express();

const allowedOrigins = [
    'http://localhost:3000'  // Production Frontend
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

// Middleware
app.use(express.json());

// Test route
app.use("/api/auth", authRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/city", cityRoutes)

app.get("/", (req, res) => {
  res.send("Weather API backend is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🌦️ Server running on port ${PORT}`));
