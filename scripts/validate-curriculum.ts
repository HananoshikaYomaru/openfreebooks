import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

type CatalogFile = {
  curriculums?: unknown;
};

type Chapter = {
  slug?: unknown;
  status?: unknown;
  curriculums?: unknown;
};

type Strand = {
  chapters?: unknown;
};

type GraphEdge = {
  from?: unknown;
  to?: unknown;
};

type CurriculumFile = {
  strands?: unknown;
  graph?: {
    edges?: unknown;
  };
};

type ValidationError = {
  file: string;
  message: string;
};

const ROOT = join(import.meta.dir, "..");
const DATA_DIR = join(ROOT, "data");
const CONTENT_DIR = join(ROOT, "content");

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function chapterRef(strandIndex: number, chapterIndex: number): string {
  return `strands[${strandIndex}].chapters[${chapterIndex}]`;
}

function findCycle(nodes: string[], adjacency: Map<string, string[]>): string[] | null {
  const color = new Map<string, 0 | 1 | 2>();
  const stack: string[] = [];

  for (const node of nodes) {
    color.set(node, 0);
  }

  const visit = (node: string): string[] | null => {
    color.set(node, 1);
    stack.push(node);

    const nextNodes = adjacency.get(node) ?? [];
    for (const nextNode of nextNodes) {
      const nextColor = color.get(nextNode) ?? 0;
      if (nextColor === 0) {
        const cycle = visit(nextNode);
        if (cycle) return cycle;
      } else if (nextColor === 1) {
        const startIndex = stack.indexOf(nextNode);
        if (startIndex >= 0) {
          return [...stack.slice(startIndex), nextNode];
        }
      }
    }

    stack.pop();
    color.set(node, 2);
    return null;
  };

  for (const node of nodes) {
    if ((color.get(node) ?? 0) === 0) {
      const cycle = visit(node);
      if (cycle) return cycle;
    }
  }

  return null;
}

async function readJsonFile<T>(path: string): Promise<T | null> {
  try {
    const raw = await readFile(path, "utf8");
    return JSON.parse(raw) as T;
  } catch (error) {
    console.error(`Failed to parse JSON: ${path}`);
    console.error(error instanceof Error ? error.message : String(error));
    return null;
  }
}

