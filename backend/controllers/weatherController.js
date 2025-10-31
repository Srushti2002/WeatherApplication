// controllers/weatherController.js
const axios = require("axios");

const getWeatherByCity = async (req, res) => {
  const city = req.params.city;

  if (!city) {
    return res.status(400).json({ message: "City name is required" });
  }

  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&appid=${apiKey}&units=metric`;

    const { data } = await axios.get(url);

    // Extract necessary info
    const weatherData = {
      name: data.name,
      country: data.sys.country,
      temperature: data.main.temp,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset,
    };

    res.json(weatherData);
  } catch (error) {
    console.error(error.message);
    if (error.response && error.response.status === 404) {
      res.status(404).json({ message: "City not found" });
    } else {
      res.status(500).json({ message: "Error fetching weather data" });
    }
  }
};

const getFiveDayForecast = async (req, res) => {
  try {
    const { city } = req.params;
    const apiKey = process.env.OPENWEATHER_API_KEY;

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
    );

    const forecastData = response.data.list
      .filter((reading) => reading.dt_txt.includes("12:00:00")) // mid-day snapshot
      .map((day) => ({
        date: day.dt_txt.split(" ")[0],
        temp_min: day.main.temp_min,
        temp_max: day.main.temp_max,
        description: day.weather[0].description,
        icon: day.weather[0].icon,
      }));

    res.json({ city: response.data.city.name, forecast: forecastData });
  } catch (error) {
    res.status(500).json({ error: "Unable to fetch forecast data" });
  }
};

const getCitySuggestions = async (req, res) => {
  try {
    const q = req.query.query || req.query.q || "";
    if (!q) return res.json([]);
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
      q
    )}&limit=6&appid=${apiKey}`;

    const { data } = await axios.get(url);

    // Normalize suggestions: "Name, State, Country" or "Name, Country"
    const suggestions = data.map((item) => {
      const parts = [item.name];
      if (item.state) parts.push(item.state);
      if (item.country) parts.push(item.country);
      return { name: parts.join(", "), lat: item.lat, lon: item.lon };
    });

    res.json({ suggestions });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error fetching suggestions" });
  }
};

module.exports = { getWeatherByCity, getFiveDayForecast, getCitySuggestions};
