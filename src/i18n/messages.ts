import { migrateLocalStorageKey } from "../lib/migrate-storage-key.ts";

export type Locale = "en" | "ru";

export const LOCALE_STORAGE_KEY = "points-locale";
export const LEGACY_LOCALE_STORAGE_KEY = "points-counter-locale";

migrateLocalStorageKey(LEGACY_LOCALE_STORAGE_KEY, LOCALE_STORAGE_KEY);

export type MessageKey =
  | "header.appTitle"
  | "header.themeLight"
  | "header.themeDark"
  | "header.localeToggle"
  | "header.githubHint"
  | "header.authorSiteAria"
  | "header.versionAria"
  | "toolbar.newGame"
  | "toolbar.currentGame"
  | "toolbar.games"
  | "toolbar.closeRound"
  | "toolbar.menu"
  | "empty.noActiveGame"
  | "empty.noActiveGameHint"
  | "empty.noGames"
  | "game.round"
  | "game.summary"
  | "game.before"
  | "game.forRound"
  | "game.roundNumber"
  | "game.historyTitle"
  | "game.historyEmpty"
  | "game.players"
  | "game.activate"
  | "game.delete"
  | "game.deleteConfirm"
  | "game.activeBadge"
  | "game.pausedBadge"
  | "game.created"
  | "game.updated"
  | "game.roundStarted"
  | "score.minus"
  | "score.plus"
  | "score.diff"
  | "dialog.newGameTitle"
  | "dialog.gameTitle"
  | "dialog.gameIcon"
  | "dialog.gameColor"
  | "dialog.players"
  | "dialog.playerName"
  | "dialog.playerIcon"
  | "dialog.playerColor"
  | "dialog.addPlayer"
  | "dialog.removePlayer"
  | "dialog.create"
  | "dialog.cancel"
  | "dialog.close"
  | "panel.gamesTitle"
  | "error.titleRequired"
  | "error.playerNameRequired"
  | "pwa.offline"
  | "pwa.installHint"
  | "pwa.installAction"
  | "pwa.installDismiss";

type Messages = Record<MessageKey, string>;

const en: Messages = {
  "header.appTitle": "Points",
  "header.themeLight": "Switch to light mode",
  "header.themeDark": "Switch to dark mode",
  "header.localeToggle": "Switch language",
  "header.githubHint": "View source on GitHub",
  "header.authorSiteAria": "Author website",
  "header.versionAria": "Version {version}",
  "toolbar.newGame": "New game",
  "toolbar.currentGame": "Current game",
  "toolbar.games": "Games",
  "toolbar.closeRound": "Close round",
  "toolbar.menu": "Menu",
  "empty.noActiveGame": "No active game",
  "empty.noActiveGameHint": "Create a new game or resume a saved one from Games.",
  "empty.noGames": "No saved games yet.",
  "game.round": "Round",
  "game.summary": "Total",
  "game.before": "Before",
  "game.forRound": "This round",
  "game.roundNumber": "Round {number}",
  "game.historyTitle": "Round history",
  "game.historyEmpty": "No closed rounds yet.",
  "game.players": "Players",
  "game.activate": "Resume",
  "game.delete": "Delete",
  "game.deleteConfirm": "Delete “{title}”? This cannot be undone.",
  "game.activeBadge": "Active",
  "game.pausedBadge": "Paused",
  "game.created": "Created {date}",
  "game.updated": "Updated {date}",
  "game.roundStarted": "Started {date}",
  "score.minus": "Subtract 1 from {name}",
  "score.plus": "Add 1 to {name}",
  "score.diff": "Round change: {value}",
  "dialog.newGameTitle": "New game",
  "dialog.gameTitle": "Game title",
  "dialog.gameIcon": "Game icon",
  "dialog.gameColor": "Game color",
  "dialog.players": "Players",
  "dialog.playerName": "Player name",
  "dialog.playerIcon": "Player icon",
  "dialog.playerColor": "Player color",
  "dialog.addPlayer": "Add player",
  "dialog.removePlayer": "Remove player",
  "dialog.create": "Create",
  "dialog.cancel": "Cancel",
  "dialog.close": "Close",
  "panel.gamesTitle": "Games",
  "error.titleRequired": "Enter a game title.",
  "error.playerNameRequired": "Every player needs a name.",
  "pwa.offline": "You’re offline. Scoring still works on this device.",
  "pwa.installHint": "Install Points for quick access offline.",
  "pwa.installAction": "Install",
  "pwa.installDismiss": "Not now",
};

const ru: Messages = {
  "header.appTitle": "Points",
  "header.themeLight": "Светлая тема",
  "header.themeDark": "Тёмная тема",
  "header.localeToggle": "Сменить язык",
  "header.githubHint": "Исходный код на GitHub",
  "header.authorSiteAria": "Сайт автора",
  "header.versionAria": "Версия {version}",
  "toolbar.newGame": "Новая игра",
  "toolbar.currentGame": "Текущая игра",
  "toolbar.games": "Игры",
  "toolbar.closeRound": "Закрыть раунд",
  "toolbar.menu": "Меню",
  "empty.noActiveGame": "Нет активной игры",
  "empty.noActiveGameHint":
    "Создайте новую игру или возобновите сохранённую в списке «Игры».",
  "empty.noGames": "Пока нет сохранённых игр.",
  "game.round": "Раунд",
  "game.summary": "Итого",
  "game.before": "Было",
  "game.forRound": "За раунд",
  "game.roundNumber": "Раунд {number}",
  "game.historyTitle": "История раундов",
  "game.historyEmpty": "Закрытых раундов пока нет.",
  "game.players": "Игроки",
  "game.activate": "Продолжить",
  "game.delete": "Удалить",
  "game.deleteConfirm": "Удалить «{title}»? Это нельзя отменить.",
  "game.activeBadge": "Активна",
  "game.pausedBadge": "На паузе",
  "game.created": "Создано {date}",
  "game.updated": "Обновлено {date}",
  "game.roundStarted": "Начало {date}",
  "score.minus": "Вычесть 1 у {name}",
  "score.plus": "Добавить 1 {name}",
  "score.diff": "Изменение за раунд: {value}",
  "dialog.newGameTitle": "Новая игра",
  "dialog.gameTitle": "Название игры",
  "dialog.gameIcon": "Иконка игры",
  "dialog.gameColor": "Цвет игры",
  "dialog.players": "Игроки",
  "dialog.playerName": "Имя игрока",
  "dialog.playerIcon": "Иконка игрока",
  "dialog.playerColor": "Цвет игрока",
  "dialog.addPlayer": "Добавить игрока",
  "dialog.removePlayer": "Удалить игрока",
  "dialog.create": "Создать",
  "dialog.cancel": "Отмена",
  "dialog.close": "Закрыть",
  "panel.gamesTitle": "Игры",
  "error.titleRequired": "Введите название игры.",
  "error.playerNameRequired": "У каждого игрока должно быть имя.",
  "pwa.offline": "Нет сети. Счёт на этом устройстве по-прежнему работает.",
  "pwa.installHint": "Установите «Points» для быстрого офлайн-доступа.",
  "pwa.installAction": "Установить",
  "pwa.installDismiss": "Не сейчас",
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
