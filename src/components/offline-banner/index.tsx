import CloudOffOutlinedIcon from "@mui/icons-material/CloudOffOutlined";
import { Alert, Slide } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "../../i18n/use-translation.ts";

export function OfflineBanner() {
  const { t } = useTranslation();
  const [offline, setOffline] = useState(() =>
    typeof navigator !== "undefined" ? !navigator.onLine : false,
  );

  useEffect(() => {
    const goOffline = (): void => setOffline(true);
    const goOnline = (): void => setOffline(false);
    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, []);

  return (
    <Slide direction="down" in={offline} mountOnEnter unmountOnExit>
      <Alert
        severity="info"
        icon={<CloudOffOutlinedIcon fontSize="inherit" />}
        sx={{
          borderRadius: 0,
          borderBottom: 1,
          borderColor: "divider",
          py: 0.5,
          "& .MuiAlert-message": {
            fontFamily: "var(--font-body)",
          },
        }}
      >
        {t("pwa.offline")}
      </Alert>
    </Slide>
  );
}
