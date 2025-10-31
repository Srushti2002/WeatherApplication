"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";

export default function ProtectedLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const publicPaths = ["/login", "/signup"];
      const isAuthPath = publicPaths.includes(pathname);
      const isAuthed = isAuthenticated();

      if (!isAuthed && !isAuthPath) {
        router.replace("/login");
        return;
      }

      if (isAuthed && isAuthPath) {
        router.replace("/dashboard");
        return;
      }

      setIsLoading(false);
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, [pathname, router]);

  if (isLoading) {
    return null;
  }

  return <>{children}</>;
}