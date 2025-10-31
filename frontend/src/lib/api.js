const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

// 🔹 Utility function for authorized requests
const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem("token");
  
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const res = await fetch(url, { ...options, headers });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      if (res.status === 401) {
        // Clear token if unauthorized
        localStorage.removeItem("token");
        window.dispatchEvent(new Event("storage")); // Trigger auth check
      }
      throw new Error(data.message || `Request failed: ${res.status}`);
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// 🔹 Signup user
export const signupUser = async (userData) => {
  const response = await fetch(`${BASE_URL}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Signup failed");
  }

  // Store token immediately after successful signup
  if (data.token) {
    localStorage.setItem("token", data.token);
    window.dispatchEvent(new Event("storage")); // Trigger auth check
  }
  
  return data;
};

// 🔹 Login user
export const loginUser = async (userData) => {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  // Store token after successful login (expecting { token: "..." })
  if (data && data.token) {
    localStorage.setItem("token", data.token);
    window.dispatchEvent(new Event("storage")); // Trigger auth check
  } else {
    // Backward compatibility: if backend returns token string directly
    if (typeof data === "string") {
      localStorage.setItem("token", data);
      window.dispatchEvent(new Event("storage"));
    }
  }

  return data;
};

// 🔹 Logout user
export const logoutUser = () => {
  localStorage.removeItem("token");
  window.dispatchEvent(new Event("storage")); // Trigger auth check
};

// 🔹 Get all tracked cities
export const getCities = async () => {
  return fetchWithAuth(`${BASE_URL}/api/city`, { cache: "no-store" });
};

// 🔹 Add a new city
export const addCity = async (cityName) => {
  return fetchWithAuth(`${BASE_URL}/api/city`, {
    method: "POST",
    body: JSON.stringify({ name: cityName }),
  });
};

// Fetch city suggestions (expects backend route /api/weather/suggest?query=...)
export const fetchCitySuggestions = async (query) => {
  if (!query) return [];
  // fetchWithAuth already returns parsed JSON
  const data = await fetchWithAuth(`${BASE_URL}/api/weather/suggest?query=${encodeURIComponent(query)}`, {
    cache: "no-store",
  });

  return data.suggestions ?? data;
};

// ✅ Fetch 5-day forecast for a specific city
export const fetchForecast = async (cityName) => {
  try {
    const data = await fetchWithAuth(`${BASE_URL}/api/weather/forecast/${encodeURIComponent(cityName)}`, {
      cache: "no-store"
    });
    
    return data.forecast || []; // Return forecast array or empty array if not found
  } catch (error) {
    console.error("Error fetching forecast:", error);
    throw error; // Let the component handle the error
  }
};

// 🔹 Remove a city
export const removeCity = async (cityId) => {
  return fetchWithAuth(`${BASE_URL}/api/city/${cityId}`, {
    method: "DELETE",
  });
};

// 🔹 Get weather data for a city
export const getWeatherByCity = async (cityName) => {
  return fetchWithAuth(`${BASE_URL}/api/weather/${encodeURIComponent(cityName)}`, {
    cache: "no-store",
  });
};