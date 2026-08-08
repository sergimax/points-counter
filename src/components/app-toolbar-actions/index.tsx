import MenuIcon from "@mui/icons-material/Menu";
import {
  Box,
  Button,
  IconButton,
  ListItemText,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { useTranslation } from "../../i18n/use-translation.ts";
import { useRootStore } from "../../stores/use-root-store.ts";

export type ToolbarPanelId = "games" | null;

type AppToolbarActionsProps = {
  openPanel: ToolbarPanelId;
  onToggleGames: () => void;
  onOpenNewGame: () => void;
};

export const AppToolbarActions = observer(function AppToolbarActions({
  openPanel,
  onToggleGames,
  onOpenNewGame,
}: AppToolbarActionsProps) {
  const { t } = useTranslation();
  const rootStore = useRootStore();
  const theme = useTheme();
  const isCompact = useMediaQuery(theme.breakpoints.down("md"));
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const hasActiveGame = Boolean(rootStore.activeGame);

  function closeMenu(): void {
    setMenuAnchor(null);
  }

  const gamesOpen = openPanel === "games";

  if (isCompact) {
    return (
      <>
        <IconButton
          size="small"
          color="inherit"
          aria-label={t("toolbar.games")}
          onClick={(event) => setMenuAnchor(event.currentTarget)}
        >
          <MenuIcon />
        </IconButton>
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={closeMenu}
        >
          <MenuItem
            onClick={() => {
              closeMenu();
              onOpenNewGame();
            }}
          >
            <ListItemText>{t("toolbar.newGame")}</ListItemText>
          </MenuItem>
          <MenuItem
            selected={gamesOpen}
            onClick={() => {
              closeMenu();
              onToggleGames();
            }}
          >
            <ListItemText>{t("toolbar.games")}</ListItemText>
          </MenuItem>
          <MenuItem
            disabled={!hasActiveGame}
            onClick={() => {
              closeMenu();
              rootStore.closeActiveRound();
            }}
          >
            <ListItemText>{t("toolbar.closeRound")}</ListItemText>
          </MenuItem>
          <MenuItem
            disabled={!hasActiveGame}
            onClick={() => {
              closeMenu();
              rootStore.pauseActiveGame();
            }}
          >
            <ListItemText>{t("toolbar.pauseGame")}</ListItemText>
          </MenuItem>
        </Menu>
      </>
    );
  }

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "nowrap" }}>
      <Button size="small" variant="contained" color="secondary" onClick={onOpenNewGame}>
        {t("toolbar.newGame")}
      </Button>
      <Button
        size="small"
        variant={gamesOpen ? "contained" : "outlined"}
        color={gamesOpen ? "inherit" : "inherit"}
        onClick={onToggleGames}
      >
        {t("toolbar.games")}
      </Button>
      <Button
        size="small"
        variant="outlined"
        disabled={!hasActiveGame}
        onClick={() => rootStore.closeActiveRound()}
      >
        {t("toolbar.closeRound")}
      </Button>
      <Button
        size="small"
        variant="outlined"
        disabled={!hasActiveGame}
        onClick={() => rootStore.pauseActiveGame()}
      >
        {t("toolbar.pauseGame")}
      </Button>
    </Box>
  );
});
