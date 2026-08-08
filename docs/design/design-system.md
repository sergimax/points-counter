# Design system — Points Counter

Portable visual tokens and UI recipes used by this app. Use as:

1. **In-repo reference** when adding panels, forms, and surfaces
2. **Import seed** for another project (`docs/design/design-tokens.json` + this file)
3. **Cross-project alignment** — keep core tokens stable with sibling apps (e.g. my-raid-cds); extend domain layers per app

**Source of truth (code):**

| Layer | Path |
| --- | --- |
| MUI theme | `src/theme/create-app-theme.ts` (`appThemeTokens`) |
| Quiet / spot links | `src/theme/links.css` |
| Tooltip surfaces | `src/theme/tooltip-surface.ts` |
| CSS variables + scrollbars | `src/index.css` |
| App shell spacing | `src/App.css` |
| Color mode sync | `src/contexts/color-mode-provider.tsx`, `src/hooks/color-mode.ts` |
| Locale (chrome) | `src/i18n/` — storage key `points-counter-locale` |
| Machine tokens | `docs/design/design-tokens.json` |

When tokens change in code, update this doc and `design-tokens.json` in the same change.

---

## Visual direction

| Trait | Rule |
| --- | --- |
| Chrome | Quiet MUJI neutrals — warm paper (`#fcfbf9` / `#1a1a1a`), not slate-blue fog |
| Brand | Burnt orange (Signal energy) — identity only, **not** primary CTAs |
| Primary CTAs | Inverse ink (`#0a0a0a` on light / `#fafafa` on dark) |
| Ok / Danger | Forest/mint green · true red — never reuse brand orange |
| Surfaces | Soft card shadow + modest radii (`10` / `8`) |
| Type | Onest display · Noto Sans body · JetBrains Mono chips/meta (Cyrillic + Latin) |

**Avoid:** Facebook/SaaS blue as brand; pink/magenta identity; brand≈danger or brand≈ok pairs; Latin-only display fonts (Syne, Space Grotesk) as sole UI fonts.

---

## Color mode

- Attribute: `document.documentElement.dataset.colorMode` = `light` | `dark`
- CSS: `:root` / `:root[data-color-mode="dark"]` in `index.css`
- Storage key: `points-counter-color-mode`
- Theme-color meta: light `#fcfbf9`, dark `#1a1a1a`
- Default for new visits: system preference, else `light`

CSS variables mirror the MUI palette so non-MUI markup stays in sync.

---

## App header recipe

Sticky AppBar (blurred paper bg, bottom border):

| Region | Contents |
| --- | --- |
| **Left** (`flexShrink: 0`) | `logo.svg` 28×28 · app title (`h1` / Typography `h6`, brand color, display font) |
| **Center** (`flexGrow: 1`) | Primary view nav (Current / Games / New); justify `flex-end` on xs, `center` on md+. Inline buttons when the slot is wide enough (~360px+); otherwise ☰ menu with the same actions |
| **Right** (`flexShrink: 0`) | Locale EN↔RU · theme toggle · GitHub · author home · version caption `v.X.Y.Z` (mono, not a button) |

View nav uses space-aware layout (`ResizeObserver` on the center slot), not a fixed breakpoint alone.

---

## Core palette

### Light

| Role | Hex | CSS var | MUI |
| --- | --- | --- | --- |
| Page background | `#fcfbf9` | `--bg` / `--page-bg` | `background.default` |
| Surface / paper | `#ffffff` | `--surface` | `background.paper` |
| Chip / inset | `#f3f2ef` | `--chip-bg` | — |
| Sticky header | `rgba(252, 251, 249, 0.96)` | `--header-bg` | AppBar |
| Border | `#8a8a8a` | `--border` | `divider` |
| Text | `#141414` | `--text` | `text.primary` |
| Text strong | `#0a0a0a` | `--text-strong` | — |
| Text muted | `#555555` | `--text-muted` | `text.secondary` |
| Brand | `#9a3412` | `--brand` | `secondary.main` |
| Brand soft / border | `#fff7ed` / `#c2410c` | `--brand-soft` / `--brand-border` | — |
| Ok | `#166534` | `--ok` | `success.main` |
| Danger | `#dc2626` | `--danger` | `error.main` |
| Link (quiet) | `#2c5282` | `--link` | — |
| Link spot | `#9a3412` | `--link-spot` | — |
| Primary bg / fg | `#0a0a0a` / `#ffffff` | `--primary-bg` / `--primary-fg` | `primary.main` / contrast |
| Shadow | `0 6px 18px rgba(0, 0, 0, 0.07)` | `--shadow` | card / paper outlined |
| Info | `#0284c7` | — | `info.main` |
| Warning | `#d97706` | — | `warning.main` |
| Scrollbar thumb | `#c4c4c0` → hover `#8a8a8a` | `--scrollbar-thumb*` | — |

Action:

- `hover`: `alpha(#141414, 0.04)`
- `selected`: `alpha(#9a3412, 0.1)`

