# Contributing to Open Free Books

Thank you for helping grow free, open textbooks. This guide focuses on **curriculum, subjects, and chapters** — the most common contribution.

**Prerequisites:** [Zola](https://www.getzola.org/), [Bun](https://bun.sh/). See [README.md](README.md) for dev setup.

---

## Quick reference

| I want to… | Start here |
|------------|------------|
| Add a **planned** chapter (roadmap only) | [§ Planned chapter](#add-a-planned-chapter-roadmap) |
| Publish a **live** chapter (readable page) | [§ Live chapter](#publish-a-live-chapter) |
| Add a **branch** in the catalog map | [§ Chapter graph](#chapter-graph-branches) |
| Add a new **subject** | [§ New subject](#add-a-new-subject) |
| Add a **curriculum** filter (e.g. GCSE) | [§ New curriculum label](#add-a-curriculum-label) |

**Browse the catalog locally:** `bun run build:js && zola serve` → [http://127.0.0.1:1111/catalog/](http://127.0.0.1:1111/catalog/)

---

## How the catalog fits together

```text
data/catalog.json              → subjects in the sidebar + filter chips (DSE, IB, …)
data/{subject}-curriculum.json → strands, chapters, curriculum tags, optional graph
content/{subject}/{slug}/      → actual chapter page (when status is "live")
themes/.../partials/...        → chapter HTML content (today)
```

- **Catalog** (`/catalog/`) is the place to browse everything.
  - **List** — numbered chapter cards; live chapters link to the whole card.
  - **Map** — strand columns on a pannable JSON Canvas graph; live chapters link from the **title only** (with `→` and a hover underline).
- **`/math/`** redirects to `/catalog/?subject=math` — there is no separate math book homepage.
- **Curriculum names** (DSE, IB, …) appear only in the catalog — not inside chapter text ([spec.md](spec.md)).
- Every chapter needs a short **`description`** in curriculum JSON (shown in list and map; map clamps description to three lines).

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
  "curriculums": ["DSE"]
}
```

4. Use a **kebab-case** `slug` (letters, numbers, hyphens only).
5. Set `curriculums` to every syllabus tag that applies. Tags must exist in `data/catalog.json` → `curriculums`.
6. Run `zola build` and check `/catalog/?subject=math` (or your subject).

No `content/` files needed for planned chapters.

---

## Publish a live chapter

A live chapter needs **catalog data** and a **page**.

### 1. Catalog entry

In `data/{subject}-curriculum.json`, set `"status": "live"` and include a `description` for the chapter (see [planned chapter](#add-a-planned-chapter-roadmap)).

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
2. In `themes/openfreebooks/templates/math/chapter.html`, include it when `chapter_id` matches:

```html
{% if section.extra.chapter_id == "your-chapter-slug" %}
{% include "partials/math/your-chapter-slug-content.html" %}
{% endif %}
```

Use existing classes: `book-prose`, `book-prose__heading`, `book-callout`, etc. Copy from `quadratic-equations-content.html`.

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

The **Map** tab (`?view=tree`) shows chapters as a directed graph on a canvas (strand = column, arrows = prerequisites / sequence).

- Chapters appear as cards with title, description, and curriculum badges.
- **Live** chapters: click the **title** to open the chapter (not the whole card).
- **Planned** chapters: shown with a “Coming soon” badge; no link.
- By default, chapters in a strand link in **list order** (chapter 1 → chapter 2 → …).
- For **branches** (one chapter leads to several next chapters), add `graph.edges`:

```json
"graph": {
  "edges": [
    { "from": "quadratic-equations", "to": "sequences" },
    { "from": "quadratic-equations", "to": "functions-graphs" }
  ]
}
```

Rules:

- `from` and `to` are chapter **slugs**.
- The graph must **not contain cycles** (no circular prerequisites).
- Edges must reference slugs that exist in `strands`.

Open `/catalog/?subject=math&view=tree` to verify layout. Scroll the page normally; use Ctrl/Cmd + wheel on the map to zoom. Pan by clicking the map first if the “click to interact” banner appears.

If a map card looks **clipped** at the bottom (badges or description cut off), that is a layout bug — long titles and descriptions need enough node height. Report it or see [curriculum-data.md](.agents/skills/ofb/curriculum-data.md) for how heights are measured.

---

## Add a new subject

Example: adding **Science**.

1. **`data/catalog.json`** — add to `subjects`:

   ```json
   { "id": "science", "name": "Science" }
   ```

2. **`data/science-curriculum.json`** — create with `title`, `strands`, and chapters (copy structure from `math-curriculum.json`).

3. **`themes/openfreebooks/templates/catalog.html`** — today you must wire the new file into `#catalog-data` (see `math` block). *This step should get easier; see README contributor tasks.*

4. **`content/science/`** — add `_index.md` (redirect template like math) when you have a section.

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

## Pull requests

- Keep changes focused (one subject or a few chapters per PR is fine).
- Run `bun run build` before opening the PR.
- Do **not** commit `public/` or copied HTML under `themes/openfreebooks/static/`.
- **Do** commit Vite output under `themes/openfreebooks/static/js/` (`bundle.js` and hashed chunks such as `catalog-app-*.js`, `catalog-canvas-view-*.js`) after `bun run build:js`.
- Describe what you added in the PR: subject, chapters, live vs planned, and which curricula apply.

Questions? Open a [GitHub discussion](https://github.com/hananoshikayomaru/openfreebooks) or issue.

---

## For maintainers & agents

Machine-oriented detail: [.agents/skills/ofb/SKILL.md](.agents/skills/ofb/SKILL.md) and [.agents/skills/ofb/curriculum-data.md](.agents/skills/ofb/curriculum-data.md).
