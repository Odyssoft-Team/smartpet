import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthStore {
  token: string | null;
  currentUser: string | null;
  savedUsers: string[];
  hasHydrated: boolean;
  setToken: (token: string) => void;
  setCurrentUser: (user: string) => void;
  saveUser: (user: string) => void;
  removeUser: (user: string) => void;
  setHasHydrated: (state: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      token: "token_init",
      currentUser: null,
      savedUsers: [],
      hasHydrated: false,
      setToken: (token: string) => set({ token }),
      setCurrentUser: (user: string) => set({ currentUser: user }),
      saveUser: (user: string) =>
        set({ savedUsers: [...get().savedUsers, user] }),
      removeUser: (user: string) =>
        set({ savedUsers: get().savedUsers.filter((u) => u !== user) }),
      setHasHydrated: (state: boolean) => set({ hasHydrated: state }),
      logout: () => set({ token: null, currentUser: null, savedUsers: [] }),
    }),
    {
      name: "auth",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
