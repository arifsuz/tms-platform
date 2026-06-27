"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { useState } from "react";
import { ReduxProvider } from "@/store/provider";

/**
 * Client-side providers wrapper.
 * Wraps the app with TanStack Query, Redux, and Sonner toast.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ReduxProvider>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            classNames: {
              toast: "bg-card text-card-foreground border-border",
              success: "!bg-accent/10 !text-accent !border-accent/20",
              error: "!bg-destructive/10 !text-destructive !border-destructive/20",
              info: "!bg-primary/10 !text-primary !border-primary/20",
            },
          }}
        />
      </ReduxProvider>
    </QueryClientProvider>
  );
}
