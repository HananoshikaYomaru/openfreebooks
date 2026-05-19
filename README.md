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
| Hosting | Cloudflare Workers (static assets via Wrangler) |

Book content will use Markdown. Canvas features will follow the [JSON Canvas](https://jsoncanvas.org/) standard (Obsidian-compatible).

## Prerequisites

- [Zola](https://www.getzola.org/documentation/getting-started/installation/) 0.19+
- [Bun](https://bun.sh/) (for frontend build)
- [Wrangler](https://developers.cloudflare.com/workers/wrangler/) 4.x (for deploy)

## Project layout

```
content/                 # Pages and sections (Markdown)
static/                  # Site assets copied to public/ (favicons, manifest)
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

Build the Solid bundle and start Zola’s dev server:

```bash
bun run build:js
zola serve
```

Open [http://127.0.0.1:1111](http://127.0.0.1:1111). Re-run `bun run build:js` (or `bun run dev:js` in another terminal) when you change `frontend/`.

## Production build

```bash
bun run build
```

This runs `vite build` (outputs to `themes/openfreebooks/static/js/bundle.js`) and then `zola build` (outputs to `public/`).

## Deploy to Cloudflare

```bash
bun run build
wrangler deploy
```

The Worker name is `openfreebooks` (see `wrangler.jsonc`). Assets are served from `public/` with no server-side logic.

## Configuration

Site-wide settings live in `zola.toml`:

- `base_url` — canonical URL for feeds and absolute links
- `[extra]` — `site_title`, `github_url`, `browse_url`, `about_url` (used in templates and the Solid config block)

## Theme notes

The visual design is inspired by [manlung.work](https://manlung.work/): paper background with grain, Instrument Serif headings, warm ochre accent (`#9a6b2e`), and light/dark mode (system preference plus a toggle).

**Keep `themes/openfreebooks/static/` clean.** Only committed built assets belong there (currently `js/bundle.js`). Do not copy Zola’s `public/` output into the theme `static/` folder — that pollutes `public/js/` on the next build.

## License

Open source — see the repository license file when added.
