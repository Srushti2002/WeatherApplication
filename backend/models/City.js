// models/City.js
const mongoose = require("mongoose");

const citySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  country: {
    type: String,
  },
  temperature: {
    type: Number,
  },
  description: {
    type: String, // e.g., "clear sky"
  },
  icon: {
    type: String, // e.g., "01d" from OpenWeatherMap API
  },
  humidity: {
    type: Number,
  },
  windSpeed: {
    type: Number,
  },
  sunrise: {
    type: Number, // timestamp (optional)
  },
  sunset: {
    type: Number, // timestamp (optional)
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

citySchema.index({ name: 1, userId: 1 }, { unique: true });
// Export the model
module.exports = mongoose.model("City", citySchema);
