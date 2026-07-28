import { FOODS, ROLES, type Food, type Role } from "./catalog";
import type { FoodEvidence, Game, InferenceTag, PlayerRecord, PlayerStatus, RoleMark } from "./model";

export const MIN_PLAYERS = 3;
export const MAX_PLAYERS = 8;
export const MAX_ROUND = 6;

const blankFoodTags = () => Object.fromEntries(
  FOODS.map((food) => [food, { held: false, ate: false, cannot: false }]),
) as Record<Food, FoodEvidence>;

const blankRoleTags = () => Object.fromEntries(
  ROLES.map((role) => [role, "unknown"]),
) as Record<Role, RoleMark>;

export function getPublicRoleCount(playerCount: number): number {
  return Math.max(0, 5 - playerCount);
}

export function createGame(
  playerCount: number,
  selfSeat: number,
  direction: Game["direction"],
  excludedRoles: Role[],
): Game {
  if (playerCount < MIN_PLAYERS || playerCount > MAX_PLAYERS) throw new Error("不支持的玩家人数");
  if (selfSeat < 1 || selfSeat > playerCount) throw new Error("自己的座位无效");
  if (excludedRoles.length !== getPublicRoleCount(playerCount)) throw new Error("公开身份数量不正确");

  return {
    playerCount,
    selfSeat,
    direction,
    round: 1,
    excludedRoles,
    players: Array.from({ length: playerCount }, (_, index) => ({
      seat: index + 1,
      name: index + 1 === selfSeat ? "我" : `玩家 ${index + 1}`,
      status: "alive",
      roleTags: blankRoleTags(),
      foodTags: blankFoodTags(),
      inferenceTags: [],
      notes: "",
    })),
  };
}

export function addInferenceTag(player: PlayerRecord, tag: InferenceTag): PlayerRecord {
  return { ...player, inferenceTags: [...player.inferenceTags, tag] };
}

export function removeInferenceTag(player: PlayerRecord, tagId: string): PlayerRecord {
  return { ...player, inferenceTags: player.inferenceTags.filter((tag) => tag.id !== tagId) };
}

export function changePlayerStatus(player: PlayerRecord, status: PlayerStatus): PlayerRecord {
  return {
    ...player,
    status,
    confirmedRole: status === "dead-revealed" ? player.confirmedRole : undefined,
  };
}

export function replacePlayer(game: Game, player: PlayerRecord): Game {
  return { ...game, players: game.players.map((current) => current.seat === player.seat ? player : current) };
}

export function changeRound(game: Game, delta: number): Game {
  return { ...game, round: Math.max(1, Math.min(MAX_ROUND, game.round + delta)) };
}
