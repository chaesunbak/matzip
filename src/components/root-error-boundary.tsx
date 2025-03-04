import { ErrorBoundary, FallbackProps } from "react-error-boundary";

import { Button } from "@/components/ui/button";

function ErrorFallback({ error }: FallbackProps) {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-destructive text-2xl font-bold">
          오류가 발생했습니다
        </h2>
        <p className="text-muted-foreground mt-2 text-sm">{error.message}</p>
        {import.meta.env.DEV && (
          <pre className="bg-muted mt-4 max-w-lg overflow-auto rounded-lg p-4 text-left text-sm">
            {error.stack}
          </pre>
        )}
        <Button className="mt-4" onClick={() => window.location.reload()}>
          새로고침
        </Button>
      </div>
    </div>
  );
}

export function RootErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>{children}</ErrorBoundary>
  );
}
