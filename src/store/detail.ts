import { create } from "zustand";

type Service = {
  id: number;
  user_id: string;
  pet_id: number;
  variant_id: number;
  scheduled_date: string;
  scheduled_time: string;
  status: "in_progress" | "completed" | "cancelled";
  payment_status: "paid" | "unpaid";
  total: number;
};

type ServiceVariant = {
  id: number;
  service_id: number;
  name: string;
  price_delta: number;
};

type ServiceOption = {
  id: number;
  service_id: number;
  name: string;
  price: number;
};

type detailStore = {
  selectedService: Service | null;
  selectedVariant: ServiceVariant | null;
  selectedOptions: ServiceOption[];
  scheduledDate: string | null;
  scheduledTime: string | null;
  setPetAndUser: (user_id: string, pet_id: number) => void;
  setService: (service: Service) => void;
  setVariant: (variant: ServiceVariant) => void;
  setOptions: (options: ServiceOption[]) => void;
  setDate: (date: string) => void;
  setTime: (time: string) => void;
  reset: () => void;
};

export const useDetailStore = create<detailStore>((set) => ({
  selectedService: null,
  selectedVariant: null,
  selectedOptions: [],
  scheduledDate: null,
  scheduledTime: null,
  setPetAndUser: (user_id: string, pet_id: number) =>
    set((state) => ({
      selectedService: {
        ...state.selectedService,
        user_id,
        pet_id,
      } as Service,
    })),
  setService: (service) => set({ selectedService: service }),
  setVariant: (variant) => set({ selectedVariant: variant }),
  setOptions: (options) => set({ selectedOptions: options }),
  setDate: (date) => set({ scheduledDate: date }),
  setTime: (time) => set({ scheduledTime: time }),
  reset: () =>
    set({
      selectedService: null,
      selectedVariant: null,
      selectedOptions: [],
      scheduledDate: null,
      scheduledTime: null,
    }),
}));
