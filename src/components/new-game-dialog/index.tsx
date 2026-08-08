import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  IconButton,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { useState } from "react";
import { useTranslation } from "../../i18n/use-translation.ts";
import { useRootStore } from "../../stores/use-root-store.ts";
import {
  COLOR_IDS,
  GAME_ICON_IDS,
  MAX_PLAYERS,
  MIN_PLAYERS,
  PLAYER_ICON_IDS,
  type ColorId,
  type GameIconId,
  type NewPlayerInput,
  type PlayerIconId,
} from "../../types/game.ts";
import { getColorTokens } from "../../lib/player-colors.ts";
import { GameIcon, PlayerIcon } from "../entity-icons/index.tsx";

type NewGameDialogProps = {
  open: boolean;
  onClose: () => void;
};

type DraftPlayer = NewPlayerInput & { key: string };

/** Full-width wrap grid; selected = brand soft fill (clear vs default MUI grey). */
const iconPickerGroupSx: SxProps<Theme> = {
  display: "flex",
  flexWrap: "wrap",
  gap: 0.75,
  width: "100%",
  "& .MuiToggleButtonGroup-grouped": {
    margin: "0 !important",
    border: "1px solid",
    borderColor: "divider",
    borderRadius: "8px !important",
  },
  "& .MuiToggleButton-root": {
    px: 1,
    py: 0.75,
    color: "text.secondary",
    bgcolor: "action.hover",
    "&:hover": {
      bgcolor: "action.selected",
      borderColor: "var(--brand-border)",
    },
    "&.Mui-selected": {
      bgcolor: "var(--brand-soft)",
      color: "var(--brand)",
      borderColor: "var(--brand-border)",
      boxShadow: "inset 0 0 0 1px var(--brand-border)",
      "&:hover": {
        bgcolor: "var(--brand-soft)",
        color: "var(--brand)",
        borderColor: "var(--brand)",
      },
    },
  },
};

const colorPickerGroupSx: SxProps<Theme> = {
  display: "flex",
  flexWrap: "wrap",
  gap: 0.75,
  width: "100%",
  "& .MuiToggleButtonGroup-grouped": {
    margin: "0 !important",
    border: "1px solid",
    borderColor: "divider",
    borderRadius: "8px !important",
  },
  "& .MuiToggleButton-root": {
    minWidth: 36,
    minHeight: 36,
    p: 0.5,
    bgcolor: "action.hover",
  },
};

function ColorSwatchPicker({
  value,
  onChange,
  ariaLabel,
}: {
  value: ColorId;
  onChange: (colorId: ColorId) => void;
  ariaLabel: string;
}) {
  return (
    <ToggleButtonGroup
      exclusive
      size="small"
      value={value}
      onChange={(_event, next: ColorId | null) => {
        if (next) {
          onChange(next);
        }
      }}
      aria-label={ariaLabel}
      sx={colorPickerGroupSx}
    >
      {COLOR_IDS.map((id) => {
        const tokens = getColorTokens(id);
        const selected = value === id;
        return (
          <ToggleButton
            key={id}
            value={id}
            aria-label={id}
            sx={{
              "&.Mui-selected": {
                bgcolor: tokens.soft,
                borderColor: tokens.main,
                boxShadow: `inset 0 0 0 2px ${tokens.main}`,
              },
            }}
          >
            <Box
              sx={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                bgcolor: tokens.main,
                border: selected
                  ? "2px solid var(--surface)"
                  : "1px solid color-mix(in srgb, var(--border) 50%, transparent)",
                boxShadow: selected ? `0 0 0 1px ${tokens.main}` : undefined,
              }}
            />
          </ToggleButton>
        );
      })}
    </ToggleButtonGroup>
  );
}

function createDraftPlayer(index: number): DraftPlayer {
  return {
    key: `draft_${index}_${Date.now()}`,
    name: "",
    iconId: PLAYER_ICON_IDS[index % PLAYER_ICON_IDS.length],
    colorId: COLOR_IDS[index % COLOR_IDS.length],
  };
}

