"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { generateBracketAction } from "@/server/actions/tournament.actions";
import { useRouter } from "next/navigation";
import { Loader2, Play } from "lucide-react";

interface GenerateBracketButtonProps {
  tournamentId: string;
  tournamentSlug: string;
  participantCount: number;
}

export function GenerateBracketButton({
  tournamentId,
  tournamentSlug,
  participantCount,
}: GenerateBracketButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const response = await generateBracketAction(tournamentId);

      if (response.success) {
        toast.success(`Braket berhasil di-generate. ${response.data?.count} pertandingan dibuat.`);
        
        // Redirect to bracket view or refresh page
        router.push(`/tournaments/${tournamentSlug}/bracket`);
      } else {
        toast.error(response.message || "Gagal membuat braket");
      }
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan sistem");
    } finally {
      setIsLoading(false);
    }
  };

  const isDisabled = participantCount < 2 || isLoading;

  return (
    <Button 
      onClick={handleGenerate} 
      disabled={isDisabled}
      className="bg-green-600 hover:bg-green-700 text-white"
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Play className="mr-2 h-4 w-4" />
      )}
      Generate Bracket & Mulai Turnamen
    </Button>
  );
}
