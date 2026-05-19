# Open Free Books

Free, open-source textbooks for every learner — from elementary school through university. The site is fully static, open on GitHub, and deployed to Cloudflare.

**Live site:** [openfreebooks.org](https://openfreebooks.org)

## Stack

| Layer | Tool |
|-------|------|
| Site generator | [Zola](https://www.getzola.org/) |
| Theme | Custom theme in `themes/openfreebooks/` |
| Interactivity | [Solid.js](https://www.solidjs.com/) (header, marquee, scroll reveal, theme toggle) |
| JS build | [Bun](https://bun.sh/) + [Vite](https://vite.dev/) |
| Search | [Pagefind](https://pagefind.app/) (post-build index, Component UI) |
| Hosting | Cloudflare Workers (static assets via Wrangler) |

Chapter content is **HTML partials** in the theme today (not Markdown). Canvas maps use the [JSON Canvas](https://jsoncanvas.org/) standard (Obsidian-compatible) via [json-canvas-viewer](https://github.com/Hesprs/JSON-Canvas-Viewer).

**Contributing curriculum, subjects, or chapters?** See [CONTRIBUTING.md](CONTRIBUTING.md).

## Prerequisites

- [Zola](https://www.getzola.org/documentation/getting-started/installation/) 0.19+
- [Bun](https://bun.sh/) (for frontend build)
- [Wrangler](https://developers.cloudflare.com/workers/wrangler/) 4.x (for deploy)

## Project layout

```
content/                 # Pages and sections (Markdown front matter)
data/                    # Catalog + per-subject curriculum JSON
static/                  # Site assets copied to public/ (favicons, _redirects)
themes/openfreebooks/    # Zola theme
  templates/             # HTML (Tera)
  sass/                  # Stylesheets (compiled to main.css)
  static/js/bundle.js    # Built Solid bundle (committed for simple deploys)
frontend/src/            # Solid.js source
public/                  # Zola build output (gitignored) — Wrangler deploy target
wrangler.jsonc           # Cloudflare Workers static assets config
```

## Development

Install JS dependencies:

```bash
bun install
```

Build the Solid bundle, index search (once per session or after content changes), then start Zola’s dev server:

```bash
bun run build:js
bun run index:search
zola serve
```

Open [http://127.0.0.1:1111](http://127.0.0.1:1111). Re-run `bun run build:js` (or `bun run dev:js` in another terminal) when you change `frontend/`. Re-run `bun run index:search` when you change chapter HTML or add pages so search stays up to date.

Search UI is available immediately; results require the index step above (`static/pagefind/` is gitignored and copied from the build output).

## Production build

```bash
bun run build
```

This runs `vite build` (outputs to `themes/openfreebooks/static/js/bundle.js`), `zola build` (outputs to `public/`), then Pagefind (`public/pagefind/`).

## Deploy to Cloudflare

```bash
bun run build
wrangler deploy
```

The Worker name is `openfreebooks` (see `wrangler.jsonc`). Assets are served from `public/` with no server-side logic.

## Configuration

Site-wide settings live in `zola.toml`:

- `base_url` — canonical URL for feeds and absolute links
- `[extra]` — `site_title`, `github_url`, `browse_url`, `search_url`, `about_url` (used in templates and the Solid config block)

## Theme notes

The visual design is inspired by [manlung.work](https://manlung.work/): paper background with grain, Instrument Serif headings, warm ochre accent (`#9a6b2e`), and light/dark mode (system preference plus a toggle).

**Keep `themes/openfreebooks/static/` clean.** Only committed built assets belong there (currently `js/bundle.js`). Do not copy Zola’s `public/` output into the theme `static/` folder — that pollutes `public/js/` on the next build.

## Contributor experience — known friction (task list)

These issues make contributions harder than they should be. PRs that fix any item are welcome.

### Catalog & data

- [ ] **Auto-wire subjects in `catalog.html`** — stop hardcoding `if subject.id == "math"`; load `data/{id}-curriculum.json` by subject `id` convention.
- [ ] **Single source for subjects** — merge `catalog.json` subject stubs and `{subject}-curriculum.json` or generate one from the other at build time.
- [ ] **`scripts/validate-curriculum.ts`** — JSON schema check: slugs, `curriculums` ⊆ global list, live chapters have `content/`, `graph.edges` acyclic.
- [ ] **Document or script new curriculum labels** — today requires `catalog.json`, Sass badge, and TS `curriculumBadgeClass()` mapping.

### Chapters & content

- [x] **Colocated chapter folders** — `content/{subject}/{slug}/` with `sync:chapters`, generic `chapter.html`, auto widget registry.
- [x] **Strand kicker from front matter** — `[extra] strand` in `_index.md`.
- [ ] **Subject-agnostic catalog load in chapter template** — breadcrumb still loads `math-curriculum.json` literally until more subjects go live.
- [ ] **Markdown chapters (optional)** — README/spec disagree on format; if staying HTML, document clearly everywhere.
- [ ] **Defuddle “copy as Markdown”** — spec calls for it on every page; not implemented.

### Site & discoverability

- [ ] **Data-driven homepage cards** — “Browse by subject” / featured blocks duplicate manual edits in `index.html`.
- [x] **Pagefind search** — `/search/`, header modal (⌘K), `bun run index:search` for local dev.
- [ ] **CONTRIBUTING wizard or checklist in CI** — fail PR if live chapter missing partial or catalog entry.

### Build & repo hygiene

- [ ] **Prevent stale theme `static/**/*.html`** — committed copies under `themes/openfreebooks/static/` override Zola output (index, catalog, math); add CI check or pre-commit.
- [ ] **Clarify package manager** — project uses **Bun** (`bun run build`); align docs/tooling if pnpm is preferred elsewhere.
- [ ] **`dev` one-liner** — e.g. `bun run dev` running `vite build --watch` + `zola serve` together.

### New subject onboarding

- [ ] **Subject scaffold command** — e.g. `bun run scaffold:subject science` creating `data/science-curriculum.json`, `content/science/_index.md`, and catalog entry.
- [ ] **Redirect template generic** — `math-redirect.html` → `subject-redirect.html` using `?subject=` from section path.

## Agent skills

| Skill | Path | Use |
|-------|------|-----|
| **OFB (this project)** | [.agents/skills/ofb/SKILL.md](.agents/skills/ofb/SKILL.md) | Catalog, curriculum JSON, chapters, product rules |
| **Zola + Solid** | [.agents/skills/zola/SKILL.md](.agents/skills/zola/SKILL.md) | Templates, Sass, bundle, `zola serve` |

## License

Open source — see the repository license file when added.