export function NewGameDialog({ open, onClose }: NewGameDialogProps) {
  const { t } = useTranslation();
  const rootStore = useRootStore();
  const [title, setTitle] = useState("");
  const [iconId, setIconId] = useState<GameIconId>(GAME_ICON_IDS[0]);
  const [colorId, setColorId] = useState<ColorId>(COLOR_IDS[0]);
  const [players, setPlayers] = useState<DraftPlayer[]>([
    createDraftPlayer(0),
    createDraftPlayer(1),
  ]);
  const [error, setError] = useState<string | null>(null);
  const gameColor = getColorTokens(colorId);

  function resetForm(): void {
    setTitle("");
    setIconId(GAME_ICON_IDS[0]);
    setColorId(COLOR_IDS[0]);
    setPlayers([createDraftPlayer(0), createDraftPlayer(1)]);
    setError(null);
  }

  function handleClose(): void {
    resetForm();
    onClose();
  }

  function handleCreate(): void {
    if (!title.trim()) {
      setError(t("error.titleRequired"));
      return;
    }
    if (players.some((player) => !player.name.trim())) {
      setError(t("error.playerNameRequired"));
      return;
    }

    rootStore.createGame({
      title,
      iconId,
      colorId,
      players: players.map(
        ({ name, iconId: playerIconId, colorId: playerColorId }) => ({
          name,
          iconId: playerIconId,
          colorId: playerColorId,
        }),
      ),
    });
    handleClose();
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        {t("dialog.newGameTitle")}
        <IconButton
          size="small"
          onClick={handleClose}
          aria-label={t("dialog.close")}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 0.5 }}>
          <TextField
            label={t("dialog.gameTitle")}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            size="small"
            fullWidth
            autoFocus
          />

          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mb: 0.75, display: "block" }}
            >
              {t("dialog.gameColor")}
            </Typography>
            <Box sx={{ mb: 1.25 }}>
              <ColorSwatchPicker
                value={colorId}
                onChange={setColorId}
                ariaLabel={t("dialog.gameColor")}
              />
            </Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mb: 0.75, display: "block" }}
            >
              {t("dialog.gameIcon")}
            </Typography>
            <ToggleButtonGroup
              exclusive
              size="small"
              value={iconId}
              onChange={(_event, value: GameIconId | null) => {
                if (value) {
                  setIconId(value);
                }
              }}
              sx={iconPickerGroupSx}
            >
              {GAME_ICON_IDS.map((id) => (
                <ToggleButton key={id} value={id} aria-label={id}>
                  <Box sx={{ color: gameColor.main, display: "inline-flex" }}>
                    <GameIcon iconId={id} />
                  </Box>
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>

          <Box>
            <Typography
              variant="subtitle2"
              sx={{ fontFamily: "var(--font-display)", mb: 1 }}
            >
              {t("dialog.players")}
            </Typography>
            <Stack spacing={1.5}>
              {players.map((player, index) => (
                <Box
                  key={player.key}
                  sx={{
                    p: 1.25,
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 1,
                    bgcolor: "background.paper",
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ alignItems: "center", mb: 1 }}
                  >
                    <TextField
                      label={`${t("dialog.playerName")} ${index + 1}`}
                      value={player.name}
                      onChange={(event) => {
                        const nextName = event.target.value;
                        setPlayers((previous) =>
                          previous.map((entry) =>
                            entry.key === player.key
                              ? { ...entry, name: nextName }
                              : entry,
                          ),
                        );
                      }}
                      size="small"
                      fullWidth
                    />
                    <IconButton
                      size="small"
                      color="error"
                      disabled={players.length <= MIN_PLAYERS}
                      onClick={() =>
                        setPlayers((previous) =>
                          previous.filter((entry) => entry.key !== player.key),
                        )
                      }
                      aria-label={t("dialog.removePlayer")}
                    >
                      <DeleteOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mb: 0.75, display: "block" }}
                  >
                    {t("dialog.playerColor")}
                  </Typography>
                  <Box sx={{ mb: 1.25 }}>
                    <ColorSwatchPicker
                      value={player.colorId}
                      onChange={(nextColorId) => {
                        setPlayers((previous) =>
                          previous.map((entry) =>
                            entry.key === player.key
                              ? { ...entry, colorId: nextColorId }
                              : entry,
                          ),
                        );
                      }}
                      ariaLabel={t("dialog.playerColor")}
                    />
                  </Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mb: 0.75, display: "block" }}
                  >
                    {t("dialog.playerIcon")}
                  </Typography>
                  <ToggleButtonGroup
                    exclusive
                    size="small"
                    value={player.iconId}
                    onChange={(_event, value: PlayerIconId | null) => {
                      if (!value) {
                        return;
                      }
                      setPlayers((previous) =>
                        previous.map((entry) =>
                          entry.key === player.key
                            ? { ...entry, iconId: value }
                            : entry,
                        ),
                      );
                    }}
                    aria-label={t("dialog.playerIcon")}
                    sx={iconPickerGroupSx}
                  >
                    {PLAYER_ICON_IDS.map((id) => {
                      const tokens = getColorTokens(player.colorId);
                      return (
                        <ToggleButton key={id} value={id} aria-label={id}>
                          <Box
                            sx={{ color: tokens.main, display: "inline-flex" }}
                          >
                            <PlayerIcon iconId={id} />
                          </Box>
                        </ToggleButton>
                      );
                    })}
                  </ToggleButtonGroup>
                </Box>
              ))}
            </Stack>
            <Button
              startIcon={<AddIcon />}
              onClick={() =>
                setPlayers((previous) => [
                  ...previous,
                  createDraftPlayer(previous.length),
                ])
              }
              disabled={players.length >= MAX_PLAYERS}
              size="small"
              sx={{ mt: 1.25 }}
            >
              {t("dialog.addPlayer")}
            </Button>
          </Box>

          {error ? <FormHelperText error>{error}</FormHelperText> : null}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose}>{t("dialog.cancel")}</Button>
        <Button variant="contained" color="primary" onClick={handleCreate}>
          {t("dialog.create")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
