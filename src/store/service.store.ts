import { create } from "zustand";

interface AdditionalService {
  name?: string;
  price?: string;
}

interface ServiceState {
  selectedService: {
    service_name?: string;
    sub?: string;
    time?: string;
    type_service?: string;
    price?: string;
    additional_services?: AdditionalService[];
  } | null;
  setSelectedService: (
    service: Partial<ServiceState["selectedService"]>
  ) => void;
  toggleAdditionalService: (service: AdditionalService) => void;
}

export const useServiceStore = create<ServiceState>((set) => ({
  selectedService: null,

  setSelectedService: (service) =>
    set((state) => ({
      selectedService: {
        ...state.selectedService,
        ...service,
        // Si aún no existe el array de adicionales, lo inicializamos vacío
        additional_services: state.selectedService?.additional_services ?? [],
      },
    })),

  toggleAdditionalService: (service) =>
    set((state) => {
      if (!state.selectedService)
        return {
          selectedService: {
            additional_services: [service],
          },
        };

      const additional_services =
        state.selectedService.additional_services ?? [];

      const exists = additional_services.some((s) => s.name === service.name);

      const updatedServices = exists
        ? additional_services.filter((s) => s.name !== service.name)
        : [...additional_services, service];

      return {
        selectedService: {
          ...state.selectedService,
          additional_services: updatedServices,
        },
      };
    }),
}));
