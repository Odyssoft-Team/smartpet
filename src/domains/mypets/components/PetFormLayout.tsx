import { Button } from "@/components/ui/button";
import { IoIosArrowBack } from "react-icons/io";
//import { Link } from "react-router-dom";

interface PetFormLayoutProps {
  children: React.ReactNode;
  onNext?: () => void;
  onBack?: () => void;
  showBackButton?: boolean;
  showNextButton?: boolean;
  nextDisabled?: boolean;
  currentStep: number;
  totalSteps: number;
}

export default function PetFormLayout({
  children,
  onNext,
  onBack,
  showBackButton = true,
  showNextButton = true,
  nextDisabled = false,
  currentStep,
  totalSteps,
}: PetFormLayoutProps) {
  return (
    <div className="flex flex-col items-center justify-start bg-white h-fit min-h-screen">
      <div className="bg-cyan-500 fixed top-0 left-0 right-0 px-4 py-3 z-50 justify-between flex items-center">
        <Button
          size="back"
          variant="back"
          className="w-auto h-auto text-icon hover:text-icon cursor-pointer gap-3"
        >
          {/* <IoIosArrowBack className="size-6 text-white" /> */}
          <span className="-ml-2 text-white">Registro de mascota</span>
        </Button>
        <span className=""> </span>
      </div>
      <div className="w-full flex justify-start mt-18 mb-4">
        {showBackButton && (
          <Button
            type="button"
            onClick={onBack}
            size="back"
            variant="back"
            className="w-auto h-auto py-2 text-icon hover:text-icon cursor-pointer"
          >
            <IoIosArrowBack className="size-6" />
            <span className="-ml-2 text-lg">Atrás</span>
          </Button>
        )}
      </div>

      <div className="w-full max-w-md rounded-xl p-4 flex flex-col items-center gap-y-6">
        {/* Progress indicator */}
        <div className="w-full flex justify-between px-4 mb-4">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              className={`h-2 flex-1 mx-1 rounded-full ${
                i + 1 <= currentStep ? "bg-blue-500" : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        {children}

        {showNextButton && (
          <Button
            onClick={onNext}
            disabled={nextDisabled}
            className="w-full bg-cyan-500 text-white h-11"
          >
            Continuar
          </Button>
        )}
      </div>
    </div>
  );
}
