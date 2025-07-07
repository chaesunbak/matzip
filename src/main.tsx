import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { NavermapsProvider } from "react-naver-maps";

import "./global.css";
import App from "./App.tsx";
import { Toaster } from "@/components/ui/sonner";
import { RootErrorBoundary } from "@/components/root-error-boundary";
import { MapProvider } from "@/contexts/map-context";
import { SidebarProvider } from "@/components/ui/sidebar";

const ncpKeyId = import.meta.env.VITE_NAVER_CLIENT_ID;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RootErrorBoundary>
      <NavermapsProvider ncpKeyId={ncpKeyId}>
        <SidebarProvider className="h-screen w-screen">
          <MapProvider>
            <App />
            <Toaster />
          </MapProvider>
        </SidebarProvider>
      </NavermapsProvider>
    </RootErrorBoundary>
  </StrictMode>,
);
