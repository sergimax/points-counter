import { IconButton, Tooltip, Typography } from "@mui/material";
import { useTranslation } from "../../i18n/use-translation.ts";

export function LocaleToggle() {
  const { locale, toggleLocale, t } = useTranslation();
  const nextLabel = locale === "en" ? "RU" : "EN";
  const ariaLabel = t("header.localeToggle");

  return (
    <Tooltip title={ariaLabel}>
      <IconButton
        size="small"
        color="inherit"
        onClick={toggleLocale}
        aria-label={ariaLabel}
      >
        <Typography
          component="span"
          variant="caption"
          sx={{
            fontFamily: "var(--font-mono)",
            fontWeight: 600,
            lineHeight: 1,
            minWidth: "1.5rem",
          }}
        >
          {nextLabel}
        </Typography>
      </IconButton>
    </Tooltip>
  );
}
