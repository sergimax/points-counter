import {
  DATA_SCHEMA_VERSION,
  DATA_STORAGE_KEY,
  LEGACY_DATA_STORAGE_KEY,
  GAME_ICON_IDS,
  COLOR_IDS,
  PLAYER_ICON_IDS,
  type GameIconId,
  type GameSnapshot,
  type GameStatus,
  type PersistedData,
  type Player,
  type ColorId,
  type PlayerIconId,
  type Round,
} from "../types/game.ts";
import { defaultColorId } from "./player-colors.ts";
import { migrateLocalStorageKey } from "./migrate-storage-key.ts";

migrateLocalStorageKey(LEGACY_DATA_STORAGE_KEY, DATA_STORAGE_KEY);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isGameIconId(value: unknown): value is GameIconId {
  return (
    typeof value === "string" &&
    (GAME_ICON_IDS as readonly string[]).includes(value)
  );
}

function isPlayerIconId(value: unknown): value is PlayerIconId {
  return (
    typeof value === "string" &&
    (PLAYER_ICON_IDS as readonly string[]).includes(value)
  );
}

function isGameStatus(value: unknown): value is GameStatus {
  return value === "active" || value === "paused";
}

function parseScores(value: unknown): Record<string, number> | null {
  if (!isRecord(value)) {
    return null;
  }
  const scores: Record<string, number> = {};
  for (const [playerId, score] of Object.entries(value)) {
    if (typeof score !== "number" || !Number.isFinite(score)) {
      return null;
    }
    scores[playerId] = score;
  }
  return scores;
}

function isColorId(value: unknown): value is ColorId {
  return (
    typeof value === "string" && (COLOR_IDS as readonly string[]).includes(value)
  );
}

function parsePlayer(value: unknown, index: number): Player | null {
  if (!isRecord(value)) {
    return null;
  }
  if (typeof value.id !== "string" || typeof value.name !== "string") {
    return null;
  }
  if (!isPlayerIconId(value.iconId)) {
    return null;
  }
  const colorId = isColorId(value.colorId)
    ? value.colorId
    : defaultColorId(index);
  return {
    id: value.id,
    name: value.name,
    iconId: value.iconId,
    colorId,
  };
}

function parseRound(value: unknown): Round | null {
  if (!isRecord(value)) {
    return null;
  }
  if (typeof value.id !== "string" || typeof value.closedAt !== "string") {
    return null;
  }
  if (typeof value.number !== "number" || !Number.isFinite(value.number)) {
    return null;
  }
  const scores = parseScores(value.scores);
  if (!scores) {
    return null;
  }
  // Legacy saves may lack startedAt — fall back to closedAt.
  const startedAt =
    typeof value.startedAt === "string" ? value.startedAt : value.closedAt;
  return {
    id: value.id,
    number: value.number,
    scores,
    startedAt,
    closedAt: value.closedAt,
  };
}

function parseGame(value: unknown): GameSnapshot | null {
  if (!isRecord(value)) {
    return null;
  }
  if (
    typeof value.id !== "string" ||
    typeof value.title !== "string" ||
    typeof value.createdAt !== "string" ||
    typeof value.updatedAt !== "string"
  ) {
    return null;
  }
  if (!isGameIconId(value.iconId) || !isGameStatus(value.status)) {
    return null;
  }
  if (!Array.isArray(value.players) || !Array.isArray(value.rounds)) {
    return null;
  }
  if (value.players.length < 1) {
    return null;
  }

  const players: Player[] = [];
  for (let index = 0; index < value.players.length; index += 1) {
    const player = parsePlayer(value.players[index], index);
    if (!player) {
      return null;
    }
    players.push(player);
  }

  const rounds: Round[] = [];
  for (const entry of value.rounds) {
    const round = parseRound(entry);
    if (!round) {
      return null;
    }
    rounds.push(round);
  }

  const currentScores = parseScores(value.currentScores);
  if (!currentScores) {
    return null;
  }

  return {
    id: value.id,
    title: value.title,
    iconId: value.iconId,
    colorId: isColorId(value.colorId) ? value.colorId : defaultColorId(0),
    status: value.status,
    players,
    rounds,
    currentScores,
    currentRoundStartedAt:
      typeof value.currentRoundStartedAt === "string"
        ? value.currentRoundStartedAt
        : value.createdAt,
    createdAt: value.createdAt,
    updatedAt: value.updatedAt,
  };
}

export function parsePersistedData(raw: unknown): PersistedData | null {
  if (!isRecord(raw)) {
    return null;
  }
  if (raw.schemaVersion !== DATA_SCHEMA_VERSION) {
    return null;
  }
  if (!Array.isArray(raw.games)) {
    return null;
  }
  if (raw.activeGameId !== null && typeof raw.activeGameId !== "string") {
    return null;
  }

  const games: GameSnapshot[] = [];
  for (const entry of raw.games) {
    const game = parseGame(entry);
    if (!game) {
      return null;
    }
    games.push(game);
  }

  const activeGameId = raw.activeGameId;
  if (
    activeGameId !== null &&
    !games.some((game) => game.id === activeGameId)
  ) {
    return null;
  }

  // Enforce at most one active in persisted data.
  const activeCount = games.filter((game) => game.status === "active").length;
  if (activeCount > 1) {
    return null;
  }
  if (activeGameId !== null) {
    const activeGame = games.find((game) => game.id === activeGameId);
    if (!activeGame || activeGame.status !== "active") {
      return null;
    }
  }

  return {
    schemaVersion: DATA_SCHEMA_VERSION,
    games,
    activeGameId,
  };
}

export function loadPersistedData(): PersistedData | null {
  try {
    const raw = localStorage.getItem(DATA_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    return parsePersistedData(JSON.parse(raw) as unknown);
  } catch {
    return null;
  }
}

export function savePersistedData(data: PersistedData): void {
  try {
    localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore quota / private mode
  }
}

export function emptyPersistedData(): PersistedData {
  return {
    schemaVersion: DATA_SCHEMA_VERSION,
    games: [],
    activeGameId: null,
  };
}
