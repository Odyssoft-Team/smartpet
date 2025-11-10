import { useNavigate } from "react-router-dom";
import PetFormLayout from "../components/PetFormLayout";
import { useRegisterPetStore } from "../store/registerPet.store";
import { AvatarUploader } from "../../profile/components/AvatarUploader";
import pet_default from "@/assets/pets/pet-default.jpg";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { uploadPetPhoto } from "../services/uploadPetPhoto";
import { addPet } from "../services/addPet";

export default function RegisterPetStep5() {
  const store = useRegisterPetStore();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/register-pet/step4");
  };

  const handleUploadAvatar = async (file: File) => {
    const url = await uploadPetPhoto(file, store.name);
    return url;
  };

  const handleFinish = async () => {
    try {
      // Calcular birth_date a partir de birthDate o ageInYears
      let birth_date: string | undefined;
      if (store.birthDate) {
        birth_date = store.birthDate.toISOString().split("T")[0];
      } else if (store.ageInYears !== undefined) {
        const now = new Date();
        const birthYear = now.getFullYear() - store.ageInYears;
        birth_date = `${birthYear}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
      }

      const petData = {
        name: store.name,
        species_id: store.species_id,
        breed_id: store.breed_id,
        weight: store.weight ? parseFloat(store.weight) : null,
        birth_date: birth_date || null,
        photo_url: store.photoUrl,
      };

      const newPet = await addPet(petData);

      if (newPet) {
        toast.success("¡Mascota registrada con éxito! 🐾");
        store.reset();
        navigate("/mypets");
      }
    } catch (error) {
      console.error("Error registrando mascota:", error);
      toast.error("No se pudo registrar la mascota");
    }
  };

  return (
    <PetFormLayout
      currentStep={5}
      totalSteps={5}
      onBack={handleBack}
      showNextButton={false}
    >
      <div className="w-full space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Foto de tu mascota</h1>
          <p className="text-gray-500">
            Añade una foto para identificar mejor a tu mascota
          </p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <AvatarUploader
            defaultImage={pet_default}
            avatarUrl={store.photoUrl}
            onAvatarChange={(url) => store.setField("photoUrl", url)}
            uploadFn={handleUploadAvatar}
          />

          <Button
            onClick={handleFinish}
            className="w-full max-w-[200px] bg-black text-white"
          >
            Finalizar registro
          </Button>
        </div>
      </div>
    </PetFormLayout>
  );
}
