import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { $ } from "bun";
import { fingerprintPaths } from "./build-change-detector";

const ROOT = join(import.meta.dir, "..");
const CONTENT = join(ROOT, "content");
const BUNDLE_PATH = join(ROOT, "themes/openfreebooks/static/js/bundle.js");
const BUILD_CACHE_PATH = join(ROOT, "data/_generated/build-chapter-cache.json");

type Chapter = { key: string; subject: string; slug: string };
type BuildCache = { version: 1; shellFingerprint: string };

async function runStep(command: string) {
  const result = await $`bash -lc ${command}`;
  if (result.exitCode !== 0) process.exit(result.exitCode || 1);
}

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
      const indexPath = join(subjectDir, slug, "_index.md");
      if (!existsSync(indexPath)) continue;
      const raw = await readFile(indexPath, "utf8");
      if (!/template\s*=\s*["']chapter\.html["']/.test(raw)) continue;
      output.push({ key: `${subject}/${slug}`, subject, slug });
    }
  }
  return output.sort((a, b) => a.key.localeCompare(b.key));
}

function patternToRegex(pattern: string): RegExp {
  const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*");
  return new RegExp(`^${escaped}$`);
}

function resolvePatterns(chapters: Chapter[], patterns: string[]): Chapter[] {
  const results = new Map<string, Chapter>();
  for (const pattern of patterns) {
    const regex = patternToRegex(pattern);
    const matches = chapters.filter((chapter) => regex.test(chapter.key));
    for (const chapter of matches) {
      results.set(chapter.key, chapter);
    }
  }
  return [...results.values()].sort((a, b) => a.key.localeCompare(b.key));
}

async function changedChapterKeys(chapterKeys: Set<string>): Promise<string[]> {
  const trackedDiff = await $`git --no-pager diff --name-only HEAD -- content`.text();
  const untracked = await $`git --no-pager ls-files --others --exclude-standard -- content`.text();
  const files = new Set(
    [...trackedDiff.split("\n"), ...untracked.split("\n")]
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
  );

  const keys = new Set<string>();
  for (const file of files) {
    const match = file.match(/^content\/([^/]+)\/([^/]+)\//);
    if (!match) continue;
    const key = `${match[1]}/${match[2]}`;
    if (chapterKeys.has(key)) keys.add(key);
  }
  return [...keys].sort();
}

async function confirmDetectedChanges(chapters: Chapter[], frontendChanged: boolean): Promise<boolean> {
  if (chapters.length > 0) {
    console.log("[build:chapter] Auto-detected changed chapters:");
    for (const chapter of chapters) {
      console.log(`  - ${chapter.key}`);
    }
  }
  if (frontendChanged) {
    console.log("[build:chapter] Auto-detected frontend/site-shell changes.");
  }
  const rl = createInterface({ input, output });
  const answer = (await rl.question("Proceed? [y/N] ")).trim().toLowerCase();
  rl.close();
  return answer === "y" || answer === "yes";
}

async function readBuildCache(): Promise<BuildCache | null> {
  if (!existsSync(BUILD_CACHE_PATH)) return null;
  try {
    const parsed = JSON.parse(await readFile(BUILD_CACHE_PATH, "utf8")) as BuildCache;
    if (parsed.version !== 1) return null;
    return parsed;
  } catch {
    return null;
  }
}

async function writeBuildCache(cache: BuildCache) {
  await mkdir(dirname(BUILD_CACHE_PATH), { recursive: true });
  await writeFile(BUILD_CACHE_PATH, `${JSON.stringify(cache, null, 2)}\n`);
}

async function shellFingerprint(): Promise<string> {
  return fingerprintPaths(ROOT, [join(ROOT, "frontend"), join(ROOT, "vite.config.ts")]);
}

function runPagefindInBackground() {
  const command =
    'pagefind --site public --glob "**/index.html" && rm -rf static/pagefind && cp -R public/pagefind static/pagefind';
  const child = spawn("bash", ["-lc", command], {
    cwd: ROOT,
    detached: true,
    stdio: "ignore",
  });
  child.unref();
  console.log("[build:chapter] Pagefind indexing started in background.");
}

async function main() {
  const patterns = process.argv.slice(2).filter((arg) => !arg.startsWith("--"));
  const chapters = await discoverChapters();
  const chapterByKey = new Map(chapters.map((chapter) => [chapter.key, chapter]));
  const previousBuild = await readBuildCache();
  const currentShellFingerprint = await shellFingerprint();
  const frontendChanged =
    !existsSync(BUNDLE_PATH) || previousBuild?.shellFingerprint !== currentShellFingerprint;

  let targets: Chapter[] = [];

  if (patterns.length > 0) {
    targets = resolvePatterns(chapters, patterns);
    if (targets.length === 0) {
      console.error(`[build:chapter] No chapters matched patterns: ${patterns.join(", ")}`);
      process.exit(1);
    }
  } else {
    if (!input.isTTY || !output.isTTY) {
      console.error("[build:chapter] Non-interactive mode requires explicit chapter arguments.");
      process.exit(1);
    }
    const changedKeys = await changedChapterKeys(new Set(chapters.map((chapter) => chapter.key)));
    targets = changedKeys.map((key) => chapterByKey.get(key)).filter((c): c is Chapter => Boolean(c));

    if (targets.length === 0 && !frontendChanged) {
      console.log("[build:chapter] No changed chapters or frontend changes detected.");
      return;
    }

    const confirmed = await confirmDetectedChanges(targets, frontendChanged);
    if (!confirmed) {
      console.log("[build:chapter] Cancelled.");
      return;
    }
  }

  if (targets.length > 0) {
    await runStep("bun scripts/sync-chapters.ts");
    await runStep(`bun scripts/build-chapter-widgets.ts ${targets.map((t) => t.key).join(" ")}`);
  }

  const needsShellBuild = !existsSync(BUNDLE_PATH) || frontendChanged;
  if (needsShellBuild) {
    await runStep("rm -f themes/openfreebooks/static/main.css public/main.css");
    await runStep("vite build");
  }

  await runStep("bun scripts/generate-site-metadata.ts");
  await runStep("rm -rf public");
  await runStep("zola build");
  runPagefindInBackground();

  await writeBuildCache({ version: 1, shellFingerprint: currentShellFingerprint });
  const summaryTargets = targets.length > 0 ? targets.map((target) => target.key).join(", ") : "(frontend only)";
  console.log(`[build:chapter] Core build done: ${summaryTargets}`);
}

void main();
