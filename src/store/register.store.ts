import { create } from "zustand";
import { persist } from "zustand/middleware";

// ✅ Tipado del estado
type RegisterState = {
  email: string;
  password: string;
  name: string;
  phone: string;
};

// ✅ Tipado de las acciones (mutadores del estado)
interface RegisterActions {
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setName: (name: string) => void;
  setPhone: (phone: string) => void;
  clearFields: () => void;

  isStepComplete: (step: "email" | "name" | "phone") => boolean;
}

// ✅ Estado inicial (útil para el reset)
const initialState: RegisterState = {
  email: "",
  password: "",
  name: "",
  phone: "",
};

export const useRegisterStore = create(
  persist<RegisterState & RegisterActions>(
    (set, get) => ({
      ...initialState,

      // Normaliza y setea el email
      setEmail: (email: string) => {
        const normalized = email.trim().toLowerCase();
        set({ email: normalized });
      },

      // Normaliza y setea la contraseña
      setPassword: (password: string) => {
        const normalized = password.trim();
        set({ password: normalized });
      },

      // Normaliza y setea el nombre
      setName: (name: string) => {
        set({ name: name });
      },

      // Acepta number; coerciona de forma segura, entero >= 0
      setPhone: (phone: string) => {
        const sanitized = phone.replace(/[^\d+\s]/g, "").trim();
        set({ phone: sanitized });
      },

      // Comprueba si un paso está completo (útil para guards / navegación)
      isStepComplete: (step: "email" | "name" | "phone") => {
        const { email, password, name, phone } = get();
        switch (step) {
          case "email":
            // validación mínima; puedes reemplazar por una regex si quieres
            return (
              email.includes("@") && email.length > 5 && password.length >= 4
            );
          case "name":
            return name.trim().length > 1;
          case "phone":
            return phone.length >= 9;
          default:
            return false;
        }
      },

      clearFields: () => set(initialState),
    }),
    {
      name: "register-storage",
    }
  )
);
