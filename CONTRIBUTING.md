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

**Search locally:** After `bun run build:js`, run `bun run index:search` once (or again after changing chapter HTML), then `zola serve`. Try [http://127.0.0.1:1111/search/](http://127.0.0.1:1111/search/) or press ⌘K / Ctrl+K. Pagefind indexes **live chapter pages only** (not home, about, catalog, or credits). Without `index:search`, the search UI loads but returns no results.

---

## How the catalog fits together

```text
data/catalog.json              → subjects in the sidebar + filter chips (DSE, IB, …)
data/{subject}-curriculum.json → strands, chapters, curriculum tags, graph.edges
content/{subject}/{slug}/      → actual chapter page (when status is "live")
themes/.../partials/...        → chapter HTML content (today)
```

- **Catalog** (`/catalog/`) — **List** (numbered cards; live = whole card links) and **Map** (`?view=tree`, Mermaid; live = title link only with `→` and hover underline).
- **`/math/`** redirects to `/catalog/?subject=math`.
- **Curriculum names** (DSE, IB, …) appear only in the catalog — not inside chapter text ([spec.md](spec.md)).
- Every chapter needs a **`description`** in curriculum JSON (map clamps to three lines).

### Map graph rules (summary)

| Rule | Detail |
|------|--------|
| Edges | **Only** `graph.edges` — no automatic chain from strand `chapters[]` order |
| Meaning | Each edge is a **required** prerequisite (`from` → `to`) |
| Scope | Cross-strand edges allowed |
| Layout | **Longest-path** levels; siblings at the same level stack vertically in a column |
| DAG | No cycles — build throws if the graph cycles |
| `tier` | Optional `foundation` (default) or `non-foundation` (Extension badge) |

---

## Add a planned chapter (roadmap)

Use this when the chapter is not written yet but should appear in the catalog.

1. Open `data/{subject}-curriculum.json` (e.g. `data/math-curriculum.json`).
2. Find the right **strand** (topic group).
3. Add a chapter object:

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

(`tier` is optional — omit for foundation topics; `non-foundation` shows an **Extension** badge.)

4. Use a **kebab-case** `slug` (letters, numbers, hyphens only).
5. Set `curriculums` to every syllabus tag that applies. Tags must exist in `data/catalog.json` → `curriculums`.
6. Run `zola build` and check `/catalog/?subject=math` (or your subject).

No `content/` files needed for planned chapters.

---

## Publish a live chapter

A live chapter needs **catalog data** and a **page**.

### 1. Catalog entry

In `data/{subject}-curriculum.json`, set `"status": "live"` and include a `description` (see [planned chapter](#add-a-planned-chapter-roadmap)).

### 2. Zola section

Create `content/{subject}/{slug}/_index.md`:

```md
+++
title = "Your chapter title"
description = "One sentence for search and previews — no curriculum names here."
template = "math/chapter.html"
weight = 10
[extra]
chapter_id = "your-chapter-slug"
+++
```

- `slug` in the path must match `slug` in the JSON file.
- `chapter_id` must match the slug (used by the template).
- `weight` controls order within the section (lower = earlier).

### 3. Chapter HTML content

Today, chapter bodies live as HTML partials under the theme, not Markdown:

1. Add `themes/openfreebooks/templates/partials/math/your-chapter-slug-content.html` with the lesson HTML.
2. In `themes/openfreebooks/templates/math/chapter.html`, include it when `chapter_id` matches (chapter content is inside `<article data-pagefind-body>` for search indexing):

```html
{% if section.extra.chapter_id == "your-chapter-slug" %}
{% include "partials/math/your-chapter-slug-content.html" %}
{% endif %}
```

Use existing classes: `book-prose`, `book-prose__heading`, `book-callout`, etc. Copy from `quadratic-equations-core-content.html`.

**Do not** mention DSE, IB, or other curriculum names in the chapter body.

### 4. Interactive widgets (optional)

If the chapter needs a Solid widget (like the quadratic explorer):

1. Add a component under `frontend/src/components/`.
2. Mount it in `frontend/src/main.tsx` when a mount element exists.
3. Add `<div id="your-widget" class="math-widget-mount"></div>` in the chapter template branch.

Then run `bun run build:js`.

### 5. Check

- `/catalog/?subject=math` — chapter appears; live chapters link correctly.
- `/math/your-chapter-slug/` — page renders; breadcrumb goes to catalog.
- `bun run build` completes without errors.

---

## Chapter graph (branches)

The **Map** tab (`?view=tree`) shows chapters as a directed graph (strand = column, arrows = prerequisites).

- Prerequisites are **only** declared in `graph.edges` (strand list order does not create arrows).
- For **branches** or **merges**, add edges:

```json
"graph": {
  "edges": [
    { "from": "quadratic-equations", "to": "sequences-series" },
    { "from": "quadratic-equations", "to": "functions-graphs" },
    { "from": "functions-graphs", "to": "linear-programming" },
    { "from": "sequences-series", "to": "linear-programming" }
  ]
}
```

Rules:

- `from` and `to` are chapter **slugs**.
- The graph must **not contain cycles**.
- Edges may cross strands.

Open `/catalog/?subject=math&view=tree` to verify. Use Ctrl/Cmd + wheel on the map to zoom.

---

## Add a new subject

Example: adding **Science**.

1. **`data/catalog.json`** — add to `subjects`:

   ```json
   { "id": "science", "name": "Science" }
   ```

2. **`data/science-curriculum.json`** — create with `title`, `strands`, and chapters (copy structure from `math-curriculum.json`).

3. **`themes/openfreebooks/templates/catalog.html`** — wire the new file into `#catalog-data` (see `math` block).

4. **`content/science/`** — add `_index.md` when you have a section.

5. **Homepage** — optional card in `themes/openfreebooks/templates/index.html`.

6. Build and test `/catalog/?subject=science`.

---

## Add a curriculum label

Example: adding **GCSE**.

1. Add `"GCSE"` to `curriculums` in `data/catalog.json`.
2. Tag chapters with `"GCSE"` in their `curriculums` arrays.
3. Add a badge style in `themes/openfreebooks/sass/_catalog.scss` (copy `.catalog-badge--igcse` pattern).
4. Add a mapping in `frontend/src/lib/catalog-badge.ts` → `curriculumBadgeClass()` (or rely on the default style).

---

## Development & tests

```bash
bun install
bun run build:js    # after frontend/ changes
zola serve
bun test            # catalog map generation (catalog-to-mermaid)
bun run build
```

- Do **not** commit `themes/openfreebooks/static/` (Vite output). Run `bun run build:js` before `zola build` or `zola serve`.
- Do **not** commit `public/`.

---

## Pull requests

- Keep changes focused (one subject or a few chapters per PR is fine).
- Run `bun run build` before opening the PR.
- Describe what you added: subject, chapters, live vs planned, and which curricula apply.

Questions? Open a [GitHub discussion](https://github.com/hananoshikayomaru/openfreebooks) or issue.

---

## For maintainers & agents

Machine-oriented detail: [.agents/skills/ofb/SKILL.md](.agents/skills/ofb/SKILL.md) and [.agents/skills/ofb/curriculum-data.md](.agents/skills/ofb/curriculum-data.md).
