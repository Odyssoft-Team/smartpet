import { create } from 'zustand';

interface RegisterPetStore {
  name: string;
  species: 'Perro' | 'Gato' | undefined;
  breed: string;
  weight: string;
  birthDate?: Date;
  ageInYears?: number;
  photoUrl: string;
  currentStep: number;
  setField: (field: string, value: any) => void;
  nextStep: () => void;
  previousStep: () => void;
  reset: () => void;
}

export const useRegisterPetStore = create<RegisterPetStore>((set) => ({
  name: '',
  species: undefined,
  breed: '',
  weight: '',
  birthDate: undefined,
  ageInYears: undefined,
  photoUrl: '',
  currentStep: 1,
  setField: (field, value) => set({ [field]: value }),
  nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
  previousStep: () => set((state) => ({ currentStep: state.currentStep - 1 })),
  reset: () => set({
    name: '',
    species: undefined,
    breed: '',
    weight: '',
    birthDate: undefined,
    ageInYears: undefined,
    photoUrl: '',
    currentStep: 1
  })
}));