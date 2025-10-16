import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useRegisterStore } from "@/store/register.store";
import { useNavigate } from "react-router-dom";
import { registerWithEmail } from "@/services/auth";

export function RegisterEmailVerification() {
  const { email, password, name, phone, clearFields } = useRegisterStore();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    setLoading(true);
    setError("");

    try {
      // por ahora puedes usar una contraseña fija o un campo adicional
      await registerWithEmail({
        email,
        password, // luego esto puede ser paso previo o campo real
        name,
        phone,
      });

      setSent(true);
      clearFields();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error al registrar usuario");
      }
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center text-center gap-4">
        <h2 className="text-2xl font-semibold">Verifica tu correo</h2>
        <p className="text-muted-foreground">
          Hemos enviado un enlace de confirmación
          <span className="font-medium">{email}</span>. Ábrelo para activar tu
          cuenta.
        </p>
        <Button onClick={() => navigate("/auth/login")}>Ir al login</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 items-center">
      <FieldGroup className="w-full max-w-md text-center">
        <h2 className="text-2xl font-semibold mb-2">Creando tu cuenta</h2>
        <p className="text-muted-foreground mb-4">
          Te enviaremos un enlace de verificación a tu correo.
        </p>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <Button
          onClick={handleRegister}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={16} />
              Enviando...
            </>
          ) : (
            "Enviar enlace de verificación"
          )}
        </Button>
      </FieldGroup>
    </div>
  );
}
