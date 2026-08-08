export type Locale = "en" | "ru";

export const LOCALE_STORAGE_KEY = "points-counter-locale";

export type MessageKey =
  | "header.appTitle"
  | "header.themeLight"
  | "header.themeDark"
  | "header.localeToggle"
  | "header.githubHint"
  | "header.authorSiteAria"
  | "header.versionAria";

type Messages = Record<MessageKey, string>;

const en: Messages = {
  "header.appTitle": "Points Counter",
  "header.themeLight": "Switch to light mode",
  "header.themeDark": "Switch to dark mode",
  "header.localeToggle": "Switch language",
  "header.githubHint": "View source on GitHub",
  "header.authorSiteAria": "Author website",
  "header.versionAria": "Version {version}",
};

const ru: Messages = {
  "header.appTitle": "Счётчик очков",
  "header.themeLight": "Светлая тема",
  "header.themeDark": "Тёмная тема",
  "header.localeToggle": "Сменить язык",
  "header.githubHint": "Исходный код на GitHub",
  "header.authorSiteAria": "Сайт автора",
  "header.versionAria": "Версия {version}",
};

export const messagesByLocale: Record<Locale, Messages> = { en, ru };

export function getInitialLocale(): Locale {
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored === "en" || stored === "ru") {
      return stored;
    }
  } catch {
    // ignore
  }
  return "en";
}

export function formatMessage(
  template: string,
  params?: Record<string, string | number>,
): string {
  if (!params) {
    return template;
  }
  return Object.entries(params).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, String(value)),
    template,
  );
}
