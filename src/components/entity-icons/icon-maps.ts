import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import BoltIcon from "@mui/icons-material/Bolt";
import CasinoIcon from "@mui/icons-material/Casino";
import DiamondIcon from "@mui/icons-material/Diamond";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ExtensionIcon from "@mui/icons-material/Extension";
import FaceIcon from "@mui/icons-material/Face";
import FlagIcon from "@mui/icons-material/Flag";
import GridViewIcon from "@mui/icons-material/GridView";
import GroupsIcon from "@mui/icons-material/Groups";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import MapIcon from "@mui/icons-material/Map";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import PersonIcon from "@mui/icons-material/Person";
import PetsIcon from "@mui/icons-material/Pets";
import PsychologyIcon from "@mui/icons-material/Psychology";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import SportsMartialArtsIcon from "@mui/icons-material/SportsMartialArts";
import SportsScoreIcon from "@mui/icons-material/SportsScore";
import StarIcon from "@mui/icons-material/Star";
import StyleIcon from "@mui/icons-material/Style";
import TimerIcon from "@mui/icons-material/Timer";
import ToysIcon from "@mui/icons-material/Toys";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import type { ComponentType } from "react";
import type { GameIconId, PlayerIconId } from "../../types/game.ts";

export type AppSvgIcon = ComponentType<SvgIconProps>;

export const GAME_ICON_MAP: Record<GameIconId, AppSvgIcon> = {
  casino: CasinoIcon,
  sportsEsports: SportsEsportsIcon,
  style: StyleIcon,
  extension: ExtensionIcon,
  gridView: GridViewIcon,
  star: StarIcon,
  emojiEvents: EmojiEventsIcon,
  sportsScore: SportsScoreIcon,
  groups: GroupsIcon,
  toys: ToysIcon,
  shuffle: ShuffleIcon,
  bolt: BoltIcon,
  diamond: DiamondIcon,
  militaryTech: MilitaryTechIcon,
  flag: FlagIcon,
  timer: TimerIcon,
  map: MapIcon,
  autoAwesome: AutoAwesomeIcon,
};

export const PLAYER_ICON_MAP: Record<PlayerIconId, AppSvgIcon> = {
  person: PersonIcon,
  face: FaceIcon,
  emojiEmotions: EmojiEmotionsIcon,
  pets: PetsIcon,
  psychology: PsychologyIcon,
  sportsMartialArts: SportsMartialArtsIcon,
  musicNote: MusicNoteIcon,
  localFlorist: LocalFloristIcon,
};
