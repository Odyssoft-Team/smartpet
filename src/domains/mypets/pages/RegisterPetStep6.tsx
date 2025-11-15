import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PetFormLayout from "../components/PetFormLayout";
import { useRegisterPetStore } from "../store/registerPet.store";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function RegisterPetStep6() {
  const { special_condition, setField, nextStep } = useRegisterPetStore();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleNext = () => {
    if (!special_condition.trim()) {
      setError(
        "Por favor ingresa una condición especial o marca la opción 'No presenta una condición'."
      );

      return;
    }
    if (special_condition.length > 50) {
      setError("El texto no puede tener más de 50 caracteres");
      return;
    }

    nextStep();
    navigate("/register-pet/step7");
  };

  const handleBack = () => {
    navigate("/register-pet/step5");
  };

  return (
    <PetFormLayout
      currentStep={6}
      totalSteps={7}
      onNext={handleNext}
      onBack={handleBack}
      nextDisabled={!special_condition}
    >
      <div className="w-full space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">
            ¿Tú mascota posee alguna condición especial?
          </h1>
          <p className="text-gray-500">
            Es importante tener esta información en consideración
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-4">
          <div className="relative w-full">
            <Input
              type="text"
              value={special_condition}
              onChange={(e) => {
                setError("");
                setField("special_condition", e.target.value);
              }}
              className=""
              placeholder="Displacia en cadera, etc.."
              disabled={special_condition === "No presenta una condición"}
            />
          </div>

          <div className="flex items-center gap-3">
            <Checkbox
              id="Nospecial_condition"
              checked={special_condition === "No presenta una condición"}
              onCheckedChange={(checked) => {
                setError("");
                setField(
                  "special_condition",
                  checked ? "No presenta una condición" : ""
                );
              }}
            />
            <Label htmlFor="Nospecial_condition">
              No presenta ninguna condición especial.
            </Label>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      </div>
    </PetFormLayout>
  );
}
