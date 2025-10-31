"use client";

import { useEffect, useState } from "react";
import { getWeatherByCity, fetchForecast } from "@/lib/api";
import TemperatureChart from "@/components/TemperatureCharts";

export default function CityCard({ city }) {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [forecastLoading, setForecastLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showChart, setShowChart] = useState(false); // 👈 chart visibility

  // ✅ Fetch current weather
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const data = await getWeatherByCity(city.name);
        setWeatherData(data);
      } catch (err) {
        console.error("Error fetching weather:", err);
        setError("Unable to fetch weather data");
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, [city.name]);

  // ✅ Fetch 5-day forecast
  useEffect(() => {
    const fetchForecastData = async () => {
      try {
        const data = await fetchForecast(city.name);
        setForecastData(data);
      } catch (err) {
        console.error("Error fetching forecast:", err);
      } finally {
        setForecastLoading(false);
      }
    };
    fetchForecastData();
  }, [city.name]);

  if (loading)
    return (
      <div className="p-4 text-center text-gray-500 animate-pulse">
        Loading weather...
      </div>
    );

  if (error)
    return (
      <div className="p-4 text-center text-red-500">
        {error}
      </div>
    );

  if (!weatherData) return null;

  const {
    name,
    country,
    temperature,
    description,
    icon,
    humidity,
    windSpeed,
    sunrise,
    sunset,
  } = weatherData;

  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

  return (
    <div className="relative bg-gray-50 p-6 rounded-xl shadow-sm overflow-visible">
      {/* ✅ Current Weather */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img src={iconUrl} alt={description} className="w-14 h-14" />
          <div>
            <h2 className="text-xl font-semibold">
              {name} <span className="text-gray-500 text-sm">({country})</span>
            </h2>
            <p className="text-gray-600 capitalize">{description}</p>
          </div>
        </div>

        {/* 🌡 Hover to show temperature trend */}
        <div
          className="relative"
          onMouseEnter={() => setShowChart(true)}
          onMouseLeave={() => setShowChart(false)}
        >
          <p className="text-3xl font-bold cursor-pointer">
            {Math.round(temperature)}°C
          </p>

          {/* Chart appears on hover */}
          {showChart && <TemperatureChart data={forecastData} />}
        </div>
      </div>

      {/* Detailed Info */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-gray-700">
        <div>
          <p className="font-medium">💧 Humidity</p>
          <p>{humidity}%</p>
        </div>
        <div>
          <p className="font-medium">🌬 Wind Speed</p>
          <p>{windSpeed} m/s</p>
        </div>
        <div>
          <p className="font-medium">🌅 Sunrise</p>
          <p>
            {new Date(sunrise * 1000).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <div>
          <p className="font-medium">🌇 Sunset</p>
          <p>
            {new Date(sunset * 1000).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>

      {/* ✅ 5-Day Forecast */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          5-Day Forecast
        </h3>

        {forecastLoading ? (
          <p className="text-gray-500 animate-pulse">Loading forecast...</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {forecastData.map((day, index) => (
              <div
                key={index}
                className="flex flex-col items-center bg-gray-100 p-3 rounded-lg shadow-sm"
              >
                <p className="font-medium text-gray-700">
                  {new Date(day.date).toLocaleDateString("en-US", {
                    weekday: "short",
                  })}
                </p>
                <img
                  src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                  alt={day.description}
                  className="w-10 h-10"
                />
                <p className="text-sm text-gray-600 capitalize">
                  {day.description}
                </p>
                <p className="font-semibold text-gray-800">
                  {Math.round(day.temp_max)}° / {Math.round(day.temp_min)}°
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
