export const DATA_STORAGE_KEY = "points-counter-data";
export const DATA_SCHEMA_VERSION = 1;
export const MAX_PLAYERS = 8;
export const MIN_PLAYERS = 1;

export const GAME_ICON_IDS = [
  "casino",
  "sportsEsports",
  "style",
  "extension",
  "gridView",
  "star",
  "emojiEvents",
  "sportsScore",
  "groups",
  "toys",
  "shuffle",
  "bolt",
  "diamond",
  "militaryTech",
  "flag",
  "timer",
  "map",
  "autoAwesome",
] as const;

export const PLAYER_ICON_IDS = [
  "person",
  "face",
  "emojiEmotions",
  "pets",
  "psychology",
  "sportsMartialArts",
  "musicNote",
  "localFlorist",
] as const;

export const COLOR_IDS = [
  "rose",
  "orange",
  "amber",
  "lime",
  "teal",
  "sky",
  "violet",
  "fuchsia",
] as const;

/** @deprecated Use COLOR_IDS — same palette for games and players. */
export const PLAYER_COLOR_IDS = COLOR_IDS;

export type GameIconId = (typeof GAME_ICON_IDS)[number];
export type PlayerIconId = (typeof PLAYER_ICON_IDS)[number];
export type ColorId = (typeof COLOR_IDS)[number];
export type PlayerColorId = ColorId;
export type GameStatus = "active" | "paused";

export type Player = {
  id: string;
  name: string;
  iconId: PlayerIconId;
  colorId: ColorId;
};

export type Round = {
  id: string;
  number: number;
  scores: Record<string, number>;
  closedAt: string;
};

export type GameSnapshot = {
  id: string;
  title: string;
  iconId: GameIconId;
  colorId: ColorId;
  status: GameStatus;
  players: Player[];
  rounds: Round[];
  currentScores: Record<string, number>;
  createdAt: string;
  updatedAt: string;
};

export type PersistedData = {
  schemaVersion: number;
  games: GameSnapshot[];
  activeGameId: string | null;
};

export type NewPlayerInput = {
  name: string;
  iconId: PlayerIconId;
  colorId: ColorId;
};

export type CreateGameInput = {
  title: string;
  iconId: GameIconId;
  colorId: ColorId;
  players: NewPlayerInput[];
};
