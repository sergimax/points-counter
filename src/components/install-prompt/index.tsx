import GetAppOutlinedIcon from "@mui/icons-material/GetAppOutlined";
import { Alert, Button, Snackbar } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { migrateLocalStorageKey } from "../../lib/migrate-storage-key.ts";
import { useTranslation } from "../../i18n/use-translation.ts";

export const INSTALL_DISMISS_STORAGE_KEY = "points-install-dismissed";
export const LEGACY_INSTALL_DISMISS_STORAGE_KEY =
  "points-counter-install-dismissed";

migrateLocalStorageKey(
  LEGACY_INSTALL_DISMISS_STORAGE_KEY,
  INSTALL_DISMISS_STORAGE_KEY,
);

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isStandaloneDisplay(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  if (window.matchMedia("(display-mode: standalone)").matches) {
    return true;
  }
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return nav.standalone === true;
}

function wasDismissed(): boolean {
  try {
    return localStorage.getItem(INSTALL_DISMISS_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function rememberDismissed(): void {
  try {
    localStorage.setItem(INSTALL_DISMISS_STORAGE_KEY, "1");
  } catch {
    // ignore quota / private mode
  }
}

/**
 * Shows an install CTA when the browser fires `beforeinstallprompt`
 * (Chrome/Edge/Android). Hidden when already installed or previously dismissed.
 */
export function InstallPrompt() {
  const { t } = useTranslation();
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isStandaloneDisplay() || wasDismissed()) {
      return;
    }

    const onBeforeInstall = (event: Event): void => {
      event.preventDefault();
      deferredPrompt.current = event as BeforeInstallPromptEvent;
      setOpen(true);
    };

    const onInstalled = (): void => {
      deferredPrompt.current = null;
      setOpen(false);
      rememberDismissed();
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  async function handleInstall(): Promise<void> {
    const promptEvent = deferredPrompt.current;
    if (!promptEvent) {
      setOpen(false);
      return;
    }
    await promptEvent.prompt();
    await promptEvent.userChoice;
    deferredPrompt.current = null;
    setOpen(false);
  }

  function handleDismiss(): void {
    rememberDismissed();
    setOpen(false);
    deferredPrompt.current = null;
  }

  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      sx={{ bottom: { xs: 16, sm: 24 } }}
    >
      <Alert
        severity="info"
        icon={<GetAppOutlinedIcon fontSize="inherit" />}
        action={
          <>
            <Button color="inherit" size="small" onClick={handleDismiss}>
              {t("pwa.installDismiss")}
            </Button>
            <Button
              color="secondary"
              size="small"
              variant="contained"
              onClick={() => {
                void handleInstall();
              }}
              sx={{ ml: 0.5 }}
            >
              {t("pwa.installAction")}
            </Button>
          </>
        }
        sx={{
          width: "100%",
          maxWidth: 440,
          alignItems: "center",
          boxShadow: (theme) =>
            theme.palette.mode === "dark"
              ? "0 8px 24px rgba(0, 0, 0, 0.45)"
              : "0 8px 24px rgba(0, 0, 0, 0.12)",
        }}
      >
        {t("pwa.installHint")}
      </Alert>
    </Snackbar>
  );
}
