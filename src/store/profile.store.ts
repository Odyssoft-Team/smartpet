import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ProfileState {
  label_address: string;
  address: string;
  setAddress: (label_address: string, address: string) => void;
  clearAddress: () => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      label_address: "",
      address: "",
      setAddress: (label_address: string, address: string) =>
        set({ label_address, address }),
      clearAddress: () => set({ label_address: "", address: "" }),
    }),
    {
      name: "address-storage",
    }
  )
);
