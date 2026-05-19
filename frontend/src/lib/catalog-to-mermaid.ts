import type { CatalogChapter, CatalogGraphEdge, CatalogSubject } from "../../../data/catalog.types";
import { curriculumBadgeClass, tierBadgeLabel } from "./catalog-badge";

export type MermaidCatalogDiagram = {
  source: string;
  rootNodeId: string | null;
};

function collectVisibleChapters(
  subject: CatalogSubject,
  matches: (chapter: CatalogChapter) => boolean
): Map<string, CatalogChapter> {
  const visible = new Map<string, CatalogChapter>();
  for (const strand of subject.strands) {
    for (const chapter of strand.chapters) {
      if (matches(chapter)) {
        visible.set(chapter.slug, chapter);
      }
    }
  }
  return visible;
}

function buildEdgeList(
  subject: CatalogSubject,
  visible: Map<string, CatalogChapter>
): CatalogGraphEdge[] {
  const dedup = new Set<string>();
  const edges: CatalogGraphEdge[] = [];
  for (const edge of subject.graph?.edges ?? []) {
    if (!visible.has(edge.from) || !visible.has(edge.to)) continue;
    const key = `${edge.from}->${edge.to}`;
    if (dedup.has(key)) continue;
    dedup.add(key);
    edges.push(edge);
  }
  return edges;
}

function escapeLabel(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function nodeId(slug: string): string {
  return `chapter_${slug.replaceAll(/[^a-zA-Z0-9_]/g, "_")}`;
}

function classListNodeIds(
  visible: Map<string, CatalogChapter>,
  status: CatalogChapter["status"]
): string[] {
  const ids: string[] = [];
  for (const [slug, chapter] of visible) {
    if (chapter.status === status) {
      ids.push(nodeId(slug));
    }
  }
  return ids;
}

function selectRootSlug(
  subject: CatalogSubject,
  visible: Map<string, CatalogChapter>,
  edges: CatalogGraphEdge[]
): string | null {
  const indegree = new Map<string, number>();
  for (const slug of visible.keys()) {
    indegree.set(slug, 0);
  }
  for (const edge of edges) {
    indegree.set(edge.to, (indegree.get(edge.to) ?? 0) + 1);
  }

  const rootCandidates = new Set<string>();
  for (const [slug, degree] of indegree) {
    if (degree === 0) {
      rootCandidates.add(slug);
    }
  }

  for (const strand of subject.strands) {
    for (const chapter of strand.chapters) {
      if (rootCandidates.has(chapter.slug)) {
        return chapter.slug;
      }
    }
  }

  return visible.keys().next().value ?? null;
}

function chapterNodeLabel(chapter: CatalogChapter): string {
  const title = `<h3 class='catalog-mermaid-node__title'>${escapeLabel(chapter.title)}</h3>`;
  const description = chapter.description
    ? `<p class='catalog-mermaid-node__description'>${escapeLabel(chapter.description)}</p>`
    : "";
  const curriculumBadges = chapter.curriculums
    .map(
      (curriculum) =>
        `<span class='catalog-badge ${curriculumBadgeClass(curriculum)}'>${escapeLabel(curriculum)}</span>`
    )
    .join("");
  const tier = tierBadgeLabel(chapter.tier);
  const tierBadge = tier
    ? `<span class='catalog-badge catalog-badge--extension'>${escapeLabel(tier)}</span>`
    : "";
  const planned =
    chapter.status === "planned"
      ? "<span class='book-chapter-badge book-chapter-badge--planned'>Coming soon</span>"
      : "";
  const meta = `<div class='catalog-mermaid-node__meta'>${curriculumBadges}${tierBadge}${planned}</div>`;
  return `<div class='catalog-mermaid-node'>${title}${description}${meta}</div>`;
}

export function subjectToMermaid(
  subject: CatalogSubject,
  matches: (chapter: CatalogChapter) => boolean,
  subjectId: string
): MermaidCatalogDiagram | null {
  const visible = collectVisibleChapters(subject, matches);
  if (visible.size === 0) return null;

  const edges = buildEdgeList(subject, visible);
  const rootSlug = selectRootSlug(subject, visible, edges);
  const lines: string[] = ["flowchart TB"];

  for (const strand of subject.strands) {
    const strandChapters = strand.chapters.filter((chapter) => visible.has(chapter.slug));
    if (strandChapters.length === 0) continue;

    lines.push(`  subgraph strand_${strand.id.replaceAll(/[^a-zA-Z0-9_]/g, "_")}["${escapeLabel(strand.title)}"]`);
    lines.push("    direction TB");
    for (const chapter of strandChapters) {
      const id = nodeId(chapter.slug);
      const label = chapterNodeLabel(chapter);
      lines.push(`    ${id}["${label}"]`);
    }
    lines.push("  end");
  }

  for (const edge of edges) {
    const from = nodeId(edge.from);
    const to = nodeId(edge.to);
    const withLabel = edge.label ? `|${escapeLabel(edge.label)}|` : "";
    lines.push(`  ${from} -->${withLabel} ${to}`);
  }

  for (const [slug, chapter] of visible) {
    if (chapter.status !== "live") continue;
    lines.push(`  click ${nodeId(slug)} href "/${subjectId}/${slug}/"`);
  }

  const liveIds = classListNodeIds(visible, "live");
  const plannedIds = classListNodeIds(visible, "planned");
  if (liveIds.length) {
    lines.push(`  class ${liveIds.join(",")} liveNode`);
  }
  if (plannedIds.length) {
    lines.push(`  class ${plannedIds.join(",")} plannedNode`);
  }
  lines.push("  classDef liveNode stroke-width:2px;");
  lines.push("  classDef plannedNode stroke-dasharray: 5 3;");

  return {
    source: lines.join("\n"),
    rootNodeId: rootSlug ? nodeId(rootSlug) : null,
  };
}
