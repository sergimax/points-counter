import AddIcon from "@mui/icons-material/Add";
import {
  Box,
  Button,
  FormHelperText,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { useState } from "react";
import { useTranslation } from "../../i18n/use-translation.ts";
import { getColorTokens } from "../../lib/player-colors.ts";
import {
  COLOR_IDS,
  PLAYER_ICON_IDS,
  type ColorId,
  type NewPlayerInput,
  type PlayerIconId,
} from "../../types/game.ts";
import { PlayerIcon } from "../entity-icons/index.tsx";

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

type AddPlayerFormProps = {
  /** Used to pick a default icon/color for the next seat. */
  nextPlayerIndex: number;
  onAdd: (player: NewPlayerInput) => void;
};

export function AddPlayerForm({ nextPlayerIndex, onAdd }: AddPlayerFormProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [iconId, setIconId] = useState<PlayerIconId>(
    PLAYER_ICON_IDS[nextPlayerIndex % PLAYER_ICON_IDS.length],
  );
  const [colorId, setColorId] = useState<ColorId>(
    COLOR_IDS[nextPlayerIndex % COLOR_IDS.length],
  );
  const [error, setError] = useState<string | null>(null);
  const color = getColorTokens(colorId);

  function resetDraft(index: number): void {
    setName("");
    setIconId(PLAYER_ICON_IDS[index % PLAYER_ICON_IDS.length]);
    setColorId(COLOR_IDS[index % COLOR_IDS.length]);
    setError(null);
  }

  function handleSubmit(): void {
    if (!name.trim()) {
      setError(t("error.playerNameRequired"));
      return;
    }
    onAdd({ name, iconId, colorId });
    const followingIndex = nextPlayerIndex + 1;
    resetDraft(followingIndex);
    setOpen(false);
  }

  if (!open) {
    return (
      <Button
        size="small"
        startIcon={<AddIcon />}
        onClick={() => {
          resetDraft(nextPlayerIndex);
          setOpen(true);
        }}
      >
        {t("dialog.addPlayer")}
      </Button>
    );
  }

  return (
    <Box
      sx={{
        p: 1.5,
        border: 1,
        borderColor: "divider",
        borderRadius: 1,
        bgcolor: "background.paper",
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{ fontFamily: "var(--font-display)", mb: 1.25 }}
      >
        {t("dialog.addPlayer")}
      </Typography>
      <Stack spacing={1.25}>
        <TextField
          label={t("dialog.playerName")}
          value={name}
          onChange={(event) => setName(event.target.value)}
          size="small"
          autoFocus
          sx={{ width: "100%", maxWidth: 320 }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleSubmit();
            }
          }}
        />
        <Box>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mb: 0.75, display: "block" }}
          >
            {t("dialog.playerColor")}
          </Typography>
          <ToggleButtonGroup
            exclusive
            size="small"
            value={colorId}
            onChange={(_event, next: ColorId | null) => {
              if (next) {
                setColorId(next);
              }
            }}
            aria-label={t("dialog.playerColor")}
            sx={colorPickerGroupSx}
          >
            {COLOR_IDS.map((id) => {
              const tokens = getColorTokens(id);
              const selected = colorId === id;
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
        </Box>
        <Box>
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
            value={iconId}
            onChange={(_event, value: PlayerIconId | null) => {
              if (value) {
                setIconId(value);
              }
            }}
            aria-label={t("dialog.playerIcon")}
            sx={iconPickerGroupSx}
          >
            {PLAYER_ICON_IDS.map((id) => (
              <ToggleButton key={id} value={id} aria-label={id}>
                <Box sx={{ color: color.main, display: "inline-flex" }}>
                  <PlayerIcon iconId={id} />
                </Box>
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>
        {error ? <FormHelperText error>{error}</FormHelperText> : null}
        <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end" }}>
          <Button
            size="small"
            onClick={() => {
              setOpen(false);
              setError(null);
            }}
          >
            {t("dialog.cancel")}
          </Button>
          <Button
            size="small"
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleSubmit}
          >
            {t("dialog.addPlayer")}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
