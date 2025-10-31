"use client";

import { useState } from "react";
import { removeCity } from "@/lib/api";

export default function RemoveCityButton({ cityId, onCityRemoved }) {
  const [loading, setLoading] = useState(false);

  const handleRemove = async () => {
    if (!cityId) return;

    setLoading(true);
    try {
      await removeCity(cityId);
      onCityRemoved(cityId); // Notify parent to update UI
    } catch (error) {
      console.error("Error removing city:", error);
      alert("Failed to remove city. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleRemove}
      disabled={loading}
      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm transition disabled:opacity-50"
    >
      {loading ? "Removing..." : "Remove"}
    </button>
  );
}
