"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import { addCity, fetchCitySuggestions } from "@/lib/api"; // ✅ added suggestions helper

// Debounce utility function
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export default function SearchBar({ onCityAdded }) {
  const [cityName, setCityName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);

  // Debounced state update
  const debouncedSetCityName = useCallback(
    debounce((value) => setCityName(value), 300),
    []
  );

  // Debounced fetch suggestions
  const debouncedFetchSuggestions = useCallback(
    debounce(async (value) => {
      if (!value || value.trim() === "") {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }
      try {
        const results = await fetchCitySuggestions(value.trim());
        setSuggestions(Array.isArray(results) ? results : []);
        setShowSuggestions(true);
      } catch (err) {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddCity = async (e) => {
    e.preventDefault();
    setError("");

    const currentValue = inputRef.current?.value ?? "";
    const trimmedName = currentValue.trim();
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

      // Clear both the input and state
      if (inputRef.current) inputRef.current.value = "";
      setCityName("");
      setSuggestions([]);
      setShowSuggestions(false);
      debouncedSetCityName(""); // clear debounced state
    } catch (err) {
      setError(err.message || "Failed to add city.");
    } finally {
      setLoading(false);
    }
  };

  const onInputChange = (e) => {
    const value = e.target.value;
    debouncedSetCityName(value);
    debouncedFetchSuggestions(value);
  };

  const handleSuggestionClick = (suggestion) => {
    const name = suggestion.name ?? suggestion; // support both shapes
    if (inputRef.current) inputRef.current.value = name;
    setCityName(name);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <form
      onSubmit={handleAddCity}
      className="w-full max-w-xl mx-auto flex flex-col sm:flex-row items-center gap-3 p-3 bg-white rounded-2xl shadow"
      ref={wrapperRef}
    >
      <div className="relative w-full sm:flex-1">
        <input
          type="text"
          ref={inputRef}
          placeholder="Enter city name (e.g. London)"
          defaultValue={cityName}
          onChange={onInputChange}
          className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          disabled={loading}
          onFocus={() => {
            if (suggestions.length > 0) setShowSuggestions(true);
          }}
          aria-autocomplete="list"
          aria-haspopup="true"
        />

        {showSuggestions && suggestions && suggestions.length > 0 && (
          <ul className="absolute left-0 right-0 mt-2 max-h-56 overflow-auto bg-white border rounded-lg shadow z-50">
            {suggestions.map((s, idx) => {
              const display = s.name ?? (typeof s === "string" ? s : JSON.stringify(s));
              return (
                <li
                  key={idx}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSuggestionClick(s)}
                >
                  {display}
                </li>
              );
            })}
          </ul>
        )}
      </div>

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