"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth";
import { authApi } from "@/lib/api/auth";
import Navbar from "@/components/layout/navbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, token, setAuth, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.replace("/login");
      return;
    }

    if (!user) {
      authApi
        .me()
        .then((me) => setAuth(me, token))
        .catch(() => {
          logout();
          router.replace("/login");
        });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
