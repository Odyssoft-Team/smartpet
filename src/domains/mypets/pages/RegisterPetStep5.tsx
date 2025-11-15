import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PetFormLayout from "../components/PetFormLayout";
import { useRegisterPetStore } from "../store/registerPet.store";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function RegisterPetStep5() {
  const { allergies, setField, nextStep } = useRegisterPetStore();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleNext = () => {
    if (!allergies.trim()) {
      setError(
        "Por favor ingresa las alergias o marca la opción 'No especifico por ahora'"
      );
      return;
    }
    if (allergies.length > 50) {
      setError("El texto no puede tener más de 50 caracteres");
      return;
    }
    nextStep();
    navigate("/register-pet/step6");
  };

  const handleBack = () => {
    navigate("/register-pet/step4");
  };

  return (
    <PetFormLayout
      currentStep={5}
      totalSteps={7}
      onNext={handleNext}
      onBack={handleBack}
      nextDisabled={!allergies}
    >
      <div className="w-full space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">¿Tú mascota posee alergías?</h1>
          <p className="text-gray-500">
            Es importante tener esta información en consideración
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-4">
          <div className="relative w-full">
            <Input
              type="text"
              value={allergies}
              onChange={(e) => {
                setError("");
                setField("allergies", e.target.value);
              }}
              className="w-full"
              placeholder="pulgas, pollo, etc."
              disabled={allergies === "No especifico"}
            />
          </div>

          <div className="flex items-center gap-3">
            <Checkbox
              id="noAllergies"
              checked={allergies === "No especifico"}
              onCheckedChange={(checked) => {
                setError("");
                setField("allergies", checked ? "No especifico" : "");
              }}
            />
            <Label htmlFor="noAllergies">No especifico por ahora.</Label>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      </div>
    </PetFormLayout>
  );
}
