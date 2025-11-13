import type { AdditionalServices } from "@/domains/services/services/getAdditionalServices";
import { create } from "zustand";
import { persist } from "zustand/middleware";

/* -------------------- Tipos -------------------- */
type Service = {
  id: number;
  user_id: string;
  pet_id: number;
  pet_name?: string;
  variant_id: number;
  scheduled_date: string;
  scheduled_time: string;
  status: "in_progress" | "completed" | "cancelled";
  payment_status: "paid" | "unpaid";
  total: number;
  price_service?: number;
  price_delta?: number;
  price_add?: number;
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

/* -------------------- Tipado del store -------------------- */
type detailStore = {
  selectedService: Service | null;
  selectedVariant: ServiceVariant | null;
  selectedOptions: ServiceOption[];
  scheduledDate: string | null;
  scheduledTime: string | null;

  listAdditionalServices: AdditionalServices[];
  totalAdditionalServices: number;
  toggleAdditionalService: (service: AdditionalServices) => void;

  selectedDateService: Date | undefined;
  setSelectedDateService: (date: Date | undefined) => void;

  setPetAndUser: (user_id: string, pet_id: number, pet_name?: string) => void;
  setService: (service: Service) => void;
  setVariant: (variant_id: number, price_delta: number, name: string) => void;
  setOptions: (options: ServiceOption[]) => void;
  setDate: (date: string) => void;
  setTime: (time: string) => void;
  setServicePrice: (price_service: number) => void;
  setOptionsPrice: (options: ServiceOption[]) => void;
  reset: () => void;
};

/* -------------------- Función auxiliar -------------------- */
const calculateTotal = (service?: Service) => {
  if (!service) return 0;
  // const servicePrice = service.price_service ?? 0;
  const variantPrice = service.price_delta ?? 0;
  const optionsPrice = service.price_add ?? 0;
  // return servicePrice + variantPrice + optionsPrice;
  return variantPrice + optionsPrice;
};

/* -------------------- Store persistente -------------------- */
export const useDetailStore = create<detailStore>()(
  persist(
    (set, get) => ({
      selectedService: null,
      selectedVariant: null,
      selectedOptions: [],
      scheduledDate: null,
      scheduledTime: null,

      listAdditionalServices: [],
      totalAdditionalServices: 0,
      toggleAdditionalService: (service) => {
        const { listAdditionalServices } = get();
        const exists = listAdditionalServices.some((s) => s.id === service.id);

        let newSelected;
        if (exists) {
          // 🔹 Si ya está seleccionado → quitarlo
          newSelected = listAdditionalServices.filter(
            (s) => s.id !== service.id
          );
        } else {
          // 🔹 Si no está → agregarlo
          newSelected = [...listAdditionalServices, service];
        }

        // 🔹 Calcular nuevo total
        const newTotal = newSelected.reduce((sum, s) => sum + s.price, 0);

        set({
          listAdditionalServices: newSelected,
          totalAdditionalServices: newTotal,
        });
      },

      selectedDateService: undefined,
      setSelectedDateService: (date) => set({ selectedDateService: date }),

      setPetAndUser: (user_id: string, pet_id: number, pet_name?: string) =>
        set((state) => ({
          selectedService: {
            ...state.selectedService,
            user_id,
            pet_id,
            pet_name,
          } as Service,
        })),

      setService: (service) => set({ selectedService: service }),

      setVariant: (id: number, price_delta: number, name: string) =>
        set((state) => {
          const updated = {
            ...state.selectedService,
            price_delta,
          } as Service;
          updated.total = calculateTotal(updated);

          return {
            selectedService: updated,
            selectedVariant: { id, price_delta, name } as ServiceVariant,
          };
        }),

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
        // set({
        //   selectedService: null,
        //   selectedVariant: null,
        //   selectedOptions: [],
        //   scheduledDate: null,
        //   scheduledTime: null,
        // }),
        set({
          selectedService: null,
          selectedVariant: null,
          selectedOptions: [],
          scheduledDate: null,
          scheduledTime: null,

          // 🔥 LO QUE FALTABA
          listAdditionalServices: [],
          totalAdditionalServices: 0,
          selectedDateService: undefined,
        }),
    }),
    {
      name: "detail-store", // clave en localStorage
    }
  )
);
