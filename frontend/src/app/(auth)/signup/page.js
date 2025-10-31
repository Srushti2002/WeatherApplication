"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthForm from "@/components/AuthForm.js"
import { signupUser } from "@/lib/api";

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSignup = async (form) => {
    try {
      setError("");
      const response = await signupUser(form);
      if (response.token) {
        router.replace("/");
      }
    } catch (err) {
      setError(err.message || "Signup failed. Please try again.");
    }
  };

  return (
    <div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <AuthForm type="signup" onSubmit={handleSignup} />
    </div>
  );
}