import { useNavigate } from "react-router-dom";
import PetFormLayout from "../components/PetFormLayout";
import { useRegisterPetStore } from "../store/registerPet.store";
import AgeSelector from "../components/AgeSelector";

export default function RegisterPetStep4() {
  const { birthDate, ageInYears, setField, nextStep } = useRegisterPetStore();
  const navigate = useNavigate();

  const handleNext = () => {
    if (!birthDate && !ageInYears) return;
    nextStep();
    navigate("/register-pet/step5");
  };

  const handleBack = () => {
    navigate("/register-pet/step3");
  };

  const handleSelectDate = (date?: Date) => {
    setField("birthDate", date);
    setField("ageInYears", undefined);
  };

  const handleSelectAge = (years: number) => {
    setField("ageInYears", years);
  };

  const handleSelectUnknown = () => {
    setField("birthDate", undefined);
    setField("ageInYears", undefined);
  };

  return (
    <PetFormLayout
      currentStep={4}
      totalSteps={7}
      onNext={handleNext}
      onBack={handleBack}
      nextDisabled={false}
    >
      <div className="w-full space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">¿Qué edad tiene tu mascota?</h1>
          <p className="text-gray-500">
            Puedes ingresar la fecha de nacimiento o una edad aproximada
          </p>
        </div>

        <AgeSelector
          selectedDate={birthDate}
          onSelectDate={handleSelectDate}
          onSelectAge={handleSelectAge}
          onSelectUnknown={handleSelectUnknown}
        />
      </div>
    </PetFormLayout>
  );
}
