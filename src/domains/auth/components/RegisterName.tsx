import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ArrowRightIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRegisterStore } from "@/store/register.store";
import { useState } from "react";

export function RegisterName() {
  const navigate = useNavigate();
  const { name, setName, isStepComplete } = useRegisterStore();
  const [error, setError] = useState<string>("");

  const handleNext = () => {
    if (!isStepComplete("name")) {
      setError("Por favor ingresa tu nombre completo");
      return;
    }
    setError("");
    navigate("/auth/register/phone");
  };

  const handleBack = () => {
    navigate("/auth/register");
  };

  return (
    <div className={cn("flex flex-col gap-6")}>
      <div>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <h2 className="font-medium text-base text-muted-foreground">
              Creando tu cuenta
            </h2>
            <p className="font-medium text-3xl">¿Cómo te llamas?</p>
          </div>
          <Field className="flex flex-col gap-1">
            <Input
              id="name"
              type="text"
              placeholder="Tu nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {error && (
              <span className="text-red-500 text-sm mt-1">{error}</span>
            )}
          </Field>
          <Field>
            <Button onClick={handleNext}>
              Continuar{" "}
              <ArrowRightIcon
                className="-me-1 transition-transform group-hover:translate-x-0.5"
                size={16}
                aria-hidden="true"
              />
            </Button>

            <Button
              variant="outline"
              type="button"
              onClick={handleBack}
              className="flex items-center gap-1"
            >
              Atrás
            </Button>
          </Field>
        </FieldGroup>
      </div>
    </div>
  );
}
