import { create } from "zustand";
import { persist } from "zustand/middleware";

/* -------------------- Tipos -------------------- */
interface SelectedService {
  id?: number;
  service_name?: string;
  sub?: string;
  time?: number;
  type_service?: string;
}

interface ServiceState {
  selectedService: SelectedService | null;
  setSelectedService: (service: SelectedService) => void;
  clearService: () => void;
}

/* -------------------- Store persistente -------------------- */
export const useServiceStore = create<ServiceState>()(
  persist(
    (set) => ({
      selectedService: null,

      setSelectedService: (service) => set({ selectedService: service }),

      clearService: () => set({ selectedService: null }),
    }),
    {
      name: "service-store", // clave en localStorage
    }
  )
);
