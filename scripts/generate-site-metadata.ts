import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import { dirname, join, relative, sep } from "node:path";
import { $ } from "bun";

type FrontMatter = {
  title?: string;
  description?: string;
  template?: string;
};

type CurriculumChapter = {
  slug?: unknown;
  status?: unknown;
  title?: unknown;
  description?: unknown;
};

type CurriculumStrand = {
  chapters?: unknown;
};

type CurriculumFile = {
  strands?: unknown;
};

type UrlEntry = {
  urlPath: string;
  title: string;
  description: string;
  sourcePaths: string[];
  lastmod: Date | null;
};

const ROOT = join(import.meta.dir, "..");
const CONTENT_DIR = join(ROOT, "content");
const DATA_DIR = join(ROOT, "data");
const STATIC_DIR = join(ROOT, "static");
const SITEMAP_PATH = join(STATIC_DIR, "sitemap.xml");
const FEED_PATH = join(STATIC_DIR, "feed.xml");

function xmlEscape(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function toPosixPath(path: string): string {
  return path.split(sep).join("/");
}

function normalizeBaseUrl(rawBaseUrl: string): string {
  return rawBaseUrl.replace(/\/+$/, "");
}

function ensureTrailingSlash(path: string): string {
  return path.endsWith("/") ? path : `${path}/`;
}

function parseFrontMatter(markdown: string): FrontMatter {
  const match = markdown.match(/^\+\+\+([\s\S]*?)\+\+\+/);
  if (!match) return {};
  const block = match[1];

  const readKey = (key: string): string | undefined => {
    const lineMatch = block.match(new RegExp(`^\\s*${key}\\s*=\\s*"([^"]*)"\\s*$`, "m"));
    return lineMatch?.[1]?.trim();
  };

  return {
    title: readKey("title"),
    description: readKey("description"),
    template: readKey("template"),
  };
}

async function readBaseUrlFromConfig(): Promise<string> {
  const zolaPath = join(ROOT, "zola.toml");
  const raw = await readFile(zolaPath, "utf8");
  const match = raw.match(/^\s*base_url\s*=\s*"([^"]+)"\s*$/m);
  if (!match) {
    throw new Error("Could not read base_url from zola.toml");
  }
  return normalizeBaseUrl(match[1]);
}

async function discoverMarkdownFiles(dir: string): Promise<string[]> {
  const output: string[] = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    const abs = join(dir, entry.name);
    if (entry.isDirectory()) {
      output.push(...(await discoverMarkdownFiles(abs)));
      continue;
    }
    if (entry.isFile() && entry.name.endsWith(".md")) {
      output.push(abs);
    }
  }
  return output;
}

async function readLiveChapterKeys(): Promise<Set<string>> {
  const keys = new Set<string>();
  const entries = await readdir(DATA_DIR, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith("-curriculum.json")) continue;
    const subject = entry.name.replace(/-curriculum\.json$/, "");
    const jsonPath = join(DATA_DIR, entry.name);
    const raw = await readFile(jsonPath, "utf8");
    const data = JSON.parse(raw) as CurriculumFile;
    if (!Array.isArray(data.strands)) continue;
    for (const strand of data.strands as CurriculumStrand[]) {
      if (!Array.isArray(strand.chapters)) continue;
      for (const chapter of strand.chapters as CurriculumChapter[]) {
        if (!isNonEmptyString(chapter.slug)) continue;
        if (chapter.status !== "live") continue;
        keys.add(`${subject}/${chapter.slug}`);
      }
    }
  }
  return keys;
}

async function readGitLastmod(sourcePaths: string[]): Promise<Date | null> {
  const relPaths = sourcePaths
    .map((sourcePath) => toPosixPath(relative(ROOT, sourcePath)))
    .filter((rel) => rel.length > 0);

  if (relPaths.length === 0) return null;
  const proc = await $`git --no-pager log -1 --format=%cI -- ${relPaths}`.quiet();
  if (proc.exitCode !== 0) return null;

  const raw = proc.stdout.toString().trim();
  if (!raw) return null;

  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

async function readFilesystemLastmod(sourcePaths: string[]): Promise<Date | null> {
  let latestMs = 0;

  const visit = async (path: string): Promise<void> => {
    const info = await stat(path);
    if (info.isDirectory()) {
      const entries = await readdir(path, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.name.startsWith(".")) continue;
        await visit(join(path, entry.name));
      }
      return;
    }
    if (info.mtimeMs > latestMs) {
      latestMs = info.mtimeMs;
    }
  };

  for (const sourcePath of sourcePaths) {
    if (!existsSync(sourcePath)) continue;
    await visit(sourcePath);
  }

  if (!latestMs) return null;
  return new Date(latestMs);
}

function toUrlPathFromMarkdown(contentRelativePath: string): string {
  const rel = toPosixPath(contentRelativePath);
  if (rel === "_index.md") return "/";
  if (rel.endsWith("/_index.md")) {
    return ensureTrailingSlash(`/${rel.replace(/\/_index\.md$/, "")}`);
  }
  return ensureTrailingSlash(`/${rel.replace(/\.md$/, "")}`);
}

function isChapterIndex(contentRelativePath: string, fm: FrontMatter): boolean {
  return contentRelativePath.endsWith("/_index.md") && fm.template === "chapter.html";
}

