"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { updateMatchScoreAction } from "@/server/actions/match.actions";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface UpdateScoreModalProps {
  matchId: string;
  homeName: string;
  awayName: string;
}

export function UpdateScoreModal({
  matchId,
  homeName,
  awayName,
}: UpdateScoreModalProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [homeScore, setHomeScore] = useState<string>("");
  const [awayScore, setAwayScore] = useState<string>("");
  const router = useRouter();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!homeScore || !awayScore) {
      toast.error("Please enter both scores");
      return;
    }

    const home = parseFloat(homeScore);
    const away = parseFloat(awayScore);

    if (isNaN(home) || isNaN(away)) {
      toast.error("Scores must be valid numbers");
      return;
    }

    setIsLoading(true);

    try {
      const res = await updateMatchScoreAction(matchId, {
        homeScore: home,
        awayScore: away,
      });

      if (res.success) {
        toast.success(res.message);
        setOpen(false);
        router.refresh(); // Refresh to fetch new bracket state
      } else {
        toast.error(res.message || "Failed to update score");
      }
    } catch (error: any) {
      toast.error(error.message || "System error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Update Score
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleUpdate}>
          <DialogHeader>
            <DialogTitle>Update Match Score</DialogTitle>
            <DialogDescription>
              Enter the final score for this match. This will mark the match as completed.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col items-center gap-2 flex-1">
                <Label htmlFor="homeScore" className="font-semibold text-center h-10 line-clamp-2 flex items-end">
                  {homeName}
                </Label>
                <Input
                  id="homeScore"
                  type="number"
                  min="0"
                  step="0.5"
                  value={homeScore}
                  onChange={(e) => setHomeScore(e.target.value)}
                  className="text-center text-2xl h-14"
                  placeholder="0"
                  required
                />
              </div>

              <div className="text-xl font-bold text-muted-foreground pt-10">VS</div>

              <div className="flex flex-col items-center gap-2 flex-1">
                <Label htmlFor="awayScore" className="font-semibold text-center h-10 line-clamp-2 flex items-end">
                  {awayName}
                </Label>
                <Input
                  id="awayScore"
                  type="number"
                  min="0"
                  step="0.5"
                  value={awayScore}
                  onChange={(e) => setAwayScore(e.target.value)}
                  className="text-center text-2xl h-14"
                  placeholder="0"
                  required
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Score
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
