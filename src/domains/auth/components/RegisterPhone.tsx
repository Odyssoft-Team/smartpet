import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ArrowRightIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRegisterStore } from "@/store/register.store";
import { useState } from "react";

export function RegisterPhone() {
  const navigate = useNavigate();
  const { phone, setPhone, isStepComplete } = useRegisterStore();
  const [error, setError] = useState<string>("");

  const handleNext = () => {
    // Validación básica: que no esté vacío y tenga 9 dígitos
    const phoneRegex = /^[0-9]{9}$/;
    if (!isStepComplete("phone") || !phoneRegex.test(phone)) {
      setError("Ingresa un número válido de 9 dígitos");
      return;
    }

    setError("");
    navigate("/auth/register/sms");
  };

  const handleBack = () => {
    navigate("/auth/register/name");
  };

  return (
    <div className={cn("flex flex-col gap-6")}>
      <div>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <h2 className="font-medium text-base text-muted-foreground">
              Creando tu cuenta
            </h2>
            <p className="font-medium text-3xl">
              ¿Cúal es tu número telefónico?
            </p>
          </div>
          <Field className="flex flex-col gap-1">
            <Input
              id="phone"
              type="tel"
              inputMode="numeric"
              maxLength={9}
              placeholder="Tu número telefónico"
              value={phone}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setPhone(value);
              }}
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
              className="flex items-center gap-1"
              onClick={handleBack}
            >
              Atrás
            </Button>
          </Field>
        </FieldGroup>
      </div>
    </div>
  );
}
