"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Participant {
  id: string;
  name: string;
  status: string;
  registeredAt: Date;
}

interface ParticipantListProps {
  participants: Participant[];
}

export function ParticipantList({ participants }: ParticipantListProps) {
  if (!participants || participants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
        <h2 className="mt-2 text-xl font-semibold">No participants yet</h2>
        <p className="mt-2 text-center text-sm font-normal leading-6 text-muted-foreground max-w-sm">
          Register teams or players to this tournament.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Participant</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Registered</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {participants.map((participant) => (
            <TableRow key={participant.id}>
              <TableCell className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/20 text-primary">
                    {participant.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">{participant.name}</span>
              </TableCell>
              <TableCell>
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-accent/20 text-accent">
                  {participant.status}
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {format(new Date(participant.registeredAt), "MMM d, yyyy")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