function chapterKeyFromContentPath(contentRelativePath: string): string | null {
  const parts = toPosixPath(contentRelativePath).split("/");
  if (parts.length !== 3 || parts[2] !== "_index.md") return null;
  return `${parts[0]}/${parts[1]}`;
}

async function buildEntries(): Promise<UrlEntry[]> {
  const markdownFiles = await discoverMarkdownFiles(CONTENT_DIR);
  const liveChapterKeys = await readLiveChapterKeys();
  const entries: UrlEntry[] = [];

  for (const absMarkdownPath of markdownFiles) {
    const relPath = toPosixPath(relative(CONTENT_DIR, absMarkdownPath));
    const raw = await readFile(absMarkdownPath, "utf8");
    const fm = parseFrontMatter(raw);

    if (isChapterIndex(relPath, fm)) {
      const key = chapterKeyFromContentPath(relPath);
      if (!key || !liveChapterKeys.has(key)) continue;
      const chapterDir = join(CONTENT_DIR, key);
      const sourcePaths = [chapterDir];
      const lastmod = (await readGitLastmod(sourcePaths)) ?? (await readFilesystemLastmod(sourcePaths));
      entries.push({
        urlPath: toUrlPathFromMarkdown(relPath),
        title: fm.title ?? key.split("/")[1],
        description: fm.description ?? fm.title ?? key.split("/")[1],
        sourcePaths,
        lastmod,
      });
      continue;
    }

    const urlPath = toUrlPathFromMarkdown(relPath);
    if (urlPath === "/404/") continue;

    const sourcePaths = [absMarkdownPath];
    const lastmod = (await readGitLastmod(sourcePaths)) ?? (await readFilesystemLastmod(sourcePaths));
    const fallbackTitle =
      urlPath === "/"
        ? "Open Free Books"
        : urlPath
            .split("/")
            .filter(Boolean)
            .at(-1)
            ?.replaceAll("-", " ") ?? "Page";

    entries.push({
      urlPath,
      title: fm.title ?? fallbackTitle,
      description: fm.description ?? fm.title ?? fallbackTitle,
      sourcePaths,
      lastmod,
    });
  }

  const dedup = new Map<string, UrlEntry>();
  for (const entry of entries) {
    if (!dedup.has(entry.urlPath)) {
      dedup.set(entry.urlPath, entry);
    }
  }

  const result = [...dedup.values()];
  result.sort((a, b) => a.urlPath.localeCompare(b.urlPath));
  return result;
}

function renderSitemap(baseUrl: string, entries: UrlEntry[]): string {
  const lines = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'];

  for (const entry of entries) {
    const loc = `${baseUrl}${entry.urlPath}`;
    lines.push("  <url>");
    lines.push(`    <loc>${xmlEscape(loc)}</loc>`);
    if (entry.lastmod) {
      lines.push(`    <lastmod>${entry.lastmod.toISOString()}</lastmod>`);
    }
    lines.push("  </url>");
  }

  lines.push("</urlset>", "");
  return lines.join("\n");
}

function renderFeed(baseUrl: string, entries: UrlEntry[]): string {
  const sorted = [...entries].sort((a, b) => {
    const aMs = a.lastmod?.getTime() ?? 0;
    const bMs = b.lastmod?.getTime() ?? 0;
    return bMs - aMs;
  });
  const latest = sorted.find((entry) => entry.lastmod)?.lastmod ?? new Date();

  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    "  <channel>",
    "    <title>Open Free Books</title>",
    `    <link>${xmlEscape(`${baseUrl}/`)}</link>`,
    "    <description>Recent updates to Open Free Books pages and live chapters.</description>",
    `    <lastBuildDate>${latest.toUTCString()}</lastBuildDate>`,
  ];

  for (const entry of sorted) {
    const link = `${baseUrl}${entry.urlPath}`;
    const pubDate = (entry.lastmod ?? latest).toUTCString();
    lines.push("    <item>");
    lines.push(`      <title>${xmlEscape(entry.title)}</title>`);
    lines.push(`      <link>${xmlEscape(link)}</link>`);
    lines.push(`      <guid isPermaLink="true">${xmlEscape(link)}</guid>`);
    lines.push(`      <pubDate>${xmlEscape(pubDate)}</pubDate>`);
    lines.push(`      <description>${xmlEscape(entry.description)}</description>`);
    lines.push("    </item>");
  }

  lines.push("  </channel>", "</rss>", "");
  return lines.join("\n");
}

async function main() {
  const baseUrl = await readBaseUrlFromConfig();
  const entries = await buildEntries();
  await mkdir(dirname(SITEMAP_PATH), { recursive: true });
  await writeFile(SITEMAP_PATH, renderSitemap(baseUrl, entries));
  await writeFile(FEED_PATH, renderFeed(baseUrl, entries));

  if (!existsSync(SITEMAP_PATH) || !existsSync(FEED_PATH)) {
    throw new Error("Failed to generate sitemap/feed outputs");
  }

  console.log(`Generated ${toPosixPath(relative(ROOT, SITEMAP_PATH))} with ${entries.length} URL(s).`);
  console.log(`Generated ${toPosixPath(relative(ROOT, FEED_PATH))} with ${entries.length} item(s).`);
}

main();
