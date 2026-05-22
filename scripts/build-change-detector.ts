import { existsSync } from "node:fs";
import { readdir, stat } from "node:fs/promises";
import { join, relative } from "node:path";
import { createHash } from "node:crypto";

type FingerprintRecord = {
  path: string;
  mtimeMs: number;
  size: number;
};

async function collectRecords(root: string, absPath: string): Promise<FingerprintRecord[]> {
  if (!existsSync(absPath)) return [];
  const info = await stat(absPath);
  if (info.isDirectory()) {
    const entries = await readdir(absPath, { withFileTypes: true });
    const records: FingerprintRecord[] = [];
    for (const entry of entries) {
      if (entry.name.startsWith(".")) continue;
      const child = join(absPath, entry.name);
      records.push(...(await collectRecords(root, child)));
    }
    return records;
  }
  return [
    {
      path: relative(root, absPath).replace(/\\/g, "/"),
      mtimeMs: Math.trunc(info.mtimeMs),
      size: info.size,
    },
  ];
}

export async function fingerprintPaths(root: string, paths: string[]): Promise<string> {
  const all: FingerprintRecord[] = [];
  for (const absPath of paths) {
    all.push(...(await collectRecords(root, absPath)));
  }
  all.sort((a, b) => a.path.localeCompare(b.path));
  const hash = createHash("sha256");
  for (const record of all) {
    hash.update(`${record.path}|${record.mtimeMs}|${record.size}\n`);
  }
  return hash.digest("hex");
}
