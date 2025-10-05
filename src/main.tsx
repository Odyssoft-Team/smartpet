import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { InitializeApp } from "./app/InitializeApp.tsx";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "./shared/components/ErrorFallback.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error) => console.error(error)}
    >
      <InitializeApp />
    </ErrorBoundary>
  </StrictMode>
);
