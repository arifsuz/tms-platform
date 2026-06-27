"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { completeTournamentAction } from "@/server/actions/tournament.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function CompleteTournamentButton({ tournamentId }: { tournamentId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      const res = await completeTournamentAction(tournamentId);
      if (res.success) {
        toast.success(res.message);
        router.refresh();
      } else {
        toast.error(res.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to complete tournament");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="default" size="sm" className="h-9 px-3 bg-emerald-600 hover:bg-emerald-700 text-white">
          <CheckCircle2 className="w-4 h-4 mr-2" />
          Complete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently close the tournament and mark it as COMPLETED.
            No more match scores can be updated.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleComplete} disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Yes, Complete Tournament
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
