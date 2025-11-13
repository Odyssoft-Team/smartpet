import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import PetFormLayout from "../components/PetFormLayout";
import { useRegisterPetStore } from "../store/registerPet.store";

export default function RegisterPetStep1() {
  const { name, setField, nextStep } = useRegisterPetStore();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleNext = () => {
    if (!name.trim()) {
      setError("Por favor ingresa un nombre");
      return;
    }
    if (name.length > 15) {
      setError("El nombre no puede tener más de 15 caracteres");
      return;
    }
    nextStep();
    navigate("/register-pet/step2");
  };

  return (
    <PetFormLayout
      currentStep={1}
      totalSteps={7}
      onNext={handleNext}
      showBackButton={false}
      nextDisabled={!name.trim()}
    >
      <div className="w-full space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">¿Cómo se llama tu mascota?</h1>
          <p className="text-gray-500">
            Este será el nombre que usaremos para referirnos a tu mascota
          </p>
        </div>

        <div className="space-y-2">
          <Input
            placeholder="Nombre de tu mascota"
            value={name}
            onChange={(e) => {
              setError("");
              setField("name", e.target.value);
            }}
            maxLength={15}
            className="text-center text-lg"
          />
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <p className="text-gray-400 text-sm text-center">
            {name.length}/15 caracteres
          </p>
        </div>
      </div>
    </PetFormLayout>
  );
}
