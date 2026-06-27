"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center space-y-6 text-center px-4 bg-background text-foreground">
          <div className="bg-destructive/10 p-4 rounded-full">
            <AlertCircle className="w-12 h-12 text-destructive" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">Critical Error!</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              A critical error occurred that could not be recovered from. Please try reloading the page.
            </p>
          </div>
          <Button onClick={() => reset()} variant="default">
            Try again
          </Button>
        </div>
      </body>
    </html>
  );
}
