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
  price_service?: number; // precio de servicio base
  price_delta?: number; // precio de la variante del servicio
  price_add?: number; // precio de agregado (opcional)
};

export type ServiceVariant = {
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
  setVariant: (variant_id: number, price_delta: number) => void;
  setOptions: (options: ServiceOption[]) => void;
  setDate: (date: string) => void;
  setTime: (time: string) => void;
  setServicePrice: (price_service: number) => void;
  setVariantPrice: (price_delta: number) => void;
  setOptionsPrice: (options: ServiceOption[]) => void;
  reset: () => void;
};

// 🧮 Función auxiliar para recalcular total
const calculateTotal = (service?: Service) => {
  if (!service) return 0;
  const servicePrice = service.price_service ?? 0;
  const variantPrice = service.price_delta ?? 0;
  const optionsPrice = service.price_add ?? 0;
  return servicePrice + variantPrice + optionsPrice;
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
  setVariant: (id: number, price_delta: number) =>
    set((state) => ({
      selectedVariant: {
        ...state.selectedVariant,
        id,
        price_delta,
      } as ServiceVariant,
    })),
  setOptions: (options) => set({ selectedOptions: options }),
  setDate: (date) => set({ scheduledDate: date }),
  setTime: (time) => set({ scheduledTime: time }),
  setServicePrice: (price_service) =>
    set((state) => {
      const updated = {
        ...state.selectedService,
        price_service,
      } as Service;
      updated.total = calculateTotal(updated);
      return { selectedService: updated };
    }),

  setVariantPrice: (price_delta) =>
    set((state) => {
      const updated = {
        ...state.selectedService,
        price_delta,
      } as Service;
      updated.total = calculateTotal(updated);
      return { selectedService: updated };
    }),

  setOptionsPrice: (options) =>
    set((state) => {
      const totalOptions = options.reduce((sum, opt) => sum + opt.price, 0);
      const updated = {
        ...state.selectedService,
        price_add: totalOptions,
      } as Service;
      updated.total = calculateTotal(updated);
      return { selectedService: updated, selectedOptions: options };
    }),

  reset: () =>
    set({
      selectedService: null,
      selectedVariant: null,
      selectedOptions: [],
      scheduledDate: null,
      scheduledTime: null,
    }),
}));
