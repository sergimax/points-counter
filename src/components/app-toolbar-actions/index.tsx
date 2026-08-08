import MenuIcon from "@mui/icons-material/Menu";
import {
  Box,
  Button,
  IconButton,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { useLayoutEffect, useRef, useState } from "react";
import { useTranslation } from "../../i18n/use-translation.ts";
import type { AppViewId } from "../../types/app-view.ts";

type AppToolbarActionsProps = {
  activeView: AppViewId;
  onChangeView: (view: AppViewId) => void;
  hasActiveGame: boolean;
};

/** Rough width needed for Current + Games + New as small buttons (RU labels are longer). */
const INLINE_NAV_MIN_WIDTH_PX = 360;

export function AppToolbarActions({
  activeView,
  onChangeView,
  hasActiveGame,
}: AppToolbarActionsProps) {
  const { t } = useTranslation();
  const slotRef = useRef<HTMLDivElement>(null);
  const [useMenu, setUseMenu] = useState(true);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  useLayoutEffect(() => {
    const node = slotRef.current;
    if (!node) {
      return;
    }

    const update = (): void => {
      setUseMenu(node.clientWidth < INLINE_NAV_MIN_WIDTH_PX);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  function closeMenu(): void {
    setMenuAnchor(null);
  }

  function navButton(view: AppViewId, label: string) {
    const selected = activeView === view;
    const disabled = view === "current" && !hasActiveGame;
    return (
      <Button
        key={view}
        size="small"
        variant={selected ? "contained" : "outlined"}
        color="inherit"
        disabled={disabled}
        onClick={() => onChangeView(view)}
        sx={{ flexShrink: 0 }}
      >
        {label}
      </Button>
    );
  }

  return (
    <Box
      ref={slotRef}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: { xs: "flex-end", md: "center" },
        gap: 1,
        width: "100%",
        minWidth: 0,
      }}
    >
      {useMenu ? (
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
            <MenuItem
              selected={activeView === "new"}
              onClick={() => {
                closeMenu();
                onChangeView("new");
              }}
            >
              <ListItemText>{t("toolbar.newGame")}</ListItemText>
            </MenuItem>
          </Menu>
        </>
      ) : (
        <>
          {navButton("current", t("toolbar.currentGame"))}
          {navButton("games", t("toolbar.games"))}
          {navButton("new", t("toolbar.newGame"))}
        </>
      )}
    </Box>
  );
}
