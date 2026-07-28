import { describe, expect, it } from "vitest";
import { getSeatPositions } from "./tableLayout";

describe("圆桌座位布局", () => {
  it.each([3, 4, 5, 6, 7, 8])("%i 人的所有座位都位于实测尺寸的同一圆环", (playerCount) => {
    const geometry = { width: 360, height: 360, avatarDiameter: 49 };
    const center = geometry.width / 2;
    const expectedRadius = center - geometry.avatarDiameter / 2 - 4;
    const positions = getSeatPositions(playerCount, geometry);

    positions.forEach((position) => {
      expect(Math.hypot(position.x - center, position.y - center)).toBeCloseTo(expectedRadius, 10);
      expect(position.x).toBeGreaterThanOrEqual(geometry.avatarDiameter / 2);
      expect(position.x).toBeLessThanOrEqual(geometry.width - geometry.avatarDiameter / 2);
      expect(position.y).toBeGreaterThanOrEqual(geometry.avatarDiameter / 2);
      expect(position.y).toBeLessThanOrEqual(geometry.height - geometry.avatarDiameter / 2);
    });
  });

  it("使用较短边计算非正方形容器中的安全半径", () => {
    const positions = getSeatPositions(6, { width: 420, height: 300, avatarDiameter: 44 });
    const radii = positions.map((position) => Math.hypot(position.x - 210, position.y - 150));
    radii.forEach((radius) => expect(radius).toBeCloseTo(124, 10));
  });
});
