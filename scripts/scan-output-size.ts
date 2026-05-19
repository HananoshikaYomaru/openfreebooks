import { readdir, stat } from "node:fs/promises";
import { join, relative } from "node:path";

const OUTPUT_DIRS = [
  { label: "Zola (deploy)", path: "public" },
  { label: "Vite JS/CSS", path: "themes/openfreebooks/static/js" },
] as const;

const TOP_FILES = 15;

type FileEntry = { path: string; bytes: number };

async function collectFiles(
  dir: string,
  root: string,
  entries: FileEntry[],
): Promise<void> {
  let items;
  try {
    items = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }

  for (const item of items) {
    const fullPath = join(dir, item.name);
    if (item.isDirectory()) {
      await collectFiles(fullPath, root, entries);
      continue;
    }
    if (!item.isFile()) continue;

    const { size } = await stat(fullPath);
    entries.push({ path: relative(root, fullPath), bytes: size });
  }
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function padEnd(value: string, width: number): string {
  return value.length >= width ? value : value + " ".repeat(width - value.length);
}

async function scanDir(label: string, root: string) {
  const entries: FileEntry[] = [];
  await collectFiles(root, root, entries);

  if (entries.length === 0) {
    console.log(`\n${label} (${root}/)`);
    console.log("  (missing or empty — run `bun run build` first)\n");
    return null;
  }

  const total = entries.reduce((sum, e) => sum + e.bytes, 0);
  entries.sort((a, b) => b.bytes - a.bytes);

  console.log(`\n${label} (${root}/)`);
  console.log(`  files: ${entries.length}`);
  console.log(`  total: ${formatBytes(total)} (${total.toLocaleString()} bytes)`);

  const labelWidth = Math.min(
    52,
    Math.max(...entries.slice(0, TOP_FILES).map((e) => e.path.length), 4),
  );

  console.log(`\n  largest files:`);
  for (const entry of entries.slice(0, TOP_FILES)) {
    console.log(
      `    ${padEnd(entry.path, labelWidth)}  ${padEnd(formatBytes(entry.bytes), 10)}  ${entry.bytes.toLocaleString()} B`,
    );
  }

  return { label, root, total, fileCount: entries.length, entries };
}

async function main() {
  const cwd = process.cwd();
  console.log(`Output size scan — ${cwd}`);

  const results = [];
  for (const { label, path } of OUTPUT_DIRS) {
    const result = await scanDir(label, join(cwd, path));
    if (result) results.push(result);
  }

  if (results.length > 0) {
    const grandTotal = results.reduce((sum, r) => sum + r.total, 0);
    console.log("\n---");
    console.log(
      `Combined tracked output: ${formatBytes(grandTotal)} (${grandTotal.toLocaleString()} bytes)`,
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
