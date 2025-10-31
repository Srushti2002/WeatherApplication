// routes/weatherRoutes.js
const express = require("express");
const router = express.Router();
const { addCity, getAllCities, deleteCity } = require("../controllers/cityController");
const { jwtAuthMiddleware } = require('../middleware/jwt');


// GET /api/weather/:city
router.post("/", jwtAuthMiddleware, addCity);
router.get("/", jwtAuthMiddleware, getAllCities);

// DELETE /api/cities/:id - Remove city
router.delete("/:id", jwtAuthMiddleware, deleteCity);

module.exports = router;
