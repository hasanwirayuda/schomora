import api from "@/lib/axios";
import { User } from "@/lib/types";

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const authApi = {
  login: async (input: LoginInput): Promise<AuthResponse> => {
    const res = await api.post("/auth/login", input);
    return res.data;
  },

  register: async (input: RegisterInput): Promise<AuthResponse> => {
    const res = await api.post("/auth/register", input);
    return res.data;
  },

  me: async (): Promise<User> => {
    const res = await api.get("/auth/me");
    return res.data;
  },
};
