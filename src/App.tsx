import { useEffect, useState } from "react";
import { FOODS, FOOD_ICONS, ROLES, ROLE_ICONS, type Role } from "./domain/catalog";
import { addInferenceTag, changePlayerStatus, changeRound, createGame, getPublicRoleCount, removeInferenceTag, replacePlayer } from "./domain/game";
import type { DeathCause, Game, PlayerRecord, PlayerStatus } from "./domain/model";
import { useGameSession } from "./application/useGameSession";
import { browserGameStorage } from "./platform/gameStorage";
import { createRecordId } from "./platform/id";
import { getSeatPosition } from "./ui/tableLayout";

function Setup({ onStart, saved, onContinue }: { onStart: (game: Game) => void; saved: Game | null; onContinue: () => void }) {
  const [count, setCount] = useState(5);
  const [selfSeat, setSelfSeat] = useState(1);
  const [direction, setDirection] = useState<Game["direction"]>("clockwise");
  const [excluded, setExcluded] = useState<Role[]>([]);
  const excludeLimit = getPublicRoleCount(count);

  useEffect(() => {
    if (selfSeat > count) setSelfSeat(count);
    setExcluded((current) => current.slice(0, getPublicRoleCount(count)));
  }, [count, selfSeat]);

  const toggleExcluded = (role: Role) => setExcluded((current) => {
    if (current.includes(role)) return current.filter((item) => item !== role);
    return current.length < excludeLimit ? [...current, role] : current;
  });

  return <main className="setup-shell">
    <section className="setup-card">
      <div className="brand-mark">AP</div>
      <p className="eyebrow">ANIMAL PARTY · FIELD NOTES</p>
      <h1>动物派对<br /><em>推理手册</em></h1>
      <p className="intro">把线索留在这里，把身份藏在桌边。记录只保存在你的设备中。</p>

      {saved && <button className="continue-card" onClick={onContinue}>
        <span><small>继续上次对局</small><strong>{saved.playerCount} 人局 · 第 {saved.round} 轮</strong></span><b>→</b>
      </button>}

      <div className="setup-block">
        <label>场上人数</label>
        <div className="choice-row count-row">{[3,4,5,6,7,8].map((n) => <button key={n} className={count === n ? "active" : ""} onClick={() => setCount(n)}>{n}</button>)}</div>
      </div>
      <div className="setup-grid">
        <div className="setup-block"><label>我的座位</label><select value={selfSeat} onChange={(e) => setSelfSeat(Number(e.target.value))}>{Array.from({ length: count }, (_, i) => <option key={i} value={i + 1}>座位 {i + 1}</option>)}</select></div>
        <div className="setup-block"><label>行动方向</label><select value={direction} onChange={(e) => setDirection(e.target.value as Game["direction"])}><option value="clockwise">顺时针</option><option value="counterclockwise">逆时针</option></select></div>
      </div>
      {excludeLimit > 0 && <div className="setup-block">
        <label>公开移出的身份 <span>请选择 {excludeLimit} 个</span></label>
        <div className="role-pills compact">{ROLES.map((role) => <button key={role} className={excluded.includes(role) ? "selected" : ""} onClick={() => toggleExcluded(role)}>{ROLE_ICONS[role]} {role}</button>)}</div>
      </div>}
      <button className="primary" disabled={excluded.length !== excludeLimit} onClick={() => onStart(createGame(count, selfSeat, direction, excluded))}>展开圆桌</button>
      <p className="footnote">提示：规则书未列出 8 人局的初始手牌数量，本工具仅记录推理，不处理发牌。</p>
    </section>
  </main>;
}