### Dark

| Role | Hex | CSS var | MUI |
| --- | --- | --- | --- |
| Page background | `#1a1a1a` | `--bg` / `--page-bg` | `background.default` |
| Surface / paper | `#242424` | `--surface` | `background.paper` |
| Chip / inset | `#1f1f1f` | `--chip-bg` | — |
| Sticky header | `rgba(26, 26, 26, 0.96)` | `--header-bg` | AppBar |
| Border | `#8a8a8a` | `--border` | `divider` |
| Text | `#f2f2f2` | `--text` | `text.primary` |
| Text strong | `#fafafa` | `--text-strong` | — |
| Text muted | `#a3a3a3` | `--text-muted` | `text.secondary` |
| Brand | `#fb923c` | `--brand` | `secondary.main` |
| Brand soft / border | `#3d2818` / `#fb923c` | `--brand-soft` / `--brand-border` | — |
| Ok | `#86efac` | `--ok` | `success.main` |
| Danger | `#ff7b72` | `--danger` | `error.main` |
| Link (quiet) | `#8ab4c8` | `--link` | — |
| Link spot | `#fb923c` | `--link-spot` | — |
| Primary bg / fg | `#fafafa` / `#111111` | `--primary-bg` / `--primary-fg` | `primary.main` / contrast |
| Shadow | `0 8px 24px rgba(0, 0, 0, 0.4)` | `--shadow` | card / paper outlined |
| Info | `#38bdf8` | — | `info.main` |
| Warning | `#f59e0b` | — | `warning.main` |
| Scrollbar thumb | `#555555` → hover `#8a8a8a` | `--scrollbar-thumb*` | — |

Action:

- `hover`: `alpha(#f2f2f2, 0.06)`
- `selected`: `alpha(#fb923c, 0.18)`

### Page atmosphere (CssBaseline `body`)

Warm brand-soft radials (not SaaS blue/teal):

- Light: `rgba(154, 52, 18, 0.06)` + `rgba(194, 65, 12, 0.04)`, `backgroundAttachment: fixed`
- Dark: `rgba(251, 146, 60, 0.1)` + `rgba(61, 40, 24, 0.45)`, fixed

---

## Shape & radius

| Token | Value | Usage |
| --- | --- | --- |
| `--radius` / `shape.borderRadius` | `10px` | Global MUI shape; tables, menus, alerts |
| `--control-radius` / control | `8px` | Buttons, icon buttons, tooltips |
| Dialog | `12px` | Dialog paper |
| Filter / step card | `8px` (`borderRadius: 1`) | Stepped form sections |
| Scrollbar thumb | `999` (pill) | WebKit thumb only |
| `--gap` / `--pad` | `0.55rem` / `0.65rem` | Density reference |

MUI `borderRadius: 1` in `sx` = **8px** when theme spacing is 8.

---

## Borders

Interactive chrome uses border `#8a8a8a` (≥ ~3:1 vs page bg):

```text
border: 1px solid <divider>
```

| Surface | Border | Notes |
| --- | --- | --- |
| Outlined `Paper` | `divider` | Toolbar panels |
| Step / filter card | `border: 1`, `borderColor: "divider"`, `borderRadius: 1` | Stepped forms |
| Table container | `1px solid divider` | + paper fill + soft shadow |
| Dialog paper | `1px solid divider` | radius 12 |
| Menu paper | `1px solid divider` | radius 10 |
| Outlined button | `divider`; hover `#6b6b6b` / `#a3a3a3` | translucent paper fill |
| Outlined input hover outline | same hover border colors | soft paper fill behind field |

Do **not** invent a second border color for generic chrome — use `divider` / `--border`.

---

## Elevation / shadows

| Token | Light | Dark |
| --- | --- | --- |
| Card / outlined paper / table | `0 6px 18px rgba(0, 0, 0, 0.07)` | `0 8px 24px rgba(0, 0, 0, 0.4)` |
| Menu | `0 8px 24px rgba(0, 0, 0, 0.12)` | `0 8px 24px rgba(0, 0, 0, 0.45)` |
| Tooltip | MUI `shadows[8]` | MUI `shadows[12]` |
| Paper default | `backgroundImage: none` | (no gradient overlay on elevation) |

---

## Typography

| Role | Stack |
| --- | --- |
| Body | `'Noto Sans', system-ui, sans-serif` |
| Display | `'Onest', 'Noto Sans', system-ui, sans-serif` |
| Mono | `'JetBrains Mono', 'IBM Plex Mono', monospace` |

Fonts self-hosted via `@fontsource` (`src/theme/fonts.css`) — latin + cyrillic subsets for Noto Sans, Onest, JetBrains Mono.

| Style | Rules |
| --- | --- |
| Brand wordmark | Display stack, weight **700**, color `--brand` |
| Button | `textTransform: none`, `fontWeight: 600`, `letterSpacing: 0` |
| `h6` / `subtitle1` | Display stack; `h6` weight 700 |
| Body prose | line-height ~**1.55** |
| Version / meta | Mono stack |

