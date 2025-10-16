// store/profile.store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CardData {
  label: string;
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

interface ProfileState {
  // Información personal
  email: string;
  phone: string;
  profileImage: string;
  name: string;

  // Dirección
  addressLabel: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };

  // Tarjeta
  cardData: CardData;

  // Actions
  setEmail: (email: string) => void;
  setPhone: (phone: string) => void;
  setProfileImage: (image: string) => void;
  setName: (name: string) => void;
  setAddress: (label: string, address: string) => void;
  setCoordinates: (lat: number, lng: number) => void;
  setCardData: (cardData: CardData) => void;
  updateCardData: (updates: Partial<CardData>) => void;
  clearProfile: () => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      // Estado inicial
      email: "josecorreo@hotmail.com",
      phone: "+51 999 989 943",
      profileImage: "",
      name: "José",

      addressLabel: "Casa",
      address: "Jr Paseo del Bosque 500",
      coordinates: {
        lat: -12.111575,
        lng: -77.0125695,
      },

      cardData: {
        label: "Tarjeta 1",
        cardNumber: "7809 0798 6506 5055",
        cardHolder: "Jose Mendoza",
        expiryDate: "21/25",
        cvv: "123",
      },

      // Actions
      setEmail: (email) => set({ email }),
      setPhone: (phone) => set({ phone }),
      setProfileImage: (profileImage) => set({ profileImage }),
      setName: (name) => set({ name }),
      setAddress: (addressLabel, address) => set({ addressLabel, address }),
      setCoordinates: (lat, lng) => set({ coordinates: { lat, lng } }),
      setCardData: (cardData) => set({ cardData }),
      updateCardData: (updates) =>
        set((state) => ({
          cardData: { ...state.cardData, ...updates },
        })),
      clearProfile: () =>
        set({
          email: "",
          phone: "",
          profileImage: "",
          name: "",
          addressLabel: "",
          address: "",
          coordinates: {
            lat: -12.111575,
            lng: -77.0125695,
          },
          cardData: {
            label: "",
            cardNumber: "",
            cardHolder: "",
            expiryDate: "",
            cvv: "",
          },
        }),
    }),
    {
      name: "profile-storage",
    }
  )
);
