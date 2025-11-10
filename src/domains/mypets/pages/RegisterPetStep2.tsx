import { useNavigate } from "react-router-dom";
import PetFormLayout from "../components/PetFormLayout";
import SpeciesSelector from "../components/SpeciesSelector";
import { useRegisterPetStore } from "../store/registerPet.store";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import BREEDS from "../utils/breeds";

export default function RegisterPetStep2() {
  const { species, breed, setField, nextStep } = useRegisterPetStore();
  const navigate = useNavigate();

  const handleNext = () => {
    if (!species || !breed) return;
    nextStep();
    navigate("/register-pet/step3");
  };

  const handleBack = () => {
    navigate("/register-pet/step1");
  };

  const breeds = BREEDS;

  return (
    <PetFormLayout
      currentStep={2}
      totalSteps={5}
      onNext={handleNext}
      onBack={handleBack}
      nextDisabled={!species || !breed}
    >
      <div className="w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">¿Qué tipo de mascota tienes?</h1>
          <p className="text-gray-500">Selecciona la especie de tu mascota</p>
        </div>

        <SpeciesSelector
          selected={species}
          onSelect={(selected) => {
            setField("species", selected);
            setField("breed", "");
          }}
        />

        {species && (
          <div className="space-y-2">
            <p className="text-center font-medium">Selecciona la raza</p>
            <Select value={breed} onValueChange={(value) => setField("breed", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una raza" />
              </SelectTrigger>
              <SelectContent>
                {breeds.map((breed) => (
                  <SelectItem key={breed} value={breed}>
                    {breed}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </PetFormLayout>
  );
}