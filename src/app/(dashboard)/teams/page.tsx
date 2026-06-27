import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Users, Calendar, Shield } from "lucide-react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function TeamsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const organizationId = session.session.activeOrganizationId;

  if (!organizationId) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Teams / Participants</h1>
        <p className="text-muted-foreground">Select an organization to view participants.</p>
      </div>
    );
  }

  // Get all unique participant names and their earliest registration date
  // who participated in tournaments belonging to this organization
  const rawParticipants = await prisma.participant.findMany({
    where: {
      tournament: {
        organizationId: organizationId,
      },
    },
    include: {
      tournament: {
        select: { name: true, game: true },
      },
    },
    orderBy: {
      registeredAt: "asc",
    },
  });

  // Aggregate by name to get "Teams"
  const teamsMap = new Map<string, { 
    name: string; 
    tournamentsCount: number; 
    firstSeen: Date;
    games: Set<string>;
  }>();

  rawParticipants.forEach(p => {
    if (teamsMap.has(p.name)) {
      const team = teamsMap.get(p.name)!;
      team.tournamentsCount += 1;
      if (p.tournament.game) {
        team.games.add(p.tournament.game);
      }
    } else {
      teamsMap.set(p.name, {
        name: p.name,
        tournamentsCount: 1,
        firstSeen: p.registeredAt,
        games: new Set(p.tournament.game ? [p.tournament.game] : []),
      });
    }
  });

  const teams = Array.from(teamsMap.values()).sort((a, b) => b.tournamentsCount - a.tournamentsCount);

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Teams Roster</h1>
        <p className="text-muted-foreground">
          A registry of all participants and teams that have competed in your organization's tournaments.
        </p>
      </div>

      <div className="border rounded-md bg-card">
        {teams.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <Users className="w-12 h-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium">No Teams Yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm mt-1">
              Teams will automatically appear here once participants register for your tournaments.
            </p>
          </div>
        ) : (
          <div className="relative w-full overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Team / Participant Name</TableHead>
                  <TableHead>Total Tournaments</TableHead>
                  <TableHead>Games Played</TableHead>
                  <TableHead>First Registered</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teams.map((team, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {team.name.charAt(0).toUpperCase()}
                        </div>
                        {team.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium text-sm">
                        <Trophy className="w-3 h-3" />
                        {team.tournamentsCount}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {Array.from(team.games).slice(0, 3).map(game => (
                          <span key={game} className="text-xs bg-muted px-2 py-1 rounded-md border text-muted-foreground">
                            {game}
                          </span>
                        ))}
                        {team.games.size > 3 && (
                          <span className="text-xs bg-muted px-2 py-1 rounded-md border text-muted-foreground">
                            +{team.games.size - 3}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(team.firstSeen), "MMM d, yyyy")}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}

function Trophy(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7c0 6 6 8 6 8s6-2 6-8V2z" />
    </svg>
  )
}
