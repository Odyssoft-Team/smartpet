import type { FallbackProps } from "react-error-boundary";

export function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="p-6 text-center text-red-600">
      <h2 className="text-xl font-semibold">Algo salió mal 😢</h2>
      <p className="mt-2 text-sm">{error.message}</p>
      <button
        onClick={resetErrorBoundary}
        className="mt-4 rounded bg-red-500 px-4 py-2 text-white"
      >
        Reintentar
      </button>
    </div>
  );
}
