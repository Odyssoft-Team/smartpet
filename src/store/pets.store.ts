import type { Pet } from "@/domains/mypets/utils/Pet";
import { create } from "zustand";

interface PetStore {
  listPets: Pet[];
  setListPets: (pets: Pet[]) => void;
  clearPets: () => void;

  // 🆕 Estado de mascota seleccionada
  selectedPet: Pet | null;
  setSelectedPet: (pet: Pet) => void;
  clearSelectedPet: () => void;
}

export const usePetStore = create<PetStore>((set) => ({
  listPets: [],
  setListPets: (pets) => set({ listPets: pets }),
  clearPets: () => set({ listPets: [] }),

  selectedPet: null,
  setSelectedPet: (pet) => set({ selectedPet: pet }),
  clearSelectedPet: () => set({ selectedPet: null }),
}));
