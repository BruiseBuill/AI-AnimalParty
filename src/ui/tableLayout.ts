export type SeatPosition = { x: number; y: number };
export type TableGeometry = {
  width: number;
  height: number;
  avatarDiameter: number;
  edgeGap?: number;
};

export function getSeatPositions(playerCount: number, geometry: TableGeometry): SeatPosition[] {
  const centerX = geometry.width / 2;
  const centerY = geometry.height / 2;
  const edgeGap = geometry.edgeGap ?? 4;
  const radius = Math.max(0, Math.min(geometry.width, geometry.height) / 2 - geometry.avatarDiameter / 2 - edgeGap);

  return Array.from({ length: playerCount }, (_, index) => {
    const angle = (index / playerCount) * Math.PI * 2 - Math.PI / 2;
    return {
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
    };
  });
}
