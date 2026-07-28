import { describe, expect, it } from "vitest";
import { getSeatPosition } from "./tableLayout";

describe("圆桌座位布局", () => {
  it.each([3, 4, 5, 6, 7, 8])("%i 人的所有座位都位于同一圆环", (playerCount) => {
    const radii = Array.from({ length: playerCount }, (_, index) => {
      const position = getSeatPosition(index, playerCount);
      return Math.hypot(position.x - 50, position.y - 50);
    });

    radii.forEach((radius) => expect(radius).toBeCloseTo(46, 10));
  });
});
