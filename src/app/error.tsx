"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-6 text-center px-4">
      <div className="bg-destructive/10 p-4 rounded-full">
        <AlertCircle className="w-12 h-12 text-destructive" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Something went wrong!</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          We encountered an unexpected error while processing your request. Please try again.
        </p>
      </div>
      <Button onClick={() => reset()} variant="default">
        Try again
      </Button>
    </div>
  );
}
