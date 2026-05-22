import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, rm, writeFile, copyFile } from "node:fs/promises";
import { basename, dirname, join, relative } from "node:path";
import { $ } from "bun";
import { fingerprintPaths } from "./build-change-detector";

const ROOT = join(import.meta.dir, "..");
const CONTENT = join(ROOT, "content");
const GENERATED_META = join(ROOT, "data/_generated/chapters-meta.json");
const GENERATED_NAV = join(ROOT, "data/_generated/chapter-nav.json");
const GENERATED_WIDGETS = join(ROOT, "frontend/src/generated/chapter-widgets.ts");
const GENERATED_SUBJECT_MODULES = join(ROOT, "frontend/src/generated/subject-modules.ts");
const GENERATED_SUBJECTS_META = join(ROOT, "data/_generated/subjects-meta.json");
const SYNC_CACHE_PATH = join(ROOT, "data/_generated/sync-chapters-cache.json");
const STATIC_ROOT = join(ROOT, "static");
const CHAPTER_CSS_DIR = join(STATIC_ROOT, "css/chapters");
const SUBJECT_CSS_DIR = join(STATIC_ROOT, "css/subjects");

type ChapterMeta = {
  hasSupplement: boolean;
  hasCss: boolean;
};

type ChaptersMetaFile = {
  chapters: Record<string, ChapterMeta>;
};

type CurriculumChapter = {
  slug: string;
  title: string;
  status: "live" | "planned";
};

type CurriculumFile = {
  strands: Array<{ chapters: CurriculumChapter[] }>;
};

type NavLink = {
  slug: string;
  title: string;
};

type ChapterNavEntry = {
  prev: NavLink | null;
  next: NavLink | null;
};

type ChapterNavFile = {
  byKey: Record<string, ChapterNavEntry>;
};

type SubjectMeta = {
  hasCss: boolean;
  hasJs: boolean;
};

type SubjectsMetaFile = {
  subjects: Record<string, SubjectMeta>;
};

type ChapterCacheEntry = {
  fingerprint: string;
  meta: ChapterMeta;
  widgets: string[];
};

type SubjectCacheEntry = {
  fingerprint: string;
  meta: SubjectMeta;
};

type SyncCacheFile = {
  version: 1;
  chapters: Record<string, ChapterCacheEntry>;
  subjects: Record<string, SubjectCacheEntry>;
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

async function compileSubjectScss(subject: string, scssPath: string): Promise<boolean> {
  const outPath = join(SUBJECT_CSS_DIR, `${subject}.css`);
  await mkdir(SUBJECT_CSS_DIR, { recursive: true });
  const result = await $`sass ${scssPath} ${outPath} --style=compressed --no-source-map`.quiet();
  if (result.exitCode !== 0) {
    console.error(`Failed to compile ${scssPath}`);
    process.exit(1);
  }
  return true;
}

async function discoverSubjects(): Promise<Array<{ id: string; dir: string }>> {
  const subjects: Array<{ id: string; dir: string }> = [];
  let entries;
  try {
    entries = await readdir(CONTENT, { withFileTypes: true });
  } catch {
    return subjects;
  }
  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name.startsWith(".")) continue;
    subjects.push({ id: entry.name, dir: join(CONTENT, entry.name) });
  }
  return subjects;
}

async function syncSubject(subject: { id: string; dir: string }): Promise<SubjectMeta> {
  const scssPath = join(subject.dir, "subject.scss");
  const tsPath = join(subject.dir, "subject.ts");
  let hasCss = false;
  let hasJs = false;
  if (existsSync(scssPath)) {
    hasCss = await compileSubjectScss(subject.id, scssPath);
  }
  if (existsSync(tsPath)) {
    hasJs = true;
  }
  return { hasCss, hasJs };
}

async function computeSubjectFingerprint(subject: { id: string; dir: string }): Promise<string> {
  return fingerprintPaths(ROOT, [join(subject.dir, "subject.scss"), join(subject.dir, "subject.ts")]);
}

