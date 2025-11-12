import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ProfileData {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  avatar_url: string;
  label_address: string;
  address: string;
}

interface ProfileState {
  profile: ProfileData;
  setProfile: (data: Partial<ProfileData>) => void;
  clearProfile: () => void;
}
export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: {
        id: "",
        full_name: "",
        email: "",
        phone: "",
        avatar_url: "",
        label_address: "",
        address: "",
      },
      setProfile: (data) => {
        // console.log("🎯 setProfile llamado con:", data);
        set((state) => {
          const newProfile = { ...state.profile, ...data };
          // console.log("📝 Nuevo estado del profile:", newProfile);
          return { profile: newProfile };
        });
      },
      clearProfile: () => {
        // console.log("🧹 clearProfile llamado");
        set({
          profile: {
            id: "",
            full_name: "",
            email: "",
            phone: "",
            avatar_url: "",
            label_address: "",
            address: "",
          },
        });
      },
    }),
    {
      name: "profile-storage",
      onRehydrateStorage: () => {
        // console.log("🔄 Intentando rehidratar profile-storage...");
        return (state, error) => {
          if (error) {
            console.log("❌ Error rehidratando profile-storage:", error);
          } else {
            console.log("✅ Profile-storage rehidratado:", state);
          }
        };
      },
    }
  )
);
