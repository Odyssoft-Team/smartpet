import { create } from "zustand";
import { persist } from "zustand/middleware";

export type HairType = "corto" | "mediano" | "largo" | "doble" | null;
export type CoatCondition =
  | "normal"
  | "mota"
  | "enredado"
  | "estacional"
  | null;

interface GroomingState {
  hairType: HairType;
  coatCondition: CoatCondition;
  setHairType: (type: HairType) => void;
  setCoatCondition: (condition: CoatCondition) => void;
  reset: () => void;
}

export const useGroomingStore = create<GroomingState>()(
  persist(
    (set) => ({
      hairType: null,
      coatCondition: null,
      setHairType: (type) => set({ hairType: type }),
      setCoatCondition: (condition) => set({ coatCondition: condition }),
      reset: () => set({ hairType: null, coatCondition: null }),
    }),
    {
      name: "grooming-storage", // nombre de la key en localStorage
    }
  )
);
