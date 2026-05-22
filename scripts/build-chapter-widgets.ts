import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { basename, dirname, join } from "node:path";
import { build } from "vite";
import solid from "vite-plugin-solid";
import { fingerprintPaths } from "./build-change-detector";

const ROOT = join(import.meta.dir, "..");
const CONTENT = join(ROOT, "content");
const OUTPUT_ROOT = join(ROOT, "themes/openfreebooks/static/js/chapter-widgets");
const CACHE_PATH = join(ROOT, "data/_generated/chapter-widgets-cache.json");

type Chapter = { subject: string; slug: string; dir: string; key: string };
type CacheFile = { version: 1; chapters: Record<string, string> };

async function discoverChapters(): Promise<Chapter[]> {
  const output: Chapter[] = [];
  const subjects = await readdir(CONTENT, { withFileTypes: true });
  for (const subjectEntry of subjects) {
    if (!subjectEntry.isDirectory() || subjectEntry.name.startsWith(".")) continue;
    const subject = subjectEntry.name;
    const subjectDir = join(CONTENT, subject);
    const chapterEntries = await readdir(subjectDir, { withFileTypes: true });
    for (const chapterEntry of chapterEntries) {
      if (!chapterEntry.isDirectory() || chapterEntry.name.startsWith(".")) continue;
      const slug = chapterEntry.name;
      const dir = join(subjectDir, slug);
      const indexPath = join(dir, "_index.md");
      if (!existsSync(indexPath)) continue;
      const indexRaw = await readFile(indexPath, "utf8");
      if (!/template\s*=\s*["']chapter\.html["']/.test(indexRaw)) continue;
      output.push({ subject, slug, dir, key: `${subject}/${slug}` });
    }
  }
  return output;
}

async function listWidgets(chapter: Chapter): Promise<string[]> {
  const widgetsDir = join(chapter.dir, "widgets");
  if (!existsSync(widgetsDir)) return [];
  const entries = await readdir(widgetsDir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".tsx") && !entry.name.startsWith("_"))
    .map((entry) => basename(entry.name, ".tsx"))
    .sort();
}

async function chapterFingerprint(chapter: Chapter): Promise<string> {
  return fingerprintPaths(ROOT, [join(chapter.dir, "widgets")]);
}

async function readCache(): Promise<CacheFile> {
  if (!existsSync(CACHE_PATH)) return { version: 1, chapters: {} };
  try {
    const parsed = JSON.parse(await readFile(CACHE_PATH, "utf8")) as CacheFile;
    if (parsed.version !== 1) return { version: 1, chapters: {} };
    return parsed;
  } catch {
    return { version: 1, chapters: {} };
  }
}

async function buildWidget(chapter: Chapter, widget: string) {
  const entry = join(chapter.dir, "widgets", `${widget}.tsx`);
  const outDir = join(OUTPUT_ROOT, chapter.subject, chapter.slug);
  await mkdir(outDir, { recursive: true });
  await build({
    configFile: false,
    plugins: [solid()],
    publicDir: false,
    resolve: {
      alias: {
        "@ofb/katex": join(ROOT, "frontend/src/lib/katex.ts"),
      },
    },
    build: {
      outDir,
      emptyOutDir: false,
      lib: {
        entry,
        formats: ["es"],
        fileName: () => `${widget}.js`,
      },
      rollupOptions: {
        treeshake: false,
        output: {
          chunkFileNames: "assets/[name]-[hash].js",
          assetFileNames: "assets/[name]-[hash][extname]",
        },
      },
    },
  });
}

function parseTargets(args: string[]): { full: boolean; chapterKeys: string[] } {
  const full = args.includes("--full");
  const chapterKeys = args.filter((arg) => !arg.startsWith("--"));
  return { full, chapterKeys };
}

async function main() {
  const { full, chapterKeys } = parseTargets(process.argv.slice(2));
  const chapters = await discoverChapters();
  const chapterByKey = new Map(chapters.map((chapter) => [chapter.key, chapter]));
  const targets =
    chapterKeys.length === 0
      ? chapters
      : chapterKeys
          .map((key) => chapterByKey.get(key))
          .filter((chapter): chapter is Chapter => Boolean(chapter));

  const prev = await readCache();
  const next: CacheFile = { version: 1, chapters: { ...prev.chapters } };

  for (const chapter of targets) {
    const fingerprint = await chapterFingerprint(chapter);
    const unchanged = !full && prev.chapters[chapter.key] === fingerprint;
    if (unchanged) {
      console.log(`Unchanged widgets ${chapter.key} (skipped)`);
      continue;
    }

    const widgets = await listWidgets(chapter);
    const chapterOutDir = join(OUTPUT_ROOT, chapter.subject, chapter.slug);
    await rm(chapterOutDir, { recursive: true, force: true });
    for (const widget of widgets) {
      await buildWidget(chapter, widget);
    }
    next.chapters[chapter.key] = fingerprint;
    console.log(`Built widgets ${chapter.key} (${widgets.length})`);
  }

  await mkdir(dirname(CACHE_PATH), { recursive: true });
  await writeFile(CACHE_PATH, `${JSON.stringify(next, null, 2)}\n`);
}

main();