---

## Links (two kinds)

| Kind | When | Visual |
| --- | --- | --- |
| **Quiet** (`a` / `--link`) | Informational, secondary | Slate ≠ body text; weight 500; **1px** underline; offset ~3px |
| **Spot** (`a.link-spot` / `--link-spot`) | Must be found in prose | Brand; Onest; **bold + italic**; **2px** underline |

Implemented in `src/theme/links.css`. Hover may intensify toward brand; do not turn quiet links into full spot styling on hover alone.

---

## Forms & stepped panels

### Recipes

1. **Toolbar shell** — `Paper variant="outlined"`, padding `{ xs: 1.5, sm: 2 }`, header row = title + close. Prefer **no** panel-level layout blurb; put help on steps.
2. **Numbered step** — Brand title (Onest), soft brand **step badge** (number only), **3px brand left edge** on the block.
3. **Field density** — Prefer `size="small"` on TextField / Select / FormControl.
4. **Stack rhythm** — Outer form / panel stacks use `spacing={1.5}`; fields inside a step often `1`–`1.25`.
5. **Actions** — Contained **primary** = ink; no Cancel in toolbar forms (close via panel ✕).

### Inputs (theme)

- Outlined input fill: `alpha(paper, 0.8)` light / `0.35` dark
- Hover outline: `#6b6b6b` / `#a3a3a3`
- **Switch** — off: quiet chip/surface track; on (light): solid `--ok` + mint thumb with ring; on (dark): softer translucent ok track + mid-green thumb, no glow ring

### Buttons (theme)

- `disableElevation: true`
- Root radius `8`, padding inline `12`; small: block `4`, inline `10`
- **Contained primary** — inverse ink fill/border (never brand)
- **Contained secondary** — brand fill (identity / template spotlight only)
- Outlined: divider border + translucent paper; hover uses stronger ink/white alpha fill
- Variant `contained` + `color="inherit"`: brand-tinted fill/border for active toolbar panels

### Icon buttons

- Radius `8`; hover `action.hover`
- Danger (`color="error"`) — light: `error.light` at rest, `error.main` on hover; dark: `error.main` (already soft coral)

### Status / chips

- Ok → `success` / `--ok*`
- Danger → `error` / `--danger*`
- Brand chip → brand border/text on `--brand-soft` fill

---

## Scrollbars

Global in `index.css`:

| Token | Value |
| --- | --- |
| Size | `8px` |
| Track | transparent |
| Thumb radius | pill (`999px`) with `2px` transparent border + `background-clip: content-box` |

---

## App shell spacing

| Token | Value |
| --- | --- |
| Toolbar height | `56px` xs / `64px` sm+ (`--app-toolbar-min-height`) |
| Main padding | top `1.5rem`→`2rem`, x `1.25rem`→`1.75rem`, bottom `2rem` |
| `html` scroll-padding-top | toolbar height |

---

## Tooltip surface (inverted in light mode)

| Mode | bgcolor | color | muted | border |
| --- | --- | --- | --- | --- |
| Light app | `#27272a` | `#fafafa` | `#d4d4d8` | `#3f3f46` |
| Dark app | `#3f3f46` | `#fafafa` | `#d4d4d8` | `#52525b` |

---

## Persistence keys (this app)

| Key | Contents |
| --- | --- |
| `points-counter-color-mode` | `light` \| `dark` |
| `points-counter-locale` | `en` \| `ru` (chrome strings; default `en`) |

---

## Porting checklist

**Core (reuse across projects)**

1. Copy tokens from `design-tokens.json`
2. Port `createAppTheme` structure (palette: primary=ink, secondary=brand, success=ok, error=danger; fonts; CssBaseline atmosphere; Button / Paper / Table / Dialog / Tooltip / OutlinedInput / Menu / Switch)
3. Wire `data-color-mode` + matching CSS vars before paint
4. Load Noto Sans + Onest + JetBrains Mono (Cyrillic + Latin)
5. Implement quiet vs `.link-spot` links (`links.css`)
6. Keep border `#8a8a8a`, radii 8/10/12
7. Contrast-check text / muted / brand / ok / danger / link / link-spot / border
8. Rename storage keys per app (never reuse `my-raid-cds-*` here)

**Optional**

- Scrollbar CSS block from `index.css`
- Tooltip inversion helper
- Header AppBar recipe + locale/theme/meta chrome

---

## Consistency rules for agents & humans

1. New chrome surfaces → outlined paper or `border + divider + borderRadius 1`, not ad-hoc hex borders
2. Primary CTAs → `color="primary"` (ink). Brand identity → `secondary` or `--brand*`. Never fill primary with brand orange
3. Ok / danger / brand must stay visually separable in both modes
4. New semantic color → map to `primary` / `secondary` / `success` / `error` / `info` / `warning` / `text.*` first
5. Prefer theme tokens over one-off hex in components
6. When bumping tokens, update **code + this doc + `design-tokens.json`**
