---
name: zola
description: >-
  Build and maintain the Open Free Books static site with Zola (Tera templates,
  Sass, content/, data/, theme) and Solid.js frontend. Use when editing zola.toml,
  content/, themes/openfreebooks/templates/, Sass, static assets, frontend/src/,
  bundle.js, or running zola build/serve.
---

# Zola (Open Free Books)

Static site: **Zola** + custom theme `openfreebooks`. Output goes to `public/` (gitignored). Deploy via Wrangler from `public/`.

## Layout

| Path | Role |
|------|------|
| `zola.toml` | Site config, `[extra]` URLs for templates |
| `content/` | Pages (`*.md` + front matter, `template = "…"`) |
| `data/` | JSON for `load_data()` (contributors, credits) |
| `static/` | Copied to site root (`favicons`, `icons/`, etc.) |
| `themes/openfreebooks/templates/` | Tera HTML, partials, macros |
| `themes/openfreebooks/sass/` | Source styles → compiled `public/main.css` |
| `themes/openfreebooks/static/js/` | Vite output: `bundle.js` (site chrome) + hashed chunks (`catalog-app-*.js`, `catalog-canvas-view-*.js`, …) |

See [reference.md](reference.md) for Tera pitfalls and build checks.

## Commands

```bash
bun run build:js   # Vite → themes/openfreebooks/static/js/ (bundle.js + lazy chunks)
zola build         # required before indexing
bun run index:search  # pagefind on public/ → copies to static/pagefind/ for zola serve
zola serve         # dev at http://127.0.0.1:1111
bun run build      # build:js + zola build + index:search
```

After Sass or template changes, run `zola build` (or `zola serve`). Do **not** copy `public/` into `themes/openfreebooks/static/`.

**Search (Pagefind):** read [zola-pagefind.md](zola-pagefind.md) before changing search UI, indexing, or `data-pagefind-*` attributes.

## Templates (Tera)

- Extend `base.html`; use `{% block content %}` for page bodies.
- **`{% import "macros/….html" as ns %}`** only in templates that **extend** a layout (e.g. `index.html`), **not** inside `{% include %}` partials.
- Macro calls use **keyword arguments**: `{{ ns::macro_name(arg=value) }}`.
- Prefer **partials** under `templates/partials/`; kebab-case filenames.
- Icons: Tabler SVGs in `static/icons/social/`; inline copies in `templates/partials/icons/social/*.html` included from `macros/social-icons.html`.

## Data files

```tera
{% set data = load_data(path="data/contributors.json", format="json") %}
```

On Zola 0.22+, use the `data/…` path (not bare `contributors.json` at repo root).

## New page checklist

1. Add `content/your-page.md` with `title`, `template = "your-template.html"`.
2. Add `themes/openfreebooks/templates/your-template.html` extending `base.html`.
3. Add Sass in `themes/openfreebooks/sass/` and `@import` in `main.scss`.
4. Wire footer/nav URLs in `zola.toml` `[extra]` if needed.

## Styling

- No inline Tailwind; use Sass partials and `class=""` on elements.
- Design tokens in `_tokens.scss`; section patterns in `_components.scss`, `_why-sections.scss`, etc.
- Grain overlay and dark mode via `data-theme` + CSS variables.

## Solid.js

Client behavior lives in `frontend/` and mounts from `base.html`:

| Entry | Mount | Notes |
|-------|--------|--------|
| `js/bundle.js` | `main.tsx` | Header, theme, homepage, chapter widgets |
| `js/catalog-app-*.js` | `#catalog-app` on `/catalog/` | Lazy-loaded with `catalog-canvas-view-*.js` for Map view |

**When changing `frontend/` or adding interactivity**, read [zola-solid.md](zola-solid.md) before editing JS.

### Search (Pagefind)

- Runs after `zola build`; indexes **live chapter pages** only (`data-pagefind-body` on chapter template).
- UI: global modal (⌘K) + `/search/` page. See [zola-pagefind.md](zola-pagefind.md).

### Catalog page

- `content/catalog.md` → `template = "catalog.html"`
- `templates/catalog.html` — empty `#catalog-app` + `#catalog-data` JSON embed (merged subject curricula at build time)
- `sass/_catalog.scss` — list + map styles; map card title link underline lives under `.catalog-canvas`
- Run `bun run build:js` after any `frontend/src/components/catalog-*` or `frontend/src/lib/catalog-*` change

## Verify

```bash
bun run build
```

Confirm `public/main.css` contains new selectors (no stale `themes/openfreebooks/static/main.css` overriding compile). Confirm HTML under `public/` matches templates, not an old `themes/openfreebooks/static/index.html`.
