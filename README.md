# points-counter

A **local-first** web app for **counting and processing points** in board games. Everything runs in the browser: **no backend**, no cloud sync, and no special hosted data.

## Stack

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Vite](https://vite.dev/)
- [MUI](https://mui.com/) for theming and chrome (see [`docs/design/design-system.md`](docs/design/design-system.md))
- [MobX](https://mobx.js.org/) for local-first state (as the app grows)

## Data and state

- **Persistence:** browser **`localStorage`** and/or in-memory state coordinated with **[MobX](https://mobx.js.org/)**. Game session data shapes will be documented here as they settle.
- **UI prefs (current):**

| Key | Contents |
| --- | --- |
| `points-counter-color-mode` | `light` \| `dark` |
| `points-counter-locale` | `en` \| `ru` (header chrome strings; default `en`) |

- **Privacy:** game data stays on the device unless the user exports or copies it themselves.

## Design

Visual tokens and UI recipes: [`docs/design/design-system.md`](docs/design/design-system.md) and [`docs/design/design-tokens.json`](docs/design/design-tokens.json).

## Roadmap (planned)

- **PWA:** add a [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest) (and related PWA pieces) so the app can be installed and used more like a **mobile app** from the home screen.

## Scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start dev server with HMR |
| `npm run build`   | Typecheck and production build |
| `npm run preview` | Preview the production build |
| `npm run lint`    | Run ESLint               |

## Version

Current version is in [`package.json`](./package.json) (see `"version"`). User-facing changes are summarized in [`CHANGELOG.md`](./CHANGELOG.md).
