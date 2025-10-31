// routes/weatherRoutes.js
const express = require("express");
const router = express.Router();
const { getWeatherByCity, getFiveDayForecast, getCitySuggestions } = require("../controllers/weatherController");
const { jwtAuthMiddleware } = require('../middleware/jwt');


// GET /api/weather/:city
router.get("/suggest", jwtAuthMiddleware, getCitySuggestions);
router.get("/:city", jwtAuthMiddleware, getWeatherByCity);
router.get("/forecast/:city", jwtAuthMiddleware, getFiveDayForecast);

module.exports = router;
