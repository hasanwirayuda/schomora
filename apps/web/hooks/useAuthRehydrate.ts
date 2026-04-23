"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth";
import { authApi } from "@/lib/api/auth";

export function useAuthRehydrate() {
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
}
