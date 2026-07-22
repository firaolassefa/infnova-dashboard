import { create } from "zustand";
import type { AuthState } from "@/lib/types";

const TOKEN_KEY = "infnova_token";
const LAST_EMAIL_KEY = "infnova_last_email";

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  lastEmail: null,
  isAuthenticated: false,

  setToken: (token: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, token);
    }
    set({ token, isAuthenticated: true });
  },

  clearToken: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
    }
    set({ token: null, isAuthenticated: false });
  },

  setLastEmail: (email: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(LAST_EMAIL_KEY, email);
    }
    set({ lastEmail: email });
  },
}));

// Hydrate from localStorage on app mount
export function hydrateAuthStore() {
  if (typeof window === "undefined") return;
  const token = localStorage.getItem(TOKEN_KEY);
  const lastEmail = localStorage.getItem(LAST_EMAIL_KEY);
  if (token) {
    useAuthStore.setState({ token, isAuthenticated: true, lastEmail });
  } else {
    useAuthStore.setState({ lastEmail });
  }
}
