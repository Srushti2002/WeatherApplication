"use client";
import { useState } from "react";
import { addCity } from "@/lib/api"; // ✅ import backend function

export default function SearchBar({ onCityAdded }) {
  const [cityName, setCityName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAddCity = async (e) => {
    e.preventDefault();
    setError("");

    const trimmedName = cityName.trim();
    if (!trimmedName) {
      setError("Please enter a city name.");
      return;
    }

    try {
      setLoading(true);

      // ✅ Call backend via API helper
      const newCity = await addCity(trimmedName);

      // Notify parent (dashboard) that a new city was added
      onCityAdded(newCity.city);
    //   console.log("New city added:", newCity);


      setCityName(""); // clear input
    } catch (err) {
      setError(err.message || "Failed to add city.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleAddCity}
      className="w-full max-w-xl mx-auto flex flex-col sm:flex-row items-center gap-3 p-3 bg-white rounded-2xl shadow"
    >
      <input
        type="text"
        placeholder="Enter city name (e.g. London)"
        value={cityName}
        onChange={(e) => setCityName(e.target.value)}
        className="w-full sm:flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
        disabled={loading}
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full sm:w-auto px-5 py-2 rounded-xl bg-blue-600 text-white font-medium disabled:opacity-60"
      >
        {loading ? "Adding..." : "Add City"}
      </button>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}
