const axios = require("axios");
const City = require("../models/City");

const addCity = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.id;

    if (!name) {
      return res.status(400).json({ message: "City name is required" });
    }

    // Check if city already exists
    const existingCity = await City.findOne({ name: name.trim(), userId: userId });
    if (existingCity) {
      return res.status(400).json({ message: "City already tracked" });
    }

    // Fetch weather data from OpenWeatherMap API
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${apiKey}&units=metric`;

    const { data } = await axios.get(url);

    // Create a new City document
    const newCity = new City({
      name: data.name,
      userId: userId,
      country: data.sys.country,
      temperature: data.main.temp,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset,
    });

    await newCity.save();

    res.status(201).json({
      message: "City added successfully",
      city: newCity,
    });
  } catch (error) {
    console.error(error.message);
    if (error.response && error.response.status === 404) {
      res.status(404).json({ message: "City not found" });
    } else {
      res.status(500).json({ message: "Error adding city" });
    }
  }
};

const getAllCities = async (req, res) => {
  try {
    const userId = req.user.id;
    const cities = await City.find({userId}).sort({ name: 1 });
    res.status(200).json(cities);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error fetching cities" });
  }
};

const deleteCity = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const city = await City.findByIdAndDelete({
      _id: id, userId: userId
    });

    if (!city) {
      return res.status(404).json({ message: "City not found" });
    }

    res.status(200).json({ message: "City removed successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error deleting city" });
  }
};


module.exports = { addCity, getAllCities, deleteCity };