import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, rm, writeFile, copyFile } from "node:fs/promises";
import { basename, dirname, join, relative } from "node:path";
import { $ } from "bun";

const ROOT = join(import.meta.dir, "..");
const CONTENT = join(ROOT, "content");
const GENERATED_META = join(ROOT, "data/_generated/chapters-meta.json");
const GENERATED_WIDGETS = join(ROOT, "frontend/src/generated/chapter-widgets.ts");
const STATIC_ROOT = join(ROOT, "static");
const CHAPTER_CSS_DIR = join(STATIC_ROOT, "css/chapters");

type ChapterMeta = {
  hasSupplement: boolean;
  hasCss: boolean;
};

type ChaptersMetaFile = {
  chapters: Record<string, ChapterMeta>;
};

function parseChapterTemplate(markdown: string): boolean {
  return /template\s*=\s*["']chapter\.html["']/.test(markdown);
}

/** Chapter HTML is Zola section body, not a Tera template — rewrite legacy get_url tags. */
function normalizeChapterHtml(html: string): string {
  return html
    .replace(
      /\{\{\s*get_url\(path=['"]([^'"]+)['"][^)]*\)\s*\|\s*safe\s*\}\}/g,
      (_, assetPath: string) => `/${assetPath.replace(/^\//, "")}`
    )
    .replace(/\{\{\s*get_url\([^}]+\)\s*\}\}/g, (tag) => {
      console.warn(`Unresolved Tera in chapter HTML (use /chapters/… paths): ${tag}`);
      return tag;
    });
}

function splitFrontMatter(markdown: string): { frontMatter: string; body: string } {
  const match = markdown.match(/^(\+\+\+[\s\S]*?\+\+\+)\s*([\s\S]*)$/);
  if (!match) {
    return { frontMatter: markdown.trimEnd(), body: "" };
  }
  return { frontMatter: match[1], body: match[2].trim() };
}

async function copyFileEnsuringDir(src: string, dest: string) {
  await mkdir(dirname(dest), { recursive: true });
  await copyFile(src, dest);
}

