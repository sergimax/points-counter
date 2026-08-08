import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import {
  Box,
  Button,
  IconButton,
  InputBase,
  Paper,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "../../i18n/use-translation.ts";
import { formatDateTime } from "../../lib/format-date.ts";
import { getColorTokens } from "../../lib/player-colors.ts";
import type { GameModel } from "../../stores/game-model.ts";
import { useRootStore } from "../../stores/use-root-store.ts";
import { GameIcon, PlayerIcon } from "../entity-icons/index.tsx";
import { RoundHistory } from "../round-history/index.tsx";

/** GitHub-style signed delta for the open round (+3 / -2 / 0). */
function formatRoundDiff(delta: number): string {
  if (delta > 0) {
    return `+${delta}`;
  }
  return String(delta);
}

function parseScoreDraft(raw: string): number | null {
  const trimmed = raw.trim();
  if (trimmed === "" || trimmed === "+" || trimmed === "-") {
    return null;
  }
  if (!/^[+-]?\d+$/.test(trimmed)) {
    return null;
  }
  const value = Number(trimmed);
  return Number.isSafeInteger(value) ? value : null;
}

function useDiffTone(delta: number) {
  const theme = useTheme();
  const tone = delta > 0 ? "success" : delta < 0 ? "error" : "neutral";
  const color =
    tone === "success"
      ? theme.palette.success.main
      : tone === "error"
        ? theme.palette.error.main
        : theme.palette.text.secondary;
  const bgcolor =
    tone === "success"
      ? alpha(theme.palette.success.main, theme.palette.mode === "light" ? 0.12 : 0.2)
      : tone === "error"
        ? alpha(theme.palette.error.main, theme.palette.mode === "light" ? 0.12 : 0.2)
        : alpha(theme.palette.text.primary, 0.06);
  return { color, bgcolor };
}

const RoundScoreInput = observer(function RoundScoreInput({
  game,
  playerId,
  playerName,
}: {
  game: GameModel;
  playerId: string;
  playerName: string;
}) {
  const { t } = useTranslation();
  const roundDelta = game.roundScore(playerId);
  const [focused, setFocused] = useState(false);
  const [draft, setDraft] = useState("");
  const skipCommitRef = useRef(false);
  const display = focused ? draft : formatRoundDiff(roundDelta);
  const toneValue = focused
    ? (parseScoreDraft(draft) ?? roundDelta)
    : roundDelta;
  const { color, bgcolor } = useDiffTone(toneValue);

  // Keep the field in sync when +/- changes the store while editing.
  useEffect(() => {
    if (!focused) {
      return;
    }
    setDraft(String(roundDelta));
  }, [roundDelta, focused]);

  const commitDraft = () => {
    if (!skipCommitRef.current) {
      const parsed = parseScoreDraft(draft);
      if (parsed !== null) {
        game.setScore(playerId, parsed);
      }
    }
    skipCommitRef.current = false;
    setFocused(false);
  };

  return (
    <Stack
      direction="row"
      spacing={0.25}
      sx={{ alignItems: "center", justifyContent: "center" }}
    >
      <IconButton
        size="small"
        onClick={() => game.adjustScore(playerId, -1)}
        aria-label={t("score.minus", { name: playerName })}
      >
        <RemoveIcon fontSize="small" />
      </IconButton>
      <InputBase
        value={display}
        onFocus={(event) => {
          setDraft(String(roundDelta));
          setFocused(true);
          event.target.select();
        }}
        onChange={(event) => {
          const next = event.target.value;
          if (next === "" || /^[+-]?\d*$/.test(next)) {
            setDraft(next);
          }
        }}
        onBlur={commitDraft}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.currentTarget.blur();
          }
          if (event.key === "Escape") {
            skipCommitRef.current = true;
            event.currentTarget.blur();
          }
        }}
        inputProps={{
          "aria-label": t("score.diff", { value: display }),
          inputMode: "numeric",
        }}
        sx={{
          width: "3.5rem",
          bgcolor,
          color,
          border: `1px solid ${alpha(color, 0.35)}`,
          borderRadius: 1,
          fontFamily: "var(--font-mono)",
          fontWeight: 700,
          fontSize: "1.05rem",
          letterSpacing: "-0.02em",
          "& .MuiInputBase-input": {
            textAlign: "center",
            py: 0.35,
            px: 0.5,
            lineHeight: 1.2,
          },
          "&.Mui-focused": {
            outline: `2px solid ${alpha(color, 0.45)}`,
            outlineOffset: 1,
          },
        }}
      />
      <IconButton
        size="small"
        color="primary"
        onClick={() => game.adjustScore(playerId, 1)}
        aria-label={t("score.plus", { name: playerName })}
      >
        <AddIcon fontSize="small" />
      </IconButton>
    </Stack>
  );
});

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
  const closedTotal = game.closedScore(player.id);
  const resultingTotal = game.gameTotal(player.id);

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 1.5,
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "minmax(0, 1fr) auto",
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

      <Stack
        direction="row"
        spacing={{ xs: 1, sm: 1.25 }}
        sx={{
          alignItems: "stretch",
          justifyContent: { xs: "flex-start", sm: "flex-end" },
          flexWrap: "wrap",
        }}
      >
        <Box sx={{ textAlign: "right", minWidth: "3rem" }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block" }}
          >
            {t("game.before")}
          </Typography>
          <Typography
            color="text.secondary"
            sx={{
              fontFamily: "var(--font-mono)",
              fontWeight: 600,
              fontSize: "1.25rem",
              lineHeight: 1.2,
            }}
          >
            {closedTotal}
          </Typography>
        </Box>

        <Typography
          aria-hidden
          color="text.disabled"
          sx={{ alignSelf: "center", px: 0.25, fontSize: "1.1rem" }}
        >
          →
        </Typography>

        <Box sx={{ textAlign: "center", minWidth: "4.5rem" }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block" }}
          >
            {t("game.forRound")}
          </Typography>
          <RoundScoreInput
            game={game}
            playerId={player.id}
            playerName={player.name}
          />
        </Box>

        <Typography
          aria-hidden
          color="text.disabled"
          sx={{ alignSelf: "center", px: 0.25, fontSize: "1.1rem" }}
        >
          →
        </Typography>

        <Box sx={{ textAlign: "left", minWidth: "3rem" }}>
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
              fontWeight: 700,
              fontSize: "1.25rem",
              lineHeight: 1.2,
              color: color.main,
            }}
          >
            {resultingTotal}
          </Typography>
        </Box>
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