export async function validateCurriculum(): Promise<{
  curriculumFileCount: number;
  errors: ValidationError[];
}> {
  const errors: ValidationError[] = [];

  const catalogPath = join(DATA_DIR, "catalog.json");
  const catalog = await readJsonFile<CatalogFile>(catalogPath);
  if (!catalog || !Array.isArray(catalog.curriculums)) {
    return {
      curriculumFileCount: 0,
      errors: [
        {
          file: "catalog.json",
          message: "Cannot validate curriculums: data/catalog.json must contain a curriculums array.",
        },
      ],
    };
  }

  const globalCurriculums = new Set(
    catalog.curriculums.filter((id): id is string => isNonEmptyString(id))
  );

  const entries = await readdir(DATA_DIR, { withFileTypes: true });
  const curriculumFiles = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith("-curriculum.json"))
    .map((entry) => entry.name)
    .sort();

  for (const fileName of curriculumFiles) {
    const filePath = join(DATA_DIR, fileName);
    const subject = fileName.replace(/-curriculum\.json$/, "");
    const data = await readJsonFile<CurriculumFile>(filePath);

    if (!data) {
      errors.push({ file: fileName, message: "Invalid JSON." });
      continue;
    }

    if (!Array.isArray(data.strands)) {
      errors.push({ file: fileName, message: "Missing strands array." });
      continue;
    }

    const knownChapterIds = new Set<string>();
    const chapterLocations = new Map<string, string[]>();

    data.strands.forEach((strand, strandIndex) => {
      const typedStrand = strand as Strand;
      if (!Array.isArray(typedStrand.chapters)) {
        errors.push({
          file: fileName,
          message: `strands[${strandIndex}].chapters must be an array.`,
        });
        return;
      }

      typedStrand.chapters.forEach((chapter, chapterIndex) => {
        const typedChapter = chapter as Chapter;
        const ref = chapterRef(strandIndex, chapterIndex);

        if (!isNonEmptyString(typedChapter.slug)) {
          errors.push({
            file: fileName,
            message: `${ref}.slug is required and must be a non-empty string.`,
          });
          return;
        }

        const slug = typedChapter.slug;
        knownChapterIds.add(slug);
        chapterLocations.set(slug, [...(chapterLocations.get(slug) ?? []), ref]);

        if (typedChapter.curriculums !== undefined) {
          if (!Array.isArray(typedChapter.curriculums)) {
            errors.push({
              file: fileName,
              message: `${ref}.curriculums must be an array of curriculum ids when present.`,
            });
          } else {
            for (const curriculumId of typedChapter.curriculums) {
              if (!isNonEmptyString(curriculumId)) {
                errors.push({
                  file: fileName,
                  message: `${ref}.curriculums contains a non-string value.`,
                });
                continue;
              }

              if (!globalCurriculums.has(curriculumId)) {
                errors.push({
                  file: fileName,
                  message: `${ref}.curriculums includes "${curriculumId}", which is not in data/catalog.json curriculums.`,
                });
              }
            }
          }
        }

        if (typedChapter.status === "live") {
          const chapterIndexPath = join(CONTENT_DIR, subject, slug, "_index.md");
          if (!existsSync(chapterIndexPath)) {
            errors.push({
              file: fileName,
              message: `${ref} is live but missing content/${subject}/${slug}/_index.md.`,
            });
          }
        }
      });
    });

    for (const [slug, locations] of chapterLocations) {
      if (locations.length > 1) {
        errors.push({
          file: fileName,
          message: `Duplicate chapter slug "${slug}" found at ${locations.join(", ")}. Slugs must be unique within a subject curriculum file.`,
        });
      }
    }

    const rawEdges = data.graph?.edges;
    if (rawEdges !== undefined && !Array.isArray(rawEdges)) {
      errors.push({ file: fileName, message: "graph.edges must be an array when present." });
      continue;
    }

    const adjacency = new Map<string, string[]>();
    for (const chapterId of knownChapterIds) {
      adjacency.set(chapterId, []);
    }

    if (Array.isArray(rawEdges)) {
      rawEdges.forEach((edge, edgeIndex) => {
        const typedEdge = edge as GraphEdge;
        const edgeRef = `graph.edges[${edgeIndex}]`;

        if (!isNonEmptyString(typedEdge.from) || !isNonEmptyString(typedEdge.to)) {
          errors.push({
            file: fileName,
            message: `${edgeRef} must contain non-empty string "from" and "to" chapter ids.`,
          });
          return;
        }

        const from = typedEdge.from;
        const to = typedEdge.to;

        if (!knownChapterIds.has(from)) {
          errors.push({
            file: fileName,
            message: `${edgeRef}.from "${from}" does not match any chapter slug in this file.`,
          });
        }
        if (!knownChapterIds.has(to)) {
          errors.push({
            file: fileName,
            message: `${edgeRef}.to "${to}" does not match any chapter slug in this file.`,
          });
        }

        if (knownChapterIds.has(from) && knownChapterIds.has(to)) {
          adjacency.set(from, [...(adjacency.get(from) ?? []), to]);
        }
      });
    }

    const cycle = findCycle([...knownChapterIds], adjacency);
    if (cycle) {
      errors.push({
        file: fileName,
        message: `graph.edges must be acyclic. Found cycle: ${cycle.join(" -> ")}.`,
      });
    }
  }

  return { curriculumFileCount: curriculumFiles.length, errors };
}

async function main() {
  const result = await validateCurriculum();
  if (result.errors.length > 0) {
    console.error(`\n✖ Curriculum validation failed with ${result.errors.length} error(s):`);
    for (const error of result.errors) {
      console.error(`- [${error.file}] ${error.message}`);
    }
    process.exit(1);
  }
  console.log(`✓ Curriculum validation passed for ${result.curriculumFileCount} curriculum file(s).`);
}

if (import.meta.main) {
  void main();
}
