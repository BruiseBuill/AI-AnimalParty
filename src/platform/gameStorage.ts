import type { Game } from "../domain/model";

export interface GameStorage {
  load(): Game | null;
  save(game: Game): void;
}

const STORAGE_KEY = "animal-party-notes-v1";

export const browserGameStorage: GameStorage = {
  load() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null") as Game | null;
      if (!stored) return null;
      return {
        ...stored,
        players: stored.players.map((player) => ({
          ...player,
          inferenceTags: Array.isArray(player.inferenceTags) ? player.inferenceTags : [],
        })),
      };
    } catch {
      return null;
    }
  },
  save(game) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(game));
  },
};
