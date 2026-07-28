import type { Game } from "../domain/model";

export interface GameStorage {
  load(): Game | null;
  save(game: Game): void;
}

const STORAGE_KEY = "animal-party-notes-v1";

export const browserGameStorage: GameStorage = {
  load() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null") as Game | null;
    } catch {
      return null;
    }
  },
  save(game) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(game));
  },
};
