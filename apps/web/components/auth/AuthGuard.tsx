"use client";

import { useAuthRehydrate } from "@/hooks/useAuthRehydrate";

export default function AuthGuard() {
  useAuthRehydrate();
  return null;
}
