---
name: ofb
description: >-
  Develop Open Free Books (OFB): Zola static site, catalog/curriculum JSON,
  HTML chapters, Solid.js, JSON Canvas maps, Sass. Use when editing openfreebooks,
  adding subjects/chapters/curriculum, catalog, math content, or deploying to
  Cloudflare.
---

# Open Free Books (OFB)

Free, static, open-source textbooks. **Zola** + theme `openfreebooks` + **Solid.js** + **Bun/Vite**. Deploy: `public/` via Wrangler.

Read [spec.md](../../../spec.md) for product rules. Pair with [zola](../zola/SKILL.md) for template/Sass details.

## Architecture (mental model)

```text
data/catalog.json          → subject list + global curriculum filter chips
data/{subject}-curriculum.json → strands, chapters, curriculums[], graph.edges
content/{subject}/…        → Zola sections (chapter pages at /{subject}/{slug}/)
themes/…/partials/{subject}/ → chapter HTML bodies (not Markdown today)
frontend/                  → catalog-app, canvas viewer, site chrome
/catalog/                  → browse UI (list + JSON Canvas map)
```

**Catalog is the subject index.** `/math/` redirects to `/catalog/?subject=math`. Do not revive a separate book index unless asked.

**Curriculum labels** appear only in catalog data (badges + filters), **never** in chapter page prose ([spec.md](../../../spec.md)).

## Commands

```bash
bun install
bun run build:js    # after frontend/ changes
bun run index:search  # once per dev session (copies public/pagefind → static/pagefind)
zola serve          # http://127.0.0.1:1111
bun run build       # production: JS + Zola + pagefind → public/
```

## Non-negotiables

