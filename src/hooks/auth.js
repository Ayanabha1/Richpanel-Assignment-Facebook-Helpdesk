import { create } from "zustand";

export const useAuth = create((set) => ({
  isInitialised: false,
  isLoggedIn: false,
  userData: {},
  setLoggedIn: (state) => set({ isLoggedIn: state }),
  setUserData: (data) => set({ userData: data }),
  setInitialised: () => set({ isInitialised: true }),
}));