async function copyDir(srcDir: string, destDir: string) {
  let entries;
  try {
    entries = await readdir(srcDir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const src = join(srcDir, entry.name);
    const dest = join(destDir, entry.name);
    if (entry.isDirectory()) {
      await copyDir(src, dest);
    } else {
      await copyFileEnsuringDir(src, dest);
    }
  }
}

async function compileChapterScss(
  subject: string,
  slug: string,
  scssPath: string
): Promise<boolean> {
  const outPath = join(CHAPTER_CSS_DIR, `${subject}-${slug}.css`);
  await mkdir(CHAPTER_CSS_DIR, { recursive: true });
  const result = await $`sass ${scssPath} ${outPath} --style=compressed --no-source-map`.quiet();
  if (result.exitCode !== 0) {
    console.error(`Failed to compile ${scssPath}`);
    process.exit(1);
  }
  return true;
}

async function discoverChapters(): Promise<
  Array<{ subject: string; slug: string; dir: string }>
> {
  const chapters: Array<{ subject: string; slug: string; dir: string }> = [];
  let subjects;
  try {
    subjects = await readdir(CONTENT, { withFileTypes: true });
  } catch {
    return chapters;
  }

  for (const subjectEntry of subjects) {
    if (!subjectEntry.isDirectory() || subjectEntry.name.startsWith(".")) continue;
    const subject = subjectEntry.name;
    const subjectDir = join(CONTENT, subject);
    const slugEntries = await readdir(subjectDir, { withFileTypes: true });
    for (const slugEntry of slugEntries) {
      if (!slugEntry.isDirectory() || slugEntry.name.startsWith(".")) continue;
      const slug = slugEntry.name;
      const dir = join(subjectDir, slug);
      const indexPath = join(dir, "_index.md");
      if (!existsSync(indexPath)) continue;
      const markdown = await readFile(indexPath, "utf8");
      if (!parseChapterTemplate(markdown)) continue;
      chapters.push({ subject, slug, dir });
    }
  }
  return chapters;
}

async function syncChapter(chapter: {
  subject: string;
  slug: string;
  dir: string;
}): Promise<{ key: string; meta: ChapterMeta; widgets: string[] }> {
  const { subject, slug, dir } = chapter;
  const key = `${subject}/${slug}`;
  const corePath = join(dir, "core.html");
  if (!existsSync(corePath)) {
    console.error(`Missing core.html for chapter ${key}`);
    process.exit(1);
  }

  const coreHtml = normalizeChapterHtml(await readFile(corePath, "utf8"));
  const supplementPath = join(dir, "supplement.html");
  const hasSupplement = existsSync(supplementPath);
  const supplementHtml = hasSupplement
    ? normalizeChapterHtml(await readFile(supplementPath, "utf8"))
    : "";
  const mergedBody = hasSupplement
    ? `${coreHtml.trim()}\n\n${supplementHtml.trim()}\n`
    : `${coreHtml.trim()}\n`;

  const indexPath = join(dir, "_index.md");
  const indexRaw = await readFile(indexPath, "utf8");
  const { frontMatter } = splitFrontMatter(indexRaw);
  await writeFile(indexPath, `${frontMatter}\n\n${mergedBody}`);

  const assetsDir = join(dir, "assets");
  const staticAssetsDir = join(STATIC_ROOT, "chapters", subject, slug);
  if (existsSync(assetsDir)) {
    await rm(staticAssetsDir, { recursive: true, force: true });
    await copyDir(assetsDir, staticAssetsDir);
  }

  const scssPath = join(dir, "chapter.scss");
  let hasCss = false;
  if (existsSync(scssPath)) {
    hasCss = await compileChapterScss(subject, slug, scssPath);
  }

  const widgetsDir = join(dir, "widgets");
  const widgets: string[] = [];
  if (existsSync(widgetsDir)) {
    const files = await readdir(widgetsDir);
    for (const file of files) {
      if (file.endsWith(".tsx") && !file.startsWith("_")) {
        widgets.push(basename(file, ".tsx"));
      }
    }
  }

  return { key, meta: { hasSupplement, hasCss }, widgets };
}

function buildWidgetRegistry(
  entries: Array<{ key: string; widgets: string[]; dir: string }>
): string {
  const lines: string[] = [
    "// Auto-generated by scripts/sync-chapters.ts — do not edit.",
    "",
    "import type { Component } from \"solid-js\";",
    "",
    "export type ChapterWidgetModule = { default: Component };",
    "",
    "export const chapterWidgetLoaders: Record<string, () => Promise<ChapterWidgetModule>> = {",
  ];

  for (const { key, widgets, dir } of entries) {
    const relFromGenerated = relative(dirname(GENERATED_WIDGETS), dir).replace(/\\/g, "/");
    for (const widget of widgets) {
      const importPath = `${relFromGenerated}/widgets/${widget}.tsx`;
      lines.push(`  "${key}/${widget}": () => import("${importPath}"),`);
    }
  }

  lines.push("};", "");
  return lines.join("\n");
}

async function main() {
  const chapters = await discoverChapters();
  const metaFile: ChaptersMetaFile = { chapters: {} };
  const widgetEntries: Array<{ key: string; widgets: string[]; dir: string }> = [];

  for (const chapter of chapters) {
    const { key, meta, widgets } = await syncChapter(chapter);
    metaFile.chapters[key] = meta;
    widgetEntries.push({ key, widgets, dir: chapter.dir });
    console.log(`Synced chapter ${key} (${widgets.length} widget(s))`);
  }

  await mkdir(dirname(GENERATED_META), { recursive: true });
  await writeFile(GENERATED_META, `${JSON.stringify(metaFile, null, 2)}\n`);

  await mkdir(dirname(GENERATED_WIDGETS), { recursive: true });
  await writeFile(GENERATED_WIDGETS, buildWidgetRegistry(widgetEntries));

  console.log(`Synced ${chapters.length} chapter(s).`);
}

main();
