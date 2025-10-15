// store/auth.store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

// ✅ Estado base
interface AuthState {
  token: string | null;
  currentUser: string | null;
  savedUsers: string[];
  hasHydrated: boolean;
  isLoading: boolean;
}

// ✅ Acciones del store
interface AuthActions {
  setToken: (token: string | null) => void;
  setCurrentUser: (user: string | null) => void;
  saveUser: (user: string) => void;
  removeUser: (user: string) => void;
  setHasHydrated: (state: boolean) => void;
  startLoading: () => void;
  stopLoading: () => void;
  logout: () => void;
  clearAuth: () => void; // 🔹 reset total (similar a clearFields)
}

// ✅ Estado inicial centralizado
const initialState: AuthState = {
  token: null,
  currentUser: null,
  savedUsers: [],
  hasHydrated: false,
  isLoading: true,
};

// ✅ Store con persistencia y tipado estricto
export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      setToken: (token) => set({ token }),
      setCurrentUser: (user) => set({ currentUser: user }),

      // 🔹 Evita duplicados al guardar usuarios
      saveUser: (user) => {
        const existing = get().savedUsers;
        if (!existing.includes(user)) {
          set({ savedUsers: [...existing, user] });
        }
      },

      removeUser: (user) =>
        set({ savedUsers: get().savedUsers.filter((u) => u !== user) }),

      setHasHydrated: (state) => set({ hasHydrated: state }),

      startLoading: () => set({ isLoading: true }),

      stopLoading: () => set({ isLoading: false }),

      logout: () => set({ token: null, currentUser: null }),

      // 🔹 Limpia absolutamente todo (ideal para reset global)
      clearAuth: () => set({ ...initialState, hasHydrated: true }),
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
