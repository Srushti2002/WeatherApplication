"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const handleStart = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 text-gray-800">
      <h1 className="text-4xl md:text-5xl text-center font-bold mb-4">
        🌤 Welcome to Weather Tracker
      </h1>
      <p className="text-lg mb-8 text-gray-600 text-center max-w-md">
        Track weather updates for your favorite cities, view detailed reports,
        and stay prepared — all in one simple dashboard.
      </p>
      <button
        onClick={handleStart}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-xl shadow-md transition"
      >
        Go to Dashboard →
      </button>
    </div>
  );
}
