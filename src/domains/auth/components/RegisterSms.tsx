import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { ArrowRightIcon, LoaderIcon } from "lucide-react";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegisterStore } from "@/store/register.store";
import { useAuthStore } from "@/store/auth.store";

export function RegisterSms() {
  const { email, clearFields } = useRegisterStore();
  const { setCurrentUser, setToken, saveUser } = useAuthStore();
  const [code, setCode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleValidate = async () => {
    if (code.length !== 5) {
      setError("El código debe tener 5 dígitos");
      return;
    }

    setLoading(true);
    setError("");

    // Simula llamada API de validación
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setLoading(false);

    if (code === "12345") {
      setCurrentUser(email);
      setToken("token_test");
      saveUser(email);
      clearFields();
      navigate("/"); // o donde desees redirigir al finalizar el registro
    } else {
      setError("Código incorrecto, inténtalo nuevamente");
    }
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
              Inserte el código de verificación enviado a su SMS
            </p>
          </div>
          <Field className="flex flex-col gap-1 w-full">
            <InputOTP
              maxLength={5}
              pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
              className="w-full"
              value={code}
              onChange={(value) => {
                setCode(value.toUpperCase());
                setError("");
              }}
            >
              <InputOTPGroup className="w-full flex items-center justify-center gap-2">
                <InputOTPSlot
                  index={0}
                  className="border-[2px] rounded-md size-15 text-xl font-medium"
                />
                <InputOTPSlot
                  index={1}
                  className="border-[2px] rounded-md size-15 text-xl font-medium"
                />
                <InputOTPSlot
                  index={2}
                  className="border-[2px] rounded-md size-15 text-xl font-medium"
                />
                <InputOTPSlot
                  index={3}
                  className="border-[2px] rounded-md size-15 text-xl font-medium"
                />
                <InputOTPSlot
                  index={4}
                  className="border-[2px] rounded-md size-15 text-xl font-medium"
                />
              </InputOTPGroup>
            </InputOTP>
            {error && (
              <span className="text-red-500 text-sm mt-1">{error}</span>
            )}
          </Field>
          <Field>
            <Button
              onClick={handleValidate}
              disabled={loading}
              className="flex items-center gap-2 min-w-[140px] !bg-black"
            >
              {loading ? (
                <>
                  <LoaderIcon className="animate-spin" size={16} />
                  Validando...
                </>
              ) : (
                <>
                  Validar
                  <ArrowRightIcon
                    className="-me-1 transition-transform group-hover:translate-x-0.5"
                    size={16}
                    aria-hidden="true"
                  />
                </>
              )}
            </Button>
          </Field>
        </FieldGroup>
      </div>
    </div>
  );
}
