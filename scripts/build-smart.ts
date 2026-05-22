import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { $ } from "bun";
import { fingerprintPaths } from "./build-change-detector";

const ROOT = join(import.meta.dir, "..");
const CACHE_PATH = join(ROOT, "data/_generated/build-smart-cache.json");
const GENERATED_WIDGETS = join(ROOT, "frontend/src/generated/chapter-widgets.ts");
const GENERATED_SUBJECT_MODULES = join(ROOT, "frontend/src/generated/subject-modules.ts");
const BUNDLE_PATH = join(ROOT, "themes/openfreebooks/static/js/bundle.js");
const PUBLIC_INDEX = join(ROOT, "public/index.html");
const CHAPTER_LASTMOD_PATH = join(ROOT, "data/_generated/chapter-lastmod.json");
const PAGEFIND_DIR = join(ROOT, "static/pagefind");

type BuildCache = {
  version: 1;
  fingerprints: {
    syncInputs: string;
    jsInputs: string;
    siteInputs: string;
    metadataInputs: string;
    generatedModules: string;
  };
};

async function listCurriculumFiles(): Promise<string[]> {
  const dataDir = join(ROOT, "data");
  const entries = await readdir(dataDir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => join(dataDir, entry.name));
}

async function listContentJsInputs(): Promise<string[]> {
  const contentDir = join(ROOT, "content");
  const inputs: string[] = [];
  const queue = [contentDir];
  while (queue.length) {
    const current = queue.pop();
    if (!current) continue;
    const entries = await readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith(".")) continue;
      const abs = join(current, entry.name);
      if (entry.isDirectory()) {
        queue.push(abs);
        continue;
      }
      if (entry.name === "subject.ts" || abs.includes("/widgets/")) {
        inputs.push(abs);
      }
    }
  }
  return inputs;
}

async function listStaticSourceInputs(): Promise<string[]> {
  const staticDir = join(ROOT, "static");
  if (!existsSync(staticDir)) return [];
  const inputs: string[] = [];
  const queue = [staticDir];
  while (queue.length) {
    const current = queue.pop();
    if (!current) continue;
    const entries = await readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith(".")) continue;
      const abs = join(current, entry.name);
      if (entry.isDirectory()) {
        if (abs === join(staticDir, "pagefind")) continue;
        if (abs === join(staticDir, "chapters")) continue;
        if (abs === join(staticDir, "css")) continue;
        queue.push(abs);
        continue;
      }
      inputs.push(abs);
    }
  }
  return inputs;
}

async function readCache(): Promise<BuildCache | null> {
  if (!existsSync(CACHE_PATH)) return null;
  try {
    const parsed = JSON.parse(await readFile(CACHE_PATH, "utf8")) as BuildCache;
    if (parsed.version !== 1) return null;
    return parsed;
  } catch {
    return null;
  }
}

async function runStep(command: string) {
  const result = await $`bash -lc ${command}`;
  if (result.exitCode !== 0) {
    process.exit(result.exitCode);
  }
}

async function runFullBuild() {
  await runStep("bun run check:static-html");
  await runStep("bun run validate:curriculum");
  await runStep("rm -f themes/openfreebooks/static/main.css public/main.css");
  await runStep("bun run sync:chapters -- --full");
  await runStep("vite build");
  await runStep("bun run generate:site-metadata");
  await runStep("zola build");
  await runStep("bun run index:search");
}

async function main() {
  if (process.env.CI === "true") {
    await runFullBuild();
    return;
  }

  const curriculumFiles = await listCurriculumFiles();
  const contentJsInputs = await listContentJsInputs();
  const staticSourceInputs = await listStaticSourceInputs();
  const fingerprints = {
    syncInputs: await fingerprintPaths(ROOT, [
      join(ROOT, "content"),
      join(ROOT, "scripts/sync-chapters.ts"),
      join(ROOT, "scripts/build-change-detector.ts"),
      ...curriculumFiles,
    ]),
    jsInputs: await fingerprintPaths(ROOT, [
      join(ROOT, "frontend"),
      join(ROOT, "vite.config.ts"),
      ...contentJsInputs,
    ]),
    siteInputs: await fingerprintPaths(ROOT, [
      join(ROOT, "content"),
      join(ROOT, "themes/openfreebooks/templates"),
      join(ROOT, "themes/openfreebooks/sass"),
      join(ROOT, "zola.toml"),
      ...staticSourceInputs,
    ]),
    metadataInputs: await fingerprintPaths(ROOT, [
      join(ROOT, "content"),
      join(ROOT, "zola.toml"),
      join(ROOT, "scripts/generate-site-metadata.ts"),
      ...curriculumFiles,
    ]),
    generatedModules: "",
  };

  const previous = await readCache();
  const previousFingerprints = previous?.fingerprints;
  const firstRun = !previous;
  const hasGeneratedModules = existsSync(GENERATED_WIDGETS) && existsSync(GENERATED_SUBJECT_MODULES);
  const needsSync =
    firstRun || !hasGeneratedModules || previousFingerprints?.syncInputs !== fingerprints.syncInputs;

  await runStep("bun run check:static-html");
  await runStep("bun run validate:curriculum");

  if (needsSync) {
    await runStep("bun run sync:chapters");
  }

  fingerprints.generatedModules = await fingerprintPaths(ROOT, [GENERATED_WIDGETS, GENERATED_SUBJECT_MODULES]);

  const needsJs =
    firstRun ||
    !existsSync(BUNDLE_PATH) ||
    previousFingerprints?.jsInputs !== fingerprints.jsInputs ||
    previousFingerprints?.generatedModules !== fingerprints.generatedModules;
  if (needsJs) {
    await runStep("rm -f themes/openfreebooks/static/main.css public/main.css");
    await runStep("vite build");
  }

  const needsMetadata =
    firstRun ||
    !existsSync(CHAPTER_LASTMOD_PATH) ||
    previousFingerprints?.metadataInputs !== fingerprints.metadataInputs;
  if (needsMetadata) {
    await runStep("bun run generate:site-metadata");
  }

  const needsSite =
    firstRun ||
    !existsSync(PUBLIC_INDEX) ||
    needsJs ||
    needsMetadata ||
    previousFingerprints?.siteInputs !== fingerprints.siteInputs;
  if (needsSite) {
    await runStep("zola build");
  }

  if (needsSite || !existsSync(PAGEFIND_DIR)) {
    await runStep("bun run index:search");
  }

  console.log(
    `[build-smart] sync=${needsSync} js=${needsJs} metadata=${needsMetadata} site=${needsSite} firstRun=${firstRun}`
  );

  const nextCache: BuildCache = { version: 1, fingerprints };
  await mkdir(dirname(CACHE_PATH), { recursive: true });
  await writeFile(CACHE_PATH, `${JSON.stringify(nextCache, null, 2)}\n`);
}

main();
