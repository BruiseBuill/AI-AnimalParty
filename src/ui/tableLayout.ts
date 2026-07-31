export type SeatPosition = { x: number; y: number };
export type TableGeometry = {
  width: number;
  height: number;
  avatarDiameter: number;
  edgeGap?: number;
};

export function getSeatAngle(playerCount: number, index: number, bottomSeatIndex = 0): number {
  return ((index - bottomSeatIndex) / playerCount) * Math.PI * 2 + Math.PI / 2;
}

export function getSeatPositions(
  playerCount: number,
  geometry: TableGeometry,
  bottomSeatIndex = 0,
): SeatPosition[] {
  const centerX = geometry.width / 2;
  const centerY = geometry.height / 2;
  const edgeGap = geometry.edgeGap ?? 4;
  const radius = Math.max(0, Math.min(geometry.width, geometry.height) / 2 - geometry.avatarDiameter / 2 - edgeGap);

  return Array.from({ length: playerCount }, (_, index) => {
    const angle = getSeatAngle(playerCount, index, bottomSeatIndex);
    return {
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
    };
  });
}
