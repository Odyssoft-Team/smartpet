import type { Pet } from "@/domains/mypets/services/getPetsByUser";
import { create } from "zustand";

interface PetStore {
  selectedPet: Pet | null;
  setSelectedPet: (pet: Pet) => void;
  clearSelectedPet: () => void;
}

export const usePetStore = create<PetStore>((set) => ({
  selectedPet: null,
  setSelectedPet: (pet) => set({ selectedPet: pet }),
  clearSelectedPet: () => set({ selectedPet: null }),
}));
