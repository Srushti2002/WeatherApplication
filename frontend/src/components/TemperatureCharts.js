"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function TemperatureChart({ data }) {
  if (!data || data.length === 0) return null;

  // Optional: format the data so each date is a weekday short form
  const formattedData = data.map((day) => ({
    ...day,
    formattedDate: new Date(day.date).toLocaleDateString("en-US", {
      weekday: "short",
    }),
  }));

  return (
    <div className="absolute right-0 top-10 z-20 bg-white border border-gray-300 rounded-lg shadow-xl p-4 w-[80vw] sm:w-[500px] h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={formattedData}
          margin={{ top: 10, right: 0, left: 0, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="formattedDate" />
          <YAxis unit="°C" />
          <Tooltip
            formatter={(value) => `${Math.round(value)}°C`}
            labelFormatter={(label) => `Day: ${label}`}
            contentStyle={{
              backgroundColor: "#f9fafb",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
            }}
          />
          <Legend />
          {/* ✅ Bars for Min and Max temperatures */}
          <Bar
            dataKey="temp_min"
            fill="#3b82f6"
            name="Min Temp"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="temp_max"
            fill="#f97316"
            name="Max Temp"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
