# Changelog

## [0.4.0] - 2026-08-12

### Changed

- Renamed the project from **points-counter** to **points** (package name, PWA/base path `/points/`, app title, GitHub link).
- Renamed `localStorage` keys to `points-*`; legacy `points-counter-*` values migrate once on load.

## [0.3.0] - 2026-08-08

### Added

- **PWA:** web app manifest, install icons (192/512 + Apple touch), and a service worker that precaches the app shell (including fonts) for offline use after the first visit.
- `npm run generate:pwa-icons` to regenerate PWA icons from `public/logo.svg`.
- Install prompt (Chrome/Edge/Android `beforeinstallprompt`) and an offline banner; dismiss preference in `points-counter-install-dismissed`.
- Self-hosted UI fonts via `@fontsource` (Noto Sans, Onest, JetBrains Mono) — no Google Fonts CDN.

## [0.2.0] - 2026-08-08

### Added

- Local-first scoring with MobX and `localStorage` (`points-counter-data`, `schemaVersion` 1).
- Create games (title, icon, color, players); list / resume / delete in **Games**; **New game** CTA on that view.
- Current-game scoring: before → this-round change (typed input or +/−) → live total; **Close round** writes history and starts the next round.
- Round history table with sticky fixed-width round column and horizontal scroll for many players.
- Game `createdAt` and per-round `startedAt` (open round tracks `currentRoundStartedAt`).
- Add players mid-game (no maximum player count; minimum one).
- Shared icon and color pickers for games and players; EN/RU scoring chrome.
- App views: **Current game**, **Games**, **New game**; header nav shows inline buttons when the toolbar has enough width, otherwise a compact menu.
- Wide screens: two-column player list; history matches that content width.

### Changed

- Switching games is done by **Resume** in Games (previous active game is paused automatically).

## [0.1.0] - 2026-08-08

### Added

- Shared design system (MUI theme, CSS tokens, light/dark atmosphere) documented in `docs/design/`.
- Sticky app header with brand, locale (EN/RU) and theme toggles, GitHub / author links, and version label.
- Chrome i18n for header strings; preferences persist as `points-counter-locale` and `points-counter-color-mode`.

### Removed

- Footer version/attribution line (replaced by header chrome).

## [0.0.1] - 2026-05-04

### Added

- Initial Vite, React, and TypeScript app scaffold for points-counter.
