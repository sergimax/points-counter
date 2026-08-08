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
import { useState } from "react";
import { useTranslation } from "../../i18n/use-translation.ts";
import type { AppViewId } from "../../types/app-view.ts";

type AppToolbarActionsProps = {
  activeView: AppViewId;
  onChangeView: (view: AppViewId) => void;
  hasActiveGame: boolean;
};

export function AppToolbarActions({
  activeView,
  onChangeView,
  hasActiveGame,
}: AppToolbarActionsProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isCompact = useMediaQuery(theme.breakpoints.down("md"));
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  function closeMenu(): void {
    setMenuAnchor(null);
  }

  function navButton(view: AppViewId, label: string) {
    const selected = activeView === view;
    const isNew = view === "new";
    const disabled = view === "current" && !hasActiveGame;
    return (
      <Button
        size="small"
        variant={selected || isNew ? "contained" : "outlined"}
        color={selected ? "inherit" : isNew ? "secondary" : "inherit"}
        disabled={disabled}
        onClick={() => onChangeView(view)}
      >
        {label}
      </Button>
    );
  }

  if (isCompact) {
    return (
      <>
        <IconButton
          size="small"
          color="inherit"
          aria-label={t("toolbar.menu")}
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
            selected={activeView === "new"}
            onClick={() => {
              closeMenu();
              onChangeView("new");
            }}
          >
            <ListItemText>{t("toolbar.newGame")}</ListItemText>
          </MenuItem>
          <MenuItem
            selected={activeView === "current"}
            disabled={!hasActiveGame}
            onClick={() => {
              closeMenu();
              onChangeView("current");
            }}
          >
            <ListItemText>{t("toolbar.currentGame")}</ListItemText>
          </MenuItem>
          <MenuItem
            selected={activeView === "games"}
            onClick={() => {
              closeMenu();
              onChangeView("games");
            }}
          >
            <ListItemText>{t("toolbar.games")}</ListItemText>
          </MenuItem>
        </Menu>
      </>
    );
  }

  return (
    <Box
      sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "nowrap" }}
    >
      {navButton("new", t("toolbar.newGame"))}
      {navButton("current", t("toolbar.currentGame"))}
      {navButton("games", t("toolbar.games"))}
    </Box>
  );
}
