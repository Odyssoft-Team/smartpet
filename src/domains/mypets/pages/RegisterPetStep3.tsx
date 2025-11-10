import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PetFormLayout from "../components/PetFormLayout";
import { useRegisterPetStore } from "../store/registerPet.store";
import { Input } from "@/components/ui/input";

export default function RegisterPetStep3() {
  const { weight, setField, nextStep } = useRegisterPetStore();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleNext = () => {
    if (!weight) {
      setError("Por favor ingresa el peso");
      return;
    }
    const weightNum = parseFloat(weight);
    if (isNaN(weightNum) || weightNum <= 0 || weightNum > 99) {
      setError("El peso debe ser un número entre 1 y 99");
      return;
    }
    nextStep();
    navigate("/register-pet/step4");
  };

  const handleBack = () => {
    navigate("/register-pet/step2");
  };

  const handleWeightChange = (value: string) => {
    const cleaned = value.replace(/[^0-9]/g, "");
    if (cleaned.length <= 2) {
      setError("");
      setField("weight", cleaned);
    }
  };

  return (
    <PetFormLayout
      currentStep={3}
      totalSteps={5}
      onNext={handleNext}
      onBack={handleBack}
      nextDisabled={!weight}
    >
      <div className="w-full space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">¿Cuánto pesa tu mascota?</h1>
          <p className="text-gray-500">Ingresa el peso en kilogramos</p>
        </div>

        <div className="flex justify-center items-center gap-2">
          <div className="relative w-32">
            <Input
              type="text"
              value={weight}
              onChange={(e) => handleWeightChange(e.target.value)}
              className="text-center text-2xl pr-12"
              placeholder="00"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              Kg
            </span>
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}
      </div>
    </PetFormLayout>
  );
}