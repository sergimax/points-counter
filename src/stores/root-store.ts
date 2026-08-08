/**
 * App-level MobX store: all saved games, the single active game, and
 * debounced persistence to `localStorage` (`points-counter-data`).
 *
 * Invariant: at most one game has `status === "active"`; `activeGameId`
 * points at that game (or null when everything is paused).
 */
import {
  action,
  computed,
  makeObservable,
  observable,
  reaction,
} from "mobx";
import {
  emptyPersistedData,
  loadPersistedData,
  savePersistedData,
} from "../lib/storage.ts";
import {
  DATA_SCHEMA_VERSION,
  MAX_PLAYERS,
  MIN_PLAYERS,
  type CreateGameInput,
} from "../types/game.ts";
import { GameModel } from "./game-model.ts";

/** Debounce writes so rapid +/- taps do not thrash localStorage. */
const PERSIST_DEBOUNCE_MS = 200;

export class RootStore {
  /** All games (active + paused), newest-updated first via `sortedGames`. */
  games: GameModel[] = [];
  /** Id of the sole active game, or null when no game is in play. */
  activeGameId: string | null = null;
  private persistTimer: ReturnType<typeof setTimeout> | null = null;
  private disposePersist: (() => void) | null = null;

  constructor() {
    makeObservable(this, {
      games: observable.shallow,
      activeGameId: observable,
      activeGame: computed,
      pausedGames: computed,
      sortedGames: computed,
      hydrate: action,
      createGame: action,
      deleteGame: action,
      activateGame: action,
      closeActiveRound: action,
    });

    this.hydrate();
    // Snapshot → localStorage whenever games or active id change.
    this.disposePersist = reaction(
      () => ({
        schemaVersion: DATA_SCHEMA_VERSION,
        games: this.games.map((game) => game.toSnapshot()),
        activeGameId: this.activeGameId,
      }),
      (data) => this.schedulePersist(data),
      { fireImmediately: false },
    );
  }

  /** Currently scored game, if any. */
  get activeGame(): GameModel | null {
    if (!this.activeGameId) {
      return null;
    }
    return this.games.find((game) => game.id === this.activeGameId) ?? null;
  }

  get pausedGames(): GameModel[] {
    return this.games.filter((game) => game.status === "paused");
  }

  /** Games ordered by most recently updated. */
  get sortedGames(): GameModel[] {
    return [...this.games].sort((left, right) =>
      right.updatedAt.localeCompare(left.updatedAt),
    );
  }

  /** Load from localStorage (or empty state if missing / invalid). */
  hydrate(): void {
    const data = loadPersistedData() ?? emptyPersistedData();
    this.games = data.games.map((snapshot) => new GameModel(snapshot));
    this.activeGameId = data.activeGameId;
  }

  /**
   * Create a game, make it active, and pause any previous active game.
   * @throws if title/players fail validation
   */
  createGame(input: CreateGameInput): GameModel {
    const title = input.title.trim();
    if (!title) {
      throw new Error("Game title is required");
    }
    if (
      input.players.length < MIN_PLAYERS ||
      input.players.length > MAX_PLAYERS
    ) {
      throw new Error(`Players must be between ${MIN_PLAYERS} and ${MAX_PLAYERS}`);
    }
    for (const player of input.players) {
      if (!player.name.trim()) {
        throw new Error("Player name is required");
      }
    }

    const game = GameModel.create({
      ...input,
      title,
      players: input.players.map((player) => ({
        ...player,
        name: player.name.trim(),
      })),
    });

    // New game becomes active; pause any previous active game.
    for (const existing of this.games) {
      if (existing.status === "active") {
        existing.setPaused();
      }
    }
    game.setActive();
    this.games = [game, ...this.games];
    this.activeGameId = game.id;
    return game;
  }

  deleteGame(gameId: string): void {
    this.games = this.games.filter((game) => game.id !== gameId);
    if (this.activeGameId === gameId) {
      this.activeGameId = null;
    }
  }

  /**
   * Resume a paused game. Any previously active game is paused first
   * (one-active invariant).
   */
  activateGame(gameId: string): void {
    const target = this.games.find((game) => game.id === gameId);
    if (!target) {
      return;
    }
    for (const game of this.games) {
      if (game.id === gameId) {
        game.setActive();
      } else if (game.status === "active") {
        game.setPaused();
      }
    }
    this.activeGameId = gameId;
  }

  /** Snapshot current-round scores into history and start a fresh round. */
  closeActiveRound(): void {
    this.activeGame?.closeRound();
  }

  /** Tear down the persist reaction (tests / hot dispose). */
  dispose(): void {
    this.disposePersist?.();
    this.disposePersist = null;
    if (this.persistTimer) {
      clearTimeout(this.persistTimer);
      this.persistTimer = null;
    }
  }

  private schedulePersist(data: {
    schemaVersion: number;
    games: ReturnType<GameModel["toSnapshot"]>[];
    activeGameId: string | null;
  }): void {
    if (this.persistTimer) {
      clearTimeout(this.persistTimer);
    }
    this.persistTimer = setTimeout(() => {
      savePersistedData({
        schemaVersion: data.schemaVersion,
        games: data.games,
        activeGameId: data.activeGameId,
      });
      this.persistTimer = null;
    }, PERSIST_DEBOUNCE_MS);
  }
}

/** Singleton used by RootStoreProvider — one store per page load. */
export const rootStore = new RootStore();
