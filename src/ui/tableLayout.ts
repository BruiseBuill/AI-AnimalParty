export type SeatPosition = { x: number; y: number };

const CENTER_PERCENT = 50;
const RING_RADIUS_PERCENT = 46;

export function getSeatPosition(index: number, playerCount: number): SeatPosition {
  const angle = (index / playerCount) * Math.PI * 2 - Math.PI / 2;
  return {
    x: CENTER_PERCENT + Math.cos(angle) * RING_RADIUS_PERCENT,
    y: CENTER_PERCENT + Math.sin(angle) * RING_RADIUS_PERCENT,
  };
}
