import { useCallback, useState } from "react";
import type { Game } from "../domain/model";
import type { GameStorage } from "../platform/gameStorage";

const HISTORY_LIMIT = 30;

export function useGameSession(storage: GameStorage) {
  const [saved, setSaved] = useState<Game | null>(() => storage.load());
  const [game, setGameState] = useState<Game | null>(null);
  const [history, setHistory] = useState<Game[]>([]);

  const applyGame = useCallback((next: Game, remember = true) => {
    setGameState((current) => {
      if (current && remember) setHistory((items) => [...items.slice(-(HISTORY_LIMIT - 1)), current]);
      return next;
    });
    setSaved(next);
    storage.save(next);
  }, [storage]);

  const startGame = useCallback((next: Game) => {
    setHistory([]);
    applyGame(next, false);
  }, [applyGame]);

  const continueGame = useCallback(() => {
    if (saved) setGameState(saved);
  }, [saved]);

  const leaveToSetup = useCallback(() => {
    setGameState(null);
    setHistory([]);
  }, []);

  const undo = useCallback(() => {
    setHistory((items) => {
      const previous = items.at(-1);
      if (!previous) return items;
      setGameState(previous);
      setSaved(previous);
      storage.save(previous);
      return items.slice(0, -1);
    });
  }, [storage]);

  return { saved, game, canUndo: history.length > 0, applyGame, startGame, continueGame, leaveToSetup, undo };
}
