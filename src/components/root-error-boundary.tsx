import { ErrorBoundary, FallbackProps } from "react-error-boundary";

import { Button } from "@/components/ui/button";

function ErrorFallback({ error }: FallbackProps) {
  return (
    <div className="flex h-screen w-screen items-center justify-center p-4">
      <div className="max-w-md text-center">
        <h2 className="text-destructive text-xl font-bold sm:text-2xl">
          오류가 발생했습니다
        </h2>
        <p className="text-muted-foreground mt-2 text-xs sm:text-sm">
          {error.message}
        </p>
        {import.meta.env.DEV && (
          <pre className="bg-muted scrollbar-thin mt-4 max-h-[200px] overflow-auto rounded-lg p-4 text-left text-[10px] sm:max-h-[300px] sm:text-xs">
            {error.stack}
          </pre>
        )}
        <Button
          className="mt-4"
          size="sm"
          onClick={() => window.location.reload()}
        >
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
