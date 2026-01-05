import api from "@/lib/api";
import { AxiosError } from "axios";
import { create } from "zustand";

type AuthState = {
  //   STATES
  user: null;
  loading: boolean;

  // ACTIONS
  login: ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => Promise<boolean>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,

  login: async ({ email, password }) => {
    set({ loading: true });

    try {
      const res = await api.post("/auth/login", { email, password });
      console.log("login response ->", res);
      return true;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log("Axios error =>", error);
      }
      throw error;
    }
  },
}));
