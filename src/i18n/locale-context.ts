/**
 * Shared locale state for chrome strings (header / meta).
 * Kept separate from the provider so Fast Refresh treats the provider as components-only.
 */
import { createContext } from "react";
import {
  getInitialLocale,
  type Locale,
} from "./messages.ts";

export type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
};

export const LocaleContext = createContext<LocaleContextValue | null>(null);

// Align <html lang> before React mounts.
if (typeof document !== "undefined") {
  document.documentElement.lang = getInitialLocale();
}
