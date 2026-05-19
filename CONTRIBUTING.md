# Contributing to Open Free Books

Thank you for helping grow free, open textbooks.

**Readable guide (with examples):** [openfreebooks.org/contributing](https://openfreebooks.org/contributing/) — or locally after `zola serve` → [http://127.0.0.1:1111/contributing/](http://127.0.0.1:1111/contributing/)

**Prerequisites:** [Zola](https://www.getzola.org/), [Bun](https://bun.sh/). See [README.md](README.md) for dev setup.

---

## Quick reference

| I want to… | Start here |
|------------|------------|
| Add a **planned** chapter (roadmap only) | [§ Planned chapter](#add-a-planned-chapter-roadmap) |
| Publish a **live** chapter (readable page) | [§ Publish a live chapter](#publish-a-live-chapter) |
| Add a **branch** in the catalog map | [§ Chapter graph](#chapter-graph-branches) |
| Add a new **subject** | [§ New subject](#add-a-new-subject) |
| Add a **curriculum** filter (e.g. GCSE) | [§ New curriculum label](#add-a-curriculum-label) |

**Browse the catalog locally:** `bun run build:js && zola serve` → [http://127.0.0.1:1111/catalog/](http://127.0.0.1:1111/catalog/)

**Search locally:** After `bun run build:js`, run `bun run index:search` once (or again after changing chapter HTML), then `zola serve`. Try [http://127.0.0.1:1111/search/](http://127.0.0.1:1111/search/) or press ⌘K / Ctrl+K.

---

## How the catalog fits together

```text
data/{subject}-curriculum.json  → catalog list + map (status, curriculums, graph.edges)
content/{subject}/{slug}/       → everything for the live page (one folder)
  _index.md, core.html, supplement.html, assets/, widgets/, chapter.scss
```

- **Catalog** (`/catalog/`) — list and map (`?view=tree`). Curriculum names (DSE, IB, …) appear only in the catalog — not inside chapter prose ([spec.md](spec.md)).
- Every chapter needs a **`description`** in curriculum JSON (map clamps to three lines).
- **`bun run sync:chapters`** (also run automatically by `bun run build:js`) merges `core.html` + `supplement.html` into `_index.md` for Zola. Edit the HTML files, not the merged body in `_index.md`.

### Map graph rules (summary)

| Rule | Detail |
|------|--------|
| Edges | **Only** `graph.edges` — strand `chapters[]` order does not create arrows |
| Meaning | Each edge is a **required** prerequisite (`from` → `to`) |
| Scope | Cross-strand edges allowed |
| Layout | **Longest-path** levels; siblings stack vertically |
| DAG | No cycles — build throws if the graph cycles |
| `tier` | Optional `foundation` (default) or `non-foundation` (Extension badge) |

---

## Add a planned chapter (roadmap)

1. Open `data/{subject}-curriculum.json` (e.g. `data/math-curriculum.json`).
2. Add a chapter object under the right **strand**:

```json
{
  "slug": "your-chapter-slug",
  "title": "Human-readable title",
  "description": "One or two sentences for the catalog list and map card.",
  "status": "planned",
  "curriculums": ["DSE"],
  "tier": "non-foundation"
}
```

3. Use **kebab-case** slugs. No `content/` folder needed for planned chapters.

---

## Publish a live chapter

### 1. Catalog entry

In `data/{subject}-curriculum.json`, set `"status": "live"` and include `description`, `curriculums`, and optional `tier`.

### 2. Chapter folder

Create `content/{subject}/{slug}/`:

```text
content/math/your-chapter-slug/
├── _index.md           # page metadata (see below)
├── core.html           # required — main lesson HTML
├── supplement.html     # optional — history, checkpoints, extra demos
├── chapter.scss        # optional — chapter-specific styles
├── assets/             # optional — images (synced to static/chapters/…)
└── widgets/            # optional — Solid widgets (auto-mounted)
    └── my-widget.tsx   # default export; use data-widget="my-widget" in HTML
```

**`_index.md` front matter** (page fields only — catalog fields stay in JSON):

```md
+++
title = "Your chapter title"
description = "One sentence for search and previews — no curriculum names here."
template = "chapter.html"
weight = 10
[extra]
subject = "math"
chapter_id = "your-chapter-slug"
strand = "Number & Algebra"
+++
```

### 3. HTML and widgets

- Use shared classes: `book-prose`, `book-prose__heading`, `book-callout`, etc. Copy from `content/math/quadratic-equations/`.
- **Do not** mention DSE, IB, or other curriculum names in chapter HTML.
- Mount widgets with `<div class="math-widget-mount" data-widget="widget-name" data-pagefind-ignore></div>` (filename without `.tsx` = `data-widget` value).
- Reference synced assets with root-relative paths: `/chapters/math/your-chapter-slug/image.png` (chapter HTML is not processed as Tera)

### 4. Build and check

```bash
bun run build:js    # sync:chapters + Vite bundle
zola serve
```

- `/catalog/?subject=math` — chapter appears and links correctly.
- `/math/your-chapter-slug/` — page renders.
- `bun run build` — full production build.

No theme edits, no `main.tsx` edits, no per-chapter template branches.

---

## Chapter graph (branches)

Add edges in `data/{subject}-curriculum.json`:

```json
"graph": {
  "edges": [
    { "from": "quadratic-equations", "to": "sequences-series" }
  ]
}
```

`from` / `to` are chapter **slugs**. Graph must be acyclic. Verify at `/catalog/?subject=math&view=tree`.

---

## Add a new subject

1. `data/catalog.json` — add to `subjects`.
2. Create `data/{id}-curriculum.json` (copy structure from `math-curriculum.json`).
3. Wire the subject in `themes/openfreebooks/templates/catalog.html` (until auto-wire lands).
4. Add `content/{subject}/` when you have chapters.

---

## Add a curriculum label

1. Add the label to `curriculums` in `data/catalog.json`.
2. Tag chapters in their `curriculums` arrays.
3. Add badge style in `themes/openfreebooks/sass/_catalog.scss` and mapping in `frontend/src/lib/catalog-badge.ts`.

---

## Development & tests

```bash
bun install
bun run sync:chapters  # after content/ chapter changes
bun run build:js       # sync + Vite
zola serve
bun test
bun run build
```

- Do **not** commit `themes/openfreebooks/static/` (Vite output).
- Do **not** commit `public/`.

---

## Pull requests

- Keep changes focused.
- Run `bun run build` before opening the PR.
- Describe subject, chapters, live vs planned, and curricula.

Questions? Open a [GitHub discussion](https://github.com/hananoshikayomaru/openfreebooks) or issue.

---

## For maintainers & agents

Machine-oriented detail: [.agents/skills/ofb/SKILL.md](.agents/skills/ofb/SKILL.md).
