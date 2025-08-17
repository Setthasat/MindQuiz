import { create } from "zustand";

interface UserState {
  userId: string | null;
  email: string | null;
  setUser: (user: { userId: string; email: string }) => void;
  getUserId: () => string | null;
  logout: () => void;
}

export const useStore = create<UserState>((set) => ({
  userId: localStorage.getItem("userId"),
  email: localStorage.getItem("email"),
  setUser: ({ userId, email }) => {
    set({ userId, email });
    localStorage.setItem("userId", userId);
    localStorage.setItem("email", email);
  },
  getUserId: () => localStorage.getItem("userId"),
  logout: () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("email");
    set({ userId: null, email: null });
  },
}));
