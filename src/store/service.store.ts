import { create } from "zustand";

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

export const useServiceStore = create<ServiceState>((set) => ({
  selectedService: null,

  setSelectedService: (service) => set({ selectedService: service }),

  clearService: () => set({ selectedService: null }),
}));
