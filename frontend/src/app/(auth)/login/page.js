"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import { loginUser } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleLogin = async (form) => {
    try {
      setError("");
      const response = await loginUser(form);
      console.log("Login response:", response);
      if (response) {
        router.replace("/");
      }
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    }
  };

  return (
    <div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <AuthForm type="login" onSubmit={handleLogin} />
    </div>
  );
}
