import type { Food, Role } from "./catalog";

export type PlayerStatus = "alive" | "dead-hidden" | "dead-revealed";
export type DeathCause = "starved" | "accused" | "wrong-accusation" | "other";
export type RoleMark = "unknown" | "possible" | "suspected" | "excluded";
export type FoodEvidence = { held: boolean; ate: boolean; cannot: boolean };

export type PlayerRecord = {
  seat: number;
  name: string;
  status: PlayerStatus;
  deathCause?: DeathCause;
  confirmedRole?: Role;
  roleTags: Record<Role, RoleMark>;
  foodTags: Record<Food, FoodEvidence>;
  notes: string;
};

export type Game = {
  playerCount: number;
  selfSeat: number;
  direction: "clockwise" | "counterclockwise";
  round: number;
  excludedRoles: Role[];
  players: PlayerRecord[];
};
