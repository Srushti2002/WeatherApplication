"use client";

import { useState, useEffect } from "react";
import SearchBar from "@/components/SearchBar";
import CityCard from "@/components/CityCard";
import RemoveCityButton from "@/components/RemoveCityButton";
import { getCities } from "@/lib/api";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function DashboardPage() {
  const [cities, setCities] = useState([]);
  const [expandedCityId, setExpandedCityId] = useState(null);

  // Fetch tracked cities on load
  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      const data = await getCities();
      setCities(data);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const handleCityAdded = (newCity) => {
    setCities((prev) => [...prev, newCity]);
  };

  const handleCityRemoved = (id) => {
    setCities((prev) => prev.filter((city) => city._id !== id));
  };

  const toggleDropdown = async (id) => {
    if (expandedCityId === id) {
      setExpandedCityId(null);
      return;
    }

    setExpandedCityId(id);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-5 px-6 md:px-20">
      <Navbar />
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        🌤 Weather Dashboard
      </h1>

      {/* Search Bar */}
      <div className="max-w-xl mx-auto mb-8">
        <SearchBar onCityAdded={handleCityAdded} />
      </div>

      {/* City List */}
      <div className="max-w-3xl mx-auto space-y-4">
        {cities.length === 0 ? (
          <p className="text-center text-gray-600">
            No cities tracked yet. Add a city to get started!
          </p>
        ) : (
          cities.map((city) => (
            <div
              key={city._id}
              className="bg-white rounded-2xl shadow p-4 transition"
            >
              {/* City Header */}
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <h2 className="text-lg font-semibold">{city.name}</h2>
                </div>

                <div className="flex items-center space-x-3">
                  {/* Delete Button */}
                  <RemoveCityButton
                    cityId={city._id}
                    onCityRemoved={handleCityRemoved}
                  />

                  {/* Dropdown Toggle */}
                  <button
                    onClick={() => toggleDropdown(city._id)}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    {expandedCityId === city._id ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Dropdown Content */}
              {expandedCityId === city._id && (
                <div className="mt-4">
                  <CityCard city={city} />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
