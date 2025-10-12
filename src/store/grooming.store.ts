import { create } from "zustand";
import { persist } from "zustand/middleware";

export type HairType = "corto" | "mediano" | "largo" | "doble" | null;
export type CoatCondition =
  | "normal"
  | "mota"
  | "enredado"
  | "estacional"
  | null;

export type GroomingService =
  | "clasico"
  | "medicado"
  | "premium"
  | "seco"
  | null;

export type GroomingExtra =
  | "deslanado"
  | "desmotado"
  | "pipetas"
  | "cortes"
  | "cepillo";

interface GroomingState {
  hairType: HairType;
  coatCondition: CoatCondition;
  service: GroomingService;
  extras: GroomingExtra[];

  setHairType: (type: HairType) => void;
  setCoatCondition: (condition: CoatCondition) => void;
  setService: (service: GroomingService) => void;
  toggleExtra: (extra: GroomingExtra) => void;

  reset: () => void;
}

export const useGroomingStore = create<GroomingState>()(
  persist(
    (set, get) => ({
      hairType: null,
      coatCondition: null,
      service: null,
      extras: [],

      setHairType: (type) => set({ hairType: type }),
      setCoatCondition: (condition) => set({ coatCondition: condition }),
      setService: (service) => set({ service }),

      toggleExtra: (extra) => {
        const currentExtras = get().extras;
        set({
          extras: currentExtras.includes(extra)
            ? currentExtras.filter((e) => e !== extra)
            : [...currentExtras, extra],
        });
      },
      reset: () =>
        set({
          hairType: null,
          coatCondition: null,
          service: null,
          extras: [],
        }),
    }),
    {
      name: "grooming-storage", // nombre de la key en localStorage
    }
  )
);
