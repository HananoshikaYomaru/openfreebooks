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
| Add a **catalog subject banner** | [§ Catalog subject banner](#catalog-subject-banner) |
| Add a **curriculum** filter (e.g. GCSE) | [§ New curriculum label](#add-a-curriculum-label) |

**Browse the catalog locally:** `bun run dev` → [http://127.0.0.1:1111/catalog/](http://127.0.0.1:1111/catalog/)

**Search locally:** Run `bun run build:chapter ...` or `bun run build:site` after content changes to refresh the index, then use `bun run dev`. Try [http://127.0.0.1:1111/search/](http://127.0.0.1:1111/search/) or press ⌘K / Ctrl+K.

**Build modes:** use `bun run build:chapter` for targeted chapter builds and `bun run build:site` for full rebuilds.

---

## How the catalog fits together

```text
data/{subject}-curriculum.json  → catalog list + map (status, curriculumCoverage, graph.edges)
content/{subject}/{slug}/       → everything for the live page (one folder)
  _index.md, core.html, supplement.html, assets/, widgets/, chapter.scss
```

- **Catalog** (`/catalog/`) — list, map (`?view=tree`), and for Mathematics a Compare doc (`?view=compare`, HTML partial `themes/openfreebooks/templates/partials/math-curricula-compare.html`). Curriculum names (DSE, IB, …) appear only in the catalog — not inside chapter prose ([spec.md](spec.md)).
- Every chapter needs a **`description`** in curriculum JSON (map clamps to three lines).
- Chapter sync (merging `core.html` + `supplement.html` into `_index.md`) runs automatically in build commands. Edit HTML sources, not merged `_index.md`.

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
  "curriculumCoverage": {
    "DSE": "core",
    "IGCSE": "core",
    "IB": "related"
  },
  "tier": "non-foundation"
}
```

Each framework maps to `core`, `extension`, or `related` (Compare matrix). Use `extension` for elective / M2-style topics; `related` when the topic supports but is not a named unit.

3. Use **kebab-case** slugs. No `content/` folder needed for planned chapters.

---

## Publish a live chapter

### 1. Catalog entry

In `data/{subject}-curriculum.json`, set `"status": "live"` and include `description`, `curriculumCoverage`, and optional `tier`.

### 2. Chapter folder

Create `content/{subject}/{slug}/`:

```text
content/math/                    # subject folder (mathematics today)
├── subject.scss                 # shared CSS for all math chapters → /css/subjects/math.css
├── subject.ts                   # shared JS init for all math chapters
└── your-chapter-slug/
    ├── _index.md                # page metadata (see below)
    ├── core.html                # required — main lesson HTML
    ├── supplement.html          # optional — history, checkpoints, extra demos
    ├── chapter.scss             # optional — styles for this chapter only
    ├── assets/                  # optional — images (synced to static/chapters/…)
    └── widgets/                 # optional — Solid widgets (auto-mounted)
        └── my-widget.tsx        # default export; data-widget="my-widget" in HTML
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
- **Checkpoints:** `<details class="book-question">` with `book-question__prompt` and `book-question__solution` (not `__answer`). See `.agents/skills/ofb/math-chapter-patterns.md`.
- Put styles reused across several chapters in `content/{subject}/subject.scss`, not in each `chapter.scss`.
- **Do not** mention DSE, IB, or other curriculum names in chapter HTML.
- Mount widgets with `<div class="math-widget-mount" data-widget="widget-name" data-pagefind-ignore></div>` (filename without `.tsx` = `data-widget` value).
- **Math (KaTeX):** write `\( … \)` and `\[ … \]` in HTML; prose and widget DOM are auto-rendered globally on chapter load and dynamic updates. For computed strings in widgets, use `import { renderLatex } from "@ofb/katex"` — do not add a per-widget `renderLatex` helper.
- Reference synced assets with root-relative paths: `/chapters/math/your-chapter-slug/image.png` (chapter HTML is not processed as Tera)

### 4. Build and check

```bash
bun run build:chapter math/your-chapter-slug
bun run dev
```

- `/catalog/?subject=math` — chapter appears and links correctly.
- `/math/your-chapter-slug/` — page renders.
- `bun run build` — full production build.

New subjects with shared CSS/JS: add `content/{subject}/subject.scss` and/or `subject.ts`; chapter sync during build wires them automatically. No per-chapter template branches.

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

1. `data/catalog.json` — add the subject to `subjects`.
2. Create `data/{id}-curriculum.json` (same schema as `math-curriculum.json`; `strands` + optional `graph.edges`).
3. Add `content/{subject}/` when you have live chapters.
4. Run `bun run build:chapter {subject}/*` (this syncs chapters, rebuilds relevant widgets, and updates global outputs).

### Subject scaffold (copyable)

```text
data/
  {subject}-curriculum.json
content/{subject}/
  subject.scss                # optional shared styles
  subject.ts                  # optional shared JS init
  {chapter-slug}/
    _index.md                 # template = "chapter.html", extra.subject = "{subject}"
    core.html                 # required
    supplement.html           # optional
    chapter.scss              # optional chapter-only styles
    assets/                   # optional
    widgets/*.tsx             # optional
```

No catalog/chapter template edits are required for new subjects when the subject is present in `data/catalog.json` and `data/{subject}-curriculum.json` exists.

---

## Catalog subject banner

Optional header image when browsing a subject in the catalog (List and Map). Subjects without a `banner` field keep the plain header.

1. Prepare a **2:1** image (e.g. 2000×1000). Keep the large source file out of the repo if possible.
2. Optimize to WebP under `static/catalog/banners/`:

```bash
mkdir -p static/catalog/banners

# ffmpeg (requires libwebp in your build):
ffmpeg -y -i your-banner.jpg -vf "scale=1400:-2" -c:v libwebp -quality 82 \
  static/catalog/banners/math.webp

# or cwebp (Homebrew: brew install webp):
cwebp -resize 1400 0 -q 82 your-banner.jpg -o static/catalog/banners/math.webp
```

3. In `data/catalog.json`, add a root-relative path on the subject:

```json
{ "id": "math", "name": "Mathematics", "banner": "/catalog/banners/math.webp" }
```

4. Check locally: `bun run build:chapter math/* && bun run dev` → `/catalog/?subject=math`

Omit `banner` for subjects that should stay unchanged (e.g. roadmap-only placeholders).

---

## Add a curriculum label

1. Add the label to `curriculums` in `data/catalog.json`.
2. Add roles per chapter in `curriculumCoverage` (and update Compare if needed).
3. Add badge style in `themes/openfreebooks/sass/_catalog.scss` and mapping in `frontend/src/lib/catalog-badge.ts`.

---

## Development & tests

```bash
bun install
bun run dev
bun run build:chapter math/measures-dispersion math/loci
bun run build:chapter math/*
bun run build:chapter   # auto-detect changed chapters, list, confirm
bun run build:site
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
