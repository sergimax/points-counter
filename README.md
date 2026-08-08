# points-counter

A **local-first** web app for **counting and processing points** in board games.
Everything runs in the browser: **no backend**, no cloud sync, and no special hosted data.

![Версия приложения](https://img.shields.io/badge/App_version-0.2.0-purple)

## Stack

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Vite](https://vite.dev/)
- [MUI](https://mui.com/) for theming and chrome (see [`docs/design/design-system.md`](docs/design/design-system.md))
- [MobX](https://mobx.js.org/) for local-first game state

## Features

- Create games with **one or more players** (name, icon, color); **add players** while a game is active
- Score the open round with +/− or by typing a value; see **before → this round → total**
- **Close round** to save one score per player and start the next (uncapped rounds)
- Save many games; **one active** at a time — switch via **Resume** in **Games**
- Round history with sticky round labels when many players force horizontal scroll
- Wide layout: two-column player list; EN/RU chrome; light/dark theme

## Data and state

- **Store:** MobX `RootStore` (`src/stores/`) hydrates from and persists to **`localStorage`**.
- **Keys:**

| Key | Contents |
| --- | --- |
| `points-counter-data` | Games payload (`schemaVersion` 1): `games[]`, `activeGameId` |
| `points-counter-color-mode` | `light` \| `dark` |
| `points-counter-locale` | `en` \| `ru` (UI strings; default `en`) |

- **Game timestamps:** `createdAt`; open round `currentRoundStartedAt`; closed rounds `startedAt` + `closedAt`.
- **Game status:** `active` \| `paused`. Activating a game pauses any previous active game.
- **Privacy:** game data stays on the device unless the user exports or copies it themselves.

## Design

Visual tokens and UI recipes: [`docs/design/design-system.md`](docs/design/design-system.md) and [`docs/design/design-tokens.json`](docs/design/design-tokens.json).

## Roadmap (planned)

- **PWA:** add a [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest) (and related PWA pieces) so the app can be installed and used more like a **mobile app** from the home screen.

## Scripts

| Command           | Description              |
| --- | --- |
| `npm run dev`     | Start dev server with HMR |
| `npm run build`   | Typecheck and production build |
| `npm run preview` | Preview the production build |
| `npm run lint`    | Run ESLint               |

## Version

Current version is in [`package.json`](./package.json) (see `"version"`). User-facing changes are summarized in [`CHANGELOG.md`](./CHANGELOG.md).
