import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { InitializeApp } from "./app/App.tsx";
import { ErrorBoundary } from "./shared/components/ErrorBoundary.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <InitializeApp />
    </ErrorBoundary>
  </StrictMode>
);
