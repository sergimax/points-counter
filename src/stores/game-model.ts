/**
 * MobX model for a single tabletop/card game session.
 *
 * Scoring model:
 * - `currentScores` = open round (edited with +/-)
 * - `rounds` = closed history (one score per player per round)
 * - Live total = sum of closed rounds + current round
 */
import {
  makeObservable,
  observable,
  action,
  computed,
} from "mobx";
import { createId } from "../lib/ids.ts";
import type {
  ColorId,
  CreateGameInput,
  GameIconId,
  GameSnapshot,
  GameStatus,
  Player,
  Round,
} from "../types/game.ts";

/** Zero score map keyed by player id (new / after close round). */
function zeroScores(players: Player[]): Record<string, number> {
  const scores: Record<string, number> = {};
  for (const player of players) {
    scores[player.id] = 0;
  }
  return scores;
}

export class GameModel {
  id: string;
  title: string;
  iconId: GameIconId;
  colorId: ColorId;
  /** `active` = currently playable; `paused` = saved, not scoring. */
  status: GameStatus;
  players: Player[];
  /** Closed rounds only (oldest → newest). */
  rounds: Round[];
  /** Open round scores keyed by player id. */
  currentScores: Record<string, number>;
  createdAt: string;
  updatedAt: string;

  constructor(snapshot: GameSnapshot) {
    this.id = snapshot.id;
    this.title = snapshot.title;
    this.iconId = snapshot.iconId;
    this.colorId = snapshot.colorId;
    this.status = snapshot.status;
    this.players = snapshot.players.map((player) => ({ ...player }));
    this.rounds = snapshot.rounds.map((round) => ({
      ...round,
      scores: { ...round.scores },
    }));
    this.currentScores = { ...snapshot.currentScores };
    this.createdAt = snapshot.createdAt;
    this.updatedAt = snapshot.updatedAt;

    makeObservable(this, {
      title: observable,
      iconId: observable,
      colorId: observable,
      status: observable,
      players: observable.shallow,
      rounds: observable.shallow,
      currentScores: observable,
      updatedAt: observable,
      nextRoundNumber: computed,
      touch: action,
      setPaused: action,
      setActive: action,
      rename: action,
      adjustScore: action,
      setScore: action,
      closeRound: action,
      toSnapshot: false,
      roundScore: false,
      closedScore: false,
      gameTotal: false,
    });
  }

  /** Factory for a brand-new game (starts paused; RootStore activates it). */
  static create(input: CreateGameInput): GameModel {
    const now = new Date().toISOString();
    const players: Player[] = input.players.map((player) => ({
      id: createId("player"),
      name: player.name.trim(),
      iconId: player.iconId,
      colorId: player.colorId,
    }));

    return new GameModel({
      id: createId("game"),
      title: input.title.trim(),
      iconId: input.iconId,
      colorId: input.colorId,
      status: "paused",
      players,
      rounds: [],
      currentScores: zeroScores(players),
      createdAt: now,
      updatedAt: now,
    });
  }

  /** 1-based number for the open round (closed count + 1). */
  get nextRoundNumber(): number {
    return this.rounds.length + 1;
  }

  /** Bump `updatedAt` after any mutating change. */
  touch(): void {
    this.updatedAt = new Date().toISOString();
  }

  setPaused(): void {
    this.status = "paused";
    this.touch();
  }

  setActive(): void {
    this.status = "active";
    this.touch();
  }

  rename(title: string): void {
    this.title = title.trim();
    this.touch();
  }

  /** Points in the open round for a player. */
  roundScore(playerId: string): number {
    return this.currentScores[playerId] ?? 0;
  }

  /** Sum of closed-round scores for a player (excludes open round). */
  closedScore(playerId: string): number {
    return this.rounds.reduce(
      (sum, round) => sum + (round.scores[playerId] ?? 0),
      0,
    );
  }

  /** Live game total: closed rounds + current round. */
  gameTotal(playerId: string): number {
    return this.closedScore(playerId) + this.roundScore(playerId);
  }

  /** Add/subtract from the open-round score (negatives allowed). */
  adjustScore(playerId: string, delta: number): void {
    if (!(playerId in this.currentScores)) {
      return;
    }
    this.currentScores[playerId] = (this.currentScores[playerId] ?? 0) + delta;
    this.touch();
  }

  setScore(playerId: string, value: number): void {
    if (!(playerId in this.currentScores)) {
      return;
    }
    if (!Number.isFinite(value)) {
      return;
    }
    this.currentScores[playerId] = value;
    this.touch();
  }

  /**
   * Freeze current scores into history and reset the open round to zeros.
   * @returns the newly closed round
   */
  closeRound(): Round {
    const closed: Round = {
      id: createId("round"),
      number: this.nextRoundNumber,
      scores: { ...this.currentScores },
      closedAt: new Date().toISOString(),
    };
    this.rounds = [...this.rounds, closed];
    this.currentScores = zeroScores(this.players);
    this.touch();
    return closed;
  }

  /** Plain JSON snapshot for persistence / export. */
  toSnapshot(): GameSnapshot {
    return {
      id: this.id,
      title: this.title,
      iconId: this.iconId,
      colorId: this.colorId,
      status: this.status,
      players: this.players.map((player) => ({ ...player })),
      rounds: this.rounds.map((round) => ({
        ...round,
        scores: { ...round.scores },
      })),
      currentScores: { ...this.currentScores },
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
