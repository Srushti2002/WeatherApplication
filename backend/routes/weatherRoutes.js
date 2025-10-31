// routes/weatherRoutes.js
const express = require("express");
const router = express.Router();
const { getWeatherByCity, getFiveDayForecast } = require("../controllers/weatherController");
const { jwtAuthMiddleware } = require('../middleware/jwt');


// GET /api/weather/:city
router.get("/:city", jwtAuthMiddleware, getWeatherByCity);
router.get("/forecast/:city", getFiveDayForecast);

module.exports = router;
