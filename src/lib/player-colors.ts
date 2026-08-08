import type { ColorId } from "../types/game.ts";
import { COLOR_IDS } from "../types/game.ts";

export type ColorTokens = {
  main: string;
  soft: string;
};

/** Shared game/player colors — readable in light and dark app chrome. */
export const COLOR_TOKENS: Record<ColorId, ColorTokens> = {
  rose: { main: "#e11d48", soft: "rgba(225, 29, 72, 0.16)" },
  orange: { main: "#ea580c", soft: "rgba(234, 88, 12, 0.16)" },
  amber: { main: "#d97706", soft: "rgba(217, 119, 6, 0.18)" },
  lime: { main: "#65a30d", soft: "rgba(101, 163, 13, 0.18)" },
  teal: { main: "#0d9488", soft: "rgba(13, 148, 136, 0.18)" },
  sky: { main: "#0284c7", soft: "rgba(2, 132, 199, 0.18)" },
  violet: { main: "#7c3aed", soft: "rgba(124, 58, 237, 0.18)" },
  fuchsia: { main: "#c026d3", soft: "rgba(192, 38, 211, 0.16)" },
};

export function getColorTokens(colorId: ColorId): ColorTokens {
  return COLOR_TOKENS[colorId];
}

/** @deprecated Prefer getColorTokens */
export const getPlayerColorTokens = getColorTokens;

export function defaultColorId(index: number): ColorId {
  return COLOR_IDS[index % COLOR_IDS.length];
}

/** @deprecated Prefer defaultColorId */
export const defaultPlayerColorId = defaultColorId;
