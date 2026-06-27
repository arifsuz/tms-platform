/**
 * TypeScript interfaces for JSONB fields in the database.
 * These provide strict typing for data stored as JSON in PostgreSQL.
 * Reference: docs/03_DATABASE_DESIGN.md (Section 4: JSONB Architecture Strategy)
 */

// ==========================================
// Tournament.rulesConfig
// ==========================================

/** Tie-breaker criteria available for standings calculation. */
export type TieBreaker =
  | "HEAD_TO_HEAD"
  | "GOAL_DIFFERENCE"
  | "GOALS_SCORED"
  | "WIN_RATE"
  | "BUCHHOLZ"
  | "SONNEBORN_BERGER"
  | "DIRECT_ENCOUNTER";

/** Base rules configuration shared by all tournament types. */
export interface BaseRulesConfig {
  winPoints: number;
  drawPoints: number;
  lossPoints: number;
  tieBreakers: TieBreaker[];
}

/** Round-Robin specific rules. */
export interface RoundRobinRules extends BaseRulesConfig {
  doubleRoundRobin: boolean;
}

/** Knock-Out specific rules. */
export interface KnockOutRules {
  doubleElimination: boolean;
  thirdPlaceMatch: boolean;
  bestOf: number; // e.g., 1 (single match), 3 (best of 3), 5 (best of 5)
}

/** Swiss System specific rules. */
export interface SwissRules extends BaseRulesConfig {
  numberOfRounds: number;
  forbidRematch: boolean;
}

/** Hybrid (Group Stage → Playoff) rules. */
export interface HybridRules {
  groupStage: RoundRobinRules;
  playoff: KnockOutRules;
  teamsAdvancingPerGroup: number;
  numberOfGroups: number;
}

/** Ladder/Pyramid specific rules. */
export interface LadderRules {
  maxChallengeRange: number; // How many ranks up a player can challenge
  cooldownHours: number; // Hours before next challenge
}

/** League specific rules. */
export interface LeagueRules extends BaseRulesConfig {
  seasonName: string;
  matchDays: number;
}

/** Union type for all possible rulesConfig payloads. */
export type RulesConfig =
  | RoundRobinRules
  | KnockOutRules
  | SwissRules
  | HybridRules
  | LadderRules
  | LeagueRules;

// ==========================================
// Participant.metadata
// ==========================================

/** Base participant metadata shared across sports. */
export interface BaseParticipantMetadata {
  seed?: number;
  rating?: number;
}

/** E-Sport FPS specific stats. */
export interface FPSParticipantMetadata extends BaseParticipantMetadata {
  totalKills: number;
  totalDeaths: number;
  headshotRate: number;
}

/** Football/Soccer specific stats. */
export interface FootballParticipantMetadata extends BaseParticipantMetadata {
  goalsScored: number;
  goalsConceded: number;
  goalDifference: number;
}

/** General purpose metadata (default). */
export interface GeneralParticipantMetadata extends BaseParticipantMetadata {
  [key: string]: unknown;
}

export type ParticipantMetadata =
  | FPSParticipantMetadata
  | FootballParticipantMetadata
  | GeneralParticipantMetadata;

// ==========================================
// Match.matchDetails
// ==========================================

/** A single set/round score (e.g., Badminton, Tennis, Volleyball). */
export interface SetScore {
  home: number;
  away: number;
}

/** Match details with per-set scoring. */
export interface SetBasedMatchDetails {
  sets: SetScore[];
}

/** Match details with game log entries. */
export interface GameLogMatchDetails {
  events: {
    timestamp: string;
    type: string;
    description: string;
    participantId?: string;
  }[];
}

/** General purpose match details. */
export interface GeneralMatchDetails {
  [key: string]: unknown;
}

export type MatchDetails =
  | SetBasedMatchDetails
  | GameLogMatchDetails
  | GeneralMatchDetails;

// ==========================================
// Standings Output
// ==========================================

/** Standing entry returned by standings calculation. */
export interface StandingEntry {
  rank: number;
  participantId: string;
  name: string;
  logo?: string;
  matchesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  points: number;
  metadata: Record<string, number>;
}
