import { describe, expect, it } from "vitest";
import { createGame, getCandidateRoles, getPublicRoleCount, toggleFoodEvidence } from "./game";

describe("对局领域规则", () => {
  it("根据人数计算公开移出的身份数", () => {
    expect(getPublicRoleCount(3)).toBe(2);
    expect(getPublicRoleCount(4)).toBe(1);
    expect(getPublicRoleCount(5)).toBe(0);
  });

  it("根据确认吃过的食物缩小身份候选", () => {
    const game = createGame(5, 1, "clockwise", []);
    let player = game.players[1];
    player = toggleFoodEvidence(player, "鱼", "ate");
    player = toggleFoodEvidence(player, "兽肉", "ate");
    const changedGame = { ...game, players: game.players.map((item) => item.seat === player.seat ? player : item) };

    expect(getCandidateRoles(changedGame, player)).toEqual(["熊", "蛇"]);
  });

  it("吃过与不吃标签互斥", () => {
    const game = createGame(5, 1, "clockwise", []);
    let player = toggleFoodEvidence(game.players[1], "草", "ate");
    player = toggleFoodEvidence(player, "草", "cannot");

    expect(player.foodTags.草).toEqual({ held: false, ate: false, cannot: true });
  });
});
