import { create } from "zustand";
import Cookies from "js-cookie";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  xp_total: number;
  streak_days: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: Cookies.get("token") || null,
  isAuthenticated: !!Cookies.get("token"),

  setAuth: (user, token) => {
    Cookies.set("token", token, { expires: 7 });
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    Cookies.remove("token");
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
