import { useRouteError } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function ErrorPage() {
  const error = useRouteError();

  return (
    <div className="flex min-h-screen min-w-screen flex-col items-center justify-center p-6 text-center bg-white">
      <AlertTriangle className="text-red-500 mb-4" size={48} />
      <h1 className="text-3xl font-bold text-gray-900">¡Algo salió mal!</h1>
      <p className="mt-2 text-gray-600">No pudimos cargar esta sección."</p>
      <p className="mt-2 text-muted-foreground text-xs">
        {error instanceof Error && error.message}
      </p>

      <Button className="mt-6" onClick={() => location.reload()}>
        Reintentar
      </Button>
    </div>
  );
}
