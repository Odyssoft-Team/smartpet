"use client";

import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth.store";
import { useNavigate } from "react-router-dom";

interface LoginResponse {
  success: boolean;
  message: string;
}

export function LoginForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const { setCurrentUser, setToken, saveUser } = useAuthStore();
  const navigate = useNavigate();

  const fakeLogin = async (
    email: string,
    password: string
  ): Promise<LoginResponse> => {
    // Simula un delay de red
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (email === "demo@gmail.com" && password === "123456") {
      return { success: true, message: "Inicio de sesión exitoso" };
    } else {
      return { success: false, message: "Correo o contraseña incorrectos" };
    }
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const response = await fakeLogin(email, password);
    if (response.success) {
      setCurrentUser(email);
      setToken("token_test");
      saveUser(email);
      toast.success("Inicio de sesión exitoso", {
        description: "Bienvenido a Smart Pet",
        position: "top-right",
        duration: 5000,
      });
      navigate("/");
    } else {
      setError(response.message);
      toast.error("Inicio de sesión fallido", {
        description: "Correo o contraseña incorrectos",
        position: "top-right",
        duration: 5000,
      });
    }

    setLoading(false);
  };

  return (
    <div className={cn("flex flex-col gap-6")}>
      <form onSubmit={handleLogin}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-5xl font-bold">Bienvenido a Smart Pet</h1>
            <FieldDescription>
              ¿No tienes una cuenta? <a href="#">Regístrate</a>
            </FieldDescription>
          </div>

          <Field className="flex flex-col gap-1">
            <FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="tucorreo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Field>

          <Field className="flex flex-col gap-1">
            <FieldLabel htmlFor="password">Contraseña</FieldLabel>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Field>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <Field>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin" />
                  Iniciando sesión
                </span>
              ) : (
                <span className="flex items-center gap-2">Iniciar sesión</span>
              )}
            </Button>
          </Field>

          <FieldSeparator>O</FieldSeparator>

          <Field className="grid gap-2 sm:grid-cols-3">
            <Button variant="outline" type="button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
              >
                <path
                  fill="#4285F4"
                  d="M23.64 12.204c0-.774-.069-1.518-.198-2.24H12v4.24h6.844c-.296 1.6-1.197 2.96-2.554 3.872v3.216h4.126c2.414-2.22 3.784-5.496 3.784-9.088z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.956-1.07 7.94-2.906l-4.126-3.216c-1.15.772-2.62 1.234-3.814 1.234-2.932 0-5.418-1.974-6.298-4.632H1.39v2.91C3.35 21.65 7.36 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.702 14.48A7.993 7.993 0 0 1 4.8 12c0-.83.14-1.63.402-2.38V6.71H1.39A11.99 11.99 0 0 0 0 12c0 1.94.47 3.76 1.39 5.29l4.312-2.81z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.76c1.754 0 3.34.602 4.588 1.78l3.462-3.462C17.946 1.29 15.24 0 12 0 7.36 0 3.35 2.35 1.39 5.71l4.312 2.91C6.582 6.734 9.068 4.76 12 4.76z"
                />
                <path fill="none" d="M0 0h24v24H0z" />
              </svg>
              Continuar con Google
            </Button>

            <Button variant="outline" type="button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 40 40"
                width="24"
                height="24"
              >
                <linearGradient
                  id="a"
                  x1="-277.375"
                  x2="-277.375"
                  y1="406.6018"
                  y2="407.5726"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0" stop-color="#0062e0" />
                  <stop offset="1" stop-color="#19afff" />
                </linearGradient>
                <path
                  fill="url(#a)"
                  d="M16.7 39.8C7.2 38.1 0 29.9 0 20 0 9 9 0 20 0s20 9 20 20c0 9.9-7.2 18.1-16.7 19.8l-1.1-.9h-4.4l-1.1.9z"
                />
                <path
                  fill="#fff"
                  d="m27.8 25.6.9-5.6h-5.3v-3.9c0-1.6.6-2.8 3-2.8H29V8.2c-1.4-.2-3-.4-4.4-.4-4.6 0-7.8 2.8-7.8 7.8V20h-5v5.6h5v14.1c1.1.2 2.2.3 3.3.3 1.1 0 2.2-.1 3.3-.3V25.6h4.4z"
                />
              </svg>
              Continuar con Facebook
            </Button>

            <Button variant="outline" type="button">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                  fill="currentColor"
                />
              </svg>
              Continuar con Apple
            </Button>
          </Field>
        </FieldGroup>
      </form>

      <FieldDescription className="px-6 text-center">
        Al continuar, aceptas nuestros <a href="#">Términos de servicio</a> y{" "}
        <a href="#">Política de privacidad</a>.
      </FieldDescription>
    </div>
  );
}
