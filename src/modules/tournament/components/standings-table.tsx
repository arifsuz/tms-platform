import { StandingEntry } from "@/modules/tournament/standings.service";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface StandingsTableProps {
  standings: StandingEntry[];
}

export function StandingsTable({ standings }: StandingsTableProps) {
  if (!standings || standings.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground border rounded-xl bg-card">
        No standings available. Play some matches first!
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="w-[50px] text-center">#</TableHead>
            <TableHead>Team</TableHead>
            <TableHead className="text-center w-[60px]">P</TableHead>
            <TableHead className="text-center w-[60px]">W</TableHead>
            <TableHead className="text-center w-[60px]">D</TableHead>
            <TableHead className="text-center w-[60px]">L</TableHead>
            <TableHead className="text-center w-[60px]">GF</TableHead>
            <TableHead className="text-center w-[60px]">GA</TableHead>
            <TableHead className="text-center w-[60px]">GD</TableHead>
            <TableHead className="text-right w-[80px] font-bold">Pts</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {standings.map((entry, index) => (
            <TableRow key={entry.participantId}>
              <TableCell className="text-center font-medium">
                {index + 1}
              </TableCell>
              <TableCell className="font-semibold">{entry.name}</TableCell>
              <TableCell className="text-center">{entry.played}</TableCell>
              <TableCell className="text-center text-green-600">{entry.won}</TableCell>
              <TableCell className="text-center text-yellow-600">{entry.drawn}</TableCell>
              <TableCell className="text-center text-red-600">{entry.lost}</TableCell>
              <TableCell className="text-center">{entry.goalsFor}</TableCell>
              <TableCell className="text-center">{entry.goalsAgainst}</TableCell>
              <TableCell className="text-center font-medium">
                {entry.goalDifference > 0 ? `+${entry.goalDifference}` : entry.goalDifference}
              </TableCell>
              <TableCell className="text-right font-bold text-lg">
                {entry.points}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
