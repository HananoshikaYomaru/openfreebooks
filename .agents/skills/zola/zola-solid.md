# Solid.js + Vite (Open Free Books)

Reference for client-side work in this Zola repo. Read this when editing `frontend/`, `bundle.js`, or adding interactivity.

## Stack

| Piece | Location |
|-------|----------|
| Source | `frontend/src/` (functional Solid components) |
| Entry | `frontend/src/main.tsx` |
| Build | Vite + `vite-plugin-solid` |
| Output | `themes/openfreebooks/static/js/bundle.js` |
| Loaded in | `themes/openfreebooks/templates/base.html` (`defer`) |

Package manager: **Bun** (`bun install`, `bun run build:js`).

## Config bridge (Zola → Solid)

`base.html` embeds JSON:

```html
<script id="site-config" type="application/json">…</script>
```

`main.tsx` reads it via `readConfig()` for brand, `homeUrl`, `browseUrl`, `aboutUrl`, `githubUrl`. Add new global URLs in **`zola.toml` `[extra]`** and mirror in `base.html` + `readConfig()` types.

## Mount points

| ID / target | Component | Role |
|-------------|-----------|------|
| `#site-header` | `SiteHeader` | Nav + theme toggle |
| `#marquee` | `Marquee` | Homepage quote strip |
| `document.body` | `ScrollRevealBootstrap` | `[data-scroll-reveal-card]` |
| `document.body` | `ContributorsDialogBootstrap` | `<dialog>` for contributors |
| `#footer-year` | `mountFooterYear()` | Copyright year |

Prefer **bootstrap** components that `querySelector` existing markup over re-rendering large HTML regions in Solid.

## Conventions

- **Functional** components only; no class components.
- **No mocks** in Vitest unless the user asks for tests.
- Keep bundles small: mount only what’s needed.
- Styles stay in **Sass** (`themes/openfreebooks/sass/`); use `className` with existing classes, not inline Tailwind.
- Scroll reveal: stagger **per section** (`[data-scroll-reveal]` group), not global index; reveal in-viewport items immediately on load (`scroll-reveal.tsx`).

## Vite config

- `outDir`: `themes/openfreebooks/static`
- `emptyOutDir: false` — do not wipe theme static (only add `js/bundle.js`)
- Single entry: `frontend/src/main.tsx` → `js/bundle.js`

## Workflow

1. Edit `frontend/src/…`.
2. Run `bun run build:js` (or `bun run dev:js` while `zola serve` runs).
3. Hard-refresh browser.
4. For production: `bun run build` then `wrangler deploy`.

## Adding a feature

1. Add mount root in Tera template (empty `<div id="…">` or use existing).
2. Create `frontend/src/components/your-feature.tsx`.
3. Import and `render()` in `main.tsx` (or extend a bootstrap).
4. Add Sass if new UI.

## Dialogs

Contributor modals use native `<dialog>` + `showModal()` in `contributors-dialog.tsx`. Markup lives in `partials/contributors-block.html`.

## Do not

- Commit generated `main.css` or `index.html` under `themes/openfreebooks/static/`.
- Use `emptyOutDir: true` in Vite without restoring allowed theme static files.

## Verify

```bash
bun run build:js
zola build
```

Check `themes/openfreebooks/static/js/bundle.js` updated; hard-refresh if behavior looks stale.
