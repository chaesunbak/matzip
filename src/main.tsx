import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { NavermapsProvider } from "react-naver-maps";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router";

import "./global.css";
import App from "./App.tsx";
import { Toaster } from "@/components/ui/sonner";
import { RootErrorBoundary } from "@/components/root-error-boundary";

const ncpClientId = import.meta.env.VITE_NAVER_CLIENT_ID;

// React Query 클라이언트 생성
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // 윈도우 포커스 시 자동 리페치 비활성화
      retry: 1, // 기본 재시도 횟수
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <RootErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <NavermapsProvider ncpClientId={ncpClientId}>
            <Routes>
              <Route path="/" element={<App />} />
            </Routes>
            <Toaster richColors />
          </NavermapsProvider>
        </QueryClientProvider>
      </RootErrorBoundary>
    </BrowserRouter>
  </StrictMode>,
);