| Rule | Detail |
|------|--------|
| Styling | Sass + `class=""` in templates/JSX — **no Tailwind** |
| React | Functional **Solid** only; mount via `main.tsx` |
| Theme static | **Only** commit `themes/openfreebooks/static/js/bundle.js` (+ fonts if any). **Never** commit `public/` or stale HTML under theme `static/` |
| Tera | Never name a loaded JSON variable `math` (reserved). Use `math_catalog`, etc. |
| Chapter URLs | `/{subjectId}/{chapter-slug}/` (e.g. `/math/quadratic-equations/`) |
| Canvas | [JSON Canvas 1.0](https://jsoncanvas.org/spec/1.0/); viewer: `json-canvas-viewer` (full build, lazy-loaded on catalog) |
| Graph | `graph.edges` must be **acyclic**; builder throws on cycles |

## Common tasks → where to edit

| Task | Files |
|------|--------|
| New global curriculum chip (e.g. GCSE) | `data/catalog.json` → `curriculums[]`; `_catalog.scss` badge; `frontend/src/lib/catalog-badge.ts`; rebuild |
| New subject (sidebar) | `data/catalog.json` → `subjects[]`; `data/{id}-curriculum.json`; **wire catalog template** (today: manual `if subject.id` in `catalog.html` — prefer fixing per [CONTRIBUTING.md](../../../CONTRIBUTING.md)) |
| New chapter (planned) | `{subject}-curriculum.json` strand entry; optional `graph.edges` |
| New chapter (live) | Above + `content/{subject}/{slug}/_index.md` + HTML partial + `chapter.html` wiring + `main.tsx` widget mount if interactive |
| Homepage subject card | `themes/.../templates/index.html` (not yet data-driven) |
| Browse / nav URL | `zola.toml` `[extra] browse_url` + `base.html` site-config + `main.tsx` fallback |
| Search UI / index | `base.html` (Pagefind assets + modal), `content/search.md`, `_search.scss`; `bun run index:search` for dev |

## Search (Pagefind)

| Piece | Path |
|-------|------|
| Global modal + assets | `themes/.../templates/base.html` |
| Dedicated page | `/search/` — `content/search.md`, `templates/search.html` |
| Header trigger | `frontend/src/components/site-header.tsx` (`pagefind-modal-trigger`) |
| Nav link | `main.tsx` + `zola.toml` `search_url` |
| Theming | `themes/.../sass/_search.scss` (`--pf-*` → site tokens) |

- **Component UI** only (`pagefind-component-ui.js`), not legacy `pagefind-ui.js`.
- Index runs **after** `zola build`. Production: `bun run build`. Dev: `bun run index:search` copies bundle to `static/pagefind/` (gitignored) for `zola serve`.
- v1 indexes **live chapter pages only** (`data-pagefind-body` on `templates/chapter.html`); home, about, catalog, credits, and other site pages are excluded.

Detailed checklists: [curriculum-data.md](curriculum-data.md). Human-facing guide: [CONTRIBUTING.md](../../../CONTRIBUTING.md).

## Catalog / canvas

| Piece | Path |
|-------|------|
| Shell UI (subject, filters, list/map toggle) | `frontend/src/components/catalog-app.tsx` |
| Shared chapter card (list + map markup) | `frontend/src/components/catalog-chapter-card.tsx` |
| Map viewer (json-canvas-viewer) | `frontend/src/components/catalog-canvas-view.tsx` (lazy chunk) |
| Canvas layout (strands as columns, DAG levels, node positions) | `frontend/src/lib/catalog-to-canvas.ts` |
| Card height measure + post-render fit | `frontend/src/lib/catalog-chapter-card-layout.ts` |
| Viewer theme (light/dark hex colors) | `frontend/src/lib/catalog-canvas-theme.ts` |
| Curriculum badge CSS class map | `frontend/src/lib/catalog-badge.ts` |
| Types | `data/catalog.types.ts` |
| Styles | `themes/openfreebooks/sass/_catalog.scss` |

- Embedded data: `#catalog-data` in `templates/catalog.html` (merged at build time)
- URL: `/catalog/?subject=math` (list), `&view=tree` (map), `&view=compare` (math curricula doc — HTML partial `partials/math-curricula-compare.html`)

**List view:** full-card link for live chapters; number + title row on wide screens.

**Map view:** custom `nodeComponents.text` renders the same card DOM as list (`catalog-chapter-card--map`). Only the **title** is a link (with `→` and animated underline on hover/focus). Planned chapters are non-clickable. Do not make the whole card an `<a>`.

**Map layout:** one column per strand; Y from DAG level + per-level max card height. Node width `300px` (`CHAPTER_NODE_WIDTH`). Heights: off-screen `scrollHeight` per card, then after viewer paints, `measureRenderedMapChapterCards()` + `relayoutCanvasChapterHeights()` once if any node was too short. Waits for `document.fonts.ready` before first layout.

**Canvas viewer quirks:** use `container.get(internal.InteractionHandler).onClick` (not `viewer.onClick`); edge colors must be 8-digit hex (no `rgba` on node/edge color fields); wheel on map uses capture-phase `stopPropagation` unless Ctrl/Cmd so the page can scroll.

Prerequisites: **only** `graph.edges` (required, global DAG, cross-strand OK). Longest-path levels. No implicit strand-list chains. List order ≠ map order.

## Chapter content (colocated folder)

Live chapters live under `content/{subject}/{slug}/`:

1. `data/{subject}-curriculum.json` — catalog metadata (`status`, `curriculums`, `graph.edges`)
2. `_index.md` — front matter only (`template = "chapter.html"`, `[extra] subject`, `chapter_id`, `strand`)
3. `core.html` (required), optional `supplement.html`, `assets/`, `widgets/*.tsx`, optional `chapter.scss`
4. `bun run sync:chapters` merges HTML into `_index.md`, copies assets to `static/chapters/…`, generates `frontend/src/generated/chapter-widgets.ts`
5. `templates/chapter.html` renders `{{ section.content | safe }}`; widgets use `data-widget` + auto-mount in `main.tsx`

Reference: `content/math/quadratic-equations/`.

## Verify before PR

```bash
bun run build
```

- `public/catalog/index.html` includes your JSON changes in `#catalog-data`
- No stale `themes/openfreebooks/static/**/*.html` (delete if present — they override Zola)
- `public/main.css` contains new Sass selectors
- Catalog: subject appears, filters work, map loads without cycle error; map cards not clipped (check long titles e.g. permutations); live map titles link and show underline on hover
- Live chapter: breadcrumb → catalog, no curriculum mentions in body

## Planned / not implemented (do not assume)

- Defuddle “copy as Markdown” on chapters
- Markdown-based chapters (spec says HTML; README may be outdated)
- Data-driven homepage cards
- Single-file subject registration (catalog template still special-cases `math`)

See README **Contributor experience** task list for tracked fixes.

## Additional resources

- [curriculum-data.md](curriculum-data.md) — JSON schemas, examples, graph rules
- [zola/SKILL.md](../zola/SKILL.md) — Tera, Sass, Solid mount points
- [zola/zola-solid.md](../zola/zola-solid.md) — `main.tsx`, bundle, dialogs