function PlayerDrawer({ game, player, onChange, onClose }: { game: Game; player: PlayerRecord; onChange: (player: PlayerRecord) => void; onClose: () => void }) {
  const patch = (values: Partial<PlayerRecord>) => onChange({ ...player, ...values });
  const addTag = (content: string) => onChange(addInferenceTag(player, {
    id: createRecordId(),
    content,
    round: game.round,
  }));
  const setStatus = (status: PlayerStatus) => onChange(changePlayerStatus(player, status));

  return <div className="drawer-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
    <aside className="drawer" aria-label={`${player.name}的推理记录`}>
      <header className="drawer-header">
        <div><span className="seat-label">座位 {player.seat}</span><input value={player.name} onChange={(e) => patch({ name: e.target.value })} aria-label="玩家昵称" /></div>
        <button className="close" onClick={onClose} aria-label="关闭">×</button>
      </header>

      <section className="inference-section">
        <div className="section-title"><h2>推理汇总</h2><span>{player.inferenceTags.length} 条记录</span></div>
        {player.inferenceTags.length > 0
          ? <div className="inference-tags">{player.inferenceTags.map((tag) => <span className="inference-tag" key={tag.id}>
              <b>{tag.content}</b><small>第 {tag.round} 轮</small>
              <button onClick={() => onChange(removeInferenceTag(player, tag.id))} aria-label={`取消${tag.content}`}>×</button>
            </span>)}</div>
          : <div className="inference-empty">选择下方标签后，记录会出现在这里</div>}
      </section>

      <section><div className="section-title"><h2>食物标签</h2><span>点击即添加，可重复</span></div>
        <div className="food-grid">{FOODS.map((food) => {
          return <article className="food-card" key={food}><div className="food-name"><i>{FOOD_ICONS[food]}</i><b>{food}</b></div><div className="evidence-row">
            <button onClick={() => addTag(`${FOOD_ICONS[food]} ${food} · 持有`)}>持有</button>
            <button onClick={() => addTag(`${FOOD_ICONS[food]} ${food} · 吃过`)}>吃过</button>
            <button onClick={() => addTag(`${FOOD_ICONS[food]} ${food} · 不吃`)}>不吃</button>
          </div></article>;
        })}</div>
      </section>

      <section><div className="section-title"><h2>身份标签</h2><span>点击即添加，可重复</span></div>
        <div className="role-pills">{ROLES.map((role) => <button key={role} onClick={() => addTag(`${ROLE_ICONS[role]} 身份 · ${role}`)}><span>{ROLE_ICONS[role]}</span>{role}</button>)}</div>
      </section>

      <section><div className="section-title"><h2>玩家状态</h2></div>
        <div className="segmented">{([['alive','存活'],['dead-hidden','死亡 · 未揭示'],['dead-revealed','死亡 · 已揭示']] as [PlayerStatus,string][]).map(([value,label]) => <button key={value} className={player.status === value ? "active" : ""} onClick={() => setStatus(value)}>{label}</button>)}</div>
        {player.status !== "alive" && <div className="status-details">
          <select value={player.deathCause || ""} onChange={(e) => patch({ deathCause: e.target.value as DeathCause })}><option value="">选择死亡原因</option><option value="starved">饿死</option><option value="accused">被正确指认</option><option value="wrong-accusation">指认失败</option><option value="other">其他</option></select>
          {player.status === "dead-revealed" && <select value={player.confirmedRole || ""} onChange={(e) => patch({ confirmedRole: e.target.value as Role || undefined })}><option value="">选择公开身份</option>{ROLES.map((role) => <option key={role} value={role}>{ROLE_ICONS[role]} {role}</option>)}</select>}
        </div>}
      </section>

      <section><div className="section-title"><h2>自由备注</h2><span>自动保存</span></div><textarea value={player.notes} onChange={(e) => patch({ notes: e.target.value })} placeholder="例如：第 2 轮暗牌交易；曾使用异型消化……" /></section>
    </aside>
  </div>;
}

function TableView({ game, setGame, onExit }: { game: Game; setGame: (next: Game, remember?: boolean) => void; onExit: () => void }) {
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
  const selected = game.players.find((p) => p.seat === selectedSeat);
  const living = game.players.filter((p) => p.status === "alive").length;
  const updatePlayer = (nextPlayer: PlayerRecord) => setGame(replacePlayer(game, nextPlayer));

  return <main className="game-shell">
    <header className="topbar"><div className="mini-brand"><span>AP</span><div><strong>动物派对</strong><small>私人推理手册</small></div></div><div className="round-control"><button onClick={() => setGame(changeRound(game, -1))}>−</button><span><small>ROUND</small><b>{game.round}</b></span><button onClick={() => setGame(changeRound(game, 1))}>＋</button></div><div className="header-actions"><button onClick={onExit}>新对局</button></div></header>
    <section className="table-area">
      <div className="table-copy"><p className="eyebrow">PRIVATE OBSERVATION TABLE</p><h1>点击一位玩家<br />开始记录线索</h1><p>{living} 人存活 · {game.direction === "clockwise" ? "顺时针" : "逆时针"}行动</p></div>
      <div className="round-table">
        <div className="table-center"><span>第 {game.round} 轮</span><small>{living} / {game.playerCount} 存活</small></div>
        {game.players.map((player, index) => {
          const { x, y } = getSeatPosition(index, game.playerCount);
          const isSelf = player.seat === game.selfSeat;
          return <button key={player.seat} className={`player-token ${isSelf ? "self" : ""} ${player.status}`} style={{ left: `${x}%`, top: `${y}%` }} onClick={() => !isSelf && setSelectedSeat(player.seat)} disabled={isSelf}>
            <span className="avatar">{player.confirmedRole ? ROLE_ICONS[player.confirmedRole] : isSelf ? "✦" : player.status === "dead-hidden" ? "?" : player.seat}</span>
            <b>{player.name}</b><small>{isSelf ? "我的位置" : player.status === "alive" ? "查看推理" : player.status === "dead-hidden" ? "等待揭秘" : player.confirmedRole || "已淘汰"}</small>
          </button>;
        })}
      </div>
      <div className="legend"><span><i className="dot alive-dot" />存活</span><span><i className="dot dead-dot" />已淘汰</span>{game.excludedRoles.length > 0 && <span>公开移出：{game.excludedRoles.map((r) => `${ROLE_ICONS[r]}${r}`).join("、")}</span>}</div>
    </section>
    {selected && <PlayerDrawer game={game} player={selected} onChange={updatePlayer} onClose={() => setSelectedSeat(null)} />}
  </main>;
}

export default function App() {
  const { saved, game, canUndo, applyGame, startGame, continueGame, leaveToSetup, undo } = useGameSession(browserGameStorage);
  const newGame = () => {
    if (!confirm("返回新对局设置？当前记录仍会保留，可继续上次对局。")) return;
    leaveToSetup();
  };

  useEffect(() => {
    const handler = (event: KeyboardEvent) => { if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") { event.preventDefault(); undo(); } };
    window.addEventListener("keydown", handler); return () => window.removeEventListener("keydown", handler);
  });

  return <>
    {game
      ? <TableView game={game} setGame={applyGame} onExit={newGame} />
      : <Setup saved={saved} onContinue={continueGame} onStart={startGame} />}
    {game && <button className="undo-fab" disabled={!canUndo} onClick={undo} title="撤销上一步">↶ <span>撤销</span></button>}
  </>;
}
