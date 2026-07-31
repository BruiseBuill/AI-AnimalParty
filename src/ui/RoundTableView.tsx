import { ROLE_ICONS } from "../domain/catalog";
import type { Game } from "../domain/model";
import { getSeatAngle } from "./tableLayout";
import { useRoundTableLayout } from "./useRoundTableLayout";

type RoundTableViewProps = {
  game: Game;
  livingPlayers: number;
  onSelectPlayer: (seat: number) => void;
};

export function RoundTableView({ game, livingPlayers, onSelectPlayer }: RoundTableViewProps) {
  const selfIndex = Math.max(0, game.players.findIndex((player) => player.seat === game.selfSeat));
  const { tableRef, seatPositions, displayMetrics } = useRoundTableLayout(game.playerCount, selfIndex);

  return <div
    className="round-table"
    ref={tableRef}
    data-seat-count={game.playerCount}
    data-physical-resolution={displayMetrics ? `${displayMetrics.physicalWidth}x${displayMetrics.physicalHeight}` : undefined}
    data-device-pixel-ratio={displayMetrics?.devicePixelRatio}
  >
    <div className="table-center"><span>第 {game.round} 轮</span><small>{livingPlayers} / {game.playerCount} 存活</small></div>
    {game.players.map((player, index) => {
      const position = seatPositions[index];
      const isSelf = player.seat === game.selfSeat;
      const fallbackAngle = getSeatAngle(game.playerCount, index, selfIndex);
      const fallbackLeft = 50 + Math.cos(fallbackAngle) * 40;
      const fallbackTop = 50 + Math.sin(fallbackAngle) * 40;
      return <button
        key={player.seat}
        className={`player-token ${isSelf ? "self" : ""} ${player.status}`}
        style={{
          left: position ? `${position.x}px` : `${fallbackLeft}%`,
          top: position ? `${position.y}px` : `${fallbackTop}%`,
        }}
        onClick={() => !isSelf && onSelectPlayer(player.seat)}
        disabled={isSelf}
      >
        <span className="avatar">{player.confirmedRole ? ROLE_ICONS[player.confirmedRole] : isSelf ? "✦" : player.status === "dead-hidden" ? "?" : player.seat}</span>
        <b>{player.name}</b>
        <small>{isSelf ? "我的位置" : player.status === "alive" ? "查看推理" : player.status === "dead-hidden" ? "等待揭秘" : player.confirmedRole || "已淘汰"}</small>
      </button>;
    })}
  </div>;
}
