# points-counter

A **local-first** web app for **counting and processing points** in board games. Everything runs in the browser: **no backend**, no cloud sync, and no special hosted data.

## Stack

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Vite](https://vite.dev/)

## Data and state

- **Persistence:** browser storage only (for example **`localStorage`**) and/or in-memory state coordinated with **[MobX](https://mobx.js.org/)** (or similar patterns the repo adopts). Document stable storage keys and JSON shapes here when they are settled.
- **Privacy:** game data stays on the device unless the user exports or copies it themselves.

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
