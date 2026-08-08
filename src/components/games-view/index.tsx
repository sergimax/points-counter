import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import {
  Box,
  Button,
  Chip,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { observer } from "mobx-react-lite";
import { useTranslation } from "../../i18n/use-translation.ts";
import { getColorTokens } from "../../lib/player-colors.ts";
import type { GameModel } from "../../stores/game-model.ts";
import { useRootStore } from "../../stores/use-root-store.ts";
import { GameIcon } from "../entity-icons/index.tsx";

type GamesViewProps = {
  onActivated: () => void;
};

function formatUpdated(iso: string, locale: string): string {
  try {
    return new Intl.DateTimeFormat(locale, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

const GameListItem = observer(function GameListItem({
  game,
  onActivated,
}: {
  game: GameModel;
  onActivated: () => void;
}) {
  const { t, locale } = useTranslation();
  const rootStore = useRootStore();
  const isActive = game.status === "active";
  const gameColor = getColorTokens(game.colorId);

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 1.5,
        borderLeft: isActive
          ? `3px solid ${gameColor.main}`
          : `3px solid color-mix(in srgb, ${gameColor.main} 35%, transparent)`,
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.25}
        sx={{
          alignItems: { sm: "center" },
          justifyContent: "space-between",
        }}
      >
        <Stack
          direction="row"
          spacing={1.25}
          sx={{ alignItems: "center", minWidth: 0 }}
        >
          <Box
            sx={{
              display: "grid",
              placeItems: "center",
              width: 36,
              height: 36,
              borderRadius: 1,
              bgcolor: gameColor.soft,
              color: gameColor.main,
              flexShrink: 0,
            }}
          >
            <GameIcon iconId={game.iconId} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="subtitle1"
              noWrap
              sx={{ fontFamily: "var(--font-display)", lineHeight: 1.2 }}
            >
              {game.title}
            </Typography>
            <Stack
              direction="row"
              spacing={1}
              sx={{ alignItems: "center", flexWrap: "wrap" }}
            >
              <Chip
                size="small"
                label={
                  isActive ? t("game.activeBadge") : t("game.pausedBadge")
                }
                color={isActive ? "secondary" : "default"}
                variant={isActive ? "filled" : "outlined"}
              />
              <Typography variant="caption" color="text.secondary">
                {t("game.updated", {
                  date: formatUpdated(game.updatedAt, locale),
                })}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t("game.players")}: {game.players.length}
              </Typography>
            </Stack>
          </Box>
        </Stack>

        <Stack direction="row" spacing={0.75} sx={{ flexShrink: 0 }}>
          {isActive ? (
            <Button
              size="small"
              startIcon={<PauseIcon />}
              onClick={() => rootStore.pauseActiveGame()}
            >
              {t("game.pause")}
            </Button>
          ) : (
            <Button
              size="small"
              variant="contained"
              color="primary"
              startIcon={<PlayArrowIcon />}
              onClick={() => {
                rootStore.activateGame(game.id);
                onActivated();
              }}
            >
              {t("game.activate")}
            </Button>
          )}
          <IconButton
            size="small"
            color="error"
            aria-label={t("game.delete")}
            onClick={() => {
              const confirmed = window.confirm(
                t("game.deleteConfirm", { title: game.title }),
              );
              if (confirmed) {
                rootStore.deleteGame(game.id);
              }
            }}
          >
            <DeleteOutlinedIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Stack>
    </Paper>
  );
});

export const GamesView = observer(function GamesView({
  onActivated,
}: GamesViewProps) {
  const { t } = useTranslation();
  const rootStore = useRootStore();

  return (
    <Stack spacing={1.5} sx={{ maxWidth: 720 }}>
      <Typography
        component="h2"
        variant="h6"
        sx={{ fontFamily: "var(--font-display)" }}
      >
        {t("panel.gamesTitle")}
      </Typography>

      {rootStore.sortedGames.length === 0 ? (
        <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography color="text.secondary">{t("empty.noGames")}</Typography>
        </Paper>
      ) : (
        <Stack spacing={1.25}>
          {rootStore.sortedGames.map((game) => (
            <GameListItem
              key={game.id}
              game={game}
              onActivated={onActivated}
            />
          ))}
        </Stack>
      )}
    </Stack>
  );
});
