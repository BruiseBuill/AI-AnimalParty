import { describe, expect, it } from "vitest";
import { addInferenceTag, createGame, getPublicRoleCount, removeInferenceTag } from "./game";

describe("对局领域规则", () => {
  it("根据人数计算公开移出的身份数", () => {
    expect(getPublicRoleCount(3)).toBe(2);
    expect(getPublicRoleCount(4)).toBe(1);
    expect(getPublicRoleCount(5)).toBe(0);
  });

  it("允许添加内容完全相同的推理标签", () => {
    const game = createGame(5, 1, "clockwise", []);
    let player = game.players[1];
    player = addInferenceTag(player, { id: "tag-1", content: "鱼 · 吃过", round: 2 });
    player = addInferenceTag(player, { id: "tag-2", content: "鱼 · 吃过", round: 2 });

    expect(player.inferenceTags).toHaveLength(2);
    expect(player.inferenceTags[0].content).toBe(player.inferenceTags[1].content);
  });

  it("按记录编号取消单个推理标签", () => {
    const game = createGame(5, 1, "clockwise", []);
    let player = addInferenceTag(game.players[1], { id: "tag-1", content: "身份 · 鹿", round: 1 });
    player = addInferenceTag(player, { id: "tag-2", content: "身份 · 鹿", round: 1 });
    player = removeInferenceTag(player, "tag-1");

    expect(player.inferenceTags.map((tag) => tag.id)).toEqual(["tag-2"]);
  });
});