function buildSubjectModuleRegistry(
  subjects: Array<{ id: string; dir: string; hasJs: boolean }>
): string {
  const withJs = subjects.filter((s) => s.hasJs);
  const lines: string[] = [
    "// Auto-generated by scripts/sync-chapters.ts — do not edit.",
    "",
    "export type SubjectModule = { initSubject: (root: HTMLElement) => void };",
    "",
    "export const subjectInitLoaders: Record<string, () => Promise<SubjectModule>> = {",
  ];
  for (const { id, dir } of withJs) {
    const relFromGenerated = relative(dirname(GENERATED_SUBJECT_MODULES), dir).replace(/\\/g, "/");
    lines.push(`  "${id}": () => import("${relFromGenerated}/subject"),`);
  }
  lines.push("};", "");
  return lines.join("\n");
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
  const nextIndex = `${frontMatter}\n\n${mergedBody}`;
  if (indexRaw !== nextIndex) {
    await writeFile(indexPath, nextIndex);
  }

  const assetsDir = join(dir, "assets");
  const staticAssetsDir = join(STATIC_ROOT, "chapters", subject, slug);
  if (existsSync(assetsDir)) {
    await rm(staticAssetsDir, { recursive: true, force: true });
    await copyDir(assetsDir, staticAssetsDir);
  } else {
    await rm(staticAssetsDir, { recursive: true, force: true });
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

async function computeChapterFingerprint(chapter: {
  subject: string;
  slug: string;
  dir: string;
}): Promise<string> {
  return fingerprintPaths(ROOT, [
    join(chapter.dir, "core.html"),
    join(chapter.dir, "supplement.html"),
    join(chapter.dir, "chapter.scss"),
    join(chapter.dir, "assets"),
    join(chapter.dir, "widgets"),
  ]);
}

async function readSyncCache(): Promise<SyncCacheFile> {
  if (!existsSync(SYNC_CACHE_PATH)) {
    return { version: 1, chapters: {}, subjects: {} };
  }
  try {
    const parsed = JSON.parse(await readFile(SYNC_CACHE_PATH, "utf8")) as SyncCacheFile;
    if (parsed.version !== 1) {
      return { version: 1, chapters: {}, subjects: {} };
    }
    return parsed;
  } catch {
    return { version: 1, chapters: {}, subjects: {} };
  }
}

async function buildChapterNav(
  discovered: Array<{ subject: string; slug: string }>
): Promise<ChapterNavFile> {
  const discoveredSet = new Set(discovered.map((c) => `${c.subject}/${c.slug}`));
  const byKey: Record<string, ChapterNavEntry> = {};
  const subjects = [...new Set(discovered.map((c) => c.subject))];

  for (const subject of subjects) {
    const curriculumPath = join(ROOT, "data", `${subject}-curriculum.json`);
    if (!existsSync(curriculumPath)) continue;

    const curriculum = JSON.parse(await readFile(curriculumPath, "utf8")) as CurriculumFile;
    const sequence: NavLink[] = [];

    for (const strand of curriculum.strands) {
      for (const chapter of strand.chapters) {
        if (chapter.status !== "live") continue;
        const key = `${subject}/${chapter.slug}`;
        if (!discoveredSet.has(key)) continue;
        sequence.push({ slug: chapter.slug, title: chapter.title });
      }
    }

    for (let i = 0; i < sequence.length; i++) {
      const key = `${subject}/${sequence[i].slug}`;
      byKey[key] = {
        prev: i > 0 ? sequence[i - 1] : null,
        next: i < sequence.length - 1 ? sequence[i + 1] : null,
      };
    }
  }

  return { byKey };
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
      const importPath = `${relFromGenerated}/widgets/${widget}`;
      lines.push(`  "${key}/${widget}": () => import("${importPath}"),`);
    }
  }

  lines.push("};", "");
  return lines.join("\n");
}

async function main() {
  const forceFull = process.argv.includes("--full");
  const prevCache = forceFull ? { version: 1, chapters: {}, subjects: {} } : await readSyncCache();
  const nextCache: SyncCacheFile = { version: 1, chapters: {}, subjects: {} };
  const chapters = await discoverChapters();
  const metaFile: ChaptersMetaFile = { chapters: {} };
  const widgetEntries: Array<{ key: string; widgets: string[]; dir: string }> = [];

  for (const chapter of chapters) {
    const key = `${chapter.subject}/${chapter.slug}`;
    const fingerprint = await computeChapterFingerprint(chapter);
    const cached = prevCache.chapters[key];
    let meta: ChapterMeta;
    let widgets: string[];

    if (!forceFull && cached && cached.fingerprint === fingerprint) {
      meta = cached.meta;
      widgets = cached.widgets;
      console.log(`Unchanged chapter ${key} (skipped)`);
    } else {
      const synced = await syncChapter(chapter);
      meta = synced.meta;
      widgets = synced.widgets;
      console.log(`Synced chapter ${key} (${widgets.length} widget(s))`);
    }

    nextCache.chapters[key] = { fingerprint, meta, widgets };
    metaFile.chapters[key] = meta;
    widgetEntries.push({ key, widgets, dir: chapter.dir });
  }

  await mkdir(dirname(GENERATED_META), { recursive: true });
  await writeFile(GENERATED_META, `${JSON.stringify(metaFile, null, 2)}\n`);

  await mkdir(dirname(GENERATED_WIDGETS), { recursive: true });
  await writeFile(GENERATED_WIDGETS, buildWidgetRegistry(widgetEntries));

  const chapterNav = await buildChapterNav(chapters);
  await writeFile(GENERATED_NAV, `${JSON.stringify(chapterNav, null, 2)}\n`);

  const subjectEntries: Array<{ id: string; dir: string; hasJs: boolean }> = [];
  const subjectsMeta: SubjectsMetaFile = { subjects: {} };
  for (const subject of await discoverSubjects()) {
    const fingerprint = await computeSubjectFingerprint(subject);
    const cached = prevCache.subjects[subject.id];
    let meta: SubjectMeta;
    if (!forceFull && cached && cached.fingerprint === fingerprint) {
      meta = cached.meta;
      if (meta.hasCss || meta.hasJs) {
        console.log(
          `Unchanged subject ${subject.id} (css: ${meta.hasCss ? "yes" : "no"}, js: ${meta.hasJs ? "yes" : "no"})`
        );
      }
    } else {
      meta = await syncSubject(subject);
      if (meta.hasCss || meta.hasJs) {
        console.log(
          `Synced subject ${subject.id} (css: ${meta.hasCss ? "yes" : "no"}, js: ${meta.hasJs ? "yes" : "no"})`
        );
      }
    }

    nextCache.subjects[subject.id] = { fingerprint, meta };
    subjectsMeta.subjects[subject.id] = meta;
    subjectEntries.push({ id: subject.id, dir: subject.dir, hasJs: meta.hasJs });
  }
  await writeFile(GENERATED_SUBJECTS_META, `${JSON.stringify(subjectsMeta, null, 2)}\n`);
  await mkdir(dirname(GENERATED_SUBJECT_MODULES), { recursive: true });
  await writeFile(GENERATED_SUBJECT_MODULES, buildSubjectModuleRegistry(subjectEntries));
  await mkdir(dirname(SYNC_CACHE_PATH), { recursive: true });
  await writeFile(SYNC_CACHE_PATH, `${JSON.stringify(nextCache, null, 2)}\n`);

  console.log(`Synced ${chapters.length} chapter(s).`);
}

main();
