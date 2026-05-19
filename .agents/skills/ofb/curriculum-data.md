# Curriculum & catalog data

## `data/catalog.json`

Site-wide catalog chrome.

```json
{
  "title": "Curriculum Catalog",
  "subtitle": "Browse chapters by subject and curriculum",
  "curriculums": ["DSE", "IB", "A-Level", "AP", "IGCSE"],
  "subjects": [
    { "id": "math", "name": "Mathematics" }
  ]
}
```

| Field | Rules |
|-------|--------|
| `id` | kebab-case, URL-safe; becomes `?subject=` and path prefix `/{id}/` |
| `name` | Display label in sidebar |
| `curriculums` | Union of all filter chips; add new labels here first |

## `data/{subject}-curriculum.json`

Example: `data/math-curriculum.json`.

```json
{
  "title": "Mathematics",
  "subtitle": "Short tagline for data (not shown on every page)",
  "intro": "Optional; was used by old book page",
  "graph": {
    "edges": [
      { "from": "quadratic-equations", "to": "sequences" },
      { "from": "quadratic-equations", "to": "functions-graphs" }
    ]
  },
  "strands": [
    {
      "id": "number-algebra",
      "title": "Number & Algebra",
      "chapters": [
        {
          "slug": "quadratic-equations",
          "title": "Quadratic equations",
          "description": "One or two sentences shown in list and map views.",
          "status": "live",
          "curriculums": ["DSE", "IB"]
        }
      ]
    }
  ]
}
```

### Chapter fields

| Field | Required | Notes |
|-------|----------|-------|
| `slug` | yes | Matches `content/{subject}/{slug}/`; kebab-case |
| `title` | yes | Catalog list + map node label |
| `description` | yes | 1–2 sentences; shown in list and map cards (clamped to 3 lines on map) |
| `status` | yes | `live` (link to chapter) or `planned` (no link) |
| `curriculums` | yes | Non-empty array; values must exist in `catalog.json` `curriculums` |

### Graph edges

- `from` / `to` are **chapter slugs** (not node ids).
- Edges must form a **DAG** (no cycles). Map builder runs cycle detection.
- Strand order still adds implicit edges: each chapter → next chapter in the same strand (deduped).
- Use explicit edges for **branches** (one chapter → multiple next chapters).

### Wiring into catalog

`themes/openfreebooks/templates/catalog.html` must expose strands + graph in `#catalog-data`. **Today only `math` is wired** — adding a subject requires a Tera block like:

```tera
{% set subject_catalog = load_data(path="data/science-curriculum.json", format="json") %}
...
"strands": {% if subject.id == "science" %}{{ subject_catalog.strands | json_encode() | safe }}{% else %}[]{% endif %}
```

**Goal (tracked in README):** auto-load `data/{id}-curriculum.json` by subject id.

## Status: planned vs live

| status | Catalog list | Map node | Content required |
|--------|--------------|----------|------------------|
| `planned` | Shown, “Coming soon” badge | Card shown; title not linked | Only JSON entry |
| `live` | Full card links to chapter | Title links to chapter (`→` + underline); rest of card not clickable | `content/` + HTML partial + template wiring |

Map nodes are `type: "text"` in JSON Canvas; the viewer renders custom HTML via `catalog-chapter-card.tsx` (`renderCatalogChapterCardElement`), not markdown.

## Adding a curriculum label

1. Add string to `data/catalog.json` → `curriculums`.
2. Tag chapters with that string in `curriculums` arrays.
3. Add `.catalog-badge--{name}` in `_catalog.scss` (see existing `--dse`, `--ib`, …).
4. Optional: `curriculumBadgeClass()` in `frontend/src/lib/catalog-badge.ts` (defaults exist).

## Map card heights (agents)

Do not use fixed node heights or font-metrics libraries for layout. The pipeline is:

1. `measureAllMapChapterCardHeights()` — render each card off-screen; read `scrollHeight`.
2. `subjectToCanvas()` — assign node `height` and column Y from DAG levels.
3. After `json-canvas-viewer` paints, `measureRenderedMapChapterCards()` + `relayoutCanvasChapterHeights()` — bump any node still too short and reflow Y / strand groups.

Card markup must stay in sync between `catalog-chapter-card.tsx` (Solid + `renderCatalogChapterCardElement`) and `_catalog.scss` (especially `.catalog-chapter-card--map`).

## Validation (manual until scripted)

- JSON parses (`jq . data/math-curriculum.json`).
- Every `live` slug has `content/{subject}/{slug}/_index.md`.
- Every `curriculums[]` value is listed in `catalog.json`.
- Graph edges reference existing slugs; no cycles (open catalog map view).
- `bun run build` succeeds.
