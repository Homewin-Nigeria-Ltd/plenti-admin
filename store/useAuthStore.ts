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
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      set({ loading: false });
      return true;
    } catch (error) {
      console.error("Login error =>", error);
      set({ loading: false });
      throw error;
    }
  },
}));
