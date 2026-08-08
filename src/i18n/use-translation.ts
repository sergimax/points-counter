import { useCallback, useContext } from "react";
import { LocaleContext } from "./locale-context.ts";
import {
  formatMessage,
  messagesByLocale,
  type MessageKey,
} from "./messages.ts";

export function useTranslation() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useTranslation must be used within LocaleProvider");
  }

  const { locale } = context;

  const t = useCallback(
    (key: MessageKey, params?: Record<string, string | number>) => {
      const template = messagesByLocale[locale][key];
      return formatMessage(template, params);
    },
    [locale],
  );

  return { t, locale, setLocale: context.setLocale, toggleLocale: context.toggleLocale };
}
