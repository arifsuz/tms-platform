import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Trophy, Plus, Calendar, Swords, MoreHorizontal, Users } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { CompleteTournamentButton } from "@/modules/tournament/components/complete-tournament-button";

export default async function TournamentsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.session?.activeOrganizationId) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 py-16">
        <h2 className="text-xl font-semibold">Organisasi Belum Dipilih</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Silakan pilih atau buat organisasi terlebih dahulu.
        </p>
      </div>
    );
  }

  const tournaments = await prisma.tournament.findMany({
    where: {
      organizationId: session.session.activeOrganizationId,
      deletedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: { participants: true, matches: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Turnamen</h1>
          <p className="text-muted-foreground mt-1">
            Kelola turnamen dan kompetisi di organisasi Anda.
          </p>
        </div>
        <Link
          href="/tournaments/create"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          <Plus className="mr-2 h-4 w-4" />
          Buat Turnamen
        </Link>
      </div>

      {tournaments.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 py-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Trophy className="h-8 w-8 text-primary" />
          </div>
          <h2 className="mt-4 text-xl font-semibold">Belum ada turnamen</h2>
          <p className="mt-2 max-w-sm text-center text-sm text-muted-foreground">
            Anda belum membuat turnamen apapun di organisasi ini. Klik "Buat Turnamen" untuk memulai.
          </p>
          <Link
            href="/tournaments/create"
            className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90"
          >
            Buat Turnamen Pertama
          </Link>
        </div>
      ) : (
        <div className="rounded-md border border-border bg-card">
          <div className="w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b [&_tr]:border-border">
                <tr className="border-b border-border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Nama Turnamen
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Game & Tipe
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Partisipan
                  </th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {tournaments.map((tournament) => (
                  <tr
                    key={tournament.id}
                    className="border-b border-border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                  >
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <Trophy className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{tournament.name}</p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Calendar className="mr-1 h-3 w-3" />
                            {tournament.startDate
                              ? format(tournament.startDate, "dd MMM yyyy")
                              : "TBA"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <p className="font-medium capitalize">{tournament.game}</p>
                      <p className="text-xs text-muted-foreground">
                        {tournament.type.replace("_", " ")}
                      </p>
                    </td>
                    <td className="p-4 align-middle">
                      <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                        {tournament.status}
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-1 text-sm">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{tournament._count.participants}</span>
                      </div>
                    </td>
                    <td className="p-4 align-middle text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/tournaments/${tournament.slug}/participants`}
                          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 px-3"
                        >
                          <Users className="h-4 w-4 mr-2" />
                          Participants
                        </Link>
                        {tournament.status === "IN_PROGRESS" && (
                          <CompleteTournamentButton tournamentId={tournament.id} />
                        )}
                        {tournament.status !== "DRAFT" && (
                          <Link
                            href={`/tournaments/${tournament.slug}/bracket`}
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3"
                          >
                            <Trophy className="h-4 w-4 mr-2" />
                            Bracket
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
