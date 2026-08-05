import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "@/lib/auth/provider";
import { CreatedWithGrokBanner } from "@/components/created-with-grok-banner";
import { DashboardApp } from "@/components/dashboard/dashboard-app";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CreatedWithGrokBanner />
    <AuthProvider>
      <DashboardApp />
    </AuthProvider>
  </StrictMode>,
);
