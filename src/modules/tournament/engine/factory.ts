import { TournamentEngine } from "./types";
import { KnockOutEngine } from "./knockout.engine";
import { RoundRobinEngine } from "./round-robin.engine";
import { TournamentType } from "@/generated/prisma/client";

export class TournamentEngineFactory {
  static getEngine(type: TournamentType): TournamentEngine {
    switch (type) {
      case "KNOCK_OUT":
        return new KnockOutEngine();
      case "ROUND_ROBIN":
        return new RoundRobinEngine();
      case "SWISS":
      case "HYBRID":
      case "LADDER":
      case "LEAGUE":
      default:
        throw new Error(`Tournament engine for type ${type} is not implemented yet.`);
    }
  }
}
