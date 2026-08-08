import type { GameIconId, PlayerIconId } from "../../types/game.ts";
import { GAME_ICON_MAP, PLAYER_ICON_MAP } from "./icon-maps.ts";

export function GameIcon({
  iconId,
  fontSize = "small",
}: {
  iconId: GameIconId;
  fontSize?: "inherit" | "small" | "medium" | "large";
}) {
  const Icon = GAME_ICON_MAP[iconId];
  return <Icon fontSize={fontSize} />;
}

export function PlayerIcon({
  iconId,
  fontSize = "small",
}: {
  iconId: PlayerIconId;
  fontSize?: "inherit" | "small" | "medium" | "large";
}) {
  const Icon = PLAYER_ICON_MAP[iconId];
  return <Icon fontSize={fontSize} />;
}
