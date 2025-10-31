"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { logoutUser } from "@/lib/api";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    try {
      logoutUser();
    } catch {
      localStorage.removeItem("token");
      window.dispatchEvent(new Event("storage"));
    }
    router.replace("/login");
    setOpen(false);
  };

  return (
    <nav className="relative flex justify-end" ref={menuRef}>
      <button
        aria-label="Open menu"
        onClick={() => setOpen((s) => !s)}
        className="p-2 hover:bg-white-1 rounded-full transition-colors"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path 
            d="M3 6h18M3 12h18M3 18h18" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-10 w-44 bg-white white:bg-white-100 border rounded-lg shadow-lg">
          <ul className="flex flex-col py-2">
            <li>
              <Link 
                href="/" 
                className="block px-4 py-2 hover:bg-gray-100 white:hover:bg-gray-700"
                onClick={() => setOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <button 
                onClick={handleLogout} 
                className="w-full text-left px-4 py-2 hover:bg-gray-100 white:hover:bg-gray-700"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}