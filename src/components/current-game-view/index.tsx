import AddIcon from "@mui/icons-material/Add";
import PauseIcon from "@mui/icons-material/Pause";
import RemoveIcon from "@mui/icons-material/Remove";
import { Box, Button, IconButton, Paper, Stack, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useTranslation } from "../../i18n/use-translation.ts";
import { formatDateTime } from "../../lib/format-date.ts";
import { getColorTokens } from "../../lib/player-colors.ts";
import type { GameModel } from "../../stores/game-model.ts";
import { useRootStore } from "../../stores/use-root-store.ts";
import { GameIcon, PlayerIcon } from "../entity-icons/index.tsx";
import { RoundHistory } from "../round-history/index.tsx";

const PlayerScoreRow = observer(function PlayerScoreRow({
  game,
  playerId,
}: {
  game: GameModel;
  playerId: string;
}) {
  const { t } = useTranslation();
  const player = game.players.find((entry) => entry.id === playerId);
  if (!player) {
    return null;
  }
  const color = getColorTokens(player.colorId);

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 1.5,
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "minmax(0, 1.4fr) auto auto",
        },
        gap: 1.25,
        alignItems: "center",
        borderLeft: `3px solid ${color.main}`,
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
            bgcolor: color.soft,
            color: color.main,
            flexShrink: 0,
          }}
        >
          <PlayerIcon iconId={player.iconId} />
        </Box>
        <Typography
          variant="subtitle1"
          noWrap
          sx={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
        >
          {player.name}
        </Typography>
      </Stack>

      <Stack direction="row" spacing={2} sx={{ alignItems: "baseline" }}>
        <Box>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block" }}
          >
            {t("game.round")}
          </Typography>
          <Typography
            sx={{
              fontFamily: "var(--font-mono)",
              fontWeight: 600,
              fontSize: "1.25rem",
              lineHeight: 1.2,
            }}
          >
            {game.roundScore(player.id)}
          </Typography>
        </Box>
        <Box>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block" }}
          >
            {t("game.summary")}
          </Typography>
          <Typography
            sx={{
              fontFamily: "var(--font-mono)",
              fontWeight: 600,
              fontSize: "1.25rem",
              lineHeight: 1.2,
              color: color.main,
            }}
          >
            {game.gameTotal(player.id)}
          </Typography>
        </Box>
      </Stack>

      <Stack
        direction="row"
        spacing={0.5}
        sx={{ justifyContent: { xs: "flex-start", sm: "flex-end" } }}
      >
        <IconButton
          size="small"
          onClick={() => game.adjustScore(player.id, -1)}
          aria-label={t("score.minus", { name: player.name })}
        >
          <RemoveIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          color="primary"
          onClick={() => game.adjustScore(player.id, 1)}
          aria-label={t("score.plus", { name: player.name })}
        >
          <AddIcon fontSize="small" />
        </IconButton>
      </Stack>
    </Paper>
  );
});

export const CurrentGameView = observer(function CurrentGameView() {
  const { t, locale } = useTranslation();
  const rootStore = useRootStore();
  const game = rootStore.activeGame;

  if (!game) {
    return (
      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, maxWidth: 720 }}>
        <Typography
          variant="h6"
          sx={{ fontFamily: "var(--font-display)", mb: 0.75 }}
        >
          {t("empty.noActiveGame")}
        </Typography>
        <Typography color="text.secondary">
          {t("empty.noActiveGameHint")}
        </Typography>
      </Paper>
    );
  }

  const gameColor = getColorTokens(game.colorId);

  return (
    <Stack spacing={2} sx={{ maxWidth: 720 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.25}
        sx={{
          alignItems: { sm: "center" },
          justifyContent: "space-between",
        }}
      >
        <Stack direction="row" spacing={1.25} sx={{ alignItems: "center", minWidth: 0 }}>
          <Box
            sx={{
              display: "grid",
              placeItems: "center",
              width: 40,
              height: 40,
              borderRadius: 1,
              bgcolor: gameColor.soft,
              color: gameColor.main,
              border: `1px solid color-mix(in srgb, ${gameColor.main} 45%, transparent)`,
              flexShrink: 0,
            }}
          >
            <GameIcon iconId={game.iconId} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              component="h2"
              variant="h6"
              noWrap
              sx={{ fontFamily: "var(--font-display)", lineHeight: 1.2 }}
            >
              {game.title}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
              {t("game.roundNumber", { number: game.nextRoundNumber })}
              {" · "}
              {t("game.roundStarted", {
                date: formatDateTime(game.currentRoundStartedAt, locale),
              })}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
              {t("game.created", {
                date: formatDateTime(game.createdAt, locale),
              })}
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={1} sx={{ flexShrink: 0, flexWrap: "wrap" }}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => rootStore.closeActiveRound()}
          >
            {t("toolbar.closeRound")}
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<PauseIcon />}
            onClick={() => rootStore.pauseActiveGame()}
          >
            {t("toolbar.pauseGame")}
          </Button>
        </Stack>
      </Stack>

      <Stack spacing={1.25}>
        {game.players.map((player) => (
          <PlayerScoreRow key={player.id} game={game} playerId={player.id} />
        ))}
      </Stack>

      <RoundHistory game={game} />
    </Stack>
  );
});
