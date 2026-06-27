import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Users, Info } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tournament = await prisma.tournament.findUnique({
    where: { slug }
  });
  
  if (!tournament) return { title: "Tournament Not Found" };
  
  return {
    title: `${tournament.name} | TMS`,
    description: tournament.description || `View results and brackets for ${tournament.name}`,
  };
}

export default async function PublicTournamentOverviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const tournament = await prisma.tournament.findUnique({
    where: { slug },
    include: {
      _count: {
        select: { participants: true, matches: true }
      }
    }
  });

  if (!tournament) {
    notFound();
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 bg-card border rounded-lg p-6 shadow-sm">
        <h2 className="flex items-center gap-2 text-xl font-bold mb-4">
          <Info className="w-5 h-5 text-primary" />
          About Tournament
        </h2>
        <div className="prose dark:prose-invert max-w-none">
          {tournament.description ? (
            <p className="whitespace-pre-wrap">{tournament.description}</p>
          ) : (
            <p className="text-muted-foreground italic">No description provided for this tournament.</p>
          )}
        </div>
      </div>
      
      <div className="bg-card border rounded-lg p-6 shadow-sm h-fit">
        <h2 className="flex items-center gap-2 text-xl font-bold mb-4">
          <Users className="w-5 h-5 text-primary" />
          Statistics
        </h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-muted-foreground">Participants</span>
            <span className="font-bold text-lg">{tournament._count.participants}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-muted-foreground">Total Matches</span>
            <span className="font-bold text-lg">{tournament._count.matches}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
